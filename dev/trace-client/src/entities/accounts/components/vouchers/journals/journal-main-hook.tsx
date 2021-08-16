import { useState, useEffect, useRef } from 'react'
import { makeStyles, Theme, createStyles } from '@material-ui/core'
import { useSharedElements } from '../../common/shared-elements-hook'
import { LedgerSubledger } from '../../common/ledger-subledger'

function useJournalMain(arbitraryData: any) {
    const [, setRefresh] = useState({})

    const {
        _,
        accountsMessages,
        AddCircle,
        // AddIcon,
        // Avatar,
        // Big,
        // Box,
        Button,
        // Card,
        Checkbox,
        CheckIcon,
        // Chip,
        // CloseIcon,
        // confirm,
        // DataTable,
        // DeleteIcon,
        // Dialog,
        // DialogTitle,
        // DialogContent,
        // DialogActions,
        // Divider,
        // doValidateForm,
        // EditIcon,
        emit,
        ErrorIcon,
        // execGenericView,
        filterOn,
        // genericUpdateMaster,
        // getCurrentEntity,
        // getFormData,
        // getFormObject,
        // getFromBag,
        getMappedAccounts,
        // globalMessages,
        // hotEmit,
        // hotFilterOn,
        FormControlLabel,
        // Icon,
        IconButton,
        // Input,
        // InputAdornment,
        isInvalidDate,
        isInvalidGstin,
        // isValidForm,
        // List,
        // ListItem,
        // ListItemAvatar,
        // ListItemText,
        // MaterialTable,
        // MinusIcon,
        // messages,
        // moment,
        // MTableBody,
        // MTableToolbar,
        // NativeSelect,
        NumberFormat,
        Paper,
        // PrimeColumn,
        // queries,
        // queryGraphql,
        // Radio,
        // ReactForm,
        // releaseForm,
        RemoveCircle,
        // resetAllFormErrors,
        // resetForm,
        // saveForm,
        // SearchIcon,
        // setFormError,
        // SyncIcon,
        // tableIcons,
        TextField,
        // theme,
        toDecimalFormat,
        // TraceDialog,
        // TraceFullWidthSubmitButton,
        // traceGlobalSearch,
        // TraceSearchBox,
        Typography,
        // useGeneric,
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
            <Paper elevation={1} className={classes.contentCrown}>
                <SummaryDebitsCredits ad={arbitraryData} />
                <SummaryGst ad={arbitraryData} />
                <ResetButton ad={arbitraryData} />
                <ErrorMessage />
                <SubmitButton ad={arbitraryData} />
            </Paper>
        )

        function useComputeSummary(ad: any) {
            const [, setRefresh] = useState({})
            useEffect(() => {
                const subs1 = filterOn('COMPUTE-SUMMARY-REFRESH').subscribe(() => {
                    setRefresh({})
                })
                return (() => {
                    subs1.unsubscribe()
                })
            }, [])
            ad.summary = {}
            const debitsSummary = getSummary('debits')
            const creditsSummary = getSummary('credits')

            function getSummary(summType: string) {
                return ad[summType].reduce((prev: any, curr: any) => {
                    prev.amount = (prev?.amount || 0.0) + (curr?.amount || 0.0)
                    prev.igst = (prev?.igst || 0.0) + (curr?.igst || 0.0)
                    prev.cgst = (prev?.cgst || 0.0) + (curr?.cgst || 0.0)
                    prev.sgst = (prev?.sgst || 0.0) + (curr?.sgst || 0.0)
                    return prev
                }, {})
            }
            const totalDebits = debitsSummary?.amount || 0.0
            const totalCredits = creditsSummary?.amount || 0.0
            const gstCredits = (creditsSummary?.igst || 0.0) + (creditsSummary?.cgst || 0.0) + (creditsSummary?.sgst || 0.0)
            const gstDebits = (debitsSummary?.igst || 0.0) + (debitsSummary?.cgst || 0.0) + (debitsSummary?.sgst || 0.0)
            ad.summary.totalDebits = totalDebits
            ad.summary.totalCredits = totalCredits
            ad.summary.gstDebits = gstDebits
            ad.summary.gstCredits = gstCredits
            return ({ totalDebits, totalCredits, gstDebits, gstCredits, })
        }

        function SummaryDebitsCredits({ ad }: any) {
            //ad has debits and credits array
            const { totalDebits, totalCredits } = useComputeSummary(ad)
            // const classes = useStyles()
            return (
                <div className="summary-debits-credits">
                    <Typography variant="subtitle2" component="span">
                        Total debits: {toDecimalFormat(totalDebits || 0.0)}
                    </Typography>
                    &nbsp;&nbsp;
                    <Typography variant="subtitle2" component="span">
                        Total credits: {toDecimalFormat(totalCredits || 0.0)}
                    </Typography>
                </div>
            )
        }

        function SummaryGst({ ad }: any) {
            const { gstDebits, gstCredits } = useComputeSummary(ad)
            return (
                <div className="summary-gst">
                    <Typography variant="subtitle2" component="span">
                        Gst debits: {toDecimalFormat(gstDebits || 0.0)}
                    </Typography>
                    &nbsp;&nbsp;
                    <Typography variant="subtitle2" component="span">
                        Gst credits: {toDecimalFormat(gstCredits || 0.0)}
                    </Typography>
                </div>
            )
        }

        function ErrorMessage() {
            const [, setRefresh] = useState({})
            const meta = useRef({
                message: '',
            })
            useEffect(() => {
                const subs1 = filterOn('ERROR-MESSAGE').subscribe((d: any) => {
                    meta.current.message = d.data
                    setRefresh({})
                })
                return () => {
                    subs1.unsubscribe()
                }
            }, [])
            return (
                <Typography variant="subtitle2" className="error-message">
                    {meta.current.message}
                </Typography>
            )
        }

        function ResetButton({ ad }: any) {
            return (
                <Button
                    className="reset-button"
                    variant="contained"
                    size="small"
                    onClick={handleReset}>
                    Reset
                </Button>
            )

            function handleReset() {
                ad.autoRefNo = undefined
                ad.commonRemarks = undefined
                ad.gstin = undefined
                ad.hsn = 0
                ad.id = undefined
                ad.isIgst = false
                ad.tranDate = undefined
                ad.userRefNo = undefined
                ad.debits = [{ key: 0 }]
                ad.credits = [{ key: 0 }]
                emit('JOURNAL-MAIN-REFRESH', '')
            }
        }

        function SubmitButton({ ad }: any) {
            const [, setRefresh] = useState({})
            // const classes = useStyles()
            const meta: any = useRef({
                errorObject: { message: undefined },
                errorMessage: '',
            })

            useEffect(() => {
                const subs1 = filterOn('SUBMIT-REFRESH').subscribe(() => {
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

                function headerError() {
                    function dateError() {
                        const isDateError = isInvalidDate(ad.tranDate)
                        mess = isDateError
                            ? accountsMessages.dateRangeAuditLockMessage
                            : ''
                        return isDateError
                    }

                    function gstinError() {
                        let isError = false
                        const isGst = ad.isGst
                        mess = ''
                        if (isGst) {
                            if (!ad.gstin) {
                                mess = accountsMessages.gstinRequired
                                isError = true
                            } else {
                                if (isInvalidGstin(ad.gstin)) {
                                    isError = true
                                    mess = accountsMessages.invalidGstin
                                }
                            }
                        }
                        return isError
                    }

                    const headError = dateError() || gstinError()
                    return headError
                }

                function rowsError(rowsName: string) {
                    // can be 'debits' or 'credits'
                    let isRowsError = false
                    const rows: any[] = ad[rowsName]
                    for (let row of rows) {
                        if (rowError(row)) {
                            isRowsError = true
                            break
                        }
                    }
                    return isRowsError

                    function rowError(row: any) {
                        function accountError() {
                            if (row.isLedgerSubledgerError) {
                                mess = accountsMessages.selectAccountHeader
                            }
                            return row.isLedgerSubledgerError
                        }

                        function amountError() {
                            const isAmountError = !row.amount
                            mess = isAmountError
                                ? accountsMessages.errorZeroAmount
                                : ''
                            return isAmountError
                        }

                        function gstRateError() {
                            mess = ''
                            let isError = false
                            if (ad.isGst) {
                                if (row.gstRate > 30) {
                                    isError = true
                                    mess = accountsMessages.invalidGstRate
                                }
                            } else {
                                if (row.gstRate) {
                                    isError = true
                                    mess = accountsMessages.gstRateWronglyGiven
                                }
                            }
                            return (isError)
                        }

                        function hsnNotPresentError() {
                            mess = ''
                            let isError = false
                            if (row.gstRate && row.gstRate > 0) {
                                if (!row.hsn) {
                                    isError = true
                                    mess = accountsMessages.hsnNotPresent
                                }
                            }

                            return (isError)
                        }

                        return (
                            accountError() ||
                            amountError() ||
                            gstRateError() ||
                            hsnNotPresentError()
                        )
                    }
                }

                function debitsCreditsNotEqualError() {
                    let isError = (ad?.summary?.totalDebits || 0.0) !== (ad?.summary?.totalCredits || 0.0)
                    mess = isError ? accountsMessages.debitCreditNotEqual : ''
                    return isError
                }

                function gstError() {
                    let isError = false
                    mess = ''
                    const gstDebits = ad?.summary?.gstDebits || 0.0
                    const gstCredits = ad?.summary?.gstCredits || 0.0
                    if (ad.isGst) {
                        if ((!gstDebits) && (!gstCredits)) {
                            isError = true
                            mess = accountsMessages.gstAmountMissing
                        }
                    } else {
                        if (gstDebits || gstCredits){
                            isError = true
                            mess = accountsMessages.gstAmountwronglyThere
                        }
                    }
                    return(isError)
                }

                let ret =
                    headerError() ||
                    rowsError('debits') ||
                    rowsError('credits') ||
                    debitsCreditsNotEqualError() ||
                    gstError()

                meta.current.errorMessage = mess

                return ret
            }

            function handleSubmit() { 
                function isDebitCreditError(){
                    let isError  = false
                    const totalDebits = ad?.summary?.totalDebits || 0.0
                    const totalCredits = ad?.summary?.totalCredits || 0.0
                    if((totalDebits !== totalCredits) || (totalDebits === 0) ){
                        isError = true
                    } 
                    return(isError)
                }
                if(isDebitCreditError()){
                    alert(accountsMessages.debitCreditError)
                    return
                } else {
                    //proceed with submit
                }
            }
        }
    }

    function Header({ arbitraryData }: any) {
        const classes = useStyles()
        const [, setRefresh] = useState({})
        return (
            <Paper elevation={1} className={classes.contentHeader}>
                <TextField
                    label="Ref no"
                    placeholder="Auto ref no"
                    disabled
                    value={arbitraryData.autoRefNo || ''}
                />
                {/* date */}
                <div className="date-block">
                    <label className="date-label">Date</label>
                    <TextField
                        error={isInvalidDate(arbitraryData.tranDate)}
                        helperText={
                            isInvalidDate(arbitraryData.tranDate)
                                ? accountsMessages.dateRangeAuditLockMessage
                                : undefined
                        }
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
                <FormControlLabel
                    className="gst-invoice"
                    control={
                        <Checkbox
                            // checked={arbitraryData.isGst}
                            onChange={(e: any) => {
                                arbitraryData.isGst = e.target.checked
                                emit('SUBMIT-REFRESH', '')
                                setRefresh({})
                            }}
                        />
                    }
                    label="Gst"
                />

                {/* gstin */}
                <TextField
                    label="Gstin no"
                    error={isInvalidGstin(arbitraryData.gstin)}
                    helperText={
                        isInvalidGstin(arbitraryData.gstin)
                            ? accountsMessages.invalidGstin
                            : undefined
                    }
                    onChange={(e: any) => {
                        arbitraryData.gstin = e.target.value
                        emit('SUBMIT-REFRESH', '')
                        setRefresh({})
                    }}
                    value={arbitraryData.gstin || ''}
                />
            </Paper>
        )
    }

    function computeGst(item: any) {
        const gstRate = item.gstRate || 0
        const gst = ((item.amount || 0) * (gstRate / 100)) / (1 + gstRate / 100)
        if (item.isIgst) {
            item.igst = gst
            item.cgst = 0
            item.sgst = 0
        } else {
            item.igst = 0
            item.cgst = gst / 2
            item.sgst = item.cgst
        }
    }

    function ActionBlock({arbitraryData, actionType}: any){
        const [, setRefresh] = useState({})
        const meta = useRef({
            action: 'debit',
        })
        const classes = useStyles(meta)
        useEffect(() => {
            const subs1 = filterOn('ACTION-REFRESH').subscribe(() => {
                setRefresh({})
            })
            return () => {
                subs1.unsubscribe()
            }
        }, [])
        return(
            <div className={classes.contentAction}>
                <Typography
                    className="debit-credit-label"
                    variant="subtitle2"
                    component="div"
                    color="secondary">
                    {actionType}
                </Typography>
                <ActionRows ad={arbitraryData} actionType={actionType} />
            </div>
        )

        function ActionRows({ad, actionType}: any){
            const [, setRefresh] = useState({})
            let ind = 0
            const actionRows: any[] = ad[actionType]
            const list: any[] = actionRows.map((item:any)=>{
                return (
                    <div key={incr()} className="debit-credit-row">
                        {/* Account */}
                        <div>
                            <Typography variant="caption">
                                Debit account
                            </Typography>
                            <LedgerSubledger
                                allAccounts={arbitraryData.accounts.all}
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
                                emit('COMPUTE-SUMMARY-REFRESH', '')
                                emit('SUBMIT-REFRESH', '')
                                setRefresh({})
                            }}
                            error={item.gstRate > 30 ? true : false}
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
                            className="hsn"
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
                                emit('COMPUTE-SUMMARY-REFRESH', '')
                                // computeSummary()
                                setRefresh({})
                            }}
                            onBlur={() => {
                                computeGst(item)
                                emit('COMPUTE-SUMMARY-REFRESH', '')
                                setRefresh({})
                            }}
                            thousandSeparator={true}
                            value={item.amount || 0.0}
                        />

                        <div className="gst-block">
                            <FormControlLabel
                                // value="item.isIgst"
                                control={
                                    <Checkbox
                                        // checked={item.isIgst}
                                        onChange={(e: any) => {
                                            item.isIgst = e.target.checked
                                            computeGst(item)
                                            setRefresh({})
                                        }}
                                        color="primary"
                                    />
                                }
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
                        <AddRemoveButtons
                            arr={arbitraryData.debits}
                            item={item}
                            emitMessage="DEBIT-BLOCK-REFRESH"
                        />
                    </div>
                )
            })
            return (
                <Paper elevation={1} className="debit-credit-block">
                    {list}
                </Paper>
            )
            function incr() {
                return ind++
            }
        }
    }

    function ActionDebit({ arbitraryData }: any) {
        const [, setRefresh] = useState({})
        const meta = useRef({
            action: 'debit',
        })
        const classes = useStyles(meta.current)
        useEffect(() => {
            const subs1 = filterOn('DEBIT-BLOCK-REFRESH').subscribe(() => {
                setRefresh({})
            })
            return () => {
                subs1.unsubscribe()
            }
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
                                emit('COMPUTE-SUMMARY-REFRESH', '')
                                emit('SUBMIT-REFRESH', '')
                                setRefresh({})
                            }}
                            error={item.gstRate > 30 ? true : false}
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
                            className="hsn"
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
                                emit('COMPUTE-SUMMARY-REFRESH', '')
                                // computeSummary()
                                setRefresh({})
                            }}
                            onBlur={() => {
                                computeGst(item)
                                emit('COMPUTE-SUMMARY-REFRESH', '')
                                setRefresh({})
                            }}
                            thousandSeparator={true}
                            value={item.amount || 0.0}
                        />

                        <div className="gst-block">
                            <FormControlLabel
                                // value="item.isIgst"
                                control={
                                    <Checkbox
                                        // checked={item.isIgst}
                                        onChange={(e: any) => {
                                            item.isIgst = e.target.checked
                                            computeGst(item)
                                            setRefresh({})
                                        }}
                                        color="primary"
                                    />
                                }
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
                        <AddRemoveButtons
                            arr={arbitraryData.debits}
                            item={item}
                            emitMessage="DEBIT-BLOCK-REFRESH"
                        />
                    </div>
                )
                return ret
            })

            return (
                <Paper elevation={1} className="debit-credit-block">
                    {list}
                </Paper>
            )

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
            </div>
        )

        function reIndex() {
            let ind = 0
            function incr() {
                return ind++
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
            emit('COMPUTE-SUMMARY-REFRESH', '')
            emit('SUBMIT-REFRESH', '')
        }
    }

    function ActionCredit({ arbitraryData }: any) {
        const [, setRefresh] = useState({})
        const meta = useRef({
            action: 'credit',
        })
        const classes = useStyles(meta.current)
        useEffect(() => {
            const subs1 = filterOn('CREDIT-BLOCK-REFRESH').subscribe(() => {
                setRefresh({})
            })
            return () => {
                subs1.unsubscribe()
            }
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
                                emit('SUBMIT-REFRESH', '')
                                emit('COMPUTE-SUMMARY-REFRESH', '')
                                setRefresh({})
                            }}
                            thousandSeparator={true}
                            value={item.gstRate || 0.0}
                        />

                        {/* HSN */}
                        <NumberFormat
                            className="hsn"
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
                                emit('COMPUTE-SUMMARY-REFRESH', '')
                                setRefresh({})
                            }}
                            onBlur={() => {
                                computeGst(item)
                                emit('COMPUTE-SUMMARY-REFRESH', '')
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
                        <AddRemoveButtons
                            arr={arbitraryData.credits}
                            item={item}
                            emitMessage="CREDIT-BLOCK-REFRESH"
                        />
                    </div>
                )
                return ret
            })

            return (
                <Paper elevation={1} className="debit-credit-block">
                    {list}
                </Paper>
            )
            function incr() {
                return ind++
            }
        }
    }

    return { ActionBlock, ActionDebit, ActionCredit, Crown, Header, meta, setRefresh }
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
            padding: theme.spacing(1),
            backgroundColor: '#E8E8E8',

            '& .summary-debits-credits': {
                color: theme.palette.indigo.main,
                fontWeight: 'bold',
            },

            '& .summary-gst': {
                color: theme.palette.lime.dark,
            },

            '& .error-message': {
                color: 'red',
                fontWeight: 'bold',
            },

            // '& .submit-button': {},
            '& .reset-button': {
                backgroundColor: theme.palette.blue.main,
                color: theme.palette.getContrastText(theme.palette.blue.main),
            },
        },

        contentHeader: {
            marginTop: theme.spacing(2),
            display: 'flex',
            flexWrap: 'wrap',
            columnGap: theme.spacing(4),
            rowGap: theme.spacing(2),
            padding: theme.spacing(1),
            backgroundColor: '#F6F6F4',
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
                marginLeft: (props: any) =>
                    props.action === 'debit' ? 'auto' : 0,
            },
            '& .debit-credit-block': {
                backgroundColor: '#F6F6F4',
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
                    marginLeft: (props: any) =>
                        props.action === 'credit' ? 'auto' : 0,
                },
            },
        },
    })
)

export { useStyles }
