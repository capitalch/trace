import {
    useState,
    useEffect,
    useRef,
} from '../../../../imports/regular-imports'
import {
    Button,
    makeStyles,
    Theme,
    createStyles,
} from '../../../../imports/gui-imports'
import { useSharedElements } from '../common/shared-elements-hook'

function usePurchaseBody(arbitraryData: any, purchaseType: string) {
    const [, setRefresh] = useState({})
    const {
        emit,
        execGenericView,
        filterOn,
        genericUpdateMasterDetails,
        getCurrentComponent,
        getFromBag,
        isInvalidDate,
        isInvalidGstin,
    } = useSharedElements()
    const ad = arbitraryData

    useEffect(() => {
        const curr = meta.current
        curr.isMounted = true
        ad.ledgerFilterMethodName = 'debtorsCreditors'
        // setAccounts()
        setPurchaseErrorObject()
        handlePurchaseCashCredit('credit')
        setRefresh({})
        const subs1 = filterOn(
            'PURCHASE-BODY-HANDLE-PURCHASE-CASH-CREDIT'
        ).subscribe((d: any) => {
            handlePurchaseCashCredit(d.data)
        })
        const subs2 = filterOn('TRACE-SERVER-ACCOUNT-ADDED-OR-UPDATED').subscribe(()=>{
            // setAccounts()
            const cashOrCredit = (ad.purchaseCashCredit === 'credit') ? 'credit': 'cash'
            handlePurchaseCashCredit(cashOrCredit)
            setRefresh({})
        })
        return () => {
            curr.isMounted = false
            subs1.unsubscribe()
            subs2.unsubscribe()
        }
    }, [])

    const meta: any = useRef({
        errorsObject: {},
        amountQtyGstErrors: {},
        isMounted: false,
        showDialog: false,
        dialogConfig: {
            title: 'Invoice has following errors',
            content: () => {},
            actions: () => {},
        },
    })

    function checkIfValidInvoice() {
        const errorAllowed = 0.99
        const amountErrorAllowed = (arbitraryData.invoiceAmount * 0.5) / 100 // 0.5 % error in total amount is allowed
        meta.current.amountQtyGstErrors = {}
        const errorObject: any = meta.current.amountQtyGstErrors
        if (
            Math.abs(
                arbitraryData.invoiceAmount - arbitraryData.summary.amount
            ) >= Math.max(errorAllowed, amountErrorAllowed)
        ) {
            errorObject.amountErr = 'Error in invoice amount'
        }
        if (
            Math.abs(arbitraryData.cgst - arbitraryData.summary.cgst) >=
            errorAllowed
        ) {
            errorObject.cgstError = 'Cgst error'
        }

        if (
            Math.abs(arbitraryData.sgst - arbitraryData.summary.sgst) >=
            errorAllowed
        ) {
            errorObject.sgstError = 'Sgst error'
        }

        if (
            Math.abs(arbitraryData.igst - arbitraryData.summary.igst) >=
            errorAllowed
        ) {
            errorObject.igstError = 'Igst error'
        }
        if (
            Math.abs(arbitraryData.qty - arbitraryData.summary.qty) >=
            errorAllowed
        ) {
            errorObject.qtyError = 'Error in total qty'
        }
        if (arbitraryData.isGstInvoice && !arbitraryData.gstin) {
            errorObject.gstinError = 'Gstin no must be there'
        }
        if (!arbitraryData.isGstInvoice && arbitraryData.gstin) {
            errorObject.gstInvoiceError =
                'This is not a Gst invoice, but gstin no and gst values still exist'
        }

        const ret = !Object.values(errorObject).some((item: any) => !!item)
        return ret
    }

    function setPurchaseErrorObject() {
        const errorObject = ad.errorObject

        errorObject.isDateError = () => isInvalidDate(ad.tranDate) || false
        errorObject.isInvoiceError = () => {
            let ret = false
            if (purchaseType === 'pur') {
                ret = ad.userRefNo ? false : true
            }
            return ret
        }
        errorObject.isHeadError = () => {
            return errorObject.isDateError() || errorObject.isInvoiceError()
        }

        errorObject.isPurchaseAccountError = () => {
            return ad.ledgerSubledgerPurchase.isLedgerSubledgerError || false
        }
        errorObject.isOtherAccountError = () => {
            return ad.ledgerSubledgerOther.isLedgerSubledgerError || false
        }
        errorObject.isGstinError = () => {
            let ret = true
            if (ad.isGstInvoice) {
                if (ad.gstin) {
                    ret = isInvalidGstin(ad.gstin)
                }
            } else {
                ret = false
            }
            return ret
        }
        errorObject.isGstError = () => {
            let ret = true
            if (ad.isGstInvoice) {
                if ((ad.cgst > 0 && ad.sgst > 0) || ad.igst > 0) {
                    ret = false
                }
            } else {
                ret = false
            }
            return ret
        }
        errorObject.isInvoiceAmountError = () => {
            let ret = false
            if (ad.isGstInvoice) {
                ret = ad.invoiceAmount ? false : true
            }
            return ret
        }
        errorObject.isTotalQtyError = () => {
            let ret = true
            if (ad.qty) {
                ret = false
            }
            return ret
        }
        errorObject.isBodyError = () => {
            return (
                errorObject.isPurchaseAccountError() ||
                errorObject.isOtherAccountError() ||
                errorObject.isGstinError() ||
                errorObject.isGstError() ||
                errorObject.isInvoiceAmountError() ||
                errorObject.isTotalQtyError()
            )
        }

        errorObject.isProductCodeError = (curr: any) =>
            curr?.productCode ? false : true
        errorObject.isHsnError = (curr: any) => {
            let ret = false
            if (ad.isGstInvoice) {
                ret = curr.hsn ? false : true
            }
            return ret
        }
        errorObject.isQtyError = (curr: any) => (curr?.qty ? false : true)
        errorObject.isGstRateError = (curr: any) => {
            let ret = false
            if (ad.isGstInvoice) {
                ret = curr.gstRate ? false : true
            }
            return ret
        }
        errorObject.isDiscountError = (curr: any) =>
            curr.price >= curr.discount ? undefined : true
        errorObject.isSlNoError = (curr: any) => {
            function getCount() {
                return (
                    curr?.serialNumbers.split(',').filter(Boolean).length || 0
                )
            }
            const ok = getCount() === curr.qty || getCount() === 0
            return !ok
        }
        errorObject.isItemError = (curr: any) => {
            const a = errorObject.isProductCodeError(curr)
            const b = errorObject.isHsnError(curr)
            const c = errorObject.isGstRateError(curr)
            const d = errorObject.isDiscountError(curr)
            const e = errorObject.isQtyError(curr)
            const f = errorObject.isDiscountError(curr)
            const g = errorObject.isSlNoError(curr)
            return a || b || c || d || e || f || g
        }

        errorObject.isItemsError = () => {
            const a =
                ad.lineItems.reduce((prev: boolean, curr: any) => {
                    prev = prev || errorObject.isItemError(curr)
                    return prev
                }, false) ?? true
            return a
        }

        errorObject.isError = () => {
            const a = errorObject.isHeadError()
            const b = errorObject.isBodyError()
            const c = errorObject.isItemsError()
            return a || b || c
        }
    }

    function handleIsGstInvoice(e: any) {
        ad.isGstInvoice = e.target.checked
        for (let item of ad.lineItems) {
            item.isGstInvoice = ad.isGstInvoice
            item.isGstInvoice
                ? (item.gstRate = item.gstRateCopy || 0.0)
                : (item.gstRate = 0)
        }
        emit('PURCHASE-ITEMS-COMPUTE-ALL-ROWS', null)
        emit('PURCHASE-ITEMS-REFRESH', null)
        meta.current.isMounted && setRefresh({})
    }

    function handlePrint() {}

    function preHandlePurchaseCashCredit(purchaseCashCredit: string) {
        arbitraryData.ledgerSubledgerOther = {
            accId: undefined,
            isLedgerSubledgerError: true,
        }
        if(purchaseCashCredit === 'cash'){
            ad.ledgerFilterMethodName = 'cashBank'
            ad.purchaseCashCredit = 'cash'
        } else {
            ad.ledgerFilterMethodName = 'debtorsCreditors'
            ad.purchaseCashCredit = 'credit'
        }

        setRefresh({})
        // handlePurchaseCashCredit(purchaseCashCredit)
        // emit('LEDGER-SUBLEDGER-JUST-REFRESH', (purchaseCashCredit==='cash') ? 'cashBank' : 'debtorsCreditors')
        // meta.current.isMounted && setRefresh({})
    }

    function handlePurchaseCashCredit(purchaseCashCredit: string) {
        if (purchaseCashCredit === 'credit') {
            arbitraryData.accounts.ledgerAccounts =
                arbitraryData.accounts.debtorCreditorLedgerAccounts
            arbitraryData.purchaseCashCredit = 'credit'
        } else {
            arbitraryData.accounts.ledgerAccounts =
                arbitraryData.accounts.cashBankLedgerAccounts
            arbitraryData.purchaseCashCredit = 'cash'
        }
        meta.current.isMounted && setRefresh({})
    }

    function handleSubmit() {
        const isValidInvoice = checkIfValidInvoice()
        if (isValidInvoice) {
            submit()
        } else {
            meta.current.showDialog = true
            meta.current.dialogConfig.content = InvoiceError
            meta.current.dialogConfig.actions = () => (
                <Button
                    variant="contained"
                    size="small"
                    color="primary"
                    onClick={() => {
                        meta.current.showDialog = false
                        meta.current.isMounted && setRefresh({})
                    }}>
                    Ok
                </Button>
            )
            meta.current.isMounted && setRefresh({})
        }
    }

    function InvoiceError() {
        return (
            <ul>
                {Object.keys(meta.current.amountQtyGstErrors).map(
                    (x: any, index: number) => {
                        return (
                            <li key={index}>
                                {meta.current.amountQtyGstErrors[x]}
                            </li>
                        )
                    }
                )}
            </ul>
        )
    }

    async function queryGstin(id: number) {
        emit('SHOW-LOADING-INDICATOR', true)
        const result: any = await execGenericView({
            isMultipleRows: false,
            args: { id: id },
            sqlKey: 'get_gstin',
        })
        emit('SHOW-LOADING-INDICATOR', false)
        return result?.gstin
    }

    async function submit() {
        const header = extractHeader()
        const details = extractDetails()

        header.data[0].details = details

        const ret = await genericUpdateMasterDetails([header])
        if (ret.error) {
            console.log(ret.error)
        } else {
            if (ad.shouldCloseParentOnSave) {
                emit(
                    'ACCOUNTS-LEDGER-DIALOG-CLOSE-DRILL-DOWN-CHILD-DIALOG',
                    null
                )
            } else if (ad.isViewBack) {
                emit('LAUNCH-PAD:LOAD-COMPONENT', getCurrentComponent())
                emit('PURCHASES-HOOK-CHANGE-TAB', 1)
                emit('PURCHASE-VIEW-HOOK-FETCH-DATA', null)
            } else {
                emit('LAUNCH-PAD:LOAD-COMPONENT', getCurrentComponent())
            }
        }

        function extractHeader() {
            const finYearId = getFromBag('finYearObject')?.finYearId
            const branchId = getFromBag('branchObject')?.branchId || 1
            const obj: any = {
                tableName: 'TranH',
                data: [],
            }
            const item = {
                id: ad.id,
                tranDate: ad.tranDate,
                userRefNo: ad.userRefNo,
                remarks: ad.commonRemarks,
                tags: undefined,
                jData: '{}',
                finYearId: finYearId,
                branchId: branchId,
                posId: '1',
                autoRefNo: ad.autoRefNo,
                tranTypeId: purchaseType === 'pur' ? 5 : 10,
                details: [],
            }
            obj.data.push(item)
            return obj
        }

        function extractDetails() {
            const tranD: any = {
                tableName: 'TranD',
                fkeyName: 'tranHeaderId',
                data: [],
            }

            const purchRow: any = {
                id: ad.ledgerSubledgerPurchase.id,
                accId: ad.ledgerSubledgerPurchase.accId,
                dc: purchaseType === 'pur' ? 'D' : 'C',
                amount: ad.invoiceAmount,
                details: [],
            }

            const otherRow: any = {
                id: ad.ledgerSubledgerOther.id,
                accId: ad.ledgerSubledgerOther.accId,
                dc: purchaseType === 'pur' ? 'C' : 'D',
                amount: ad.invoiceAmount,
                details: [],
            }

            tranD.data.push(purchRow)
            tranD.data.push(otherRow)

            const gst = {
                tableName: 'ExtGstTranD',
                fkeyName: 'tranDetailsId',
                data: [
                    {
                        id: ad.extGstTranDId,
                        gstin: ad.gstin,
                        cgst: ad.cgst,
                        sgst: ad.sgst,
                        igst: ad.igst,
                        isInput: purchaseType === 'pur' ? true : false,
                    },
                ],
            }

            purchRow.details.push(gst)

            
            for (let item of ad.lineItems) {
                const obj: any = {
                    tableName: 'SalePurchaseDetails',
                    fkeyName: 'tranDetailsId',
                    deletedIds:
                        ad?.deletedSalePurchaseIds.length > 0
                            ? [...ad.deletedSalePurchaseIds]
                            : undefined,
                    data: [
                        {
                            id: item.id,
                            productId: item.productId,
                            qty: item.qty,
                            price: item.price,
                            priceGst: item.priceGst,
                            discount: item.discount,
                            gstRate: item.gstRate,
                            cgst: item.cgst,
                            sgst: item.sgst,
                            igst: item.igst,
                            amount: item.amount,
                            hsn: item.hsn,
                            jData: JSON.stringify({
                                serialNumbers: item.serialNumbers,
                                remarks: item.remarks,
                            }),
                        },
                    ],
                }
                purchRow.details.push(obj)
            }
            return tranD
        }
    }

    return {
        handleIsGstInvoice,
        handlePrint,
        preHandlePurchaseCashCredit,
        handleSubmit,
        meta,
        queryGstin,
    }
}

export { usePurchaseBody }

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
                '& .print-submit-button': {
                    marginLeft: 'auto',
                    '& .print-button':{
                        marginRight:theme.spacing(1),
                        '& .print-icon':{
                            color: theme.palette.indigo.dark,
                        }
                    }
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
                marginTop: theme.spacing(3),
                alignItems: 'center',
                display: 'flex',
                flexWrap: 'wrap',
                rowGap: theme.spacing(2),
                justifyContent: 'space-between',

                '& .left': {
                    display: 'flex',
                    flexWrap: 'wrap',
                    rowGap: theme.spacing(2),
                    columnGap: theme.spacing(4),
                    '& .ledger-subledger': {
                        marginTop: theme.spacing(0.2),
                    },
                },

                '& .right': {
                    display: 'flex',
                    rowGap: theme.spacing(2),
                    columnGap: theme.spacing(4),
                    backgroundColor: theme.palette.grey[100],
                    marginLeft: 'auto',
                    marginRight: 'auto',
                    '& .invoice': {
                        display: 'flex',
                        flexDirection: 'column',
                        rowGap: theme.spacing(1),
                        maxWidth: '9rem',
                        '& input': {
                            textAlign: 'end',
                        },
                    },
                    '& .gst': {
                        display: 'flex',
                        flexDirection: 'column',
                        rowGap: '0.25rem',
                        maxWidth: '8rem',
                        '& input': {
                            textAlign: 'end',
                        },
                    },
                },
            },
        },
    })
)

export { useStyles }
