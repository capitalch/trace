import { Box, ReactSelect, Typography, useTheme} from '../redirect'
import { useInventoryReports } from './inventory-reports-hook'

function InventoryReports() {
    const {meta, onReportSelected } = useInventoryReports()
    const pre = meta.current
    const theme = useTheme()
    // To reduce space between two items of drop down
    const styles = {
        option: (base: any) => ({
            ...base,
            padding: '.1rem',
            paddingLeft: '0.8rem',
            // color: theme.palette.blue,
            // backgroundColor: 'white'
            // width: '80%',
        }),
        control: (provided: any) => ({
            ...provided,
            // border: '2px solid orange'
            // width: '80%',
        })
    }
    return (<Box>       
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography variant='subtitle1'>{''.concat(pre.title, ' > ', pre.breadcumb)}</Typography>
            <ReactSelect  menuPlacement='auto' placeholder='Select report' styles={styles}
                options={reportsJson} value={pre.selectedReport} onChange={onReportSelected} />
        </Box>
        <Box sx = {{marginTop:theme.spacing(1) }}>
            <pre.currentReportComponent />
        </Box>
    </Box>)
}
export { InventoryReports }

const reportsJson = [
    {
        label:'Stock summary with ageing report (Stock opening, debits, credits and closing balances with valuation and ageing )',
        value:'stockSummaryAgeingReport',
        breadcumb:'Stock summary with ageing report'
    },
    // {
    //     label:'Stock summary',
    //     value:'stockSummaryReport'
    // }
]