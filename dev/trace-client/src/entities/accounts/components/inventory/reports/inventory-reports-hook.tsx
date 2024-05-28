import { _, MegaDataContext, PurchaseReport, SalesReport, StockSummaryReport, useContext, useEffect, useIbuki, useRef, useState, utils, utilMethods } from '../redirect'
import { CurrentOrdersReport } from './gr-current-orders-report'
import { ProductsListReport } from './gr-products-list-report'
import { PurchasePriceVariation } from './gr-purchase-price-variation'
import { StockTransactionReport } from './gr-stock-transaction-report'

function useInventoryReports() {
    const [, setRefresh] = useState({})
    const megaData = useContext(MegaDataContext)
    const inventory = megaData.accounts.inventory
    const { emit } = useIbuki()
    const { execGenericView } = utilMethods()
    const meta: any = useRef({
        title: 'Inventory reports',
        reportComponent: () => <></>,
        selectedReport: {
            label: 'Select a report ...',
            value: null,
            breadCrumb: ''
        },
    })
    const pre = meta.current

    useEffect(() => {
        if (_.isEmpty(inventory.allTags)) {
            fetchAllTags()
        }
        onReportSelected(pre.selectedReport)
    }, [])

    async function fetchAllTags() {
        emit('SHOW-LOADING-INDICATOR', true)
        inventory.allTags = await execGenericView({
            isMultipleRows: true,
            sqlKey: 'get_tags',
        }) || []
        setId(inventory.allTags)
        emit('SHOW-LOADING-INDICATOR', false)

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

    function onReportSelected(selectedReport: any) {
        inventory.selectedReportName = selectedReport.value
        pre.selectedReport = selectedReport
        pre.reportComponent = getReportFromsMap(inventory.selectedReportName)
        setRefresh({})
        
        function getReportFromsMap(rName: string) {
            const map: any = {
                currentOrdersReport: CurrentOrdersReport,
                productsListReport: ProductsListReport,
                purchasePriceVariation: PurchasePriceVariation,
                purchaseReport: PurchaseReport,
                salesReport: SalesReport,
                stockSummaryReport: StockSummaryReport,
                stockTransactionReport: StockTransactionReport
            }
            return (map[rName] || (() => <></>))
        }
    }
    return ({inventory, meta, onReportSelected, setRefresh })
}
export { useInventoryReports }