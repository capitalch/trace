import { _, Box, Button, CloseSharp, FormControlLabel, IconButton, IMegaData, LedgerSubledger, MegaDataContext, NumberFormat, Radio, RadioGroup, ShipTo, TextField, Typography, useContext, useEffect, useState, useTheme } from '../redirect'

function PaymentsHeader() {
    const [, setRefresh] = useState({})
    const theme = useTheme()
    const megaData: IMegaData = useContext(MegaDataContext)
    const sales = megaData.accounts.sales

    useEffect(() => {
        megaData.registerKeyWithMethod('render:paymentsHeader', setRefresh)
    }, [])

    return (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant='subtitle1' sx={{ textDecoration: 'underline', fontWeight: 'bold' }}>Payments</Typography>
            <Typography variant='body2' >{''.concat('Count: ', sales?.paymentMethodsList?.length || 0 + '')}</Typography>
            <Box sx={{ display: 'flex', alignItems:'center'}}>
                <Button variant='outlined' size='small' onClick={doClear} color='secondary'>Clear</Button>
                <Typography variant='body2' sx={{ fontWeight: 'bold', ml:2 }}>{''.concat('Receipts:', ' ', (getTotalAmount() || 0 + ''))}</Typography>
            </Box>
        </Box>
    )

    function doClear() {
        megaData.executeMethodForKey('doClear:paymentsVariety')
        megaData.executeMethodForKey('doClear:paymentsMethods')
    }

    function getTotalAmount() {
        const paymentMethodsList: any = sales.paymentMethodsList
        const total: any = paymentMethodsList.reduce((prev: any, current: any) =>
        ({
            amount: (prev.amount ?? 0) + (current.amount ?? 0)
        }), { amount: 0 })
        return (total.amount)
    }
}

export{PaymentsHeader}