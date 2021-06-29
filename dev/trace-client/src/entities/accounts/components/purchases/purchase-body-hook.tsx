import { useState, useEffect, useRef } from 'react'
import { makeStyles, Theme, createStyles } from '@material-ui/core'
import { useSharedElements } from '../common/shared-elements-hook'

function usePurchaseBody(arbitraryData: any, purchaseType: string) {
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
        const subs1 = filterOn(
            'PURCHASE-BODY-HANDLE-PURCHASE-CASH-CREDIT'
        ).subscribe((d: any) => {
            handlePurchaseCashCredit(d.data)
        })
        return () => {
            meta.current.isMounted = false
            subs1.unsubscribe()
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
        test: '',
    })

    useEffect(() => {
        // Debtor / creditor
        const pipe1: any = hotFilterOn('DATACACHE-SUCCESSFULLY-LOADED').pipe(
            map((d: any) =>
                d.data.allAccounts.filter((el: any) => {
                    const accClasses = ['debtor', 'creditor']
                    let condition =
                        accClasses.includes(el.accClass) &&
                        (el.accLeaf === 'Y' || el.accLeaf === 'L') &&
                        !el.isAutoSubledger
                    return condition
                })
            )
        )

        // Purchase
        const pipe2: any = hotFilterOn('DATACACHE-SUCCESSFULLY-LOADED').pipe(
            map((d: any) =>
                d.data.allAccounts.filter(
                    (el: any) =>
                        ['purchase'].includes(el.accClass) &&
                        (el.accLeaf === 'Y' || el.accLeaf === 'L')
                )
            )
        )

        // cash / bank / ecash /card
        const pipe3: any = hotFilterOn('DATACACHE-SUCCESSFULLY-LOADED').pipe(
            map((d: any) =>
                d.data.allAccounts.filter(
                    (el: any) =>
                        ['cash', 'bank', 'ecash', 'card'].includes(
                            el.accClass
                        ) &&
                        (el.accLeaf === 'Y' || el.accLeaf === 'L')
                )
            )
        )

        const subs1 = pipe1.subscribe((d: any) => {
            meta.current.debtorCreditorLedgerAccounts = d.map((el: any) => {
                return {
                    label: el.accName,
                    value: el.id,
                    accLeaf: el.accLeaf,
                }
            })
        })

        const subs2 = pipe2.subscribe((d: any) => {
            meta.current.purchaseLedgerAccounts = d.map((el: any) => {
                return {
                    label: el.accName,
                    value: el.id,
                    accLeaf: el.accLeaf,
                }
            })
        })

        const subs3 = pipe3.subscribe((d: any) => {
            meta.current.cashBankLedgerAccounts = d.map((el: any) => {
                return {
                    label: el.accName,
                    value: el.id,
                    accLeaf: el.accLeaf,
                }
            })
        })

        const subs4: any = hotFilterOn(
            'DATACACHE-SUCCESSFULLY-LOADED'
        ).subscribe((d: any) => {
            meta.current.allAccounts = d.data.allAccounts
            registerAccounts(meta.current.allAccounts)
        })
        // subs1.add(subs2).add(subs3).add(subs4)
        setRefresh({})
        return () => {
            subs1.unsubscribe()
            subs2.unsubscribe()
            subs3.unsubscribe()
            subs4.unsubscribe()
        }
    }, [])

    useEffect(() => {
        meta.current.ledgerAccounts = meta.current.debtorCreditorLedgerAccounts
    }, [])
    const ad = arbitraryData

    function allErrorMethods() {
        const err = meta.current.errorsObject
        const ab = arbitraryData

        function getDateError() {
            err.dateError = isInvalidDate(ab.tranDate) || undefined
            return err.dateError
        }
        function getInvoiceError() {
            // logic for invoice no for purchase or purchase ret
            if (purchaseType === 'pur') {
                err.invoiceNoError = ab.userRefNo ? undefined : true
            } else {
                err.invoiceNoError = undefined
            }

            return err.invoiceNoError
        }
        function getPurchaseAccountError() {
            err.purchaseAccountError =
                ab.ledgerSubledgerPurchase.isLedgerSubledgerError || undefined
            return err.purchaseAccountError
        }
        function getOtherAccountError() {
            err.otherAccountError =
                ab.ledgerSubledgerOther.isLedgerSubledgerError || undefined
            return err.otherAccountError
        }
        function getGstError() {
            if (arbitraryData.isGstInvoice) {
                if ((ab.cgst > 0 && ab.sgst > 0) || ab.igst > 0) {
                    err.gstError = undefined
                } else {
                    err.gstError = true
                }
            } else {
                err.gstError = undefined
            }
            return err.gstError
        }
        function getGstinError() {
            if (arbitraryData.isGstInvoice) {
                if (ab.gstin) {
                    err.gstinError = isInvalidGstin(ab.gstin)
                } else {
                    err.gstinError = true
                }
            } else {
                err.gstinError = undefined
            }
            return err.gstinError
        }

        function getInvoiceAmountError() {
            if (arbitraryData.isGstInvoice) {
                err.invoiceAmountError = ab.invoiceAmount ? undefined : true
            } else {
                err.invoiceAmountError = undefined
            }
            return err.invoiceAmountError
        }
        function getLineItemsError() {
            const lineItemsErrors = arbitraryData.lineItems.map((item: any) => {
                return Object.values(item.errorsObject).some((x: any) => !!x)
            })
            const ret = lineItemsErrors.some((x: any) => !!x) || undefined
            err.lineItemsError = ret
            return ret
        }
        function getQtyError() {
            if (arbitraryData.qty) {
                err.qtyError = undefined
            } else {
                err.qtyError = true
            }
            return err.qtyError
        }

        return {
            getDateError,
            getGstError,
            getGstinError,
            getInvoiceAmountError,
            getInvoiceError,
            getLineItemsError,
            getOtherAccountError,
            getPurchaseAccountError,
            getQtyError,
        }
    }

    function checkIfValidInvoice() {
        const errorAllowed = 0.99
        meta.current.amountQtyGstErrors = {}
        const errorObject: any = meta.current.amountQtyGstErrors
        if (
            Math.abs(
                arbitraryData.invoiceAmount - arbitraryData.summary.amount
            ) >= errorAllowed
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

    function getError(): boolean {
        let ret: boolean = true
        const errors = Object.values(allErrorMethods())
        for (let f of errors) {
            f()
        }
        ret = Object.values(meta.current.errorsObject).some((x: any) => x)
        return ret
    }

    function handleClear() {
        emit('PURCHASE-CLEAR-ALL', null)
    }

    function handleIsGstInvoice(e: any) {
        ad.isGstInvoice = e.target.checked
        for(let item of ad.lineItems){
            item.isGstInvoice = ad.isGstInvoice            
            item.isGstInvoice ? item.gstRate = item.gstRateCopy || 0.0: item.gstRate = 0
        }
        emit('PURCHASE-ITEMS-COMPUTE-ALL-ROWS', null)
        emit('PURCHASE-ITEMS-REFRESH', null)
        meta.current.isMounted && setRefresh({})
    }

    function handlePurchaseCashCredit(purchaseCashCredit: string) {
        arbitraryData.ledgerSubledgerOther = {
            accId: undefined,
            isLedgerSubledgerError: true,
        }
        if (purchaseCashCredit === 'credit') {
            meta.current.ledgerAccounts =
                meta.current.debtorCreditorLedgerAccounts
            arbitraryData.purchaseCashCredit = 'credit'
        } else {
            meta.current.ledgerAccounts = meta.current.cashBankLedgerAccounts
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

    function submit() {
        const header = extractHeader()
        const details = extractDetails()

        header.data[0].details = details
        saveForm({ data: header })

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
        allErrorMethods,
        getError,
        handleClear,
        handleIsGstInvoice,
        handlePurchaseCashCredit,
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

export { useStyles }
