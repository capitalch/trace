import { Autocomplete } from '@mui/material'
import { itemLevelValidators } from '../../../../../shared-artifacts/item-level-validators'
import { _, Box, Button, CloseSharp, FormControlLabel, IconButton, IMegaData, InputLabel, LedgerSubledger, MegaDataContext, NumberFormat, PaymentsHeader, Radio, RadioGroup, PaymentsVariety, ShipTo, TextField, Typography, useContext, useEffect, useIbuki, useState, useTheme, errorMessages } from '../redirect'

function PaymentsMethods() {
    const [, setRefresh] = useState({})
    const theme = useTheme()
    const { emit, } = useIbuki()
    const megaData: IMegaData = useContext(MegaDataContext)
    const sales = megaData.accounts.sales
    const paymentMethodsList = sales.payments.paymentMethodsList
    const allErrors = sales.allErrors

    useEffect(() => {
        if (sales.payments.paymentMethodsList.length === 0) {
            handleAddPaymentMethod()
        }
        megaData.registerKeyWithMethod('render:paymentsMethods', setRefresh)
        megaData.registerKeyWithMethod('doClear:paymentsMethods', doClear)
        megaData.registerKeyWithMethod('setAmountForPayment:paymentMethods', setAmountForPayment)
    }, [])

    // useEffect(() => {
    //     megaData.executeMethodForKey('render:paymentsHeader', {})
    //     emit('ALL-ERRORS-JUST-REFRESH', null)
    // })
    // checkAllErrors()

    return (
        <Box className='vertical' sx={{ mt: 1, pt: 1, pb: 1, borderTop: '1px solid lightGrey', borderBottom: '1px solid lightGrey', }} >
            <Box sx={{ display: 'flex', }}>
                <Typography variant='body2' sx={{ fontWeight: 'bold', textDecoration: 'underline' }}>Payment methods</Typography>
                {/* Add button */}
                <Button variant='contained' size='small' color='secondary' sx={{ ml: 'auto' }} onClick={handleAddPaymentMethod}>Add</Button>
            </Box>
            <Methods />
        </Box>
    )

    // function checkAllErrors() {
    //     setAllErrors()
    //     function setAllErrors() {
    //         allErrors.accountCodeError = paymentMethodsList.some((row: any) => row?.rowData?.isLedgerSubledgerError) ? errorMessages['accountCodeError'] : ''
    //     }
    // }

    function doClear() {
        paymentMethodsList.length = 0
        handleAddPaymentMethod()
    }

    function handleAddPaymentMethod() {
        paymentMethodsList.push({ rowData: { isLedgerSubledgerError: true, }, ledgerFilterMethodName: 'cashBank' })
        setRefresh({})
    }

    function setAmountForPayment() {
        if (paymentMethodsList.length === 1) {
            paymentMethodsList[0].amount = sales.summary.amount
            setRefresh({})
        }
    }

    function Methods() {
        const [, setRefresh] = useState({})
        // checkAllErrors()

        useEffect(() => {
            megaData.executeMethodForKey('render:paymentsHeader', {})
            // emit('ALL-ERRORS-JUST-REFRESH', null)
        })

        return (<Box className='vertical' sx={{ rowGap: 1 }}>{
            paymentMethodsList.map((item: any, index: number) => <Method item={item} index={index} key={index} />)}</Box>)

        function Method({ item, index }: any) {
            const [, setRefresh] = useState({})
            if (_.isEmpty(item.rowData)) {
                item.rowData = {}
            }

            checkAllErrors()

            useEffect(() => {
                emit('ALL-ERRORS-JUST-REFRESH', null)
            })

            return (<Box sx={{ display: 'flex', columnGap: 2, flexWrap: 'wrap', alignItems: 'center', rowGap: 2, }}>
                {/* Select account */}
                <Box className='vertical'>
                    <Typography variant='body2'>Payment account</Typography>
                    {/* <TextField /> */}
                    <LedgerSubledger
                        rowData={item.rowData}
                        ledgerFilterMethodName={item.ledgerFilterMethodName}
                        onChange={() => handleOnChangeLedgerSubledger(index, item)}
                        showAutoSubledgerValues={false} />
                </Box>
                {/* Instr no  */}
                <TextField label='Instr no' variant='standard' value={item.instrNo || ''} autoComplete='off'
                    sx={{ maxWidth: theme.spacing(15) }} onChange={(e: any) => {
                        item.instrNo = e.target.value
                        setRefresh({})
                    }} />
                {/* Amount */}
                <NumberFormat sx={{ maxWidth: theme.spacing(15) }}
                    allowNegative={false}
                    autoComplete='off'
                    error={item.isAmountError}
                    thousandSeparator={true}
                    className='right-aligned'
                    customInput={TextField}
                    decimalScale={2}
                    fixedDecimalScale={true}
                    label='Amount'
                    onFocus={(e: any) => {
                        e.target.select()
                    }}
                    value={item.amount || 0.00}
                    onValueChange={(value: any) => {
                        const { floatValue } = value
                        item.amount = floatValue
                        megaData.executeMethodForKey('render:paymentsHeader', {})
                        setRefresh({})
                    }}
                    variant='standard' />
                {/* Remarks */}
                <TextField label='Remarks' variant='standard' value={item.remarks || ''} autoComplete='off'
                    sx={{ maxWidth: theme.spacing(18) }} onChange={(e: any) => {
                        item.remarks = e.target.value
                        setRefresh({})
                    }} />
                <IconButton size='small' color='error' onClick={() => handleDeleteRow(index, item)} sx={{ ml: 'auto' }}>
                    <CloseSharp />
                </IconButton>
            </Box>)

            function checkAllErrors() {
                item.isLedgerSubledgerError = item.rowData.isLedgerSubledgerError
                allErrors.accountCodeError = item.isLedgerSubledgerError ? errorMessages.accountCodeError : ''

                item.isAmountError = item.amount ? false : true
                allErrors.paymentAmountError = item.isAmountError ? errorMessages.paymentAmountError : ''
            }
        }

        // function checkAllErrors() {

        // }

        function handleDeleteRow(index: number, item: any) {
            if (index === 0) {
                item.remarks = undefined
                item.instrNo = undefined
                item.amount = 0
                item.rowData = { isLedgerSubledgerError: true }
                setRefresh({})
                // doClear()
                // item.instrNo = undefined
            } else {
                paymentMethodsList.splice(index, 1)
                if (item.id) {
                    sales.payments.deletedIds.push(item.id)
                }
                megaData.executeMethodForKey('render:paymentsMethods', {})
            }
        }

        function handleOnChangeLedgerSubledger(index: number, item: any) {
            if ((index === 0) && (sales.paymentVariety === 'i')) { // for institution sales only
                megaData.executeMethodForKey('getItems:populateInstitutionAddress', item.rowData.accId)
            }
            setRefresh({})
        }
    }

}

export { PaymentsMethods }