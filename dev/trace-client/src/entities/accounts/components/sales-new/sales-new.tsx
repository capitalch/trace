import { Box, Typography, useTheme } from './redirect'
import { Customer } from './customer/customer'
import { Crown } from './crown'
import { Payments } from './payments'
import { Items } from './items/items'
function SalesNew() {
    // const theme = useTheme()
    return (
        <Box sx={{ display: 'flex', flexGrow: 1, '& .vertical': { display: 'flex', flexDirection: 'column', }, '& .right-aligned': { '& input': { textAlign: 'end' } } }}>
            <Box className='vertical' sx={{ flexGrow: 1 }}>
                <Typography variant='subtitle1' sx={{  }}>Sales</Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Customer />
                    <Crown />
                </Box>
                <Items />
                <Payments />
            </Box>
        </Box>
    )
}
export { SalesNew }