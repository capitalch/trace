import { Box, Typography, useTheme } from "@mui/material"
import { PurchaseStore } from "../../purchase-store"
import { utilMethods } from "../../../inventory/redirect"

function PurchaseItemsFooter() {
    const theme = useTheme()
    const { toDecimalFormat } = utilMethods()
    return (<Box sx={{ pt: 1, pb: 0, display: 'flex', flexWrap: 'wrap', rowGap: 1, alignItems: 'center', justifyContent: 'space-between' }}>
        <Box display='flex' columnGap={2}>
            {/* Count */}
            <Typography color={theme.palette.common.black} variant="body2">
                {''.concat('Count: ', String(PurchaseStore.main.lineItems.value.length))}
            </Typography>

            {/* Qty */}
            <Typography color={theme.palette.common.black} className='footer' variant="body2">
                {''.concat('Qty: ', toDecimalFormat(PurchaseStore.main.lineItemsFooter.qty.value))}
            </Typography>
        </Box>

        <Box display='flex' columnGap={2} alignItems='center'>
            {/* Discount */}
            <Typography color={theme.palette.common.black} className='footer' variant="body2">
                {''.concat('Discount: ', toDecimalFormat(PurchaseStore.main.lineItemsFooter.discount.value))}
            </Typography>

            {/* Sub total */}
            <Typography ml={10} color={theme.palette.common.black} className='footer' variant="body2">
                {''.concat('Sub total: ', toDecimalFormat(PurchaseStore.main.lineItemsFooter.subTotal.value))}
            </Typography>

            {/* Cgst */}
            <Typography color={theme.palette.common.black} className='footer' variant="body2">
                {''.concat('Cgst: ', toDecimalFormat(PurchaseStore.main.lineItemsFooter.cgst.value))}
            </Typography>

            {/* Sgst */}
            <Typography color={theme.palette.common.black} className='footer' variant="body2">
                {''.concat('Sgst: ', toDecimalFormat(PurchaseStore.main.lineItemsFooter.sgst.value))}
            </Typography>

            {/* Igst */}
            <Typography color={theme.palette.common.black} className='footer' variant="body2">
                {''.concat('Igst: ', toDecimalFormat(PurchaseStore.main.lineItemsFooter.igst.value))}
            </Typography>
        </Box>
        {/* Amount */}
        <Typography sx={{ textDecoration: 'underline' }} color={theme.palette.common.black} mr={theme.spacing(1)} className='footer' variant="body1" fontWeight='bolder' fontSize='1.2rem'>
            {toDecimalFormat(PurchaseStore.main.lineItemsFooter.amount.value)}
        </Typography>
        {/* </Box> */}
    </Box>)
}
export { PurchaseItemsFooter }