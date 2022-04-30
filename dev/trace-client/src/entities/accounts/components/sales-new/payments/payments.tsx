import { _, Box, PaymentsHeader, PaymentsMethods, PaymentsVariety, ShipTo, useTheme } from '../redirect'

function Payments() {
    const theme = useTheme()
    return (
        <Box className='vertical' sx={{p:1, mt:.5, pt: 2, pr: 2, pb: 2, border:'1px solid lightGrey',  maxWidth: theme.spacing(110) }}>
            <PaymentsHeader />
            <PaymentsVariety />
            <PaymentsMethods />
            <ShipTo />
        </Box>)
}

export { Payments }