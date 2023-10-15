
import { Box, Tab, Tabs, Typography, useTheme } from '../../../../imports/gui-imports'
import { PurchaseMain } from './main/purchase-main'
import { usePurchase } from './purchase-hook'
import { PurchaseStore, resetPurchaseStore } from '../../stores/purchase-store'
import { PurchaseView } from './purchase-view'

function Purchase({ purchaseType, drillDownEditAttributes }: { purchaseType: 'pur' | 'ret', drillDownEditAttributes?: any }) {
    if (purchaseType !== PurchaseStore.purchaseType) {
        resetPurchaseStore()
    }
    PurchaseStore.purchaseType = purchaseType
    const { handleOnTabChange } = usePurchase(drillDownEditAttributes)

    const theme = useTheme()
    return (<Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <Typography color='secondary' variant='subtitle1' component='div'>{purchaseType === 'pur' ? 'Purchase' : 'Purchase return'}</Typography>
        <Tabs sx={{
            backgroundColor: theme.palette.grey[200],
            color: theme.palette.primary.dark,
            marginTop: theme.spacing(0.5)
        }}
            indicatorColor='primary'
            value={PurchaseStore.tabValue.value}
            onChange={handleOnTabChange}>
            <Tab label='Main' />
            <Tab label='View' />
            {/* <Button sx={{
                backgroundColor: theme.palette.blue.main, color: theme.palette.getContrastText(theme.palette.blue.main),
                height: theme.spacing(4),
                // margin: 'auto',
            }} variant='contained' onClick={handleOnReset}>Reset</Button> */}
        </Tabs>
        <Box hidden={PurchaseStore.tabValue.value === 1}>
            <PurchaseMain purchaseType={purchaseType} />
        </Box>
        <Box hidden={PurchaseStore.tabValue.value === 0}>
            <PurchaseView />
        </Box>
    </Box>)
}
export { Purchase }