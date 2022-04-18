import { Box, Button, MegaDataContext, useContext, useState, useTheme, } from './redirect'

function Crown() {
    const [, setRefresh] = useState({})
    const megaData = useContext(MegaDataContext)
    const sales = megaData.accounts.sales
    const theme = useTheme()
    sales.setRefreshCrown = setRefresh
    return (<Box className='vertical' sx={{ border: '1px solid lightGrey', m: 1, mt: 0, mb: 0, p: 1, display: 'flex', columnGap: 2, rowGap: 2 }}>
        <Button variant='contained' size='large' sx={{ height: theme.spacing(5), ml: 'auto' }} color='success'>Submit</Button>
        <Button variant='outlined' size='small' sx={{ height: theme.spacing(5) }} color='secondary'>View</Button>
        <Button variant='outlined' size='small' sx={{ height: theme.spacing(5), mt: 'auto' }} color='info' >Reset</Button>
    </Box>)
}

export { Crown }