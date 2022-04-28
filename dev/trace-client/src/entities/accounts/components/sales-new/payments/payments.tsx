import { _, Box, PaymentsHeader, PaymentsMethods, PaymentsVariety, ShipTo, useTheme } from '../redirect'

function Payments() {
    const theme = useTheme()
    return (
        <Box className='vertical' sx={{ pt: 2, pr: 3, pb: 2,  maxWidth: theme.spacing(110) }}>
            <PaymentsHeader />
            <PaymentsVariety />
            <PaymentsMethods />
            <ShipTo />
        </Box>)
}

export { Payments }