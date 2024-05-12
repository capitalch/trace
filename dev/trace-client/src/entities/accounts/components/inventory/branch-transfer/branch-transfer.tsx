import { Box, Tab, Tabs, Typography, useTheme } from "@mui/material";
import { useBranchTransfer } from "./branch-transfer-hook";

export function BranchTransfer() {
    const theme = useTheme()
    const { handleOnChangeTab } = useBranchTransfer();
    return (<Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <Typography color='secondary' variant="subtitle1" component='div'>Branch Transfer</Typography>
        <Tabs sx={{
            backgroundColor: theme.palette.grey[200],
            color: theme.palette.primary.dark,
            marginTop: theme.spacing(0.5)
        }}
            value={0}
            onChange={handleOnChangeTab}
            indicatorColor='primary'>
            <Tab label='Main' />
            <Tab label='View' />
        </Tabs>
    </Box>)
}