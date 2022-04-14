import { Box, ReactSelect, Typography, useTheme } from '../redirect'
import { useInventoryReports } from './inventory-reports-hook'

function InventoryReports() {
    const { mega, meta, onReportSelected } = useInventoryReports()
    const pre = meta.current
    const theme = useTheme()
    // To reduce space between two items of drop down
    const styles = {
        option: (base: any) => ({
            ...base,
            padding: '.4rem',
            paddingLeft: '0.8rem',
            fontWeight:'bold'
            // width: '60%'
        }),
        control: (provided: any) => ({
            ...provided,
            // width: '60%'
        })
    }
    return (
        <Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', '& .react-select': { width: '60%' } }}>
                <Typography variant='subtitle1'>{''.concat(mega.title, ' > ', mega.breadcumb)}</Typography>
                <ReactSelect className='react-select' menuPlacement='auto' placeholder='Select ...' styles={styles}
                    options={reportsJson} value={mega.selectedReport} onChange={onReportSelected} />
            </Box>
            <Box sx={{ marginTop: theme.spacing(1) }}>
                <mega.currentReportComponent />
            </Box>
        </Box>
    )
}
export { InventoryReports }

const reportsJson = [
    {
        label: 'Stock summary',
        value: 'stockSummaryReport',
        breadcumb: 'Stock summary'
    },
    {
        label: 'Sales',
        value: 'salesReport',
        breadcumb: 'Sales'
    },
    {
        label: 'Purchases',
        value: 'purchaseReport',
        breadcumb: 'Purchases'
    },
]