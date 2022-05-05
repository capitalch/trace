#  npm uninstall react-idle-timer

##

## Required reports
1. Profitibality
2. daily sales with profitability
3. Selectable outstanding summary as op , Debits, credits, closing, remarks (storable) for accounts
## install
npm install @mui/icons-material @mui/material @mui/styles @types/lodash

## Temp email
https://tempail.com/en/

## Python Dtale

## Service SMS
#custName Sir, Warranty of your Your Sony set serial No: #serial expires soon. To avail extended warranty click #extended.
{#var#} Sir, Warranty of your Your Sony set serial No: {#var#} expires soon. To avail extended warranty click {#var#}{#var#}{#var#} - NAV
## Awe some react components libraries
1. https://github.com/brillout/awesome-react-components
2. Followed https://medium.com/@devesu/how-to-build-a-react-based-electron-app-d0f27413f17f
    for Electron React Typescript native app

# Awesome GitHub repositories
1. Awesome: https://github.com/sindresorhus/awesome
2. Free programming books: https://github.com/EbookFoundation/free-programming-books
3. Essential Javascript links: https://gist.github.com/ericelliott/d576f72441fc1b27dace/0cee592f8f8b7eae39c4b3851ae92b00463b67b9
4. gitignore several templates: https://github.com/github/gitignore
5. Frontend checklist: Everything you need to check your website like seo etc.: https://github.com/thedaviddias/Front-End-Checklist

## pyinstaller command for tkenter
# acivate env where pyinstaller is installed
pyinstaller --onefile --hidden-import "babel.numbers" --noconsole ExportService.py
create installer from innosetup

## all schemas
demounit1
capitalchowringhee
capitalelectronics
kamalikaroy
kushenclave
kushinfotech
navtechnologypvtltd
sanjeevanisystech
sushantagrawal
sushantagrawalhuf

netwoven

## Testing strategy
1. Delete all orphan entries in TranH table

// find out vouchers where SUM of debits not equal to credits
set search_path to demounit1;
with cte1 as (
select "autoRefNo", SUM(CASE WHEN "dc" = 'D' then "amount" else -"amount" end) as "amount"
    from "TranD" d join "TranH" h on h."id" = d."tranHeaderId"
        group by "autoRefNo"
)
select "autoRefNo", sum("amount") as "amount" from cte1 
    where "amount" <> 0
        group by "autoRefNo"

* Find out duplicates in AccOpBal table
    set search_path to demounit1;
    select * from (
      SELECT id,
      ROW_NUMBER() OVER(PARTITION BY "accId", "finYearId", "branchId" ORDER BY id asc) AS "noOfTimes"
      FROM "AccOpBal"
    ) dups
    where 
    dups."noOfTimes" > 1
    
// React responsive through hooks and context api
https://blog.logrocket.com/developing-responsive-layouts-with-react-hooks/

//React grid components research
1. react-table: https://github.com/tannerlinsley/react-table: Ligth weight, useTable hook, You have to give UI, Appears too much work and code
2. react-data-grid: https://github.com/adazzle/react-data-grid: limited in features
3. 

Valid GSTIN numbers for testing:
07AADCB2230M1ZV
24AADCB2230M1Z2
06AADCB2230M1ZX
37AADCB2230M2ZR

// To replace a double quote between two double quotes
1. convert json string from regex split to list of words
2. iterate through list of words check for regex match / search with r'^".*".*"$'. If a match is found then convert this string to list of chars.
	replace double quote with escaped double quote, not the first and last one.
3. recreate the json string


1. {"header":{"refNo":"s","tranDate":"2019-11-27","tags":"s","remarks":"s"},"body":{"div1":"","debits1":"","credits1":"","div3":"","div5":"","div6":"","creditAccount":"3","creditAmount":"₹ 3.00","instrNo":"","remarks":""},"debitsArray":[{"debitAccount":"3","debitAmount":"₹ 3.00","remarks":""},{"debitAccount":"3","debitAmount":"₹ 3.00","remarks":""}]}

select * from "public"."AccM" where "accLeaf" = 'Y' and "classId" in(13,14,15,16)

https://www.w3schools.com/howto/howto_js_tabs.asp

//modules
pip install requests flask graphene flask_graphql simplejson psycopg2 demjson flask_cors

//manifest.json issue. Flask server
https://stackoverflow.com/questions/57245803/how-can-flask-serve-the-react-public-files

// Many react components
https://awesomeopensource.com/project/brillout/awesome-react-components?categoryPage=6

//Treeviews
https://www.npmjs.com/package/react-simple-tree-menu
http://storybookjs.github.io/react-treebeard/
https://react-component.github.io/tree/
https://medium.com/@davidtranwd/implement-tree-view-component-with-reactjs-and-styled-components-5eea3b1603cf
https://www.npmjs.com/package/react-super-treeview


//POC's
1. Balance sheet, Trial balance display as tree
## Use following SQL recursive CTE for getting hierarchical data
Table Accm has columns id, accCode, amount, parentId
with recursive cte as (
	select "id", "accCode", "parentId", "isLedger", "amount" from "AccM"
		where "isLedger" = true
	union
		select a.id, a."accCode", a."parentId" , a."isLedger",  (a."amount" + cte."amount")::numeric(12,2) as "amount"
			from "AccM" a join cte on
				cte."parentId" = a.id
) select id, "accCode", "parentId", sum(amount )
		from cte 
			group by id, "accCode", "parentId"
				order by cte.id
## Following SQL query gives the hierarchical data along with cumulative amount. There are two tables AccM and AccTran. Table AccTran has got all transactions along with opening balances (later on). AccM is Account master with parentId for hierarchy. Using following query you can see the balance sheet. There is no amount field in AccM table.

set search_path to test;
with RECURSIVE cte as (
	select m."id", m."accCode", m."parentId", t."amount"
		from "AccTran" t
			join "AccM" m
				on t."accCode" = m."accCode"
	union
		select a.id,a."accCode", a."parentId", ( cte."amount") as "amount"
			from "AccM" a join cte on
				cte."parentId" = a.id
) select id, "accCode", "parentId", sum(amount )
		from cte 
			group by id, "accCode", "parentId"
				order by cte.id
## same query with 'd' for +ve and 'c' for -ve as double entry account system. d= debit, c= credit
with RECURSIVE cte as (
	select m."id", m."accCode", m."parentId", CASE WHEN "type" = 'd' then t."amount" else -t."amount" end as "amount" --as CASE WHEN "type" = 'd' then t."amount" else -t."amount" end
		from "AccTran" t
			join "AccM" m
				on t."accCode" = m."accCode"
	union
		select a.id,a."accCode", a."parentId", ( cte."amount") as "amount"
			from "AccM" a join cte on
				cte."parentId" = a.id
) select id, "accCode", "parentId", abs(sum(amount )), CASE WHEN sum(amount) >= 0 then 'd' else 'c' end as "type"
		from cte 
			group by id, "accCode", "parentId"
				order by cte.id

## same query with negative values instead of D or C
with RECURSIVE cte as (
    select m."id", m."accCode", m."parentId", CASE WHEN "dc" = 'D' then t."amount" else -t."amount" end as "amount" --as CASE WHEN "type" = 'd' then t."amount" else -t."amount" end
        from "TranD" t
            join "AccM" m
                on t."accId" = m."id"
    union
        select a.id,a."accCode", a."parentId", ( cte."amount") as "amount"
            from "AccM" a join cte on
                cte."parentId" = a.id
) select id, "accCode", "parentId", sum(amount )
        from cte 
            group by id, "accCode", "parentId"
                order by cte.id

## balance sheet with children
with RECURSIVE cte as (
    select m."id", m."accCode", m."parentId", CASE WHEN "dc" = 'D' then t."amount" else -t."amount" end as "amount" --as CASE WHEN "type" = 'd' then t."amount" else -t."amount" end
        from "TranD" t
            join "AccM" m
                on t."accId" = m."id"
    union
        select a.id,a."accCode", a."parentId", ( cte."amount") as "amount"
            from "AccM" a join cte on
                cte."parentId" = a.id),

cte1 as (select id, "accCode", "parentId", sum(amount ) as "amount"
        from cte 
            group by id, "accCode", "parentId"
                order by cte.id),

cte2 as (select "id", "accCode", "parentId", "amount", 
         (select array_agg(id) from cte1 where "parentId" = a."id") as children from cte1 as a)

select * from cte2


### DB design ###

1) AccM
	id(serial), accCode(text, not null), accName(text, not null), accType(char, not null, A, L, E, I), accClass(char(15, not null, sale, purchase, cash, bank, debtor, creditor,card)), parentId(serial, null)
	unique index accCode
	index accClass
	index accType
	index parentId
	self index id -> parentId with allow null

2) FinYearM
	year(numeric(4,0), pkey), startDate(date, unique), endDate(date, unique)

3) GodownM // forinventory
	id(serial), godCode(text), remarks(text), jData(jsonB) // jData has address, person etc.
	index godName
	index jData

4) Category // for Inventory
	id(serial), catName(text), parentId(int, null)
	catName index unique
	parentId self index fkey

5) ProductM // for Inventory
	id(serial), catId(int, fkey), hsn(numeric(8,0)), brandId(int, fkey), info(text), jData(JsonB), unitId(numeric(2,0), fkey) , label // label is model, jData has gst

6) BrandM // for Inventory
	id(smallint), brandName(text), remarks(text), jData(jsonB) 

7) BranchM
	id(smallInt), branchName(text), remarks(text), jData(jsonB) // jData has address, person etc. Default row as head and id = 1

7) UnitM // Unit of measurement for Inventory
	id(numeric(2,0)), unitName(text), jData(jsonB), symbol(text)

8) AccOpBal
	id(serial), accId(int, fkey, not null), finYear(numeric(4,0),fkey, not null), amount(numeric(12,2), not null), dc(char, not null)

9) TranTypeM
	id(tinyInt), tranType(text) (purchase, sale, journal, contra, payment, receipt)

10) TranH
	id(serial), tranDate(dateTime), refNo(text), remarks(text), tags(text), jData(jsonB), tranTypeId(smallInt,fkey), finYearId(numeric(4,0),fkey), branchId(smallInt,fkey)
	refNo index
	remarks index
	tags index
	jData json index

11) TranD
	id(serial), accId(int, fkey), remarks(text), dc(char), amount(numeric(12,2)), tranHeaderId(int, fkey) 
	index remarks
	index dc

12) InvD // for Inventory
	id(fkey to Trand-->id), prId(int, fkey), price(numeric(12,2)), qty(smallint), amount(numeric(12,2)), discount(numeric(12,2))

13) GstD
	id(fkey to TranD-->id), hsn(numeric(8,0)), cgstRate (numeric(5,2)),cgst(numeric(12,2)), sgstRate(numeric(5,2)), sgst(numeric(12,2)), igstRate(numeric(5,2)), igst(numeric(12,2))

14) Notes
	id(serial), remarks(text), jData(jsonB), notesDate(dateTime), brId(smallInt, fkey)
	index remarks
	index jData

15) Settings
	id(smallInt), key(text), value(text), jData(jsonB)
	index key unique
	index value
	index jData

16) TaxM (may not be there, can be provided in settings)
	id(tinyInt), taxName(text), taxPercent(numeric(5,2)), jData(jsonB)

{
    "title": "Payment voucher",
    "class": "payment-voucher1",
    "validations":[
    ],
    "items": [{
            "type": "Set",
            "name": "header",
            "class": "x-header-set",
            "validations": [],
            "items": [{
                    "type": "Text",
                    "name": "autoRefNo",
                    "placeholder": "Auto ref",
                    "htmlProps":{
                        "disabled":true
                    },
                    "label": "Auto ref1"
                },
                {
                    "type": "Text",
                    "name": "userRefNo",
                    "placeholder": "User ref",
                    "label": "User ref",
                    "validations":[
                        {
                            "name":"required",
                            "message":"This is required"
                        }
                    ]
                },
                {
                    "type": "Datepicker",
                    "name": "tranDate",
                    "placeholder": "Date",
                    "label": "Date"
                },
                {
                    "type": "Text",
                    "name": "tags",
                    "placeholder": "Comma separated tags",
                    "label": "Search tags",
                    "class": "x-tags",
                    "ibukiFilterOnMessage": "TEST-MESSAGE"
                },
                {
                    "type": "Textarea",
                    "name": "remarks",
                    "class": "x-header-remarks",
                    "placeholder": "Common remarks",
                    "label": "Common remarks"
                }
            ]
        },
        {
            "type": "Set",
            "name": "credits",
            "class": "x-credit-set",
            "validations": [],
            "items": [{
                    "type": "VoucherDebits",
                    "name": "debits1",
                    "class": "decimal-right voucher-debits",
                    "ibukiMessage": "PAYMENT-VOUCHER-DEBITS",
                    "value": ""
                },
                {
                    "type": "VoucherCredits",
                    "name": "credits1",
                    "class": "decimal-right",
                    "ibukiMessage": "PAYMENT-VOUCHER-CREDITS"
                },
                {
                    "type": "Div",
                    "class": "div3",
                    "name": "div3"
                },
                {
                    "type": "TypeSelect",
                    "name": "accId",
                    "placeholder": "Credit A/c",
                    "label": "Credit A/c (Cash / bank)",
                    "class": "x-credit-account",
                    "options": {
                        "subscriptionName": "getFilteredAccounts",
                        "args": [
                            "cash",
                            "bank",
                            "ecash"
                        ]
                    }
                },
                {
                    "type": "Money",
                    "name": "amount",
                    "placeholder": "Amount",
                    "label": "Credit amount",
                    "format": "decimal",
                    "onChange": "creditAmountChange",
                    "class": "x-credit-amount"
                },
                {
                    "type": "Text",
                    "name": "instrNo",
                    "placeholder": "Instr no",
                    "label": "Instr No",
                    "validations": []
                },
                {
                    "type": "Text",
                    "name": "lineRefNo",
                    "placeholder": "Line ref",
                    "label": "Line ref",
                    "validations": []
                },
                {
                    "type": "Textarea",
                    "name": "remarks",
                    "class": "x-credit-remarks",
                    "placeholder": "Line remarks",
                    "label": "Line remarks",
                    "validations": []
                }
            ]
        },
        {
            "type": "Range",
            "name": "debits",
            "label": "Debits",
            "layout": "table",
            "pattern": {
                "type": "Set",
                "name": "debit",
                "class": "x-range-set",
                "validations":[{
                    "name":"gstPaymentVoucherValidation",
                    "message":"GST calculation error"
                }],
                "items": [{
                        "type": "TypeSelect",
                        "name": "accId",
                        "placeholder": "Debit account",
                        "label": "Debit account",
                        "class": "x-debit-account",
                        "options": {
                            "subscriptionName": "getFilteredAccounts",
                            "args": [
                                "debtor",
                                "creditor",
                                "dexp",
                                "iexp",
                                "purchase",
                                "loan",
                                "other"
                            ]
                        }
                    },
                    {
                        "type": "Money",
                        "name": "amount",
                        "placeholder": "Amount",
                        "onChange": "debitAmountChange",
                        "label": "Debit amount",
                        "format": "decimal",
                        "class": "x-debit-amount"
                    },
                    {
                        "type": "GstControl",
                        "name": "gst",
                        "label": "Gst input",
                        "class": "x-gst",
                        "validations":[{
                            "name":"gstValidation",
                            "message":"Invalid gst"
                        }]
                    },
                    {
                        "type": "Text",
                        "name": "lineRefNo",
                        "placeholder": "Line ref",
                        "label": "Line ref",
                        "validations": []
                    }, {
                        "type": "Textarea",
                        "name": "remarks",
                        "class": "x-remarks",
                        "placeholder": "Line remarks",
                        "label": "Line remarks",
                        "validations": []
                    }
                ]
            }
        },
        {
            "type": "Submit",
            "name": "submit",
            "label": "Submit",
            "class": "x-submit",
            "methodName": "transformDataAndSubmit"
        }
    ]
}


set search_path to demounit1;
with cte as( --filter on tagId in CategoryM
    with recursive rec as (
    select id, "parentId", "tagId", "isLeaf", "catName"
        from "CategoryM"
            where "tagId" = 1
    union
    select c.id, c."parentId", rec."tagId", c."isLeaf", c."catName"
        from "CategoryM" c
            join rec on
                rec."id" = c."parentId"
    ) select * from rec where "isLeaf"
),
cte0 as( --base cte
    select "tranDate", s."productId", "tranTypeId", "qty", "price", "discount", "cgst", "sgst","igst"
        , s."amount", "gstRate", s."id" as "salePurchaseDetailsId", "autoRefNo", h."timestamp"
        , (
            select string_agg("accName", ', ')
                from "AccM" a
                    join "TranD" d
                        on a."id" = d."accId"
                    join "TranH" h1
                        on h1."id" = d."tranHeaderId"
            where h1.id = h.id and "dc" <> 'C'
        ) as "accounts"
        from "TranH" h
            join "TranD" d
                on h."id" = d."tranHeaderId"
            join "AccM" a
                        on a."id" = d."accId"
            join "SalePurchaseDetails" s
                on d."id" = s."tranDetailsId"
            --where "branchId" = %(branchId)s and "finYearId" = %(finYearId)s
            where "branchId" = 1 and "finYearId" = 2022
            --and "tranDate" <= %(endDate)s
            and "tranTypeId" in (4, 5, 9, 10)
    ), cte1 as( --from ProductOpBal where branch, finYear
        select "productId","qty", "openingPrice", "lastPurchaseDate"
            from "ProductOpBal" p 
            --where "branchId" = %(branchId)s and "finYearId" = %(finYearId)s
            where "branchId" = 1 and "finYearId" = 2022
    ), cte2 as( -- compute last purchase date and last purchase price till sale date
        select c0.*, (
            select ("price" - "discount") 
                from cte0
                    where "tranTypeId" = 5
                        and "productId" = c0."productId"
                        and "tranDate" <= c0."tranDate"
                order by "tranDate" DESC, "salePurchaseDetailsId" DESC LIMIT 1
        ) as "lastPurchasePrice"
        , (
             select "tranDate" 
                 from cte0
                     where "tranTypeId" = 5
                         and "productId" = c0."productId"
                         and "tranDate" <= c0."tranDate"
                order by "tranDate" DESC, "salePurchaseDetailsId" DESC LIMIT 1
         ) as "lastPurchaseDate"
            from cte0 c0
        where "tranTypeId" in (4, 9)
    ), cte3 as ( -- using ProductOpBal fill for missing lastPurchasePrice and lastPurchaseDate (c1 is ProductOpBal)
            select "tranDate", c2."productId", c2."qty", "price", "timestamp", "accounts"
            , coalesce("lastPurchasePrice","openingPrice") as "lastPurchasePrice"
            , coalesce(c2."lastPurchaseDate", c1."lastPurchaseDate") as "lastPurchaseDate"
            , "discount", c2."qty" * ("price" - "discount") as "aggrSale", "cgst", "sgst", "igst"
            , "amount", "gstRate", "tranTypeId","salePurchaseDetailsId", "autoRefNo"
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
            , "lastPurchaseDate", "timestamp", "accounts"
                from cte4
    ), cte6 as ( --for stock: cte0-> group by on productId, saleType, get columns as sale, ret, purchase
        select "productId","tranTypeId", 
                SUM(CASE WHEN "tranTypeId" = 4 THEN "qty" ELSE 0 END) as "sale"
                , SUM(CASE WHEN "tranTypeId" = 9 THEN "qty" ELSE 0 END) as "saleRet"
                , SUM(CASE WHEN "tranTypeId" = 5 THEN "qty" ELSE 0 END) as "purchase"
                , SUM(CASE WHEN "tranTypeId" = 10 THEN "qty" ELSE 0 END) as "purchaseRet"
            from cte0
                group by "productId", "tranTypeId" 
                order by "productId", "tranTypeId"
    ), cte7 as ( -- sum up using group by to get rid of multiple productId
        select "productId"
        , SUM("sale") as "sale"
        , SUM("saleRet") as "saleRet"
        , SUM("purchase") as "purchase"
        , SUM("purchaseRet") as "purchaseRet"
        from cte6
            group by "productId"
            order by "productId"
    ), cte8 as ( --cte7 + cte1 -> combine op bal to get opening stock figure, also compute closing stock
        select c7."productId"
            , coalesce(c1.qty,0) as "op"
            , "sale"
            , "purchase"
            , "saleRet"
            , "purchaseRet"
            , (coalesce(c1.qty,0) + "purchase" - "sale" - "purchaseRet" + "saleRet") as "stock"
                from cte7 c7
                    left join cte1 c1
                        on c1."productId" = c7."productId"
                order by "productId"
    )
        
    select c5.*, "productCode", "catName", "brandName", "label", "stock", "info" 
        --  ,(date_part('day', (CASE WHEN %(endDate)s > CURRENT_DATE then CURRENT_DATE ELSE %(endDate)s END)::timestamp - "lastPurchaseDate"::timestamp)) as "age"
        from cte5 c5
            join "ProductM" p
                on p."id" = c5."productId"
            join cte c --"CategoryM" c
                on c."id" = p."catId"
            join "BrandM" b
                on b.id = p."brandId"
            left join cte8 c8
                on c5."productId" = c8."productId"
        --where "tranDate" between %(startDate)s and %(endDate)s
            order by "tranDate", "salePurchaseDetailsId"


set search_path to demounit1;
with param as (select 0),
cte as( --filter on tagId in CategoryM
    with recursive rec as (
    select id, "parentId", "tagId", "isLeaf", "catName"
        from "CategoryM"
            where "tagId" =(select * from param) or ((select * from param) = 0)
    union all
    select c.id, c."parentId", rec."tagId", c."isLeaf", c."catName"
        from "CategoryM" c
            join rec on
                rec."id" = c."parentId"
    ) select * from rec where "isLeaf"
) select * from cte