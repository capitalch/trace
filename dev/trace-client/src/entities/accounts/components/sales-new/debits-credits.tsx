import { Box, Button, IMegaData, MegaDataContext, Typography, useContext, useTraceMaterialComponents, useState, useTheme, utilMethods } from './redirect'

function DebitsCredits() {
    const theme = useTheme()
    const { toDecimalFormat } = utilMethods()
    const megaData: IMegaData = useContext(MegaDataContext)
    const sales = megaData.accounts.sales

    return (<Box sx={{ display: 'flex', }}>
        <Typography sx={{ fontSize: theme.spacing(1.7), }}>Debits:&nbsp;{toDecimalFormat(sales.debits)}</Typography>
        <Typography sx={{ fontSize: theme.spacing(1.7), ml:2 }}>Credits:&nbsp;{toDecimalFormat(sales.credits)}</Typography>
        <Typography sx={{ fontWeight: 'bold', ml:2, fontSize: theme.spacing(1.7), color: (sales.credits - sales.debits) === 0 ? theme.palette.common.black : theme.palette.error.light }}>
            Diff:&nbsp;{toDecimalFormat(sales.credits - sales.debits)}
        </Typography>
    </Box>)
}
export { DebitsCredits }