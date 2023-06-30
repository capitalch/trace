import { AddCircle, CloseSharp, Delete, Search } from "@mui/icons-material"
import { Badge, Box, Button, Card, IconButton, TextField, Typography, useTheme } from "@mui/material"
import NumberFormat from "react-number-format"
import { utilMethods } from "../../../inventory/redirect"
import { usePurchaseMainLineItem } from "./purchase-main-line-item-hook"

function PurchaseMainLineItem({ item, index }: { item: any, index: number }) {
    const theme = useTheme()
    const { handleAddItem, handleDeleteItem } = usePurchaseMainLineItem()
    const { extractAmount, toDecimalFormat } = utilMethods()
    // const {
    //     searchProduct,
    //     searchProductOnProductCode,
    //     searchProductOnUpcCode,
    // } = useProductUtils(meta)

    return (<Box sx={{
        display: 'flex', alignItems: 'center', borderBottom: '1px solid lightGrey'
        , flexWrap: 'wrap', pr: 1, rowGap: 3, columnGap: 2
    }}>

        <Box display='flex' flexDirection='column'>
            {/* Delete */}
            <IconButton sx={{ ml: -2, mt: -2 }} size="medium" color='error'
                onClick={(e: any) => handleDeleteItem(e, item, index)}>
                <CloseSharp />
            </IconButton>
            {/* Index */}
            <Typography variant='body2' sx={{ textDecoration: 'underline', fontSize: theme.spacing(1.5) }} color={theme.palette.secondary.main}>{index + 1}</Typography>


        </Box>

        {/* Product code or UPC*/}
        <Box className='vertical' >
            <Box sx={{ display: 'flex' }}>
                <Typography variant='body2'>Prod/UPC</Typography>
                <Button variant='outlined' color='info' sx={{ height: 20, width: 60, ml: 2 }}>Search</Button>
            </Box>
            {/* <NumberFormat sx={{ maxWidth: theme.spacing(10),  }}
                allowNegative={false}
                autoComplete='off'
                customInput={TextField}
                decimalScale={0}
                // error={item.isProductCodeError}
                fixedDecimalScale={true}
                value={item.productCode.value || ''}
                variant='standard'
                size='small'
                placeholder="Pr code"
                onChange={(e: any) => {
                    item.productCode.value = e.target.value
                    // if (item.productCode) {
                    // debounceEmit('DEBOUNCE-ON-CHANGE', { item, setRefresh })
                    // } else {
                    // clearRow(item)
                    // setRefresh({})
                    // }
                }}

                onFocus={(e: any) => {
                    e.target.select()
                }} /> */}
            <TextField
                autoComplete='off'
                sx={{ maxWidth: theme.spacing(18) }}
                variant='standard'
                value={item.productCodeOrUpc.value || ''}
            // placeholder="UPC code"
            // onChange={(e: any) => handleTextChanged(item, 'remarks', e)} 

            />
            {/*  */}
        </Box>

        {/* Product details */}
        <Card variant='outlined' sx={{
            width: theme.spacing(26), height: theme.spacing(8),
            p: .5, pt: 0, border: '1px solid lightGrey', borderColor: item.isProductDetailsError ? 'red' : 'lightGrey'
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
                // error={item.isHsnError}
                fixedDecimalScale={true}
                value={item.hsn.value || 0}
                variant='standard'
                onChange={(e: any) => {
                    item.hsn.value = e.target.value
                }}
                // onChange={(e: any) => handleTextChanged(item, 'hsn', e)}
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
                // error={item.isGstRateError}
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
                    // setRefresh({})
                    // computeRow(item)
                }} />
        </Box>

        {/* Qty */}
        <Box className='vertical'>
            <Badge badgeContent={item.clos.value || 0} color='default' sx={{ ml: 4, }} showZero overlap='circular' anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}>
                <Typography sx={{ textAlign: 'right' }} variant='body2'>Qty</Typography>
            </Badge>
            <NumberFormat sx={{ maxWidth: theme.spacing(8) }}
                autoComplete='off'
                allowNegative={false}
                className='right-aligned'
                customInput={TextField}
                decimalScale={2}
                fixedDecimalScale={true}
                value={item.qty.value || 1.00}
                onFocus={(e: any) => {
                    e.target.select()
                }}
                onValueChange={(value) => {
                    const { floatValue } = value
                    item.qty.value = floatValue
                    // setRefresh({})
                    // computeRow(item)
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
                    // setPriceGst(item)
                    // setRefresh({})
                    // computeRow(item)
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
                    // setPrice(item)
                    // setRefresh({})
                    // computeRow(item)
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
                    // setRefresh({})
                    // computeRow(item)
                }}
                variant='standard' />
        </Box>

        {/* Remarks */}
        <Box className='vertical' >
            <Box display='flex'>
                <Typography variant='body2'>Remarks</Typography>
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
                    <Button color="secondary" variant='outlined' sx={{ width: theme.spacing(12), height:20, ml: 2 }} onClick={() => {
                        // megaData.executeMethodForKey('handleSerialNo:lineItems', { item })
                    }}>Serial</Button>
                </Badge>
            </Box>
            <TextField
                autoComplete='off'
                sx={{ maxWidth: theme.spacing(22) }}
                variant='standard'
                value={item.remarks.value || ''}
            // onChange={(e: any) => handleTextChanged(item, 'remarks', e)} 

            />
        </Box>

        {/* Serial numbers */}
        {/* <Badge
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
            <Button color="secondary" variant='outlined' sx={{ width: theme.spacing(12) }} onClick={() => {
                // megaData.executeMethodForKey('handleSerialNo:lineItems', { item })
            }}>Serial</Button>
        </Badge> */}

        {/* amount */}
        <Typography variant='body2' sx={{ ml: 'auto', textAlign: 'right', color: theme.palette.common.black, fontWeight: 'bolder' }} >
            {toDecimalFormat(item.amount.value || 0.00)}</Typography>

        {/* Add */}
        <IconButton
            className="add-box"
            aria-label="add"
            size="large"
            onClick={() => handleAddItem(index)}
        >
            <AddCircle sx={{ fontSize: '3rem', color: theme.palette.secondary.main, }} />
        </IconButton>
    </Box>)
}
export { PurchaseMainLineItem }