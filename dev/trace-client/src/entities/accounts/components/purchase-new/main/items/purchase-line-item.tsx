import { AddCircle, ClearAll, CloseSharp, Search } from "@mui/icons-material"
import { Badge, Box, Button, Card, IconButton, TextField, Typography, useTheme } from "@mui/material"
import NumberFormat from "react-number-format"
import { utilMethods } from "../../../inventory/redirect"
import { usePurchaseLineItem } from "./purchase-line-item-hook"
import { PurchaseLineItemType, PurchaseStore } from "../../purchase-store"

function PurchaseLineItem({ item, index }: { item: PurchaseLineItemType, index: number }) {
    const theme = useTheme()
    const { doSearchOnProductCodeOrUpc, handleSerialNumber, meta } = usePurchaseLineItem(item)
    const { extractAmount, toDecimalFormat } = utilMethods()
    const errorsObject = PurchaseStore.errorsObject
    // Container box
    return (<Box sx={{
        display: 'flex', alignItems: 'center', borderBottom: '1px solid lightGrey', mt: 1,
        flexWrap: 'wrap', rowGap: 3, columnGap: 1.5
    }}>

        <Box display='flex' flexDirection='column'>
            {/* Search */}
            <IconButton sx={{ ml: -2, mt: -2 }} size="medium" color='secondary'
            // onClick={(e: any) => handleDeleteItem(e, item, index)}
            >
                <Search />
            </IconButton>
            {/* Index */}
            <Typography variant='body2' sx={{ textDecoration: 'underline', fontSize: theme.spacing(1.5) }} color={theme.palette.secondary.main}>{index + 1}</Typography>
        </Box>

        {/* Product code or UPC search */}
        <Box className='vertical' >
            <Typography variant='body2'>Prod code / UPC</Typography>
            <TextField
                autoComplete='off'
                sx={{ maxWidth: theme.spacing(12) }}
                variant='standard'
                value={item.productCodeOrUpc.value || ''}
                // value={meta.current.productCodeOrUpc || ''}
                onChange={(e: any) => {
                    item.productCodeOrUpc.value = e.target.value
                    // meta.current.productCodeOrUpc = e.target.value
                }}
                onBlur={(e: any) => {
                    // if(item.productCodeOrUpc.value !== e.target.value) {
                    doSearchOnProductCodeOrUpc(e.target.value)
                    // }
                }}
            />
            <Box display='flex'>
                <Typography
                    width='6rem'
                    variant='body2'
                    fontWeight='bolder'
                    color={Boolean(errorsObject.productCodeError(item)) ? theme.palette.error.light : theme.palette.success.main}
                    mt={1}>{item.productCode.value || 'Product code'}</Typography>
                <IconButton color="info"
                    sx={{ mt: .8, height: '1.3rem', width: '1.3rem' }}
                    size="small"
                    onClick={() => {
                        PurchaseStore.main.functions.clearLineItem(item)
                    }}>
                    <ClearAll className="clear-icon" />
                </IconButton>
            </Box>
        </Box>

        {/* Product details */}
        <Card variant='outlined' sx={{
            width: theme.spacing(26), height: theme.spacing(8),
            p: .5,
            pt: 0,
            border: '1px solid lightGrey',
            borderColor: Boolean(errorsObject.productDetailsError(item)) ? theme.palette.error.light : 'lightGrey'
        }}>
            <Typography sx={{
                fontSize: theme.spacing(1.8),
                fontWeight: 'bold', overflow: 'hidden', color: theme.palette.common.black,
            }} variant='body1'>{item.productDetails || ''}</Typography>
        </Card>

        {/* Hsn */}
        <Box>
            <Typography sx={{ textAlign: 'right' }} variant='body2'>Hsn</Typography>
            <NumberFormat sx={{ maxWidth: theme.spacing(10) }}
                allowNegative={false}
                autoComplete='off'
                className='right-aligned'
                customInput={TextField}
                decimalScale={0}
                error={Boolean(errorsObject.hsnError(item))}
                fixedDecimalScale={true}
                value={item.hsn.value || 0}
                variant='standard'
                onChange={(e: any) => {
                    item.hsn.value = e.target.value
                }}
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
                error={Boolean(errorsObject.gstRateError(item))}
                className='right-aligned'
                customInput={TextField}
                decimalScale={2}
                fixedDecimalScale={true}
                value={item.gstRate.value || 0.00}
                variant='standard'
                onFocus={(e: any) => {
                    e.target.select()
                }}
                onValueChange={(values: any) => {
                    const { floatValue } = values
                    item.gstRate.value = floatValue || 0.0
                    PurchaseStore.main.functions.computeRow(item)
                    PurchaseStore.main.functions.computeSummary()
                }} />
        </Box>

        {/* Qty */}
        <Box className='vertical'>
            <Typography sx={{ textAlign: 'right' }} variant='body2'>Qty</Typography>
            <NumberFormat sx={{ maxWidth: theme.spacing(8) }}
                autoComplete='off'
                allowNegative={false}
                className='right-aligned'
                customInput={TextField}
                error={Boolean(errorsObject.qtyError(item))}
                decimalScale={2}
                fixedDecimalScale={true}
                value={item.qty.value}
                onFocus={(e: any) => {
                    e.target.select()
                }}
                onValueChange={(value) => {
                    const { floatValue } = value
                    item.qty.value = floatValue || 0
                    PurchaseStore.main.functions.computeRow(item)
                    PurchaseStore.main.functions.computeSummary()
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
                className='right-aligned'
                customInput={TextField}
                decimalScale={2}
                fixedDecimalScale={true}
                value={item.price.value || 0.00}
                onChange={(e: any) => {
                    item.price.value = +extractAmount(e.target.value) || 0.0
                    PurchaseStore.main.functions.setPriceGst(item)
                    PurchaseStore.main.functions.computeRow(item)
                    PurchaseStore.main.functions.computeSummary()
                }}
                onFocus={(e: any) => {
                    e.target.select()
                }}
                thousandSeparator={true}
                variant='standard' />
        </Box>

        {/* Discount(unit) */}
        <Box className='vertical'>
            <Typography sx={{ textAlign: 'right' }} variant='body2'>Disc(unit)</Typography>
            <NumberFormat style={{ maxWidth: theme.spacing(10) }}
                autoComplete='off'
                allowNegative={false}
                className='right-aligned'
                customInput={TextField}
                decimalScale={2}
                fixedDecimalScale={true}
                value={item.discount.value || 0.00}
                onFocus={(e: any) => {
                    e.target.select()
                }}
                onValueChange={(values: any) => {
                    const { floatValue } = values
                    item.discount.value = floatValue || 0.0
                    PurchaseStore.main.functions.computeRow(item)
                    PurchaseStore.main.functions.computeSummary()
                }}
                variant='standard' />
        </Box>

        {/* Price(Gst) */}
        <Box className='vertical'>
            <Typography sx={{ textAlign: 'right' }} variant='body2'>Price(Gst)</Typography>
            <NumberFormat sx={{ maxWidth: theme.spacing(13) }}
                autoComplete='off'
                allowNegative={false}
                className='right-aligned'
                customInput={TextField}
                decimalScale={2}
                fixedDecimalScale={true}
                value={item.priceGst.value || 0.00}
                onFocus={(e: any) => {
                    e.target.select()
                }}
                onChange={(e: any) => {
                    item.priceGst.value = +extractAmount(e.target.value) || 0.0
                    PurchaseStore.main.functions.setPrice(item)
                    PurchaseStore.main.functions.computeRow(item)
                    PurchaseStore.main.functions.computeSummary()
                }}
                thousandSeparator={true}
                variant='standard'
            />
        </Box>

        {/* Sub total */}
        <Box className="vertical">
            <Typography sx={{ textAlign: 'right' }} bgcolor={theme.palette.grey[200]} variant='body2'>Sub total</Typography>
            <NumberFormat sx={{ maxWidth: theme.spacing(13), bgcolor: theme.palette.grey[200] }}
                autoComplete='off'
                readOnly={true}
                allowNegative={false}
                className='right-aligned'
                customInput={TextField}
                decimalScale={2}
                fixedDecimalScale={true}
                value={item.subTotal.value || 0.00}
                thousandSeparator={true}
                variant='standard'
            />
        </Box>

        {/* Cgst, Sgst, igst */}
        <Box className="vertical" width={theme.spacing(10)} ml={1} bgcolor={theme.palette.grey[200]} >
            <Box display='flex'>
                <Typography component='span' variant="caption">Cg:</Typography>
                <Typography component='span' width={theme.spacing(6)} textAlign='right' variant="caption">{toDecimalFormat(item.cgst.value)}</Typography>
            </Box>
            <Box display='flex'>
                <Typography component='span' variant="caption">Sg:</Typography>
                <Typography component='span' width={theme.spacing(6)} textAlign='right' variant="caption">{toDecimalFormat(item.sgst.value)}</Typography>
            </Box>
            <Box display='flex'>
                <Typography component='span' variant="caption">Ig:</Typography>
                <Typography component='span' width={theme.spacing(6.5)} textAlign='right' variant="caption">{toDecimalFormat(item.igst.value)}</Typography>
            </Box>
        </Box>

        {/* Remarks  ser no*/}
        <Box className='vertical' >
            <Box display='flex'>
                <Typography variant='body2'>Remarks</Typography>
                <Badge
                    badgeContent={
                        (item.serialNumbers.value || '')
                            .split(',')
                            .filter(Boolean).length
                    }
                    // color={
                    //     getSlNoError(item)
                    //         ? 'error'
                    //         : 'secondary'
                    // }

                    showZero={true}>
                    <Button color="info" variant='text' sx={{ width: theme.spacing(9), height: 22, fontWeight: 'bold', }} onClick={() => {
                        handleSerialNumber(item)
                        // megaData.executeMethodForKey('handleSerialNo:lineItems', { item })
                    }}>Ser No</Button>
                </Badge>
            </Box>
            <TextField
                autoComplete='off'
                sx={{ maxWidth: theme.spacing(16) }}
                variant='standard'
                value={item.remarks.value || ''}
                onChange={(e: any) => { item.remarks.value = e.target.value }}
            // onChange={(e: any) => handleTextChanged(item, 'remarks', e)} 
            />
        </Box>

        <Box display='flex' flexDirection='column' marginLeft='auto'>
            <Box display='flex' alignItems='center' >
                {/* Amount */}
                <Typography variant='body1' sx={{ textAlign: 'right', width: theme.spacing(12), color: theme.palette.common.black, fontWeight: 'bolder' }} >
                    {toDecimalFormat(item.amount.value || 0.00)}</Typography>
                {/* Add button */}
                <IconButton
                    sx={{ height: '2.3rem', width: '2.3rem', ml: 1 }}
                    className="add-box"
                    aria-label="add"
                    size="small"
                    onClick={() => PurchaseStore.main.functions.addLineItem(index)} >
                    <AddCircle sx={{ fontSize: '2.5rem', color: theme.palette.secondary.main, }} />
                </IconButton>
            </Box>

            {/* Delete */}
            <IconButton sx={{ mt: 0, height: '1.3rem', width: '1.3rem', ml: 8 }} size="small" color='info'
                onClick={(e: any) => PurchaseStore.main.functions.deleteLineItem(index)}>
                <CloseSharp sx={{ fontSize: '1.3rem' }} />
            </IconButton>
        </Box>
    </Box >)
}
export { PurchaseLineItem }
