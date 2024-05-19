import { Badge, Box, Button, Card, IconButton, TextField, Typography, useTheme } from "@mui/material";
import { BranchTransferLineItemType, addBranchTransferLineItem, clearBranchTransferLineItem, computeAmountBranchTransferLineItem, computeFooterBranchTransferLineItem, deleteBranchTransferLineItem } from "../../../stores/branch-transfer-store";
import { AddCircle, ClearAll, CloseSharp, Search } from "@mui/icons-material";
import NumberFormat from "react-number-format";
import { useBranchTransferLineItem } from "./branch-transfer-line-item-hook";
import { utilMethods } from "../redirect";

export function BranchTransferLineItem({ item, index }: { item: BranchTransferLineItemType, index: number }) {
    const theme = useTheme()
    const { extractAmount, toDecimalFormat } = utilMethods()
    const { doSearchOnProductCodeOrUpc, getbranchesOptions, handleItemSearch, handleSerialNumber } = useBranchTransferLineItem()
    return (
        <Box sx={{
            display: 'flex', alignItems: 'center', borderBottom: '2px solid teal', mt: 1, pb: 1,
            flexWrap: 'wrap', rowGap: 3, columnGap: 3
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
                        doSearchOnProductCodeOrUpc(index, item, e.target.value)
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
                            clearBranchTransferLineItem(index)
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
                    value={item.branchId.value || ''}
                    style={{
                        fontSize: '0.8rem',
                        width: '15rem',
                        marginLeft: '0.1rem',
                        height: theme.spacing(3),
                        marginTop: theme.spacing(1),
                    }}
                    onChange={(e: any) => {
                        item.branchId.value = e.target.value
                    }}>
                    {getbranchesOptions()}
                </select>
            </Box>

            {/* dr /cr  */}
            <Box className='vertical'>
                <Typography sx={{ textAlign: 'right' }} variant='body2'>Dr / Cr</Typography>
                <select
                    value={item.dbCr.value || ''}
                    style={{
                        fontSize: '0.8rem',
                        width: '5rem',
                        marginLeft: '0.1rem',
                        height: theme.spacing(3),
                        marginTop: theme.spacing(1),
                    }}
                    onChange={(e: any) => {
                        item.dbCr.value = e.target.value
                        computeFooterBranchTransferLineItem()
                    }}>
                    <option value={'D'}>Debit (In)</option>
                    <option value={'C'}>Credit (Out)</option>
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
                        computeAmountBranchTransferLineItem(item)
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
                        computeAmountBranchTransferLineItem(item)
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
                            handleSerialNumber(item)
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

            {/* Amount */}
            <Typography variant='body1' sx={{ textAlign: 'right', width: theme.spacing(12), color: theme.palette.common.black, fontWeight: 'bolder' }} >
                {toDecimalFormat(item.amount.value || 0.00)}</Typography>

            {/* Add button */}
            <IconButton
                sx={{ height: '2.3rem', width: '2.3rem', ml: 'auto' }}
                className="add-box"
                aria-label="add"
                size="small"
                onClick={() => {
                    addBranchTransferLineItem(index)
                }}>
                <AddCircle sx={{ fontSize: '2.5rem', color: theme.palette.secondary.main, }} />
            </IconButton>

            {/* Delete */}
            <IconButton sx={{ mt: 0, height: '1.3rem', width: '1.3rem' }} size="small" color='info'
                onClick={(e: any) => {
                    deleteBranchTransferLineItem(index)
                }}>
                <CloseSharp sx={{ fontSize: '1.3rem' }} />
            </IconButton>
        </Box>)

}