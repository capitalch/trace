import { Box, ItemsFooter, ItemsHeader, LineItems, } from '../redirect'
function Items() {
    // borderTop: '2px solid black', borderBottom: '2px solid black',
    return (<Box sx={{ display: 'flex', border: '1px solid lightGrey', p: 1, pt:0.5, flex: 1, mt: 0.5, ml: 0, mr: 0, }}>
        <Box className='vertical' sx={{ pl: 0, pt: .5, pb: 0, pr: 0, flex: 1 }}>
            <ItemsHeader />
            <LineItems />
            <ItemsFooter />
        </Box>
    </Box>)
}

export { Items }