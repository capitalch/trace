import { Box, Typography } from '../redirect'
import { StockJournalCrown } from './stock-journal-crown'
import { StockJournalHeader } from './stock-journal-header'
import { StockJournalDetails } from './stock-journal-details'
import { StockJournalTotals } from './stock-journal-totals'
function StockJournal() {
    return (
        <Box
            sx={{
                '& .vertical': {
                    display: 'flex',
                    flexDirection: 'column',
                    columnGap: 2,
                },
                '& .right-aligned': { '& input': { textAlign: 'end' } },
            }}
            className="vertical">
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="subtitle1" >Stock journal</Typography>
                <StockJournalTotals />
            </Box>
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    columnGap: 2,
                    mt: 1,
                }}>
                <StockJournalHeader />
                <StockJournalCrown />
            </Box>
            {/* <Typography>Test</Typography> */}
            <StockJournalDetails />
        </Box>
    )
}

export { StockJournal }