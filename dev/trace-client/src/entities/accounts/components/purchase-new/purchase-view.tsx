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

const sampleInvoiceData = {"tranH":{"id":24459,"tranDate":"2024-04-15","userRefNo":"TI-KL2425-600099","remarks":null,"autoRefNo":"HD/PUR/36/2024","jData":{},"tranTypeId":5},"billTo":null,"businessContacts":{"id":20,"contactName":"InterFotoIndiaPvtLtd","contactCode":"InterFoto","mobileNumber":null,"otherMobileNumber":null,"landPhone":"03322651101","email":"kolkata@interfotoindia.com","otherEmail":null,"jAddress":[{"pin":"700017","city":"KOLKATA","state":"WEST BENGAL","country":"INDIA","address1":"Shantiniketan Building","address2":"8, Camac Street"}],"descr":null,"accId":367,"jData":null,"gstin":"19AAACI8655C1ZI","timestamp":"2022-04-07T11:17:47.463316+00:00","stateCode":19},"tranD":[{"id":49660,"accId":421,"dc":"D","amount":551089,"instrNo":null,"remarks":null,"accClass":"purchase"},{"id":49661,"accId":367,"dc":"C","amount":551089,"instrNo":null,"remarks":null,"accClass":"creditor"}],"extGstTranD":{"id":17197,"gstin":"19AAACI8655C1ZI","cgst":42032.21,"sgst":42032.21,"igst":0},"salePurchaseDetails":[{"id":20449,"productId":856,"qty":1,"price":59106.36,"priceGst":69745.5,"discount":0,"cgst":5319.57,"sgst":5319.57,"igst":0,"amount":69745.5,"hsn":85258900,"gstRate":18,"productCode":"1777","upcCode":null,"catName":"Digital camera","brandName":"Nikon","info":"Mind-blowing 3000mm zoom. 4K Ultra HD video. RAW (NRW), macro, time-lapse and so much more.","label":"COOLPIX P1000","serialNumbers":"11022092","remarks":null},{"id":20450,"productId":407,"qty":3,"price":73938.19,"priceGst":87247.06,"discount":0,"cgst":19963.31,"sgst":19963.31,"igst":0,"amount":261741.19,"hsn":85258900,"gstRate":18,"productCode":"1336","upcCode":null,"catName":"Digital camera","brandName":"Nikon","info":"Z50 with Z DX 16-50mm f/3.5-6.3 VR & Z DX 50-250mm f/4.5-6.3 VR) and Includes 64GB (class 10) SD card ","label":"Z50 KIT with 16-50mm+50-250 mm","serialNumbers":"7656646,7656711,7656984","remarks":null},{"id":20451,"productId":747,"qty":1,"price":70205.21,"priceGst":82842.15,"discount":0,"cgst":6318.47,"sgst":6318.47,"igst":0,"amount":82842.15,"hsn":85258900,"gstRate":18,"productCode":"1669","upcCode":null,"catName":"Digital camera","brandName":"Nikon","info":"NIKON Z30 MIRRORLESS CAMERA WITH Z DX 18-140MM, WITH 65GB UHS-I SD CARD 20.8MP DX-FORMAT CMOS SENSOR.","label":"Z30 KIT WITH Z DX 18-140MM","serialNumbers":"7630477","remarks":null},{"id":20452,"productId":746,"qty":1,"price":67836.2,"priceGst":80046.72,"discount":0,"cgst":6105.26,"sgst":6105.26,"igst":0,"amount":80046.72,"hsn":85258900,"gstRate":18,"productCode":"1668","upcCode":null,"catName":"Digital camera","brandName":"Nikon","info":"NIKON Z30 MIRRORLESS CAMERA WITH Z DX 16-50MM &   Z DX50-250MM WITH 65GB UHS-I SD CARD 20.8MP DX-FORMAT CMOS SENSOR.","label":"Z30 KIT WITH Z DX 16-50MM & Z DX50-250MM","serialNumbers":"7625207","remarks":null},{"id":20453,"productId":442,"qty":1,"price":48062.16,"priceGst":56713.35,"discount":0,"cgst":4325.59,"sgst":4325.59,"igst":0,"amount":56713.35,"hsn":90021100,"gstRate":18,"productCode":"1370","upcCode":null,"catName":"Camera lens","brandName":"Nikon","info":"NIKKOR Z 35mm f/1.8 S. As a fast wide-angle prime lens","label":" Z 35MM F/1.8 S","serialNumbers":"20080184","remarks":null}]}