import {
    execGenericView,
    IMegaData,
    MegaDataContext,
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
        if (ret) {
            const stockJournal = megaData.accounts.stockJournal
            stockJournal.selectedStockJournalRawData = ret?.jsonResult
            stockJournal.selectedStockJournalId = id
        }
        await showPdf(meta, <StockJournalPdf mData={megaData} />)
        // await showPdf(meta, <div style={{height:'300px'}}>PDF test</div>)

    }
    return { doPrintPreview, meta }
}
export { useStockJournalTotals }
