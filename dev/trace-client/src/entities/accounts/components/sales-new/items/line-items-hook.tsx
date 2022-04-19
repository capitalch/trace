import { clearScreenDown } from 'readline'
import { _, Badge, Big, Box, Button, IMegaData, MegaDataContext, TextareaAutosize, Typography, useContext, useEffect, useIbuki, useRef, useTheme, useState, useTraceMaterialComponents, utilMethods } from '../redirect'

function useLineItems() {
    const [, setRefresh] = useState({})
    const { emit, debounceFilterOn } = useIbuki()
    const megaData: IMegaData = useContext(MegaDataContext)
    const sales = megaData.accounts.sales
    const items = sales.items
    const { execGenericView, setIdForDataGridRows } = utilMethods()
    const theme = useTheme()
    // const productCodeRef:any = useRef({})
    const meta: any = useRef({
        showDialog: false,
        dialogConfig: {
            title: 'Serial numbers (Comma separated)',
            content: () => <></>
        }
    })
    const pre = meta.current
    useEffect(() => {
        megaData.registerKeyWithMethod('render:lineItems', setRefresh)
        if (items.length === 0) {
            megaData.executeMethodForKey('handleAddItem:itemsHeader')
        }

        const subs1 = debounceFilterOn('DEBOUNCE-ON-CHANGE', 1200).subscribe(doSearchProductOnProductCode)
        megaData.registerKeyWithMethod('computeAllRows:lineItems', computeAllRows)
        megaData.registerKeyWithMethod('setItemToSelectedProduct:lineItems', setItemToSelectedProduct)
        fetchAllProducts()
        return () => {
            subs1.unsubscribe()
        }
    }, [])

    function clearRow(item: any) {
        item.productCode = undefined
        item.productDetails = undefined
        item.hsn = undefined
        item.gstrate = 0.0
        item.qty = 1
        item.priceGst = 0.0
        item.discount = 0.0
        item.amount = 0.0
        item.serialNumbers = ''
        item.remarks = ''
    }

    function computeAllRows() {
        for (let lineItem of sales.items) {
            computeRow(lineItem, false)
        }
        megaData.executeMethodForKey('computeSummary:itemsFooter')
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
        toComputeSummary && megaData.executeMethodForKey('computeSummary:itemsFooter')
    }

    async function doSearchProductOnProductCode(d: any) {
        const productCode = d.data.productCode
        const item = d.data
        emit('SHOW-LOADING-INDICATOR', true)
        try {
            const result: any = await execGenericView({
                sqlKey: 'get_product_on_product_code',
                isMultipleRows: false,
                args: {
                    productCode: productCode,
                },
            })
            item.id = result.id
            item.productDetails = ''.concat(result.brandName, ' ', result.catName, ' ', result.label, ' ', result.info)
            item.hsn = result.hsn
            item.gstRate = result.gstRate
            item.priceGst = result.salePriceGst || 0
            item.discount = result.saleDiscount || 0
            computeRow(item)

            setRefresh({})
            // selectProduct(rowData, result)
        } catch (e: any) {
            console.log(e.message)
        }
        emit('SHOW-LOADING-INDICATOR', false)
    }

    async function fetchAllProducts() {
        emit('SHOW-LOADING-INDICATOR', true)
        megaData.accounts.allProducts = await execGenericView({
            isMultipleRows: true,
            args: { onDate: null, isAll: true, days: 0 },
            sqlKey: 'get_products_info'
        })
        emit('SHOW-LOADING-INDICATOR', false)
        setIdForDataGridRows(megaData.accounts.allProducts)
        setRefresh({})
    }

    function getSlNoError(item: any) {
        const ok = (getCount() === item.qty) || (getCount() === 0)
        return !ok

        function getCount() {
            return item.serialNumbers ? item.serialNumbers.split(',').filter(Boolean).length : 0
        }
    }

    function handleDeleteRow(index: number) {
        if (items.length === 1) {
            return
        }
        items.splice(index, 1)
        megaData.executeMethodForKey('computeSummary:itemsFooter')
        setRefresh({})
    }

    function handleSerialNo(item: any) {
        pre.showDialog = true
        pre.dialogConfig.maxWidth = 'sm'
        pre.dialogConfig.content = () => <Content />
        item.serialNumbers = item.serialNumbers ?? ''
        item.serialNumerCount = item?.serialNumbers.split(',').filter(Boolean).length
        setRefresh({})

        function Content() {
            const [, setRefresh] = useState({})
            return (
                <Box sx={{ display: 'flex', flexDirection: 'column', }}>
                    <Typography variant='subtitle2' color='black' sx={{ fontWeight: 'bold', ml: 'auto', }}>{item.serialNumerCount + ' items'}</Typography>
                    <TextareaAutosize
                        autoFocus={true}
                        style={{ color: 'black', fontSize: theme.spacing(2.0), fontWeight: 'bold', fontFamily: 'helvetica' }}
                        className="serial-number"
                        minRows={5}
                        onChange={(e: any) => {
                            item.serialNumbers = e.target.value
                            processCount()
                        }}
                        value={item.serialNumbers || ''}
                    />
                    <Box sx={{ display: 'flex', ml: 'auto', mt: 2 }}>
                        <Button onClick={handleClear} size='small' color='info' variant='contained'>Clear</Button>
                        <Button onClick={handleOk} size='small' color='secondary' variant='contained' sx={{ ml: 2 }} >Ok</Button>
                    </Box>
                </Box>)

            function handleClear() {
                item.serialNumbers = ''
                processCount()
            }

            function handleOk() {
                pre.showDialog = false
                megaData.executeMethodForKey('render:lineItems', {})
                // setRefresh({})
            }

            function processCount() {
                item.serialNumerCount = item?.serialNumbers.split(',').filter(Boolean).length
                setRefresh({})
            }
        }
    }

    function setItemToSelectedProduct() {
        const currentItemIndex = sales.currentItemIndex
        const currentItem = items[currentItemIndex]
        const selectedProduct = megaData.accounts.selectedProduct
        // populate current item with selectedProduct
        currentItem.id = selectedProduct.id1
        currentItem.productCode = selectedProduct.productCode
        currentItem.productDetails = ''.concat(selectedProduct.brandName, ' ', selectedProduct.catName, ' ', selectedProduct.label, ' ', selectedProduct.info)
        currentItem.hsn = selectedProduct.hsn
        currentItem.gstRate = selectedProduct.gstRate
        currentItem.clos = selectedProduct.clos
        currentItem.priceGst = selectedProduct.salePriceGst || selectedProduct.maxRetailPrice || 0
        currentItem.discount = selectedProduct.saleDiscount || 0
        currentItem.age = selectedProduct.age
        computeRow(currentItem)
        setRefresh({})
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
        clearRow, computeRow, getSlNoError, handleDeleteRow, handleSerialNo, meta, setPrice, setPriceGst
    })
}

export { useLineItems }