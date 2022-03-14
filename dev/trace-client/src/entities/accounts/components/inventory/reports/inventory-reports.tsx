import {
    Box, Button, CheckCircle, CloseSharp, Dialog, DialogContent, DialogTitle, IconButton
    , ListItem, ListItemButton, ListItemIcon, ListItemText, Tooltip, Typography, useSharedElements, useTheme
} from '../redirect'
import { useInventoryReports } from './inventory-reports-hook'

function InventoryReports() {
    const { handleCloseDialog, meta, onReportSelected, setRefresh } = useInventoryReports()
    const { ReactSelect,  } = useSharedElements()
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
            {/* <Typography variant='subtitle2' sx={{marginTop:theme.spacing(1)}}>All reports</Typography> */}
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
    {
        label:'Stock summary',
        value:'stockSummaryReport'
    }
]

//  {/* <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', }}>
            
//             <Button variant='contained' size='large' color='success' onClick={handleSelectReportClicked}>
//                 Select report
//             </Button>
//         </Box> */}

// {/* <Dialog
// open={pre.showDialog}
// onClose={(e, reason) => {
//     if (!['escapeKeyDown', 'backdropClick'].includes(reason)) {
//         handleCloseDialog()
//     }
// }}
// fullWidth={true}>
// <DialogTitle>
//     <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
//         <Typography variant='h6'>{pre.dialogConfig.title}</Typography>
//         <Tooltip title="Close">
//             <IconButton
//                 sx={{ width: '18px', height: '18px', marginTop: '-10px', marginRight: '-20px' }}
//                 onClick={handleCloseDialog}>
//                 <CloseSharp sx={{ fontSize: '16px' }} />
//             </IconButton>
//         </Tooltip>
//     </Box>
// </DialogTitle>
// <DialogContent>
//     {getReportsList()}
// </DialogContent>
// </Dialog> */}

// reports.map((item: any, index: number) =>
// (<ListItem disablePadding key={index}>
//     <ListItemButton onClick={() => handleReportSelected(item)}>
//         <ListItemIcon>
//             <CheckCircle fontSize='large' color='secondary' />
//         </ListItemIcon>
//         <ListItemText primary={item.label} secondary={item.descr} />
//     </ListItemButton>
// </ListItem>)
// )