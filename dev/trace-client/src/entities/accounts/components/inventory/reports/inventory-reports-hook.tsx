import { useRef, } from '../redirect'
function useInventoryReports() {
    const meta: any = useRef({
        title: 'Inventory reports'
    })

    function handleSelectReportClicked() {

    }

    return ({ handleSelectReportClicked, meta })
}
export { useInventoryReports }