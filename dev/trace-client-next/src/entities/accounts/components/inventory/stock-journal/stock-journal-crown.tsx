import { Box, Button, IMegaData, MegaDataContext, useContext, useEffect, useState, useTheme } from '../redirect'
import { useStockJournalCrown } from './stock-journal-crown-hook'

function StockJournalCrown() {
    const [, setRefresh] = useState({})
    const theme = useTheme()
    const { handleReset, handleSubmit } = useStockJournalCrown()
    const megaData: IMegaData = useContext(MegaDataContext)
    const stockJournal = megaData.accounts.stockJournal

    useEffect(() => {
        megaData.registerKeyWithMethod('render:stockJournalCrown', setRefresh)
    }, [])

    return (
        <Box sx={{ mt: 0, mb: 0, display: 'flex', flexDirection: 'column', ml: 'auto' }}>
            <Box sx={{ display: 'flex', columnGap: .5, rowGap: 1, }}>
                <Button variant='contained'
                    onClick={handleReset}
                    size='small' sx={{ height: theme.spacing(5), }} color='warning' >Reset</Button>
                <Button variant='contained'
                    // onClick={handleViewSalesDialog} 
                    size='small' sx={{ height: theme.spacing(5) }} color='secondary'>View</Button>
                <Button variant='contained'
                    onClick={handleSubmit} 
                    size='large' sx={{ height: theme.spacing(5), }}
                    disabled={isAnyError()}
                    color='success'>Submit</Button>
            </Box>
            {/* <BasicMaterialDialog parentMeta={meta}             /> */}
        </Box>
    )

    function isAnyError() {
        const allErrorsInput = stockJournal['inputSection']?.allErrors
        const isInputError = Object.keys(allErrorsInput).some((key: string) => allErrorsInput[key])

        const allErrorsOutput = stockJournal['outputSection']?.allErrors
        const isOutputError = Object.keys(allErrorsOutput).some((key: string) => allErrorsOutput[key])

        const headerError = stockJournal?.allErrors
        const isHeaderError = Object.keys(headerError).some((key: string) => headerError[key])

        return (isInputError || isOutputError || isHeaderError)
    }
}

export { StockJournalCrown }