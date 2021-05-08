import { useEffect, useState, useRef } from 'react'
// import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import { useSharedElements } from '../shared-elements-hook'

function ShowMessage() {
    const [, setRefresh] = useState({})
    const meta = useRef({
        isMounted: false,
        open: false,
    })
    const {
        Alert,
        Button,
        CloseIcon,
        IconButton,
        messages,
        Snackbar,
        useIbuki,
    } = useSharedElements()
    const { filterOn } = useIbuki()

    useEffect(() => {
        meta.current.isMounted = true
        const subs1 = filterOn('SHOW-MESSAGE').subscribe((d) => {
            meta.current.open = true
            setRefresh({})
        })
        return () => {
            subs1.unsubscribe()
            meta.current.isMounted = false
        }
    }, [])

    return (
        <Snackbar
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
            }}
            
            color="secondary"
            open={meta.current.open}
            autoHideDuration={5000}
            // message={messages.infoOperationSuccessful}
            onClose={handleClose}
            action={
                <>
                    <IconButton
                        size="small"
                        aria-label="close"
                        color="inherit"
                        onClick={handleClose}>
                        <CloseIcon fontSize="small" />
                    </IconButton>
                </>
            }>
            <Alert onClose={handleClose} severity="success" color='success'>
                {messages.infoOperationSuccessful}
            </Alert>
        </Snackbar>
    )

    function handleClose() {
        meta.current.open = false
        meta.current.isMounted && setRefresh({})
    }
}

export { ShowMessage }
