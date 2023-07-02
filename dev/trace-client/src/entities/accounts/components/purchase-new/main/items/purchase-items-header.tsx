import { Box, Checkbox, FormControlLabel, Typography, useTheme } from "@mui/material"
import { PurchaseStore, } from "../../purchase-store"

function PurchaseItemsHeader() {
    const theme = useTheme()
    return (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', mb: 1, borderBottom:'1px solid lightGrey' }}>
            <Typography variant='subtitle1' sx={{ textDecoration: 'underline', fontWeight: 'bold' }}>Items</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', columnGap: 2 }}>
                <FormControlLabel sx={{ fontSize: theme.spacing(1) }} label='Igst' labelPlacement="start"
                    control={
                        <Checkbox size='small' sx={{ mt: -0.1 }}
                            checked={Boolean(PurchaseStore.main.lineItemsHeader.isIgst.value) || false}
                            onChange={() => { 
                                PurchaseStore.main.lineItemsHeader.isIgst.value = !PurchaseStore.main.lineItemsHeader.isIgst.value 
                                PurchaseStore.main.functions.computeSummary()
                            }}
                        />
                    }
                />
            </Box>
        </Box>
    )
}
export { PurchaseItemsHeader }