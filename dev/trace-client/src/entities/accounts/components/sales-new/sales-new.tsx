import { Box, Typography, } from './redirect'
import { Customer } from './customer/customer'
import { Crown } from './crown'
import { SalesPayments } from './payments/sales-payments'
import { Items } from './items/items'
function SalesNew() {
    return (
        <Box sx={{ display: 'flex', flexGrow: 1, '& .vertical': { display: 'flex', flexDirection: 'column', }, '& .right-aligned': { '& input': { textAlign: 'end' } } }}>
            <Box className='vertical' sx={{ flexGrow: 1 }}>
                <Typography variant='subtitle1'>Sales</Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Customer />
                    <Crown />
                </Box>
                <Items />
                <SalesPayments />
            </Box>
        </Box>
    )
}
export { SalesNew }