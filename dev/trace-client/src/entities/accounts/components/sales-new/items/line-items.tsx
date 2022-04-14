import { Badge, Box, Card, Chip, CloseSharp, IconButton, NumberFormat, TextField, Typography, useContext, MegaDataContext, useState, useTheme, utilMethods, } from '../redirect'
import { useLineItems } from './line-items-hook'

function LineItems() {
    // const [, setRefresh] = useState({})
    const theme = useTheme()
    const megaData = useContext(MegaDataContext)
    const sales = megaData.accounts.sales
    const items = sales.products

    const { extractAmount, toDecimalFormat } = utilMethods()
    const { computeRow, handleDeleteRow, handleSerialNo, setPrice, setPriceGst } = useLineItems()

    return (<Box className='vertical' sx={{ rowGap: 1 }}>
        {
            items.map((item: any, index: number) =>
                <div key={index}>
                    <LineItem item={item} index={index} />
                </div>
            )
        }
    </Box>)

    function LineItem({ item, index, }: any) {
        const [, setRefresh] = useState({})
        const smallFontTextField = megaData.accounts.settings.smallFontTextField
        return (
            <Box sx={{ display: 'flex', alignItems: 'center', border: '1px solid lightGrey', flexWrap: 'wrap', p: 2, rowGap: 2, columnGap: 2 }}>
                {/* Index */}
                <Box className='vertical' sx={{ width: theme.spacing(3) }}>
                    {/* Delete
                    <IconButton sx={{ ml: -2, mt: -1 }} size='small' color='error'
                        onClick={() => handleDeleteRow(index)}>
                        <CloseSharp />
                    </IconButton> */}
                    <Typography variant='body2' sx={{ mt: 1, textDecoration: 'underline', fontSize: theme.spacing(1.5) }} color={theme.palette.secondary.main}>{index + 1}</Typography>
                </Box>
                {/* Product code */}
                <Box className='vertical'>
                    <Typography variant='body2'>Product code</Typography>
                    <NumberFormat sx={{ maxWidth: theme.spacing(8) }}
                        allowNegative={false}
                        autoComplete='off'
                        InputProps={smallFontTextField}
                        className='right-aligned'
                        customInput={TextField}
                        decimalScale={0}
                        fixedDecimalScale={true}
                        value={item.productCode || 0.00}
                        variant='standard'
                        onChange={(e: any) => handleTextChanged(item, 'productCode', e)}
                        onFocus={(e: any) => {
                            e.target.select()
                        }} />
                </Box>
                {/* Product details */}
                <Card variant='outlined' sx={{ width: theme.spacing(20), height: theme.spacing(8), p: .5, pt: 0, backgroundColor: theme.palette.grey[100] }}>
                    <Typography sx={{
                        fontSize: theme.spacing(1.6),
                        fontWeight: 'bold', overflow: 'hidden', color: theme.palette.primary.dark,
                    }} variant='caption'>{item.productDetails || 'hgjg hggh hgh hg hjg'}</Typography>
                </Card>
                {/* Hsn */}
                <Box className='vertical'>
                    <Typography sx={{ textAlign: 'right' }} variant='body2'>Hsn</Typography>
                    <NumberFormat sx={{ maxWidth: theme.spacing(8) }}
                        allowNegative={false}
                        autoComplete='off'
                        InputProps={smallFontTextField}
                        className='right-aligned'
                        customInput={TextField}
                        decimalScale={0}
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
                    <NumberFormat sx={{ maxWidth: theme.spacing(5) }}
                        allowNegative={false}
                        autoComplete='off'
                        InputProps={smallFontTextField}
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
                    <Typography sx={{ textAlign: 'right' }} variant='body2'>Qty</Typography>
                    <NumberFormat sx={{ maxWidth: theme.spacing(8) }}
                        autoComplete='off'
                        allowNegative={false}
                        InputProps={smallFontTextField}
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
                    <NumberFormat style={{ maxWidth: theme.spacing(11) }}
                        autoComplete='off'
                        allowNegative={false}
                        InputProps={smallFontTextField}
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
                    <NumberFormat sx={{ maxWidth: theme.spacing(11), }}
                        autoComplete='off'
                        allowNegative={false}
                        InputProps={smallFontTextField}
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
                        variant='standard' />
                </Box>
                {/* Discount(unit) */}
                <Box className='vertical'>
                    <Typography sx={{ textAlign: 'right' }} variant='body2'>Disc(unit)</Typography>
                    <NumberFormat style={{ maxWidth: theme.spacing(8) }}
                        autoComplete='off'
                        allowNegative={false}
                        InputProps={smallFontTextField}
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
                        InputProps={smallFontTextField}
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
                    // color={
                    //     getSlNoError(item)
                    //         ? 'error'
                    //         : 'secondary'
                    // }
                    showZero={true}>
                    <Chip color='secondary'
                        sx={{ p: 2, color: theme.palette.common.white }}
                        size="small"
                        label="Serial no's"
                        onClick={() => handleSerialNo(item)}
                    />
                </Badge>
                {/* <Box sx={{ display: 'flex', flexDirection: 'column', ml: 'auto', alignItems: 'flex-end' }}> */}
                {/* sx={{ mt:-4, mr:-3.0 }}  */}

                {/* amount */}
                <Card variant='outlined' className='vertical' sx={{ ml: 'auto', mr:-1, p: 1, backgroundColor: theme.palette.grey[100] }} >
                    <Typography variant='caption' sx={{ textAlign: 'right', color: theme.palette.common.black, fontWeight: 'bolder' }} >{toDecimalFormat(item.amount || 0.00)}</Typography>
                </Card>
                {/* Delete */}
                <IconButton size='small' color='error' sx={{mr:-2}}
                    onClick={() => handleDeleteRow(index)}>
                    <CloseSharp />
                </IconButton>
                {/* </Box> */}
            </Box>)

        function handleTextChanged(item: any, propName: string, e: any) {
            item[propName] = e.target.value
            setRefresh({})
        }
    }
}

export { LineItems }

// Product search
// <Box className='vertical' >
//     <Typography variant='body2'>Product search</Typography>
//     <TextField
//         autoComplete='off'
//         variant='standard'
//         value={item.productSearch || ''}
//         onChange={(e: any) => handleTextChanged(item, 'productSearch', e)}
//         InputProps={{
//             endAdornment: (
//                 <InputAdornment position="end">
//                     <IconButton
//                         size="large"
//                         color='secondary'
//                         onClick={(e: any) => {
//                         }}>
//                         <Search />
//                     </IconButton>
//                 </InputAdornment>
//             ), ...smallFontTextField
//         }}
//     />
// </Box> */}
// Upc
// <Box className='vertical'>
//     <Typography variant='caption'>Upc</Typography>
//     <TextField
//         autoComplete='off'
//         sx={{ maxWidth: theme.spacing(13), }}
//         variant='standard'
//         value={item.upc || ''}
//         onChange={(e: any) => handleTextChanged(item, 'upc', e)} />
// </Box>