import { ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material'
import { Box, Button, CheckCircle, CloseSharp, Dialog, DialogContent, DialogTitle, IconButton, Tooltip, Typography, useTheme } from '../redirect'
import { useInventoryReports } from './inventory-reports-hook'

function InventoryReports() {
    const { handleCloseDialog, handleSelectReportClicked, meta, setRefresh } = useInventoryReports()
    const pre = meta.current
    const theme = useTheme()
    return (<Box>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', }}>
            <Typography variant='subtitle1'>{''.concat(pre.title, ' > ', pre.subTitle)}</Typography>
            <Button variant='contained' size='large' color='success' onClick={handleSelectReportClicked}>
                Select report
            </Button>
        </Box>
        <pre.Report></pre.Report>
        <Dialog
            open={pre.showDialog}
            onClose={(e, reason) => {
                if (!['escapeKeyDown', 'backdropClick'].includes(reason)) {
                    handleCloseDialog()
                }
            }}
            fullWidth={true}>
            <DialogTitle>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant='h6'>{pre.dialogConfig.title}</Typography>
                    <Tooltip title="Close">
                        <IconButton
                            sx={{ width: '18px', height: '18px', marginTop: '-10px', marginRight: '-20px' }}
                            onClick={handleCloseDialog}>
                            <CloseSharp sx={{ fontSize: '16px' }} />
                        </IconButton>
                    </Tooltip>
                </Box>
            </DialogTitle>
            <DialogContent>
                {getReportsList()}
            </DialogContent>
        </Dialog>
    </Box>)

    function getReportsList() {
        const reports: any[] = [
            {
                label: 'Stock summary',
                descr: 'Complete summary of stock with valuation',
                // action: stockSummaryReport
            }
        ]
        return (
            reports.map((item: any, index: number) =>
            (<ListItem disablePadding key={index}>
                <ListItemButton onClick={() => handleReportSelected(item)}>
                    <ListItemIcon>
                        <CheckCircle fontSize='large' color='secondary' />
                    </ListItemIcon>
                    <ListItemText primary={item.label} secondary={item.descr} />
                </ListItemButton>
            </ListItem>)
            )
        )

        function handleReportSelected(item: any) {
            pre.subTitle = item.label
            handleCloseDialog()
        }
    }
}
export { InventoryReports }