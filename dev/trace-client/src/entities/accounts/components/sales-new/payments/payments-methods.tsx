import { _, Box, Button, CloseSharp, FormControlLabel, IconButton, IMegaData,InputLabel, LedgerSubledger, MegaDataContext, NumberFormat, PaymentsHeader, Radio, RadioGroup, PaymentsVariety, ShipTo, TextField, Typography, useContext, useEffect, useIbuki, useState, useTheme, errorMessages } from '../redirect'

function PaymentsMethods() {
    const [, setRefresh] = useState({})
    const theme = useTheme()
    const { emit, } = useIbuki()
    const megaData: IMegaData = useContext(MegaDataContext)
    const sales = megaData.accounts.sales
    const paymentMethodsList = sales.paymentMethodsList
    const allErrors = sales.allErrors

    useEffect(() => {
        if (sales.paymentMethodsList.length === 0) {
            handleAddPaymentMethod()
        }
        megaData.registerKeyWithMethod('render:paymentsMethods', setRefresh)
        megaData.registerKeyWithMethod('doClear:paymentsMethods', doClear)
        megaData.registerKeyWithMethod('setAmountForPayment:paymentMethods', setAmountForPayment)
    }, [])

    useEffect(() => {
        megaData.executeMethodForKey('render:paymentsHeader', {})
        emit('ALL-ERRORS-JUST-REFRESH', null)
    })
    checkAllErrors()

    return (
        <Box className='vertical' sx={{mt:1,p:1, border:'1px solid lightGrey'}} >
            <Box sx={{ display: 'flex', alignItems: 'center', }}>
                <Typography variant='body2' sx={{fontWeight:'bold'}}>Payment methods</Typography>
                {/* Add button */}
                <Button variant='outlined' size='small' color='secondary' sx={{ ml: 'auto' }} onClick={handleAddPaymentMethod}>Add</Button>
            </Box>
            <Methods />
        </Box>
    )

    function checkAllErrors() {
        setAllErrors()
        // emit('ALL-ERRORS-JUST-REFRESH', null)

        // function checkAllPaymentRows() {
        //     for (const row of paymentMethodsList) {
        //         row.isAccountCodeError = row.rowData.isLedgerSubledgerError
        //     }
        // }

        function setAllErrors() {
            allErrors.accountCodeError = paymentMethodsList.some((row: any) => row?.rowData?.isLedgerSubledgerError) ? errorMessages['accountCodeError'] : ''
        }
    }

    function doClear() {
        paymentMethodsList.length = 0
        handleAddPaymentMethod()
    }

    function handleAddPaymentMethod() {
        paymentMethodsList.push({ rowData: { isLedgerSubledgerError: true } })
        setRefresh({})
    }

    function Methods() {
        const [, setRefresh] = useState({})
        const methods: any[] = paymentMethodsList.map((item: any, index: number) => {
            if (_.isEmpty(item.rowData)) {
                item.rowData = {}
            }
            return (
                <Box key={index} sx={{ display: 'flex', columnGap: 2, flexWrap: 'wrap', alignItems: 'center', rowGap: 2, }}>
                    {/* Select account */}
                    <Box className='vertical'>
                        <Typography variant='caption'>Debit account</Typography>
                        {/* <TextField /> */}
                        <LedgerSubledger rowData={item.rowData}
                            ledgerFilterMethodName={(index === 0) ? sales.filterMethodName : 'cashBank'}
                            onChange={() => handleOnChangeLedgerSubledger(index, item)}
                            showAutoSubledgerValues={false} />
                    </Box>
                    {/* Instr no  */}
                    <TextField label='Instr no' variant='standard' value={item.instrNo || ''} autoComplete='off'
                        sx={{ maxWidth: theme.spacing(15) }} onChange={(e: any) => { item.instrNo = e.target.value; setRefresh({}) }} />
                    {/* Amount */}
                    <NumberFormat sx={{ maxWidth: theme.spacing(18) }}
                        allowNegative={false}
                        autoComplete='off'
                        thousandSeparator={true}
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
                    <IconButton size='small' color='error' onClick={() => handleDeleteRow(index)} sx={{ ml: 'auto' }}>
                        <CloseSharp />
                    </IconButton>
                </Box>)

        })
        return (<Box className='vertical' sx={{ rowGap: 1 }}>{methods}</Box>)

        function handleDeleteRow(index: number) {
            if (index === 0) {
                doClear()
            } else {
                paymentMethodsList.splice(index, 1)
                megaData.executeMethodForKey('render:paymentsMethods', {})
            }
        }

        function handleOnChangeLedgerSubledger(index: number, item: any) {
            if ((index === 0) && (sales.paymentVariety === 'i')) { // for institution sales only
                megaData.executeMethodForKey('getItems:populateInstitutionAddress', item.rowData.accId)
            }
            // setRefresh({})
            megaData.executeMethodForKey('render:paymentsMethods', {})
        }
    }

    function setAmountForPayment() {
        if (paymentMethodsList.length === 1) {
            paymentMethodsList[0].amount = sales.summary.amount
            setRefresh({})
        }
    }
}

export { PaymentsMethods }