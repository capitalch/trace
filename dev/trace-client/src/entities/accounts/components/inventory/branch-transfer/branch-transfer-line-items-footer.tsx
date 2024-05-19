import { Box, Typography, useTheme } from "@mui/material";
import { utilMethods } from "../redirect";
import { BranchTransferStore } from "../../../stores/branch-transfer-store";

export function BranchTransferLineItemsFooter() {
    const theme = useTheme()
    const { toDecimalFormat } = utilMethods()

    return (<Box sx={{ pt: 1, pb: 0, display: 'flex', flexWrap: 'wrap', rowGap: 1, alignItems: 'center', justifyContent: 'space-between', }}>

        {/* Count */}
        <Typography color={theme.palette.common.black} variant="body2">
            {''.concat('Count: ', String(BranchTransferStore.main.lineItems.value.length))}
        </Typography>

        <Box sx={{ display: 'flex', columnGap: 2 }}>
            {/* Debit qty */}
            <Typography color={theme.palette.common.black} className='footer' variant="body2" fontWeight='bold'>
                {''.concat('Debit qty: ', toDecimalFormat(BranchTransferStore.main.lineItemsFooter.debitQty.value))}
            </Typography>

            {/* Credit qty */}
            <Typography color={theme.palette.common.black} className='footer' variant="body2" fontWeight='bold'>
                {''.concat('Credit qty: ', toDecimalFormat(BranchTransferStore.main.lineItemsFooter.creditQty.value))}
            </Typography>
        </Box>

        <Box sx={{ display: 'flex', columnGap: 2 }}>
            {/* Debit amount */}
            <Typography color={theme.palette.common.black} className='footer' variant="body2" fontWeight='bold'>
                {''.concat('Debit amount: ', toDecimalFormat(BranchTransferStore.main.lineItemsFooter.debitAmount.value))}
            </Typography>

            {/* credit amount */}
            <Typography color={theme.palette.common.black} className='footer' variant="body2" fontWeight='bold'>
                {''.concat('Credit amount: ', toDecimalFormat(BranchTransferStore.main.lineItemsFooter.creditAmount.value))}
            </Typography>
        </Box>
    </Box>)
}