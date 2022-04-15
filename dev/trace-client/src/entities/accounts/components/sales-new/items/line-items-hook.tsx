import { _, Big, useContext, MegaDataContext, useEffect, useState, utilMethods } from '../redirect'

function useLineItems() {
    const [, setRefresh] = useState({})
    const megaData = useContext(MegaDataContext)
    const sales = megaData.accounts.sales
    const items = sales.items
    const { execGenericView } = utilMethods()
    useEffect(() => {
        sales.computeSummary = () => { }
        if (items.length === 0) {
            handleAddItem()
        }
        sales.handleAddItem = handleAddItem
        sales.computeAllRows = computeAllRows
        fetchAllProducts()
    }, [])

    function computeAllRows() {
        for (let lineItem of sales.items) {
            computeRow(lineItem, false)
        }
        sales.computeSummary()
        setRefresh({})
    }

    function computeRow(item: any, toComputeSummary = true) {
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
        toComputeSummary && sales.computeSummary()
    }

    async function fetchAllProducts() {
        sales.products = await execGenericView({
            isMultipleRows:true,
            args: {},
            sqlKey:''
        })
        setRefresh({})
    }

    function handleAddItem() {
        items.push({ upc: '', productCode: '', hsn: '', gstRate: 0, qty: 1, price: 0, priceGst: 0, discount: 0, remarks: null, amount: 0, cgst: 0, sgst: 0, igst: 0 })
        sales.computeSummary()
        setRefresh({})
    }

    function handleDeleteRow(index: number) {
        if (items.length === 1) {
            return
        }
        items.splice(index, 1)
        sales.computeSummary()
        setRefresh({})
    }

    function handleSerialNo(item: any) {

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

    return ({ computeRow, handleDeleteRow, handleSerialNo, setPrice, setPriceGst })
}

export { useLineItems }