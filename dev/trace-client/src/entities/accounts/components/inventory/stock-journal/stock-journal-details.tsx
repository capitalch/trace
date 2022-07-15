import {
    _,
    AddCircle,
    Box,
    Button,
    Card,
    CloseSharp,
    IconButton,
    IMegaData,
    MegaDataContext,
    NumberFormat,
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

function StockJournalDetails() {
    return (
        <Box
            sx={{
                display: 'flex',
                rowGap: 2,
                columnGap: 2,
                mt: 1,
                flexWrap: 'wrap',
            }}>
            <StockJournalItems type="source" />
            {/* <StockJournalItem type="destination" /> */}
        </Box>
    )
}

export { StockJournalDetails }

function StockJournalItems({ type }: any) {
    const theme = useTheme()
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
            <StockJournalItemsHeader type={type} />
            <StockJournalLineItems />
            <StockJournalItemsFooter />
        </Box>
    )
}

function StockJournalItemsHeader({ type }: any) {
    const theme = useTheme()
    const megaData: IMegaData = useContext(MegaDataContext)
    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
            }}>
            <Typography
                variant="body1"
                sx={{ fontWeight: 'bold', textDecoration: 'underline' }}>
                {type === 'source'
                    ? 'Source (Consumption / input)'
                    : 'Destination (Production / output)'}
            </Typography>

            {/* Add */}
            <Button
                size="small"
                variant="contained"
                color="secondary"
                sx={{ width: theme.spacing(12.5) }}
                onClick={() =>
                    megaData.executeMethodForKey(
                        'handleAddItem:stockJournalLineItems'
                    )
                }
                startIcon={<AddCircle sx={{ ml: -3 }} />}>
                Add
            </Button>
        </Box>
    )
}

function StockJournalLineItems() {
    const [, setRefresh] = useState({})
    const theme = useTheme()
    const megaData: IMegaData = useContext(MegaDataContext)
    const stockJournal = megaData.accounts.stockJournal
    const items: any[] = stockJournal.items
    const allErrors = stockJournal.allErrors

    useEffect(() => {
        megaData.registerKeyWithMethod(
            'handleAddItem:stockJournalLineItems',
            handleAddItem
        )
        megaData.registerKeyWithMethod(
            'render:stockJournalLineItems',
            setRefresh
        )
        stockJournal.currentItemIndex = 0
    }, [])

    return (
        <Box className="vertical" sx={{ rowGap: 1 }}>
            {items.map((item: any, index: number) => (
                <StockJournalLineItem item={item} index={index} key={index} />
            ))}
        </Box>
    )

    function handleAddItem() {
        items.push({ qty: 1 })
        stockJournal.currentItemIndex = items.length - 1
        setRefresh({})
        // megaData.executeMethodForKey('render:stockJournalLineItems',{})
        megaData.executeMethodForKey('computeSummary:stockJournalItemsFooter')
    }

}

function StockJournalLineItem({ item, index }: any) {
    const theme = useTheme()
    const [, setRefresh] = useState({})
    const { debounceEmit, debounceFilterOn, emit } = useIbuki()

    const megaData: IMegaData = useContext(MegaDataContext)
    const stockJournal = megaData.accounts.stockJournal
    const items: any[] = stockJournal.items
    const allErrors = stockJournal.allErrors

    checkAllErrors()

    useEffect(() => {
        const subs1 = debounceFilterOn(
            'DEBOUNCE-ON-CHANGE',
            1500
        ).subscribe(doSearchProductOnProductCode)
        return () => {
            subs1.unsubscribe()
        }
    }, [])

    return (
        <Box
            onClick={(e: any) => {                
                if (stockJournal.currentItemIndex !== index) {
                    stockJournal.currentItemIndex = index
                    megaData.executeMethodForKey(
                        'render:stockJournalLineItems',
                        {}
                    )
                }
            }}
            sx={{
                display: 'flex',
                alignItems: 'center',
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
                    // inputRef={pre.productCodeRef}
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
                    width: theme.spacing(22),
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
                    sx={{ maxWidth: theme.spacing(10) }}
                    autoComplete="off"
                    allowNegative={false}
                    className="right-aligned"
                    customInput={TextField}
                    decimalScale={2}
                    // error={item.isQtyError}
                    fixedDecimalScale={true}
                    value={item.qty || 1.0}
                    onFocus={(e: any) => {
                        e.target.select()
                    }}
                    
                    // onClick={(e: any) => {
                    //     e.stopPropagation()
                    //     if(stockJournal.currentItemIndex !== index){
                    //         stockJournal.currentItemIndex = index
                    //         megaData.executeMethodForKey(
                    //             'render:stockJournalLineItems',
                    //             {}
                    //         )
                    //         e.target.focus()
                    //     }
                        
                    // }}
                    onValueChange={(value) => {
                        const { floatValue } = value
                        item.qty = floatValue
                        setRefresh({})
                        megaData.executeMethodForKey(
                            'computeSummary:stockJournalItemsFooter'
                        )
                    }}
                    thousandSeparator={true}
                    variant="standard"
                />
            </Box>

            {/* Remarks */}
            <Box className="vertical">
                <Typography variant="body2">Remarks</Typography>
                <TextField
                    sx={{ maxWidth: theme.spacing(40) }}
                    autoComplete="off"
                    onChange={(e: any) => (item.remarks = e.target.value)}
                    value={item.remarks || undefined}
                    // onFocus={(e: any) => {
                    //     e.target.select()
                    // }}
                    variant="standard"
                />
            </Box>

            <Box sx={{ ml: -6.5, mt: -4, mr: 0.5 }}>
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
        item.remarks = undefined
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

    function handleDeleteRow(e: any, item: any, index: number) {
        e.stopPropagation() // necessary to prevent the firing of Box click event. Box is the parent. Click event of the box is for setting focus
        if (items.length === 1) {
            clearRow(item)
        } else {
            items.splice(index, 1)
            if (item.id) {
                // sales.deletedSalePurchaseIds.push(item.id)
            }
        }
        stockJournal.currentItemIndex = items.length - 1
        megaData.executeMethodForKey('render:stockJournalLineItems', {})
        megaData.executeMethodForKey(
            'computeSummary:stockJournalItemsFooter'
        )
    }
}

function StockJournalItemsFooter() {
    const [, setRefresh] = useState({})
    const theme = useTheme()
    const megaData: IMegaData = useContext(MegaDataContext)
    const stockJournal = megaData.accounts.stockJournal
    const items: any[] = stockJournal.items
    const { emit } = useIbuki()
    const { toDecimalFormat } = utilMethods()
    const { BasicMaterialDialog } = useTraceMaterialComponents()
    const meta: any = useRef({
        showDialog: false,
        dialogConfig: {
            content: () => <></>,
            maxWidth: 'lg',
        },
    })
    const pre = meta.current

    useEffect(() => {
        megaData.registerKeyWithMethod(
            'computeSummary:stockJournalItemsFooter',
            computeSummary
        )
        computeSummary()
    }, [])

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
                    // onClick={handleItemSearch}
                >
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
        </Box>
    )

    function computeSummary() {
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
        megaData.executeMethodForKey('render:stockJournalLineItems', {})
        setRefresh({})
    }
}
