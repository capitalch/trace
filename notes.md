# npm install primereact
# npm install react-dom@latest react@latest @types/react-dom@latest @types/react@latest @testing-library/react
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

import {
    _,
    hash,
    moment,
    NumberFormat,
    useEffect,
    useRef,
    useState,
} from '../../../../imports/regular-imports'
import { CloseSharp } from '../../../../imports/icons-import'
import {
    Button,
    IconButton,
    Input,
    List,
    ListItem,
    ListItemText,
    makeStyles,
    NativeSelect,
    Theme,
    createStyles,
} from '../../../../imports/gui-imports'
import { useSharedElements } from '../common/shared-elements-hook'

function useBankRecon() {
    const [, setRefresh] = useState({})
    const {
        accountsMessages,
        confirm,
        emit,
        execGenericView,
        filterOn,
        genericUpdateMaster,
        getCurrentEntity,
        getFromBag,
        isGoodToDelete,
        manageFormsState,
        messages,
        toDecimalFormat,
        genericUpdateMasterNoForm,
    } = useSharedElements()

    const { resetForm, resetAllFormErrors } = manageFormsState()

    const isoDateFormat = 'YYYY-MM-DD'
    const dateFormat = getFromBag('dateFormat')
    const classes = useStyles()
    const meta: any = useRef({
        isMounted: false,
        selectedBank: 'Select a bank account',
        allBanks: [],
        selectedBankId: '',
        selectedBankName: 'Select a bank',
        initialDataHash: '',
        initialData: [],
        sharedData: {},
        showDialog: false,
        dialogConfig: {
            title: '',
            formId: '',
            bankOpBalId: '',
            actions: () => {},
            content: () => <></>,
        },
    })
    const pre = meta.current
    const dialogConfig = meta.current.dialogConfig

    useEffect(() => {
        const curr = meta.current
        curr.isMounted = true
        const subs1 = filterOn('ROOT-WINDOW-REFRESH').subscribe(() => {
            emit(
                getXXGridParams().gridActionMessages.fetchIbukiMessage,
                getXXGridParams().queryArgs
            )
        })
        const subs2 = filterOn(
            getXXGridParams().gridActionMessages.deleteIbukiMessage
        ).subscribe((d: any) => {
            doDelete(d.data)
        })
        return () => {
            subs1.unsubscribe()
            subs2.unsubscribe()
            curr.isMounted = false
        }
    }, [])

    async function doDelete(params: any) {
        const row = params.row
        const tranHeaderId = row['id1']
        const options = {
            description: accountsMessages.transactionDelete,
            confirmationText: 'Yes',
            cancellationText: 'No',
        }
        if (isGoodToDelete(params)) {
            confirm(options)
                .then(async () => {
                    await genericUpdateMaster({
                        deletedIds: [tranHeaderId],
                        tableName: 'TranH',
                    })
                    emit('SHOW-MESSAGE', {})
                    emit(
                        getXXGridParams().gridActionMessages.fetchIbukiMessage,
                        null
                    )
                })
                .catch(() => {}) // important to have otherwise eror
        }
    }

    function handleCloseDialog() {
        const dialogConfig = pre.dialogConfig
        pre.showDialog = false
        pre.isMounted && resetForm(dialogConfig.formId)
        meta.current.isMounted && resetAllFormErrors(dialogConfig.formId)
        meta.current.isMounted && setRefresh({})
    }

    function getXXGridParams() {
        const columns = [
            {
                headerName: 'Ind',
                description: 'Index',
                field: 'id',
                width: 80,
                disableColumnMenu: true,
            },
            {
                headerName: 'Id',
                description: 'Id',
                field: 'id1',
                width: 90,
                valueFormatter: (params: any) =>
                    params.value ? params.value : '',
            },
            {
                headerName: 'Tr date',
                description: 'Date',
                field: 'tranDate',
                width: 120,
                type: 'date',
                valueFormatter: (params: any) =>
                    moment(params.value, isoDateFormat).format(dateFormat),
            },
            {
                headerName: 'Auto ref no',
                description: 'Auto ref no',
                field: 'autoRefNo',
                type: 'string',
                width: 150,
            },
            {
                headerName: 'Instr no',
                description: 'Instrument name',
                field: 'instrNo',
                width: 120,
            },
            {
                headerName: 'Clear date',
                width: 180,
                field: 'clearDate',
                editable: true,
                description: 'Double click to edit clear date',
                cellClassName: (params: any) =>
                    params.row.isDataChanged
                        ? 'data-changed'
                        : 'editable-column',
                renderEditCell: (params: any) => {
                    if (!params.row.clearDate) {
                        if (meta.current.crossClicked) {
                            meta.current.crossClicked = false
                        } else {
                            if (!params.row.isDataChanged) {
                                setValue(null, params.row.tranDate)
                            }
                        }
                    }
                    return (
                        <Input
                            type="date"
                            style={{ fontSize: '0.8rem' }}
                            value={params.row.clearDate}
                            onKeyDown={(e: any) => {
                                e.preventDefault() // disable edit from keyboard, it introduces error
                            }}
                            onChange={(e: any) => {
                                setValue(e)
                            }}
                            startAdornment={
                                <IconButton
                                    size="small"
                                    onClick={(e: any) => {
                                        meta.current.crossClicked = true
                                        setValue(null, '')
                                    }}>
                                    {<CloseSharp></CloseSharp>}
                                </IconButton>
                            }
                        />
                    )
                    function setValue(e: any, val: any = null) {
                        let value
                        e ? (value = e.target.value) : (value = val)
                        const filteredRows: any[] =
                            meta.current.sharedData.filteredRows
                        const row = params.row
                        const idx = filteredRows.findIndex(
                            (x: any) => x.id === row.id
                        )
                        if (filteredRows[idx].clearDate !== value) {
                            filteredRows[idx].clearDate = value
                            params.row.isDataChanged = true
                        }

                        row.clearDate = value || ''
                        const apiRef = pre.sharedData.apiRef
                        apiRef.current.setEditCellValue({
                            id: params.row.id,
                            field: 'clearDate',
                            value: value,
                        })
                    }
                },
                valueFormatter: (params: any) => {
                    return params.value
                        ? moment(params.value).format(dateFormat) || ''
                        : ''
                },
            },
            {
                headerName: 'Debit',
                description: 'Debit',
                field: 'debit',
                type: 'number',
                width: 150,
                valueFormatter: (params: any) =>
                    toDecimalFormat(String(Math.abs(params.value))),
            },
            {
                headerName: 'Credit',
                description: 'Credit',
                field: 'credit',
                type: 'number',
                width: 150,
                valueFormatter: (params: any) =>
                    toDecimalFormat(String(Math.abs(params.value))),
            },
            {
                headerName: 'Balance',
                description: 'Balance',
                field: 'balance',
                type: 'number',
                width: 170,
                valueFormatter: (params: any) => {
                    let ret
                    if (params.value) {
                        ret = toDecimalFormat(
                            String(Math.abs(params.value))
                        ).concat(' ', params.value < 0 ? 'Cr' : 'Dr')
                    } else {
                        ret = ''
                    }
                    return ret
                },
            },
            {
                headerName: 'Clear Remarks',
                description: 'Double click to edit clear remarks',
                field: 'clearRemarks',
                type: 'string',
                cellClassName: (params: any) =>
                    params.row.isDataChanged
                        ? 'data-changed'
                        : 'editable-column',
                width: 170,
                editable: true,

                renderEditCell: (params: any) => {
                    return (
                        <Input
                            value={params.row.clearRemarks}
                            style={{ paddingLeft: '0.5rem' }}
                            onFocus={(e: any) => e.target.select()}
                            onChange={(e: any) => {
                                const value = e.target.value
                                const filteredRows: any[] =
                                    meta.current.sharedData.filteredRows
                                const row = params.row
                                const idx = filteredRows.findIndex(
                                    (x: any) => x.id === row.id
                                )
                                if (filteredRows[idx].clearRemarks !== value) {
                                    filteredRows[idx].clearRemarks = value
                                    params.row.isDataChanged = true
                                }
                                row.clearRemarks = value
                                const apiRef = pre.sharedData.apiRef
                                apiRef.current.setEditCellValue({
                                    id: params.row.id,
                                    field: 'clearRemarks',
                                    value: value,
                                })
                            }}
                        />
                    )
                },
            },
            {
                headerName: 'Accounts',
                description: 'Accounts',
                field: 'accNames',
                type: 'string',
                width: 150,
            },
            {
                headerName: 'Remarks',
                description: 'Remarks',
                field: 'remarks',
                type: 'string',
                width: 150,
            },
            {
                headerName: 'Line ref',
                description: 'Line Ref no',
                field: 'lineRefNo',
                type: 'string',
                width: 150,
            },
            {
                headerName: 'Line remarks',
                description: 'Line remarks',
                field: 'lineRemarks',
                type: 'string',
                width: 150,
            },
        ]
        const queryId = 'getJson_bankRecon'
        const allRows = meta.current.reconData
        const finYearObject = getFromBag('finYearObject')
        const nextFinYearId = finYearObject.finYearId + 1
        const queryArgs = {
            accId: meta.current.selectedBankId,
            nextFinYearId: nextFinYearId,
            isoStartDate: finYearObject.isoStartDate,
            isoEndDate: finYearObject.isoEndDate,
        }
        const summaryColNames: string[] = ['debit', 'credit']
        const specialColumns = {
            isEdit: true,
            isDelete: true,
        }
        const gridActionMessages = {
            fetchIbukiMessage: 'XX-GRID-BANK-RECON-FETCH-DATA',
            calculateBalanceIbukiMessage:
                'XX-GRID-BANK-RECON-CALCULATE-BALANCE',
            editIbukiMessage: 'ACCOUNTS-LEDGER-DIALOG-XX-GRID-EDIT-CLICKED',
            deleteIbukiMessage: 'BANK-RECON-XX-GRID-DELETE-CLICKED',
            justRefreshIbukiMessage: 'XX-GRID-BANK-RECON-JUST-REFRESH',
        }
        return {
            allRows,
            columns,
            gridActionMessages,
            queryId,
            queryArgs,
            summaryColNames,
            specialColumns,
        }
    }

    async function handleOnSelectBankClick() {
        await getAllBanks()
        meta.current.dialogConfig.title = 'Select a bank'
        meta.current.dialogConfig.content = BanksListItems
        meta.current.dialogConfig.actions = () => {}
        meta.current.showDialog = true
        meta.current.isMounted && setRefresh({})

        async function getAllBanks() {
            emit('SHOW-LOADING-INDICATOR', true)
            const ret: any = await execGenericView({
                sqlKey: 'get_allBanks',
                isMultipleRows: true,
            })
            ret && (meta.current.allBanks = ret)
            emit('SHOW-LOADING-INDICATOR', false)
            meta.current.isMounted && setRefresh({})
        }

        function BanksListItems() {
            const listItems = meta.current.allBanks.map((item: any) => {
                return (
                    <ListItem
                        key={item.id}
                        onClick={() => bankSelected(item)}
                        selected
                        button>
                        <ListItemText primary={item.accName}></ListItemText>
                    </ListItem>
                )
            })
            return (
                <List component="nav" dense>
                    {listItems}
                </List>
            )

            function bankSelected(item: any) {
                meta.current.selectedBankName = item.accName
                meta.current.selectedBankId = item.id
                emit(
                    getXXGridParams().gridActionMessages.fetchIbukiMessage,
                    getXXGridParams().queryArgs
                )
                handleCloseDialog()
            }
        }
    }

    function handleOpBalanceButtonClick() {
        dialogConfig.title = `Opening balance for ${pre.selectedBankName}`
        dialogConfig.content = OpeningBalanceContent
        dialogConfig.actions = () => {}
        meta.current.showDialog = true
        pre.isMounted && setRefresh({})

        function OpeningBalanceContent() {
            const [opBalance, setOpBalance] = useState(0.0)
            const [drCr, setDrCr] = useState('C')
            const [opBalId, setOpBalId] = useState(undefined)

            useEffect(() => {
                doFetch()
            }, [])

            return (
                <div className={classes.dialogContent}>
                    <div className="items">
                        <NumberFormat
                            allowNegative={false}
                            className="numeric"
                            customInput={Input}
                            decimalScale={2}
                            fixedDecimalScale={true}
                            onFocus={(e: any) => {
                                e.target.select()
                            }}
                            onValueChange={(values: any) => {
                                const { floatValue } = values
                                setOpBalance(floatValue)
                            }}
                            thousandSeparator={true}
                            value={opBalance || 0.0}
                        />
                        <NativeSelect
                            onChange={(e: any) => setDrCr(e.target.value)}
                            style={{ width: '5rem' }}
                            value={drCr || 'C'}>
                            <option value="C">Credit</option>
                            <option value="D">Debit</option>
                        </NativeSelect>
                    </div>
                    <Button
                        variant="contained"
                        color="secondary"
                        size="small"
                        onClick={doSubmit}
                        className="submit">
                        Submit
                    </Button>
                </div>
            )

            async function doFetch() {
                emit('SHOW-LOADING-INDICATOR', true)
                let ret: any = await execGenericView({
                    isMultipleRows: false,
                    sqlKey: 'get_bank_op_balance',
                    args: {
                        accId: pre.selectedBankId,
                        finYearId: getFromBag('finYearObject')?.finYearId,
                    },
                    entityName: getCurrentEntity(),
                })
                emit('SHOW-LOADING-INDICATOR', false)
                if (ret && !_.isEmpty(ret)) {
                    setOpBalance(ret.amount)
                    setDrCr(ret.dc)
                    setOpBalId(ret.id)
                }
            }

            async function doSubmit() {
                try {
                    await genericUpdateMasterNoForm({
                        tableName: 'BankOpBal',
                        data: {
                            id: opBalId,
                            accId: pre.selectedBankId,
                            finYearId: getFromBag('finYearObject')?.finYearId,
                            amount: opBalance,
                            dc: drCr,
                        },
                    })
                    emit(
                        getXXGridParams().gridActionMessages.fetchIbukiMessage,
                        null
                    )
                    handleCloseDialog()
                } catch (e: any) {
                    console.log(e.message)
                    emit('SHOW-MESSAGE', {
                        message: messages['errorInOperation'],
                        severity: 'error',
                        duration: null,
                    })
                }
            }
        }
    }

    function getChangedData() {
        const data1 = _.orderBy(meta.current.initialData, [(item) => item.id])
        let data2 = JSON.parse(JSON.stringify(meta.current.reconData))
        data2 = _.orderBy(data2, [(item) => item.id])
        const diffObj: any[] = []
        const len = data1.length
        for (let i: number = 0; i < len; i++) {
            if (hash(data1[i]) !== hash(data2[i])) {
                const item = {
                    clearDate: data2[i].clearDate || null, // for no data provide null instead of '' because '' is not valid date value
                    clearRemarks: data2[i].clearRemarks,
                    tranDetailsId: data2[i].id,
                    id: data2[i].bankReconId,
                }
                if (!item.id) {
                    delete item.id
                }
                diffObj.push(item)
            }
        }
        return diffObj
    }

    function isDataNotChanged() {
        const hash1 =
            meta.current.reconData?.length > 0
                ? hash(meta.current.reconData)
                : ''
        const ret = meta.current.initialDataHash === hash1 ? true : false
        return ret
    }

    function doSortOnClearDateTranDateAndId(pre: any) {
        let rows: any[] = [...pre.filteredRows]
        rows = _.orderBy(rows, [
            (item: any) =>
                item.clearDate ? moment(item.clearDate) : moment('9999-01-01'),
            (item: any) =>
                item.tranDate ? moment(item.tranDate) : moment('9999-01-01'),
            'id',
        ])
        pre.isReverseOrder && rows.reverse()
        pre.filteredRows = rows
    }

    async function submitBankRecon() {
        const diffs = getDiff()
        if (diffs && diffs.length > 0) {
            emit('SHOW-LOADING-INDICATOR', true)
            const sqlObject = {
                tableName: 'ExtBankReconTranD',
                data: diffs,
            }
            const ret = await genericUpdateMasterNoForm(sqlObject)
            if (ret) {
                emit(
                    getXXGridParams().gridActionMessages.fetchIbukiMessage,
                    null
                )
            } else {
                emit('SHOW-MESSAGE', {
                    severity: 'error',
                    message: messages['errorInOperation'],
                    duration: null,
                })
            }
            emit('SHOW-LOADING-INDICATOR', false)
        } else {
        }

        function getDiff() {
            const changedData: any[] =
                meta.current.sharedData.filteredRows.filter(
                    (item: any) => item.isDataChanged
                )
            const diffObjs: any[] = changedData.map((item: any) => {
                const it = {
                    clearDate: item.clearDate || null,
                    clearRemarks: item.clearRemarks,
                    tranDetailsId: item.tranDetailsId,
                    id: item.bankReconId,
                }
                if (!it.id) {
                    delete it.id
                }
                return it
            })
            return diffObjs
        }
    }

    return {
        doSortOnClearDateTranDateAndId,
        getXXGridParams,
        handleCloseDialog,
        handleOnSelectBankClick,
        handleOpBalanceButtonClick,
        getChangedData,
        isDataNotChanged,
        meta,
        setRefresh,
        submitBankRecon,
    }
}

export { useBankRecon }

const useStyles: any = makeStyles((theme: Theme) =>
    createStyles({
        content: {
            width: '100%',
            height: '100%',
            marginTop: theme.spacing(1),
            '& .header': {
                display: 'flex',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                rowGap: theme.spacing(1),
                '& .bank': {
                    display: 'flex',
                    alignItems: 'center',
                    columnGap: theme.spacing(1),
                },
                '& .all-buttons': {
                    display: 'flex',
                    columnGap: theme.spacing(1),
                    rowGap: theme.spacing(1),
                    flexWrap: 'wrap',
                    '& .refresh': {
                        backgroundColor: 'dodgerBlue',
                        color: theme.palette.primary.contrastText,
                    },
                },
            },

            '& .xx-grid': {
                marginTop: theme.spacing(2),
                height: 'calc(100vh - 265px)',
                '& .editable-column': {
                    backgroundColor: theme.palette.yellow.light,
                    color: theme.palette.yellow.contrastText,
                },
                '& .data-changed': {
                    backgroundColor: theme.palette.orange.main,
                    color: theme.palette.orange.contrastText,
                },
            },
        },
        dialogContent: {
            display: 'flex',
            flexDirection: 'column',
            rowGap: theme.spacing(1),
            '& .items': {
                display: 'flex',
                columnGap: theme.spacing(1),
                justifyContent: 'space-between',
                '& .numeric': {
                    width: '10rem',
                    '& input': {
                        textAlign: 'end',
                    },
                },
            },
            '& .submit': {
                width: '5rem',
                marginLeft: 'auto',
                marginRight: 'auto',
            },
        },
    })
)

export { useStyles }