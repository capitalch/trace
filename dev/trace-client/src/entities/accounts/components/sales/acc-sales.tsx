import { Box, MegaDataContext, Button, FormControlLabel, Radio, TextField, Typography, useContext } from './redirect'
import { useAccSales } from './acc-sales-hook'

function AccSales() {
    const { megaData, setRefresh } = useAccSales()
    const sales = megaData.accounts.sales
    return (
        <Box sx={{ display: 'flex' }}>
            {/* Left */}
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Typography variant='subtitle2' component='div'>Sales</Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', border: '4px solid orange', p: 2, rowGap: 2 }}>
                    {/* 1st row sale type */}
                    <SaleVariety />


                    {/* 2nd row left */}
                    <Box sx={{ display: 'flex', columnGap: 2, rowGap: 1, mt: 1 }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                            <Typography variant='caption'>Ref no</Typography>
                            <TextField variant='standard' />
                        </Box>
                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                            <Typography variant='caption'>Date</Typography>
                            <TextField variant='standard' type='date' />
                        </Box>
                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                            <Typography variant='caption'>User ref no</Typography>
                            <TextField variant='standard' />
                        </Box>
                    </Box>
                    {/* 3rd row */}
                    <Box sx={{ display: 'flex', columnGap: 2 }}>
                        {/* Gstin */}
                        <TextField variant='standard' label='Gstin' value={sales.gstin}
                            onChange={(e: any) => {
                                sales.gstin = e.target.value || ''
                            }} />
                        <TextField variant='standard' label='Remarks' sx={{ flex: 2 }} />
                    </Box>
                    {/* 4th row */}
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Typography variant='subtitle2'>Bill to</Typography>
                        <Typography variant='caption'>Customer search</Typography>
                        <Box sx={{ display: 'flex' }}>
                            <TextField variant='standard' sx={{ flex: 2 }} />
                            <Button variant='contained' size='small' >Search</Button>
                            <Button >New / Edit</Button>
                            <Button >Clear</Button>
                        </Box>
                    </Box>
                </Box>
            </Box>

            {/* Right */}
            <Box>

            </Box>
        </Box>
    )
    // const arbitraryData: any = {}
    function SaleVariety() {
        return (
            // <Box sx={{ display: 'flex', flexDirection:'row'}}>
                <Box sx={{ disply: 'flex', flexDirection: 'column', minHeight: '10rem' }}>
                    <TextField />
                    <TextField />
                    {/* <FormControlLabel
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
                    /> */}
                </Box>
              

        )
    }
}
export { AccSales }