import { Box, ItemsFooter, ItemsHeader, LineItems, } from '../redirect'
function Items() {
    return (<Box sx={{ display: 'flex', flex: 1, border: '1px solid orange', m: 1, ml: 0, height: '100%' }}>
        <Box className='vertical' sx={{ pl: 2, pt: 1, pb: 0,pr:1, flex: 1 }}>
            <ItemsHeader />
            <LineItems />
            <ItemsFooter />
        </Box>
    </Box>)
}

export { Items }