import { PdfStockJournal } from '../../pdf/vouchers/pdf-stock-journal'
import {
    execGenericView,
    IMegaData,
    MegaDataContext,
    PDFViewer,
    showPdf,
    useContext,
    useEffect,
    useIbuki,
    useRef,
    useState,
} from '../redirect'

import { StockJournalPdf } from './stock-journal-pdf'

function useStockJournalTotals() {
    const [, setRefresh] = useState({})
    const { emit } = useIbuki()
    const megaData: IMegaData = useContext(MegaDataContext)
    const meta: any = useRef({
        setRefresh: setRefresh,
        showDialog: false,
        dialogConfig: {
            title: 'Stock journal print preview',
            content: () => <></>,
            fullWidth:false,
        },
    })
    const pre = meta.current

    useEffect(() => {
        megaData.registerKeyWithMethod(
            'doPrintPreview:stockJournalTotals',
            doPrintPreview
        )
        megaData.registerKeyWithMethod('render:stockJournalTotals', setRefresh)
    }, [])

    async function fetchStockJournalOnId(id: number) {
        emit('SHOW-LOADING-INDICATOR', true)
        const ret = await execGenericView({
            isMultipleRows: false,
            sqlKey: 'getJson_stock_journal_on_id',
            args: {
                id: id,
            },
        })
        emit('SHOW-LOADING-INDICATOR', false)
        return ret
    }

    async function doPrintPreview(id: number) {
        const ret = await fetchStockJournalOnId(id)
        // const ret = await fetchStockJournalOnId(10516)
        if (ret) {
            const stockJournal = megaData.accounts.stockJournal
            stockJournal.selectedStockJournalRawData = ret?.jsonResult
            stockJournal.selectedStockJournalId = id
        }
        // await showPdf(meta, <StockJournalPdf mData={megaData} />)
        pre.dialogConfig.content = () =>
            <PDFViewer showToolbar={true} width={840} height={600}>
                <PdfStockJournal mData={megaData} />
            </PDFViewer>
        pre.showDialog = true
        setRefresh({})
    }
    return { doPrintPreview, meta }
}
export { useStockJournalTotals }
