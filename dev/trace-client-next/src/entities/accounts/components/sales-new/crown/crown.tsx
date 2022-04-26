import { Box, Button, IMegaData, MegaDataContext, Typography, useContext, useTraceMaterialComponents, useState, useTheme, utilMethods } from '../redirect'
import { useCrown } from './crown-hook'

function Crown() {
    const megaData: IMegaData = useContext(MegaDataContext)
    const sales = megaData.accounts.sales
    const theme = useTheme()
    const { BasicMaterialDialog } = useTraceMaterialComponents()
    const { toDecimalFormat } = utilMethods()
    const { handleReset, handleSalesViewDialog, handleSubmit, meta } = useCrown()
    const pre = meta.current

    return (
        <Box sx={{ mt: 0, mb: 0, display: 'flex', flexDirection: 'column', }}>
            <Box sx={{ display: 'flex', columnGap: 1, rowGap: 2 }}>
                <Button variant='outlined' onClick={handleReset} size='small' sx={{ height: theme.spacing(5), }} color='warning' >Reset</Button>
                <Button variant='outlined' onClick={handleSalesViewDialog} size='small' sx={{ height: theme.spacing(5) }} color='secondary'>View</Button>
                <Button variant='contained' onClick={handleSubmit} size='large' sx={{ height: theme.spacing(5), ml: 'auto', }} disabled={sales.isAnyError} color='success'>Submit</Button>
            </Box>
            <Box sx={{ display: 'flex', mt: .5, justifyContent: 'space-between' }}>
                <Typography sx={{ fontSize: theme.spacing(1.7), }}>Debits:&nbsp;{toDecimalFormat(sales.debits)}&nbsp;</Typography>
                <Typography sx={{ fontSize: theme.spacing(1.7), }}>Credits:&nbsp;{toDecimalFormat(sales.credits)}</Typography>
            </Box>
            <Typography sx={{ fontSize: theme.spacing(1.7), color: (sales.credits - sales.debits) === 0 ? theme.palette.common.black : theme.palette.error.light }}>
                Diff:&nbsp;{toDecimalFormat(sales.credits - sales.debits)}
            </Typography>
            <BasicMaterialDialog parentMeta={meta} />
        </Box>)
}

export { Crown }