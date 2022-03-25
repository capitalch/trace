import { Box, Button, CloseSharp, FormControlLabel, IconButton, LedgerSubledger, NumberFormat, Radio, TextField, Typography, useContext, useTheme } from './redirect'
import { useAccSales } from './acc-sales-hook'
import { useState } from 'react'
import { RadioGroup } from '@mui/material'

function AccSales() {
    const { handleTextChanged, megaData, setRefresh } = useAccSales()
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
                            <TextField variant='standard' value={sales.autoRefNo || ''}
                                onChange={(e: any) => handleTextChanged(sales, 'autoRefNo', e)} />
                        </Box>
                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                            <Typography variant='caption'>Date</Typography>
                            <TextField variant='standard' type='date' value={sales.tranDate || ''}
                                onChange={(e: any) => handleTextChanged(sales, 'tranDate', e)} />
                        </Box>
                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                            <Typography variant='caption'>User ref no</Typography>
                            <TextField variant='standard' value={sales.userRefNo || ''}
                                onChange={(e: any) => handleTextChanged(sales, 'userRefNo', e)} />
                        </Box>
                    </Box>

                    {/* Sales type / variety */}
                    <SaleVariety />

                    {/* Bill to */}
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Typography variant='subtitle2'>Bill to</Typography>
                        <Typography variant='caption'>Customer search</Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <TextField variant='standard' sx={{ flex: 0.95 }} />
                            <Button size='medium' sx={{ color: theme.palette.lightBlue.main }}>Search</Button>
                            <Button size='medium' sx={{ color: theme.palette.lightBlue.main }}>New / Edit</Button>
                            <Button size='medium' sx={{ color: theme.palette.lightBlue.main }}>Clear</Button>
                        </Box>
                    </Box>

                    {/* ship to */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', }}>
                        <Typography variant='subtitle2'>Ship to</Typography>
                        <Box sx={{ display: 'flex' }}>
                            <Button size='medium' sx={{ color: theme.palette.lightBlue.main }}>New / Edit</Button>
                            <Button size='medium' sx={{ color: theme.palette.lightBlue.main }}>Clear</Button>
                        </Box>
                    </Box>

                    {/* Gstin, remarks */}
                    <Box sx={{ display: 'flex', columnGap: 2 }}>
                        {/* Gstin */}
                        <TextField variant='standard' label='Gstin' value={sales.gstin || ''}
                            onChange={(e: any) => handleTextChanged(sales, 'gstin', e)} />
                        <TextField variant='standard' value={sales.commonRemarks || ''} label='Remarks' sx={{ flex: 2 }} onChange={(e: any) => handleTextChanged(sales, 'commonRemarks', e)} />
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
            <Box >
                <RadioGroup row>
                    <FormControlLabel
                        control={
                            <Radio
                                // disabled={arbitraryData.id} // in edit mode changeover is not allowed
                                onClick={(e: any) => {
                                    handleSaleVariety('r')
                                    // resetAddresses()
                                    // handleRetailCashBankSales()
                                }}
                                size="small"
                                color="secondary"
                                checked={sales.saleVariety === 'r'}
                            />
                        }
                        label="Retail sales"
                    />
                    <FormControlLabel
                        control={
                            <Radio
                                // disabled={arbitraryData.id} // in edit mode changeover is not allowed
                                onClick={(e: any) => {
                                    handleSaleVariety('a')
                                    // resetAddresses()
                                    // handleAutoSubledgerSales()
                                }}
                                size="small"
                                color="secondary"
                                checked={sales.saleVariety === 'a'}
                            />
                        }
                        label="Auto subledger sales"
                    />
                    <FormControlLabel
                        control={
                            <Radio
                                // disabled={arbitraryData.id} // in edit mode changeover is not allowed
                                onClick={(e: any) => {
                                    handleSaleVariety('i')
                                    // resetAddresses()
                                    // handleInstitutionSales()
                                }}
                                size="small"
                                color="secondary"
                                checked={sales.saleVariety === 'i'}
                            />
                        }
                        label="Institution sales"
                    />
                </RadioGroup>
            </Box>
            // </Box>
        )

        function handleSaleVariety(variety: string) {
            sales.saleVariety = variety
            setRefresh({})
        }
    }

    function PaymentMethods() {
        const [, setRefresh] = useState({})
        const list: any[] = [{},]
        const paymentMethods: any[] = sales.paymentMethods
        if (paymentMethods.length === 0) {
            paymentMethods.push({})
        }
        return (
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant='body2'>Payment methods</Typography>
                    <Button sx={{ color: theme.palette.lightBlue.main }} onClick={handleAddPaymentMethod}>Add</Button>
                </Box>
                <ItemRows itemList={list} />
            </Box>
        )

        function handleAddPaymentMethod() {
            list.push({})
            setRefresh({})
        }

        function ItemRows({ itemList }: any) {
            const itemRows = itemList.map(() => {
                return (
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', alignItems: 'center', rowGap: 1 }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                            <Typography variant='caption'>Debit account</Typography>
                            <LedgerSubledger rowData={{}} />
                        </Box>
                        <TextField label='Instr no' variant='standard' sx={{ flex: 0.4, minWidth: theme.spacing(7) }} />
                        <NumberFormat sx={{ flex: 0.4, minWidth: theme.spacing(7) }}
                            allowNegative={false}
                            customInput={TextField}
                            decimalScale={2}
                            fixedDecimalScale={true}
                            label='Amount'
                            onFocus={(e: any) => {
                                e.target.select()
                            }}
                            variant='standard' />

                        <IconButton size='small' color='error'>
                            <CloseSharp />
                        </IconButton>
                    </Box>)
            })
            return (itemRows)
        }
    }

}
export { AccSales }

// {/* <Box sx={{ display: 'flex' }}>
// {/* <TextField label='Instr no' variant='standard' sx={{ flex: '0.2' }} /> */}

// </Box> */}