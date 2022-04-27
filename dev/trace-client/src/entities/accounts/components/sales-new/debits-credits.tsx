import { useEffect } from 'react'
import { Box, Button, IMegaData, MegaDataContext, Typography, useContext, useTraceMaterialComponents, useState, useTheme, utilMethods } from './redirect'

function DebitsCredits() {
    const [, setRefresh] = useState({})
    const theme = useTheme()
    const { toDecimalFormat } = utilMethods()
    const megaData: IMegaData = useContext(MegaDataContext)
    const sales = megaData.accounts.sales

    useEffect(() => {
        megaData.registerKeyWithMethod('render:debitsCredits', setRefresh)
    }, [])

    return (<Box sx={{ display: 'flex', }}>
        <Typography variant='body2' sx={{  }}>Debits:&nbsp;{toDecimalFormat(sales.debits)}</Typography>
        <Typography variant='body2' sx={{  ml: 2 }}>Credits:&nbsp;{toDecimalFormat(sales.credits)}</Typography>
        <Typography variant='body2' sx={{ fontWeight: 'bold', ml: 2,  color: (sales.credits - sales.debits) === 0 ? theme.palette.common.black : theme.palette.error.light }}>
            Diff:&nbsp;{toDecimalFormat(sales.credits - sales.debits)}
        </Typography>
    </Box>)
}
export { DebitsCredits }