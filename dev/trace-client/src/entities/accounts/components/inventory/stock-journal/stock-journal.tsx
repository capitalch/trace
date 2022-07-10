import { Box, Typography } from '../redirect'
import { StockJournalCrown } from './stock-journal-crown'
import { StockJournalHeader } from './stock-journal-header'
function StockJournal() {

    return (<Box sx={{ '& .vertical': { display: 'flex', flexDirection: 'column' } }} className='vertical'>
        <Typography variant='subtitle1'>Stock journal</Typography>
        <Box sx = {{display:'flex', alignItems:'flex-start', columnGap:2, mt:1}}>
            <StockJournalHeader />
            <StockJournalCrown />
        </Box>



    </Box>)
}

export { StockJournal }