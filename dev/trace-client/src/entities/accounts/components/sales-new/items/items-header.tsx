import { AddCircle, Box, Button, Checkbox, FormControlLabel, Typography, useContext, MegaDataContext, useIbuki, useState, useTheme, utilMethods } from '../redirect'

function ItemsHeader() {
    const [, setRefresh] = useState({})
    const theme = useTheme()
    const { emit } = useIbuki()
    const megaData = useContext(MegaDataContext)
    const sales = megaData.accounts.sales
    // const items = sales.products
    const { extractAmount, toDecimalFormat } = utilMethods()
    // const {
    // handleAddProduct,
    // handleChangeIgst } = useItems()

    // sales.computeSummary = computeSummary
    return (<Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', m: .5, '& .footer': { mt: .1, fontWeight: 'bold', fontSize: theme.spacing(1.6) } }}>
        {/* Products label */}
        <Typography variant='subtitle1' sx={{ textDecoration: 'underline', fontWeight: 'bold' }}>Items</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', columnGap: 2, }}>
            <FormControlLabel sx={{ fontSize: theme.spacing(1) }} label='Igst'
                control={
                    <Checkbox size='small' sx={{ mt: -0.2 }} checked={sales.isIgst || false}
                        onChange={handleChangeIgst} />}
            />

            {/* Add */}
            <Button size='small' variant='outlined' color='secondary'
                onClick={() => sales.handleAddProduct()}
                startIcon={<AddCircle />} >Add</Button>
            <Typography color={theme.palette.common.black} sx={{ fontSize: theme.spacing(1.8), fontWeight: 'bolder' }} >{toDecimalFormat(sales.summary.amount)}</Typography>
        </Box>
    </Box>)

    function handleChangeIgst(e: any) {
        sales.isIgst = e.target.checked
        setRefresh({})
        // computeAllRows()
    }
}

export { ItemsHeader }