allSqls = {
    "create_branch": '''
        insert into "BranchM" ("id", "branchCode", "branchName")
	        values((select MAX("id") + 1 from "BranchM")
                , %(branchCode)s, %(branchName)s)
                    returning "id"
    ''',

    "get_accountsMaster":'''
        select a.*, "accClass"
            from "AccM" a
                join "AccClassM" c
                    on c."id" = a."classId"
                        order by a."id"
    ''',

    "get_accountsLedger": ''' -- fin
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
            , t."remarks" as "lineRemarks"
            , "lineRefNo"
            , "instrNo"
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

    'get_allBanks':'''
        select a."id", "accName"
            from "AccM" a 
                join "AccClassM" c
                    on c."id" = a."classId"			
        where "accClass" = 'bank'
            and "accLeaf" in ('Y', 'S')
    ''',

    'get_allTransactions':'''
        select ROW_NUMBER() over (order by h."id" DESC) as "index"
            , h."id", to_char(h."tranDate", %(dateFormat)s) as "tranDate"
            , h."autoRefNo", h."userRefNo", h."remarks"
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
            order by "id" DESC
    ''',

    'get_allTransactions_download':'''
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

    "get_branches": '''
    select "id", "branchCode", "branchName", "remarks"
        from "BranchM"
            order by "id"
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

    "get_tranHeaders_details": ''' --fin
        select h."id" as "tranHeaderId", "tranDate", "autoRefNo", "tags", d."id" as "tranDetailsId",
             h."remarks" as "headerRemarks" , "userRefNo", "accName", "dc", d."remarks" as "lineRemarks",
             "amount", "lineRefNo", "instrNo", "tranTypeId", d."instrNo"
            from "TranH" h 
                join "TranD" d
                    on h."id" = d."tranHeaderId"				
                join "AccM" a
                    on a."id" = d."accId"		
		where "tranTypeId" = %(tranTypeId)s 
            and h."id" in (select "id" from "TranH" 
                order by id DESC limit %(no)s)
            and "finYearId" = %(finYearId)s 
            and "branchId" = %(branchId)s
            order by h."id" DESC, "tranDate", d."id" ''',

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

    "getSet_lastVoucherNo": "select get_set_last_voucher_no(%s, %s, %s, %s)",

    "getJson_accountsMaster_groups_ledgers": '''
       with cte1 as (
            select a."id", "accCode", "accName", "parentId", "accType", "isPrimary", "accLeaf","classId", "accClass"
            , (select array_agg(id) from "AccM" m where a."id" = m."parentId" ) as "children"
            , (select "finYearId"
                from "TranH" h join "TranD" d
                    on h."id" = d."tranHeaderId" where "accId" = a."id" limit 1) as "accTranYear"
            , (select true from "AccOpBal" where "accId" = a."id" limit 1) as "accOpBal"
                from "AccM" a join "AccClassM" c
                    on a."classId" = c."id" order by "accType", "accName", a."id"
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
    "getJson_bankRecon":'''
        with cte1 as (select d."id"
            , "tranDate"
            , "userRefNo"
            , d."remarks"
            , "autoRefNo"
            , "lineRefNo"
            , "instrNo"
            , d."remarks" as "lineRemarks"
            , x."id" as "bankReconId"
            , x."tranDetailsId"
            , CASE WHEN "dc" = 'D' then "amount" ELSE 0 END as "credit"
            , CASE WHEN "dc" = 'C' then "amount" ELSE 0 END as "debit"
            , x."clearDate", "clearRemarks"
                from "TranD" d
                    left outer join "ExtBankReconTranD" x
                        on d."id" = x."tranDetailsId"
                    join "TranH" h
                        on h."id" = d."tranHeaderId"
            where "accId" = %(accId)s
                and "branchId" = %(branchId)s
                and "finYearId" = %(finYearId)s
            order by "id"
        ), 
        cte2 as (
            select "id", "amount", "dc"
                from "BankOpBal"
                    where "accId" = %(accId)s
                        and "finYearId" = %(finYearId)s
        ), 
        cte3 as (
            select "id", "amount", "dc"
                from "BankOpBal"
                    where "accId" = %(accId)s
                        and "finYearId" = %(nextFinYearId)s
        )
        select json_build_object(
            'bankRecon', (SELECT json_agg(row_to_json(a)) from cte1 a)
            , 'opBal', (SELECT row_to_json(b) from cte2 b)
            , 'closBal', (SELECT row_to_json(c) from cte3 c)
        ) as "jsonResult"
    ''',

    "getJson_branchCode_tranCode":'''
        select json_build_object(
			'branchCode', (select "branchCode" from "BranchM" where "id" = %(branchId)s)
			, 'tranCode', (select "tranCode" from "TranTypeM" where "id" = %(tranTypeId)s)
		) as "jsonResult"
    ''',

    "getJson_datacache": '''
        with cte1 as (
            SELECT a.*, c."accClass" FROM "AccM" 
            a join "AccClassM" c on a."classId" = c."id"
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

    "getJson_tranHeader_details": '''
        with cte1 as (
            select "id", "tranDate", "autoRefNo", "tags", 
                    "remarks" , "userRefNo", "tranTypeId"
            from "TranH"		
                where "id" = %(id)s
        ),
        cte2 as (
            select "id", "accId", "remarks", "dc", "amount", "tranHeaderId", "lineRefNo", "instrNo"
                from "TranD"
                    where "tranHeaderId" = %(id)s
        )
        SELECT
            json_build_object(
                'tranHeader', (SELECT (row_to_json(a)) from cte1 a)
                , 'tranDetails', (SELECT json_agg(row_to_json(b)) from cte2 b)
            ) as "jsonResult"
    ''',

    "insert_opBal": '''    
        insert into "AccOpBal" ("accId","finYearId","amount","dc", "branchId")
                values (%(accId)s, %(finYearId)s, %(amount)s, %(dc)s, %(branchId)s)
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
                            union --"TranD"
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

            delete from "AccOpBal"
                where "finYearId" = %(nextFinYearId)s													--change
                    and "branchId" = %(branchId)s;														--change

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
    
    "transfer_closingBalance_cte_way":'''
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

    "update_opBal": '''
        update "AccOpBal" set "amount" = %(amount)s, "dc" = %(dc)s
                where "id" = %(id)s
    ''',

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
#  "get_opBal1": '''    -- fin
#         select a."id" as "accMId", op."id" as "opId",  "accType", "accId","accLeaf", "accName", CASE WHEN dc='D' then "amount" else 0  END as "debit", CASE WHEN dc='C' then "amount" else 0 end as "credit"
#             from "AccM" a left outer join "AccOpBal" op
#                 on a."id" = op."accId"
#                     where "accType" in ('A', 'L')
#                         and "accLeaf" in ('Y', 'S')
#                         and "finYearId" = %(finYearId)s 
#                         and "branchId" = %(branchId)s
#                             order by "accType","accLeaf", "accName"
#     ''',