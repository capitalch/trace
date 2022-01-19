import { CloseSharp } from '@mui/icons-material'
import { Alert, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Snackbar } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { useRef, useState } from 'react'

function Comp1({ props }: any) {
    const theme: any = useTheme()
    const [, setRefresh] = useState({})
    const meta = useRef({
        showDialog: false,
        dialogConfig: {
            title: 'Sample dialog title'
        }
    })
    const snackbar: any = useRef({
        severity: 'success',
        open: false,
        message: 'Successful',
        duration: 5000,
    })
    return (<Box>
        <Button variant='contained' sx={{ m: 1 }}
            onClick={handleClick}
        >Dialog</Button>
        <Dialog open={meta.current.showDialog} onClose={handleClose}>
            <DialogTitle sx={classes.dialogTitle}>
                <div>{meta.current.dialogConfig.title}</div>
                <IconButton
                    size='small'
                    color='default'
                    onClick={handleClose}
                ><CloseSharp /></IconButton>
            </DialogTitle>
            <DialogContent>
                <div>Content</div>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleSubmit}>Submit</Button>
            </DialogActions>
        </Dialog>
        <Snackbar
            style={{ bottom: '0.6rem', right: '0.5rem' }}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
            }}
            open={snackbar.current.open}
            autoHideDuration={snackbar.current.duration}
            onClose={handleSnackbarClose}>
            <Alert
                onClose={handleClose}
                severity={snackbar.current.severity}>
                {snackbar.current.message}
            </Alert>
        </Snackbar>
    </Box>)

    function handleClick() {
        meta.current.showDialog = true
        setRefresh({})
    }

    function handleClose() {
        meta.current.showDialog = false
        setRefresh({})
    }

    function handleSubmit() {
        snackbar.current.open = true
        snackbar.current.severity = 'error'
        snackbar.current.message =
            'Operation was successful'
        snackbar.current.duration =
            4000
        setRefresh({})
    }

    function handleSnackbarClose(){
        snackbar.current.open = false
        setRefresh({})
    }
}

export { Comp1 }

const classes = {
    class1: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    dialogTitle: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingBottom: '0px',
    },

}