import { _, MegaContext, PurchaseReport, SalesReport, StockSummaryAgeingReport, useContext, useEffect, useRef, useState, } from '../redirect'

function useInventoryReports() {
    const [, setRefresh] = useState({})
    const megaBundle: any = useContext(MegaContext)
    _.isEmpty(megaBundle.accounts.invRepo) && (megaBundle.accounts.invRepo = {})
    const mega = megaBundle.accounts.invRepo

    _.isEmpty(mega) && _.assign(mega, {
        currentReportComponent: () => <></>,
        breadcumb: '',
        title: 'Inventory reports',
    })

    const meta: any = useRef({
        currentReportComponent: () => <></>,
        breadcrumb: '',
        title: 'Inventory reports',
    })
    const pre = meta.current
    useEffect(() => {

    }, [])

    function handleCloseDialog() {
        pre.showDialog = false
        setRefresh({})
    }

    function onReportSelected(selected: any) {
        const reportName = selected.value
        mega.selectedReport = selected
        mega.breadCrumb = selected.breadcumb
        const reportsMap: any = getReportsMap() // making use of javascript hoisting
        mega.currentReportComponent = reportsMap[reportName]
        setRefresh({})

        function getReportsMap() {
            return {
                stockSummaryAgeingReport: StockSummaryAgeingReport,
                salesReport: SalesReport,
                purchaseReport: PurchaseReport,
            }
        }
    }

    return ({ handleCloseDialog, mega, meta, onReportSelected, setRefresh })
}
export { useInventoryReports }