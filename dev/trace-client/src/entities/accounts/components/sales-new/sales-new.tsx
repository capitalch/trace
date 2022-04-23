import { AllErrors, Container, Box, Paper, Typography, } from './redirect'
import { Customer } from './customer/customer'
import { Crown } from './crown'
import { Payments } from './payments/payments'
import { Items } from './items/items'

function SalesNew() {
    return (
        <Box sx={{ '& .vertical': { display: 'flex', flexDirection: 'column', }, '& .right-aligned': { '& input': { textAlign: 'end' } } }}>
            <Box className='vertical' sx={{ flex: 1 }} >
                <Typography variant='subtitle1'>Sales</Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap-reverse', rowGap: 2 }}>
                    <Customer />
                    {/* <AllErrors /> */}
                    <Crown />
                </Box>
                <Items />
                <Box sx={{ display: 'flex', flexWrap: 'wrap', rowGap: 1, columnGap: 1 }}>
                    <Payments />
                    <AllErrors />
                </Box>
            </Box>
        </Box>
    )
}

export { SalesNew }