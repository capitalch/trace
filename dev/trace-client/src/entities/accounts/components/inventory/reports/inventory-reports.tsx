import { InputSwitch } from 'primereact/inputswitch'
import { Box, IMegaData, MegaDataContext, ReactSelect, Typography, getFromBag, useContext, useState, useTheme } from '../redirect'
import { useInventoryReports } from './inventory-reports-hook'

function InventoryReports() {
    const [,setRefresh] = useState({})
    const megaData: IMegaData = useContext(MegaDataContext)
    const selectedReportName = megaData.accounts.inventory.selectedReportName
    const {inventory, meta, onReportSelected } = useInventoryReports()
    const pre = meta.current
    const theme = useTheme()
    // To reduce space between two items of drop down
    const styles = {
        option: (base: any) => ({
            ...base,
            padding: '.4rem',
            paddingLeft: '0.8rem',
            fontWeight: 'bold'
        }),
        control: (provided: any) => ({
            ...provided,
        })
    }

    pre.selectedReport = reportsJson.find((x: any) => x.value === selectedReportName) || pre.selectedReport
    return (
        <Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', '& .react-select': { width: '60%' } }}>
                <Typography variant='subtitle1'>{''.concat(pre.title, ' > ', pre.selectedReport.breadCrumb)}</Typography>
                <Box component='span' display='flex' justifyContent='space-between'>
                    <ReactSelect className='react-select' menuPlacement='auto' placeholder='Select ...' styles={styles}
                        options={reportsJson} value={pre.selectedReport} onChange={onReportSelected} />
                    <Box component='span' display='flex' alignItems='center'>
                        <span style={{ marginRight: theme.spacing(2) }}>This branch</span>
                        <InputSwitch
                            checked={inventory.isAllBranches}
                            disabled={inventory.selectedReportName !== 'stockSummaryReport'}
                            onChange={(e: any) => {
                                inventory.isAllBranches = e.target.value
                                if(inventory.fetchDataMethod){
                                    inventory.fetchDataMethod()
                                }
                                setRefresh({})
                            }}></InputSwitch>
                        <span style={{ marginLeft: theme.spacing(2) }}>All branches</span>
                    </Box>
                </Box>

            </Box>
            <Box sx={{ marginTop: theme.spacing(1) }}>
                <pre.reportComponent />
            </Box>
        </Box>
    )
}
export { InventoryReports }

const reportsJson: any[] = [
    {
        label: 'Current orders',
        value: 'currentOrdersReport',
        breadCrumb: 'Current orders'
    },
    {
        label: 'Products list',
        value: 'productsListReport',
        breadCrumb: 'Products list'
    },
    {
        label: 'Purchase price variation',
        value: 'purchasePriceVariation',
        breadCrumb: 'Purchase price variation'
    },
    {
        label: 'Purchases',
        value: 'purchaseReport',
        breadCrumb: 'Purchases'
    },
    {
        label: 'Sales',
        value: 'salesReport',
        breadCrumb: 'Sales'
    },
    {
        label: 'Stock summary',
        value: 'stockSummaryReport',
        breadCrumb: 'Stock summary'
    },
    {
        label: 'Stock transactions',
        value: 'stockTransactionReport',
        breadCrumb: 'Stock transactions'
    },

]