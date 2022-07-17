import { _, Big, IMegaData, MegaDataContext, useContext, useEffect, useIbuki, useRef, utilMethods } from '../redirect'

function useLineItem() {
    const { emit, debounceFilterOn } = useIbuki()
    const megaData: IMegaData = useContext(MegaDataContext)
    const sales = megaData.accounts.sales
    const items = sales.items
    const { execGenericView, } = utilMethods()

    const meta: any = useRef({
        showDialog: false,
        dialogConfig: {
            title: 'Serial numbers (Comma separated)',
            content: () => <></>
        },
    })

    useEffect(() => {
        megaData.registerKeyWithMethod('computeRow:lineItem', computeRow)
        const subs1 = debounceFilterOn('DEBOUNCE-ON-CHANGE', 1500).subscribe(doSearchProductOnProductCode)
        return () => {
            subs1.unsubscribe()
        }
    }, [])

    function clearRow(item: any) {
        item.productCode = undefined
        item.productId = undefined
        item.productDetails = undefined
        item.hsn = undefined
        item.gstRate = 0.0
        item.qty = 1
        item.price = 0.00
        item.priceGst = 0.0
        item.discount = 0.0
        item.amount = 0.0
        item.serialNumbers = ''
        item.remarks = ''
        item.sgst = 0.0
        item.cgst = 0.0
        item.igst = 0.0
        megaData.executeMethodForKey('computeSummary:itemsFooter')
    }

    function computeRow(item: any, toComputeSummary: boolean = true) {
        const gstRate = item.gstRate || 0.0
        let priceGst = item.priceGst
        let price = item.price
        const discount = item.discount
        const qty = item.qty
        let amount, gst, sgst, cgst

        if (priceGst) {
            price = priceGst / (1 + gstRate / 100)
            item.price = price
        } else if (price) {
            priceGst = price * (1 + gstRate / 100)
            item.priceGst = priceGst
        }
        if (discount === 0) {
            amount = priceGst * qty
            gst = (priceGst - price) * qty
        } else {
            amount = (price - discount) * qty * (1 + gstRate / 100)
            gst = amount - (price - discount) * qty
        }
        cgst = _.round(gst / 2, 2)
        sgst = cgst
        if (sales.isIgst) {
            item.igst = _.round(gst, 2)
            item.cgst = 0.0
            item.sgst = 0.0
        } else {
            item.igst = 0.0
            item.cgst = cgst
            item.sgst = sgst
        }
        item.amount = _.round(amount, 2)
        toComputeSummary && megaData.executeMethodForKey('computeSummary:itemsFooter')
    }

    async function doSearchProductOnProductCode(d: any) {
        const { item, setRefresh } = d.data
        const productCode = item.productCode
        if (!productCode) {
            return
        }
        emit('SHOW-LOADING-INDICATOR', true)
        try {
            const result: any = await execGenericView({
                sqlKey: 'get_product_on_product_code',
                isMultipleRows: false,
                args: {
                    productCode: productCode,
                },
            })
            if (_.isEmpty(result)) {
                clearRow(item)
            } else {
                item.productId = result.id
                item.productDetails = ''.concat(result.brandName, ' ', result.catName, ' ', result.label, ' ', result.info)
                item.hsn = result.hsn
                item.gstRate = result.gstRate
                item.priceGst = result.salePriceGst || 0
                item.discount = result.saleDiscount || 0
                computeRow(item)
            }
            setRefresh({})
        } catch (e: any) {
            console.log(e.message)
        }
        emit('SHOW-LOADING-INDICATOR', false)
    }

    function getSlNoError(item: any) {
        const ok = (getCount() === item.qty) || (getCount() === 0)
        return !ok

        function getCount() {
            return item.serialNumbers ? item.serialNumbers.split(',').filter(Boolean).length : 0
        }
    }

    function handleDeleteRow(e: any, item: any, index: number) {
        e.stopPropagation() // necessary to prevent the firing of Box click event. Box is the parent. Click event of the box is for setting focus
        if (items.length === 1) {
            clearRow(item)
        } else {
            items.splice(index, 1)
            if (item.id) {
                sales.deletedSalePurchaseIds.push(item.id)
            }
        }
        if (items.length === 1) {
            sales.currentItemIndex = 0
        } else {
            sales.currentItemIndex = (items.length - 1)
        }
        megaData.executeMethodForKey('computeSummary:itemsFooter')
        megaData.executeMethodForKey('render:lineItems', {})
    }

    function setPrice(item: any) {
        const priceGst = item.priceGst
        const gstRate = item.gstRate
        const price = +Big(priceGst).div(Big(1).plus(Big(gstRate).div(Big(100))))
        item.price = price
    }

    function setPriceGst(item: any) {
        const price = item.price
        const gstRate = item.gstRate
        const priceGst = +Big(price).mul(Big(1).plus(Big(gstRate).div(Big(100))))
        item.priceGst = priceGst
    }

    return ({
        clearRow, computeRow, getSlNoError, handleDeleteRow, meta, setPrice, setPriceGst
    })
}

export { useLineItem }