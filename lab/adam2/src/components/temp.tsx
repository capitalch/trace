import { Badge, Box, Button, Card, Chip, CloseSharp, FormControlLabel, getKey, IconButton, MegaDataContext, NumberFormat, Radio, RadioGroup, TextField, Typography, useContext, useState, useTheme } from './redirect'

function AccSalesProducts() {
    const [, setRefresh] = useState({})
    const theme = useTheme()
    const megaData = useContext(MegaDataContext)
    const sales = megaData.accounts.sales
    const products = sales.products || []
    if (products.length === 0) {
        products.push({ productDetails: 'hjhjj jhjhj hjhjjh jhjhj hhjhj jhjh hj jhjhyuyer qe evbvb qe cqfhjfqk This is but the maximum last line. But this is nnnot to be shown in any manner' })
    }

    const items: any[] = products.map((item: any, index: any) => {
        return (
            <Box key={index} className='vertical' sx={{ flex: 2, p: 1, pl: 0, }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant='subtitle1'>Products</Typography>
                    <Button size='small' sx={{ height: theme.spacing(3), color: theme.palette.lightBlue.main }} onClick={handleAdd}>Add</Button>
                </Box>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', columnGap: 1.5, rowGap: 2, p: 3, border: '1px solid lightGrey', alignItems: 'center' }}>
                    <Box className='vertical' sx={{ width: theme.spacing(5) }}>
                        <Typography variant='caption' sx={{ mt: -1.5 }}>#</Typography>
                        <Typography variant='body2' sx={{ mt: 1, textDecoration: 'underline', fontSize: theme.spacing(1) }} color={theme.palette.blue.main}>{index + 1}</Typography>
                    </Box>
                    {/* Product search */}
                    <Box className='vertical' >
                        <Typography variant='caption'>Product search</Typography>
                        <TextField
                            autoComplete='off'
                            variant='standard'
                            // label='Product search'
                            value={item.productSearch || ''}
                            onChange={(e: any) => handleTextChanged(item, 'productSearch', e)} />
                    </Box>
                    {/* Upc */}
                    <Box className='vertical'>
                        <Typography variant='caption'>Upc</Typography>
                        <TextField
                            autoComplete='off'
                            sx={{ maxWidth: theme.spacing(13), }}
                            variant='standard'
                            // label='Upc'
                            value={item.upc || ''}
                            onChange={(e: any) => handleTextChanged(item, 'upc', e)} />
                    </Box>
                    {/* Product code */}
                    <Box className='vertical'>
                        <Typography variant='caption'>Product code</Typography>
                        <TextField
                            autoComplete='off'
                            onFocus={(e: any) => {
                                e.target.select()
                            }}
                            className='right-aligned'
                            sx={{ maxWidth: theme.spacing(13) }}
                            variant='standard'
                            // label='Product code'
                            value={item.productCode || 0}
                            onChange={(e: any) => handleTextChanged(item, 'productCode', e)} />
                    </Box>
                    {/* Hsn */}
                    <Box className='vertical'>
                        <Typography variant='caption'>Hsn</Typography>
                        <TextField
                            autoComplete='off'
                            className='right-aligned'
                            onFocus={(e: any) => {
                                e.target.select()
                            }}
                            sx={{ maxWidth: theme.spacing(8) }}
                            variant='standard'
                            // label='Hsn'
                            value={sales.hsn}
                            onChange={(e: any) => {
                                // handleTextChanged(item, 'hsn', e)
                                sales.hsn = e.target.value
                                setRefresh({})
                            }
                            } />
                    </Box>
                    {/* Gst(%) */}
                    <Box className='vertical'>
                        <Typography sx={{ textAlign: 'right' }} variant='caption'>Gst(%)</Typography>
                        <NumberFormat sx={{ maxWidth: theme.spacing(7) }}
                            allowNegative={false}
                            autoComplete='off'
                            className='right-aligned'
                            customInput={TextField}
                            decimalScale={2}
                            fixedDecimalScale={true}
                            // label='Gst(%)'
                            value={item.gstRate || 0.00}
                            variant='standard'
                            onFocus={(e: any) => {
                                e.target.select()
                            }} />
                    </Box>
                    {/* Qty */}
                    <Box className='vertical'>
                        <Typography sx={{ textAlign: 'right' }} variant='caption'>Qty</Typography>
                        <NumberFormat sx={{ maxWidth: theme.spacing(10) }}
                            autoComplete='off'
                            allowNegative={false}
                            className='right-aligned'
                            customInput={TextField}
                            decimalScale={2}
                            fixedDecimalScale={true}
                            // label='Qty'
                            value={item.qty || 1.00}
                            onFocus={(e: any) => {
                                e.target.select()
                            }}
                            variant='standard' />
                    </Box>
                    {/* Price */}
                    <Box className='vertical'>
                        <Typography sx={{ textAlign: 'right' }} variant='caption'>Price</Typography>
                        <NumberFormat sx={{ maxWidth: theme.spacing(13) }}
                            autoComplete='off'
                            allowNegative={false}
                            className='right-aligned'
                            customInput={TextField}
                            decimalScale={2}
                            fixedDecimalScale={true}
                            // label='Price'
                            value={item.price || 0.00}
                            onFocus={(e: any) => {
                                e.target.select()
                            }}
                            variant='standard' />
                    </Box>
                    {/* Price(Gst) */}
                    <Box className='vertical'>
                        <Typography sx={{ textAlign: 'right' }} variant='caption'>Price(Gst)</Typography>
                        <NumberFormat sx={{ maxWidth: theme.spacing(13) }}
                            autoComplete='off'
                            allowNegative={false}
                            className='right-aligned'
                            customInput={TextField}
                            decimalScale={2}
                            fixedDecimalScale={true}
                            value={item.priceGst || 0.00}
                            // label='Price(Gst)'
                            onFocus={(e: any) => {
                                e.target.select()
                            }}
                            variant='standard' />
                    </Box>
                    {/* Discount(unit) */}
                    <Box className='vertical'>
                        <Typography sx={{ textAlign: 'right' }} variant='caption'>Discount(unit)</Typography>
                        <NumberFormat sx={{ maxWidth: theme.spacing(13) }}
                            autoComplete='off'
                            allowNegative={false}
                            className='right-aligned'
                            customInput={TextField}
                            decimalScale={2}
                            fixedDecimalScale={true}
                            // label='Discount(unit)'
                            value={item.discount || 0.00}
                            onFocus={(e: any) => {
                                e.target.select()
                            }}
                            variant='standard' />
                    </Box>
                    {/* Remarks */}
                    <Box className='vertical' >
                        <Typography variant='caption'>Remarks</Typography>
                        <TextField
                            autoComplete='off'
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
                        // color={
                        //     getSlNoError(item)
                        //         ? 'error'
                        //         : 'secondary'
                        // }
                        showZero={true}>
                        <Chip
                            sx={{ p: 2 }}
                            size="small"
                            label="Serial no's"
                            color="info"
                            onClick={() => handleSerialNo(item)}
                        />
                    </Badge>

                    {/* Product details */}
                    <Card variant='outlined' sx={{ ml: 'auto', maxWidth: theme.spacing(20), maxHeight: theme.spacing(8), p: 1, backgroundColor: theme.palette.grey[200] }}>
                        <Typography sx={{
                            fontWeight: 'bold', overflow: 'hidden', color: theme.palette.primary.dark,
                        }} variant='caption'>{item.productDetails || ''}</Typography>
                    </Card>
                    {/* Gst */}
                    <Card variant='outlined' className='vertical' sx={{ textAlign: 'right', p: 1, backgroundColor: theme.palette.grey[200] }} >
                        <Typography fontWeight='bold' variant='caption'>{''.concat('Cgst: ', item.cgst || 0.00)}</Typography>
                        <Typography fontWeight='bold' variant='caption'>{''.concat('Sgst: ', item.sgst || 0.00)}</Typography>
                        <Typography fontWeight='bold' variant='caption'>{''.concat('Igst: ', item.igst || 0.00)}</Typography>
                    </Card>
                    {/* amount */}
                    <Card variant='outlined' className='vertical' sx={{ p: 1, backgroundColor: theme.palette.grey[200] }} >
                        <Typography variant='subtitle1' sx={{ textAlign: 'right', }}>Amount</Typography>
                        <Typography variant='h6' sx={{ textAlign: 'right', color: theme.palette.lightBlue.main }} >{item.amount || 12345.00}</Typography>
                    </Card>
                </Box>
            </Box>
        )
    })
    return (<>{items}</>)

    function handleAdd() {
        products.push({})
        setRefresh({})
    }
    function handleTextChanged(item: any, propName: string, e: any) {
        item[propName] = e.target.value
        setRefresh({})
    }

    function handleSerialNo(item: any) {

    }
}

export { AccSalesProducts }