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
        const subs1 = filterOn('ALL-ERRORS-JUST-REFRESH').subscribe(() => setRefresh({}))
        return (() => {
            subs1.unsubscribe()
        })
    }, [])
    // display: 'flex', columnGap: 1, flexWrap: 'wrap', color: theme.palette.error.light, rowGap:1 
    return (<Box sx={{ pl: 2, pr:2, fontWeight:'bold', color: theme.palette.error.light, fontSize: theme.spacing(1.7) }}>
        {getErrorString()}
    </Box>)

    function getErrorString() {
        return (Object.values(allErrors).filter((x:any)=>x).join(', ').replace(/^,/, ''))
    }
}
export { AllErrors }