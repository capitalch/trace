import { Box, Typography, useTheme } from './redirect'
import { CustomerInfo } from './customer-info'
import { Crown } from './crown'
import { PaymentsInfo } from './payments-info'
import { ProductsInfo } from './products-info'
function SalesNew() {
    const theme = useTheme()
    return (
        <Box sx={{ display: 'flex', flexGrow: 1, '& .vertical': { display: 'flex', flexDirection: 'column', }, '& .right-aligned': { '& input': { textAlign: 'end' } } }}>
            <Box className='vertical' sx={{ flexGrow: 1 }}>
                <Typography variant='subtitle1' sx={{ ml: 1 }}>Sales</Typography>
                <Box sx={{ display: 'flex' }}>
                    <CustomerInfo />
                    <Crown />
                </Box>
                <ProductsInfo />
                <PaymentsInfo />
            </Box>
        </Box>
    )
}
export { SalesNew }