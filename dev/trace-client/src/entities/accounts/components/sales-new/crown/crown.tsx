import { Box, Button, IMegaData, MegaDataContext, Typography, useContext, useState, useTheme, utilMethods } from '../redirect'
import { useCrown } from './crown-hook'

function Crown() {
    const [, setRefresh] = useState({})
    const megaData: IMegaData = useContext(MegaDataContext)
    const sales = megaData.accounts.sales
    const theme = useTheme()
    const { toDecimalFormat } = utilMethods()
    const { handleReset, handleSubmit } = useCrown()

    return (
        <Box sx={{ mt: 0, mb: 0, display: 'flex', flexDirection: 'column', }}>
            <Box sx={{ display: 'flex', columnGap: 2, rowGap: 2 }}>
                <Button variant='outlined' size='small' sx={{ height: theme.spacing(5) }} color='secondary'>View</Button>
                <Button variant='outlined' onClick={handleReset} size='small' sx={{ height: theme.spacing(5), }} color='info' >Reset</Button>
                <Button variant='contained' onClick={handleSubmit} size='large' sx={{ height: theme.spacing(5), ml: 'auto', }} disabled={sales.isAnyError} color='success'>Submit</Button>
            </Box>
            <Typography sx={{ fontSize: theme.spacing(1.7), mt: .5, display: 'flex', }}>
                <b>Debits:&nbsp;</b>{toDecimalFormat(sales.debits)}&nbsp;
                &nbsp;<b>Credits:&nbsp;</b>{toDecimalFormat(sales.credits)}
            </Typography>
            <Typography sx={{ fontSize: theme.spacing(1.7), color: (sales.credits - sales.debits) === 0 ? theme.palette.common.black : theme.palette.error.light }}>
                <b>Diff:&nbsp;</b>{toDecimalFormat(sales.credits - sales.debits)}
            </Typography>
        </Box>)
}

export { Crown }