import { useState, useEffect, useRef } from 'react'
import { makeStyles, Theme, createStyles } from '@material-ui/core'
import { useSharedElements } from '../common/shared-elements-hook'

function useExpencesBody() {
    const [, setRefresh] = useState({})
    const {
        Button,
        emit,
        execGenericView,
        filterOn,
        getFromBag,
        hotFilterOn,
        isInvalidDate,
        isInvalidGstin,
        map,
        registerAccounts,
        saveForm,
    } = useSharedElements()

    useEffect(() => {
        meta.current.isMounted = true
       
        return () => {
            meta.current.isMounted = false
        }
    }, [])

    const meta: any = useRef({
        errorsObject: {},
        amountQtyGstErrors: {},
        isMounted: false,
        showDialog: false,
        dialogConfig: {
            title: 'Invoice has following errors',
            content: () => { },
            actions: () => { },
        },
        test: '',
    })

    function getError(){
        return(true)
    }

    function handleSubmit() {
        
        
    }

    return{getError, handleSubmit}
}

export { useExpencesBody, useStyles }

const useStyles: any = makeStyles((theme: Theme) =>
    createStyles({
        content: {
            '& .body-line-1': {
                display: 'flex',
                alignItems: 'center',
                columnGap: theme.spacing(4),
                rowGap: theme.spacing(2),
                flexWrap: 'wrap',
                '& .auto-ref-no': {
                    maxWidth: theme.spacing(19),
                },
                '& .invoice-no': {
                    maxWidth: '10rem',
                },
                '& .common-remarks': {
                    maxWidth: '10rem',
                },
                '& .submit': {
                    marginLeft: 'auto',
                },
                '& .purchase-type': {
                    position: 'relative',
                    top: theme.spacing(1),
                },
                '& .gst-invoice': {
                    position: 'relative',
                    top: theme.spacing(1),
                },
            },

            '& .body-line-2': {
                marginTop: theme.spacing(1),
                alignItems: 'center',
                display: 'flex',
                flexWrap: 'wrap',
                rowGap: theme.spacing(2),
                columnGap: theme.spacing(4),

                '& .ledger-subledger': {
                    marginTop: theme.spacing(0.2),
                },

                '& .reset': {
                    marginLeft: 'auto',
                },
                '& .invoice': {
                    display: 'flex',
                    flexDirection: 'column',
                    rowGap: theme.spacing(0.5),
                    maxWidth: '9rem',
                    '& input': {
                        textAlign: 'end',
                    },
                },
                '& .gst': {
                    display: 'flex',
                    flexDirection: 'column',
                    maxWidth: '8rem',
                    '& input': {
                        textAlign: 'end',
                    },
                },
            },
        },
    })
)