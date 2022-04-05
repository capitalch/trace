allSqls = {
    "create_branch": '''
        insert into "BranchM" ("id", "branchCode", "branchName")
	        values((select MAX("id") + 1 from "BranchM")
                , %(branchCode)s, %(branchName)s)
                    returning "id"
    ''',

    "get_accountsMaster": '''
        select a.*, "accClass"
            from "AccM" a
                join "AccClassM" c
                    on c."id" = a."classId"
                        order by a."id"
    ''',

    "get_accountsBalances": '''
        with cte1 as 
            (select "accId", CASE WHEN "dc" = 'D' then SUM("amount") ELSE SUM(-"amount") END as "amount"
                from "TranD"  d
                    join "TranH" h
                        on h."id" = d."tranHeaderId"
                    where "branchId" = %(branchId)s and "finYearId" = %(finYearId)s and "accId" in %(accIds)s
                        GROUP BY "accId", "dc"
                        union 
                    select "accId", CASE WHEN "dc" ='D' then "amount" ELSE (-"amount") END as "amount"
                    from "AccOpBal" 
                        where "branchId" = %(branchId)s and "finYearId" = %(finYearId)s and "accId" in %(accIds)s) 
            select "accId", SUM("amount") as "amount"
                from cte1 group BY "accId"
    ''',

    "get_accountsLedger": '''
            with cte as(
            select "accName" from "AccM"
                where "id" = %(id)s
        ), cte1 as (
            select
            CASE WHEN "dc" = 'D' then "amount" ELSE 0.00 END as "debit"
            , CASE WHEN "dc" = 'C' then "amount" ELSE 0.00 END as "credit"
            , "dc"
            from "AccM" a
                join "AccOpBal" b
                    on a."id" = b."accId"
            where a."id" = %(id)s
                 and "finYearId" = %(finYearId)s and "branchId" = %(branchId)s
        ), cte2 as(
            select
            CASE WHEN "dc" = 'D' then "amount" ELSE 0.00 END as "debit"
            , CASE WHEN "dc" = 'C' then "amount" ELSE 0.00 END as "credit"
            , "dc"
            , "tranDate"
            , "tranTypeId"
            , "userRefNo"
            , h."remarks"
            , (select "tranType" from "TranTypeM" where "id" = h."tranTypeId") as "tranType"
            , (select string_agg(distinct "accName",', ') 
				from "TranD" t1
					join "AccM" a1
						on a1."id" = t1."accId"
					where h."id" = t1."tranHeaderId" 
						and "dc" <> t."dc") as "otherAccounts" 
            , "autoRefNo"
            , "accName"
            , t."remarks" as "lineRemarks"
            , "lineRefNo"
            , "instrNo"
            , h."id" --as "headerId"
            from "AccM" a
                join "TranD" as t
                    on a."id" = t."accId"
                join "TranH" as h
                    on t."tranHeaderId" = h."id"
            where a."id" = %(id)s
					and "finYearId" = %(finYearId)s and "branchId" = %(branchId)s
                order by "tranDate", t."id"
        ), cte3 as (
            select "debit", "credit" from cte1
                union all
            select "debit", "credit" from cte2
        ), cte4 as (
            select SUM("debit") as "debit", SUM("credit") as "credit"
                from cte3
        )
        SELECT
            json_build_object(
                'accName', (SELECT "accName" FROM cte a)
                , 'opBalance', (SELECT row_to_json(b) FROM cte1 b)
                , 'transactions',(SELECT json_agg(row_to_json(c)) FROM cte2 c)
                , 'sum', (SELECT json_agg(row_to_json(d)) from cte4 d)
            ) as "jsonResult"
    ''',

    'get_allBanks': '''
        select a."id", "accName"
            from "AccM" a 
                join "AccClassM" c
                    on c."id" = a."classId"			
        where "accClass" = 'bank'
            and "accLeaf" in ('Y', 'S')
    ''',

    'get_all_debit_credit_notes': '''
        with cte1 as (
            select h."id", "tranDate", "autoRefNo", "userRefNo", "amount", h."remarks",
                "lineRefNo", d."remarks" as "lineRemarks",
                CASE WHEN "dc" = 'D' then "accName" else null END as "debitAccount",
                CASE WHEN "dc" = 'C' then "accName" else null END as "creditAccount"
                from "TranH" h
                    join "TranD" d
                        on h."id" = d."tranHeaderId" 
                    join "AccM" a
                        on a."id" = d."accId"
            where "tranTypeId" = %(tranTypeId)s
            ) select "id", "tranDate", "autoRefNo", "userRefNo", MAX("amount") as "amount", "remarks",
                STRING_AGG(DISTINCT "debitAccount", '') as "debitAccount",
                STRING_AGG(DISTINCT "creditAccount", '') as "creditAccount",
                STRING_AGG("lineRefNo", ',') as "lineRefNo",
                STRING_AGG("lineRemarks", ',') as "lineRemarks"
                from cte1
                    group by "id", "tranDate", "autoRefNo", "userRefNo", "remarks"
                    order by "id" DESC limit %(no)s
    ''',

    'get_allTransactions': '''
        select ROW_NUMBER() over (order by "tranDate" DESC , h."id" DESC, d."id" DESC) as "index"
            , h."id", h."tranDate" as "tranDate"
            , "tranTypeId"
            , h."autoRefNo", h."userRefNo", h."remarks"
            , a."accName"
            , CASE WHEN "dc" = 'D' THEN "amount" ELSE 0.00 END as "debit"
            , CASE WHEN "dc" = 'C' THEN "amount" ELSE 0.00 END as "credit"
            , d."instrNo", d."lineRefNo", d."remarks" as "lineRemarks"
            , h."tags"
            from "TranD" d
                join "TranH" h
                    on h."id" = d."tranHeaderId"
                join "AccM" a
                    on a."id" = d."accId"
            where "finYearId" = %(finYearId)s and "branchId" = %(branchId)s
            order by "tranDate" DESC, h."id" DESC, d."id" DESC limit (%(no)s)
    ''',

    'get_allTransactions1': '''
        select ROW_NUMBER() over (order by h."id" DESC) as "index"
            , h."id", to_char(h."tranDate", %(dateFormat)s) as "tranDate"
            , h."autoRefNo", h."userRefNo", h."remarks"
            , a."accName"
            , CASE WHEN "dc" = 'D' THEN "amount" ELSE 0.00 END as "debit"
            , CASE WHEN "dc" = 'C' THEN "amount" ELSE 0.00 END as "credit"
            , d."instrNo", d."lineRefNo", d."remarks" as "lineRemarks"
            , h."tags"
            from "TranD" d
                join "TranH" h
                    on h."id" = d."tranHeaderId"
                join "AccM" a
                    on a."id" = d."accId"
            where "finYearId" = %(finYearId)s and "branchId" = %(branchId)s
            order by "tranDate" DESC, h."id" limit (%(no)s)
    ''',

    'get_allTransactions_download': '''
        select ROW_NUMBER() over (order by h."id") as "index"
            , h."id", to_char(h."tranDate", %(dateFormat)s) as "tranDate"
            , h."autoRefNo", h."userRefNo", h."finYearId", h."branchId", h."remarks", h."userRefNo", h."timestamp"::text
            , a."accName"
            , CASE WHEN "dc" = 'D' THEN "amount" ELSE 0.00 END as "debit"
            , CASE WHEN "dc" = 'C' THEN "amount" ELSE 0.00 END as "credit"
            , d."instrNo", d."lineRefNo", d."remarks" as "lineRemarks"
            from "TranD" d
                join "TranH" h
                    on h."id" = d."tranHeaderId"
                join "AccM" a
                    on a."id" = d."accId"
            where "finYearId" = %(finYearId)s and "branchId" = %(branchId)s
            order by "id"
    ''',

    'get_auto_subledgers': '''
        select a."id", "accCode", "accName", e."isAutoSubledger" --, x.*
            from "AccM" a
                join "AccClassM" c
                    on c."id" = a."classId"
                left outer join "ExtMiscAccM" e
                    on a."id" = e."accId"
                --left outer join "ExtBusinessContactsAccM" x
                --    on a."id" = x."accId"
                where "accClass" = 'debtor'
                    and "accLeaf"  =  'L'
                    and (e."isAutoSubledger" = true)
                order by c."accClass" DESC, a."accName" ASC, a."id" ASC
    ''',

    'get_auto_ref_no': '''        
        with cte1 as (
            select "tranCode" 
                from "TranTypeM"
                    where "id" = %(tranTypeId)s
        ),
        cte2 as (
            select "branchCode"
                from "BranchM"
                    where "id" = %(branchId)s
        ),
        cte3 as (
            select "lastNo"
                    from "TranCounter"
                        where "finYearId" = %(finYearId)s and
                                    "branchId" = %(branchId)s and "tranTypeId" = %(tranTypeId)s
        ),
        cte4 as (
            select (select "branchCode" from cte2) || '\\' || (select "tranCode" from cte1) || '\\' || (select "lastNo" from cte3) ||
            '\\' || (select %(finYearId)s)
                as "autoRefNo"
        )

        select (select "autoRefNo" from cte4) as "autoRefNo", (select "lastNo" from cte3) as "lastNo"
    ''',

    'get_balanceSheetProfitLoss': ''' -- Fin
        with cte1 as (
            with RECURSIVE cte as (
                select m."id", m."accName",m."accType", m."parentId", m."accLeaf", CASE WHEN "dc" = 'D' then t."amount" else -t."amount" end as "amount"
                    from "TranD" t
                        join "AccM" m
                            on t."accId" = m."id"
						join "TranH" h
							on h."id" = t."tranHeaderId"
					where "finYearId" = %(finYearId)s and "branchId" = %(branchId)s
                union all
                    select m."id", m."accName", m."accType", m."parentId", m."accLeaf", CASE WHEN "dc" = 'D' then p."amount" else -p."amount" end as "amount"
                        from "AccOpBal" p
                            join "AccM" m
                                on p."accId" = m."id"
                    where "finYearId" = %(finYearId)s and "branchId" = %(branchId)s
                union all
                    select a.id,a."accName", a."accType", a."parentId", a."accLeaf", ( cte."amount") as "amount"
                        from "AccM" a join cte on
                            cte."parentId" = a.id),

                cteTemp as (select id, "accName", "accType", "parentId","accLeaf", sum(amount ) as "amount"
                    from cte 
                        group by id, "accName", "accType", "parentId", "accLeaf"
                            order by cte.id)

                select "id", "accName","accType", "parentId", "accLeaf", "amount", 
                    (select array_agg(id) from cteTemp where "parentId" = a."id") as children 
                from cteTemp as a
        ), cte2 as (
            with cte as
                (select "accType", SUM(CASE WHEN "dc" = 'D' then t."amount" else -t."amount" end) as "amount"
                    from "AccM" a
                        join "TranD" t
                            on a."id" = t."accId"                                
				 		join "TranH" h
				 			on h."id" = t."tranHeaderId"				 				
				 	where "finYearId" = %(finYearId)s and "branchId" = %(branchId)s
                        group by "accType"
                union 
                    select "accType", SUM(CASE WHEN "dc" = 'D' then p."amount" else -p."amount" end) as amount
                        from "AccM" a
                            join "AccOpBal" p
                                on a."id" = p."accId"
                        where "finYearId" = %(finYearId)s and "branchId" = %(branchId)s
                            group by "accType")

                select SUM("amount") as "profitOrLoss" from cte where "accType" in ('A', 'L')
        ), cte3 as (
            with cte as
                (select "accType", SUM(CASE WHEN "dc" = 'D' then t."amount" else -t."amount" end) as "amount"
                    from "AccM" a
                        join "TranD" t
                            on a."id" = t."accId"
				 		join "TranH" h
				 			on h."id" = t."tranHeaderId"
				 	where "finYearId" = %(finYearId)s and "branchId" = %(branchId)s
                    	group by "accType"
                union 
                    select "accType", SUM(CASE WHEN "dc" = 'D' then p."amount" else -p."amount" end) as amount
                        from "AccM" a
                            join "AccOpBal" p
                                on a."id" = p."accId"
				 		where "finYearId" = %(finYearId)s and "branchId" = %(branchId)s
							group by "accType")

                select "accType", SUM("amount") as amount 
                    from cte 
                        group by "accType"
                            order by "accType"
        ) SELECT
            json_build_object(
                'balanceSheetProfitLoss', (SELECT json_agg(row_to_json(a)) from cte1 a)
                , 'profitOrLoss', (SELECT "profitOrLoss" FROM cte2 b)
                , 'aggregates',(SELECT json_agg(row_to_json(c)) FROM cte3 c)
            ) as "jsonResult"
    ''',

    "get_bank_op_balance": '''
        select "id", "amount", "dc"
            from "BankOpBal"
                where "accId" = %(accId)s
                    and "finYearId" = %(finYearId)s
    ''',

    "get_brands": '''
        select  ROW_NUMBER() over(order by "brandName") as "index", "id", "brandName", "remarks"
	        from "BrandM" order by "brandName"
    ''',

    "get_branches": '''
    select "id", "branchCode", "branchName", "remarks"
        from "BranchM"
            order by "id"
    ''',

    'get_businessContact_for_contactCode': '''
    select * from "ExtBusinessContactsAccM"
        where LOWER("contactCode") like '%%' || LOWER(%(companyCode)s) || '%%'
    ''',

    'get_businessContact_for_contactName': '''
    select * from "ExtBusinessContactsAccM"
        where LOWER("contactName") like '%%' || LOWER(%(companyName)s) || '%%'
    ''',

    'get_cash_bank': '''
        select a."id", "accCode", "accName", c."accClass"
            from "AccM" a
                join "AccClassM" c
                    on a."classId" = c."id"
                where "accClass" in ('cash', 'bank', 'card','ecash')
                    and "accLeaf" in ('Y', 'S')
                order by c."accClass" DESC, a."accName" ASC, a."id" ASC
    ''',

    'get_contact_for_contactName': '''
        select * from "Contacts"
	        where LOWER("contactName") like  '%%' || LOWER(%(contactName)s) || '%%'
    ''',

    'get_contact_for_email': '''
        select * from "Contacts"
	        where "email" = %(email)s limit 1
    ''',

    'get_contact_for_mobile': '''
        select * from "Contacts"
	        where "mobileNumber" = %(mobileNumber)s limit 1
    ''',

    # 'get_contact_on_mobile_email_contactName1': '''
    #     select * from "Contacts"
    #         where "mobileNumber" = %(searchString)s
    #             or "otherMobileNumber" like '%%' || %(searchString)s || '%%'
    #             or LOWER("email") like '%%' || LOWER(%(searchString)s) || '%%'
    #             or LOWER("contactName") like  '%%' || LOWER(%(searchString)s) || '%%'
    #             order by "contactName"
    #             limit 100
    # ''',

    'get_contact_on_mobile_email_contactName': '''
        select * from "Contacts"
            where "mobileNumber" ~* %(searchString)s
                or "otherMobileNumber" ~*  %(searchString)s
                or "email" ~* %(searchString)s
                or "contactName" ~*  %(searchString)s
                order by "contactName"
                limit 100
    ''',

    'get_debtors_creditors': '''
       select a."id", "accCode", "accName", e."isAutoSubledger", c."accClass", "gstin"
		from "AccM" a
			join "AccClassM" c
				on a."classId" = c."id"
			left outer join "ExtMiscAccM" e
				on a."id" = e."accId"
			left outer join "ExtBusinessContactsAccM" x
				on a."id" = x."accId"
			where "accClass" in ('debtor', 'creditor')
				and "accLeaf" in ('Y', 'S')
				and ((e."isAutoSubledger" is null ) or (e."isAutoSubledger" = false))
			order by a."accName", c."accClass" DESC, a."id" ASC
    ''',

    'get_extBusinessContactsAccM': '''
    select * 
	    from "ExtBusinessContactsAccM"
		    where "id" = %(id)s
    ''',

    'get_extBusinessContactsAccM_on_accId': '''
    select * 
	    from "ExtBusinessContactsAccM"
		    where "accId" = %(id)s
    ''',

    "get_finYears": '''
        select "id", "startDate", "endDate"
                from "FinYearM" order by "id" DESC
    ''',

    "get_finYearDates": '''
        select "startDate", "endDate"
            from "FinYearM"
                where "id" = %(finYearId)s
    ''',

    "get_generalSettings": '''
        select "jData"
            from "Settings"
                where "key" = 'generalSettings'
    ''',

    "get_gst_header_report": '''
        select h."id" as "headerId", "autoRefNo", "tranDate", "userRefNo", h."remarks",
            d."id" as "detailsId", "accId", "accName", "dc", "lineRefNo", d."remarks" as "lineRemarks",
			"gstin",
            CASE WHEN "isInput" THEN d."amount" ELSE -d."amount" END as "amount", 
			CASE WHEN "isInput" THEN "cgst" ELSE -"cgst" END as "cgst",
			CASE WHEN "isInput" THEN "sgst" else - "sgst" END as "sgst",
			CASE WHEN "isInput" THEN "igst" else - "igst" END as "igst", "isInput"

        from "TranH" h
            join "TranD" d
                on h."id" = d."tranHeaderId"
            join "ExtGstTranD" e
                on d."id" = e."tranDetailsId"
            join "AccM" a
                on a."id" = d."accId"
        where
            ("cgst" <> 0 or
            "sgst" <> 0 or
            "igst" <> 0) and
            "finYearId" = %(finYearId)s and
            "branchId" = %(branchId)s and
            ("tranDate" between %(startDate)s and %(endDate)s)
        
        order by "tranDate"
    ''',

    "get_gstin": '''
        select "gstin"
            from "AccM" a
                join "ExtBusinessContactsAccM" b
                    on a."id" = b."accId"
            where a."id" = %(id)s
    ''',

    "get_lastNo": '''
        insert into "TranCounter" ("finYearId", "branchId", "tranTypeId", "lastNo")
            select %(finYearId)s, %(branchId)s, %(tranTypeId)s, 0
                where not exists (select 1 from "TranCounter" where "finYearId" = %(finYearId)s and
					"branchId" = %(branchId)s and "tranTypeId" = %(tranTypeId)s );
        select "lastNo"
            from "TranCounter"
                where "finYearId" = %(finYearId)s and
                            "branchId" = %(branchId)s and "tranTypeId" = %(tranTypeId)s 
    ''',

    "get_lastNo_auto_subledger": '''
    insert into "AutoSubledgerCounter" ("finYearId", "branchId", "accId", "lastNo")
            select %(finYearId)s, %(branchId)s, %(accId)s, 0
                where not exists (select 1 from "AutoSubledgerCounter" where "finYearId" = %(finYearId)s and
					"branchId" = %(branchId)s and "accId" = %(accId)s );
        select "lastNo", "accType", a."classId", c."accClass"
            from "AutoSubledgerCounter" d
                join "AccM" a
                    on a."id" = d."accId"
                join "AccClassM" c
                    on c."id" = a."classId"
                where "finYearId" = %(finYearId)s and
                            "branchId" = %(branchId)s and "accId" = %(accId)s
    
    ''',

    # This method is working. it's for academic purpose. At present client side tree populating is done. This method populates the entire tree from child values
    "get_opBal1": '''
        with recursive cte as (
			select "accMId", id, "opId", "accType", "accLeaf", "accName", "parentId", "debit", "credit", "children"
				from cte3
					where "opId" is not null
			union all
			select c."accMId", c.id, c."opId", c."accType", c."accLeaf", c."accName", c."parentId", c."debit" + cte."debit" as "debit", c."credit" + cte."credit" as "credit", c."children"
				from cte3 c join cte
					on cte."parentId" = c.id
		), 

	    cte1 as (
			select a."id", "accCode", "accName", "parentId", "accType", "isPrimary", "accLeaf","classId"
			, (select array_agg(id) from "AccM" m where a."id" = m."parentId" ) as "children"
				from "AccM" a 
					where "accType" in ('A', 'L')
						order by "accType", "accName", a."id"
			),
        cte2 as (
            select "id" as "opId", "accId", "amount", "dc", "branchId"
                from "AccOpBal"
                    where "finYearId" = %(finYearId)s
                        and "branchId" = %(branchId)s
		),
		cte3 as (
			select a."id" as "accMId", a."id", b."opId", "accType", "accLeaf", "accName"
				, "parentId"
				, CASE WHEN dc='D' then "amount" else 0  END as "debit"
				, CASE WHEN dc='C' then "amount" else 0 end as "credit"
				, "children"
				from cte1 a
					left outer join cte2 b
						on a."id" = b."accId"                                                           
								order by "accType","accLeaf", "accName" )
								
		 select c3."accMId", c3.id, c3."opId", c3."accType", c3."accLeaf", c3."accName", c3."parentId", c3."children" , COALESCE(SUM(c."debit"),0) as "debit", COALESCE(SUM(c."credit"),0) as "credit" 
		 	from cte3 c3 left outer join cte c
					on c3.id = c.id
		 		group by c3."accMId", c3.id, c3."opId", c3."accType", c3."accLeaf", c3."accName", c3."parentId", c3."children"
		 			order by id
    ''',

    "get_opBal": '''
        with cte1 as (
                select a."id", "accCode", "accName", "parentId", "accType", "isPrimary", "accLeaf","classId"
                , (select array_agg(id) from "AccM" m where a."id" = m."parentId" ) as "children"
                    from "AccM" a 
                        where "accType" in ('A', 'L')
                            order by "accType", "accName", a."id"
                ),
        cte2 as (
            select "id" as "opId", "accId", "amount", "dc", "branchId"
                from "AccOpBal"
                    where "finYearId" = %(finYearId)s
                        and "branchId" = %(branchId)s)
        select a."id" as "accMId", a."id", b."opId", "accType", "accLeaf", "accName"
            , "parentId"
            , CASE WHEN dc='D' then "amount" else 0  END as "debit"
            , CASE WHEN dc='C' then "amount" else 0 end as "credit"
            , "children"
            from cte1 a
                left outer join cte2 b
                    on a."id" = b."accId"                                                           
                            order by "accType","accLeaf", "accName" ''',

    "get_pdf_sale_bill": '''
        select "jData"->'pdfSaleBill' as "pdfSaleBill"
            from "TranH"
                where "id" = %(id)s
    ''',

    "get_product_on_upc_code": '''
        select p."id", 
            "catName", "isActive","brandName",             
            "salePriceGst", "saleDiscount", "saleDiscountRate", 
            "purPrice", "purDiscount", "purDiscountRate",            
            CASE WHEN p."hsn" is null THEN c."hsn" ELSE p."hsn" END, "info", "label", "productCode", "upcCode", "gstRate"
            from "ProductM" p
                join "CategoryM" c
                    on c."id" = p."catId"
                join "BrandM" b
                    on b."id" = p."brandId"
	    where p."upcCode" = %(upcCode)s
    ''',

    "get_product_on_product_code": '''
        select p."id", 
            "catName", "isActive","brandName",             
            "salePriceGst", "saleDiscount", "saleDiscountRate", 
            "purPrice", "purDiscount", "purDiscountRate",            
            CASE WHEN p."hsn" is null THEN c."hsn" ELSE p."hsn" END, "info", "label", "productCode", "upcCode", "gstRate"
            from "ProductM" p
                join "CategoryM" c
                    on c."id" = p."catId"
                join "BrandM" b
                    on b."id" = p."brandId"
        where p."productCode" = %(productCode)s
    ''',

    "get_products": '''
        select ROW_NUMBER() over(order by "catName", "brandName", "label") as "index", p."id"  as "id" , c."id" as "catId", u."id" as "unitId", b."id" as "brandId",
        "catName", p."hsn", "brandName", "info", "unitName", "label", p."jData", "productCode","gstRate", "upcCode",
        "maxRetailPrice", "salePrice", "salePriceGst", "dealerPrice", "purPrice", "purPriceGst"
        from "ProductM" p
            join "CategoryM" c
                on c."id" = p."catId"
            join "UnitM" u
                on u."id" = p."unitId"
            join "BrandM" b
                on b."id" = p."brandId"
            order by "catName", "brandName", "label" 
            limit (%(no)s)
    ''',
    "get_purchase_report":'''
        select "autoRefNo", "userRefNo", "tranDate", s."productId", "productCode", "catName", "brandName","label", "tranTypeId", "price", "discount", s."gstRate"
			, s."id" as "salePurchaseDetailsId"
            , CASE WHEN "tranTypeId" = 5 THEN 'Purchase' ELSE 'Return' END as "purchaseType"
			, CASE WHEN "tranTypeId" = 5 THEN "qty"*("price" - "discount") ELSE -"qty"*("price" - "discount") END as "aggrPurchase"
			, CASE WHEN "tranTypeId" = 5 THEN "qty" ELSE -"qty" END as "qty"
			, CASE WHEN "tranTypeId" = 5 THEN "cgst" ELSE -"cgst" END as "cgst"
			, CASE WHEN "tranTypeId" = 5 THEN "sgst" ELSE -"sgst" END as "sgst"
			, CASE WHEN "tranTypeId" = 5 THEN "igst" ELSE -"igst" END as "igst"
			, CASE WHEN "tranTypeId" = 5 THEN s."amount" ELSE -s."amount" END as "amount"
			, (	select DISTINCT  "accName" 
					from "AccM" a
						join "AccClassM" m
							on m."id" = a."classId"
						join "TranD" t
							on a."id" = t."accId"
					where t."tranHeaderId" = h."id"
						and "accClass" in ('creditor', 'debtor', 'cash', 'bank', 'card', 'ecash')
			) as "party"
        from "TranH" h
            join "TranD" d
                on h."id" = d."tranHeaderId"
            join "SalePurchaseDetails" s
                on d."id" = s."tranDetailsId"
            join "ProductM" p
                on p."id" = s."productId"
            join "CategoryM" c
                on c."id" = p."catId"
            join "BrandM" b
                on b."id" = p."brandId"
            where "branchId" = %(branchId)s and "finYearId" = %(finYearId)s
            --where "branchId" = 1 and "finYearId" = 2021
            and "tranDate" between %(startDate)s and %(endDate)s
            and "tranTypeId" in(5,10)
            order by "tranDate", "salePurchaseDetailsId"
    ''',
    "get_sale_purchase_headers": '''
        with cte1 as (
            select h."id", string_agg("accName",', ') as "accounts", "clearDate"
                from "TranH" h		
                    join "TranD" d
                        on h."id" = d."tranHeaderId" 
                    join "AccM" a
                        on a."id" = d."accId"
                    left outer join "ExtBankReconTranD" b
						on d."id" = b."tranDetailsId"
                    where "tranTypeId" = %(tranTypeId)s
                        and "dc" <> %(tranDc)s
                        and "accId"::text ILIKE %(accId)s
                        and "finYearId" = %(finYearId)s
                        and "branchId" = %(branchId)s
                group by h."id", "clearDate"
        ),
        cte2 as (
            select h."id", "autoRefNo", "tranDate", "userRefNo", h."remarks", 
                d."amount" , string_agg("label", ' ,') as "labels", 
                string_agg(s."jData"->>'serialNumbers', ' ,') as "serialNumbers",
                SUM(s."qty" * (s."price" - s."discount")) as "aggr", SUM(s."cgst") as "cgst",
                SUM(s."sgst") as "sgst", SUM(s."igst") as "igst"
                from "TranH" h			
                    join "TranD" d
                        on "h"."id" = d."tranHeaderId" 
                    join "SalePurchaseDetails" s
                        on d."id" = s."tranDetailsId"
                    join "ProductM" p
                        on p."id" = s."productId"		
                where "tranTypeId" = %(tranTypeId)s
                    and "dc" = %(tranDc)s
                    and "finYearId" = %(finYearId)s
                    and "branchId" = %(branchId)s
                group by h."id", "autoRefNo", "tranDate", "userRefNo", h."remarks", 
                    d."amount"
            )
					
        select  cte1."id",cte1."accounts", cte1."clearDate", cte2.* 
            from cte1
                join cte2
                    on cte1."id" = cte2."id"
                order by "tranDate" DESC, cte1."id" DESC LIMIT %(no)s
    ''',

    "get_sale_report": '''
        with cte0 as( --base cte used many times in next
        select "tranDate", s."productId", "tranTypeId", "qty", "price", "discount", "cgst", "sgst","igst"
            , s."amount", "gstRate", s."id" as "salePurchaseDetailsId", "autoRefNo"
            from "TranH" h
                join "TranD" d
                    on h."id" = d."tranHeaderId"
                join "SalePurchaseDetails" s
                    on d."id" = s."tranDetailsId"
                where "branchId" = %(branchId)s and "finYearId" = %(finYearId)s
                --where "branchId" = 1 and "finYearId" = 2021
                and "tranDate" <= %(endDate)s
        ), cte1 as ( -- opening balance
            select "productId", "openingPrice"
                from "ProductOpBal" p 
                where "branchId" = %(branchId)s and "finYearId" = %(finYearId)s
                --where "branchId" = 1 and "finYearId" = 2021
        ), cte2 as( -- compute last purchase price till sale date
        select "tranDate", "productId",	"qty", "price", "tranTypeId", "salePurchaseDetailsId", (
            select ("price" - "discount") 
                from cte0
                    where "tranTypeId" = 5
                        and "productId" = c0."productId"
                        and "tranDate" <= c0."tranDate"
                order by "tranDate" DESC, "salePurchaseDetailsId" DESC LIMIT 1
        ) as "lastPurchasePrice", "discount", "cgst", "sgst","igst", "amount", "gstRate", "autoRefNo"
            from cte0 c0
                where "tranTypeId" in (4, 9) --and "productId" in(66,67)
        ), cte3 as ( -- take last purchase price from ProductOpBal if no purchase is made in current year
            select "tranDate", c2."productId", c2."qty", "price", coalesce("lastPurchasePrice","openingPrice") as "lastPurchasePrice",
                    "discount", c2."qty" * ("price" - "discount") as "aggrSale", "cgst", "sgst", "igst", "amount", "gstRate", "tranTypeId","salePurchaseDetailsId", "autoRefNo"
                from cte2 c2
                    left join cte1 c1
                        on c2."productId" = c1."productId"
        ), cte4 as ( -- compute gross profit
            select cte3.*, "qty" * ("price" - "discount" - "lastPurchasePrice") as "grossProfit"
                from cte3
        ), cte5 as ( --negate for sales return
			select "tranDate", "productId", "price", "lastPurchasePrice", "discount", "gstRate","tranTypeId","salePurchaseDetailsId", "autoRefNo"
			, CASE when "tranTypeId" = 4 then "qty" else -"qty" end as "qty"
			, CASE when "tranTypeId" = 4 then "aggrSale" else -"aggrSale" end as "aggrSale"
			, CASE when "tranTypeId" = 4 then "cgst" else -"cgst" end as "cgst"
			, CASE when "tranTypeId" = 4 then "sgst" else -"sgst" end as "sgst"
			, CASE when "tranTypeId" = 4 then "igst" else -"igst" end as "igst"
			, CASE when "tranTypeId" = 4 then "amount" else -"amount" end as "amount"
			, CASE when "tranTypeId" = 4 then 'Sale' else 'Return' end as "saleType"
			, CASE when "tranTypeId" = 4 then "grossProfit" else -"grossProfit" end as "grossProfit"
				from cte4
		)
        select cte5.*, "productCode", "catName", "brandName", "label"
				from cte5
					join "ProductM" p
						on p."id" = cte5."productId"
					join "CategoryM" c
						on c."id" = p."catId"
					join "BrandM" b
						on b.id = p."brandId"
                where "tranDate" between %(startDate)s and %(endDate)s
				order by "tranDate", "salePurchaseDetailsId"
    ''',

    "get_search_product": '''
        select p."id", 
		"catName", "isActive", "brandName", 
        "salePrice", "saleDiscount", "saleDiscountRate", "salePriceGst",
        "purPrice", "purDiscount", "purDiscountRate", "purPriceGst",
		CASE WHEN p."hsn" is null THEN c."hsn" ELSE p."hsn" END, "info", "label", "productCode", "upcCode", "gstRate"
		from "ProductM" p
			join "CategoryM" c
				on c."id" = p."catId"
			join "BrandM" b
				on b."id" = p."brandId"
			where "label" ILIKE ANY(array[someArgs])
			or "catName" ILIKE ANY(array[someArgs])
			or "brandName" ILIKE ANY(array[someArgs])
			or c."descr" ILIKE ANY(array[someArgs])
			or "info" ILIKE ANY(array[someArgs])
    ''',

    # "get_stock_op_bal": '''
    #     select a."id", "catName", "catId", "brandName", "brandId", "productId" ,"label", "info", "qty", "openingPrice", "lastPurchaseDate"
    #         from "ProductOpBal" a
    #             join "ProductM" p
    #                 on p."id" = a."productId"
    #             join "CategoryM" c
    #                 on c."id" = p."catId"
    #             join "BrandM" b
    #                 on b."id" = p."brandId"
    #     where "finYearId" = %(finYearId)s
    #         and "branchId" = %(branchId)s
    #     order by a."id" DESC
    # ''',

    "get_tranHeaders_details": '''
        select h."id" as "tranHeaderId", "tranDate", "autoRefNo", "tags", d."id" as "tranDetailsId",
             h."remarks" as "headerRemarks" , "userRefNo", "accName", "dc", d."remarks" as "lineRemarks",
             "amount", "lineRefNo", "tranTypeId", d."instrNo", "clearDate"
            from "TranH" h 
                join "TranD" d
                    on h."id" = d."tranHeaderId"				
                join "AccM" a
                    on a."id" = d."accId"
                left outer join "ExtBankReconTranD" b
					on d."id" = b."tranDetailsId"	
		where "tranTypeId" = %(tranTypeId)s 
            and "finYearId" = %(finYearId)s 
            and "branchId" = %(branchId)s
            order by "tranDate" DESC, h."id", d."id" 
            limit %(no)s
            ''',

    "get_trialBalance": '''
        with recursive cte as (
        select * from cte1
            union all
        select a."id", a."accName", a."accType", a."parentId", a."accLeaf"
        , c."opening"
        , c."sign"
        , c."opening_dc"
        , c."debit", c."credit"
            from cte c
                join "AccM" a
                    on c."parentId" = a."id"
        ),
        cte1 as (
            select a."id", "accName", "accType", "parentId", "accLeaf"
                , 0.00 as "opening"
                , 1 as "sign"
                , '' as "opening_dc"
                , CASE WHEN t."dc" = 'D' THEN t."amount" else 0.00 END as "debit"
                , CASE WHEN t."dc" = 'C' THEN t."amount" else 0.00 END as "credit"
            from "AccM" a
                join "TranD" t
                    on t."accId" = a."id"
                join "TranH" h
                    on h."id" = t."tranHeaderId"
                        where  
                            h."finYearId" =  %(finYearId)s and h."branchId" = %(branchId)s
                union all
            select a."id", "accName", "accType", "parentId", "accLeaf"
                , "amount" as "opening"
                , CASE WHEN "dc" = 'D' THEN 1 ELSE -1 END as "sign"
                , "dc" as "opening_dc"
                , 0 as "debit"
                , 0 as "credit"
            from "AccM" a
                join "AccOpBal" b
                    on a."id" = b."accId"
                        where  
                            "finYearId" = %(finYearId)s and "branchId" = %(branchId)s
            ),
        cte2 as (
            select "id", "accName", "accType", "parentId", "accLeaf"
                , SUM("opening" * "sign") as "opening"
                , SUM("debit") as "debit"
                , SUM("credit") as "credit"
                from cte
                    group by "id", "accName", "accType", "parentId", "accLeaf"
                        order by "id"
            ) select 
                "id", "accName", "accType", "parentId", "accLeaf"
                , ABS("opening") as "opening"
                , CASE WHEN "opening" < 0 THEN 'C' ELSE 'D' END as "opening_dc"
                , "debit"
                , "credit"
                , (select ARRAY_AGG("id") from cte2 where "parentId" = a."id") as "children"
                , ABS("opening" + "debit" - "credit") as "closing"
                , CASE WHEN ("opening" + "debit" - "credit") < 0 THEN 'C' ELSE 'D' END as "closing_dc"
            from cte2 a 
    ''',

    "get_unitInfo": '''
        select "jData"
            from "Settings"
                where "key" = 'unitInfo'
    ''',

    "get_vouchers": '''
        select h."id", "tranDate", "autoRefNo", "tags",
             h."remarks", "userRefNo", "accName", "dc", d."remarks" as "lineRemarks",
             CASE WHEN "dc" = 'D' THEN "amount" ELSE 0.00 END as "debit",
             CASE WHEN "dc" = 'C' THEN "amount" ELSE 0.00 END as "credit",
             "lineRefNo", d."instrNo", "clearDate", "gstin", "rate", "hsn", "cgst", "sgst", "igst", "isInput", "tranTypeId"
            from "TranH" h 
                join "TranD" d
                    on h."id" = d."tranHeaderId"				
                join "AccM" a
                    on a."id" = d."accId"
                left outer join "ExtBankReconTranD" b
					on d."id" = b."tranDetailsId"
				left outer join "ExtGstTranD" e
					on d."id" = e."tranDetailsId"
		where "tranTypeId" = %(tranTypeId)s 
            and "finYearId" = %(finYearId)s 
            and "branchId" = %(branchId)s
            order by "tranDate" DESC, h."id" DESC, d."id" DESC 
            limit %(no)s
    ''',

    "getJson_accountsMaster_groups_ledgers": '''
       with cte1 as (
            select a."id", "accCode", "accName", "parentId", "accType", "isPrimary", "accLeaf","classId", "accClass"
            , x."id" as "extBusinessContactsAccMId"
            , e."isAutoSubledger"
            , (select array_agg(id) from "AccM" m where a."id" = m."parentId" ) as "children"
            
			, CASE WHEN ("accClass" in('debtor', 'creditor', 'loan')) and ("accLeaf" in('Y','S'))  then true else false END as "addressable"
			, CASE WHEN x."id" is not null then true else false END as "isAddressExists"
                from "AccM" a 
					join "AccClassM" c
                    	on a."classId" = c."id" 
					left outer join "ExtBusinessContactsAccM" x
						on a."id" = x."accId"
                    left outer join "ExtMiscAccM" e
                        on a."id" = e."accId"
				order by  "accName", "accType", a."id"
        ),
        cte2 as (
            select a."id", "accCode", "accName", "accType", "accLeaf", "classId", "accClass"
                from "AccM" a join "AccClassM" c on a."classId" = c."id"
                    where "accLeaf" in ('N', 'L')
                        order by "accName"
        )
        SELECT
            json_build_object(
                'accountsMaster', (SELECT json_agg(row_to_json(a)) from cte1 a)
                , 'groupsLedgers', (SELECT json_agg(row_to_json(b)) from cte2 b)
            ) as "jsonResult"

        ''',

    "getJson_all_gst_reports": '''
            -- gst-input-consolidated (ExtGstTranD only) based on "isInput"
            with cte1 as (
            select  "tranDate", "autoRefNo", "userRefNo", "tranType", "gstin", d."amount" - "cgst" - "sgst" - "igst" as "aggregate", "cgst", "sgst", "igst", d."amount",
                    "accName",h."remarks", "dc", "lineRefNo", d."remarks" as "lineRemarks"
                from "TranH" h
                    join "TranD" d
                        on h."id" = d."tranHeaderId"
                    join "ExtGstTranD" e
                        on d."id" = e."tranDetailsId"
                    join "AccM" a
                        on a."id" = d."accId"
                    join "TranTypeM" t
                        on t."id" = h."tranTypeId"
                where
                    ("cgst" <> 0 or
                    "sgst" <> 0 or
                    "igst" <> 0) and
                    "isInput" = true and
                    "finYearId" = %(finYearId)s and
                    "branchId" = %(branchId)s and
                    ("tranDate" between %(startDate)s and %(endDate)s)
                
                order by "tranDate", h."id"),
            
            -- gst-output-consolidated (ExtGstTrand) based on "isInput"
            cte2 as (
            select  "tranDate", "autoRefNo", "userRefNo", "tranType", "gstin", d."amount" - "cgst" - "sgst" - "igst" as "aggregate", "cgst", "sgst", "igst", d."amount",
                    "accName",h."remarks", "dc", "lineRefNo", d."remarks" as "lineRemarks"
                from "TranH" h
                    join "TranD" d
                        on h."id" = d."tranHeaderId"
                    join "ExtGstTranD" e
                        on d."id" = e."tranDetailsId"
                    join "AccM" a
                        on a."id" = d."accId"
                    join "TranTypeM" t
                        on t."id" = h."tranTypeId"
                where
                    ("cgst" <> 0 or
                    "sgst" <> 0 or
                    "igst" <> 0) and
                    "isInput" = false and
                    "finYearId" = %(finYearId)s and
                    "branchId" = %(branchId)s and
                    ("tranDate" between %(startDate)s and %(endDate)s)
                
                order by "tranDate", h."id"),
            
            -- gst-output-sales (considering only table SalePurchaseDetails)
            cte3 as (
                select  "tranDate", "autoRefNo", "userRefNo", "tranType", 
                (select "gstin" from "ExtGstTranD" where "tranDetailsId" = d."id") as "gstin",
                "gstRate",
                SUM(CASE WHEN "tranTypeId" = 4 THEN (s."amount" - "cgst" - "sgst" - "igst") ELSE -(s."amount" - "cgst" - "sgst" - "igst") END) as "aggregate",
                SUM(CASE WHEN "tranTypeId" = 4 THEN "cgst" ELSE -"cgst" END) as "cgst",
                SUM(CASE WHEN "tranTypeId" = 4 THEN "sgst" ELSE -"sgst" END) as "sgst",
                SUM(CASE WHEN "tranTypeId" = 4 THEN "igst" ELSE -"igst" END) as "igst",
                SUM(CASE WHEN "tranTypeId" = 4 THEN s."amount" ELSE -s."amount" END) as "amount",
                "accName", h."remarks", "dc", "lineRefNo", d."remarks" as "lineRemarks"
                        from "TranH" h
                            join "TranD" d
                                on h."id" = d."tranHeaderId"
                            join "AccM" a
                                on a."id" = d."accId"
                            join "TranTypeM" t
                                on t."id" = h."tranTypeId"
                            join "SalePurchaseDetails" s
                                on d."id" = s."tranDetailsId"
                        where
                            ("cgst" <> 0 or
                            "sgst" <> 0 or
                            "igst" <> 0) and
                            "tranTypeId" in (4,9) and
                            "finYearId" = %(finYearId)s and
                            "branchId" = %(branchId)s and
                            ("tranDate" between %(startDate)s and %(endDate)s)
                    GROUP BY 
                        "tranDate", h."id", "tranDate", "autoRefNo", "userRefNo", "tranType", "gstin", "gstRate", "accName", h."remarks", "dc", "lineRefNo", d."remarks"     
                    order by "tranDate", h."id"
            ),

            -- gst-input-purchases (considering only table SalePurchaseDetails)
            cte4 as (
                select  "tranDate", "autoRefNo", "userRefNo", "tranType", 
                (select "gstin" from "ExtGstTranD" where "tranDetailsId" = d."id") as "gstin",
                "gstRate",
                SUM(CASE WHEN "tranTypeId" = 5 THEN (s."amount" - "cgst" - "sgst" - "igst") ELSE -(s."amount" - "cgst" - "sgst" - "igst") END) as "aggregate",
                SUM(CASE WHEN "tranTypeId" = 5 THEN "cgst" ELSE -"cgst" END) as "cgst",
                SUM(CASE WHEN "tranTypeId" = 5 THEN "sgst" ELSE -"sgst" END) as "sgst",
                SUM(CASE WHEN "tranTypeId" = 5 THEN "igst" ELSE -"igst" END) as "igst",
                SUM(CASE WHEN "tranTypeId" = 5 THEN s."amount" ELSE -s."amount" END) as "amount",
                "accName", h."remarks", "dc", "lineRefNo", d."remarks" as "lineRemarks"
                        from "TranH" h
                            join "TranD" d
                                on h."id" = d."tranHeaderId"
                            join "AccM" a
                                on a."id" = d."accId"
                            join "TranTypeM" t
                                on t."id" = h."tranTypeId"
                            join "SalePurchaseDetails" s
                                on d."id" = s."tranDetailsId"
                        where
                            ("cgst" <> 0 or
                            "sgst" <> 0 or
                            "igst" <> 0) and
                            "tranTypeId" in (5,10) and
                            "finYearId" = %(finYearId)s and
                            "branchId" = %(branchId)s and
                            ("tranDate" between %(startDate)s and %(endDate)s)
                group by
					"tranDate", h."id", "autoRefNo", "userRefNo", "tranType", "gstin", "gstRate","accName", h."remarks", "dc", "lineRefNo", d."remarks"
                order by "tranDate", h."id"
            ),

            -- gst-input-vouchers
            cte5 as (
                select  "tranDate", "autoRefNo", "userRefNo", "tranType", 
                "gstin", "rate" as "gstRate",
                d."amount" - "cgst" - "sgst" - "igst" as "aggregate", "cgst", "sgst", "igst", d."amount",
                "accName", h."remarks", "dc", "lineRefNo", d."remarks" as "lineRemarks"
                        from "TranH" h
                            join "TranD" d
                                on h."id" = d."tranHeaderId"
                            join "ExtGstTranD" e
                                on d."id" = e."tranDetailsId"
                            join "AccM" a
                                on a."id" = d."accId"
                            join "TranTypeM" t
                                on t."id" = h."tranTypeId"
                        where
                            ("cgst" <> 0 or
                            "sgst" <> 0 or
                            "igst" <> 0) and
                            "rate" is not null and -- When it is not a sale / purchase i.e voucher, then "gstRate" value exists in "ExtGstTranD" table otherwise not
                            "isInput" = true and -- Only applicable for GST through vouchers
                            "finYearId" = %(finYearId)s and
                            "branchId" = %(branchId)s and
                            ("tranDate" between %(startDate)s and %(endDate)s)
                        
                order by "tranDate", h."id"
            )
            select json_build_object(
                    '01-gst-input-consolidated', (SELECT json_agg(row_to_json(a)) from cte1 a),
                    '02-gst-output-consolidated', (SELECT json_agg(row_to_json(b)) from cte2 b),
                    '03-gst-input-purchases', (SELECT json_agg(row_to_json(d)) from cte4 d),
                    '04-gst-output-sales', (SELECT json_agg(row_to_json(c)) from cte3 c), 
                    '05-gst-input-vouchers', (SELECT json_agg(row_to_json(e)) from cte5 e)
                ) as "jsonResult" 
    ''',

    "getJson_bankRecon": '''
        with cte1 as (select 
            d."id" as "tranDetailsId",
            h."id" --as "headerId"
            , "tranDate"
            , "tranTypeId"
            , "userRefNo"
            , h."remarks"
            , "autoRefNo"
            , "lineRefNo"
            , "instrNo"
            , d."remarks" as "lineRemarks"
            , CASE WHEN "dc" = 'D' then "amount" ELSE 0 END as "credit"
            , CASE WHEN "dc" = 'C' then "amount" ELSE 0 END as "debit"
            , x."clearDate", "clearRemarks", x."id" as "bankReconId"
                from "TranD" d
                    left outer join "ExtBankReconTranD" x
                        on d."id" = x."tranDetailsId"
                    join "TranH" h
                        on h."id" = d."tranHeaderId"
            where "accId" = %(accId)s
                and (("finYearId" = %(finYearId)s) or 
                (x."clearDate" between %(isoStartDate)s and %(isoEndDate)s)
                )
            order by "clearDate", "tranDate", h."id"
        ), 
        cte2 as (
            select
            CASE WHEN "dc" = 'D' then "amount" ELSE 0.00 END as "debit"
            , CASE WHEN "dc" = 'C' then "amount" ELSE 0.00 END as "credit"
            , "dc"
            from "BankOpBal"
                where "accId" = %(accId)s
                    and "finYearId" = %(finYearId)s),
		cte3 as (
			select c1.* 
			, (
				select string_agg("accName", ' ,')
					from "TranD" d1
						join "AccM" a
							on a."id" = d1."accId"
					where d1."tranHeaderId" = c1."id"
						and "accId" <> %(accId)s
				) as "accNames"
			from cte1 c1
                order by "clearDate","tranDate", "id"
				--order by c1."headerId" DESC
		)
        select json_build_object(
            'bankRecon', (SELECT json_agg(row_to_json(a)) from cte3 a)
            , 'opBalance', (SELECT row_to_json(b) from cte2 b)
        ) as "jsonResult"
    ''',

    "getJson_brands_categories_products_units": '''
        with cte1 as (
            select id as "value", "catName" as "label"
                from "CategoryM"
                    where "isLeaf" = true
                order by "catName"
        ), cte2 as (
            select id as "value", "brandName" as "label"
                from "BrandM" order by "brandName"
        ), cte3 as (
            select p.id, "catId", "hsn", "brandId", "label", "info", p."jData", "productCode", "upcCode", "catName", "brandName"
                from "ProductM" p
                    join "CategoryM" c
                        on c."id" = p."catId"
                    join "BrandM" b
                        on b."id" = p."brandId"
            order by "catName", "brandName", "label"
        ), cte4 as (
            select "id", "unitName" from "UnitM" order by "unitName"
        )
        select json_build_object(
            'categories', (select json_agg(row_to_json(a)) from cte1 a)
            , 'brands', (select json_agg(row_to_json(b)) from cte2 b)
            , 'products', (select json_agg(row_to_json(c)) from cte3 c)
            , 'units', (select json_agg(row_to_json(d)) from cte4 d )
            ) as "jsonResult"
    ''',

    "getJson_brands_categories_units": '''
        with cte1 as (
            SELECT "id", "brandName"
	 			from "BrandM" order by "brandName"
        ),
        cte2 as (
            select "id", "catName" , (
				select "catName" from "CategoryM"
					where id = c."parentId"
			) as "parent"
                from "CategoryM" c
					where "isLeaf" = true order by "catName"
        ),
        cte3 as (
            select "id", "unitName" from "UnitM" order by "unitName"
        )
        SELECT
            json_build_object(
                'brands', (SELECT json_agg(row_to_json(a)) from cte1 a)
                , 'categories', (SELECT json_agg(row_to_json(b)) from cte2 b)
                , 'units',(SELECT json_agg(row_to_json(c)) FROM cte3 c)
            ) as "jsonResult"
    ''',

    "getJson_branchCode_tranCode": '''
        select json_build_object(
			'branchCode', (select "branchCode" from "BranchM" where "id" = %(branchId)s)
			, 'tranCode', (select "tranCode" from "TranTypeM" where "id" = %(tranTypeId)s)
		) as "jsonResult"
    ''',

    'getJson_categories': '''
        with recursive cte as (
            select c."id", c."catName", c."descr", c."parentId", c."isLeaf", 
            ( select array_agg(id) from "CategoryM" m where c."id" = m."parentId") as "children",
            "id"::text as "path"
                from "CategoryM" c where "parentId" is null                  
        union
            select c."id", c."catName", c."descr", c."parentId", c."isLeaf", 
            ( select array_agg(id) from "CategoryM" m where c."id" = m."parentId") as "children",
            cte."path" || ',' || c."id"::text as "path"
                from "CategoryM" c join
                cte on cte."id" = c."parentId" ),
            cte1 as (select * from cte order by "catName")
            
            select json_build_object('categories', (select json_agg(row_to_json(a)) from cte1 a) ) as "jsonResult"
    ''',

    "getJson_datacache": '''
        with cte1 as (
            with cte01 as 
	        (select "accId", CASE WHEN "dc" = 'D' then SUM("amount") ELSE SUM(-"amount") END as "amount"
                from "TranD"  d
                    join "TranH" h
                        on h."id" = d."tranHeaderId"
                    where "branchId" = %(branchId)s and "finYearId" = %(finYearId)s
                        GROUP BY "accId", "dc"
                        union 
                    select "accId", CASE WHEN "dc" ='D' then "amount" ELSE (-"amount") END as "amount"
                    from "AccOpBal" 
                        where "branchId" = %(branchId)s and "finYearId" = %(finYearId)s),
            cte02 as (
                select "accId", SUM("amount") as "amount"
                    from cte01 group BY "accId"
            )
            select a.*, c."accClass", m."isAutoSubledger", b."amount" as "balance"
                from "AccM" a
                    join "AccClassM" c
                        on c."id" = a."classId"
                    left outer join "ExtMiscAccM" m
                                on a."id" = m."accId"
                    left outer join cte02 b
                        on a."id" = b."accId"
                order by "accCode"
        ),
        cte2 as (
            select "id", "key", "textValue", "jData", "intValue" 
                from "Settings"
        ),
        cte3 as (
            select * from "AccClassM" order by "accClass" 
        )
        SELECT
            json_build_object(
                'allAccounts', (SELECT json_agg(row_to_json(a)) from cte1 a)
                , 'allSettings', (SELECT json_agg(row_to_json(b)) from cte2 b)
                , 'allClasses',(SELECT json_agg(row_to_json(c)) FROM cte3 c)
            ) as "jsonResult"
        ''',

    "getJson_debit_credit_note": '''
        select h."id", "tranDate", "remarks", h."jData", "posId", "autoRefNo", "userRefNo",
                (
                    with cte1 as (
                        select d."id" as "tranDetailsId", "accId", "remarks", "dc", d."amount", "lineRefNo", d."remarks"
                            from "TranD" d
                            where "tranHeaderId" = h."id"
                                and "dc" = 'D'
                    )
                    select json_agg(row_to_json(a)) from cte1 a 
                ) as "debits",
                (
                    with cte2 as (
                        select d."id" as "tranDetailsId", "accId", "remarks", "dc", d."amount", "lineRefNo", d."remarks"                    
                            from "TranD" d
                                where "tranHeaderId" = h."id"
                                and "dc" = 'C'
                    )
                    select json_agg(row_to_json(b)) from cte2 b
                ) as "credits"
                
                from "TranH" h
                    where h."id" = %(id)s
    ''',

    "getJson_finYears_branches_nowFinYearIdDates_generalSettings": '''
        with cte1 as (
            select "id", "startDate", "endDate"
                from "FinYearM"
                    order by "startDate" DESC
        ),

        cte2 as (
            select "id" as "branchId", "branchCode", "branchName"
                from "BranchM"
                    order by "branchCode"
        ),
		
		cte3 as (
			select "id" as "finYearId", "startDate", "endDate"
				from "FinYearM"
					where %(nowDate)s between "startDate" and "endDate"
		),

        cte4 as (
            select "jData" as "generalSettings" from "Settings"
	            where key = 'generalSettings'
        )
        
        select json_build_object(
                    'finYears',(SELECT json_agg(row_to_json(a)) from cte1 a)
                    , 'branches', (SELECT json_agg(row_to_json(b)) from cte2 b)
					, 'nowFinYearIdDates', (select row_to_json(c) from cte3 c)
                    , 'generalSettings', (select "generalSettings" from cte4)
		) as "jsonResult"
    ''',

    "getJson_opening_stock": '''
        with cte1 as (
            select a."id", "catName", "catId", "brandName", "brandId", "productId" ,"label", "info", "qty", "openingPrice", "lastPurchaseDate"
                        from "ProductOpBal" a
                            join "ProductM" p
                                on p."id" = a."productId"
                            join "CategoryM" c
                                on c."id" = p."catId"
                            join "BrandM" b
                                on b."id" = p."brandId"
                    where "finYearId" = %(finYearId)s 
                        and "branchId" = %(branchId)s
                    order by a."id" DESC),
        cte2 as (
            select SUM("qty" * "openingPrice") as value
                from "ProductOpBal"
            where "finYearId" = %(finYearId)s 
                    and "branchId" = %(branchId)s)
            select json_build_object(
                'openingStock',(SELECT json_agg(row_to_json(a)) from cte1 a)
                , 'value', (SELECT value from cte2)
            ) as "jsonResult"
    ''',

    'getJson_sale_purchase_on_id': '''
        with cte1 as (
            select "id", "tranDate", "userRefNo", "remarks", "autoRefNo", "jData", "tranTypeId"
                from "TranH"
                    where "id" = %(id)s
        ),
		cte5 as (
			select c.* 
				from "Contacts" c
					join "TranH" h
						on c."id" = h."contactsId"
					where  h."id" = %(id)s
		),
        cte2 as (
            select d."id", d."accId", "dc", "amount", d."instrNo", d."remarks", "accClass"
                from "cte1" c1 join "TranD" d 
                    on c1."id" = d."tranHeaderId"
                join "AccM" m
				  	on m."id" = d."accId"
                join "AccClassM" c2
                      on c2."id" = m."classId"
        ),
        cte3 as (
            select x."id", "gstin", "cgst", "sgst", "igst"
                from "cte2" c2 join "ExtGstTranD" x
                    on c2."id" = x."tranDetailsId"                        
        ),
        cte6 as (
            select e.* from
                "AccM" a join "ExtBusinessContactsAccM" e
                    on a."id" = e."accId"
                join cte2 c2
                    on a."id" = c2."accId"
        ),
        cte4 as (
            select s."id", "productId", "qty", "price", "priceGst", "discount"
                , "cgst", "sgst", "igst", s."amount", s."hsn", s."gstRate"
                , "productCode", "upcCode", "catName", "brandName", "info", "label"
                , s."jData"->>'serialNumbers' as "serialNumbers"
                , s."jData"->>'remarks' as "remarks"
                from "cte2" c2 
                    join "SalePurchaseDetails" s
                        on c2."id" = s."tranDetailsId"
                    join "ProductM" p
                        on p."id" = s."productId"
                    join "CategoryM" c
                        on c."id" = p."catId"
                    join "BrandM" b
                        on b."id" = p."brandId"
                
        )

        select json_build_object(
            'tranH', (SELECT row_to_json(a) from cte1 a),
			'billTo', (SELECT row_to_json (e) from cte5 e),
            'businessContacts',(SELECT row_to_json(f) from cte6 f),
            'tranD', (SELECT json_agg(row_to_json(b)) from cte2 b),
            'extGstTranD', (SELECT row_to_json(c) from cte3 c),
            'salePurchaseDetails', (SELECT json_agg(row_to_json(d)) from cte4 d)
        ) as "jsonResult"
    ''',

    "getJson_search_purchase_invoice": '''
        select  h."id", "autoRefNo", "tranDate", h."remarks", "userRefNo",
            string_agg(concat_ws(' ', p."label",  p."info", d."remarks"), ':'	) as "products",
            sum(d."amount") as "amount"                  
                from "TranH" h
                join "TranD" d
                    on h."id" = d."tranHeaderId"
                left outer join "SalePurchaseDetails" t
                    on d."id" = t."tranDetailsId"
                join "ProductM" p
                    on p."id" = t."productId"
                join "CategoryM" o
                    on o."id" = p."catId"
                join "BrandM" b
                    on b."id" = p."brandId"
                    where "tranTypeId" = 5
						and	(h."autoRefNo" ilike '%%' || %(arg)s || '%%'
                        or "label" ILIKE '%%' || %(arg)s || '%%'
                        or "catName" ILIKE '%%' || %(arg)s || '%%'
                        or "brandName" ILIKE '%%' || %(arg)s || '%%'
                        or o."descr" ILIKE '%%' || %(arg)s || '%%'
                        or "info" ILIKE '%%' || %(arg)s || '%%'
                        or "productCode" LIKE  %(arg)s
                        or "upcCode" LIKE  %(arg)s)
                        
                    group by h."id", h."remarks"
                    order by "tranDate" DESC
    ''',

    "getJson_search_saleBill": '''
        select  h."id", "autoRefNo", "tranDate", h."remarks", 
            string_agg(concat_ws(' ', p."label",  p."info", d."remarks"), ':'	) as "products",
            sum(d."amount") as "amount" ,            
                row_to_json(c.*) as "contacts"        
                from "TranH" h
                join "TranD" d
                    on h."id" = d."tranHeaderId"
                left outer join "SalePurchaseDetails" t
                    on d."id" = t."tranDetailsId"
                join "ProductM" p
                    on p."id" = t."productId"
                join "CategoryM" o
                    on o."id" = p."catId"
                join "BrandM" b
                    on b."id" = p."brandId"
                left outer join "Contacts" c
                    on c."id" = h."contactsId"
                    where "tranTypeId" = 4
                        and (h."autoRefNo" ilike '%%' || %(arg)s || '%%'
                        or "label" ILIKE '%%' || %(arg)s || '%%'
                        or "catName" ILIKE '%%' || %(arg)s || '%%'
                        or "brandName" ILIKE '%%' || %(arg)s || '%%'
                        or o."descr" ILIKE '%%' || %(arg)s || '%%'
                        or "info" ILIKE '%%' || %(arg)s || '%%'
                        or "productCode" ILIKE '%%' || %(arg)s || '%%'
                        or "upcCode" ILIKE '%%' || %(arg)s || '%%')
                    group by h."id", h."remarks", c.*
                    order by "tranDate" DESC
    ''',

    "getJson_stock_summary_ageing": '''
        with cte0 as( --base cte used many times in next
        select "productId", "tranTypeId", "qty", "price", "tranDate"
            from "TranH" h
                join "TranD" d
                    on h."id" = d."tranHeaderId"
                join "SalePurchaseDetails" s
                    on d."id" = s."tranDetailsId"
            where "branchId" = %(branchId)s and "finYearId" = %(finYearId)s
                and "tranDate" <= coalesce(%(onDate)s, CURRENT_DATE)
        ), cte1 as ( -- opening balance
            select id, "productId", "qty", "openingPrice", "lastPurchaseDate"
                from "ProductOpBal" p where "branchId" = %(branchId)s and "finYearId" = %(finYearId)s
        ), cte2 as ( -- create columns for sale, saleRet, purch... Actually creates columns from rows
            select "productId","tranTypeId", 
                SUM(CASE WHEN "tranTypeId" = 4 THEN "qty" ELSE 0 END) as "sale"
                , SUM(CASE WHEN "tranTypeId" = 9 THEN "qty" ELSE 0 END) as "saleRet"
                , SUM(CASE WHEN "tranTypeId" = 5 THEN "qty" ELSE 0 END) as "purchase"
                , SUM(CASE WHEN "tranTypeId" = 10 THEN "qty" ELSE 0 END) as "purchaseRet"
                , MAX(CASE WHEN "tranTypeId" = 4 THEN "tranDate" END) as "lastSaleDate"
                , MAX(CASE WHEN "tranTypeId" = 5 THEN "tranDate" END) as "lastPurchaseDate"
                from cte0
            group by "productId", "tranTypeId" order by "productId", "tranTypeId"
        ), cte3 as ( -- sum columns group by productId
            select "productId"
            , coalesce(SUM("sale"),0) as "sale"
            , coalesce(SUM("purchase"),0) as "purchase"
            , coalesce(SUM("saleRet"),0) as "saleRet"
            , coalesce(SUM("purchaseRet"),0) as "purchaseRet"
            , MAX("lastSaleDate") as "lastSaleDate"
            , MAX("lastPurchaseDate") as "lastPurchaseDate"
            from cte2
                group by "productId"
        ), cte4 as ( -- join opening balance (cte1) with latest result set
            select coalesce(c1."productId",c3."productId")  as "productId"
            , coalesce(c1.qty,0) as "op"
            , coalesce("sale",0) as "sale"
            , coalesce("purchase",0) as "purchase"
            , coalesce("saleRet", 0) as "saleRet"
            , coalesce("purchaseRet", 0) as "purchaseRet"
            , coalesce(c3."lastPurchaseDate", c1."lastPurchaseDate") as "lastPurchaseDate"
            , "openingPrice", "lastSaleDate"
                from cte1 c1
                    full join cte3 c3
                        on c1."productId" = c3."productId"
        ), cte5 as ( -- get last purchase price for transacted products
            select DISTINCT ON("productId") "productId", "price" as "lastPurchasePrice"
                from cte0
                    where "tranTypeId" = 5
                        order by "productId", "tranDate" DESC
        ), cte6 as (  -- combine last purchase price with latest result set and add clos column and filter on lastPurchaseDate(ageing)
            select coalesce(c4."productId", c5."productId") as "productId"
                , coalesce("openingPrice",0) as "openingPrice", "op", coalesce("op"* "openingPrice",0)::numeric(12,2) "opValue", "sale", "purchase", "saleRet","purchaseRet",coalesce("lastPurchasePrice", "openingPrice") as "lastPurchasePrice","lastPurchaseDate","lastSaleDate"
                , ("op" + "purchase" - "purchaseRet" - "sale" + "saleRet") as "clos"
                from cte4 c4
                    full join cte5 c5
                        on c4."productId" = c5."productId"
                where date_part('day', CURRENT_DATE::timestamp - "lastPurchaseDate"::timestamp) >= coalesce(%(days)s,0)
        ), cte7 as ( -- combine latest result set with ProductM, CategoryM and BrandM tables to attach catName, brandName, label
            select c6."productId", "productCode", "catName", "brandName", "label","openingPrice", "op"::numeric(10,2),"opValue"
            , ("purchase" + "saleRet")::numeric(10,2) as "dr", ("sale" + "purchaseRet"):: numeric(10,2) as "cr",
            "sale"::numeric(10,2), "purchase"::numeric(10,2), "saleRet"::numeric(10,2), "purchaseRet"::numeric(10,2), "clos"::numeric(10,2), "lastPurchasePrice", ("clos" * "lastPurchasePrice")::numeric(12,2) as "closValue"
                    , "lastPurchaseDate", "lastSaleDate"
                from cte6 c6
                    join "ProductM" p
                        on p."id" = c6."productId"
                    join "CategoryM" c
                        on c."id" = p."catId"
                    join "BrandM" b
                        on b."id" = p."brandId"
            order by "catName", "brandName", "label"
        ), cte8 as( -- get summary
            select count(*) as "count", SUM("op") as "op",SUM("opValue") "opValue", SUM("dr") debits, SUM("cr") credits, SUM("sale") as "sale", SUM("purchase") "purchase", SUM("saleRet") "saleRet", SUM("purchaseRet") "purchaseRet", SUM("clos") "clos", SUM("closValue") "closValue"
                from cte7
        ) 
        select json_build_object(
            'stock', (SELECT json_agg(row_to_json(a)) from cte7 a),
            'summary', (SELECT row_to_json(b) from cte8 b)
            ) as "jsonResult"
    ''',

    "getJson_tranHeader_details": '''
        with cte1 as (
             select "id", "tranDate", "autoRefNo", "tags", 
                     "remarks" , "userRefNo", "tranTypeId"
             from "TranH"		
                 where "id" = %(id)s
         ),
		cte2 as (select t."id", "accId", "remarks", "dc", "amount", "tranHeaderId", "lineRefNo", "instrNo",
            (select row_to_json(t) from 
                (
                    select *, CASE WHEN "rate" is not null 
                        THEN true 
                        ELSE false 
                        END as "isGst" 
                    from "ExtGstTranD" where "tranDetailsId" = t."id") t
            ) as "gst"
	    from "TranD" t
		    where "tranHeaderId" = %(id)s)

        SELECT
            json_build_object(
                'tranHeader', (SELECT (row_to_json(a)) from cte1 a)
                , 'tranDetails', (SELECT json_agg(row_to_json(b)) from cte2 b)
            ) as "jsonResult"
    ''',

    'insert_account': '''
        insert into "AccM"("accCode", "accName", "accType", "parentId", "accLeaf", "isPrimary", "classId")
            values(%(accCode)s, %(accName)s, %(accType)s, %(parentId)s, %(accLeaf)s, %(isPrimary)s, %(classId)s)
                returning "id"
    ''',

    "insert_opBal": '''    
        insert into "AccOpBal" ("accId","finYearId","amount","dc", "branchId")
                values (%(accId)s, %(finYearId)s, %(amount)s, %(dc)s, %(branchId)s)
    ''',

    'insert_or_update_contact':'''
        with cte1 as (
            select id from "Contacts"
                where "mobileNumber" = %(mobileNumber)s::text --'1111111113'
                or "email" = %(email)s -- ''
                or "id" = %(id)s		
        ), cte2 as(
            insert into "Contacts" ("contactName","mobileNumber", "otherMobileNumber", "landPhone", "email"
                    , "descr", "anniversaryDate", "address1", "address2", "country", "state", "city", "gstin", "pin", "dateOfBirth", "stateCode")
                        select %(contactName)s, %(mobileNumber)s, %(otherMobileNumber)s, %(landPhone)s, %(email)s, %(descr)s
                        , %(anniversaryDate)s, %(address1)s, %(address2)s, %(country)s, %(state)s, %(city)s
                        , %(gstin)s, %(pin)s, %(dateOfBirth)s, %(stateCode)s
                where not exists(select 1 from cte1)
            returning "id")
        , cte3 as (
                update "Contacts" 
                    set "contactName" = %(contactName)s
                        , "mobileNumber" = %(mobileNumber)s
                        , "otherMobileNumber" = %(otherMobileNumber)s
                        , "landPhone" = %(landPhone)s
                        , "email" = %(email)s
                        , "descr" = %(descr)s
                        , "anniversaryDate" = %(anniversaryDate)s
                        , "address1" = %(address1)s
                        , "address2" = %(address2)s
                        , "country" = %(country)s
                        , "state" = %(state)s
                        , "city" = %(city)s
                        , "gstin" = %(gstin)s
                        , "pin" = %(pin)s
                        , "dateOfBirth" = %(dateOfBirth)s
                        , "stateCode" = %(stateCode)s
                where "id" in (select "id" from cte1)
                    returning "id"
            )
        SELECT DISTINCT "id" from cte1
            UNION select "id" from cte2
            Union select "id" from cte3
            LIMIT 1
    ''',

    'insert_last_no': '''
        insert into "TranCounter" ("finYearId", "branchId", "tranTypeId", "lastNo")
                select  %(finYearId)s, %(branchId)s, %(tranTypeId)s, 1
                    where not exists (select 1 from "TranCounter" where "branchId" = %(branchId)s 
                        and "tranTypeId" = %(tranTypeId)s and "finYearId" = %(finYearId)s);
    ''',

    "insert_product_block": '''
        with cte1 as(
	        select "intValue" + 1 as "productCode" from "Settings" where "key" = 'lastProductCode'
        ),
        cte2 as (
            insert into "ProductM"("catId", "hsn", "brandId", "info", "unitId", "label", "jData", 
                            "productCode", "upcCode", "gstRate", "maxRetailPrice", "salePrice", "salePriceGst", "dealerPrice" ,"purPrice", "purPriceGst")
            select %(catId)s, %(hsn)s, %(brandId)s, %(info)s, %(unitId)s, %(label)s, %(jData)s, "productCode", %(upcCode)s, %(gstRate)s,
                            %(maxRetailPrice)s, %(salePrice)s, %(salePriceGst)s, %(dealerPrice)s, %(purPrice)s, %(purPriceGst)s from cte1  returning "id"                  
        ), 
        cte3 as(
            update "Settings"
                set "intValue" = (select cte1."productCode" from cte1)
                    where "key" = 'lastProductCode')
        select "id" from cte2
    ''',

    "insert_product_block1": '''
        do $$
            DECLARE lastNo INT;
            begin
                if %(id)s is NOT NULL then
                    update "ProductM" set
                        "catId" = %(catId)s,
                        "hsn" = %(hsn)s,
                        "brandId" = %(brandId)s,
                        "info" = %(info)s,
                        "unitId" = %(unitId)s,
                        "label" = %(label)s,
                        "jData" = %(jData)s,
                        "upcCode" = %(upcCode)s,
                        "gstRate" = %(gstRate)s,
                        "maxRetailPrice"= %(maxRetailPrice)s,
                        "salePrice" = %(salePrice)s,
                        "salePriceGst" = %(salePriceGst)s,
                        "dealerPrice" = %(dealerPrice)s,
                        "purPrice" = %(purPrice)s,
                        "purPriceGst" = %(purPriceGst)s
                    where id = %(id)s;
                else
                    select "intValue" +1 into lastNo from "Settings" where "key" = 'lastProductCode';
                    insert into "ProductM" ("catId", "hsn", "brandId", "info", "unitId", "label", "jData", 
                            "productCode", "upcCode", "gstRate", "maxRetailPrice", "salePrice", "salePriceGst", "dealerPrice" ,"purPrice", "purPriceGst")
                        values (%(catId)s, %(hsn)s, %(brandId)s, %(info)s, %(unitId)s, %(label)s, %(jData)s, lastNo, %(upcCode)s, %(gstRate)s,
                            %(maxRetailPrice)s, %(salePrice)s, %(salePriceGst)s, %(dealerPrice)s, %(purPrice)s, %(purPriceGst)s
                        );
                    update "Settings" 
                        set "intValue" = lastNo
                            where "key" = 'lastProductCode';
                end if;
        end $$;
    ''',

    "is_exist_user_ref_no": '''
        select 1 as "out" from "TranH"
	        where "branchId" = %(branchId)s and
            "tranTypeId" = %(tranTypeId)s and
            "finYearId" = %(finYearId)s and
            "userRefNo" = %(userRefNo)s
    ''',

    "transfer_closingBalances": '''
    do $$
        DECLARE profitOrLoss decimal(17,2);
        begin
            CREATE TEMPORARY TABLE temp1(
                id serial NOT NULL PRIMARY KEY
                , accId integer NOT NULL
                , amount decimal(17,2)
                , dc char(1)
                , finYearId smallint
                , branchId smallInt
            );

            CREATE TEMPORARY TABLE temp2(
                id serial NOT NULL PRIMARY KEY
                , accId int NOT NULL
                , amount decimal(17,2)
                , dc char(1)
            );
            -- initial push from AccOpBal and Temp tables
            INSERT into temp1(accId,amount, dc, finYearId, branchId)
                select  "accId", SUM("amount") as "amount", "dc", "finYearId", "branchId"
                        FROM "AccM" a
                            join "AccOpBal" b
                                on a."id" = b."accId"
                                    WHERE "finYearId" = %(finYearId)s								--change
                                        and "branchId" = %(branchId)s								--change
                                        and "accType" in ('A', 'L')
                                        and "accLeaf" in ('Y', 'S')
                        GROUP BY "accId", "dc", "finYearId", "branchId"
                            union all--"TranD"
                select "accId", SUM("amount") as "amount", "dc", "finYearId", "branchId"
                    from "AccM" a
                        join "TranD" t
                            on a."id" = t."accId"
                        join "TranH" h
                            on h."id" = t."tranHeaderId"
                                where "finYearId" = %(finYearId)s									--change
                                    and "branchId" = %(branchId)s									--change
                                    and "accType" in ('A', 'L')
                                    and "accLeaf" in ('Y', 'S')
                        GROUP BY "accId", "dc", "finYearId", "branchId";

            update temp1
                set "amount" = -"amount"
                    where "dc" = 'C';

            INSERT into temp2( accId, amount)
                select accId,  SUM("amount") as "amount"
                    from "temp1"
                        GROUP BY accId;

            INSERT into temp2(accId, amount)
                select 4, 0 --capital account has accId = 4
                    where not exists(select accId from temp2 where accId = 4);

            delete from "AccOpBal"
                where ("finYearId" = %(nextFinYearId)s													--change
                    and "branchId" = %(branchId)s) or (amount = 0);														--change

            select coalesce(SUM(CASE WHEN "dc" = 'D' then t."amount" else -t."amount" end),0) into profitOrLoss
                from "AccM" a
                    join "TranD" t
                        on a."id" = t."accId"                                
                    join "TranH" h
                        on h."id" = t."tranHeaderId"				 				
                where "finYearId" = %(finYearId)s 
                    and "branchId" = %(branchId)s
                    and "accType" in ('E', 'I')
                    and "accLeaf" in ('Y','S');

            update temp2
                set amount = amount + profitOrLoss
                where temp2.accId = (select "id" from "AccM" where "accCode" = 'Capital');

            insert into "AccOpBal"("accId" ,"finYearId", "branchId", "amount", "dc")
                select accId, 
                        %(nextFinYearId)s, 
                        %(branchId)s, 
                        ABS(amount), 
                        CASE WHEN amount < 0 THEN 'C' ELSE 'D' END as "dc"
                    from temp2;

            drop table temp1;
            drop table temp2;

        end $$;
    ''',

    "transfer_closingBalance_cte_way": '''
        with cte1 as (
            -- AccOpBal
            select  "accId", SUM("amount") as "amount", "dc"
                FROM "AccM" a
                    join "AccOpBal" b
                        on a."id" = b."accId"
                            WHERE "finYearId" = %(finYearId)s
                                and "branchId" = %(branchId)s
                                and "accType" in ('A', 'L')
                                and "accLeaf" in ('Y', 'S')
                GROUP BY "accId", "dc"
            union --"TranD"
            select "accId", SUM("amount") as "amount", "dc"
                from "AccM" a
                    join "TranD" t
                        on a."id" = t."accId"
                    join "TranH" h
                        on h."id" = t."tranHeaderId"
                            where "finYearId" = %(finYearId)s
                                and "branchId" = %(branchId)s
                                and "accType" in ('A', 'L')
                                and "accLeaf" in ('Y', 'S')
                GROUP BY "accId", "dc"
        ),
        cte2 as (
            select "accId", SUM("amount") as "amount", dc
                from cte1 c
                    GROUP BY "accId", "dc"
        ), 
        cte3 as (
            select "accId", CASE WHEN "dc" = 'D' THEN "amount" ELSE -"amount" END as "amount"
                from cte2
        ), 
        cte4 as (
            select "accId", SUM("amount") as "amount"
                from cte3
                    group by "accId"
        ), 
        cte5 as (
            select "accId", CASE WHEN "amount" < 0 THEN 'C' ELSE 'D' END as "dc",
            ABS("amount") as "amount" from cte4
        ),
        cte6 as (
            update "AccOpBal" a
                set "amount" = c."amount"
                from
                    cte5 c
                        where
                            a."accId" = c."accId"
                            and a."dc" = c."dc"
                            --and 
                            and a."finYearId" = %(nextFinYearId)s
                            and a."branchId" = %(branchId)s
                    returning 1 as "result"
                ),
        cte7 as (
            insert into "AccOpBal"("accId", "finYearId", "branchId", "amount", "dc")
                select "accId", %(nextFinYearId)s, %(branchId)s, "amount", "dc"
                    from cte5 c
                        where c."accId" not in(
                            select "accId" from "AccOpBal" 
                                where "accId" = c."accId" 
                                    and "dc" = c."dc" 
                                    and "finYearId" = %(nextFinYearId)s
                                    and "branchId" = %(branchId)s)
            returning "id" as "result"
        ),
        cte8 as (
            select SUM(CASE WHEN "dc" = 'D' then t."amount" else -t."amount" end) as "amount"
                from "TranD" t
                    join "TranH" h
                        on h."id" = t."tranHeaderId"
                    join "AccM" m
                        on m."id" = t."accId"
                where
                    "finYearId" = %(finYearId)s
                    and "branchId" = %(branchId)s
                    and "accType" in ('A', 'L')
                    and "accLeaf" in ('Y', 'S')
        ), 
        cte9 as (
            select CASE WHEN "dc" = 'D' then -"amount" else "amount" end as "amount"
                from "AccOpBal" b
                    join "AccM" m
                        on m."id" = b."accId"
                    where "accCode" = 'Capital'
                        and "finYearId" = %(nextFinYearId)s
                        and "branchId" = %(branchId)s 
        ), 
        cte10 as (
            select (SELECT "amount" from cte8 a) + (SELECT "amount" from cte9 b)
                as "capital"
        ), 
        cte11 as (
            select ABS("capital") as "capital", CASE WHEN "capital" <=0 then 'D' else 'C' end as "dc"	
                from cte10
        ), 
        cte12 as (
            update "AccOpBal"
                set "amount" =(select "capital" from cte11),
                    "dc" = (select "dc" from cte11)
                where "accId" = (select "id" from "AccM" where "accCode" = 'Capital')
                and "finYearId" = %(nextFinYearId)s and "branchId" = %(branchId)s
            returning 1 as "result"
    )
    select "result" from cte12
    ''',

    "update_last_no": '''
        update "TranCounter"
        set "lastNo" = %(lastNo)s
            where "finYearId" = %(finYearId)s 
                and "branchId" = %(branchId)s
                and "tranTypeId" = %(tranTypeId)s
    ''',

    "update_last_no_auto_subledger": '''
        update "AutoSubledgerCounter"
        set "lastNo" = %(lastNo)s
            where "finYearId" = %(finYearId)s 
                and "branchId" = %(branchId)s
                and "accId" = %(accId)s
    ''',

    "update_opBal": '''
        update "AccOpBal" set "amount" = %(amount)s, "dc" = %(dc)s
                where "id" = %(id)s
    ''',

    "update_pdf_invoice": '''
        update "TranH"
            set "jData" = jsonb_set(coalesce("jData",'{}'), '{pdfSaleBill}', %(data)s, true)
                where "id" = %(id)s
    ''',

    # "update_pdf_invoice_test":'''
    #     update "Test"
    #         set "jData" = jsonb_set(coalesce("jData",'{}'), '{pdfInvoice}', %(data)s, true)
    #             where "id" = %(id)s
    # ''',

    "updateBlock_editAccount": '''
        do $$
        DECLARE children INT[];
        DECLARE oldParentId INT;
        DECLARE parentClassId INT;
        DECLARE parentAccType CHAR(1);
        DECLARE oldAccType CHAR(1);
        DECLARE parentAccLeaf CHAR(1);
        DECLARE oldAccLeaf CHAR(1);
        begin
            update "AccM" 
                set "accCode" = %(accCode)s
                , "accName" = %(accName)s
                    where "id" = %(id)s;
            
            select "parentId", "accType", "accLeaf" into oldParentId, oldAccType, oldAccLeaf
                from "AccM"
                    where "id" = %(id)s;
            if oldParentId != %(parentId)s then
                with RECURSIVE cte as (
                    select a."id",  null as "children"
                        from "AccM" a where a."id"= %(id)s
                    UNION ALL
                        select a."id", null as "children"
                            from "AccM" a 
                                inner join cte c
                                    on c."id" = a."parentId")
                    select array_agg(id) into "children" from cte;
                    
                    select "classId", "accType" into parentClassId, parentAccType 
                        from "AccM" 
                            where "id" = %(parentId)s;                    
                    
                    update "AccM" set "classId" = parentClassId, "accType" = parentAccType where id = any(children);
                    update "AccM" set "parentId" = %(parentId)s where id = %(id)s;

                    select "accLeaf" into parentAccLeaf
                        from "AccM"
                            where id = %(parentId)s;
                    
                    if parentAccLeaf = 'L' then
                        update "AccM"
                            set "accLeaf" = 'S'
                                where "id" = %(id)s;
                    elseif parentAccLeaf = 'N' then
                        if oldAccLeaf = 'S' then
                            update "AccM"
                                set "accLeaf" = 'Y'
                                    where "id" = %(id)s;
                        end if;
                    end if;
            end if;
        end $$;
    ''',

    "upsert_autoSubledger": '''
    do $$
    begin
        if exists( 
            select 1 from "ExtMiscAccM"	
                where "accId" = %(accId)s) then
                    update "ExtMiscAccM"
                        set "isAutoSubledger" = %(isAutoSubledger)s
                            where "accId" = %(accId)s;
        else
           insert into "ExtMiscAccM" ("accId", "isAutoSubledger")
                values (%(accId)s, %(isAutoSubledger)s);
        end if;
    end $$;
    ''',

    "upsert_generalSettings": '''
        do $$
        begin
            if exists( 
                select 1 from "Settings"	
                    where "key" = 'generalSettings') then
                        update "Settings"
                            set "jData" = %(jData)s
                                where "key" = 'generalSettings';
            else
            insert into "Settings" ("id", "key", "jData", "intValue")
                    values (3, 'generalSettings', %(jData)s, 0);
            end if;
        end $$;
    ''',

    "upsert_opening_stock": '''
        do $$
        begin
            if exists( 
                select 1 from "ProductOpBal"	
                    where ("productId" = %(productId)s ) and
                    ("branchId" = %(branchId)s ) and
                    ("finYearId" = %(finYearId)s ) ) then
                        update "ProductOpBal"
                            set "qty" = "qty" + %(qty)s
                                where ("productId" = %(productId)s ) and
                                    ("branchId" = %(branchId)s ) and
                                    ("finYearId" = %(finYearId)s );
            else
                insert into "ProductOpBal" ("productId", "branchId", "finYearId", "qty", "openingPrice", "lastPurchaseDate", "jData")
                        values (%(productId)s, %(branchId)s, %(finYearId)s, %(qty)s, %(openingPrice)s, %(lastPurchaseDate)s, %(jData)s);
                end if;
        end $$;
    ''',

    "upsert_unitInfo": '''
        do $$
        begin
            if exists( 
                select 1 from "Settings"	
                    where "key" = 'unitInfo') then
                        update "Settings"
                            set "jData" = %(jData)s
                                where "key" = 'unitInfo';
            else
            insert into "Settings" ("id", "key", "jData", "intValue")
                    values (2, 'unitInfo', %(jData)s, 0);
            end if;
        end $$;
    '''
}


# deprecated sql's
