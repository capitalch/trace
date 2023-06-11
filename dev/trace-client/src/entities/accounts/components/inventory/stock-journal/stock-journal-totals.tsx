import {
    _,
    Box,
    IconButton,
    IMegaData,
    MegaDataContext,
    Preview,
    Tooltip,
    Typography,
    useContext,
    useTraceMaterialComponents,
    utilMethods,
} from '../redirect'

import { useStockJournalTotals } from './stock-journal-totals-hook'
function StockJournalTotals() {
    const { toDecimalFormat } = utilMethods()
    const { BasicMaterialDialog } = useTraceMaterialComponents()
    const megaData: IMegaData = useContext(MegaDataContext)
    const stockJournal = megaData.accounts.stockJournal
    const { doPrintPreview, meta } = useStockJournalTotals()

    return (
        <Box sx={{ display: 'flex', fontWeight: 'bold', alignItems: 'center' }}>
            <Typography variant="body2">Input qty: </Typography>
            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                {toDecimalFormat(
                    stockJournal?.inputSection?.summary?.qty || 0.0
                )}{' '}
            </Typography>
            &nbsp;&nbsp;
            <Typography variant="body2">Output qty: </Typography>
            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                {toDecimalFormat(
                    stockJournal?.outputSection?.summary?.qty || 0.0
                )}{' '}
            </Typography>&nbsp;&nbsp;
            <Typography variant="body2">In amt: </Typography>
            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                {toDecimalFormat(
                    stockJournal?.inputSection?.summary?.amount || 0.0
                )}{' '}
            </Typography>
            &nbsp;&nbsp;
            <Typography variant="body2">Out amt: </Typography>
            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                {toDecimalFormat(
                    stockJournal?.outputSection?.summary?.amount || 0.0
                )}{' '}
            </Typography>&nbsp;&nbsp;
            <Typography variant="body2">Diff: </Typography>
            <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'red' }}>
                {toDecimalFormat(
                    (stockJournal?.inputSection?.summary?.amount - stockJournal?.outputSection?.summary?.amount) || 0.0
                )}{' '}
            </Typography>
            <Tooltip title="Preview">
                {/* preview button is only visible when global / getFromBag('rawSaleData') has value. not on meta.rawSaleData which is activated when preview icon is clicked in view grid */}
                {<IconButton
                    sx={{
                        ml: 1,
                        display: stockJournal.selectedStockJournalId
                            ? 'block'
                            : 'none',
                    }}
                    size="small"
                    disabled={false}
                    onClick={() =>
                        doPrintPreview(stockJournal.selectedStockJournalId)
                    }>
                    <Preview className="preview-icon" />
                </IconButton>}
            </Tooltip>
            <BasicMaterialDialog parentMeta={meta} />
        </Box>
    )
}

export { StockJournalTotals }
