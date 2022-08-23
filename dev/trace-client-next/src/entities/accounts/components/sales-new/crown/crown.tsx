import { Box, Button, IMegaData, MegaDataContext, useContext, useTraceMaterialComponents,  useTheme } from '../redirect'
import { useCrown } from './crown-hook'

function Crown() {
    const megaData: IMegaData = useContext(MegaDataContext)
    const sales = megaData.accounts.sales
    const theme = useTheme()
    const { BasicMaterialDialog } = useTraceMaterialComponents()
    const { handleReset, handleViewSalesDialog, handleSubmit, meta } = useCrown()

    return (
        <Box sx={{ mt: 0, mb: 0, display: 'flex', flexDirection: 'column', ml:'auto' }}>
            <Box sx={{ display: 'flex', columnGap: .5, rowGap: 1, }}>
                <Button variant='contained' onClick={handleReset} size='small' sx={{ height: theme.spacing(5), }} color='warning' >Reset</Button>
                <Button variant='contained' onClick={handleViewSalesDialog} size='small' sx={{ height: theme.spacing(5) }} color='secondary'>View</Button>
                <Button variant='contained' onClick={handleSubmit} size='large' sx={{ height: theme.spacing(5), }} disabled={sales.isAnyError} color='success'>Submit</Button>
            </Box>
            <BasicMaterialDialog parentMeta={meta} />
        </Box>)
}

export { Crown }