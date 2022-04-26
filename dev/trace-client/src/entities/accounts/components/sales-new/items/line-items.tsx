import { Badge, Box, Button, Card, Chip, CloseSharp, IconButton, IMegaData, NumberFormat, TextField, useTraceMaterialComponents, Typography, useContext, MegaDataContext, useRef, useState, useTheme, utilMethods, useIbuki, } from '../redirect'
import { useLineItems } from './line-items-hook'

function LineItems() {
    const theme = useTheme()
    const megaData: IMegaData = useContext(MegaDataContext)
    const sales = megaData.accounts.sales
    const { debounceEmit } = useIbuki()
    const items = sales.items
    const { extractAmount, toDecimalFormat } = utilMethods()
    const { checkAllErrors, clearRow, computeRow, getSlNoError, handleDeleteRow, handleSerialNo, meta, setPrice, setPriceGst } = useLineItems()
    const { BasicMaterialDialog } = useTraceMaterialComponents()
    checkAllErrors()

    return (<Box className='vertical' sx={{ rowGap: 1 }}>
        {
            items.map((item: any, index: number) =>
                <div key={index}>
                    <LineItem item={item} index={index} />
                </div>
            )
        }
        <BasicMaterialDialog parentMeta={meta} />
    </Box>)

    function LineItem({ item, index, }: any) {
        const [, setRefresh] = useState({})
        const smallFontTextField = megaData.accounts.settings.smallFontTextField

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
                        allowNegative={false}
                        autoComplete='off'
                        customInput={TextField}
                        decimalScale={0}
                        fixedDecimalScale={true}
                        value={item.productCode || ''}
                        variant='standard'
                        size='small'
                        onChange={(e: any) => {
                            item.productCode = e.target.value
                            setRefresh({})
                            if (item.productCode) {
                                debounceEmit('DEBOUNCE-ON-CHANGE', item)
                            } else {
                                clearRow(item)
                            }
                        }}
                        onFocus={(e: any) => {
                            e.target.select()
                        }} />
                </Box>
                {/* Product details */}
                <Card variant='outlined' sx={{ width: theme.spacing(22), height: theme.spacing(8), p: .5, pt: 0, border: '1px solid lightGrey' }}>
                    <Typography sx={{
                        fontSize: theme.spacing(1.6),
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
                    <Button color='secondary' size='medium' variant='outlined' onClick={() => handleSerialNo(item)}>Serial no</Button>
                </Badge>

                {/* amount */}
                <Typography variant='body2' sx={{ ml: 'auto', textAlign: 'right', color: theme.palette.common.black, fontWeight: 'bolder' }} >{toDecimalFormat(item.amount || 0.00)}</Typography>
                <Box sx={{ ml: -6.5, mt: -8, mr: 0.5 }}>
                    {/* delete */}
                    <IconButton sx={{ position: 'relative', left: theme.spacing(1.5), }} size='small' color='error'
                        onClick={() => handleDeleteRow(item, index)}>
                        <CloseSharp />
                    </IconButton>
                </Box>
            </Box >
        )

        function handleTextChanged(item: any, propName: string, e: any) {
            item[propName] = e.target.value
            setRefresh({})
        }
    }
}

export { LineItems }