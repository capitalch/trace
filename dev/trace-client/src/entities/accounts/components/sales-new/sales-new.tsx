import { AllErrors, Box, Typography, } from './redirect'
import { Customer } from './customer/customer'
import { Crown } from './crown/crown'
import { Payments } from './payments/payments'
import { Items } from './items/items'
import { useSalesNew } from './sales-new-hook'
import { DebitsCreditsPreview } from './common/debits-credits-preview'
function SalesNew() {
    useSalesNew()
    return (
        <Box sx={{ '& .vertical': { display: 'flex', flexDirection: 'column', }, '& .right-aligned': { '& input': { textAlign: 'end' } } }}>
            <Box className='vertical' sx={{ flex: 1 }} >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems:'center' }}>
                    <Typography variant='subtitle1'>Sales</Typography>
                    <DebitsCreditsPreview />
                </Box>
                <Box sx={{ display: 'flex', flexWrap: 'wrap-reverse', rowGap: 2, justifyContent: 'space-between' }}>
                    <Customer />
                    <Crown />
                </Box>
                <Items />
                <Box sx={{ display: 'flex', flexWrap: 'wrap', rowGap: 1, columnGap: 1, }}>
                    <Payments />
                    <AllErrors />
                </Box>
            </Box>
        </Box>
    )
}

export { SalesNew }