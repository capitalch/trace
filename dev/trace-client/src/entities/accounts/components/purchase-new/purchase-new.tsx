
import { Box, Button, Tab, Tabs, Typography, useTheme } from '../../../../imports/gui-imports'
import { PurchaseNewMain } from './main/purchase-new-main'
import { usePurchaseNew } from './purchase-new-hook'
import { PurchaseNewStore } from './purchase-new-store'
import { PurchaseNewView } from './purchase-new-view'
function PurchaseNew() {
    const { handleOnReset, handleOnTabChange } = usePurchaseNew()
    const theme = useTheme()
    return (<Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <Typography color='secondary' variant='subtitle1' component='div'>Purchase</Typography>
        <Tabs sx={{
            backgroundColor: theme.palette.grey[200],
            color: theme.palette.primary.dark,
            marginTop: theme.spacing(0.5)
        }}
            indicatorColor='primary'
            value={PurchaseNewStore.tabValue.value}
            onChange={handleOnTabChange}>
            <Tab label='Main' />
            <Tab label='View' />
            <Button sx={{
                backgroundColor: theme.palette.blue.main, color: theme.palette.getContrastText(theme.palette.blue.main),
                height: theme.spacing(4),
                margin: 'auto',
            }} variant='contained' onClick={handleOnReset}>Reset</Button>
        </Tabs>
        <Box hidden={PurchaseNewStore.tabValue.value === 1}>
            <PurchaseNewMain />
        </Box>
        <Box hidden={PurchaseNewStore.tabValue.value === 0}>
            <PurchaseNewView />
        </Box>
    </Box>)
}
export { PurchaseNew }