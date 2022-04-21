import { Box, errorMessages, IMegaData, MegaDataContext, Typography, useContext, useEffect, useIbuki, useState, useTheme } from './redirect'
function AllErrors() {
    const [, setRefresh] = useState({})
    const theme = useTheme()
    const megaData: IMegaData = useContext(MegaDataContext)
    const sales = megaData.accounts.sales
    const allErrors = sales.allErrors
    const { filterOn } = useIbuki()

    useEffect(() => {
        // setRefresh({})
        megaData.registerKeyWithMethod('render:allErrors', setRefresh)
        const subs1 = filterOn('ALL-ERRORS-JUST-REFRESH').subscribe(() => setRefresh({}))
        return (() => {
            subs1.unsubscribe()
        })
    }, [])
    
    return (<Box sx={{ml:1, pl: 2, pr: 2, fontWeight: 'bold', color: theme.palette.error.light, fontSize: theme.spacing(1.7), border: '1px solid orange' }}>
        {getErrorString()}
    </Box>)

    function getErrorString() {
        return (Object.values(allErrors).filter((x: any) => x).join(', ').replace(/^,/, ''))
    }
}
export { AllErrors }