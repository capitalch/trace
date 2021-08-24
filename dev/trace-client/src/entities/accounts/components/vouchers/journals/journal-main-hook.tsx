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
        Button,
        Checkbox,
        CheckIcon,
        emit,
        ErrorIcon,
        filterOn,
        genericUpdateMasterDetails,
        getFromBag,
        getMappedAccounts,
        FormControlLabel,
        IconButton,
        isInvalidDate,
        isInvalidGstin,
        NumberFormat,
        Paper,
        RemoveCircle,
        TextField,
        toDecimalFormat,
        Typography,
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
        errorMessage: '',
    })

    function useCrown(meta: any) {
        const [, setRefresh] = useState({})

        function checkError(ad: any) {
            function headerError() {
                function dateError() {
                    let m = ''
                    if (isInvalidDate(ad.header.tranDate)) {
                        m = accountsMessages.dateRangeAuditLockMessage
                    }
                    return m
                }

                function gstinError() {
                    let m = ''
                    const isGst = ad.isGst

                    if (isGst) {
                        if (!ad.gstin) {
                            m = accountsMessages.gstinRequired
                        } else {
                            if (isInvalidGstin(ad.gstin)) {
                                m = accountsMessages.invalidGstin
                            }
                        }
                    }
                    return m
                }

                const headError = dateError() || gstinError()
                return headError
            }

            function rowsError(rowsName: string) {
                // can be 'debits' or 'credits'
                let m = ''
                const rows: any[] = ad[rowsName]
                for (let row of rows) {
                    if (rowError(row)) {
                        break
                    }
                }
                return m

                function rowError(row: any) {
                    function accountError() {
                        let m = ''
                        if (row.isLedgerSubledgerError) {
                            m = accountsMessages.selectAccountHeader
                        }
                        return m
                    }

                    function amountError() {
                        let m = ''
                        if (!row.amount) {
                            m = accountsMessages.errorZeroAmount
                        }
                        return m
                    }

                    function gstRateError() {
                        let m = ''

                        if (ad.isGst) {
                            if (row.gstRate > 30) {
                                m = accountsMessages.invalidGstRate
                            }
                        } else {
                            if (row.gstRate) {
                                m = accountsMessages.gstRateWronglyGiven
                            }
                        }
                        return m
                    }

                    function hsnNotPresentError() {
                        let m = ''
                        if (row.gstRate && row.gstRate > 0) {
                            if (!row.hsn) {
                                m = accountsMessages.hsnNotPresent
                            }
                        }
                        return m
                    }
                    m =
                        accountError() ||
                        amountError() ||
                        gstRateError() ||
                        hsnNotPresentError()
                    return m
                }
            }

            function debitsCreditsNotEqualError() {
                const { totalDebits, totalCredits } = computeSummary(ad)
                let m = ''
                if (totalDebits !== totalCredits) {
                    m = accountsMessages.debitCreditNotEqual
                }
                return m
            }

            function commonAccountError() {
                let m = ''
                const debits: any[] = ad.debits
                const credits: any[] = ad.credits
                for (let row of debits) {
                    const ret = credits.findIndex(
                        (x: any) => row.accId === x.accId
                    )
                    if (ret !== -1) {
                        m = accountsMessages.commonAccountCodesInDebitsCredits
                        break
                    }
                }
                return m
            }

            function gstError() {
                let m = ''
                const gstDebits = ad?.summary?.gstDebits || 0.0
                const gstCredits = ad?.summary?.gstCredits || 0.0
                if (ad.header.isGst) {
                    if (!gstDebits && !gstCredits) {
                        m = accountsMessages.gstAmountMissing
                    }
                } else {
                    if (gstDebits || gstCredits) {
                        m = accountsMessages.gstAmountwronglyThere
                    }
                }
                return m
            }

            meta.current.errorMessage =
                headerError() ||
                rowsError('debits') ||
                rowsError('credits') ||
                debitsCreditsNotEqualError() ||
                gstError() ||
                commonAccountError()
        }

        function computeSummary(ad: any) {
            ad.summary = {}
            const debitsSummary = getSummary('debits')
            const creditsSummary = getSummary('credits')

            function getSummary(summType: string) {
                return ad[summType].reduce(
                    (prev: any, curr: any) => {
                        prev.amount =
                            (prev?.amount || 0.0) + (curr?.amount || 0.0)
                        prev.gst.igst =
                            (prev?.gst.igst || 0.0) + (curr?.gst?.igst || 0.0)
                        prev.gst.cgst =
                            (prev?.gst.cgst || 0.0) + (curr?.gst?.cgst || 0.0)
                        prev.gst.sgst =
                            (prev?.gst.sgst || 0.0) + (curr?.gst?.sgst || 0.0)
                        return prev
                    },
                    {
                        amount: 0,
                        gst: {}
                    }
                )
            }
            const totalDebits = debitsSummary?.amount || 0.0
            const totalCredits = creditsSummary?.amount || 0.0
            const gstCredits =
                (creditsSummary?.gst?.igst || 0.0) +
                (creditsSummary?.gst?.cgst || 0.0) +
                (creditsSummary?.gst?.sgst || 0.0)
            const gstDebits =
                (debitsSummary?.gst.igst || 0.0) +
                (debitsSummary?.gst.cgst || 0.0) +
                (debitsSummary?.gst.sgst || 0.0)
            ad.summary.totalDebits = totalDebits
            ad.summary.totalCredits = totalCredits
            ad.summary.gstDebits = gstDebits
            ad.summary.gstCredits = gstCredits
            return { totalDebits, totalCredits, gstDebits, gstCredits }
        }

        function ResetButton() {
            return (
                <Button
                    className="reset-button"
                    variant="contained"
                    size="small"
                    onClick={() => {
                        emit('JOURNAL-RESET', '')
                    }}>
                    Reset
                </Button>
            )
        }

        function SubmitButton({ ad }: any) {
            return (
                <Button
                    variant="contained"
                    size="small"
                    color="secondary"
                    onClick={() => handleSubmit()}
                    startIcon={
                        meta.current.errorMessage ? (
                            <ErrorIcon color="error" />
                        ) : (
                            <CheckIcon style={{ color: 'white' }} />
                        )
                    }
                    disabled={!!meta.current.errorMessage}
                >
                    Submit
                </Button>
            )

            function handleSubmit() {
                function isDebitCreditError() {
                    let isError = false
                    const totalDebits = ad?.summary?.totalDebits || 0.0
                    const totalCredits = ad?.summary?.totalCredits || 0.0
                    if (totalDebits !== totalCredits || totalDebits === 0) {
                        isError = true
                    }
                    return isError
                }
                if (isDebitCreditError()) {
                    alert(accountsMessages.debitCreditError)
                    return
                } else {
                    //proceed with submit
                    transformAndSubmit()
                }

                async function transformAndSubmit() {
                    const voucher: any = {
                        tableName: 'TranH',
                        data: [],
                    }

                    const dataItem: any = {
                        tranDate: null,
                        userRefNo: null,
                        remarks: null,
                        finYearId: getFromBag('finYearObject')?.finYearId,
                        branchId: getFromBag('branchObject')?.branchId || 1,
                        posId: '1',
                        details: [],
                        tranTypeId: 0,
                    }

                    dataItem.tranDate = ad.header.tranDate
                    dataItem.userRefNo = ad.header.userRefNo
                    dataItem.remarks = ad.header.remarks
                    dataItem.tranTypeId = ad.header.tranType || 1
                    dataItem.id = ad.header.id || undefined
                    voucher.data.push(dataItem)

                    const details = dataItem.details
                    const debits: any[] = ad.debits
                    const credits: any[] = ad.credits

                    addToDetails(debits, details, 'D')
                    addToDetails(credits, details, 'C')
                    console.log(JSON.stringify(voucher))

                    const ret = await genericUpdateMasterDetails([voucher])

                    if (ret.error) {
                        console.log(ret.error)
                    } else {
                        emit('JOURNAL-RESET', '')
                    }

                    function addToDetails(
                        sourceArray: any[],
                        destArray: any,
                        dc: string
                    ) {
                        for (let item of sourceArray) {
                            const temp:any = {
                                tableName: 'TranD',
                                fkeyName: 'tranHeaderId',
                                data: {
                                    id: item.id || undefined,
                                    accId: item.accId,
                                    remarks: item.remarks,
                                    dc: dc,
                                    amount: item.amount,
                                    lineRefNo: item.lineRefNo,
                                    instrNo: item.instrNo,
                                    details: [],
                                },
                            }
                            if(ad.deletedDetailsIds && (ad.deletedDetailsIds.length > 0)){
                                temp.deletedIds = ad.deletedDetailsIds
                            }
                            const details: any[] = temp.data.details
                            const detail: any = {
                                tableName: 'ExtGstTranD',
                                fkeyName: 'tranDetailsId',
                            }
                            destArray.push(temp)
                            // accommodate gst details etc in details
                            const gst: any = {}
                            if (ad.header.isGst || item.gst.id) { // id is present when in edit mode. This allows to make GST 0.00 in edit mode
                                if (item.gst.rate || item.gst.id) {
                                    gst.id = item.gst.id || undefined
                                    gst.gstin = ad.header.gstin
                                    gst.rate = item.gst.rate
                                    gst.hsn = item.gst.hsn
                                    gst.cgst = item.gst.cgst
                                    gst.sgst = item.gst.sgst
                                    gst.igst = item.gst.igst
                                    gst.isInput = dc === 'D' ? true : false
                                }
                            }
                            if (!_.isEmpty(gst)) {
                                detail.data = gst
                                details.push(detail)
                            }
                        }
                    }
                }
            }
        }

        function SummaryDebitsCredits({ ad }: any) {
            //ad has debits and credits array
            const { totalDebits, totalCredits } = computeSummary(ad)
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
            const { gstDebits, gstCredits } = computeSummary(ad)
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

        return {
            checkError,
            ResetButton,
            SubmitButton,
            // meta,
            setRefresh,
            SummaryDebitsCredits,
            SummaryGst,
        }
    }

    function Crown({ arbitraryData, meta }: any) {
        const classes = useStyles()
        const {
            checkError,
            ResetButton,
            SubmitButton,
            // meta,
            setRefresh,
            SummaryDebitsCredits,
            SummaryGst,
        } = useCrown(meta)
        useEffect(() => {
            const subs1 = filterOn('JOURNAL-MAIN-CROWN-REFRESH').subscribe(
                () => {
                    meta.current.errorMessage = ''
                    checkError(arbitraryData)
                    setRefresh({})
                    emit(
                        'JOURNAL-MAIN-CROWN2-REFRESH',
                        meta.current.errorMessage
                    )
                }
            )
            return () => {
                subs1.unsubscribe()
            }
        }, [])

        checkError(arbitraryData)
        return (
            <Paper elevation={1} className={classes.contentCrown}>
                <SummaryDebitsCredits ad={arbitraryData} />
                <SummaryGst ad={arbitraryData} />
                <ResetButton />
                <Typography variant="subtitle2" className="error-message">
                    {meta.current.errorMessage}
                </Typography>
                <SubmitButton ad={arbitraryData} meta={meta} />
            </Paper>
        )
    }

    function Crown1({ arbitraryData, meta }: any) {
        const classes = useStyles()
        const [, setRefresh] = useState({})
        const {
            checkError,
            ResetButton,
            SubmitButton,
            // meta,
            // setRefresh,
            SummaryDebitsCredits,
            SummaryGst,
        } = useCrown(meta)
        // checkError(arbitraryData)
        useEffect(() => {
            const subs1 = filterOn('JOURNAL-MAIN-CROWN2-REFRESH').subscribe(
                (d: any) => {
                    setRefresh({})
                }
            )
            return () => {
                subs1.unsubscribe()
            }
        }, [])
        return (
            <Paper elevation={1} className={classes.contentCrown}>
                <SummaryDebitsCredits ad={arbitraryData} />
                <SummaryGst ad={arbitraryData} />
                <ResetButton />
                <Typography variant="subtitle2" className="error-message">
                    {meta.current.errorMessage}
                </Typography>
                <SubmitButton ad={arbitraryData} meta={meta} />
                {/* <Button variant="contained" size='small' color='secondary' disabled={meta.current.isError}>
                    Submit
                </Button> */}
            </Paper>
        )
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
                    value={arbitraryData.header.autoRefNo || ''}
                />
                {/* date */}
                <div className="date-block">
                    <label className="date-label">Date</label>
                    <TextField
                        error={isInvalidDate(arbitraryData.header.tranDate)}
                        helperText={
                            isInvalidDate(arbitraryData.header.tranDate)
                                ? accountsMessages.dateRangeAuditLockMessage
                                : undefined
                        }
                        type="date"
                        onChange={(e: any) => {
                            arbitraryData.header.tranDate = e.target.value
                            emit('JOURNAL-MAIN-CROWN-REFRESH', '')
                            setRefresh({})
                        }}
                        onFocus={(e) => e.target.select()}
                        value={arbitraryData.header.tranDate || ''}
                    />
                </div>
                {/* user ref no  */}
                <TextField
                    label="User ref"
                    className="user-ref"
                    // error={getInvoiceError()}
                    onChange={(e: any) => {
                        arbitraryData.header.userRefNo = e.target.value
                        setRefresh({})
                    }}
                    value={arbitraryData.header.userRefNo || ''}
                />
                {/* remarks */}
                <TextField
                    label="Common remarks"
                    className="common-remarks"
                    onChange={(e: any) => {
                        arbitraryData.header.remarks = e.target.value
                        setRefresh({})
                    }}
                    value={arbitraryData.header.remarks || ''}
                />
                {/* isGst */}
                <FormControlLabel
                    className="gst-invoice"
                    control={
                        <Checkbox
                            onChange={(e: any) => {
                                arbitraryData.header.isGst = e.target.checked
                                emit('JOURNAL-MAIN-CROWN-REFRESH', '') // for eval of error condition
                                emit('ACTION-BLOCK-REFRESH', '')
                                setRefresh({})
                            }}
                            value={!!arbitraryData.header.isGst}
                            checked={!!arbitraryData.header.isGst}
                        />
                    }
                    label="Gst"
                />

                {/* gstin */}
                <TextField
                    label="Gstin no"
                    error={isInvalidGstin(arbitraryData.header.gstin)}
                    helperText={
                        isInvalidGstin(arbitraryData.header.gstin)
                            ? accountsMessages.invalidGstin
                            : undefined
                    }
                    onChange={(e: any) => {
                        arbitraryData.header.gstin = e.target.value
                        emit('JOURNAL-MAIN-CROWN-REFRESH', '')
                        setRefresh({})
                    }}
                    value={arbitraryData.header.gstin || ''}
                />
            </Paper>
        )
    }

    function ActionBlock({
        arbitraryData,
        actionType,
        actionLabel,
        isAddRemove,
    }: any) {
        const [, setRefresh] = useState({})
        const isGst = !!arbitraryData.header.isGst
        const classes = useStyles({ actionType, isGst })
        useEffect(() => {
            const subs1 = filterOn('ACTION-BLOCK-REFRESH').subscribe(() => {
                setRefresh({})
            })
            return () => {
                subs1.unsubscribe()
            }
        }, [])
        return (
            <div className={classes.contentAction}>
                <Typography
                    className="action-label"
                    variant="subtitle2"
                    component="div"
                    color="secondary">
                    {actionType}
                </Typography>
                <ActionRows
                    ad={arbitraryData}
                    actionType={actionType}
                    actionLabel={actionLabel}
                    isAddRemove={isAddRemove}
                />
            </div>
        )

        function ActionRows({ ad, actionType, actionLabel, isAddRemove }: any) {
            const [, setRefresh] = useState({})
            let ind = 0
            const isGst = !!ad.header.isGst
            const actionRows: any[] = ad[actionType]
            const list: any[] = actionRows.map((item: any) => {
                if (!item.gst) {
                    item.gst = {}
                }
                return (
                    <div key={incr()} className="action-row">
                        {/* Account */}
                        <div>
                            <Typography variant="caption">
                                {actionLabel} account
                            </Typography>
                            <LedgerSubledger
                                allAccounts={ad.accounts.all}
                                ledgerAccounts={getMappedAccounts(
                                    ad.accounts.journal
                                )}
                                onChange={() =>
                                    emit('JOURNAL-MAIN-CROWN-REFRESH', '')
                                }
                                rowData={item}
                            />
                        </div>

                        {/* Gst rate */}
                        {isGst && (
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
                                    // emit('JOURNAL-MAIN-CROWN-REFRESH', '')
                                    setRefresh({})
                                }}
                                error={item.gst.rate > 30 ? true : false}
                                onValueChange={(values: any) => {
                                    const { floatValue } = values
                                    item.gst.rate = floatValue || 0.0
                                    computeGst(item)
                                    emit('JOURNAL-MAIN-CROWN-REFRESH', '')
                                    setRefresh({})
                                }}
                                thousandSeparator={true}
                                value={item.gst.rate || 0.0}
                            />
                        )}

                        {/* HSN */}
                        {isGst && (
                            <NumberFormat
                                className="hsn"
                                allowNegative={false}
                                {...{ label: 'Hsn' }}
                                customInput={TextField}
                                onFocus={(e) => {
                                    e.target.select()
                                }}
                                onChange={(e: any) => {
                                    item.gst.hsn = e.target.value
                                    emit('JOURNAL-MAIN-CROWN-REFRESH', '')
                                    setRefresh({})
                                }}
                                value={item.gst.hsn || 0.0}
                            />
                        )}

                        {/* Amount */}
                        <NumberFormat
                            allowNegative={false}
                            {...{ label: `${actionLabel} amount` }}
                            // {...matProps}
                            className="right-aligned-numeric amount"
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
                                computeGst(item)
                                setRefresh({})
                                emit('JOURNAL-MAIN-CROWN-REFRESH', '')
                            }}
                            onBlur={() => {
                                computeGst(item)
                                setRefresh({})
                                // emit('JOURNAL-MAIN-CROWN-REFRESH', '')
                            }}
                            thousandSeparator={true}
                            value={item.amount || 0.0}
                        />

                        {isGst && (
                            <div className="gst-block">
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            onChange={(e: any) => {
                                                item.gst.isIgst = e.target.checked
                                                computeGst(item)
                                                setRefresh({})
                                            }}
                                            color="primary"
                                            value={!!item.gst.igst}
                                            checked={!!item.gst.igst}
                                        />
                                    }
                                    label="Igst"
                                    labelPlacement="start"
                                />
                                <Typography className="gst" variant="body2">
                                    Cgst:{' '}
                                    {toDecimalFormat(item.gst.cgst || 0.0)}
                                </Typography>
                                <Typography className="gst" variant="body2">
                                    Sgst:{' '}
                                    {toDecimalFormat(item.gst.sgst || 0.0)}
                                </Typography>
                                <Typography className="gst" variant="body2">
                                    Igst:{' '}
                                    {toDecimalFormat(item.gst.igst || 0.0)}
                                </Typography>
                            </div>
                        )}

                        {/* line ref no  */}
                        <TextField
                            className="line-ref"
                            label="Line ref"
                            onChange={(e: any) => {
                                item.lineRefNo = e.target.value
                                setRefresh({})
                            }}
                            value={item.lineRefNo || ''}
                        />
                        {/* remarks */}
                        <TextField
                            className="line-remarks"
                            label="Remarks"
                            onChange={(e: any) => {
                                item.remarks = e.target.value
                                setRefresh({})
                            }}
                            value={item.remarks || ''}
                        />
                        {/* Add remove */}
                        {isAddRemove ? (
                            <AddRemoveButtons
                                ad={ad}
                                arr={ad[actionType]}
                                item={item}
                                emitMessage="ACTION-BLOCK-REFRESH"
                            />
                        ) : (
                            <div style={{ width: '5rem' }}></div>
                        )}
                    </div>
                )
            })
            return (
                <Paper elevation={1} className="action-block">
                    {list}
                </Paper>
            )
            function incr() {
                return ind++
            }
        }

        function AddRemoveButtons({ ad, arr, item, emitMessage }: any) {
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
                emit('JOURNAL-MAIN-CROWN-REFRESH', '')
            }

            function remove() {
                if (arr.length === 1) {
                    alert(accountsMessages.cannotDeleteOnlyEntry)
                    return
                }
                if (item.id) {
                    ad.deletedDetailsIds.push(item.id) // when a row is being deleted
                }
                arr.splice(item.key, 1)
                reIndex()
                emit(emitMessage, '')
                emit('JOURNAL-MAIN-CROWN-REFRESH', '')
            }
        }

        function computeGst(item: any) {
            const gstRate = item.gst.rate || 0
            const gst =
                ((item.amount || 0) * (gstRate / 100)) / (1 + gstRate / 100)
            if (item.gst.isIgst) {
                item.gst.igst = gst
                item.gst.cgst = 0
                item.gst.sgst = 0
            } else {
                item.gst.igst = 0
                item.gst.cgst = gst / 2
                item.gst.sgst = item.gst.cgst
            }
        }
    }

    return {
        ActionBlock,
        Crown,
        Crown1,
        Header,
        meta,
        setRefresh,
    }
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
            '& .action-label': {
                marginTop: theme.spacing(2),
                textTransform: 'capitalize',
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
                marginLeft: ({ actionType }: any) =>
                    actionType === 'debits' ? 'auto' : 0,
            },
            '& .line-ref': {
                // marginLeft: ({isGst, actionType}: any)=> isGst ? 0: 'auto'
                marginLeft: ({ isGst, actionType }: any) =>
                    actionType === 'credits' ? 0 : isGst ? 0 : 'auto',
            },
            '& .line-remarks': {
                width: ({ isGst }) =>
                    isGst ? theme.spacing(20) : theme.spacing(50),
            },
            '& .action-block': {
                backgroundColor: '#F6F6F4',
                padding: theme.spacing(1),
            },
            '& .action-row': {
                display: 'flex',
                marginBottom: theme.spacing(1),
                justifyContent: 'space-between',
                columnGap: theme.spacing(4),
                flexWrap: 'wrap',
                rowGap: theme.spacing(2),
                alignItems: 'center',
                '& .amount': {
                    marginLeft: ({ actionType }: any) =>
                        actionType === 'credits' ? 'auto' : 0,
                },
            },
        },
    })
)

export { useStyles }

/*
Sample data for payment voucher is:
[
  {
    "tableName": "TranH",
    "data": [
      {
        "tranDate": "2021-08-17",
        "userRefNo": null,
        "remarks": null,
        "tags": null,
        "jData": "{}",
        "finYearId": 2020,
        "branchId": 1,
        "posId": "1",
        "autoRefNo": null,
        "details": [
          {
            "tableName": "TranD",
            "fkeyName": "tranHeaderId",
            "data": [
              {
                "accId": 118,
                "instrNo": "",
                "amount": 5000,
                "dc": "C"
              },
              {
                "accId": 129,
                "amount": "5000.00",
                "dc": "D",
                "details": [
                  {
                    "tableName": "ExtGstTranD",
                    "fkeyName": "tranDetailsId",
                    "data": {
                      "gstin": "07AADCB2230M1ZV",
                      "hsn": "45",
                      "cgst": 267.85714285714283,
                      "sgst": 267.85714285714283,
                      "igst": 0,
                      "rate": "12.00",
                      "isInput": true
                    }
                  }
                ]
              }
            ]
          }
        ],
        "tranTypeId": "2"
      }
    ]
  }
]

*/
