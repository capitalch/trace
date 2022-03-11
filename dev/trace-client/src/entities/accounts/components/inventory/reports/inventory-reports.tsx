import { Box, Button, Typography } from '../redirect'
import { useInventoryReports } from './inventory-reports-hook'

function InventoryReports() {
    const {handleSelectReportClicked, meta } = useInventoryReports()
    const pre = meta.current
    return (<Box>
        <Box sx={{display:'flex', justifyContent:'space-between'}}>
            <Typography variant='subtitle1'>{pre.title}</Typography>
            <Button variant='contained' size='large' color='success' onClick={handleSelectReportClicked}>
                Select a report
            </Button>
        </Box>
    </Box>)
}
export { InventoryReports }