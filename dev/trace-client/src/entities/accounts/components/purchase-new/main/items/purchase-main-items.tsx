import { Box } from "@mui/material"
import { PurchaseMainItemsHeader } from "./purchase-main-items-header"
import { PurchaseMainItemsFooter } from "./purchase-main-items-footer"
import { PurchaseMainLineItems } from "./purchase-main-line-items"

function PurchaseMainItems() {
    return (<Box sx={{ display: 'flex',  p: 1, pt: 0.5, mt: 0,  '& .vertical': { display: 'flex', flexDirection: 'column', }, '& .right-aligned': { '& input': { textAlign: 'end' } }}}>
        <Box sx={{display:'flex', flexDirection:'column', flex:1}}>
            <PurchaseMainItemsHeader />
            <PurchaseMainLineItems />
            <PurchaseMainItemsFooter />
        </Box>
    </Box>)
}
export { PurchaseMainItems }