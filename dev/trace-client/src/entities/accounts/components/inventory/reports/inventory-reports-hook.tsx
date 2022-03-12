import { useEffect, useRef, useState } from '../redirect'
function useInventoryReports() {
    const [, setRefresh] = useState({})
    const meta: any = useRef({
        dialogConfig: {
            title: 'Select a report from below'
        },
        Report: () => <div>A report component</div>,
        showDialog: false,
        subTitle: '',
        title: 'Inventory reports',
    })
    const pre = meta.current
    useEffect(() => {
        pre.showDialog = true
        setRefresh({})
    }, [])

    function handleCloseDialog() {
        pre.showDialog = false
        setRefresh({})
    }

    function handleSelectReportClicked() {
        pre.showDialog = true
        pre.subTitle = ''
        setRefresh({})
    }

    return ({ handleCloseDialog, handleSelectReportClicked, meta, setRefresh })
}
export { useInventoryReports }