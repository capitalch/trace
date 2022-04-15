import { AddCircle, Box, Button, Checkbox, FormControlLabel, Typography, useContext, MegaDataContext, useState, useTheme, } from '../redirect'

function ItemsHeader() {
    const [, setRefresh] = useState({})
    const theme = useTheme()
    const megaData = useContext(MegaDataContext)
    const sales = megaData.accounts.sales

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
            <Button size='small' variant='outlined' color='secondary'
                onClick={() => sales.handleAddItem()}
                startIcon={<AddCircle />} >Add</Button>
        </Box>
    </Box>)

    function handleChangeIgst(e: any) {
        sales.isIgst = e.target.checked
        setRefresh({})
        sales.computeAllRows()
    }
}

export { ItemsHeader }