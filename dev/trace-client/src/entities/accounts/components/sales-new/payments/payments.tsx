import _, { isEmpty } from 'lodash'
import { useEffect } from 'react'
import { Box, Button, CloseSharp, FormControlLabel, IconButton, IMegaData, LedgerSubledger, MegaDataContext, NumberFormat, Radio, RadioGroup, TextField, Typography, useContext, useState, useTheme } from '../redirect'

function Payments() {
    const [, setRefresh] = useState({})
    const theme = useTheme()
    const megaData: IMegaData = useContext(MegaDataContext)
    const sales = megaData.accounts.sales

    useEffect(() => {
        megaData.registerKeyWithMethod('render:payments', setRefresh)
    }, [])

    return (
        <Box className='vertical' sx={{ p: 2, mr: 1, mb: 1, border: '1px solid lightGrey', maxWidth: theme.spacing(85) }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant='subtitle1' sx={{ textDecoration: 'underline', fontWeight: 'bold' }}>Payments</Typography>
                <Typography variant='body2' >{''.concat('Count: ', sales?.paymentMethods?.length || 0 + '')}</Typography>
                <Typography variant='body2' sx={{ fontWeight: 'bold' }}>{''.concat('Receipts:', ' ', String(12345.00))}</Typography>
            </Box>
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
        const [, setRefresh] = useState({})
        // sales.filterMethodName = 'cashBank'
        useEffect(() => {
            sales.filterMethodName = 'cashBank'
        }, [])
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
            const logic: any = {
                r: 'cashBank',
                a: 'autoSubledgers',
                i: 'debtorsCreditors'
            }
            sales.saleVariety = variety
            sales.filterMethodName = logic[variety]
            megaData.executeMethodForKey('render:paymentMethods', {})
            setRefresh({})
        }
    }

    function PaymentMethods() {
        const [, setRefresh] = useState({})
        const paymentMethods = sales.paymentMethods || []

        useEffect(() => {
            if (sales.paymentMethods.length === 0) {
                sales.paymentMethods.push({})
                setRefresh({})
            }
            megaData.registerKeyWithMethod('render:paymentMethods', setRefresh)
        }, [])

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
                if (_.isEmpty(item.rowData)) {
                    item.rowData = {}
                }
                return (
                    <Box key={index} sx={{ display: 'flex', columnGap: 2, flexWrap: 'wrap', alignItems: 'center', rowGap: 2, }}>
                        {/* Select account */}
                        <Box className='vertical'>
                            <Typography variant='caption'>Debit account</Typography>
                            {/* <TextField /> */}
                            <LedgerSubledger rowData={item.rowData} ledgerFilterMethodName={sales.filterMethodName} showAutoSubledgerValues={false} />
                        </Box>
                        {/* Instr no  */}
                        <TextField label='Instr no' variant='standard' value={item.instrNo || ''} autoComplete='off'
                            sx={{ maxWidth: theme.spacing(15) }} onChange={(e: any) => { item.instrNo = e.target.value; setRefresh({}) }} />
                        {/* Amount */}
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
                            value={item.amount || ''}
                            onValueChange={(value: any) => {
                                const { floatValue } = value
                                item.amount = floatValue
                                setRefresh({})
                            }}
                            variant='standard' />

                        <IconButton size='small' color='error' onClick={() => handleDeleteRow(index)}>
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
export { Payments }