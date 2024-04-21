import { useEffect, } from 'react'
import { Box, } from '../../../../imports/gui-imports'
import _ from 'lodash'
import { accountsMessages, execGenericView, useSharedElements, utilMethods } from '../inventory/redirect';
import { PurchaseStore } from '../../stores/purchase-store';
import { AggrOptions, ColumnOptions, GenericSyncfusionGrid, GridOptions } from './generic-syncfusion-grid'
import { signal } from '@preact/signals-react';
import { AppStore } from '../../stores/app-store';
import { Apps } from '@mui/icons-material';
import { PurchasePreview } from './purchase-preview';

function PurchaseView() {
    const { emit, confirm, genericUpdateMaster, }: any = useSharedElements()
    const { isControlDisabled } = utilMethods()
    const isDeleteDisabled = isControlDisabled('salespurchases-purchase-delete')
    const isEditDisabled = isControlDisabled('salespurchases-purchase-edit')

    useEffect(() => {
        if (PurchaseStore.tabValue.value === 1) {
            emit('GENERIC-SYNCFUSION-GRID-LOAD-DATA' + PurchaseStore.purchaseType, undefined)
        }
    }, [PurchaseStore.tabValue.value])

    useEffect(() => {
        PurchaseStore.main.functions.preparePurchaseStore = preparePurchaseStore
    }, [])

    return (<Box mt={2}>
        <GenericSyncfusionGrid gridOptions={getGridOptions()} />
    </Box>)

    function getGridOptions(): GridOptions {
        const gridOptions: GridOptions = {
            aggregates: getAggregates(),
            instance: PurchaseStore.purchaseType,
            sqlKey: 'get_purchase_headers',
            columns: getColumns(),
            sqlArgs: {
                tranTypeId: PurchaseStore.purchaseType === 'pur' ? 5 : 10,
                no: 100,
            },
            onDelete: onPurchaseDelete,
            onEdit: onPurchaseEdit,
            onPreview: onPurchasePreview,
            isDeleteDisabled: isDeleteDisabled,
            isEditDisabled: isEditDisabled
        }
        return (gridOptions)
    }

    function getAggregates() {
        const aggrs: AggrOptions[] = [
            { field: 'index', type: 'Count', format: 'N0', footerTemplate: (props: any) => <span><b>{props.Count}</b></span> }
            , { field: 'amount', type: 'Sum', }
            , { field: 'aggr', type: 'Sum', }
            , { field: 'cgst', type: 'Sum', }
            , { field: 'sgst', type: 'Sum', }
            , { field: 'igst', type: 'Sum', }
        ]
        return (aggrs)
    }

    function getColumns(): ColumnOptions[] {
        const columns: ColumnOptions[] = [
            { field: 'index', headerText: '#', width: 70 }
            , { field: 'tranDate', headerText: 'Date', type: 'date', width: 95, format: { type: 'date', format: 'dd/MM/yyyy', } }
            , { field: 'autoRefNo', headerText: 'Ref no', width: 170 }
            , { field: 'userRefNo', headerText: 'Invoice no', width: 200 }
            , { field: 'productDetails', headerText: 'Product details', width: 220 }
            , { field: 'accounts', headerText: 'Account', width: 160 }
            , { field: 'amount', headerText: 'Amount', textAlign: 'Right', type: 'number', width: 130, format: 'N2' }
            , { field: 'aggr', headerText: 'Aggr', textAlign: 'Right', width: 130, format: 'N2' } //numeric with 2 decimals
            , { field: 'cgst', headerText: 'Cgst', textAlign: 'Right', width: 110, format: 'N2' }
            , { field: 'sgst', headerText: 'Sgst', textAlign: 'Right', width: 110, format: 'N2' }
            , { field: 'igst', headerText: 'Igst', textAlign: 'Right', width: 110, format: 'N2' }
            , { field: 'serialNumbers', headerText: 'Serial No', width: 150 }
            , { field: 'productCodes', headerText: 'Product codes', width: 150 }
            , { field: 'hsns', headerText: 'Hsn codes', width: 150 }
            , { field: 'remarks', headerText: 'Remarks', width: 150 }
            , { field: 'lineRemarks', headerText: 'Line remarks', width: 150 }
        ]
        return (columns)
    }

    function onPurchaseDelete(id: number) {
        const options = {
            description: accountsMessages.transactionDelete,
            confirmationText: 'Yes',
            cancellationText: 'No',
        }
        confirm(options)
            .then(async () => {
                emit('SHOW-LOADING-INDICATOR', true)
                await genericUpdateMaster({
                    deletedIds: [id],
                    tableName: 'TranH',
                })
                emit('SHOW-LOADING-INDICATOR', false)
                emit('SHOW-MESSAGE', {})
                emit('GENERIC-SYNCFUSION-GRID-LOAD-DATA' + PurchaseStore.purchaseType, undefined)
            }).catch(() => { })
    }

    async function onPurchaseEdit(id: number) {
        if (!id) { return }
        emit('SHOW-LOADING-INDICATOR', true)
        const ret = await execGenericView({
            isMultipleRows: false,
            sqlKey: 'getJson_sale_purchase_on_id',
            args: { id: id }
        })
        emit('SHOW-LOADING-INDICATOR', false)
        if (!_.isEmpty(ret)) {
            PurchaseStore.tabValue.value = 0
            PurchaseStore.goToView = true // After submit operation, the view is loaded
            preparePurchaseStore(ret)
        }
    }

    async function onPurchasePreview(id: number) {
        if (!id) { return }
        emit('SHOW-LOADING-INDICATOR', true)
        const ret = await execGenericView({
            isMultipleRows: false,
            sqlKey: 'getJson_sale_purchase_on_id',
            args: { id: id }
        })
        if(_.isEmpty(ret?.jsonResult)) {
            alert('No data found')
            return
        }
        // console.log(JSON.stringify(ret?.jsonResult))
        AppStore.modalDialogA.isCentered = true
        AppStore.modalDialogA.title.value = 'Purchase Preview'
        AppStore.modalDialogA.body.value = () => <PurchasePreview invoiceData={ret.jsonResult}  />
        AppStore.modalDialogA.maxWidth.value = 'md'
        AppStore.modalDialogA.isOpen.value = true
        emit('SHOW-LOADING-INDICATOR', false)
    }

    function preparePurchaseStore(data: any, isEdit = true) {
        const res = data.jsonResult
        const { loadTranH, loadExtGstTranD, loadSalePurchaseDetails, loadTranD } = populateFunctions(isEdit)
        loadTranH(res)
        loadExtGstTranD(res)
        loadSalePurchaseDetails(res)
        loadTranD(res)
        PurchaseStore.main.functions.computeSummary()
    }

    function populateFunctions(isEdit: boolean) {
        const header = PurchaseStore.main.header
        const subheader = PurchaseStore.main.subheader
        const lineItemsHeader = PurchaseStore.main.lineItemsHeader

        function loadTranH(res: any) {
            const tranH = res.tranH
            header.id = isEdit ? tranH.id : undefined
            header.refNo.value = tranH.autoRefNo
            header.tranDate.value = tranH.tranDate
            header.invoiceNo.value = tranH.userRefNo
            header.commonRemarks.value = tranH.remarks
        }

        function loadExtGstTranD(res: any) {
            const extGstTranD = res?.extGstTranD
            subheader.extGstTranDId = isEdit ? extGstTranD.id : undefined
            subheader.gstinNumber.value = extGstTranD?.gstin
            subheader.cgst.value = extGstTranD?.cgst
            subheader.sgst.value = extGstTranD?.sgst
            subheader.igst.value = extGstTranD?.igst
            const cgst = subheader?.cgst?.value || null
            const sgst = subheader?.sgst?.value || null
            const igst = subheader?.igst?.value || null
            if (cgst || sgst || igst) {
                header.isGstInvoice.value = true
            } else {
                header.isGstInvoice.value = false
            }
            if (igst) {
                lineItemsHeader.isIgst.value = true
            } else {
                lineItemsHeader.isIgst.value = false
            }
        }

        function loadSalePurchaseDetails(res: any) {
            const salePurchaseDetails = res.salePurchaseDetails || [] //array
            if (salePurchaseDetails?.length === 0) {
                return
            }

            PurchaseStore.main.lineItems.value = salePurchaseDetails.map((item: any) => ({
                id: isEdit ? item.id : undefined,
                remarks: signal(item.remarks || ''),
                upcCode: signal(item.upcCode),
                productCodeOrUpc: signal(''),
                productCode: signal(item.productCode),
                productId: signal(item.productId),
                productDetails: signal(item.label
                    ? `${item.catName || ''}, ${item.brandName || ''}, ${item.label || ''
                    }, ${item.info || ''}`
                    : ''),
                hsn: signal(item.hsn),
                gstRate: signal(item.gstRate),
                qty: signal(item.qty),
                price: signal(item.price),
                priceGst: signal(item.priceGst),
                discount: signal(item.discount),
                subTotal: signal(item.subTotal || 0),
                amount: signal(item.amount || 0),
                cgst: signal(item.cgst),
                sgst: signal(item.sgst),
                igst: signal(item.igst),
                serialNumbers: signal(item?.serialNumbers || ''),
            }))

            const totalQty = salePurchaseDetails.reduce((acc: number, curr: any) => {
                return (acc + curr.qty)
            }, 0)
            subheader.totalQty.value = totalQty
        }

        function loadTranD(res: any) {
            const tranD = res.tranD
            if (tranD.length !== 2) {
                emit('SHOW-MESSAGE', {
                    severity: 'error',
                    message: accountsMessages.purchaseError,
                    duration: null,
                })
                return
            }

            for (let row of tranD) {
                if (PurchaseStore.purchaseType === 'pur') {
                    if (row.dc === 'D') {
                        subheader.ledgerSubledgerPurchase.accId = row.accId
                        subheader.ledgerSubledgerPurchase.id = isEdit ? row.id : undefined
                        subheader.purchaseAccId.value = row.accId
                        subheader.invoiceAmount.value = row.amount
                    } else {
                        subheader.otherAccId.value = row.accId
                        subheader.ledgerSubledgerOther.accId = row.accId
                        subheader.ledgerSubledgerOther.id = isEdit ? row.id : undefined
                    }
                } else {
                    if (row.dc === 'C') {
                        subheader.ledgerSubledgerPurchase.accId = row.accId
                        subheader.ledgerSubledgerPurchase.id = isEdit ? row.id : undefined
                        subheader.purchaseAccId.value = row.accId
                        subheader.invoiceAmount.value = row.amount
                    } else {
                        subheader.otherAccId.value = row.accId
                        subheader.ledgerSubledgerOther.accId = row.accId
                        subheader.ledgerSubledgerOther.id = isEdit ? row.id : undefined
                    }
                }
                PurchaseStore.main.functions.refreshSubheader()
            }
        }

        return ({ loadTranH, loadExtGstTranD, loadSalePurchaseDetails, loadTranD })
    }
}
export { PurchaseView }

const sampleInvoiceData = {"tranH":{"id":10826,"tranDate":"2024-04-18","userRefNo":"BB/www/222/2024025","remarks":null,"autoRefNo":"H/PUR/1/2024","jData":{},"tranTypeId":5},"billTo":null,"businessContacts":{"id":7,"contactName":"ABM Sales Pvt Ltd","contactCode":"ABMSales","mobileNumber":"8882344432","otherMobileNumber":null,"landPhone":null,"email":"aaa@nn.com","otherEmail":null,"jAddress":[{"pin":"700067","city":"Kolkata","state":"WB","country":"India","address1":"12 eleventh Tower","address2":"Elgin Road"}],"descr":null,"accId":154,"jData":null,"gstin":"37AADCB2230M2ZS","timestamp":"2021-03-25T09:58:01.098404+00:00","stateCode":19},"tranD":[{"id":21441,"accId":168,"dc":"D","amount":3871,"instrNo":null,"remarks":null,"accClass":"purchase"},{"id":21442,"accId":154,"dc":"C","amount":3871,"instrNo":null,"remarks":null,"accClass":"creditor"}],"extGstTranD":{"id":10327,"gstin":"37AADCB2230M2ZS","cgst":295.32,"sgst":295.32,"igst":0},"salePurchaseDetails":[{"id":10745,"productId":184,"qty":1,"price":3281.33,"priceGst":3871.97,"discount":0,"cgst":295.32,"sgst":295.32,"igst":0,"amount":3871.97,"hsn":8509,"gstRate":18,"productCode":"1170","upcCode":null,"catName":"Iron","brandName":"Bajaj","info":null,"label":"CLASSIC 750W(410174)","serialNumbers":"","remarks":""}]}