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
    useState,
    useTheme,
} from '../../redirect'

function StockJournalItems() {
    return (
        <Box
            sx={{
                display: 'flex',
                rowGap: 2,
                columnGap: 2,
                mt: 4,
                flexWrap: 'wrap',
            }}>
            <StockJournalItem type="source" />
            {/* <StockJournalItem type="destination" /> */}
        </Box>
    )
}

export { StockJournalItems }

function StockJournalItem({ type }: any) {
    const theme = useTheme()

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                rowGap: 2,
                columnGap: 2,
                // minWidth: theme.spacing(30),
            }}>
            <StockJournalItemHeader type={type} />
            <StockJournalLineItems />
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
                // border: '1px solid lightGrey',
            }}>
            <Typography variant="subtitle2">
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
}

function StockJournalLineItem({ item, index }: any) {
    const theme = useTheme()
    const [, setRefresh] = useState({})
    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                rowGap: 3,
                columnGap: 2,
            }}>
            {/* Index */}
            <Typography
                variant="body2"
                sx={{
                    mt: 1,
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
                <Typography variant="body2">Qty</Typography>
                <NumberFormat
                    sx={{ maxWidth: theme.spacing(8) }}
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
                    // value={item.qty || 1.0}
                    // onFocus={(e: any) => {
                    //     e.target.select()
                    // }}
                    variant="standard"
                />
            </Box>
        </Box>
    )
}
