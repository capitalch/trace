import { CloseSharp } from '@mui/icons-material'
import { Alert, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Snackbar } from '@mui/material'
import { useTheme } from '@mui/material/styles'

import { Document, BlobProvider, Line, Page, pdf, PDFViewer, StyleSheet, Svg, Text, usePDF, View, } from '@react-pdf/renderer'
import { useState, useRef } from 'react'
import { PdfLedger } from './pdf-ledger'

function Comp1({ props }: any) {
    const theme: any = useTheme()
    const [, setRefresh] = useState({})
    const meta = useRef({
        showDialog: false,
        dialogConfig: {
            title: 'Sample dialog title'
        }
    })

    return (<Box>
        <Button variant='contained' sx={{ m: 1 }}
            onClick={handleClick}>Dialog</Button>

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
                <PDFViewer showToolbar={true} width={840} height={600}>
                    <PdfLedger />
                </PDFViewer>
            </DialogContent>
            
        </Dialog>
    </Box>)

    function handleClick() {
        meta.current.showDialog = true
        setRefresh({})
    }

    function handleClose() {
        meta.current.showDialog = false
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