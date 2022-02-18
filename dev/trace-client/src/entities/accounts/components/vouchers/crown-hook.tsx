import { _, useState } from '../../../../imports/regular-imports'
import { Button, Typography } from '../../../../imports/gui-imports'
import { Error, Check } from '../../../../imports/icons-import'
import { useSharedElements } from '../common/shared-elements-hook'
function useCrown(meta: any, componentRef: any) {
    const [, setRefresh] = useState({})
    meta.current.dialogConfig = {}
    meta.current.dialogConfig.title = 'Voucher'
    const {
        accountsMessages,
        emit,
        genericUpdateMasterDetails,
        getFromBag,
        isInvalidDate,
        isInvalidGstin,
        toDecimalFormat,
    } = useSharedElements()

    // const ctx: any = useContext(MultiDataContext)

    function checkError(ad: any) {
        function headerError() {
            function dateError() {
                let m = ''
                if (isInvalidDate(ad?.header?.tranDate)) {
                    m = accountsMessages.dateRangeAuditLockMessage
                }
                return m
            }

            function gstinError() {
                let m = ''
                const isGst = ad.header.isGst

                if (isGst) {
                    if (!ad.header.gstin) {
                        m = accountsMessages.gstinRequired
                    } else {
                        if (isInvalidGstin(ad.header.gstin)) {
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

                    if (ad.header.isGst) {
                        if (row.gst?.rate && row.gst?.rate > 30) {
                            m = accountsMessages.invalidGstRate
                        }
                    } else {
                        if (row.gst?.rate) {
                            m = accountsMessages.gstRateWronglyGiven
                        }
                    }
                    return m
                }

                function hsnNotPresentError() {
                    let m = ''
                    if (row.gst?.rate && row.gst?.rate > 0) {
                        if (!row.gst?.hsn) {
                            m = accountsMessages.hsnNotPresent
                        }
                    }
                    return m
                }

                function onlyExpIncomePurchaseSaleCanHaveGst() {
                    let m = ''
                    const accId = row.accId
                    if (accId) {
                        const accountClass = getAccountClass(row?.accId)
                        if (
                            ![
                                'dexp',
                                'iexp',
                                'dincome',
                                'iincome',
                                'purchase',
                                'sale',
                            ].includes(accountClass) &&
                            ad.header?.isGst &&
                            row?.gst?.rate
                        ) {
                            m = accountsMessages.expIncomeCanHaveGst
                        }
                    }
                    return m
                }

                function bankShouldHaveInstrNo() {
                    let m = ''
                    const accId = row.accId
                    if (accId) {
                        const accountClass = getAccountClass(row?.accId)
                        if (
                            ['ecash', 'bank', 'card'].includes(accountClass) &&
                            !row.instrNo
                        ) {
                            m = accountsMessages.instrNoRequired
                        }
                    }
                    return m
                }

                function getAccountClass(accId: number) {
                    const account = ad.accounts.all.find(
                        (x: any) => x.id === accId
                    )
                    return account.accClass
                }

                m =
                    accountError() ||
                    amountError() ||
                    gstRateError() ||
                    hsnNotPresentError() ||
                    onlyExpIncomePurchaseSaleCanHaveGst() ||
                    bankShouldHaveInstrNo()
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
                const ret = credits.findIndex((x: any) => row.accId === x.accId)
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
        return meta.current.errorMessage
    }

    function computeSummary(ad: any) {
        ad && (ad.summary = {})
        const debitsSummary = getSummary('debits')
        const creditsSummary = getSummary('credits')

        function getSummary(summType: string) {
            return ad[summType].reduce(
                (prev: any, curr: any) => {
                    prev.amount = (prev?.amount || 0.0) + (curr?.amount || 0.0)
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
                    gst: {},
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
                    emit('VOUCHER-RESET', '')
                }}>
                Reset
            </Button>
        )
    }

    function handleClose() {
        meta.current.showDialog = false
        setRefresh({})
    }

    function handleOpen() {
        meta.current.showDialog = true
        setRefresh({})
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
                        <Error color="error" />
                    ) : (
                        <Check style={{ color: 'white' }} />
                    )
                }
                disabled={!!meta.current.errorMessage}>
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
                // Message is sent to all connected clients from server as ibuki message, for online update purpose
                const voucher: any = {
                    tableName: 'TranH',
                    // message: 'SERVER-LOOPBACK-MASTER-DETAILS-ACCOUNTS-UPDATED',
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
                dataItem.tranTypeId = ad.header.tranTypeId || 1
                dataItem.id = ad.header.id || undefined
                voucher.data.push(dataItem)

                const details = dataItem.details
                const debits: any[] = ad.debits
                const credits: any[] = ad.credits

                addToDetails(debits, details, 'D')
                addToDetails(credits, details, 'C')
                const ret = await genericUpdateMasterDetails([voucher])
                if (ret.error) {
                    console.log(ret.error)
                } else {
                    if (ad.shouldGoBackToView) {
                        emit('VOUCHER-CHANGE-TAB', 1)
                        ad.shouldGoBackToView = false
                    }
                    emit('VOUCHER-RESET', '')
                    if (ad.shouldCloseParentOnSave) {
                        emit(
                            'ACCOUNTS-LEDGER-DIALOG-CLOSE-DRILL-DOWN-CHILD-DIALOG',
                            ''
                        )
                    }
                }

                function addToDetails(
                    sourceArray: any[],
                    destArray: any,
                    dc: string
                ) {
                    for (let item of sourceArray) {
                        const temp: any = {
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
                        if (
                            ad.deletedDetailsIds &&
                            ad.deletedDetailsIds.length > 0
                        ) {
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
                        if (ad.header.isGst || item.gst.id) {
                            // id is present when in edit mode. This allows to make GST 0.00 in edit mode
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
                    Debits: {toDecimalFormat(totalDebits || 0.0)}
                </Typography>
                &nbsp;&nbsp;
                <Typography variant="subtitle2" component="span">
                    Credits: {toDecimalFormat(totalCredits || 0.0)}
                </Typography>
                &nbsp;&nbsp;
                {!!Math.abs(getDiff()) && (
                    <Typography
                        variant="subtitle2"
                        component="span"
                        color="error">
                        Diff: {toDecimalFormat(Math.abs(getDiff()))} {what()}
                    </Typography>
                )}
            </div>
        )

        function getDiff() {
            return (totalDebits || 0.0) - (totalCredits || 0.0)
        }

        function what() {
            let wh = ''
            const diff = getDiff()
            if (diff > 0) {
                wh = 'Dr'
            } else if (diff < 0) {
                wh = 'Cr'
            }
            return wh
        }
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
        handleClose,
        handleOpen,
        ResetButton,
        SubmitButton,
        setRefresh,
        SummaryDebitsCredits,
        SummaryGst,
    }
}

export { useCrown }
