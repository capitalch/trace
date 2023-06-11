import {
    _,
    AddCircle,
    Badge,
    Box,
    Button,
    Card,
    CloseSharp,
    IconButton,
    IMegaData,
    MegaDataContext,
    NumberFormat,
    TextareaAutosize,
    TextField,
    Typography,
    useContext,
    useEffect,
    useIbuki,
    useRef,
    useState,
    useTheme,
    useTraceMaterialComponents,
    utilMethods,
} from '../redirect'
import { ProductsSearch } from '../../common/products-search'

function StockJournalDetails() {
    return (
        <Box
            sx={{
                display: 'flex',
                rowGap: 2,
                columnGap: 2,
                mt: 1,
                flexWrap: 'wrap',
                justifyContent: 'space-between',
            }}>
            <StockJournalItems section="inputSection" />
            <StockJournalItems section="outputSection" />
        </Box>
    )
}

export { StockJournalDetails }

function StockJournalItems({ section }: any) {
    return (
        <Box
            sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                rowGap: 2,
                columnGap: 2,
                border: '1px solid lightGrey',
            }}>
            <StockJournalItemsHeader section={section} />
            <StockJournalLineItems section={section} />
            <StockJournalItemsFooter section={section} />
        </Box>
    )
}

function StockJournalItemsHeader({ section }: any) {
    const theme = useTheme()
    const megaData: IMegaData = useContext(MegaDataContext)
    const stockJournal = megaData.accounts.stockJournal[section]

    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
            }}>
            <Typography
                variant="body1"
                sx={{ fontWeight: 'bold', textDecoration: 'underline', minWidth:theme.spacing(70) }}>
                {stockJournal?.title || ''}
            </Typography>

            {/* Add */}
            <Button
                size="small"
                variant="contained"
                color="secondary"
                sx={{ width: theme.spacing(12.5) }}
                onClick={() => {
                    megaData.executeMethodForKey(
                        `handleAddItem:stockJournalLineItems:${section}`
                    )
                }}
                startIcon={<AddCircle sx={{ ml: -3 }} />}>
                Add
            </Button>
        </Box>
    )
}

function StockJournalLineItems({ section }: any) {
    const [, setRefresh] = useState({})
    const theme = useTheme()
    const megaData: IMegaData = useContext(MegaDataContext)
    let stockJournal: any = megaData.accounts.stockJournal[section]
    let items: any[] = stockJournal.items
    const { BasicMaterialDialog } = useTraceMaterialComponents()

    const meta: any = useRef({
        dialogConfig: {
            title: 'Serial numbers (Comma separated)',
            content: () => <></>
        },
        showDialog: false,
    })
    const pre = meta.current

    useEffect(() => {
        megaData.registerKeyWithMethod(
            `handleAddItem:stockJournalLineItems:${section}`,
            handleAddItem
        )
        megaData.registerKeyWithMethod(
            `render:stockJournalLineItems:${section}`,
            setRefresh
        )
        megaData.registerKeyWithMethod(
            `setItemToSelectedProduct:stockJournalLineItems:${section}`,
            setItemToSelectedProduct
        )
        megaData.registerKeyWithMethod(`handleSerialNo:stockJournalLineItems:${section}`, handleSerialNo)
        stockJournal.currentItemIndex = 0
    }, [])

    return (
        <Box className="vertical" sx={{ rowGap: 1 }}>
            {items.map((item: any, index: number) => (
                <StockJournalLineItem
                    section={section}
                    item={item}
                    index={index}
                    key={index}
                />
            ))}
            <BasicMaterialDialog parentMeta={meta} />
        </Box>
    )

    function handleAddItem() {
        stockJournal = megaData.accounts.stockJournal[section]
        items = stockJournal.items
        items.push({ qty: 1 })
        stockJournal.currentItemIndex = items.length - 1
        setRefresh({})
        megaData.executeMethodForKey(
            `computeSummary:stockJournalItemsFooter:${section}`
        )
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
                // setRefresh({})
                megaData.executeMethodForKey(`render:stockJournalLineItems:${section}`, {})
            }

            function processCount() {
                item.serialNumerCount = item?.serialNumbers.split(',').filter(Boolean).length
                setRefresh({})
            }
        }
    }

    function setItemToSelectedProduct() {
        stockJournal = megaData.accounts.stockJournal[section]
        items = stockJournal.items
        const currentItemIndex = stockJournal.currentItemIndex
        const currentItem = items[currentItemIndex]
        const selectedProduct = megaData.accounts.selectedProduct
        // populate current item with selectedProduct
        currentItem.productId = selectedProduct.id1
        currentItem.productCode = selectedProduct.productCode
        currentItem.productDetails = ''.concat(
            selectedProduct.brandName,
            ' ',
            selectedProduct.catName,
            ' ',
            selectedProduct.label,
            ' ',
            selectedProduct.info || ''
        )
        setRefresh({})
    }
}

function StockJournalLineItem({ section, item, index }: any) {
    const theme = useTheme()
    const [, setRefresh] = useState({})
    const { debounceEmit, debounceFilterOn, emit } = useIbuki()

    const megaData: IMegaData = useContext(MegaDataContext)
    const stockJournal = megaData.accounts.stockJournal[section]
    const items: any[] = stockJournal.items
    const allErrors = stockJournal.allErrors

    checkAllErrors()

    useEffect(() => {
        const subs1 = debounceFilterOn('DEBOUNCE-ON-CHANGE', 1500).subscribe(
            doSearchProductOnProductCode
        )
        return () => {
            subs1.unsubscribe()
        }
    }, [])

    useEffect(() => {
        megaData.executeMethodForKey('render:stockJournalCrown', {})
    })

    return (
        <Box
            onClick={(e: any) => {
                if (stockJournal.currentItemIndex !== index) {
                    stockJournal.currentItemIndex = index
                    megaData.executeMethodForKey(
                        `render:stockJournalLineItems:${section}`,
                        {}
                    )
                }
            }}
            sx={{
                display: 'flex',
                // alignItems: 'center',
                rowGap: 2,
                columnGap: 2,
                border: '1px solid lightGrey',
                borderColor:
                    stockJournal.currentItemIndex === index
                        ? theme.palette.secondary.main
                        : theme.palette.secondary.light,
                borderWidth:
                    stockJournal.currentItemIndex === index ? '4px' : '1px',
                p: 2,
                pr: 1,
            }}>
            {/* Index */}
            <Typography
                variant="body2"
                sx={{
                    mt: 1,
                    mr: 1,
                    textDecoration: 'underline',
                    fontSize: theme.spacing(1.5),
                }}
                color={theme.palette.secondary.main}>
                {index + 1}
            </Typography>

            {/* Product code */}
            <Box className="vertical">
                <Typography variant="body2">Product code</Typography>
                <NumberFormat
                    sx={{ maxWidth: theme.spacing(10) }}
                    allowNegative={false}
                    autoComplete="off"
                    customInput={TextField}
                    decimalScale={0}
                    error={item.isProductCodeError}
                    fixedDecimalScale={true}
                    value={item.productCode || ''}
                    variant="standard"
                    size="small"
                    onChange={(e: any) => {
                        item.productCode = e.target.value
                        if (item.productCode) {
                            debounceEmit('DEBOUNCE-ON-CHANGE', {
                                item,
                                setRefresh,
                            })
                        } else {
                            clearRow(item)
                            setRefresh({})
                        }
                    }}
                    onFocus={(e: any) => {
                        e.target.select()
                    }}
                />
            </Box>

            {/* Product details */}
            <Card
                variant="outlined"
                sx={{
                    width: theme.spacing(20),
                    height: theme.spacing(8),
                    p: 0.5,
                    pt: 0,
                    border: '1px solid lightGrey',
                    borderColor: item.isProductDetailsError
                        ? 'red'
                        : 'lightGrey',
                }}>
                <Typography
                    sx={{
                        fontSize: theme.spacing(1.8),
                        fontWeight: 'bold',
                        overflow: 'hidden',
                        color: theme.palette.common.black,
                    }}
                    variant="body1">
                    {item.productDetails || ''}
                </Typography>
            </Card>

            {/* Qty */}
            <Box className="vertical">
                <Typography variant="body2" sx={{ textAlign: 'right' }}>
                    Qty
                </Typography>
                <NumberFormat
                    sx={{ maxWidth: theme.spacing(8) }}
                    autoComplete="off"
                    allowNegative={false}
                    className="right-aligned"
                    customInput={TextField}
                    decimalScale={2}
                    fixedDecimalScale={true}
                    value={item.qty || 1.0}
                    onFocus={(e: any) => {
                        e.target.select()
                    }}
                    onValueChange={(value) => {
                        const { floatValue } = value
                        item.qty = floatValue
                        setRefresh({})
                        megaData.executeMethodForKey(
                            `computeSummary:stockJournalItemsFooter:${section}`
                        )
                    }}
                    thousandSeparator={true}
                    variant="standard"
                />
            </Box>

            {/* price */}
            <Box className="vertical">
                <Typography variant="body2" sx={{ textAlign: 'right' }}>
                    Price
                </Typography>
                <NumberFormat
                    sx={{ maxWidth: theme.spacing(14) }}
                    autoComplete="off"
                    allowNegative={false}
                    className="right-aligned"
                    customInput={TextField}
                    decimalScale={2}
                    fixedDecimalScale={true}
                    value={item.price || 0.0}
                    onFocus={(e: any) => {
                        e.target.select()
                    }}
                    onValueChange={(value) => {
                        const { floatValue } = value
                        item.price = floatValue
                        setRefresh({})
                        megaData.executeMethodForKey(
                            `computeSummary:stockJournalItemsFooter:${section}`
                        )
                    }}
                    thousandSeparator={true}
                    variant="standard"
                />
                <Typography variant="body2" sx={{ textAlign: 'right',mt:'5px' }}>test</Typography>
            </Box>

            {/* ref no */}
            <Box className="vertical">
                <Typography variant="body2">Ref no</Typography>
                <TextField
                    sx={{ maxWidth: theme.spacing(9) }}
                    autoComplete="off"
                    onChange={(e: any) => {
                        item.lineRefNo = e.target.value
                        setRefresh({})
                    }}
                    value={item.lineRefNo || ''}
                    variant="standard"
                />
            </Box>

            {/* Remarks */}
            <Box className="vertical">
                <Typography variant="body2">Remarks</Typography>
                <TextField
                    sx={{ maxWidth: theme.spacing(10) }}
                    autoComplete="off"
                    onChange={(e: any) => {
                        item.lineRemarks = e.target.value
                        setRefresh({})
                    }}
                    value={item.lineRemarks || ''}
                    variant="standard"
                />
                <Badge badgeContent={
                    (item.serialNumbers || '')
                        .split(',')
                        .filter(Boolean).length
                }
                    color={
                        getSlNoError(item)
                            ? 'error'
                            : 'info'
                    }
                    showZero={true} sx={{ position: 'relative', top: theme.spacing(1.5), right:theme.spacing(1) }} >
                    <Button color='info' sx={{ height: theme.spacing(1), position: 'relative', }}
                        onClick={() => megaData.executeMethodForKey(`handleSerialNo:stockJournalLineItems:${section}`, { item })}
                    >Serial no</Button>
                </Badge>
            </Box>

            <Box sx={{ ml: -6.5, mt: -1, mr: 0.5 }}>
                {/* delete */}
                <IconButton
                    sx={{ position: 'relative', left: theme.spacing(1.5) }}
                    size="small"
                    color="error"
                    onClick={(e: any) => handleDeleteRow(e, item, index)}>
                    <CloseSharp />
                </IconButton>
            </Box>
        </Box>
    )

    function checkAllErrors() {
        item.isProductCodeError = item.productCode ? false : true
        allErrors.productCodeError = items.some(
            (it: any) => it.isProductCodeError
        )

        item.isProductDetailsError = item.productDetails ? false : true
        allErrors.productDetailsError = items.some(
            (it: any) => it.isProductDetailsError
        )
    }

    function clearRow(item: any) {
        item.productCode = undefined
        item.productId = undefined
        item.productDetails = undefined
        item.lineRemarks = undefined
        item.lineRefNo = undefined
        item.serialNumbers = undefined
        item.qty = 1
    }

    async function doSearchProductOnProductCode(d: any) {
        const { item, setRefresh } = d.data
        const { execGenericView } = utilMethods()
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
                item.productDetails = ''.concat(
                    result.brandName,
                    ' ',
                    result.catName,
                    ' ',
                    result.label,
                    ' ',
                    result.info
                )
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
        // if (items.length === 1) {
        //     clearRow(item)
        // } else {
            items.splice(index, 1)
            if (item.id) {
                stockJournal.deletedIds.push(item.id)
            }
        // }
        stockJournal.currentItemIndex = items.length - 1
        megaData.executeMethodForKey(
            `render:stockJournalLineItems:${section}`,
            {}
        )
        megaData.executeMethodForKey(
            `computeSummary:stockJournalItemsFooter:${section}`
        )
        megaData.executeMethodForKey('render:stockJournalCrown',{})
    }
}

function StockJournalItemsFooter({ section }: any) {
    const [, setRefresh] = useState({})
    const theme = useTheme()
    const megaData: IMegaData = useContext(MegaDataContext)
    let stockJournal = megaData.accounts.stockJournal[section]
    const items: any[] = stockJournal.items
    const { toDecimalFormat } = utilMethods()
    const { BasicMaterialDialog } = useTraceMaterialComponents()

    const meta: any = useRef({
        dialogConfig: {
            content: () => <></>,
            maxWidth: 'lg',
        },
        renderCallbackKey: `render:stockJournalItemsFooter:${section}`,
        setItemToSelectedProductCallbackKey: `setItemToSelectedProduct:stockJournalLineItems:${section}`,
        showDialog: false,
    })

    const pre = meta.current

    useEffect(() => {
        megaData.registerKeyWithMethod(
            `computeSummary:stockJournalItemsFooter:${section}`,
            computeSummary
        )
        megaData.registerKeyWithMethod(
            `render:stockJournalItemsFooter:${section}`,
            setRefresh
        )
        computeSummary()
    }, [])

    useEffect(() => {
        megaData.executeMethodForKey('render:stockJournalTotals', {})
    })

    return (
        <Box
            sx={{
                pt: 1,
                pb: 0,
                display: 'flex',
                rowGap: 1,
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between',
                '& .footer': {
                    mt: 0.1,
                    fontWeight: 'bold',
                    fontSize: theme.spacing(1.6),
                },
            }}>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-evenly',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    columnGap: 2,
                    rowGap: 3,
                }}>
                {/* Item search button */}
                <Button
                    size="small"
                    variant="contained"
                    color="secondary"
                    onClick={handleItemSearch}>
                    Item search
                </Button>
                {/* Count */}
                <Typography
                    color={theme.palette.common.black}
                    className="footer">
                    {''.concat('Count: ', stockJournal.summary.count)}
                </Typography>
                {/* Qty */}
                <Typography
                    color={theme.palette.common.black}
                    className="footer">
                    {''.concat(
                        'Qty: ',
                        toDecimalFormat(stockJournal.summary.qty)
                    )}
                </Typography>
            </Box>
            {/* clear */}
            <Button
                size="small"
                color="warning"
                variant="contained"
                onClick={handleClear}>
                Clear
            </Button>
            <BasicMaterialDialog parentMeta={meta} />
        </Box>
    )

    function computeSummary() {
        stockJournal = megaData.accounts.stockJournal[section]
        const items: any[] = stockJournal.items
        const total = items.reduce(
            (prev: any, curr: any) => {
                return { qty: (prev.qty || 0) + (curr.qty || 0) }
            },
            { qty: 0 }
        )
        total.count = items.length
        stockJournal.summary = total
        setRefresh({})
    }

    function handleClear() {
        items.length = 0
        items.push({ qty: 1 })
        stockJournal.currentItemIndex = 0
        megaData.executeMethodForKey(
            `render:stockJournalLineItems:${section}`,
            {}
        )
        setRefresh({})
    }

    function handleItemSearch() {
        pre.dialogConfig.title = 'Search from all products'
        pre.dialogConfig.content = () => <ProductsSearch parentMeta={meta} />
        pre.showDialog = true
        setRefresh({})
    }
}
