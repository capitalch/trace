import { Box, Button, IMegaData, MegaDataContext, useContext, useState, useTheme, } from '../redirect'
import { useCrown } from './crown-hook'

function Crown() {
    const [, setRefresh] = useState({})
    const megaData: IMegaData = useContext(MegaDataContext)
    const sales = megaData.accounts.sales
    const theme = useTheme()
    const { handleReset, handleSubmit } = useCrown()
    // sales.setRefreshCrown = setRefresh

    return (<Box className='vertical' sx={{ border: '1px solid lightBlue', ml: 2, mt: 0, mb: 0, p: 1, display: 'flex', columnGap: 2, rowGap: 2 }}>
        <Button variant='contained' onClick={handleSubmit} size='large' sx={{ height: theme.spacing(5), ml: 'auto', }} disabled={sales.isAnyError} color='success'>Submit</Button>
        <Button variant='outlined' size='small' sx={{ height: theme.spacing(5) }} color='secondary'>View</Button>
        <Button variant='outlined' onClick={handleReset} size='small' sx={{ height: theme.spacing(5), mt: 'auto' }} color='info' >Reset</Button>
    </Box>)
}

export { Crown }