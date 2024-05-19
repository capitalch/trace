import { Box } from "@mui/material";
import { BranchTransferHeader } from "./branch-transfer-header";
import { BranchTransferLineItems } from "./branch-transfer-line-items";
import { BranchTransferLineItemsFooter } from "./branch-transfer-line-items-footer";

export function BranchTransferMain() {
    return (<Box>
        <BranchTransferHeader />
        <BranchTransferLineItems />
        <BranchTransferLineItemsFooter />
    </Box>)
}