import { Box } from "@mui/material"
import { PurchaseItemsHeader } from "./purchase-items-header"
import { PurchaseItemsFooter } from "./purchase-items-footer"
import { PurchaseLineItems } from "./purchase-line-items"
import { PurchaseLineItemType, PurchaseStore } from "../../purchase-store"
import Big from "big.js"
import { useCallback, useEffect } from "react"
import { produce } from "immer"
import { signal } from "@preact/signals-react"

function PurchaseItems() {
    
    const addLineItemCB = useCallback(addLineItem, [])
    const attachFunctionsCB = useCallback(attachFunctions, [])

    useEffect(() => {
        attachFunctionsCB()
        if (PurchaseStore.main.lineItems.value.length === 0) {
            addLineItemCB(0)
        }
    }, [attachFunctionsCB, addLineItemCB])

    return (<Box sx={{
        display: 'flex', p: 1, pt: 0.5, mt: 0, '& .vertical': { display: 'flex', flexDirection: 'column', },
        '& .right-aligned': { '& input': { textAlign: 'end' } }
    }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
            <PurchaseItemsHeader />
            <PurchaseLineItems />
            <PurchaseItemsFooter />
        </Box>
    </Box>)

    function addLineItem(index: number) {
        PurchaseStore.main.lineItems.value = produce(PurchaseStore.main.lineItems.value, (draft: any[]) => {
            draft.splice(index + 1, 0, getLineItemInstance())
            return (draft)
        })
        PurchaseStore.main.functions.computeSummary()
    }

    function attachFunctions() {
        PurchaseStore.main.functions.addLineItem = addLineItem
        PurchaseStore.main.functions.computeRow = computeRow
        PurchaseStore.main.functions.computeSummary = computeSummary
        PurchaseStore.main.functions.setPrice = setPrice
        PurchaseStore.main.functions.setPriceGst = setPriceGst
        PurchaseStore.main.functions.clearLineItem = clearLineItem
        PurchaseStore.main.functions.populateLineItem = populateLineItem
        PurchaseStore.main.functions.deleteLineItem = deleteLineItem
    }

    function clearLineItem(item: PurchaseLineItemType) {
        item.productCodeOrUpc.value = ''
        item.productCode.value = ''
        item.upcCode.value = ''
        item.productId.value = undefined
        item.hsn.value = 0
        item.productDetails.value = ''
        item.gstRate.value = 0
        item.qty.value = 1
        item.price.value = 0
        item.priceGst.value = 0
        item.discount.value = 0
        item.subTotal.value = 0
        item.amount.value = 0
        item.serialNumbers.value = ''
        item.remarks.value = ''
        item.cgst.value = 0
        item.sgst.value = 0
        item.igst.value = 0
    }

    function computeRow(item: PurchaseLineItemType) {
        const gstRate = +Big(item.gstRate.value)
        const qty = +Big(item.qty.value)
        const price = +Big(item.price.value)
        const discount = +Big(item.discount.value)
        const actualPriceCal = +Big(price).minus(discount)
        const subTotalCal = +Big(qty).mul(actualPriceCal)
        item.subTotal.value = subTotalCal

        if (PurchaseStore.main.lineItemsHeader.isIgst.value) {
            item.cgst.value = 0.0
            item.sgst.value = 0.0
            item.igst.value = +Big(subTotalCal).mul(gstRate).div(Big(100))
            item.amount.value = +Big(subTotalCal).plus(item.igst.value)
        } else {
            item.igst.value = 0.0
            item.cgst.value = +Big(subTotalCal).mul(gstRate).div(Big(200))
            item.sgst.value = item.cgst.value
            item.amount.value = +Big(subTotalCal).plus(item.cgst.value).plus(item.sgst.value)
        }
        setPriceGst(item)
    }

    function computeSummary() {
        const lineItems: PurchaseLineItemType[] = PurchaseStore.main.lineItems.value
        let cgst = 0, sgst = 0, igst = 0, amount = 0, qty = 0, subTotal = 0, discount = 0
        lineItems.forEach(lineItem => {
            computeRow(lineItem)
            cgst += lineItem.cgst.value
            sgst += lineItem.sgst.value
            igst += lineItem.igst.value
            amount += lineItem.amount.value
            qty += lineItem.qty.value
            subTotal += lineItem.subTotal.value
            discount += lineItem.discount.value * lineItem.qty.value
        })
        const lineItemsFooter = PurchaseStore.main.lineItemsFooter
        lineItemsFooter.cgst.value = cgst
        lineItemsFooter.sgst.value = sgst
        lineItemsFooter.igst.value = igst
        lineItemsFooter.qty.value = qty
        lineItemsFooter.subTotal.value = subTotal
        lineItemsFooter.discount.value = discount
        lineItemsFooter.amount.value = amount
    }

    function deleteLineItem(index: number) {
        if (PurchaseStore.main.lineItems.value.length === 1) {
            return
        }
        PurchaseStore.main.lineItems.value = produce(PurchaseStore.main.lineItems.value, (draft: any[]) => {
            draft.splice(index, 1)
            return (draft)
        })
        PurchaseStore.main.functions.computeSummary()
    }

    function getLineItemInstance(): PurchaseLineItemType {
        return ({
            productCodeOrUpc: signal(''),
            productCode: signal(''),
            upcCode: signal(''),
            productId: signal(undefined),
            hsn: signal(0),
            productDetails: signal(''),
            gstRate: signal(0),
            clos: signal(0),
            qty: signal(1),
            price: signal(0),
            priceGst: signal(0),
            discount: signal(0),
            subTotal: signal(0),
            amount: signal(0),
            serialNumbers: signal(''),
            remarks: signal(''),
            cgst: signal(0),
            sgst: signal(0),
            igst: signal(0)
        })
    }

    function populateLineItem(item: PurchaseLineItemType, data: any) {
        item.productCodeOrUpc.value = ''
        item.productCode.value = data.productCode
        item.upcCode.value = data.upcCode
        item.productId.value = data.productId
        item.hsn.value = data.hsn
        item.productDetails.value = `${data.catName} ${data.brandName} ${data.label}`
        item.gstRate.value = data.gstRate
        item.qty.value = 1
        item.price.value = data.lastPurchasePrice
        item.discount.value = 0
        item.subTotal.value = 0
        item.amount.value = 0
        item.serialNumbers.value = ''
        item.remarks.value = ''
        item.cgst.value = 0
        item.sgst.value = 0
        item.igst.value = 0
    }

    function setPrice(item: PurchaseLineItemType) {
        const priceGst = +Big(item.priceGst.value)
        const gstRate = +Big(item.gstRate.value)
        item.price.value = +Big(priceGst).div(+Big(1).add(Big(gstRate).div(Big(100))))
    }

    function setPriceGst(item: PurchaseLineItemType) {
        const price = +Big(item.price.value)
        const gstRate = +Big(item.gstRate.value)
        item.priceGst.value = +Big(price).mul(+Big(1).add(Big(gstRate).div(Big(100))))
    }
}
export { PurchaseItems }