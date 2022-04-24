import { Box, errorMessages, IMegaData, MegaDataContext, Typography, useContext, useEffect, useIbuki, useState, useTheme } from './redirect'
function AllErrors() {
    const [, setRefresh] = useState({})
    const theme = useTheme()
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
    })

    setDebitsCreditsAndMismatchError()

    return (<Box sx={{ display: 'flex', flexDirection: 'column', mr: 0, mb: 1, pl: 2, pt: 0.5, pb: 0.5, pr: 2, flex: 1, border: '1px solid lightBlue' }}>
        <Typography color='black' fontSize={theme.spacing(1.9)} fontWeight='bold'>Customer</Typography>
        {allErrors.dateError ? <Typography color='error' fontSize={theme.spacing(1.7)}>&nbsp;&nbsp;&nbsp;{errorMessages.dateError}</Typography> : ''}
        {allErrors.gstinError ? <Typography color='error' fontSize={theme.spacing(1.7)}>&nbsp;&nbsp;&nbsp;{errorMessages.gstinError}</Typography> : ''}
        {allErrors.customerError ? <Typography color='error' fontSize={theme.spacing(1.7)}>&nbsp;&nbsp;&nbsp;{errorMessages.customerError}</Typography> : ''}
        <Typography color='black' fontSize={theme.spacing(1.9)} fontWeight='bold'>Items</Typography>
        {allErrors.productCodeError ? <Typography color='error' fontSize={theme.spacing(1.7)}>&nbsp;&nbsp;&nbsp;{errorMessages.productCodeError}</Typography> : ''}
        {allErrors.hsnError ? <Typography color='error' fontSize={theme.spacing(1.7)}>&nbsp;&nbsp;&nbsp;{errorMessages.hsnError}</Typography> : ''}
        {allErrors.serialNumberError ? <Typography color='error' fontSize={theme.spacing(1.7)}>&nbsp;&nbsp;&nbsp;{errorMessages.serialNumberError}</Typography> : ''}
        <Typography color='black' fontSize={theme.spacing(1.9)} fontWeight='bold'>Payments</Typography>
        {allErrors.accountCodeError ? <Typography color='error' fontSize={theme.spacing(1.7)}>&nbsp;&nbsp;&nbsp;{errorMessages.accountCodeError}</Typography> : ''}
        <Typography color='black' fontSize={theme.spacing(1.9)} fontWeight='bold'>Others</Typography>
        {allErrors.debitCreditMismatchError ? <Typography color='error' fontSize={theme.spacing(1.7)}>&nbsp;&nbsp;&nbsp;{errorMessages.debitCreditMismatchError}</Typography> : ''}
    </Box >)

    function setDebitsCreditsAndMismatchError() {
        sales.credits = sales.summary.amount
        sales.debits = megaData.executeMethodForKey('getTotalAmount:paymentsHeader')
        if (sales.credits === sales.debits) {
            allErrors.debitCreditMismatchError = undefined
        } else {
            allErrors.debitCreditMismatchError = errorMessages.debitCreditMismatchError
        }
    }

    // function getErrorString() {
    //     return (Object.values(allErrors).filter((x: any) => x).join(', ').replace(/^,/, ''))
    // }
}
export { AllErrors }