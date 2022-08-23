import { Customer } from './customer/customer'
import { RDebitsCreditsPreview } from './debits-credits-preview.tsx/r-debits-credits-preview'
import { Box, Typography } from './redirect'
function SalesRecoil() {
    return(
        <Box sx={{ '& .vertical': { display: 'flex', flexDirection: 'column', }, '& .right-aligned': { '& input': { textAlign: 'end' } } }}>
            <Box className='vertical' sx={{ flex: 1 }} >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems:'center' }}>
                    <Typography variant='subtitle1'>Sales</Typography>
                    <RDebitsCreditsPreview />
                </Box>
                <Box sx={{ display: 'flex', flexWrap: 'wrap-reverse', rowGap: 2, justifyContent: 'space-between' }}>
                    <Customer />
                    {/* <Crown /> */}
                </Box>
                {/* <Items />
                <Box sx={{ display: 'flex', flexWrap: 'wrap', rowGap: 1, columnGap: 1, }}>
                    <Payments />
                    <AllErrors />
                </Box> */}
            </Box>
        </Box>
    )
}
export { SalesRecoil }
