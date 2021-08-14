import React, { useState, useEffect, useRef } from 'react'
import { makeStyles, Theme, createStyles } from '@material-ui/core'
import { useSharedElements } from '../../common/shared-elements-hook'
import { classNames } from 'react-select/src/utils'
import { LedgerSubledger } from '../../common/ledger-subledger'
import { RemoveCircle } from '@material-ui/icons'
import { ThemeConsumer } from 'styled-components'

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
        isInvalidDate,
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
        theme,
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

    function AllDebitsAllCredits({ ad }: any) {
        //ad has debits and credits array
        const [, setRefresh] = useState({})
        const classes = useStyles()
        useEffect(() => {
            compute()
            setRefresh({})
            const subs1 = filterOn('ALL-DEBITS-ALL-CREDITS-REFRESH').subscribe(() => {
                compute()
                setRefresh({})
            })

            return (() => {
                subs1.unsubscribe()
            })
        }, [])

        return (<div className={classes.contentAllDebitsllCredits}>
            <Typography variant='subtitle2' component='span'>All debits: {toDecimalFormat(ad.allDebits || 0.00)}</Typography>&nbsp;&nbsp;
            <Typography variant='subtitle2' component='span'>All credits: {toDecimalFormat(ad.allCredits || 0.00)}</Typography>
        </div>)

        function compute() {
            ad.allDebits = ad.debits.reduce((prev: any, curr: any) => {
                prev.amount = prev.amount + (curr.amount || 0.0)
                return (prev)
            }, { amount: 0 }).amount
            ad.allCredits = ad.credits.reduce((prev: any, curr: any) => {
                prev.amount = prev.amount + (curr.amount || 0.0)
                return (prev)
            }, { amount: 0 }).amount
        }
    }

    function Header({ arbitraryData }: any) {
        const classes = useStyles()
        const [, setRefresh] = useState({})
        return (
            <div className={classes.contentHeader}>
                <div className="header-line-1">
                    <Typography variant="body1" component="span">
                        Ref no:&nbsp;
                    </Typography>
                    <span className="auto-ref-no">
                        {arbitraryData.autoRefNo}
                    </span>
                    <AllDebitsAllCredits ad={arbitraryData} />
                    <ErrorMessage />
                    <SubmitButton ad={arbitraryData} />
                </div>
                <div className="header-line-2">
                    {/* date */}
                    <div className="date-block">
                        <label className="date-label">Date</label>
                        <TextField
                            error={isInvalidDate(arbitraryData.tranDate)}
                            helperText={isInvalidDate(arbitraryData.tranDate) ? accountsMessages.dateRangeAuditLockMessage : undefined}
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
                    {/* gstin */}
                    <TextField
                        label="Gstin no"
                        error={isInvalidGstin(arbitraryData.gstin)}
                        helperText={isInvalidGstin(arbitraryData.gstin) ? accountsMessages.invalidGstin : undefined}
                        onChange={(e: any) => {
                            arbitraryData.gstin = e.target.value
                            setRefresh({})
                        }}
                        value={arbitraryData.gstin || ''}
                    />
                </div>
            </div>
        )
    }

    function SubmitButton({ ad }: any) {
        const [, setRefresh] = useState({})
        const classes = useStyles()
        const allErrors: any = {}
        useEffect(() => {
            setAllErrors()
            const subs1 = filterOn(
                'SUBMIT-REFRESH'
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
        function setAllErrors() {
            allErrors.isTranDateError = () => {
                return (isInvalidDate(ad.tranDate))
            }
            allErrors.isGstinError = () => isInvalidGstin(ad.gstin)
            allErrors.debitBlockError = () => {
                let ret = false
                for (let item of ad.debits) {
                    if ((item.amount === 0) || (item.gstRate > 30)) {
                        ret = true
                        break
                    }
                    if (item.gstRate > 0) {
                        if (item.isIgst) {
                            if (!item.igst) {
                                ret = true
                                break
                            }
                        } else {
                            if (!item.cgst) {
                                ret = true
                                break
                            }
                        }

                    }
                }
                return (ret)
            }
        }
        function getError() {

            return true
        }

        function handleSubmit() { }
    }

    function ErrorMessage() {
        const [, setRefresh] = useState({})
        const meta = useRef({
            message: 'abc'
        })
        useEffect(() => {
            const subs1 = filterOn('ERROR-MESSAGE').subscribe((d: any) => {
                meta.current.message = d
                setRefresh({})
            })
            return (() => {
                subs1.unsubscribe()
            })
        }, [])
        return (
            <Typography variant='subtitle2' style={{ color: 'red', fontWeight: 'bold',  marginTop: '1px' }}>{meta.current.message}</Typography>        
        )
    }

    function computeGst(item: any) {
        const gstRate = item.gstRate || 0
        const gst = ((item.amount || 0) * (gstRate / 100)) / (1 + (gstRate / 100))
        if (item.isIgst) {
            item.igst = gst
            item.cgst = 0
            item.sgst = 0
        } else {
            item.igst = 0
            item.cgst = gst
            item.sgst = item.cgst
        }
    }

    function ActionDebit({ arbitraryData }: any) {
        const [, setRefresh] = useState({})
        const meta = useRef({
            action: 'debit'
        })
        const classes = useStyles(meta.current)
        useEffect(() => {
            const subs1 = filterOn('DEBIT-BLOCK-REFRESH').subscribe(() => {
                setRefresh({})
            })
            return (() => {
                subs1.unsubscribe()
            })
        }, [])
        return (
            <div className={classes.contentAction}>
                <Typography
                    className="debit-credit-label"
                    variant="subtitle2"
                    component="div"
                    color="secondary">
                    Debits
                </Typography>
                <DebitRows />
            </div>
        )

        function DebitRows() {
            const [, setRefresh] = useState({})
            let ind = 0
            const debits: any[] = arbitraryData.debits
            const list: any[] = debits.map((item: any) => {
                const ret = (
                    <div key={incr()} className="debit-credit-row">
                        {/* Account */}
                        <div>
                            <Typography variant="caption">
                                Debit account
                            </Typography>
                            <LedgerSubledger
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
                            onBlur={() => {
                                computeGst(item)
                                setRefresh({})
                            }}
                            error={(item.gstRate > 30) ? true : false}
                            onValueChange={(values: any) => {
                                const { floatValue } = values
                                item.gstRate = floatValue || 0.0
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
                                emit('ALL-DEBITS-ALL-CREDITS-REFRESH', '')
                                // computeSummary()
                                setRefresh({})
                            }}
                            onBlur={() => {
                                computeGst(item)
                                setRefresh({})
                            }}
                            thousandSeparator={true}
                            value={item.amount || 0.0}
                        />

                        <div className="gst-block">
                            <FormControlLabel
                                // value="item.isIgst"
                                control={<Checkbox
                                    // checked={item.isIgst}
                                    onChange={(e: any) => {
                                        item.isIgst = e.target.checked
                                        computeGst(item)
                                        setRefresh({})
                                    }}
                                    color="primary" />}
                                label="Igst"
                                labelPlacement="start"
                            />
                            <Typography className="gst" variant="body2">
                                Cgst: {toDecimalFormat(item.cgst || 0.0)}
                            </Typography>
                            <Typography className="gst" variant="body2">
                                Sgst: {toDecimalFormat(item.sgst || 0.0)}
                            </Typography>
                            <Typography className="gst" variant="body2">
                                Igst: {toDecimalFormat(item.igst || 0.0)}
                            </Typography>
                        </div>

                        {/* line ref no  */}
                        <TextField
                            label="Line ref"
                            // className="user-ref"
                            // error={getInvoiceError()}
                            onChange={(e: any) => {
                                item.lineRefNo = e.target.value
                                setRefresh({})
                            }}
                            value={item.lineRefNo || ''}
                        />
                        {/* remarks */}
                        <TextField
                            label="Remarks"
                            // className="common-remarks"
                            onChange={(e: any) => {
                                item.remarks = e.target.value
                                setRefresh({})
                            }}
                            value={item.remarks || ''}
                        />

                        {/* Add remove */}
                        <AddRemoveButtons arr={arbitraryData.debits} item={item} emitMessage='DEBIT-BLOCK-REFRESH' />
                    </div>
                )
                return ret
            })

            return <Paper elevation={1} className="debit-credit-block">{list}</Paper>

            function incr() {
                return ind++
            }
        }
    }

    function AddRemoveButtons({ arr, item, emitMessage }: any) {
        return (
            <div>
                <IconButton
                    color="secondary"
                    size="medium"
                    aria-label="delete"
                    onClick={remove}
                    style={{ margin: 0, padding: 0 }}>
                    <RemoveCircle style={{ fontSize: '2.5rem' }} />
                </IconButton>
                <IconButton
                    color="secondary"
                    aria-label="add"
                    onClick={add}
                    style={{ margin: 0, padding: 0 }}>
                    <AddCircle style={{ fontSize: '2.5rem' }} />
                </IconButton>
            </div>)

        function reIndex() {
            let ind = 0
            function incr() {
                return (ind++)
            }
            for (let it of arr) {
                it.key = incr()
            }
        }

        function add() {
            arr.push({})
            reIndex()
            emit(emitMessage, '')
        }

        function remove() {
            if (arr.length === 1) {
                return
            }
            arr.splice(item.key, 1)
            reIndex()
            emit(emitMessage, '')
            emit('ALL-DEBITS-ALL-CREDITS-REFRESH', '')
        }
    }

    function ActionCredit({ arbitraryData }: any) {
        const meta = useRef({
            action: 'credit'
        })
        const classes = useStyles(meta.current)
        useEffect(() => {
            const subs1 = filterOn('CREDIT-BLOCK-REFRESH').subscribe(() => {
                setRefresh({})
            })
            return (() => {
                subs1.unsubscribe()
            })
        }, [])
        return (
            <div className={classes.contentAction}>
                <Typography
                    className="debit-credit-label"
                    variant="subtitle2"
                    component="div"
                    color="secondary">
                    Credits
                </Typography>
                <CreditRows />
            </div>
        )

        function CreditRows() {
            const [, setRefresh] = useState({})
            let ind = 0
            const credits: any[] = arbitraryData.credits
            const list: any[] = credits.map((item: any) => {
                const ret = (
                    <div key={incr()} className="debit-credit-row">
                        {/* Account */}
                        <div>
                            <Typography variant="caption">
                                Credit account
                            </Typography>
                            <LedgerSubledger
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
                            onBlur={() => {
                                computeGst(item)
                                setRefresh({})
                            }}
                            thousandSeparator={true}
                            value={item.gstRate || 0.0}
                        />
                        {/* Amount */}
                        <NumberFormat
                            allowNegative={false}
                            {...{ label: 'Credit amount' }}
                            // {...matProps}
                            className="right-aligned-numeric credit-amount"
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
                                emit('ALL-DEBITS-ALL-CREDITS-REFRESH', '')
                                setRefresh({})
                            }}
                            onBlur={() => {
                                computeGst(item)
                                setRefresh({})
                            }}
                            thousandSeparator={true}
                            value={item.amount || 0.0}
                        />

                        <div className="gst-block">
                            <FormControlLabel
                                value="item.isIgst"
                                control={<Checkbox color="primary" />}
                                label="Igst"
                                labelPlacement="start"
                            />
                            <Typography className="gst" variant="body2">
                                Cgst: {toDecimalFormat(item.cgst || 0.0)}
                            </Typography>
                            <Typography className="gst" variant="body2">
                                Sgst: {toDecimalFormat(item.sgst || 0.0)}
                            </Typography>
                            <Typography className="gst" variant="body2">
                                Igst: {toDecimalFormat(item.igst || 0.0)}
                            </Typography>
                        </div>

                        {/* line ref no  */}
                        <TextField
                            label="Line ref"
                            // className="user-ref"
                            // error={getInvoiceError()}
                            onChange={(e: any) => {
                                item.lineRefNo = e.target.value
                                setRefresh({})
                            }}
                            value={item.lineRefNo || ''}
                        />
                        {/* remarks */}
                        <TextField
                            label="Remarks"
                            // className="common-remarks"
                            onChange={(e: any) => {
                                item.remarks = e.target.value
                                setRefresh({})
                            }}
                            value={item.remarks || ''}
                        />

                        {/* Add remove */}
                        <AddRemoveButtons arr={arbitraryData.credits} item={item} emitMessage='CREDIT-BLOCK-REFRESH' />
                    </div>
                )
                return ret
            })

            return <Paper elevation={1} className="debit-credit-block">{list}</Paper>
            function incr() {
                return ind++
            }
        }
    }

    return { ActionDebit, ActionCredit, Header, meta, setRefresh, SubmitButton }
}

export { useJournalMain }

const useStyles: any = makeStyles((theme: Theme) =>
    createStyles({
        contentHeader: {
            '& .header-line-1': {
                display: 'flex',
                columnGap:theme.spacing(4),
                rowGap: theme.spacing(2),
                flexWrap:'wrap',
                // justifyContent:'space-around',
                marginTop: theme.spacing(2),
                '& .auto-ref-no': {
                    color: theme.palette.blue.main,
                },
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
                    },
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

        contentAction: {
            '& .debit-credit-label': {
                marginTop: theme.spacing(2),
            },
            '& .right-aligned-numeric': {
                '& input': {
                    textAlign: 'end',
                },
            },
            '& .gst-rate': {
                width: theme.spacing(8),
            },
            '& .gst-block': {
                display: 'flex',
                flexDirection: 'column',
                width: theme.spacing(15),
                border: '1px solid lightgrey',
                padding: theme.spacing(1),
                '& .gst': {
                    textAlign: 'right',
                    fontSize: '0.8rem',
                },
                marginLeft: (props: any) => props.action === 'debit' ? 'auto' : 0,
            },
            '& .debit-credit-block': {
                padding: theme.spacing(1),
                // marginTop: theme.spacing(1)
            },
            '& .debit-credit-row': {
                display: 'flex',
                // marginTop: theme.spacing(2),
                marginBottom: theme.spacing(1),
                columnGap: theme.spacing(4),
                flexWrap: 'wrap',
                rowGap: theme.spacing(2),
                alignItems: 'center',
                // borderBottom:'1px solid lightgrey'
                '& .credit-amount': {
                    marginLeft: (props: any) => props.action === 'credit' ? 'auto' : 0,
                }
            },
        },

        contentSubmitButton: {
            marginLeft: 'auto',
        },

        contentAllDebitsllCredits: {
            color: 'dodgerblue',
            marginLeft: 'auto',
            fontWeight: 'bold'
        }
    })
)

export { useStyles }
