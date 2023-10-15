import { Box, Button, Tab, Tabs, Typography, useTheme } from '../../../../../imports/gui-imports'
import { useSharedElements } from '../../common/shared-elements-hook'
import { PurchaseMainHeader } from './purchase-main-header'
import { usePurchaseMain } from './purchase-main-hook'
import { PurchaseItems } from './items/purchase-items'
import { PurchaseMainSubheader } from './purchase-main-subheader'

function PurchaseMain({ purchaseType }: { purchaseType: 'pur' | 'ret' }) {
    const theme = useTheme()
    // const { accountsMessages } = useSharedElements()
    // const { handleOnSubmit } = usePurchaseMain()
    
    return (<Box sx={{ mt: theme.spacing(2), display: 'flex', flexDirection: 'column' }}>
        <PurchaseMainHeader />
        <PurchaseMainSubheader />
        <PurchaseItems />
    </Box>)
}
export { PurchaseMain }