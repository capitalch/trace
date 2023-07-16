import { Box, Dialog, DialogContent, DialogTitle, IconButton } from "@mui/material";
import { AppStore } from "./app-store";
import { CloseSharp } from "@mui/icons-material";

function MaterialDialogASignals() {
    const Body = AppStore.modalDialogA.body.value
    return (<Dialog
        fullWidth={true}
        open={AppStore.modalDialogA.isOpen.value}
        onClose={(e, reason) => {
            if (!['escapeKeyDown', 'backdropClick'].includes(reason)) {
                handleClose()
            }
        }}>
        <DialogTitle display='flex' justifyContent='space-between'>
            <Box>{AppStore.modalDialogA.title.value}</Box>
            <IconButton
                sx={{ mr: -2.5 }}
                size="small"
                color="default"
                onClick={handleClose}
                aria-label="close">
                <CloseSharp />
            </IconButton>
        </DialogTitle>
        <DialogContent >
            <Body />
        </DialogContent>
    </Dialog>)

    function handleClose() {
        AppStore.modalDialogA.isOpen.value = false
    }
}
export { MaterialDialogASignals }