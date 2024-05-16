import { Badge, Box, Button, Card, IconButton, TextField, Typography, useTheme } from "@mui/material";
import { BranchTransferLineItemType } from "../../../stores/branch-transfer-store";
import { AddCircle, ClearAll, Search } from "@mui/icons-material";
import NumberFormat from "react-number-format";
import { useBranchTransferLineItem } from "./branch-transfer-line-item-hook";

export function BranchTransferLineItem({ item, index }: { item: BranchTransferLineItemType, index: number }) {
    const theme = useTheme()
    const { getbranchesOptions } = useBranchTransferLineItem()
    return (
        <Box sx={{
            display: 'flex', alignItems: 'center', borderBottom: '2px solid teal', mt: 1, pb: 1,
            flexWrap: 'wrap', rowGap: 3, columnGap: 5
        }}>

            <Box display='flex' flexDirection='column'>
                {/* Search */}
                <IconButton sx={{ ml: -2, mt: -2 }} size="medium" color='secondary'
                    onClick={() => handleItemSearch(item)}>
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
                    value={item?.productCodeOrUpc?.value || ''}
                    onChange={(e: any) => {
                        item.productCodeOrUpc.value = e.target.value
                    }}
                    onBlur={(e: any) => {
                        // doSearchOnProductCodeOrUpc(e.target.value)
                    }}
                />
                <Box display='flex'>
                    <Typography
                        width='6rem'
                        variant='body2'
                        fontWeight='bolder'
                        // color={Boolean(errorsObject.productCodeError(item)) ? theme.palette.error.light : theme.palette.success.main}
                        mt={1}>{item.productCode.value || 'Product code'}</Typography>
                    <IconButton color="info"
                        sx={{ mt: .8, height: '1.3rem', width: '1.3rem' }}
                        size="small"
                        onClick={() => {
                            // PurchaseStore.main.functions.clearLineItem(item)
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
                // borderColor: Boolean(errorsObject.productDetailsError(item)) ? theme.palette.error.light : 'lightGrey'
            }}>
                <Typography sx={{
                    fontSize: theme.spacing(1.8),
                    fontWeight: 'bold', overflow: 'hidden', color: theme.palette.common.black,
                }} variant='body1'>{item.productDetails || ''}</Typography>
            </Card>

            {/* Branch */}
            <Box className='vertical'>
                <Typography variant='body2' textAlign='right'>Branch</Typography>
                <select
                    // value={meta.current.viewLimit || ''}
                    style={{
                        fontSize: '0.8rem',
                        width: '5rem',
                        marginLeft: '0.1rem',
                        height: theme.spacing(3),
                        marginTop: theme.spacing(1),
                    }}
                    onChange={(e: any) => {
                        // meta.current.viewLimit = e.target.value
                        // fetchRows(sqlQueryId, sqlQueryArgs)
                        // meta.current.isMounted && setRefresh({})
                    }}>
                        {getbranchesOptions()}
                    {/* <option value={'D'}>Debit</option>
                    <option value={'C'}>Credit</option> */}
                </select>
            </Box>

            {/* dr /cr  */}
            <Box className='vertical'>
                <Typography sx={{ textAlign: 'right' }} variant='body2'>Dr / Cr</Typography>
                <select
                    // value={meta.current.viewLimit || ''}
                    style={{
                        fontSize: '0.8rem',
                        width: '5rem',
                        marginLeft: '0.1rem',
                        height: theme.spacing(3),
                        marginTop: theme.spacing(1),
                    }}
                    onChange={(e: any) => {
                        // meta.current.viewLimit = e.target.value
                        // fetchRows(sqlQueryId, sqlQueryArgs)
                        // meta.current.isMounted && setRefresh({})
                    }}>
                    <option value={'D'}>Debit</option>
                    <option value={'C'}>Credit</option>
                </select>
            </Box>

            {/* Qty */}
            <Box className='vertical'>
                <Typography sx={{ textAlign: 'right' }} variant='body2'>Qty</Typography>
                <NumberFormat sx={{ maxWidth: theme.spacing(8), textAlign: 'right' }}
                    autoComplete='off'
                    allowNegative={false}
                    className='right-aligned'
                    customInput={TextField}
                    // error={Boolean(errorsObject.qtyError(item))}
                    decimalScale={2}
                    fixedDecimalScale={true}
                    value={item.qty.value}
                    onFocus={(e: any) => {
                        e.target.select()
                    }}
                    onValueChange={(value) => {
                        const { floatValue } = value
                        item.qty.value = floatValue || 0
                        // PurchaseStore.main.functions.computeRow(item)
                        // PurchaseStore.main.functions.computeSummary()
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
                        // item.price.value = +extractAmount(e.target.value) || 0.0
                        // PurchaseStore.main.functions.setPriceGst(item)
                        // PurchaseStore.main.functions.computeRow(item)
                        // PurchaseStore.main.functions.computeSummary()
                    }}
                    onFocus={(e: any) => {
                        e.target.select()
                    }}
                    thousandSeparator={true}
                    variant='standard' />
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
                        //     PurchaseStore.errorsObject.slNoError(item)
                        //         ? 'error'
                        //         : 'secondary'
                        // }

                        showZero={true}>
                        <Button color="info" variant='text' sx={{ width: theme.spacing(9), height: 22, fontWeight: 'bold', }} onClick={() => {
                            // handleSerialNumber(item)
                        }}>Ser No</Button>
                    </Badge>
                </Box>
                <TextField
                    autoComplete='off'
                    sx={{ maxWidth: theme.spacing(26) }}
                    variant='standard'
                    value={item?.remarks?.value || ''}
                    onChange={(e: any) => { item.remarks.value = e.target.value }}
                />
            </Box>

            {/* Add button */}
            <IconButton
                sx={{ height: '2.3rem', width: '2.3rem', ml: 1 }}
                className="add-box"
                aria-label="add"
                size="small"
                onClick={() => {
                    // PurchaseStore.main.functions.addLineItem(index)
                }}>
                <AddCircle sx={{ fontSize: '2.5rem', color: theme.palette.secondary.main, }} />
            </IconButton>
        </Box>)




    function handleItemSearch(item: any) {

    }
}