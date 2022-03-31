import { Box, Button, CloseSharp, FormControlLabel, IconButton, NumberFormat, Radio, RadioGroup, TextField, Typography, useContext, MegaDataContext, useState, useTheme } from './redirect'

function PaymentsInfo() {
    const [, setRefresh] = useState({})
    const theme = useTheme()
    const megaData = useContext(MegaDataContext)
    const sales = megaData.accounts.sales
    return (
        <Box className='vertical' sx={{ p: 2, ml: 1, mr: 1, mb: 1, backgroundColor: theme.palette.grey[200], border: '1px solid lightGrey', maxWidth: theme.spacing(70) }}>
            <Typography variant='subtitle2' sx={{ textDecoration: 'underline' }}>Payments info</Typography>
            <SaleVariety />
            <PaymentMethods />
            {/* ship to */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                <Typography variant='subtitle2'>Ship to</Typography>
                <Box sx={{ display: 'flex' }}>
                    <Button size='medium' sx={{ color: theme.palette.lightBlue.main }}>New / Edit</Button>
                    <Button size='medium' sx={{ color: theme.palette.lightBlue.main }}>Clear</Button>
                </Box>
            </Box>
        </Box>)

    function SaleVariety() {
        return (
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
        const paymentMethods = sales.paymentMethods || []
        if (paymentMethods.length === 0) {
            paymentMethods.push({})
        }
        return (
            <Box className='vertical' >
                <Box sx={{ display: 'flex', alignItems: 'center', }}>
                    <Typography variant='body2'>Payment methods</Typography>
                    {/* Add button */}
                    <Button sx={{ color: theme.palette.lightBlue.main, ml: 'auto' }} onClick={handleAddPaymentMethod}>Add</Button>
                </Box>
                <Payments paymentMethodsList={paymentMethods} />
            </Box>
        )

        function handleAddPaymentMethod() {
            paymentMethods.push({})
            setRefresh({})
        }

        function Payments({ paymentMethodsList }: any) {
            const [, setRefresh] = useState({})
            const payments: any[] = paymentMethodsList.map((item: any, index: number) => {
                return (
                    <Box key={index} sx={{ display: 'flex', columnGap: 2, flexWrap: 'wrap', alignItems: 'center', rowGap: 2, }}>
                        <Box className='vertical'>
                            <Typography variant='caption'>Debit account</Typography>
                            <TextField />
                            {/* <LedgerSubledger rowData={{}} /> */}
                        </Box>
                        <TextField label='Instr no' variant='standard' value={item.instrNo || ''} autoComplete='off'
                            sx={{ maxWidth: theme.spacing(15) }} onChange={(e: any) => { item.instrNo = e.target.value; setRefresh({}) }} />
                        <NumberFormat sx={{ maxWidth: theme.spacing(18) }}
                            allowNegative={false}
                            autoComplete='off'
                            className='right-aligned'
                            customInput={TextField}
                            decimalScale={2}
                            fixedDecimalScale={true}
                            label='Amount'
                            onFocus={(e: any) => {
                                e.target.select()
                            }}
                            variant='standard' />

                        <IconButton sx={{ mt: -6, ml: -5, }} size='small' color='error' onClick={() => handleDeleteRow(index)}>
                            <CloseSharp />
                        </IconButton>
                    </Box>)

            })
            return (<Box className='vertical' sx={{ rowGap: 1 }}>{payments}</Box>)

            function handleDeleteRow(index: number) {
                if (paymentMethodsList.length === 1) {
                    return
                }
                paymentMethodsList.splice(index, 1)
                setRefresh({})
            }
        }
    }
}
export { PaymentsInfo }