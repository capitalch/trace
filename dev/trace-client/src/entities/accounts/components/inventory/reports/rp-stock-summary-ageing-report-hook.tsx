// import { useRef } from 'react'
import { useEffect, useIbuki, useRef, useState, utils, utilMethods } from '../redirect'

function useStockSummaryAgeingReport() {
    const [, setRefresh] = useState({})
    const { execGenericView, toDecimalFormat } = utilMethods()
    const { toCurrentDateFormat } = utils()
    const { emit, } = useIbuki()
    const meta: any = useRef({
        rows: []
    })
    const pre = meta.current
    useEffect(() => {
        fetchData()
    }, [])

    async function fetchData() {
        let count = 1
        emit('SHOW-LOADING-INDICATOR', true)
        const ret = await execGenericView({
            isMultipleRows: false,
            sqlKey: 'getJson_stock_summary',
            args: {},
            // entityName: entityName,
        })
        pre.rows = ret?.jsonResult?.stock
        emit('SHOW-LOADING-INDICATOR', false)
        setId()
        setRefresh({})

        function incr() {
            return (count++)
        }

        function setId() {
            for (const row of pre.rows) {
                row.id1 = row.id
                row.id = incr()
            }
        }
    }

    function getColumns(): any[] {
        return ([
            {
                headerName: '#',
                field: 'id',
                width: 60,
            },
            {
                headerName: 'Pr id',
                field: 'productId',
                width: 70,
            },
            {
                headerName: 'Pr code',
                field: 'productCode',
                width: 80,
            },
            {
                headerName: 'Category',
                field: 'catName'
            },
            {
                headerName: 'Brand',
                field: 'brandName'
            },
            {
                headerName: 'Label',
                field: 'label'
            },
            {
                headerName: 'Op Price',
                field: 'openingPrice',
                type: 'number',
                width: 100,
                valueFormatter: (params: any) => toDecimalFormat(params.value),
            },
            {
                headerName: 'Op value',
                field: 'opValue',
                type: 'number',
                width: 120,
                valueFormatter: (params: any) => toDecimalFormat(params.value),
            },
            {
                headerName: 'Op',
                field: 'op',
                type: 'number',
                width: 60,
            },
            {
                headerName: 'Debits',
                field: 'dr',
                type: 'number',
                width: 60,
            },
            {
                headerName: 'Credits',
                field: 'cr',
                type: 'number',
                width: 60,
            },
            // {
            //     headerName: 'Pur Ret',
            //     field: 'purchaseRet',
            //     type: 'number',
            //     width: 60,
            // },
            // {
            //     headerName: 'Sal ret',
            //     field: 'saleRet',
            //     type: 'number',
            //     width: 60,
            // },
            {
                headerName: 'Clos',
                field: 'clos',
                type: 'number',
                width: 60,
            },
            {
                headerName: 'Clos val',
                field: 'closValue',
                type: 'number',
                width: 120,
                valueFormatter: (params: any) => toDecimalFormat(params.value),
            },
            {
                headerName: 'Last pur price',
                field: 'lastPurchasePrice',
                type: 'number',
                width: 100,
                valueFormatter: (params: any) => toDecimalFormat(params.value),
            },
            {
                headerName: 'Last pur dt',
                field: 'lastPurchaseDate',
                width: 90,
                valueFormatter: (params: string) => toCurrentDateFormat(params)
            },
            {
                headerName: 'Last sal dt',
                field: 'lastSaleDate',
                width: 90,
                valueFormatter: (params: string) => toCurrentDateFormat(params)
            }
        ])
    }

    return ({ fetchData, getColumns, meta })
}

export { useStockSummaryAgeingReport }