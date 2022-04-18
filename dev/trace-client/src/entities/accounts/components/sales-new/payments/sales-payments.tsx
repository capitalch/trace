import { _, Box, Button, CloseSharp, FormControlLabel, IconButton, IMegaData, LedgerSubledger, MegaDataContext, NumberFormat, Radio, RadioGroup, SalesVariety, TextField, Typography, useContext, useEffect, useState, useTheme } from '../redirect'

function SalesPayments() {
    const [, setRefresh] = useState({})
    const theme = useTheme()
    const megaData: IMegaData = useContext(MegaDataContext)
    const sales = megaData.accounts.sales

    useEffect(() => {
        // megaData.registerKeyWithMethod('render:salesPayments', setRefresh)
    }, [])

    return (
        <Box className='vertical' sx={{ p: 2, mr: 1, mb: 1, border: '1px solid lightGrey', maxWidth: theme.spacing(85) }}>
            <PaymentsHeader />
            <SalesVariety />
            <PaymentMethods />
            <ShipTo />
        </Box>)

    function PaymentsHeader() {
        const [, setRefresh] = useState({})

        useEffect(() => {
            megaData.registerKeyWithMethod('render:paymentsHeader', setRefresh)
        }, [])

        return (
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant='subtitle1' sx={{ textDecoration: 'underline', fontWeight: 'bold' }}>Payments</Typography>
                <Typography variant='body2' >{''.concat('Count: ', sales?.paymentMethods?.length || 0 + '')}</Typography>
                <Box sx={{ display: 'flex', }}>
                    <Button variant='text' onClick={doClear} sx={{ color: 'dodgerBlue', height: 20 }}>Clear</Button>
                    <Typography variant='body2' sx={{ fontWeight: 'bold' }}>{''.concat('Receipts:', ' ', (getTotalAmount() || 0 + ''))}</Typography>
                </Box>
            </Box>
        )

        function doClear() {
            megaData.executeMethodForKey('doClear:saleVariety')
            megaData.executeMethodForKey('doClear:paymentMethods')
        }

        function getTotalAmount() {
            const paymentMethods: any = sales.paymentMethods
            const total: any = paymentMethods.reduce((prev: any, current: any) =>
            ({
                amount: (prev.amount ?? 0) + (current.amount ?? 0)
            }), { amount: 0 })
            return (total.amount)
        }
    }

    function PaymentMethods() {
        const [, setRefresh] = useState({})
        const paymentMethods = sales.paymentMethods

        useEffect(() => {
            if (sales.paymentMethods.length === 0) {
                sales.paymentMethods.push({})
                setRefresh({})
            }
            megaData.registerKeyWithMethod('render:paymentMethods', setRefresh)
            megaData.registerKeyWithMethod('doClear:paymentMethods', doClear)
        }, [])

        useEffect(() => {
            megaData.executeMethodForKey('render:paymentsHeader', {})
        })

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

        function doClear() {
            paymentMethods.length = 0
            handleAddPaymentMethod()
        }

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
                                megaData.executeMethodForKey('render:paymentsHeader', {})
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
                // setRefresh({})
                megaData.executeMethodForKey('render:paymentMethods', {})
            }
        }
    }

    function ShipTo() {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                <Typography variant='subtitle2'>Ship to</Typography>
                <Box sx={{ display: 'flex' }}>
                    <Button size='medium' sx={{ color: theme.palette.lightBlue.main }}>New / Edit</Button>
                    <Button size='medium' sx={{ color: theme.palette.lightBlue.main }}>Clear</Button>
                </Box>
            </Box>)
    }
}
export { SalesPayments }