import { Box, Button, IMegaData, useTraceMaterialComponents, TextareaAutosize, Typography, useContext, useRef, MegaDataContext, useEffect, useState, useTheme, } from '../redirect'
import { LineItem } from './line-item'

function LineItems() {
    const [, setRefresh] = useState({})
    const theme = useTheme()
    const megaData: IMegaData = useContext(MegaDataContext)
    const sales = megaData.accounts.sales
    const items = sales.items
    const { BasicMaterialDialog } = useTraceMaterialComponents()

    const meta: any = useRef({ 
        dialogConfig: {
            title: 'Serial numbers (Comma separated)',
            content: () => <></>
        },
        renderCallbackKey:'render:itemsFooter',
        setItemToSelectedProductCallbackKey:'setItemToSelectedProduct:lineItems',
        showDialog: false,
    })
    const pre = meta.current

    useEffect(() => {
        megaData.registerKeyWithMethod('render:lineItems', setRefresh)
        megaData.registerKeyWithMethod('handleSerialNo:lineItems', handleSerialNo)
        megaData.registerKeyWithMethod('setItemToSelectedProduct:lineItems', setItemToSelectedProduct)
        megaData.registerKeyWithMethod('computeAllRows:lineItems', computeAllRows)
        if (items.length === 0) {
            megaData.executeMethodForKey('handleAddItem:itemsHeader')
        }
    }, [])

    return (<Box className='vertical' sx={{ rowGap: 1 }}>
        {
            items.map((item: any, index: number) =>
                <LineItem item={item} index={index} key={index} />
            )
        }
        <BasicMaterialDialog parentMeta={meta} />
    </Box>)

    function computeAllRows() {
        for (let lineItem of sales.items) {
            megaData.executeMethodForKey('computeRow:lineItem', lineItem, false)
        }
        megaData.executeMethodForKey('computeSummary:itemsFooter')
        setRefresh({})
    }

    function handleSerialNo({ item }: any) {
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
                        <Button onClick={handleClear} size='small' color='warning' variant='contained'>Clear</Button>
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
        currentItem.productId = selectedProduct.id1
        currentItem.productCode = selectedProduct.productCode
        currentItem.productDetails = ''.concat(selectedProduct.brandName, ' ', selectedProduct.catName, ' ', selectedProduct.label, ' ', selectedProduct.info || '')
        currentItem.hsn = selectedProduct.hsn
        currentItem.gstRate = selectedProduct.gstRate
        currentItem.clos = selectedProduct.clos
        currentItem.priceGst = selectedProduct.salePriceGst || selectedProduct.maxRetailPrice || 0
        currentItem.discount = selectedProduct.saleDiscount || 0
        currentItem.age = selectedProduct.age
        megaData.executeMethodForKey('computeRow:lineItem', currentItem)
        setRefresh({})
    }
}

export { LineItems }

