import { Box } from "@mui/material"
import { PurchaseLineItem } from "./purchase-line-item"
import { PurchaseStore } from "../../purchase-store"

function PurchaseLineItems() {
    const lineItems = PurchaseStore.main.lineItems.value

    return (<Box sx={{ display: 'flex', flexDirection: 'column', rowGap: 1, }}>
        {getLineItems()}
    </Box>)

    function getLineItems() {
        const purchaseMainLineItems: any[] = lineItems.map((item: any, index: number) => {
            return (<PurchaseLineItem item={item} key={index} index={index} />)
        })
        return (purchaseMainLineItems)
    }
}
export { PurchaseLineItems }