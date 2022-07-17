import { Box, IMegaData, MegaDataContext, Typography, useContext, useEffect, useState, useTheme, utilMethods } from '../redirect'
function StockJournalTotals() {
    const [, setRefresh] = useState({})
    const { toDecimalFormat } = utilMethods()
    const theme = useTheme()
    const megaData: IMegaData = useContext(MegaDataContext)
    const stockJournal = megaData.accounts.stockJournal

    useEffect(() => {
        megaData.registerKeyWithMethod('render: StockJournalTotals', setRefresh)
    }, [])

    return (<Box sx={{ display: 'flex', fontWeight: 'bold' }}>
        <Typography variant='body2' >Input qty: </Typography>
        <Typography variant='body2' sx={{ fontWeight: 'bold' }}>{toDecimalFormat(stockJournal?.inputSection?.summary?.qty || 0.00)}  </Typography>
        &nbsp;&nbsp;
        <Typography variant='body2' >Output qty: </Typography>
        <Typography variant='body2' sx={{ fontWeight: 'bold' }}>{toDecimalFormat(stockJournal?.outputSection?.summary?.qty || 0.00)}  </Typography>
    </Box>)
}

export { StockJournalTotals }