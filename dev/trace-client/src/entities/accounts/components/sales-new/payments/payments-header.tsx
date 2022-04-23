import { _, Box, Button, CloseSharp, FormControlLabel, IconButton, IMegaData, LedgerSubledger, MegaDataContext, NumberFormat, Radio, RadioGroup, ShipTo, TextField, Typography, useContext, useEffect, useState, useTheme, utilMethods } from '../redirect'

function PaymentsHeader() {
    const [, setRefresh] = useState({})
    const theme = useTheme()
    const megaData: IMegaData = useContext(MegaDataContext)
    const sales = megaData.accounts.sales
    const {toDecimalFormat} = utilMethods()
    useEffect(() => {
        megaData.registerKeyWithMethod('render:paymentsHeader', setRefresh)
        megaData.registerKeyWithMethod('doClear:paymentsHeader', doClear)
    }, [])

    return (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap:'wrap', rowGap:3, columnGap:1 }}>
            <Typography variant='subtitle1' sx={{ textDecoration: 'underline', fontWeight: 'bold' }}>Payments</Typography>
            <Typography variant='body2' >{''.concat('Count: ', sales?.paymentMethodsList?.length || 0 + '')}</Typography>
            <Box sx={{ display: 'flex', alignItems:'center'}}>
                <Button sx={{mr:2}} variant='outlined' size='small' onClick={doClear} color='secondary'>Clear all</Button>
                <Typography variant='body2' sx={{ fontWeight: 'bold', ml:2 }}>{''.concat('Amount:', ' ', (getTotalAmount() || 0 + ''))}</Typography>
            </Box>
        </Box>
    )

    function doClear() {
        megaData.executeMethodForKey('doClear:paymentsVariety')
        megaData.executeMethodForKey('doClear:paymentsMethods')
        megaData.executeMethodForKey('handleClear:shipTo')
    }

    function getTotalAmount() {
        const paymentMethodsList: any = sales.paymentMethodsList
        const total: any = paymentMethodsList.reduce((prev: any, current: any) =>
        ({
            amount: (prev.amount ?? 0) + (current.amount ?? 0)
        }), { amount: 0 })
        return (toDecimalFormat(total.amount))
    }
}

export{PaymentsHeader}