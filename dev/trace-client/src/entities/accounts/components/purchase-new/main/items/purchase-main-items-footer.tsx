import { Box, Button, Typography, useTheme } from "@mui/material"

function PurchaseMainItemsFooter() {
    const theme = useTheme()
    return (<Box sx={{ pt: 1, pb: 0, display: 'flex', flexWrap: 'wrap', rowGap: 1, alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-evenly', flexWrap: 'wrap', alignItems: 'center', columnGap: 2, rowGap: 3, }}>
            {/* Item search button */}
            <Button size='small' variant='contained' color='secondary'
            // onClick={handleItemSearch}
            >Item search</Button>
            {/* Count */}
            <Typography color={theme.palette.common.black} className='footer' >
                {/* {''.concat('Count: ', items.length)} */}
            </Typography>
            {/* Qty */}
            <Typography color={theme.palette.common.black} className='footer' >
                {/* {''.concat('Qty: ', toDecimalFormat(sales.summary.qty))} */}
            </Typography>
        </Box>
    </Box>)
}
export { PurchaseMainItemsFooter }