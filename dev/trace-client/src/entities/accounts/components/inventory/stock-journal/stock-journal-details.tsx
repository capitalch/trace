import {
    AddCircle,
    Box,
    Button,
    Card,
    IMegaData,
    MegaDataContext,
    NumberFormat,
    TextField,
    Typography,
    useContext,
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
            <StockJournalItem type="source" />
            {/* <StockJournalItem type="destination" /> */}
        </Box>
    )
}

export { StockJournalDetails }

function StockJournalItem({ type }: any) {
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
            <StockJournalItemHeader type={type} />
            <StockJournalLineItems />
            <StockJournalItemFooter />
        </Box>
    )
}

function StockJournalItemHeader({ type }: any) {
    const theme = useTheme()
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
                    ? 'Source ( Consumption )'
                    : 'Destination ( Production )'}
            </Typography>

            {/* Add */}
            <Button
                size="small"
                variant="contained"
                color="secondary"
                sx={{ width: theme.spacing(12.5) }}
                // onClick={() => handleAddItem()}
                startIcon={<AddCircle sx={{ ml: -3 }} />}>
                Add
            </Button>
        </Box>
    )
}

function StockJournalLineItems() {
    const theme = useTheme()
    const megaData: IMegaData = useContext(MegaDataContext)
    const stockJournal = megaData.accounts.stockJournal
    const items: any[] = stockJournal.items
    const allErrors = stockJournal.allErrors

    return (
        <Box className="vertical" sx={{ rowGap: 1 }}>
            {items.map((item: any, index: number) => (
                <StockJournalLineItem item={item} index={index} key={index} />
            ))}
        </Box>
    )

    function StockJournalLineItem({ item, index }: any) {
        const theme = useTheme()
        const [, setRefresh] = useState({})
        checkAllErrors()
        return (
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    rowGap: 2,
                    columnGap: 2,
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
                                // debounceEmit('DEBOUNCE-ON-CHANGE', { item, setRefresh })
                            } else {
                                // clearRow(item)
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
                        // InputProps={smallFontTextField}
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
                            // computeRow(item)
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
            </Box>
        )

        function checkAllErrors() {
            item.isProductCodeError = item.productCode ? false : true
            allErrors.productCodeError = items.some(
                (it: any) => it.isProductCodeError
            )
            // allErrors.productCodeError = item.isProductCodeError ? errorMessages.productCodeError : ''

            item.isProductDetailsError = item.productDetails ? false : true
            // allErrors.productDetailsError = item.isProductDetailsError ? errorMessages.productDetailsError : ''
            allErrors.productDetailsError = items.some(
                (it: any) => it.isProductDetailsError
            )
        }
    }
}

function StockJournalItemFooter() {
    const [, setRefresh] = useState({})
    const theme = useTheme()
    const megaData: IMegaData = useContext(MegaDataContext)
    const stockJournal = megaData.accounts.stockJournal
    const items = stockJournal.items

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
                    {''.concat('Count: ', items.length)}
                </Typography>
                {/* Qty */}
                <Typography
                    color={theme.palette.common.black}
                    className="footer">
                    {''.concat('Qty: ', toDecimalFormat('10'))}
                </Typography>
            </Box>
        </Box>
    )
}
