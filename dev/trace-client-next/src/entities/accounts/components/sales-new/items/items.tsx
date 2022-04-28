import { Box, ItemsFooter, ItemsHeader, LineItems, } from '../redirect'
function Items() {
    return (<Box sx={{ display: 'flex', flex: 1,  ml: 0,mr:0,  }}>
        <Box className='vertical' sx={{ pl: 0, pt: .5, pb: 0,pr:0, flex: 1 }}>
            <ItemsHeader />
            <LineItems />
            <ItemsFooter />
        </Box>
    </Box>)
}

export { Items }