## Branch Transfer + others
# New design
																				- Report changes
																				- Consolidated reports for Branch incorporation
																					- Bank reconciliation
																					- BS / PL
																					- Trial bal
																				- General ledger
																					- New column Branch Code in view
																					- New column Branch Code in PDF
																					- Put branchId in sql
																					- Client side This branch / All branches
- Final accounts
	- Drill down to give effect of branches
	- Transaction report to give effect of branches
- Inventory reports
	- Stock Summary
																					- Sql to accommodate the branch
		- Branch Transfer Dr and Branch Transfer Cr info in report
		- Client side this branch /  all branches
	- Purchases
	- Sales
	- Stock Transaction
- DB changes deployment script
- Deploy in all databases and BU's
																					- Preview
																						- Create preview PDF
																							- Footer
																							- Product
																							- price right aligned
																							- amount
																							- serial No
																					- Delete
																							- Delete an entire record from TranH
																							- DB: Cascade delete for BranchTransfer table

																							- Security of submit button in branch transfer

																							- Provide SearchBox in BS and PL																			
																							- In sale invoices payment remarks is not there in print preview For Institution sales and autosubledger sales
																							- In sale invoice print preview if autosubledger then also give subledger ac no
																							- View grid
																								- Show data
																								- Create SQL for view
																						- Submit functionality
																							- Edit
																								- Amount update
																								- Come back to view after save
																								- Load branch transfer from DB on id
																								- Populate branch transfer
																								- Submit
	
																							- Delete
																								- deleted IDs populate
																								- submit
																							- Load data on tab change
																							- Dest branch should not have current branch
																							- Line item correction
																							- BranchTransferStore correction
																							- Validations
																								- Dest branch
																								- qty != 0
																								- productId should be there
																								- Date
																							- Error management
																							- Reset functionality
																							- Insert
																								- Price is not happening when item is obtained from search
																							- DB changes
## Immediate to Do
																								- Remove and delete database of bika and all its users and clean the database
- Maintenance
																								- Part 1
																									- Create an admin user sanjeev using temp email and a database bille
																									- Create a BU billenium
																									- Create some inventory and check inv reports. That will not be coming
																									- Update database with latest patch and check inventory reports
																									- Do corrective actions
																								- Part 2
																								- delete the new admin user and new database
																								- using pg_dump create the new accounts.sql file
																								- update code at server
																								- repeat part 1
																								- create new accounts
																								- create new products

																							- Create new client and new admin user
																								- Setup inventory
																								- Check why not audit_table is created and rectify that
																								- Check why sales report are not visible and rectify that
																								- Check why stock transaction not visible

##  Bugs
																								- Reset purchase and purchase ret after drill down from trial balance. Otherwise on Purchase it shows the populated values
																								- PurchPurchase entry saved but not reset
																								- Purchase return from purchase wrong behavior
## Plan for Checkup
																								- delete all purchase and purchase return
																								- New purchase entry
																									- Check trial balance
																									- Enter purchase invoice
																									- Verify trial balance
																									- Verify GST report
																									- Verify stock
																								- New purchase Return entry
																									- Check trial balance
																									- Enter purchase invoice
																									- Verify trial balance
																									- Verify GST report
																									- Verify stock
																								- New purchase return from purchase entry
																									- Check trial balance
																									- Enter purchase invoice
																									- Verify trial balance
																									- Verify GST report
																									- Verify stock
																								- Delete Purchase Return entry
																									- Check trial balance
																									- Enter purchase invoice
																									- Verify trial balance
																									- Verify GST report
																									- Verify stock
																								- Delete Purchase Return entry
																									- Check trial balance
																									- Enter purchase invoice
																									- Verify trial balance
																									- Verify GST report
																									- Verify stock
																								- Delete purchase Entry
																									- Check trial balance
																									- Enter purchase invoice
																									- Verify trial balance
																									- Verify GST report
																									- Verify stock
## Purchases new
- When prod code is given sometimes wrong selection. Say for prod code 11 the prod code 1013 is selected
																								- Drill down from balance sheet, trial balance, ledgers
																									- Prevent multi load purchase
																									- Close on submit and reset

																									- Bug: When edit purchase Ret, it becomes purchase

- Final thorough checkup with a new entry and then delete
																									## Debit note / Credit note view not working. Giving errors
## QA script
																									- Delete all purchase invoices
																									- Select a physical invoice and create all products
																									- Check Stock inventory and trial balance figures and write them down

																									- Add entries for invoice. Verify trial balance and inventory: OK
																									- Verify entry in table ExtTanDGst table: OK

																									- Create normal purchase return and verify trial balance and inventory: ok
																									- Verify entry in table ExtGstTranD table:OK
																									- Delete purchase return and verify entries as above: OK

																									- Do purchase return after selecting an already entered invoice
																									- Verify trial balance and inventory
																									- delete purchase return and verify entries

## Purchase
- Security in purchase
																									- salePurchaseDeletedIds if empty array then save error at server
																									- Purchase delete of lineItem not working. Row still remains in SalePurchaseDetails table
																									- Sum of item values has floating point approximations. Use big.js
																									- Purchase edit: Total amount at bottom is not changing
																									- Purchase view index should be serially ASC

																									- purchase ret
																									- submit for insert, update and delete
																									- Exhaustive check
																									- Column Account: Inter Photo, Capital Photo etc.
																									- delete				
																									- Descr column at end
																									- Change icons to PDF and EXCEL icons				
																									- Serial numbers not working
																									- Total amt vs invoice amount not tallying in case of Inter foto
																									- edit
																									- Search
																									- No of rows select
																									- Export pdf
																									- Export Excel
																									- Refresh
																									- Column Aggr, Gst's, Remarks
																									- wrap text
																									- numeric, rignt aligned
																									- date format
																									- Attach columns and data
																									- summary: Aggregate (count, Sum aggr, sum cgst, sgst, igst, amount, )
																									- columns: labels, Serial numbers, product codes, hsn

## stock summary sql
set search_path to demounit1;
with "branchId" as (values(null::int)), "finYearId" as (values (2024)),"tagId" as (values(0)), "onDate" as (values(CURRENT_DATE)), "isAll" as (values(true)), "days" as (values(0)), "type" as (values('cat')), "value" as (values(0)),
        --with "branchId" as (values(%(branchId)s::int)), "finYearId" as (values (%(finYearId)s::int)), "onDate" as (values(%(onDate)s ::date)), "isAll" as (values(%(isAll)s::boolean)), "days" as (values(%(days)s::int)), "type" as (values (%(type)s::text)), "value" as (values (%(value)s::int)),     
		"cteProduct" as (select * from get_productids_on_brand_category_tag((table "type") , (table "value") )),
		cte0 as( --base cte used many times in next
            select h."id", "productId", "tranTypeId", "qty", ("price" - "discount") "price", "discount", "tranDate", '' as "dc"
                from "TranH" h
                    join "TranD" d
                        on h."id" = d."tranHeaderId"
                    join "SalePurchaseDetails" s
                        on d."id" = s."tranDetailsId"
                where 
					--"branchId" = (table "branchId") 
					(COALESCE((TABLE "branchId"), "branchId") = "branchId")
					and "finYearId" =(table "finYearId")
                    and "tranDate" <= coalesce((table "onDate"), CURRENT_DATE)
                        union all --necessary otherwise rows with same values are removed
            select h."id", "productId", "tranTypeId", "qty", "price", 0 as "discount", "tranDate", "dc"
                from "TranH" h
                    join "StockJournal" s
                        on h."id" = s."tranHeaderId"
                where 
					--"branchId" = (table "branchId") 
					(COALESCE((TABLE "branchId"), "branchId") = "branchId")
					and "finYearId" =(table "finYearId")
                    and "tranDate" <= coalesce((table "onDate"), CURRENT_DATE)
						union all -- for branchTransfer credits
			select h."id", "productId", "tranTypeId", "qty", "price", 0 as "discount", "tranDate", 'C' as "dc"
                from "TranH" h
                    join "BranchTransfer" b
                        on h."id" = b."tranHeaderId"
                where 
					--"branchId" = (table "branchId") 
					(COALESCE((TABLE "branchId"), "branchId") = "branchId")
					and "finYearId" =(table "finYearId")
                    and "tranDate" <= coalesce((table "onDate"), CURRENT_DATE)
            )
			, cte1 as ( -- opening balance
                select "productId", SUM("qty") as "qty", MAX("openingPrice") as "openingPrice", MAX("lastPurchaseDate") as "lastPurchaseDate"
                    from "ProductOpBal" p 
                where 
					--"branchId" = (table "branchId") 
					(COALESCE((TABLE "branchId"), "branchId") = "branchId")
					and "finYearId" =(table "finYearId")
				GROUP BY "productId"
            ),
			cte00 as ( -- add lastTranPurchasePrice
			select c0.*,
				(
					select DISTINCT ON("productId") "price"
						 from cte0
							 where ("tranTypeId" in(5,11)) and ("tranDate" <= c0."tranDate") and ("productId" = c0."productId") and (c0."price" is not null) and (c0."price" <> 0)
								 order by "productId", "tranDate" DESC, "id" DESC
				) as "lastTranPurchasePrice",
				"openingPrice"
					from cte0 c0
						left join cte1 p
							on p."productId" = c0."productId"
								--where p."finYearId" = (table "finYearId")
			)
			, cte000 as ( --add gross profit
				select cte00.*,
				CASE 
					WHEN "tranTypeId" = 4 --sale
						THEN "qty" * ("price" - "discount" - COALESCE("lastTranPurchasePrice", "openingPrice")) 
					WHEN "tranTypeId" = 9 --sale return
						THEN -("qty" * ("price" - "discount" - COALESCE("lastTranPurchasePrice", "openingPrice")))
					ELSE
						0
				END
				as "grossProfit"
					from cte00
			), cte2 as ( -- create columns for sale, saleRet, purch... Actually creates columns from rows
                select "productId","tranTypeId", 
                    SUM(CASE WHEN "tranTypeId" = 4 THEN "qty" ELSE 0 END) as "sale"
                    , SUM(CASE WHEN "tranTypeId" = 9 THEN "qty" ELSE 0 END) as "saleRet"
                    , SUM(CASE WHEN "tranTypeId" = 5 THEN "qty" ELSE 0 END) as "purchase"
                    , SUM(CASE WHEN "tranTypeId" = 10 THEN "qty" ELSE 0 END) as "purchaseRet"
                    , SUM(CASE WHEN ("tranTypeId" = 11) and ("dc" = 'D') THEN "qty" ELSE 0 END) as "stockJournalDebits"
                    , SUM(CASE WHEN ("tranTypeId" = 11) and ("dc" = 'C') THEN "qty" ELSE 0 END) as "stockJournalCredits"
                    , MAX(CASE WHEN "tranTypeId" = 4 THEN "tranDate" END) as "lastSaleDate"
                    , MAX(CASE WHEN "tranTypeId" in(5,11) THEN "tranDate" END) as "lastPurchaseDate" --Purchase or stock journal
					, SUM(CASE WHEN "tranTypeId" = 4 THEN "grossProfit" WHEN "tranTypeId" = 9 THEN -"grossProfit" ELSE 0 END) as "grossProfit"
                    from cte000
                group by "productId", "tranTypeId" order by "productId", "tranTypeId"
            )
			, cte3 as ( -- sum columns group by productId
                select "productId"
                , coalesce(SUM("sale"),0) as "sale"
                , coalesce(SUM("purchase"),0) as "purchase"
                , coalesce(SUM("saleRet"),0) as "saleRet"
                , coalesce(SUM("purchaseRet"),0) as "purchaseRet"
                , coalesce(SUM("stockJournalDebits"),0) as "stockJournalDebits"
                , coalesce(SUM("stockJournalCredits"),0) as "stockJournalCredits"
				, coalesce(SUM("grossProfit"),0) as "grossProfit"
                , MAX("lastSaleDate") as "lastSaleDate"
                , MAX("lastPurchaseDate") as "lastPurchaseDate"
                from cte2
                    group by "productId"
            )
			, cte4 as ( -- join opening balance (cte1) with latest result set
                select coalesce(c1."productId",c3."productId")  as "productId"
                , coalesce(c1.qty,0) as "op"
                , coalesce("sale",0) as "sale"
                , coalesce("purchase",0) as "purchase"
                , coalesce("saleRet", 0) as "saleRet"
                , coalesce("purchaseRet", 0) as "purchaseRet"
                , coalesce("stockJournalDebits", 0) as "stockJournalDebits"
                , coalesce("stockJournalCredits", 0) as "stockJournalCredits"
                , coalesce(c3."lastPurchaseDate", c1."lastPurchaseDate") as "lastPurchaseDate"
				, coalesce("grossProfit",0) as "grossProfit"
                , "openingPrice", "lastSaleDate"
                    from cte1 c1
                        full join cte3 c3
                            on c1."productId" = c3."productId"
            )
			, cte5 as ( -- get last purchase price for transacted products
                select DISTINCT ON("productId") "productId", "price" as "lastPurchasePrice"
                    from cte0
                        where "tranTypeId" = 5
                            order by "productId", "tranDate" DESC
            )
			, cte6 as (  -- combine last purchase price with latest result set and add clos column and filter on lastPurchaseDate(ageing)
                select coalesce(c4."productId", c5."productId") as "productId"
                    , coalesce("openingPrice",0) as "openingPrice", "op", coalesce("op"* "openingPrice",0)::numeric(12,2) "opValue", "sale", "purchase", "saleRet","purchaseRet","stockJournalDebits", "stockJournalCredits", coalesce("lastPurchasePrice", "openingPrice") as "lastPurchasePrice","lastPurchaseDate","lastSaleDate"
                    , coalesce("op" + "purchase" - "purchaseRet" - "sale" + "saleRet" + "stockJournalDebits" - "stockJournalCredits",0) as "clos"
					, "grossProfit"
                    from cte4 c4
                        full join cte5 c5
                            on c4."productId" = c5."productId"
                    where date_part('day', CURRENT_DATE::timestamp - coalesce("lastPurchaseDate"::timestamp, (CURRENT_DATE-360)::timestamp) ) >= coalesce((table "days"),0)
            )
			, cte7 as ( -- combine latest result set with ProductM, CategoryM and BrandM tables to attach catName, brandName, label
                select p."id" as "productId", "productCode", "catName", "brandName", "label","openingPrice", coalesce("op",0)::numeric(10,2) as "op","opValue"
                , (coalesce("purchase",0) + coalesce("saleRet",0) + coalesce("stockJournalDebits",0))::numeric(10,2) as "dr", (coalesce("sale",0) + coalesce("purchaseRet",0) + coalesce("stockJournalCredits",0)):: numeric(10,2) as "cr",
                coalesce("sale",0)::numeric(10,2) as "sale", coalesce("purchase",0)::numeric(10,2) as "purchase", coalesce("saleRet",0)::numeric(10,2) as "saleRet", coalesce("purchaseRet",0)::numeric(10,2) as "purchaseRet", coalesce("stockJournalDebits",0)::numeric(10,2) as "stockJournalDebits", coalesce("stockJournalCredits",0)::numeric(10,2) as "stockJournalCredits", coalesce("clos",0)::numeric(10,2) as "clos", "lastPurchasePrice", ("clos" * "lastPurchasePrice")::numeric(12,2) as "closValue"
                        , "lastPurchaseDate", "lastSaleDate" 
                ,(date_part('day',coalesce((table "onDate"), CURRENT_DATE)::timestamp - "lastPurchaseDate"::timestamp)) as "age", "info", "grossProfit"
                    from cte6 c6
                        right join "cteProduct" p
                            on p."id" = c6."productId"
                        join "CategoryM" c
                            on c."id" = p."catId"
                        join "BrandM" b
                            on b."id" = p."brandId"
                    where ((NOT(("clos" = 0) and ("op" = 0) and ("sale" = 0) and ("purchase" = 0) and ("saleRet" = 0) and ("purchaseRet" = 0) and ("stockJournalDebits" = 0) and("stockJournalCredits" = 0))) 
                        OR (table "isAll"))
                order by "catName", "brandName", "label"
                ) select * from cte7