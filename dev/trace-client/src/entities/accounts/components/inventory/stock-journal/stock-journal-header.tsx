import {
    accountsMessages,
    Box,
    MegaDataContext,
    TextField,
    Typography,
    useContext,
    useState,
    useTheme,
    utils,
} from '../redirect'

function StockJournalHeader() {
    const [, setRefresh] = useState({})
    const theme = useTheme()
    const megaData = useContext(MegaDataContext)
    const stockJournal = megaData.accounts.stockJournal
    const allErrors = stockJournal.allErrors
    const { isInvalidDate } = utils()
    checkAllErrors()
    return (
        <Box
            sx={{
                display: 'flex',
                flexWrap: 'wrap',
                columnGap: 4,
                rowGap: 2,
                p: 2,
                borderTop:'1px solid lightGrey',
                // border: '1px solid lightGrey',
            }}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Typography variant="body2">Ref no</Typography>

                {/* ref no */}
                <Typography
                    variant="body2"
                    sx={{
                        fontWeight: 'bold',
                        mt: 2,
                        width: theme.spacing(10),
                    }}>
                    {stockJournal.autoRefNo}
                </Typography>
            </Box>

            {/* tran date */}
            <Box className="vertical">
                <Typography variant="body2">Date</Typography>
                <TextField
                    variant="standard"
                    type="date"
                    value={stockJournal.tranDate || ''}
                    error={Boolean(allErrors['dateError'])}
                    helperText={allErrors['dateError']}
                    onChange={(e: any) => {
                        stockJournal.tranDate = e.target.value
                        setRefresh({})
                    }}
                />
            </Box>

            {/* User ref no */}
            <Box className="vertical" sx={{ maxWidth: theme.spacing(17) }}>
                <Typography variant="body2">User ref no</Typography>
                <TextField
                    variant="standard"
                    value={stockJournal.userRefNo || ''}
                    sx={{ maxWidth: theme.spacing(24) }}
                    autoComplete="off"
                    onChange={(e: any) => handleTextChanged('userRefNo', e)}
                />
            </Box>
            
            {/* Remarks */}
            <Box
                className="vertical"
                sx={{ maxWidth: theme.spacing(45), ml: 1 }}>
                <Typography variant="body2">Remarks</Typography>
                <TextField
                    variant="standard"
                    value={stockJournal.remarks || ''}
                    autoComplete="off"
                    onChange={(e: any) => handleTextChanged('remarks', e)}
                />
            </Box>
        </Box>
    )

    function checkAllErrors() {
        dateError()
        function dateError() {
            const ret =
                isInvalidDate(stockJournal.tranDate) || !stockJournal.tranDate
                    ? accountsMessages['dateError']
                    : ''
            allErrors['dateError'] = ret
        }
    }

    function handleTextChanged(propName: string, e: any) {
        stockJournal[propName] = e.target.value
        setRefresh({})
    }
}

export { StockJournalHeader }
