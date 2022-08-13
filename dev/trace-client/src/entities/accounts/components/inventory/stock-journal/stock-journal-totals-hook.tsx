import {
    axios,
    execGenericView,
    IMegaData,
    MegaDataContext,
    renderToStaticMarkup,
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
        await showPdf(<StockJournalPdf mData={megaData} />)
        // megaData.accounts.stockJournal.selectedStockJournalId = undefined
        // megaData.executeMethodForKey('render:stockJournalTotals',{})
    }

    // Transfer this function to global utils
    async function showPdf(content: any) {
        // const htmlString = renderToString(content)
        const htmlString = renderToStaticMarkup(content)
        emit('SHOW-LOADING-INDICATOR', true)
        const options: any = await axios({
            method: 'post',
            url: 'http://localhost:8081/pdf1',
            data: {
                template: htmlString,
            },
        })

        const buff = options.data.data
        const buffer = Buffer.from(buff)

        const base64 = buffer.toString('base64')
        pre.objectUrl = 'data:application/pdf;base64, ' + base64
        emit('SHOW-LOADING-INDICATOR', false)
        pre.showDialog = true
        pre.dialogConfig.content = () => (
            <div>
                {
                    <object
                        data={pre.objectUrl}
                        type="application/pdf"
                        width="100%"
                        height="700">
                        <p>Failed</p>
                    </object>
                }
            </div>
        )
        pre.setRefresh({})
    }

    return { doPrintPreview, meta }
}
export { useStockJournalTotals }
