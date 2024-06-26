import { Box, Tab, Tabs, Typography, useTheme } from "@mui/material";
import { useBranchTransfer } from "./branch-transfer-hook";
import { BranchTransferStore } from "../../../stores/branch-transfer-store";
import { BranchTransferMain } from "./branch-transfer-main";
import { BranchTransferView } from "./branch-transfer-view";

export function BranchTransfer() {
    const theme = useTheme()
    const { handleOnChangeTab } = useBranchTransfer();

    return (
        <Box sx={{
            display: 'flex', flexDirection: 'column', '& .vertical': { display: 'flex', flexDirection: 'column', },
            '& .right-aligned': { '& input': { textAlign: 'end' } }
        }}>
            <Typography color='secondary' variant="subtitle1" component='div'>Branch Transfer</Typography>
            <Tabs sx={{
                backgroundColor: theme.palette.grey[200],
                color: theme.palette.primary.dark,
                marginTop: theme.spacing(0.5)
            }}
                value={BranchTransferStore.tabValue.value}
                onChange={handleOnChangeTab}
                indicatorColor='primary'>
                <Tab label='Main' />
                <Tab label='View' />
            </Tabs>
            
            <Box hidden={BranchTransferStore.tabValue.value === 1}>
                <BranchTransferMain />
            </Box>
            <Box hidden={BranchTransferStore.tabValue.value === 0}>
                <BranchTransferView />
            </Box>
        </Box>)
}