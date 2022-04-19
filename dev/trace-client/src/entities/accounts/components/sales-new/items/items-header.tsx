import { useEffect } from 'react'
import { AddCircle, Box, Button, Checkbox, FormControlLabel, IMegaData, Typography, useContext, MegaDataContext, useState, useTheme, } from '../redirect'

function ItemsHeader() {
    const [, setRefresh] = useState({})
    const theme = useTheme()
    const megaData: IMegaData = useContext(MegaDataContext)
    const sales = megaData.accounts.sales
    const items = sales.items

    useEffect(() => {
        megaData.registerKeyWithMethod('handleAddItem:itemsHeader', handleAddItem)
    }, [])

    return (<Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5, '& .footer': { mt: .1, fontWeight: 'bold', fontSize: theme.spacing(1.6) } }}>
        {/* Products label */}
        <Typography variant='subtitle1' sx={{ textDecoration: 'underline', fontWeight: 'bold' }}>Items</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', columnGap: 2, }}>
            <FormControlLabel sx={{ fontSize: theme.spacing(1) }} label='Igst'
                control={
                    <Checkbox size='small' sx={{ mt: -0.1 }} checked={sales.isIgst || false}
                        onChange={handleChangeIgst} />}
            />
            {/* Add */}
            <Button size='small' variant='outlined' color='secondary' sx={{width: theme.spacing(12.5)}}
                onClick={() => handleAddItem()}
                startIcon={<AddCircle sx={{ml:-3}} />} 
                >Add</Button>
        </Box>
    </Box>)

    function handleChangeIgst(e: any) {
        sales.isIgst = e.target.checked
        setRefresh({})
        megaData.executeMethodForKey('computeAllRows:lineItems')
        // sales.computeAllRows()
    }

    function handleAddItem() {
        items.push({ upc: '', productCode: '', hsn: '', gstRate: 0, qty: 1, price: 0, priceGst: 0, discount: 0, remarks: null, amount: 0, cgst: 0, sgst: 0, igst: 0 })
        megaData.executeMethodForKey('computeSummary:itemsFooter')
        sales.currentItemIndex = items.length - 1
        megaData.executeMethodForKey('render:lineItems', {})
    }
}

export { ItemsHeader }