import { useEffect, useRef, useState } from 'react'
import { Box, Button, Tab, Tabs, Typography, useTheme } from '../../../../imports/gui-imports'
import _ from 'lodash'
import { execGenericView, manageEntitiesState, useSharedElements } from '../inventory/redirect';
import { PurchaseStore } from '../../stores/purchase-store';
import { AggrOptions, ColumnOptions, GenericSyncfusionGrid, GridOptions } from './generic-syncfusion-grid'
import { AppStore } from '../../stores/app-store';
import { signal } from '@preact/signals-react';

function PurchaseView() {
    const theme = useTheme()
    const { emit } = useSharedElements()
    // const { getCurrentEntity, getFromBag } = manageEntitiesState()
    const [, setRefresh] = useState({})
    useEffect(() => {
        if (PurchaseStore.tabValue.value === 1) {
            emit('GENERIC-SYNCFUSION-GRID-LOAD-DATA' + PurchaseStore.purchaseType, undefined)
        }
    }, [PurchaseStore.tabValue.value])

    return (<Box mt={2}>
        <GenericSyncfusionGrid gridOptions={getGridOptions()} />
    </Box>)

    function getGridOptions(): GridOptions {
        const gridOptions: GridOptions = {
            aggregates: getAggregates(),
            instance: PurchaseStore.purchaseType,
            // searchTextWrapper: AppStore.misc.purchase.grid.searchTextWrapper,
            // viewLimitWrapper: AppStore.misc.purchase.grid.viewLimitWrapper,
            sqlKey: 'get_purchase_headers',
            columns: getColumns(),
            sqlArgs: {
                tranTypeId: 5,
                no: 100
            },
            onDelete: onPurchaseDelete,
            onEdit: onPurchaseEdit,
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
            , { field: 'tranDate', headerText: 'Date', type: 'date', width: 95, format: { type: 'date', format: 'dd/MM/yyyy' } }
            , { field: 'autoRefNo', headerText: 'Ref no', width: 170 }
            , { field: 'userRefNo', headerText: 'Invoice no', width: 200 }
            , { field: 'amount', headerText: 'Amount', textAlign: 'Right', type: 'number', width: 130, format: 'N2' }
            , { field: 'productDetails', headerText: 'Product details', width: 220 }
            , { field: 'aggr', headerText: 'Aggr', textAlign: 'Right', width: 130, format: 'N2' } //numeric with 2 decimals
            , { field: 'cgst', headerText: 'Cgst', textAlign: 'Right', width: 110, format: 'N2' }
            , { field: 'sgst', headerText: 'Sgst', textAlign: 'Right', width: 110, format: 'N2' }
            , { field: 'igst', headerText: 'Igst', textAlign: 'Right', width: 110, format: 'N2' }
            , { field: 'serialNumbers', headerText: 'Serial No', width: 150 }
            , { field: 'productCodes', headerText: 'Product codes', width: 150 }
            , { field: 'hsns', headerText: 'Hsn codes', width: 150 }
            , { field: 'remarks', headerText: 'Remarks', width: 150 }
        ]
        return (columns)
    }

    function onPurchaseDelete(id: number) {

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
            preparePurchaseStore(ret)
        }
    }

    function preparePurchaseStore(data: any) {
        const res = data.jsonResult
        const { loadTranH, loadExtGstTranD, loadSalePurchaseDetails, loadTranD } = populateFunctions()
        loadTranH(res)
        loadExtGstTranD(res)
        loadSalePurchaseDetails(res)
        loadTranD(res)
        // setRefresh({})
        // PurchaseStore.main.functions.refreshPurchaseLineItems()
    }

    function populateFunctions() {
        const header = PurchaseStore.main.header
        const subheader = PurchaseStore.main.subheader
        const lineItemsHeader = PurchaseStore.main.lineItemsHeader
        let lineItems = PurchaseStore.main.lineItems

        function loadTranH(res: any) {
            const tranH = res.tranH
            header.id = tranH.id
            header.refNo.value = tranH.autoRefNo
            header.tranDate.value = tranH.tranDate
            header.invoiceNo.value = tranH.userRefNo
            header.commonRemarks.value = tranH.remarks
        }

        function loadExtGstTranD(res: any) {
            const extGstTranD = res?.extGstTranD
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
            let numb = 1
            function incr() {
                return numb++
            }

            PurchaseStore.main.lineItems.value = salePurchaseDetails.map((item: any) => ({
                id: signal(item.id),
                // index: incr(),
                remarks: signal(item.remarks || ''),
                upcCode: signal(item.upcCode),
                producrCodeOrUpc: signal(''),
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
        }

        function loadTranD(res: any) {

        }

        return ({ loadTranH, loadExtGstTranD, loadSalePurchaseDetails, loadTranD })
    }



}
export { PurchaseView }
