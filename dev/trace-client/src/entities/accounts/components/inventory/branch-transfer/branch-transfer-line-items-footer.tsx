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

        {/* Total qty */}
        <Typography color={theme.palette.common.black} className='footer' variant="body2" fontWeight='bold'>
            {''.concat('Total qty: ', toDecimalFormat(BranchTransferStore.main.lineItemsFooter.qty.value))}
        </Typography>

        {/* Total amount */}
        <Typography color={theme.palette.common.black} className='footer' variant="body2" fontWeight='bold'>
            {''.concat('Total amount: ', toDecimalFormat(BranchTransferStore.main.lineItemsFooter.amount.value))}
        </Typography>

    </Box>)
}