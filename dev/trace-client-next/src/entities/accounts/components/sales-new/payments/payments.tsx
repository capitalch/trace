import { _, Box, PaymentsHeader, PaymentsMethods, PaymentsVariety, ShipTo, useTheme } from '../redirect'

function Payments() {
    const theme = useTheme()
    return (
        <Box className='vertical' sx={{ pt:1,mt:1, mr: 1, mb: 1, borderTop: '1px solid lightGrey', maxWidth: theme.spacing(110) }}>
            <PaymentsHeader />
            <PaymentsVariety />
            <PaymentsMethods />
            <ShipTo />
        </Box>)
}

export { Payments }