import { Box, Button, FormControlLabel, LedgerSubledger, NumberFormat, Radio, TextField, Typography, useContext, useTheme } from './redirect'
import { useAccSales } from './acc-sales-hook'
import { useState } from 'react'

function AccSales() {
    const { megaData, setRefresh } = useAccSales()
    const sales = megaData.accounts.sales
    const theme = useTheme()
    return (
        <Box sx={{ display: 'flex' }}>
            {/* Left */}
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Typography variant='subtitle2' component='div'>Sales</Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', border: '4px solid orange', p: 2, rowGap: 2 }}>

                    {/* Ref no, date, user ref no*/}
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

                    {/* Sales type / variety */}
                    <SaleVariety />

                    {/* Bill to */}
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Typography variant='subtitle2'>Bill to</Typography>
                        <Typography variant='caption'>Customer search</Typography>
                        <Box sx={{ display: 'flex' }}>
                            <TextField variant='standard' sx={{ flex: 2 }} />
                            <Button variant='contained' size='small' sx={{ ml: 2 }} >Search</Button>
                            <Button >New / Edit</Button>
                            <Button >Clear</Button>
                        </Box>
                    </Box>

                    {/* ship to */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', }}>
                        <Typography variant='subtitle2'>Ship to</Typography>
                        <Box sx={{ display: 'flex' }}>
                            <Button >New / Edit</Button>
                            <Button >Clear</Button>
                        </Box>
                    </Box>

                    {/* Gstin, remarks */}
                    <Box sx={{ display: 'flex', columnGap: 2 }}>
                        {/* Gstin */}
                        <TextField variant='standard' label='Gstin' value={sales.gstin}
                            onChange={(e: any) => {
                                sales.gstin = e.target.value || ''
                            }} />
                        <TextField variant='standard' label='Remarks' sx={{ flex: 2 }} />
                    </Box>

                    <PaymentMethods />
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
            // <Box sx={{ display: 'flex' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
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
            // </Box>
        )
    }

    function PaymentMethods() {
        const [, setRefresh] = useState({})
        const list: any[] = [{},]

        return (
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant='body2'>Payment methods</Typography>
                    <Button sx={{ color: theme.palette.lightBlue.main }}>Add</Button>
                </Box>
                <ItemRows itemList={list} />
            </Box>
        )

        function ItemRows({ itemList }: any) {
            const itemRows = itemList.map(() => {
                return (
                    <Box sx={{ disply: 'flex' , flexWrap:'wrap', flexDirection:'row'}} key={1} >
                        {/* <Box sx={{ display: 'flex', flexDirection: 'column', width:'50%' }}>
                            <Typography variant='caption'>Debit account</Typography>
                           
                        </Box> */}
                        <Box sx={{width:'50%'}}>
                        <TextField label='Instr no' variant='standard' sx={{ flex: '0.2' }} />
                        <TextField label='Instr no' variant='standard' sx={{ flex: '0.2' }} />
                        </Box>
                        
                        <LedgerSubledger rowData={{}}   />
                    </Box>
                )
            })
            return (itemRows)
        }
    }

}
export { AccSales }

// {/* <Box sx={{ display: 'flex' }}>
// {/* <TextField label='Instr no' variant='standard' sx={{ flex: '0.2' }} /> */}
// <NumberFormat sx={{ flex: '0.2' }}
//     allowNegative={false}
//     customInput={TextField}
//     decimalScale={2}
//     fixedDecimalScale={true}
//     onFocus={(e: any) => {
//         e.target.select()
//     }}
//     variant='standard' />
// </Box> */}