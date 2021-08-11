import React, { useState, useEffect, useRef } from 'react'
import { makeStyles, Theme, createStyles } from '@material-ui/core'
import { useSharedElements } from '../../common/shared-elements-hook'

function useJournalMain(arbitraryData: any) {
    const [, setRefresh] = useState({})

    const { _,
        accountsMessages,
        AddCircle,
        AddIcon,
        Avatar,
        Big,
        Box,
        Button,
        Card,
        Checkbox,
        CheckIcon,
        Chip,
        CloseIcon,
        confirm,
        DataTable,
        DeleteIcon,
        Dialog,
        DialogTitle,
        DialogContent,
        DialogActions,
        Divider,
        doValidateForm,
        EditIcon,
        emit,
        ErrorIcon,
        execGenericView,
        filterOn,
        genericUpdateMaster,
        getCurrentEntity,
        getFormData,
        getFormObject,
        getFromBag,
        globalMessages,
        FormControlLabel,
        Icon,
        IconButton,
        Input,
        InputAdornment,
        isInvalidGstin,
        isValidForm,
        List,
        ListItem,
        ListItemAvatar,
        ListItemText,
        MaterialTable,
        messages,
        moment,
        MTableBody,
        MTableToolbar,
        NativeSelect,
        NumberFormat,
        Paper,
        PrimeColumn,
        queries,
        queryGraphql,
        Radio,
        ReactForm,
        releaseForm,
        resetAllFormErrors,
        resetForm,
        saveForm,
        SearchIcon,
        setFormError,
        SyncIcon,
        tableIcons,
        TextField,
        toDecimalFormat,
        TraceDialog,
        TraceFullWidthSubmitButton,
        traceGlobalSearch,
        TraceSearchBox,
        Typography,
        useGeneric, } = useSharedElements()

    useEffect(() => {
        meta.current.isMounted = true

        return (() => {
            meta.current.isMounted = false
        })
    }, [])

    const meta: any = useRef({
        isMounted: false,
    })

    function Header({arbitraryData}:any) {
        const classes = useStyles()
        return (
            <div className={classes.content}>
                <TextField
                    className="auto-ref-no"
                    disabled={true}
                    label="Ref no"
                    value={arbitraryData.autoRefNo || ''}
                />
                {/* date */}
                <div className="date-block">
                    <label className='date-label'>Date</label>
                    <TextField
                        // error={getDateError()}
                        // helperText={
                        //     getDateError()
                        //         ? 'Date range / Audit lock error'
                        //         : undefined
                        // }
                        type="date"
                        onChange={(e: any) => {
                            arbitraryData.tranDate = e.target.value
                            setRefresh({})
                        }}
                        onFocus={(e) => e.target.select()}
                        value={arbitraryData.tranDate || ''}
                    />
                </div>
                {/* user ref no  */}
                <TextField
                    label="Use ref"
                    className="user-ref"
                    // error={getInvoiceError()}
                    onChange={(e: any) => {
                        arbitraryData.userRefNo = e.target.value
                        setRefresh({})
                    }}
                    value={arbitraryData.userRefNo || ''}
                />
                {/* remarks */}
                <TextField
                    label="Common remarks"
                    className="common-remarks"
                    onChange={(e: any) => {
                        arbitraryData.commonRemarks = e.target.value
                        setRefresh({})
                    }}
                    value={arbitraryData.commonRemarks || ''}
                />

                <SubmitButton />
            </div>
        )

                
        function SubmitButton() {
            const [, setRefresh] = useState({})
            useEffect(() => {
                const subs1 = filterOn('PURCHASE-BODY-SUBMIT-REFRESH').subscribe(
                    () => {
                        setRefresh({})
                    }
                )
    
                return () => {
                    subs1.unsubscribe()
                }
            }, [])
    
            return (
                <Button
                    className="submit-button"
                    variant="contained"
                    size="small"
                    color="secondary"
                    onClick={handleSubmit}
                    startIcon={
                        getError() ? (
                            <ErrorIcon color="error" />
                        ) : (
                            <CheckIcon style={{ color: 'white' }} />
                        )
                    }
                    disabled={getError()}>
                    Submit
                </Button>
            )
    }

    

        function getError() {
            return (true)
        }

        function handleSubmit() {


        }
    }

    return ({Header, meta, setRefresh})

}

export { useJournalMain }

const useStyles: any = makeStyles((theme: Theme) =>
    createStyles({

        content: {
            display: 'flex',
            columnGap: theme.spacing(4),
            marginTop: theme.spacing(2),
            flexWrap: 'wrap',
            rowGap: theme.spacing(3),
            alignItems: 'center',
            // border: '1px solid lightgrey',
            // padding: theme.spacing(2),

            '& .auto-ref-no': {
                maxWidth: theme.spacing(19),
            },

            '& .date-block': {
                display: 'flex',
                flexDirection: 'column',
                '& .date-label': {
                    fontSize: '0.7rem'
                }
            },

            '& .user-ref': {
                maxWidth: '10rem',
            },
            '& .common-remarks': {
                maxWidth: '20rem',
                flexGrow:2,
            },
            '& .submit-button': {
                marginLeft: 'auto',
            },
        },

    })
)

export { useStyles }
