import { Typography } from '@mui/material'
import { _, Box, CloseSharp, GridCellParams, IconButton, manageEntitiesState, moment, useEffect, useIbuki, useRef, useState, useTheme, utils, utilMethods } from '../redirect'

function useSalesReport() {
    const [, setRefresh] = useState({})
    const { execGenericView, toDecimalFormat } = utilMethods()
    const { toCurrentDateFormat, getGridReportSubTitle } = utils()
    const { debounceFilterOn, emit, filterOn } = useIbuki()
    const theme = useTheme()
    const { getFromBag } = manageEntitiesState()
    const finYearObject = getFromBag('finYearObject')
    const isoFormat = 'YYYY-MM-DD'
    // const dateFormat = getFromBag('dateFormat')

    const meta: any = useRef({
        allRows: [],
        debounceMessage: 'SALES-REPORT-SEARCH-DEBOUNCE',
        endDate: moment().format(isoFormat),
        filteredRows: [],
        getTotals: getTotals,
        isSearchTextEdited: false,
        searchText: '',
        searchTextRef: null,
        selectedOption: { label: 'Today', value: 'today' },
        selectedTagOption: { label: 'All', value: 0 },
        setRefresh: setRefresh,
        sqlKey: 'get_sale_report',
        startDate: moment().format(isoFormat),
        subTitle: '',
        title: 'Sales',
        totals: {},
    })
    const pre = meta.current

    useEffect(() => {
        if (pre.isSearchTextEdited && pre.searchTextRef.current) {
            pre.searchTextRef.current.focus()
        }
    })

    useEffect(() => {
        pre.subTitle = getGridReportSubTitle()
        fetchData()
        const subs1 = debounceFilterOn(pre.debounceMessage).subscribe((d: any) => {
            const requestSearch = d.data[0]
            const searchText = d.data[1]
            requestSearch(searchText)
        })
        const subs2 = filterOn('TRACE-SERVER-SALES-ADDED-OR-UPDATED').subscribe(() => fetchData(false))
        return (() => {
            subs1.unsubscribe()
            subs2.unsubscribe()
        })
    }, [])

    async function fetchData(showWaitCursor: any = true) {
        showWaitCursor && emit('SHOW-LOADING-INDICATOR', true)
        const rows = await execGenericView({
            isMultipleRows: true,
            sqlKey: pre.sqlKey,
            args: {
                startDate: pre.startDate,
                endDate: pre.endDate,
                tagId: pre.selectedTagOption.value
            },
        }) || []
        setId(rows)
        pre.allRows = rows
        pre.filteredRows = rows.map((x: any) => ({ ...x })) //its faster
        pre.totals = getTotals() || {}
        pre.filteredRows.push(pre.totals)
        emit('SHOW-LOADING-INDICATOR', false)
        setRefresh({})

        function setId(rows: any[]) {
            let count = 1
            for (const row of rows) {
                row.id1 = row.id
                row.id = incr()
            }
            function incr() {
                return (count++)
            }
        }
    }

    function getSalesPeriodOptions() {
        const periods: { label: string; value: any }[] = [{ label: 'All', value: 'all' }, { label: 'Today', value: 'today' }, { label: 'Prev day', value: 'prevDay' }, { label: 'This month', value: 'thisMonth' }, { label: 'Prev month', value: 'prevMonth' }]
        const months: { label: string; value: any }[] = [{ label: 'April', value: 4 }, { label: 'May', value: 5 }, { label: 'June', value: 6 }, { label: 'July', value: 7 }, { label: 'August', value: 8 },
        { label: 'September', value: 9 }, { label: 'October', value: 11 }, { label: 'November', value: 11 }, { label: 'December', value: 12, },
        { label: 'January', value: 1 }, { label: 'February', value: 2 }, { label: 'March', value: 3 },]
        return (periods.concat(months))
    }

    async function handleOptionSelected(selectedOption: { label: string; value: any }) {
        pre.selectedOption = selectedOption
        let value = selectedOption.value

        Number.isInteger(value) ? execNumLogic(value) : execStringlogic(value)
        await fetchData()
        function execNumLogic(val: number) {
            const finYearId = finYearObject.finYearId
            const isoStartDate = finYearObject.isoStartDate
            const finStartMonth = moment(isoStartDate).get('month') + 1
            const y = (val < finStartMonth) ? finYearId + 1 : finYearId
            const m = val < 10 ? '0' + val : '' + val
            const isoDate = ''.concat(y + '', '-', m, '-', '01')
            const startDate = moment(isoDate).startOf('month').format(isoFormat)
            const endDate = moment(isoDate).endOf('month').format(isoFormat)
            pre.startDate = startDate
            pre.endDate = endDate
        }

        function execStringlogic(val: string) {
            const obj: any = {
                'all': () => {
                    pre.startDate = finYearObject.isoStartDate
                    pre.endDate = finYearObject.isoEndDate
                },
                'today': () => {
                    pre.startDate = moment().format('YYYY-MM-DD')
                    pre.endDate = pre.startDate
                },
                'prevDay': () => {
                    pre.startDate = moment().subtract(1, 'days').format('YYYY-MM-DD')
                    pre.endDate = pre.startDate
                },
                'thisMonth': () => {
                    pre.startDate = moment().startOf('month').format('YYYY-MM-DD')
                    pre.endDate = moment().endOf('month').format('YYYY-MM-DD')
                },
                'prevMonth': () => {
                    pre.startDate = moment().subtract(1, 'month').startOf('month').format('YYYY-MM-DD')
                    pre.endDate = moment().subtract(1, 'month').endOf('month').format('YYYY-MM-DD')
                }
            }
            obj[val]()
        }
    }

    async function handleSelectedTagOption(selectedTagOption: any) {
        pre.selectedTagOption = selectedTagOption
        await fetchData()
        setRefresh({})
    }

    function getColumns(): any[] {
        return ([
            {
                headerName: 'H',
                description: 'Hide',
                disableColumnMenu: true,
                disableExport: true,
                disableReorder: true,
                filterable: false,
                hideSortIcons: true,
                resizable: false,
                width: 10,
                field: '0',
                renderCell: (params: GridCellParams) => {
                    return (
                        <IconButton
                            title='Hide this row'
                            size="small"
                            color="primary"
                            onClick={() => removeRow(params)}
                            aria-label="hide">
                            <CloseSharp fontSize='small' />
                        </IconButton>
                    )
                },
            },

            {
                headerName: '#',
                headerClassName: 'header-class',
                description: 'Index',
                field: 'id',
                width: 65,
            },
            {
                headerName: 'Sale date',
                headerClassName: 'header-class',
                description: 'Sale date',
                field: 'tranDate',
                type: 'date',
                width: 95,
                valueFormatter: (params: any) => toCurrentDateFormat(params.value || '')
            },
            {
                headerName: 'Ref no | Accounts',
                headerClassName: 'header-class',
                description: 'Ref no',
                field: 'autoRefNo',
                width: 165,
                renderCell: (params: any) => <RefNoAccounts params={params} />
            },
            {
                headerName: 'Pr code',
                headerClassName: 'header-class',
                description: 'Product code',
                field: 'productCode',
                width: 80,
            },
            {
                headerName: 'Product',
                headerClassName: 'header-class',
                description: 'Product',
                field: '1',
                renderCell: (params: any) => <Product params={params} />,
                valueGetter: (params:any) => `${params.row.catName} ${params.row.brandName} ${params.row.label}`,
                width: 200,
            },
            {
                headerName: 'Details',
                headerClassName: 'header-class',
                description: 'Product details',
                field: 'info',
                renderCell: (params: any) => <ProductDetails params={params} />,
                width: 300,
            },
            {
                headerName: 'Qty',
                headerClassName: 'header-class',
                description: 'Qty',
                field: 'qty',
                type: 'number',
                width: 45,
            },
            {
                headerName: 'Stock',
                headerClassName: 'header-class',
                description: 'Stock',
                field: 'stock',
                type: 'number',
                width: 60,
            },
            {
                headerName: 'Age',
                headerClassName: 'header-class',
                description: 'Age of product sold',
                field: 'age',
                type: 'number',
                width: 65,
            },
            {
                headerName: 'Profit(GP)',
                headerClassName: 'header-class',
                description: 'Gross profit',
                field: 'grossProfit',
                type: 'number',
                width: 100,
                valueFormatter: (params: any) => toDecimalFormat(params.value),
            },
            {
                headerName: 'Sale(Gst)',
                headerClassName: 'header-class',
                description: 'Sale with gst',
                field: 'amount',
                type: 'number',
                width: 110,
                valueFormatter: (params: any) => toDecimalFormat(params.value),
            },
            {
                headerName: 'Sale(Aggr)',
                headerClassName: 'header-class',
                description: 'Aggregate sale',
                field: 'aggrSale',
                type: 'number',
                width: 110,
                valueFormatter: (params: any) => toDecimalFormat(params.value),
            },
            {
                headerName: 'Sale Price',
                headerClassName: 'header-class',
                description: 'Sale price',
                field: 'price',
                type: 'number',
                width: 110,
                valueFormatter: (params: any) => toDecimalFormat(params.value),
            },
            {
                headerName: 'Pur Price',
                headerClassName: 'header-class',
                description: 'Purchase price',
                field: 'lastPurchasePrice',
                type: 'number',
                width: 110,
                valueFormatter: (params: any) => toDecimalFormat(params.value),
            },
            {
                headerName: 'Gst%',
                headerClassName: 'header-class',
                description: 'Gst rate',
                field: 'gstRate',
                type: 'number',
                width: 60,
            },
            {
                headerName: 'Cgst',
                headerClassName: 'header-class',
                description: 'Cgst',
                field: 'cgst',
                type: 'number',
                width: 110,
                valueFormatter: (params: any) => toDecimalFormat(params.value),
            },
            {
                headerName: 'Sgst',
                headerClassName: 'header-class',
                description: 'Sgst',
                field: 'sgst',
                type: 'number',
                width: 110,
                valueFormatter: (params: any) => toDecimalFormat(params.value),
            },
            {
                headerName: 'Igst',
                headerClassName: 'header-class',
                description: 'Igst',
                field: 'igst',
                type: 'number',
                width: 110,
                valueFormatter: (params: any) => toDecimalFormat(params.value),
            },
            {
                headerName: 'Type',
                headerClassName: 'header-class',
                field: 'saleType',
                width: 60
            },
            {
                headerName: 'Time',
                description: 'Time',
                headerClassName: 'header-class',
                field: 'timestamp',
                type: 'date',
                width: 100,
                valueFormatter: (params: any) => params.value ? moment(params.value).format('hh:mm:ss A') : ''
            },
            {
                headerName: 'Pr id',
                description: 'Product id',
                headerClassName: 'header-class',
                field: 'productId',
                type: 'number',
                width: 80,
            },
        ])
    }

    function getGridSx() {
        return (
            {
                p: 1,
                width: '100%',
                fontSize: theme.spacing(1.7),
                minHeight: theme.spacing(70),
                height: 'calc(100vh - 230px)',
                fontFamily: 'sans-serif',
                '& .footer-row-class': {
                    backgroundColor: theme.palette.grey[300]
                },
                '& .header-class': {
                    fontWeight: 'bold',
                    color: 'green',
                    fontSize: theme.spacing(1.8),
                },
                '& .grid-toolbar': {
                    width: '100%',
                    paddingBottom: theme.spacing(0.5),
                    borderBottom: '1px solid lightgrey',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'start'
                },
                '& .row-sales-return': {
                    color: theme.palette.error.light
                },
                '& .row-loss': {
                    color: theme.palette.error.main
                },
                '& .row-jakar': {
                    color: 'dodgerBlue'
                }
            }
        )
    }

    function getRowClassName(e: any) {
        const row = e?.row || {}
        let ret = ''
        if (row.id === 'Total')
            ret = 'footer-row-class'
        else if (row.tranTypeId === 9) {
            ret = 'row-sales-return'
        } else if (row.grossProfit < 0) {
            ret = 'row-loss'
        } else if (row.age > 360) {
            ret = 'row-jakar'
        }
        return (ret)
    }

    function getTotals() {
        const rows: any[] = pre.filteredRows
        const totals = rows.reduce((prev: any, curr: any, index: number) => {
            prev.qty = prev.qty + curr.qty
            prev.cgst = prev.cgst + curr.cgst
            prev.sgst = prev.sgst + curr.sgst
            prev.igst = prev.igst + curr.igst
            prev.amount = prev.amount + curr.amount
            prev.aggrSale = prev.aggrSale + curr.aggrSale
            prev.grossProfit = prev.grossProfit + curr.grossProfit
            prev.count++
            return (prev)
        }, { qty: 0, aggrSale: 0, cgst: 0, sgst: 0, igst: 0, amount: 0, grossProfit: 0, count: 0 })
        totals.id = 'Total'
        return (totals)
    }

    function onSelectModelChange(rowIds: any) {
        const rows = pre.allRows
        const obj = rowIds.reduce((prev: any, current: any) => {
            prev.count = prev.count + 1
            prev.qty = prev.qty + (rows[current - 1]?.qty || 0)
            prev.aggrSale = prev.aggrSale + (rows[current - 1]?.aggrSale || 0)
            prev.amount = prev.amount + (rows[current - 1]?.amount || 0)
            prev.grossProfit = prev.grossProfit + (rows[current - 1]?.grossProfit || 0)
            return prev
        }, { count: 0, qty: 0, aggrSale: 0, amount: 0, grossProfit: 0 })
        pre.selectedRowsObject = _.isEmpty(obj) ? {} : obj
        setRefresh({})
    }

    function Product({ params }: any) {
        return (
            <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                <Typography sx={{ fontSize: theme.spacing(1.7), fontWeight: 'bold' }}>{params.row.brandName}</Typography>
                {params.row.catName && <Typography sx={{ fontSize: theme.spacing(1.7) }}>&nbsp;{params.row.catName}</Typography>}
                {params.row.label && <Typography sx={{ display: 'inline-block', whiteSpace: 'pre-line', fontSize: theme.spacing(1.7) }}>&nbsp;{params.row.label}</Typography>}
            </Box>
        )
    }

    function ProductDetails({ params }: any) {
        return (
            <Typography sx={{ display: 'inline-block', whiteSpace: 'pre-line', fontSize: theme.spacing(1.6), }}>{params.row.info}</Typography>
        )
    }

    function RefNoAccounts({ params }: any) {
        return (
            <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                <Typography sx={{ fontSize: theme.spacing(1.6), fontWeight: 'bold' }}>
                    {''.concat((params.row.autoRefNo || ''), params.row.autoRefNo ? ', ' : '')}&nbsp;
                </Typography>
                <Typography sx={{ display: 'inline-block', whiteSpace: 'pre-line', fontSize: theme.spacing(1.6), }}>
                    {params.row.accounts || ''}
                </Typography>
            </Box>
        )
    }

    function removeRow(params: any) {
        const id = params.id
        if(id ==='Total'){ // The row with totals cannot be removed
            return
        }
        const temp = [...pre.filteredRows]
        _.remove(temp, (x: any) => x.id === id)
        pre.filteredRows = temp
        pre.filteredRows.pop()
        pre.totals = getTotals()
        pre.filteredRows.push(pre.totals)
        setRefresh({})
    }

    return ({ fetchData, getColumns, getGridSx, getSalesPeriodOptions, getRowClassName, handleOptionSelected, handleSelectedTagOption, meta, onSelectModelChange })
}
export { useSalesReport }

/*
set search_path to capitalchowringhee;
with "branchId" as (values (1)), "finYearId" as (values (2022)), "tagId" as (values(0)), "startDate" as (values('2022-04-01' ::date)), "endDate" as (values(CURRENT_DATE)),
        --with "branchId" as (values (%(branchId)s::int)), "finYearId" as (values (%(finYearId)s::int)), "tagId" as (values(%(tagId)s::int)), "startDate" as (values(%(startDate)s ::date)), "endDate" as (values(%(endDate)s:: date)),
	    cte as ( --filter on tagId in CategoryM
            with recursive rec as (
            select id, "parentId", "isLeaf", "catName"
                from "CategoryM"
                    where (("tagId" = (table "tagId")) or ((table "tagId") = 0))
            union
            select c.id, c."parentId", c."isLeaf", c."catName"
                from "CategoryM" c
                    join rec on
                        rec."id" = c."parentId"
            ) select * from rec where "isLeaf"
        ),
        cte0 as( --base cte: from tranD where 4,5,9,10, branchId, finYearId, tranDate <= endDate
        select "tranDate", s."productId", "tranTypeId", "qty", "price", "discount", "cgst", "sgst","igst"
            , s."amount", "gstRate", s."id" as "salePurchaseDetailsId", "autoRefNo", h."timestamp", concat_ws(' ', "contactName", "mobileNumber", "address1", "address2") as "contact"
            , (
                select string_agg("accName", ', ')
                    from "AccM" a
                        join "TranD" d
                            on a."id" = d."accId"
                        join "TranH" h1
                            on h1."id" = d."tranHeaderId"
                where h1.id = h.id and "dc" <> 'C'
            ) as "accounts", '' as "dc"
            from "TranH" h
                join "TranD" d
                    on h."id" = d."tranHeaderId"
                join "AccM" a
                            on a."id" = d."accId"
                join "SalePurchaseDetails" s
                    on d."id" = s."tranDetailsId"
				join "Contacts" c
					on c."id" = h."contactsId"
                where "branchId" = (table "branchId") and "finYearId" = (table "finYearId")
                --where "branchId" = 1 and "finYearId" = 2022
                and "tranDate" <=(table "endDate")
                and "tranTypeId" in (4, 5, 9, 10)
			union all
		select "tranDate", s."productId", "tranTypeId", "qty", 0 as "price",0 as "discount", 0as "cgst", 0 as "sgst", 0 as "igst"
            , 0 as "amount", 0 as "gstRate", s."id" as "salePurchaseDetailsId", "autoRefNo", h."timestamp", '' as "accounts",'' as "contact", "dc"
			from "TranH" h
				join "StockJournal" s
					on h."id" = s."tranHeaderId"
			where "branchId" = (table "branchId") and "finYearId" = (table "finYearId")
        ), cte1 as( --from ProductOpBal where branch, finYear
            select "productId","qty", "openingPrice", "lastPurchaseDate"
                from "ProductOpBal" p 
                where "branchId" = (table "branchId") and "finYearId" = (table "finYearId")
                --where "branchId" = 1 and "finYearId" = 2022
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
                select "tranDate", c2."productId", c2."qty", "price", "timestamp", "accounts","contact"
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
                select "tranDate", "productId", "price", "lastPurchasePrice", "discount", "gstRate","tranTypeId","salePurchaseDetailsId", "autoRefNo", "contact"
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
        ),		
		cte6 as ( --for stock: cte0-> group by on productId, saleType, get columns as sale, ret, purchase
            select "productId","tranTypeId", 
                    SUM(CASE WHEN "tranTypeId" = 4 THEN "qty" ELSE 0 END) as "sale"
                    , SUM(CASE WHEN "tranTypeId" = 9 THEN "qty" ELSE 0 END) as "saleRet"
                    , SUM(CASE WHEN "tranTypeId" = 5 THEN "qty" ELSE 0 END) as "purchase"
                    , SUM(CASE WHEN "tranTypeId" = 10 THEN "qty" ELSE 0 END) as "purchaseRet"
					, SUM(CASE WHEN (("tranTypeId" = 11) and ("dc" = 'D')) THEN "qty" ELSE 0 END) as "stockJournalDebits"
					, SUM(CASE WHEN (("tranTypeId" = 11) and ("dc" = 'C')) THEN "qty" ELSE 0 END) as "stockJournalCredits"
                from cte0
                    group by "productId", "tranTypeId" 
                    order by "productId", "tranTypeId"
        ), cte7 as ( -- sum up using group by to get rid of multiple productId
            select "productId"
            , SUM("sale") as "sale"
            , SUM("saleRet") as "saleRet"
            , SUM("purchase") as "purchase"
            , SUM("purchaseRet") as "purchaseRet"
			, SUM("stockJournalDebits") as "stockJournalDebits"
			, SUM("stockJournalCredits") as "stockJournalCredits"
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
				, "stockJournalDebits"
				, "stockJournalCredits"
                , (coalesce(c1.qty,0) + "purchase" - "sale" - "purchaseRet" + "saleRet" + "stockJournalDebits" - "stockJournalCredits") as "stock"
                    from cte7 c7
                        left join cte1 c1
                            on c1."productId" = c7."productId"
                    order by "productId"
        )
            
        select c5.*, "productCode", "catName", "brandName", "label", "stock", "info" 
                ,(date_part('day', (CASE WHEN (table "endDate") > CURRENT_DATE then CURRENT_DATE ELSE (table "endDate") END)::timestamp - "lastPurchaseDate"::timestamp)) as "age"
            from cte5 c5
                join "ProductM" p
                    on p."id" = c5."productId"
                join cte c --"CategoryM" c
                    on c."id" = p."catId"
                join "BrandM" b
                    on b.id = p."brandId"
                join cte8 c8
                    on c5."productId" = c8."productId"
            where "tranDate" between (table "startDate") and (table "endDate")
                order by "tranDate", "salePurchaseDetailsId"
*/