import { Box, Button, IMegaData, MegaDataContext, Typography, useContext, useTraceMaterialComponents, useState, useTheme, utilMethods } from '../redirect'
import { useCrown } from './crown-hook'

function Crown() {
    const megaData: IMegaData = useContext(MegaDataContext)
    const sales = megaData.accounts.sales
    const theme = useTheme()
    const { BasicMaterialDialog } = useTraceMaterialComponents()
    const { toDecimalFormat } = utilMethods()
    const { handleReset, handleViewSalesDialog, handleSubmit, meta } = useCrown()
    // const pre = meta.current

    return (
        <Box sx={{ mt: 0, mb: 0, display: 'flex', flexDirection: 'column', ml:'auto' }}>
            <Box sx={{ display: 'flex', columnGap: .5, rowGap: 1, }}>
                <Button variant='outlined' onClick={handleReset} size='small' sx={{ height: theme.spacing(5), }} color='warning' >Reset</Button>
                <Button variant='outlined' onClick={handleViewSalesDialog} size='small' sx={{ height: theme.spacing(5) }} color='secondary'>View</Button>
                <Button variant='contained' onClick={handleSubmit} size='large' sx={{ height: theme.spacing(5), }} disabled={sales.isAnyError} color='success'>Submit</Button>
            </Box>
            <Box sx={{ display: 'flex', mt: .5, justifyContent: 'space-between' }}>
                <Typography sx={{ fontSize: theme.spacing(1.6), }}>Debits:&nbsp;{toDecimalFormat(sales.debits)}&nbsp;</Typography>
                <Typography sx={{ fontSize: theme.spacing(1.6), }}>Credits:&nbsp;{toDecimalFormat(sales.credits)}</Typography>
            </Box>
            <Typography sx={{fontWeight:'bold', fontSize: theme.spacing(1.6), color: (sales.credits - sales.debits) === 0 ? theme.palette.common.black : theme.palette.error.light }}>
                Diff:&nbsp;{toDecimalFormat(sales.credits - sales.debits)}
            </Typography>
            <BasicMaterialDialog parentMeta={meta} />
        </Box>)
}

export { Crown }