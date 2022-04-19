import { _, Box, Button, CloseSharp, FormControlLabel, IconButton, IMegaData, LedgerSubledger, MegaDataContext, NumberFormat, PaymentsHeader, PaymentsMethods, Radio, RadioGroup, PaymentsVariety, ShipTo, TextField, Typography, useContext, useEffect, useState, useTheme } from '../redirect'

function SalesPayments() {
    const theme = useTheme()

    return (
        <Box className='vertical' sx={{ p: 2, mr: 1, mb: 1, border: '1px solid lightGrey', maxWidth: theme.spacing(85) }}>
            <PaymentsHeader />
            <PaymentsVariety />
            <PaymentsMethods />
            <ShipTo />
        </Box>)
}
export { SalesPayments }