import { Box, Button, FormControlLabel, Radio } from '@mui/material'
import './comp1.scss'
function Comp1() {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <FormControlLabel
                control={
                    <Radio
                        // disabled={arbitraryData.id} // in edit mode changeover is not allowed
                        onClick={(e: any) => {
                            // handleSaleVariety('r')
                            // resetAddresses()
                            // handleRetailCashBankSales()
                        }}
                        size="small"
                        color="secondary"
                    // checked={arbitraryData.saleVariety === 'r'}
                    />
                }
                label="Retail sales"
            />
            <FormControlLabel
                control={
                    <Radio
                        // disabled={arbitraryData.id} // in edit mode changeover is not allowed
                        onClick={(e: any) => {
                            // handleSaleVariety('a')
                            // resetAddresses()
                            // handleAutoSubledgerSales()
                        }}
                        size="small"
                        color="secondary"
                    // checked={arbitraryData.saleVariety === 'a'}
                    />
                }
                label="Auto subledger sales"
            />
            <FormControlLabel
                control={
                    <Radio
                        // disabled={arbitraryData.id} // in edit mode changeover is not allowed
                        onClick={(e: any) => {
                            // handleSaleVariety('i')
                            // resetAddresses()
                            // handleInstitutionSales()
                        }}
                        size="small"
                        color="secondary"
                    // checked={arbitraryData.saleVariety === 'i'}
                    />
                }
                label="Institution sales"
            />
        </Box>
    )
}
export { Comp1 }
