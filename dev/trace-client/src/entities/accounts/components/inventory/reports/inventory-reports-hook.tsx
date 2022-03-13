import { useEffect, useRef, useState } from '../redirect'
import { StockSummaryReport } from './stock-summary-report'
import { StockAgeingReport } from './stock-ageing-report'
function useInventoryReports() {
    const [, setRefresh] = useState({})
    const meta: any = useRef({
        currentReportComponent: () => <></>,
        // dialogConfig: {
        //     title: 'Select a report from below'
        // },
        // Report: () => <div>A report component</div>,
        // showDialog: false,
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
                stockSummaryReport: StockSummaryReport,
                stockAgeing: StockAgeingReport
            }
        }
    }

    return ({ handleCloseDialog, meta, onReportSelected, setRefresh })
}
export { useInventoryReports }

// function handleSelectReportClicked() {
    //     pre.showDialog = true
    //     pre.subTitle = ''
    //     setRefresh({})
    // }