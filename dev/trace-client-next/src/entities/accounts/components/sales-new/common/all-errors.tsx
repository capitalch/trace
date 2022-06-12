import { Box, errorMessages, IMegaData, manageEntitiesState, MegaDataContext, Typography, useContext, useEffect, useIbuki, useState, useTheme } from '../redirect'
function AllErrors() {
    const [, setRefresh] = useState({})
    const theme = useTheme()
    // const { getFromBag } = manageEntitiesState()
    const megaData: IMegaData = useContext(MegaDataContext)
    const sales = megaData.accounts.sales
    const allErrors = sales.allErrors
    const { filterOn } = useIbuki()

    useEffect(() => {
        megaData.registerKeyWithMethod('render:allErrors', setRefresh)
        const subs1 = filterOn('ALL-ERRORS-JUST-REFRESH').subscribe(() => setRefresh({}))
        return (() => {
            subs1.unsubscribe()
        })
    }, [])

    useEffect(() => {
        sales.isAnyError = Object.keys(allErrors).some((key: string) => allErrors[key])
        megaData.executeMethodForKey('render:crown', {})
        megaData.executeMethodForKey('render:debitsCreditsPreview', {})
    })

    setDebitsCreditsMismatchError()

    return (<Box sx={{ display: 'flex', flexDirection: 'column', border: '1px solid lightGrey', pl: 2, mt: .5, pt: 1, pb: 0.5, pr: 2, maxWidth: theme.spacing(30) }}>
        <Typography color={theme.palette.error.light} fontWeight='bold' sx={{ mt: 1, textDecoration: 'underline' }}>All errors</Typography>
        <Typography color='black' fontSize={theme.spacing(1.9)} fontWeight='bold' sx={{ mt: 1 }}>Customer</Typography>
        {allErrors.dateError ? <Typography color='error' fontSize={theme.spacing(1.7)}>&nbsp;&nbsp;&nbsp;{errorMessages.dateError}</Typography> : ''}
        {allErrors.gstinError ? <Typography color='error' fontSize={theme.spacing(1.7)}>&nbsp;&nbsp;&nbsp;{errorMessages.gstinError}</Typography> : ''}
        {allErrors.customerError ? <Typography color='error' fontSize={theme.spacing(1.7)}>&nbsp;&nbsp;&nbsp;{errorMessages.customerError}</Typography> : ''}
        <Typography color='black' fontSize={theme.spacing(1.9)} fontWeight='bold'>Items</Typography>
        {allErrors.productCodeError ? <Typography color='error' fontSize={theme.spacing(1.7)}>&nbsp;&nbsp;&nbsp;{errorMessages.productCodeError}</Typography> : ''}
        {allErrors.productDetailsError ? <Typography color='error' fontSize={theme.spacing(1.7)}>&nbsp;&nbsp;&nbsp;{errorMessages.productDetailsError}</Typography> : ''}
        {allErrors.hsnError ? <Typography color='error' fontSize={theme.spacing(1.7)}>&nbsp;&nbsp;&nbsp;{errorMessages.hsnError}</Typography> : ''}
        {allErrors.serialNumberError ? <Typography color='error' fontSize={theme.spacing(1.7)}>&nbsp;&nbsp;&nbsp;{errorMessages.serialNumberError}</Typography> : ''}
        {allErrors.gstRateError ? <Typography color='error' fontSize={theme.spacing(1.7)}>&nbsp;&nbsp;&nbsp;{errorMessages.gstRateError}</Typography> : ''}
        <Typography color='black' fontSize={theme.spacing(1.9)} fontWeight='bold'>Payments</Typography>
        {allErrors.accountCodeError ? <Typography color='error' fontSize={theme.spacing(1.7)}>&nbsp;&nbsp;&nbsp;{errorMessages.accountCodeError}</Typography> : ''}
        {allErrors.paymentAmountError ? <Typography color='error' fontSize={theme.spacing(1.7)}>&nbsp;&nbsp;&nbsp;{errorMessages.paymentAmountError}</Typography> : ''}
        <Typography color='black' fontSize={theme.spacing(1.9)} fontWeight='bold'>Ship to</Typography>
        {allErrors.shipToError ? <Typography color='error' fontSize={theme.spacing(1.7)}>&nbsp;&nbsp;&nbsp;{errorMessages.shipToError}</Typography> : ''}
        <Typography color='black' fontSize={theme.spacing(1.9)} fontWeight='bold'>Others</Typography>
        {allErrors.debitCreditMismatchError ? <Typography color='error' fontSize={theme.spacing(1.7)}>&nbsp;&nbsp;&nbsp;{errorMessages.debitCreditMismatchError}</Typography> : ''}
    </Box >)

    function setDebitsCreditsMismatchError() {
        sales.credits = sales.summary.amount
        sales.debits = megaData.executeMethodForKey('getTotalAmount:paymentsHeader')
        if (sales.credits === sales.debits) {
            allErrors.debitCreditMismatchError = undefined
        } else {
            allErrors.debitCreditMismatchError = errorMessages.debitCreditMismatchError
        }
    }

    // function setGstError() {
    //     const unitInfo = getFromBag('unitInfo')
    //     if(unitInfo.gstin){

    //     }
    // }

    // function getErrorString() {
    //     return (Object.values(allErrors).filter((x: any) => x).join(', ').replace(/^,/, ''))
    // }
}
export { AllErrors }