import { Box, Typography } from '../redirect'
import { StockJournalCrown } from './stock-journal-crown'
import { StockJournalHeader } from './stock-journal-header'
import { StockJournalItems } from './items/stock-journal-items'
function StockJournal() {
    return (
        <Box
            sx={{ '& .vertical': { display: 'flex', flexDirection: 'column', columnGap:2, rowGap:2 } }}
            className="vertical">
            <Typography variant="subtitle1">Stock journal</Typography>
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
            <StockJournalItems />
        </Box>
    )
}

export { StockJournal }
