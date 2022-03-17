import { SalesReport, StockSummaryAgeingReport, useEffect, useRef, useState, } from '../redirect'

function useInventoryReports() {
    const [, setRefresh] = useState({})
    const meta: any = useRef({
        currentReportComponent: () => <></>,
        breadcumb: '',
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
        pre.breadcumb = selected.breadcumb
        const reportsMap: any = getReportsMap() // make use of javascript hoisting
        pre.currentReportComponent = reportsMap[reportName]
        setRefresh({})

        function getReportsMap() {
            return {
                stockSummaryAgeingReport: StockSummaryAgeingReport,
                salesReport: SalesReport
            }
        }
    }

    return ({ handleCloseDialog, meta, onReportSelected, setRefresh })
}
export { useInventoryReports }