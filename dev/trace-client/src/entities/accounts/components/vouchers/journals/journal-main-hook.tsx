import React, { useState, useEffect, useRef } from 'react'
import { makeStyles, Theme, createStyles } from '@material-ui/core'
import { useSharedElements } from '../../common/shared-elements-hook'
import { classNames } from 'react-select/src/utils'
import { LedgerSubledger } from '../../common/ledger-subledger'
import { RemoveCircle } from '@material-ui/icons'
import { ThemeConsumer } from 'styled-components'
import { indigo } from '@material-ui/core/colors'

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
        hotEmit,
        hotFilterOn,
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



    function Crown({ arbitraryData }: any) {
        const classes = useStyles()
        const [, setRefresh] = useState({})
        return (
            <div className={classes.contentCrown}>
                <TotalDebitsTotalCredits ad={arbitraryData} />
                <ErrorMessage />
                <ResetButton ad={arbitraryData} />
                <SubmitButton ad={arbitraryData} />
            </div>
        )

        function TotalDebitsTotalCredits({ ad }: any) {
            //ad has debits and credits array
            const [, setRefresh] = useState({})
            const classes = useStyles()
            useEffect(() => {
                compute()
                setRefresh({})
                const subs1 = filterOn('TOTAL-DEBITS-TOTAL-CREDITS-REFRESH').subscribe(() => {
                    compute()
                    setRefresh({})
                })

                return (() => {
                    subs1.unsubscribe()
                })
            }, [])

            return (<div className='total-debits-total-credits'>
                <Typography variant='subtitle2' component='span'>Total debits: {toDecimalFormat(ad.totalDebits || 0.00)}</Typography>&nbsp;&nbsp;
                <Typography variant='subtitle2' component='span'>Total credits: {toDecimalFormat(ad.totalCredits || 0.00)}</Typography>
            </div>)

            function compute() {
                ad.totalDebits = ad.debits.reduce((prev: any, curr: any) => {
                    prev.amount = prev.amount + (curr.amount || 0.0)
                    return (prev)
                }, { amount: 0 }).amount
                ad.totalCredits = ad.credits.reduce((prev: any, curr: any) => {
                    prev.amount = prev.amount + (curr.amount || 0.0)
                    return (prev)
                }, { amount: 0 }).amount
            }
        }

        function ErrorMessage() {
            const [, setRefresh] = useState({})
            const meta = useRef({
                message: ''
            })
            useEffect(() => {
                const subs1 = filterOn('ERROR-MESSAGE').subscribe((d: any) => {
                    meta.current.message = d.data
                    setRefresh({})
                })
                return (() => {
                    subs1.unsubscribe()
                })
            }, [])
            return (
                <Typography variant='subtitle2' className='error-message'>{meta.current.message}</Typography>
            )
        }

        function ResetButton({ ad }: any) {
            return (<Button
                className='reset-button'
                variant='contained'
                size='small'
                onClick={handleReset}

            >Reset</Button>)

            function handleReset() {
                ad.autoRefNo = undefined
                ad.commonRemarks = undefined
                ad.gstin = undefined
                ad.hsn = 0
                ad.id = undefined
                ad.isIgst = false
                ad.tranDate = undefined
                ad.userRefNo = undefined
                ad.debits = [{ key: 0 },]
                ad.credits = [{ key: 0 },]
                emit('JOURNAL-MAIN-REFRESH', '')
            }
        }

        function SubmitButton({ ad }: any) {
            const [, setRefresh] = useState({})
            const classes = useStyles()
            const meta: any = useRef({
                errorObject: { message: undefined },
                errorMessage: ''
            })

            useEffect(() => {
                const subs1 = filterOn(
                    'SUBMIT-REFRESH'
                ).subscribe(() => {
                    setRefresh({})
                })
                return () => {
                    subs1.unsubscribe()
                }
            }, [])

            useEffect(() => {
                emit('ERROR-MESSAGE', meta.current.errorMessage) // This refreshes another component so allowed from useEffect only
            })

            const isError = getError()
            return (
                <Button
                    // className={classes.contentSubmitButton}
                    variant="contained"
                    size="small"
                    color="secondary"
                    onClick={handleSubmit}
                    startIcon={
                        isError ? (
                            <ErrorIcon color="error" />
                        ) : (
                            <CheckIcon style={{ color: 'white' }} />
                        )
                    }
                    disabled={isError}>
                    Submit
                </Button>
            )

            function getError() {
                let mess: string = ''
                function headError() {
                    function dateError() {
                        const isDateError = isInvalidDate(ad.tranDate)
                        mess = isDateError ? accountsMessages.dateRangeAuditLockMessage : ''
                        return (isDateError)
                    }

                    function gstinError() {
                        const isGstinError = isInvalidGstin(
                            arbitraryData.gstin
                        )
                        mess = isGstinError ? accountsMessages.invalidGstin : ''
                        return isGstinError
                    }

                    const headError = dateError() || gstinError()
                    return (headError)
                }

                function rowsError(rowsName: string) { // can be 'debits' or 'credits'
                    let isRowsError = false
                    const rows: any[] = ad[rowsName]
                    for (let row of rows) {
                        if (rowError(row)) {
                            isRowsError = true
                            break
                        }
                    }
                    return (isRowsError)

                    function rowError(row: any) {
                        function accountError() {
                            if (row.isLedgerSubledgerError) {
                                mess = accountsMessages.selectAccountHeader
                            }
                            return (row.isLedgerSubledgerError)
                        }

                        function amountError() {
                            const isAmountError = (!row.amount)
                            mess = isAmountError ? accountsMessages.errorZeroAmount : ''
                            return (isAmountError)
                        }

                        function gstRateError() {
                            const isGstRateError = (row.gstRate > 30)
                            mess = isGstRateError ? accountsMessages.invalidGstRate : ''
                            return (isGstRateError)
                        }

                        function hsnNotPresentError() {
                            let isHsnNotPresentError = false
                            if (row.gstRate && (row.gstRate > 0)) {
                                if (!row.hsn) {
                                    isHsnNotPresentError = true
                                }
                            }
                            mess = accountsMessages.hsnNotPresent
                            return (isHsnNotPresentError)
                        }

                        return (accountError() || amountError() || gstRateError() || hsnNotPresentError())
                    }
                }

                function debitsCreditsNotEqualError() {
                    let isError = (ad.totalDebits !== ad.totalCredits)
                    mess = isError ? accountsMessages.debitCreditNotEqual : ''
                    return (isError)
                }


                let ret = headError() || rowsError('debits') || rowsError('credits') || debitsCreditsNotEqualError()

                meta.current.errorMessage = mess

                return (ret)
            }

            function handleSubmit() { }
        }

    }

    function Header({ arbitraryData }: any) {
        const classes = useStyles()
        const [, setRefresh] = useState({})
        return (
            <div className={classes.contentHeader}>
                <TextField
                    label="Ref no"
                    placeholder='Auto ref no'
                    disabled
                    value={arbitraryData.autoRefNo || ''}
                />
                {/* date */}
                <div className="date-block">
                    <label className="date-label">Date</label>
                    <TextField
                        error={isInvalidDate(arbitraryData.tranDate)}
                        helperText={isInvalidDate(arbitraryData.tranDate) ? accountsMessages.dateRangeAuditLockMessage : undefined}
                        type="date"
                        onChange={(e: any) => {
                            arbitraryData.tranDate = e.target.value
                            emit('SUBMIT-REFRESH', '')
                            setRefresh({})
                        }}
                        onFocus={(e) => e.target.select()}
                        value={arbitraryData.tranDate || ''}
                    />
                </div>
                {/* user ref no  */}
                <TextField
                    label="User ref"
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
                        emit('SUBMIT-REFRESH', '')
                        setRefresh({})
                    }}
                    value={arbitraryData.gstin || ''}
                />
            </div>
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
                                // emitMessageOnChange="SUBMIT-REFRESH"
                                ledgerAccounts={getMappedAccounts(
                                    arbitraryData.accounts.journal
                                )}
                                onChange={() => emit('SUBMIT-REFRESH', '')}
                                rowData={item}
                            />
                        </div>

                        {/* Gst rate */}
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
                                emit('SUBMIT-REFRESH', '')
                                setRefresh({})
                            }}
                            thousandSeparator={true}
                            value={item.gstRate || 0.0}
                        />

                        {/* HSN */}
                        <NumberFormat
                            className='hsn'
                            allowNegative={false}
                            {...{ label: 'Hsn' }}
                            customInput={TextField}
                            onFocus={(e) => {
                                e.target.select()
                            }}
                            onChange={(e: any) => {
                                item.hsn = e.target.value
                                emit('SUBMIT-REFRESH', '')
                                setRefresh({})
                            }}
                            value={item.hsn || 0.0}
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
                                emit('SUBMIT-REFRESH', '')
                                emit('TOTAL-DEBITS-TOTAL-CREDITS-REFRESH', '')
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
            emit('SUBMIT-REFRESH', '')
        }

        function remove() {
            if (arr.length === 1) {
                alert(accountsMessages.cannotDeleteOnlyEntry)
                return
            }
            arr.splice(item.key, 1)
            reIndex()
            emit(emitMessage, '')
            emit('TOTAL-DEBITS-TOTAL-CREDITS-REFRESH', '')
            emit('SUBMIT-REFRESH', '')
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
                                onChange={() => emit('SUBMIT-REFRESH', '')}
                                ledgerAccounts={getMappedAccounts(
                                    arbitraryData.accounts.journal
                                )}
                                // onChange={onChangeLedgerSubledger}
                                rowData={item}
                            />
                        </div>

                        {/* Gst rate */}
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
                                item.gstRate = floatValue || 0.0
                                emit('SUBMIT-REFRESH', '')
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

                        {/* HSN */}
                        <NumberFormat
                            className='hsn'
                            allowNegative={false}
                            {...{ label: 'Hsn' }}
                            customInput={TextField}
                            onFocus={(e) => {
                                e.target.select()
                            }}
                            onChange={(e: any) => {
                                item.hsn = e.target.value
                                emit('SUBMIT-REFRESH', '')
                                setRefresh({})
                            }}
                            value={item.hsn || 0.0}
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
                                emit('SUBMIT-REFRESH', '')
                                emit('TOTAL-DEBITS-TOTAL-CREDITS-REFRESH', '')
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

    return { ActionDebit, ActionCredit, Crown, Header, meta, setRefresh }
}

export { useJournalMain }

const useStyles: any = makeStyles((theme: Theme) =>
    createStyles({

        contentCrown: {
            display: 'flex',
            columnGap: theme.spacing(4),
            rowGap: theme.spacing(2),
            flexWrap: 'wrap',
            marginTop: theme.spacing(2),
            alignItems: 'center',
            justifyContent: 'space-between',
            '& .total-debits-total-credits': {
                color: 'dodgerblue',
                fontWeight: 'bold'
            },

            '& .error-message': {
                color: 'red',
                fontWeight: 'bold',
            },

            '& .submit-button': {

            },
            '& .reset-button': {
                backgroundColor: theme.palette.indigo.light,
                color: theme.palette.getContrastText(indigo[400])
            }
        },


        myRoot: {
            backgroundColor: theme.palette.indigo.main
        },

        contentHeader: {
            marginTop: theme.spacing(2),
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

        contentAction: {
            '& .debit-credit-label': {
                marginTop: theme.spacing(2),
            },
            '& .right-aligned-numeric': {
                width: theme.spacing(18),
                '& input': {
                    textAlign: 'end',
                },
            },
            '& .gst-rate': {
                width: theme.spacing(8),
            },
            '& .hsn': {
                width: theme.spacing(10),
                // fontSize:'0.5rem',
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
            },
            '& .debit-credit-row': {
                display: 'flex',
                marginBottom: theme.spacing(1),
                columnGap: theme.spacing(4),
                flexWrap: 'wrap',
                rowGap: theme.spacing(2),
                alignItems: 'center',
                '& .credit-amount': {
                    marginLeft: (props: any) => props.action === 'credit' ? 'auto' : 0,
                }
            },
        },

    })
)

export { useStyles }
