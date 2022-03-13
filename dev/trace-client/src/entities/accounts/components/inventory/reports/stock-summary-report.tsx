import { calculateNewValue } from '@testing-library/user-event/dist/utils'
import { Box, useSharedElements, useTheme, utilMethods, utils, XXGrid, } from '../redirect'
import { useStockSummaryReport } from './stock-summary-report-hook'
function StockSummaryReport() {
    const { meta, setRefresh } = useStockSummaryReport()
    const theme = useTheme()
    const { toDecimalFormat } = utilMethods()
    const { getGridReportSubTitle, toCurrentDateFormat } = utils()
    return (
        <Box sx={{ height: "calc(100vh - 240px)" }}>
            <XXGrid
                alternateFooter={{ path: 'jsonResult.summary', displayMap: { count: 'Count', op: "Opening", opValue:"Opening stock value", debits: "Debits", credits: "Credits", clos:"Closing", closValue:"Closing stock value" } }}
                sx={{ border: '4px solid orange', p: 1, width: '100%', fontSize: theme.spacing(1.5), }}
                autoFetchData={true}
                columns={getColumns()}
                // customFooterField1={{ label: 'Value', value: 233.44, path: 'jsonResult.value' }}
                gridActionMessages={getActionMessages()}
                // hideFilteredButton={true}
                // hideColumnsButton={true}
                // hideExportButton={true}
                hideViewLimit={true}
                jsonFieldPath='jsonResult.stock'
                // specialColumns={specialColumns}
                rowHeight={25}
                sqlQueryArgs={{}}
                sqlQueryId='getJson_stock_summary'
                subTitle={getGridReportSubTitle()}
                // summaryColNames={['']}
                title='Stock summary'
            // title={title}
            />
        </Box>
    )

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

    function getActionMessages() {
        const actionMessages = {
            fetchIbukiMessage: 'XX-GRID-HOOK-FETCH-STOCK-SUMMARY-REPORT',
            editIbukiMessage: 'STOCK-SUMMARY-REPORT-XX-GRID-EDIT-CLICKED',
            deleteIbukiMessage: 'STOCK-SUMMARY-REPORT-XX-GRID-DELETE-CLICKED'
        }
        return (actionMessages)
    }
}
export { StockSummaryReport }