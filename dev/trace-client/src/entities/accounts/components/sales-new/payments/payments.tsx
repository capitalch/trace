import { _, Box, PaymentsHeader, PaymentsMethods, PaymentsVariety, ShipTo, useTheme } from '../redirect'

function Payments() {
    const theme = useTheme()

    return (
        <Box className='vertical' sx={{ p: 2, mr: 1, mb: 1, border: '1px solid lightGrey', maxWidth: theme.spacing(85) }}>
            <PaymentsHeader />
            <PaymentsVariety />
            <PaymentsMethods />
            <ShipTo />
        </Box>)
}

export { Payments }