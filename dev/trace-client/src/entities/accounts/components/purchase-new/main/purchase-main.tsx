import { Box, useTheme } from '../../../../../imports/gui-imports'
import { PurchaseMainHeader } from './purchase-main-header'
import { PurchaseItems } from './items/purchase-items'
import { PurchaseMainSubheader } from './purchase-main-subheader'

function PurchaseMain({ purchaseType }: { purchaseType: 'pur' | 'ret' }) {
    const theme = useTheme()
    
    return (<Box sx={{ mt: theme.spacing(2), display: 'flex', flexDirection: 'column' }}>
        <PurchaseMainHeader />
        <PurchaseMainSubheader />
        <PurchaseItems />
    </Box>)
}
export { PurchaseMain }