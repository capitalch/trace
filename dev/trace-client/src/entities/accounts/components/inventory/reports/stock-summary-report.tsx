import { Box, useSharedElements, useTheme, XXGrid, } from '../redirect'
import { useStockSummaryReport } from './stock-summary-report-hook'
function StockSummaryReport() {
    const { meta, setRefresh } = useStockSummaryReport()
    const theme = useTheme()
    const { toDecimalFormat } = useSharedElements()
    return (<Box>
        <XXGrid
            sx={{ border: '4px solid orange', p: 0, width: '100%', fontSize: theme.spacing(1.5) }}
            autoFetchData={true}
            columns={getColumns()}
            // customFooterField1={{ label: 'Value', value: 233.44, path: 'jsonResult.value' }}
            // gridActionMessages={getActionMessages()}
            // hideFilteredButton={true}
            hideColumnsButton={true}
            // hideExportButton={true}
            hideViewLimit={true}
            jsonFieldPath='jsonResult.stock'
            // specialColumns={specialColumns}
            sqlQueryArgs={{}}
            sqlQueryId='getJson_stock_summary'
            summaryColNames={['']}
        // title={title}
        />
    </Box>)

    function getColumns() {
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
                width: 110,
                valueFormatter: (params: any) => toDecimalFormat(params.value),
            },
            {
                headerName: 'Op',
                field: 'op',
                type: 'number',
                width: 60,
            },
            {
                headerName: 'Op value',
                field: 'opValue',
                type: 'number',
                width: 110,
                valueFormatter: (params: any) => toDecimalFormat(params.value),
            },
            {
                headerName: 'Pur',
                field: 'purchase',
                type: 'number',
                width: 60,
            },
            {
                headerName: 'Sal',
                field: 'sale',
                type: 'number',
                width: 60,
            },
            {
                headerName: 'Pur Ret',
                field: 'purchaseRet',
                type: 'number',
                width: 60,
            },
            {
                headerName: 'Sal ret',
                field: 'saleRet',
                type: 'number',
                width: 60,
            },
            {
                headerName: 'Clos',
                field: 'clos',
                type: 'number',
                width: 60,
            },
            {
                headerName: 'Last pur price',
                field: 'lastPurchasePrice',
                type: 'number',
                width: 110,
                valueFormatter: (params: any) => toDecimalFormat(params.value),
            },
            {
                headerName: 'Clos val',
                field: 'closValue',
                type: 'number',
                width: 110,
                valueFormatter: (params: any) => toDecimalFormat(params.value),
            },
            {
                headerName: 'Last pur dt',
                field: 'lastPurchaseDate'
            },
            {
                headerName: 'Last sal dt',
                field: 'lastSaleDate'
            }
        ])
    }

    function getActionMessages() {
        const actionMessages = {}
        return (actionMessages)
    }
}
export { StockSummaryReport }