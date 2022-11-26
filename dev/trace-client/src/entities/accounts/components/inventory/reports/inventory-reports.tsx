import { Box, IMegaData, MegaDataContext, ReactSelect, Typography, useContext, useTheme } from '../redirect'
import { useInventoryReports } from './inventory-reports-hook'

function InventoryReports() {
    const megaData: IMegaData = useContext(MegaDataContext)
    const selectedReportName = megaData.accounts.inventory.selectedReportName
    const { meta, onReportSelected } = useInventoryReports()
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

    pre.selectedReport = reportsJson.find((x:any)=>x.value === selectedReportName) || pre.selectedReport
    return (
        <Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', '& .react-select': { width: '60%' } }}>
                <Typography variant='subtitle1'>{''.concat(pre.title, ' > ', pre.selectedReport.breadCrumb)}</Typography>
                <ReactSelect className='react-select' menuPlacement='auto' placeholder='Select ...' styles={styles}
                    // defaultValue={{label:'stockTransactionReport', value:1}}
                    options={reportsJson} value={pre.selectedReport} onChange={onReportSelected} />
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