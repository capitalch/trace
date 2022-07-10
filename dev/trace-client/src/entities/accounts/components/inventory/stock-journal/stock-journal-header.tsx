import { Box, MegaDataContext, TextField, Typography, useContext, useTheme } from '../redirect'
function StockJournalHeader() {
    const sales: any = {}
    const theme = useTheme()
    const megaData = useContext(MegaDataContext)
    const stockJournal = megaData.accounts.stockJournal
    return <Box sx={{ display: 'flex', flexWrap: 'wrap', columnGap: 4, rowGap: 2, alignItems: 'center', border: '1px solid lightGrey', p:2,   }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', flexWrap: 'wrap', rowGap: 2, columnGap: 2 }}>
            <Typography variant='subtitle1' >Ref no</Typography>
            {/* ref no */}
            <Typography variant='body2' sx={{ fontWeight: 'bold', 
            position:'relative', bottom:8 }}>STJ/11/2222</Typography>
        </Box>
        {/* tran date */}
        <Box className='vertical'>
            <Typography variant='body2'>Date</Typography>
            <TextField variant='standard' type='date' value={stockJournal.tranDate || '' }
            // error={Boolean(allErrors['dateError'])}
            // helperText={allErrors['dateError']}
            // onChange={(e: any) => { sales.tranDate = e.target.value; setRefresh({}) }} 
            />
        </Box>
        {/* User ref no */}
        <Box className='vertical' sx={{ maxWidth: theme.spacing(12) }}>
            <Typography variant='body2'>User ref no</Typography>
            <TextField variant='standard' value={sales.userRefNo || ''} sx={{ maxWidth: theme.spacing(16) }} autoComplete='off'
            // onChange={(e: any) => handleTextChanged('userRefNo', e)} 
            />
        </Box>
        {/* Remarks */}
        <Box className='vertical' sx={{ maxWidth: theme.spacing(18), width: theme.spacing(18) }}>
            <Typography variant='body2'>Remarks</Typography>
            <TextField variant='standard' value={sales.commonRemarks || ''} autoComplete='off' 
            // onChange={(e: any) => handleTextChanged('commonRemarks', e)} 
            />
        </Box>
    </Box>
}

export { StockJournalHeader }