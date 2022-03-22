import { Box, TextField } from './redirect'
import { useAccSales } from './acc-sales-hook'

function AccSales() {
    const { } = useAccSales()
    return (
        <Box sx={{ display: 'flex' }}>
            {/* Left */}
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                {/* 1st row left */}
                <Box display={'flex'}>
                    <TextField variant='standard' label='Ref no' placeholder='Ref no' />
                    <TextField variant='standard' label = 'date' placeholder='date' type='date' />
                    <TextField variant='standard' label = 'User ref' />
                </Box>
            </Box>
            {/* Right */}
            <Box>

            </Box>
        </Box>
    )
}
export { AccSales }