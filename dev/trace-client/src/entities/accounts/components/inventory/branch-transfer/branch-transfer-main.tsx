import { Box } from "@mui/material";
import { BranchTransferHeader } from "./branch-transfer-header";
import { BranchTransferLineItems } from "./branch-transfer-line-items";

export function BranchTransferMain() {
    return (<Box>
        <BranchTransferHeader />
        <BranchTransferLineItems />
    </Box>)
}