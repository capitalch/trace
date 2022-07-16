import { _, Badge, Box, Button, Card, CloseSharp, errorMessages, IconButton, IMegaData, manageEntitiesState, NumberFormat, TextField, useTraceMaterialComponents, TextareaAutosize, Typography, useContext, useRef, MegaDataContext, useEffect, useState, useTheme, utilMethods, useIbuki, } from '../redirect'
import { useLineItem } from './line-item-hook'

function LineItems() {
    const [, setRefresh] = useState({})
    const theme = useTheme()
    const megaData: IMegaData = useContext(MegaDataContext)
    const sales = megaData.accounts.sales
    const items = sales.items
    const { BasicMaterialDialog } = useTraceMaterialComponents()

    const meta: any = useRef({
        showDialog: false,
        dialogConfig: {
            title: 'Serial numbers (Comma separated)',
            content: () => <></>
        },
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
                // setRefresh({})
            }

            function processCount() {
                item.serialNumerCount = item?.serialNumbers.split(',').filter(Boolean).length
                // megaData.executeMethodForKey('render:lineItems', {})
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

function LineItem({ item, index, }: any) {
    const [, setRefresh] = useState({})

    const theme = useTheme()
    const megaData: IMegaData = useContext(MegaDataContext)
    const sales = megaData.accounts.sales
    const allErrors = sales.allErrors
    const { debounceEmit, emit } = useIbuki()
    const items = sales.items
    const { getFromBag } = manageEntitiesState()
    const unitInfo = getFromBag('unitInfo')
    const isGstApplicable = !!unitInfo?.gstin
    const { extractAmount, toDecimalFormat } = utilMethods()
    const { clearRow,computeRow, getSlNoError, handleDeleteRow, meta, setPrice, setPriceGst } = useLineItem()

    checkAllErrors()
    useEffect(() => {
        emit('ALL-ERRORS-JUST-REFRESH', null)
    })

    return (
        <Box
            onClick={(e: any) => {
                if (sales.currentItemIndex === index) {
                    return
                }
                sales.currentItemIndex = index
                megaData.executeMethodForKey('render:lineItems', {})
            }}
            sx={{
                display: 'flex', alignItems: 'center', border: '1px solid lightGrey'
                , borderColor: (sales.currentItemIndex === index) ? theme.palette.secondary.main : theme.palette.secondary.light, borderWidth: (sales.currentItemIndex === index) ? '4px' : '1px',
                flexWrap: 'wrap', p: 2, pr: 1, rowGap: 3, columnGap: 2
            }} >

            {/* Index */}
            <Box className='vertical' sx={{ width: theme.spacing(3) }}>
                {/* Age */}
                <Badge badgeContent={item.age || 0} color='secondary' sx={{ mb: 1, ml: -14 }} showZero overlap='circular' anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}>
                </Badge>
                <Typography variant='body2' sx={{ mt: 1, textDecoration: 'underline', fontSize: theme.spacing(1.5) }} color={theme.palette.secondary.main}>{index + 1}</Typography>
            </Box>
            {/* Product code */}
            <Box className='vertical' >
                <Typography variant='body2'>Product code</Typography>
                <NumberFormat sx={{ maxWidth: theme.spacing(10) }}
                    // inputRef={pre.productCodeRef}
                    allowNegative={false}
                    autoComplete='off'
                    customInput={TextField}
                    decimalScale={0}
                    error={item.isProductCodeError}
                    fixedDecimalScale={true}
                    value={item.productCode || ''}
                    variant='standard'
                    size='small'
                    onChange={(e: any) => {
                        item.productCode = e.target.value
                        if (item.productCode) {
                            debounceEmit('DEBOUNCE-ON-CHANGE', { item, setRefresh })
                        } else {
                            clearRow(item)
                            setRefresh({})
                        }
                    }}

                    onFocus={(e: any) => {
                        e.target.select()
                    }} />
            </Box>
            {/* Product details */}
            <Card variant='outlined' sx={{
                width: theme.spacing(22), height: theme.spacing(8),
                p: .5, pt: 0, border: '1px solid lightGrey', borderColor: item.isProductDetailsError ? 'red' : 'lightGrey'
            }}>
                <Typography sx={{
                    fontSize: theme.spacing(1.8),
                    fontWeight: 'bold', overflow: 'hidden', color: theme.palette.common.black,
                }} variant='body1'>{item.productDetails || ''}</Typography>
            </Card>
            {/* Hsn */}
            <Box className='vertical'>
                <Typography sx={{ textAlign: 'right' }} variant='body2'>Hsn</Typography>
                <NumberFormat sx={{ maxWidth: theme.spacing(10) }}
                    allowNegative={false}
                    autoComplete='off'
                    // InputProps={smallFontTextField}
                    className='right-aligned'
                    customInput={TextField}
                    decimalScale={0}
                    error={item.isHsnError}
                    fixedDecimalScale={true}
                    value={item.hsn || 0}
                    variant='standard'
                    onChange={(e: any) => handleTextChanged(item, 'hsn', e)}
                    onFocus={(e: any) => {
                        e.target.select()
                    }} />
            </Box>

            {/* Gst(%) */}
            <Box className='vertical'>
                <Typography sx={{ textAlign: 'right' }} variant='body2'>Gst(%)</Typography>
                <NumberFormat sx={{ maxWidth: theme.spacing(6) }}
                    allowNegative={false}
                    autoComplete='off'
                    error={item.isGstRateError}
                    // disabled={true}
                    // InputProps={smallFontTextField}
                    className='right-aligned'
                    customInput={TextField}
                    decimalScale={2}
                    fixedDecimalScale={true}
                    value={item.gstRate || 0.00}
                    variant='standard'
                    onFocus={(e: any) => {
                        e.target.select()
                    }}
                    onValueChange={(values: any) => {
                        const { floatValue } = values
                        item.gstRate = floatValue || 0.0
                        setRefresh({})
                        computeRow(item)
                    }} />
            </Box>
            {/* Qty */}
            <Box className='vertical'>
                <Badge badgeContent={item.clos || 0} color='secondary' sx={{ ml: 4, }} showZero overlap='circular' anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}>
                    <Typography sx={{ textAlign: 'right' }} variant='body2'>Qty</Typography>
                </Badge>
                <NumberFormat sx={{ maxWidth: theme.spacing(8) }}
                    autoComplete='off'
                    allowNegative={false}
                    // InputProps={smallFontTextField}
                    className='right-aligned'
                    customInput={TextField}
                    decimalScale={2}
                    fixedDecimalScale={true}
                    value={item.qty || 1.00}
                    onFocus={(e: any) => {
                        e.target.select()
                    }}
                    onValueChange={(value) => {
                        const { floatValue } = value
                        item.qty = floatValue
                        setRefresh({})
                        computeRow(item)
                    }}
                    thousandSeparator={true}
                    variant='standard'
                />
            </Box>
            {/* Price */}
            <Box className='vertical'>
                <Typography sx={{ textAlign: 'right' }} variant='body2'>Price</Typography>
                <NumberFormat style={{ maxWidth: theme.spacing(13) }}
                    autoComplete='off'
                    allowNegative={false}
                    // InputProps={smallFontTextField}
                    className='right-aligned'
                    customInput={TextField}
                    decimalScale={2}
                    fixedDecimalScale={true}
                    value={item.price || 0.00}
                    onChange={(e: any) => {
                        item.price = +extractAmount(e.target.value) || 0.0
                        setPriceGst(item)
                        setRefresh({})
                        computeRow(item)
                    }}
                    onFocus={(e: any) => {
                        e.target.select()
                    }}
                    thousandSeparator={true}
                    variant='standard' />
            </Box>
            {/* Price(Gst) */}
            <Box className='vertical'>
                <Typography sx={{ textAlign: 'right' }} variant='body2'>Price(Gst)</Typography>
                <NumberFormat sx={{ maxWidth: theme.spacing(13), }}
                    autoComplete='off'
                    allowNegative={false}
                    // InputProps={smallFontTextField}
                    className='right-aligned'
                    customInput={TextField}
                    decimalScale={2}
                    fixedDecimalScale={true}
                    value={item.priceGst || 0.00}
                    onFocus={(e: any) => {
                        e.target.select()
                    }}
                    onChange={(e: any) => {
                        item.priceGst = +extractAmount(e.target.value) || 0.0
                        setPrice(item)
                        setRefresh({})
                        computeRow(item)
                    }}
                    thousandSeparator={true}
                    size='small' color='secondary'
                    variant='standard'
                />
            </Box>
            {/* Discount(unit) */}
            <Box className='vertical'>
                <Typography sx={{ textAlign: 'right' }} variant='body2'>Disc(unit)</Typography>
                <NumberFormat style={{ maxWidth: theme.spacing(10) }}
                    autoComplete='off'
                    allowNegative={false}
                    // InputProps={smallFontTextField}
                    className='right-aligned'
                    customInput={TextField}
                    decimalScale={2}
                    fixedDecimalScale={true}
                    value={item.discount || 0.00}
                    onFocus={(e: any) => {
                        e.target.select()
                    }}
                    onValueChange={(values: any) => {
                        const { floatValue } = values
                        item.discount = floatValue || 0.0
                        setRefresh({})
                        computeRow(item)
                    }}
                    variant='standard' />
            </Box>
            {/* Remarks */}
            <Box className='vertical' >
                <Typography variant='body2'>Remarks</Typography>
                <TextField
                    autoComplete='off'
                    // InputProps={smallFontTextField}
                    sx={{ maxWidth: theme.spacing(18) }}
                    variant='standard'
                    value={item.remarks || ''}
                    onChange={(e: any) => handleTextChanged(item, 'remarks', e)} />
            </Box>
            {/* Serial numbers */}
            <Badge
                badgeContent={
                    (item.serialNumbers || '')
                        .split(',')
                        .filter(Boolean).length
                }
                color={
                    getSlNoError(item)
                        ? 'error'
                        : 'secondary'
                }
                showZero={true}>
                <Button color='primary' size='medium' variant='contained' onClick={() => {
                    megaData.executeMethodForKey('handleSerialNo:lineItems', { item })
                }}>Serial no</Button>
            </Badge>

            {/* amount */}
            <Typography variant='body2' sx={{ ml: 'auto', textAlign: 'right', color: theme.palette.common.black, fontWeight: 'bolder' }} >{toDecimalFormat(item.amount || 0.00)}</Typography>
            <Box sx={{ ml: -6.5, mt: -8, mr: 0.5 }}>
                {/* delete */}
                <IconButton sx={{ position: 'relative', left: theme.spacing(1.5), }} size='small' color='error'
                    onClick={(e: any) => handleDeleteRow(e, item, index)}>
                    <CloseSharp />
                </IconButton>
            </Box>
        </Box >
    )

    function handleTextChanged(item: any, propName: string, e: any) {
        item[propName] = e.target.value
        setRefresh({})
    }

    function checkAllErrors() {
        item.isProductCodeError = item.productCode ? false : true
        allErrors.productCodeError = item.isProductCodeError ? errorMessages.productCodeError : ''

        item.isProductDetailsError = item.productDetails ? false : true
        allErrors.productDetailsError = item.isProductDetailsError ? errorMessages.productDetailsError : ''

        if (isGstApplicable) {
            item.isHsnError = item.hsn ? false : true
            allErrors.hsnError = item.isHsnError ? errorMessages.hsnError : ''
            item.isGstRateError = item.gstRate ? false : true
        } else {
            item.isHsnError = false
            allErrors.hsnError = ''
            item.isGstRateError = item.gstRate ? true : false
        }
        allErrors.gstRateError = item.isGstRateError ? errorMessages.gstRateError : ''
    }
}