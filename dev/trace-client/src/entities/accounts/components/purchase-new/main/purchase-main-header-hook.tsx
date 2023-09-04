import { useSharedElements } from "../../common/shared-elements-hook"
import { genericUpdateMasterDetails, getFromBag, useIbuki } from "../../inventory/redirect"
import { PurchaseLineItemType, PurchaseStore, resetPurchaseStore } from "../../../stores/purchase-store"
import { _, useCallback, useEffect } from '../../../../../imports/regular-imports'
import Swal from "sweetalert2"
import { AppStore } from "../../../stores/app-store"
import { PurchaseMainInvoices } from "./purchase-main-invoices"

function usePurchaseMainHeader() {
    const { emit } = useIbuki()
    const { getCurrentComponent } = useSharedElements()
    const { isInvalidDate, accountsMessages } = useSharedElements()
    const header = PurchaseStore.main.header
    const subheader = PurchaseStore.main.subheader
    const main = PurchaseStore.main

    const isGstinExistsCB = useCallback(isGstinExists, [])
    const setErrorsObjectCB = useCallback(setErrorsObject, [])

    useEffect(() => {
        header.isGstInvoice.value = isGstinExistsCB()
        setErrorsObjectCB()
        PurchaseStore.main.functions.isFormError = isFormError
    }, [isGstinExistsCB, header.isGstInvoice, setErrorsObjectCB])

    function handleInvoiceSearch() {
        AppStore.modalDialogA.title.value = 'Select an invoice by clicking a row'
        AppStore.modalDialogA.body.value = () => <PurchaseMainInvoices />
        AppStore.modalDialogA.isOpen.value = true
        AppStore.modalDialogA.maxWidth.value='lg'
        // const x = AppStore.modalDialogA.itemData.value
        // AppStore.modalDialogA.itemData.value =item
    }

    function handleOnChangeGstInvoiceCheckbox(e: any) {
        header.isGstInvoice.value = !header.isGstInvoice.value
        PurchaseStore.main.functions.clearSubheaderTotals()
        if (!e.target.checked) {
            subheader.gstinNumber.value = ''
            PurchaseStore.main.lineItems.value.forEach((item: PurchaseLineItemType) => {
                item.hsn.value = 0
                item.gstRate.value = 0
                PurchaseStore.main.functions.computeRow(item)
            })
            PurchaseStore.main.functions.computeSummary()
        }
    }

    function handleOnReset() {
        resetPurchaseStore()
        emit('LAUNCH-PAD:LOAD-COMPONENT', getCurrentComponent())
    }

    async function handleSubmit() {
        if (isFormError()) {
            Swal.fire({
                icon: 'error',
                title: 'Validation error',
                text: 'Something is wrong'
            })
            return
        }
        const purchaseHeader = getSubmitElements().extractHeader()
        const purchaseDetails = getSubmitElements().extractDetails()
        purchaseHeader.data[0].details = purchaseDetails
        const ret = await genericUpdateMasterDetails([purchaseHeader])
        if (ret.error) {
            console.log(ret.error)
        } else {
            // Reset purchase data and go back to purchase view
            const goToView = PurchaseStore.goToView
            resetPurchaseStore()
            if (goToView) {
                PurchaseStore.tabValue.value = 1
            }
            emit('LAUNCH-PAD:LOAD-COMPONENT', getCurrentComponent())
            // if (ad.shouldCloseParentOnSave) {
            //     emit(
            //         'ACCOUNTS-LEDGER-DIALOG-CLOSE-DRILL-DOWN-CHILD-DIALOG',
            //         null
            //     )
            // } else if (ad.isViewBack) {
            //     emit('LAUNCH-PAD:LOAD-COMPONENT', getCurrentComponent())
            //     emit('PURCHASES-HOOK-CHANGE-TAB', 1)
            //     emit('PURCHASE-VIEW-HOOK-FETCH-DATA', null)
            // } else {
            //     emit('LAUNCH-PAD:LOAD-COMPONENT', getCurrentComponent())
            // }
        }
        // const data = {
        //     refNo: header.refNo.value,
        //     tranDate: header.tranDate.value,
        //     userRefNo: header.invoiceNo.value,
        //     commonRemarks: header.commonRemarks.value,
        //     isGstInvoice: header.isGstInvoice.value,
        //     purchase: subheader.ledgerSubledgerPurchase
        // }
    }

    function isGstinExists() {
        let ret = false
        const info = getFromBag('unitInfo')
        if (info?.gstin) {
            ret = true
        }
        return (ret)
    }

    function setErrorsObject() {
        const errorsObject = PurchaseStore.errorsObject
        errorsObject.tranDateError = () => isInvalidDate(header.tranDate.value) ? accountsMessages.dateRangeAuditLockMessage : ''
        errorsObject.invoiceNoError = () => {
            let error = ''
            if (PurchaseStore.purchaseType === 'pur') {
                if (!header.invoiceNo.value) {
                    error = 'Required'
                }
            }
            return (error)
        }
    }

    function isFormError(): boolean {
        let ret = true
        const errorsObject = PurchaseStore.errorsObject
        const err = errorsObject.tranDateError()
            || errorsObject.invoiceNoError()
            || errorsObject.purchaseAcError()
            || errorsObject.otherAcError()
            || errorsObject.gstinError()
            || errorsObject.invoiceAmountError()
            || errorsObject.totalQtyError()
            || errorsObject.totalCgstError()
            || errorsObject.totalSgstError()
            || errorsObject.totalIgstError()
            || errorsObject.cgstSgstIgstError()
            || errorsObject.igstError()
        const lineItemsError = PurchaseStore.main.lineItems.value.reduce((acc: any, lineItem: PurchaseLineItemType) => {
            const itemError = errorsObject.productCodeError(lineItem)
                || errorsObject.productDetailsError(lineItem)
                || errorsObject.hsnError(lineItem)
                || errorsObject.gstRateError(lineItem)
                || errorsObject.qtyError(lineItem)
                || errorsObject.slNoError(lineItem)
            return (acc || itemError)
        }, false)
        ret = Boolean(err || lineItemsError)
        return (ret)
    }

    function getSubmitElements() {
        function extractHeader() {
            const finYearId = getFromBag('finYearObject')?.finYearId
            const branchId = getFromBag('branchObject')?.branchId || 1
            const obj: any = {
                tableName: 'TranH',
                data: [],
            }
            const item = {
                id: header.id || undefined,
                tranDate: header.tranDate.value,
                userRefNo: header.invoiceNo.value,
                remarks: header.commonRemarks.value,
                tags: undefined,
                jData: '{}',
                finYearId: finYearId,
                branchId: branchId,
                posId: '1',
                autoRefNo: header.refNo.value,
                tranTypeId: PurchaseStore.purchaseType === 'pur' ? 5 : 10,
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
                // id: ad.ledgerSubledgerPurchase.id,
                id: subheader.ledgerSubledgerPurchase.id || undefined,
                accId: subheader.purchaseAccId.value, //ledgerSubledgerPurchase.accId,
                dc: PurchaseStore.purchaseType === 'pur' ? 'D' : 'C',
                amount: subheader.invoiceAmount.value,
                details: [],
            }

            const otherRow: any = {
                // id: ad.ledgerSubledgerOther.id,
                id: subheader.ledgerSubledgerOther.id || undefined,
                accId: subheader.otherAccId.value, //ad.ledgerSubledgerOther.accId,
                dc: PurchaseStore.purchaseType === 'pur' ? 'C' : 'D',
                amount: subheader.invoiceAmount.value,
                details: [],
            }


            tranD.data.push(purchRow)
            tranD.data.push(otherRow)

            const gst = {
                tableName: 'ExtGstTranD',
                fkeyName: 'tranDetailsId',
                data: [
                    {
                        // id: ad.extGstTranDId,
                        id: subheader.extGstTranDId,
                        gstin: subheader.gstinNumber.value,
                        cgst: subheader.cgst.value, //  ad.cgst,
                        sgst: subheader.sgst.value, //ad.sgst,
                        igst: subheader.igst.value, //ad.igst,
                        isInput: PurchaseStore.purchaseType === 'pur' ? true : false,
                    },
                ],
            }

            purchRow.details.push(gst)

            for (let item of main.lineItems.value) {
                const obj: any = {
                    tableName: 'SalePurchaseDetails',
                    fkeyName: 'tranDetailsId',
                    deletedIds: _.isEmpty(PurchaseStore.main.deletedSalePurchaseIds) ? undefined : PurchaseStore.main.deletedSalePurchaseIds,
                    // deletedIds:
                    //     ad?.deletedSalePurchaseIds.length > 0
                    //         ? [...ad.deletedSalePurchaseIds]
                    //         : undefined,
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

        return ({ extractHeader, extractDetails })
    }

    return ({ handleInvoiceSearch, handleOnChangeGstInvoiceCheckbox, handleOnReset, handleSubmit, isFormError })
}
export { usePurchaseMainHeader }