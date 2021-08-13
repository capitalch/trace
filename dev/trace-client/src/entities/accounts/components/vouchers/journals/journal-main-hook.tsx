import React, { useState, useEffect, useRef } from 'react'
import { makeStyles, Theme, createStyles } from '@material-ui/core'
import { useSharedElements } from '../../common/shared-elements-hook'
import { classNames } from 'react-select/src/utils'
import { LedgerSubledger } from '../../common/ledger-subledger'
import { RemoveCircle } from '@material-ui/icons'

function useJournalMain(arbitraryData: any) {
    const [, setRefresh] = useState({})

    const {
        _,
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
        getMappedAccounts,
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
        useGeneric,
    } = useSharedElements()

    useEffect(() => {
        meta.current.isMounted = true
        const subs1 = filterOn('JOURNAL-MAIN-REFRESH').subscribe(() =>
            setRefresh({})
        )
        return () => {
            meta.current.isMounted = false
            subs1.unsubscribe()
        }
    }, [])

    const meta: any = useRef({
        isMounted: false,
    })

    function Header({ arbitraryData }: any) {
        const classes = useStyles()
        const [, setRefresh] = useState({})
        return (
            <div className={classes.contentHeader}>
                <div className='header-line-1'>
                    <Typography variant='body1' component='span'>Ref no:&nbsp;</Typography>
                    <span className='auto-ref-no'>{arbitraryData.autoRefNo}</span>
                    <SubmitButton />
                </div>
                <div className="header-line-2">
                    {/* date */}
                    <div className="date-block">
                        <label className='date-label'>Date</label>
                        <TextField
                            // error={isInvalidDate(arbitraryData.body.tranDate)}
                            // helperText={isInvalidDate(arbitraryData.body.tranDate) ? accountsMessages.dateRangeAuditLockMessage : undefined}
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
                </div>
            </div >
        )

        function SubmitButton() {
            const [, setRefresh] = useState({})
            const classes = useStyles()
            useEffect(() => {
                const subs1 = filterOn(
                    'PURCHASE-BODY-SUBMIT-REFRESH'
                ).subscribe(() => {
                    setRefresh({})
                })

                return () => {
                    subs1.unsubscribe()
                }
            }, [])

            return (
                <Button
                    className={classes.contentSubmitButton}
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
            return true
        }

        function handleSubmit() { }
    }

    function ActionDebit({ arbitraryData }: any) {
        const classes = useStyles()
        return (
            <div className={classes.contentActionDebit}>
                <Typography
                    className="debits-label"
                    variant="subtitle2"
                    component="div"
                    color="primary">
                    Debits
                </Typography>
                <ActionList />
            </div>
        )

        function ActionList() {
            const [, setRefresh] = useState({})
            let ind = 0
            const debits: any[] = arbitraryData.debits
            const list: any[] = debits.map((item: any) => {
                const ret = (
                    <div key={incr()} className="debits-row">
                        {/* Account */}
                        <div className='ledger-subledger-box'>
                            <Typography variant='caption'>Debit account</Typography>
                            <LedgerSubledger
                                className="ledger-subledger"
                                allAccounts={arbitraryData.accounts.all}
                                // emitMessageOnChange="SALES-CROWN-REFRESH"
                                ledgerAccounts={getMappedAccounts(
                                    arbitraryData.accounts.journal
                                )}
                                // onChange={onChangeLedgerSubledger}
                                rowData={item}
                            />
                        </div>

                        {/* Gst rate` */}
                        <NumberFormat
                            allowNegative={false}
                            {...{ label: 'Gst rate' }}
                            className="right-aligned-numeric gst-rate"
                            customInput={TextField}
                            decimalScale={2}
                            // error={item.amount ? false : true}
                            fixedDecimalScale={true}
                            onFocus={(e) => {
                                e.target.select()
                            }}
                            onValueChange={(values: any) => {
                                const { floatValue } = values
                                item.amount = floatValue || 0.0
                                // computeSummary()
                                setRefresh({})
                            }}
                            thousandSeparator={true}
                            value={item.gstRate || 0.0}
                        />
                        {/* Amount */}
                        <NumberFormat
                            allowNegative={false}
                            {...{ label: 'Debit amount' }}
                            // {...matProps}
                            className="right-aligned-numeric"
                            customInput={TextField}
                            decimalScale={2}
                            error={item.amount ? false : true}
                            // error={()=>false}
                            fixedDecimalScale={true}
                            onFocus={(e) => {
                                e.target.select()
                            }}
                            onValueChange={(values: any) => {
                                const { floatValue } = values
                                item.amount = floatValue || 0.0
                                // computeSummary()
                                setRefresh({})
                            }}
                            thousandSeparator={true}
                            value={item.amount || 0.0}
                        />

                        <div style={{ display: 'flex', flexDirection: 'column', width: '5rem', fontSize: '.8rem', rowGap: 0 }}>
                            <Checkbox />
                            <Typography>111.00</Typography>
                            <Typography>111.00</Typography>
                            <Typography>111.00</Typography>
                        </div>

                        {/* line ref no  */}
                        <TextField
                            label="Line ref"
                            // className="user-ref"
                            // error={getInvoiceError()}
                            onChange={(e: any) => {
                                arbitraryData.userRefNo = e.target.value
                                setRefresh({})
                            }}
                            value={arbitraryData.lineRefNo || ''}
                        />
                        {/* remarks */}
                        <TextField
                            label="Remarks"
                            // className="common-remarks"
                            onChange={(e: any) => {
                                arbitraryData.commonRemarks = e.target.value
                                setRefresh({})
                            }}
                            value={arbitraryData.remarks || ''}
                        />

                        {/* Add remove */}
                        <div>
                            <IconButton color='secondary' size='medium' aria-label="delete" style={{ margin: 0, padding: 0 }}>
                                <RemoveCircle style={{ fontSize: '2.5rem' }} />
                            </IconButton>
                            <IconButton color='secondary' aria-label="delete" style={{ margin: 0, padding: 0 }}>
                                <AddCircle style={{ fontSize: '2.5rem' }} />
                            </IconButton>
                        </div>
                    </div>
                )
                return ret
            })

            return <div className="debits-block">{list}</div>

            function incr() {
                return ind++
            }
        }
    }

    return { ActionDebit, Header, meta, setRefresh }
}

export { useJournalMain }

const useStyles: any = makeStyles((theme: Theme) =>
    createStyles({
        contentHeader: {
            '& .header-line-1': {
                display: 'flex',
                marginTop: theme.spacing(2),
                '& .auto-ref-no': {
                    color: theme.palette.blue.main,
                }
            },
            '& .header-line-2': {
                // marginTop: theme.spacing(2),
                display: 'flex',
                flexWrap: 'wrap',
                columnGap: theme.spacing(4),
                rowGap: theme.spacing(2),

                '& .date-block': {
                    display: 'flex',
                    flexDirection: 'column',
                    '& .date-label': {
                        fontSize: '0.7rem',
                    }
                },
                '& .user-ref': {
                    maxWidth: '10rem',
                },
                '& .common-remarks': {
                    maxWidth: '20rem',
                    flexGrow: 2,
                },
            },
        },


        contentActionDebit: {
            '& .debits-label': {
                marginTop: theme.spacing(2),
            },
            // '& .ledger-subledger-box': {
            //     marginTop:0,
            //     '& .ledger-subledger': {
            //         marginTop: 0,
            //     },
            // },

            '& .right-aligned-numeric': {
                '& input': {
                    textAlign: 'end',
                },
            },

            '& .gst-rate': {
                width: theme.spacing(8),
            },


            '& .debits-block': {
                display: 'flex',
                flexWrap: 'wrap',
                columnGap: theme.spacing(4),
                rowGap: theme.spacing(2),
                // listStyle: 'none',
                // marginLeft: 0,
                // paddingLeft: 0,
                '& .debits-row': {
                    display: 'flex',
                    columnGap: theme.spacing(4),
                    flexWrap: 'wrap',
                    rowGap: theme.spacing(3),
                    alignItems: 'center',
                },
            },
        },

        contentSubmitButton: {
            marginLeft: 'auto'
        }
    })
)

export { useStyles }
