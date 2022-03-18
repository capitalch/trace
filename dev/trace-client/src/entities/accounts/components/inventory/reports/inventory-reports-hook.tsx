import { _, MegaContext, SalesReport, StockSummaryAgeingReport, useContext, useEffect, useRef, useState, } from '../redirect'

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
        // pre.breadcumb = selected.breadcumb
        mega.breadCrumb = selected.breadcumb
        const reportsMap: any = getReportsMap() // make use of javascript hoisting
        // pre.currentReportComponent = reportsMap[reportName]
        mega.currentReportComponent = reportsMap[reportName]
        setRefresh({})

        function getReportsMap() {
            return {
                stockSummaryAgeingReport: StockSummaryAgeingReport,
                salesReport: SalesReport
            }
        }
    }

    return ({ handleCloseDialog,mega, meta, onReportSelected, setRefresh })
}
export { useInventoryReports }