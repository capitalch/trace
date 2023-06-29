import { AddCircle } from "@mui/icons-material"
import { Box, Button, Checkbox, FormControlLabel, Typography, useTheme } from "@mui/material"
import { PurchaseStore, } from "../../purchase-store"
import { signal } from "@preact/signals-react"
import { produce } from "immer"

function PurchaseMainItemsHeader() {
    const theme = useTheme()
    return (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', mb: 1, }}>
            <Typography variant='subtitle1' sx={{ textDecoration: 'underline', fontWeight: 'bold' }}>Items</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', columnGap: 2 }}>
                <FormControlLabel sx={{ fontSize: theme.spacing(1) }} label='Igst'
                    control={
                        <Checkbox size='small' sx={{ mt: -0.1 }}
                        // checked={sales.isIgst || false}
                        // onChange={handleChangeIgst} 
                        />
                    }
                />
                {/* Add */}
                {/* <Button size='small' variant='contained' color='secondary' sx={{ width: theme.spacing(12.5) }}
                    onClick={handleAddItem}
                    startIcon={<AddCircle sx={{ ml: -3 }} />}
                >Add</Button> */}
            </Box>
        </Box>
    )

    // function handleAddItem() {
        // const lineItems = PurchaseStore.main.lineItems.value
        // const item: PurchaseMainLineItemType = { ...purchaseMainlineItemInstance }
        // PurchaseStore.main.lineItems.value = produce(PurchaseStore.main.lineItems.value, (draft: any[]) => {
        //     draft.splice(0, 0, { ...purchaseMainlineItemInstance })
        //     return (draft)
        // })
        // lineItems.push(item)
        // const tempItems = PurchaseStore.main.lineItems.value
        // PurchaseStore.main.lineItems.value = [...tempItems]
    // }
}
export { PurchaseMainItemsHeader }