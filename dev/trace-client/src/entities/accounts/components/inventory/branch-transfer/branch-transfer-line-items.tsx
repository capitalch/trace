import { Box, Typography, useTheme } from "@mui/material";
import { BranchTransferStore } from "../../../stores/branch-transfer-store";
import { BranchTransferLineItem } from "./branch-transfer-line-item";

export function BranchTransferLineItems() {
    const lineItems: any[] = BranchTransferStore.main.lineItems.value
    const theme = useTheme()
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', mt: theme.spacing(4), rowGap: .5 }} >
            <Box sx={{ mb: 1, borderBottom: '1px solid lightGrey' }}>
                <Typography variant='subtitle1' sx={{ textDecoration: 'underline', fontWeight: 'bold' }}>Items</Typography>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', rowGap: 1, }}>
                {getLineItems()}
            </Box>
        </Box>
    )

    function getLineItems() {
        const branchTransferLineItems: any[] = lineItems.map((item: any, index: number) => {
            return (<BranchTransferLineItem item={item} key={index} index={index} />)
        })
        return (branchTransferLineItems)
    }
}