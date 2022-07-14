import { Box, Button, Typography, useTheme } from '../redirect'
function StockJournalCrown() {
    const theme = useTheme()
    return (
        <Box sx={{ mt: 0, mb: 0, display: 'flex', flexDirection: 'column', ml: 'auto' }}>
            <Box sx={{ display: 'flex', columnGap: .5, rowGap: 1, }}>
                <Button variant='contained'
                    // onClick={handleReset} 
                    size='small' sx={{ height: theme.spacing(5), }} color='warning' >Reset</Button>
                <Button variant='contained'
                    // onClick={handleViewSalesDialog} 
                    size='small' sx={{ height: theme.spacing(5) }} color='secondary'>View</Button>
                <Button variant='contained'
                    // onClick={handleSubmit} 
                    size='large' sx={{ height: theme.spacing(5), }} 
                    // disabled={sales.isAnyError} 
                    color='success'>Submit</Button>
            </Box>
            {/* <BasicMaterialDialog parentMeta={meta}             /> */}
        </Box>
    )
}

export { StockJournalCrown }