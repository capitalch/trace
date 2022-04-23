import { fontWeight } from '@mui/system'
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

    return (<Box sx={{ display: 'flex', flexDirection: 'column', mr: 1, mb: 1, pl: 2, pt: 0.5, pb: 0.5, pr: 2, flex: 1, border: '1px solid lightBlue' }}>
        <Typography color='secondary' fontSize={theme.spacing(1.9)} fontWeight='bold'>Customer:</Typography>
        {allErrors.dateError ? <Typography color='error' fontSize={theme.spacing(1.7)}>&nbsp;&nbsp;&nbsp;{errorMessages.dateError}</Typography> : ''}
        {allErrors.gstinError ? <Typography color='error' fontSize={theme.spacing(1.7)}>&nbsp;&nbsp;&nbsp;{errorMessages.gstinError}</Typography> : ''}
        {allErrors.customerError ? <Typography color='error' fontSize={theme.spacing(1.7)}>&nbsp;&nbsp;&nbsp;{errorMessages.customerError}</Typography> : ''}
        <Typography color='secondary' fontSize={theme.spacing(1.9)} fontWeight='bold'>Items:</Typography>
        {allErrors.productCodeError ? <Typography color='error' fontSize={theme.spacing(1.7)}>&nbsp;&nbsp;&nbsp;{errorMessages.productCodeError}</Typography> : ''}
        {allErrors.hsnError ? <Typography color='error' fontSize={theme.spacing(1.7)}>&nbsp;&nbsp;&nbsp;{errorMessages.hsnError}</Typography> : ''}
        {allErrors.serialNumberError ? <Typography color='error' fontSize={theme.spacing(1.7)}>&nbsp;&nbsp;&nbsp;{errorMessages.serialNumberError}</Typography> : ''}
        <Typography color='secondary' fontSize={theme.spacing(1.9)} fontWeight='bold'>Payments:</Typography>
        {allErrors.accountCodeError ? <Typography color='error' fontSize={theme.spacing(1.7)}>&nbsp;&nbsp;&nbsp;{errorMessages.accountCodeError}</Typography> : ''}
    </Box >)

    // return (<Box sx={{ mr: 1, mb: 1, pl: 2, pt: 0.5, pb: 0.5, pr: 2, fontWeight: 'bold', color: theme.palette.error.light, fontSize: theme.spacing(1.7), border: '1px solid lightBlue', flex: 1, }}>
    //     {getErrorString()}
    // </Box>)

    function getErrorString() {
        return (Object.values(allErrors).filter((x: any) => x).join(', ').replace(/^,/, ''))
    }
}
export { AllErrors }