import {
    accountsMessages,
    axios,
    Box,
    execGenericView,
    IMegaData,
    manageEntitiesState,
    MegaDataContext,
    moment,
    stockJournalMegaData,
    Typography,
    useConfirm,
    useContext,
    useEffect,
    useIbuki,
    useRef,
    useState,
    utils,
    utilMethods,
} from '../redirect'
// import { StockJournalPdf } from './stock-journal-pdf'

function useStockJournalViewContent() {
    const [, setRefresh] = useState({})
    const megaData: IMegaData = useContext(MegaDataContext)
    const confirm = useConfirm()
    const { isControlDisabled, genericUpdateMaster } = utilMethods()
    const { emit, filterOn } = useIbuki()
    const { getFromBag } = manageEntitiesState()
    const dateFormat = getFromBag('dateFormat')
    const { isAllowedUpdate } = utils()

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
        const { gridActionMessages } = getXXGridParams()
        emit(gridActionMessages.fetchIbukiMessage, null)
        const subs1 = filterOn(gridActionMessages.editIbukiMessage).subscribe(
            (d: any) => {
                const { tranDate, clearDate, id1 } = d.data?.row
                if (isAllowedUpdate({ tranDate, clearDate })) {
                    populateStockJournalOnId(id1) // isModify; 2nd arg is true for no new entry in tables
                }
            }
        )
        const subs2 = filterOn(gridActionMessages.deleteIbukiMessage).subscribe(
            (d: any) => {
                const options: any = {
                    description: accountsMessages.transactionDelete,
                    confirmationText: 'Yes',
                    cancellationText: 'No',
                }
                const { tranDate, clearDate, id1 } = d.data?.row
                if (isAllowedUpdate({ tranDate, clearDate })) {
                    confirm(options)
                        .then(async () => {
                            const id = id1
                            emit('SHOW-LOADING-INDICATOR', true)
                            await genericUpdateMaster({
                                deletedIds: [id],
                                tableName: 'TranH',
                            })
                            emit('SHOW-LOADING-INDICATOR', false)
                            emit('SHOW-MESSAGE', {})
                            emit(gridActionMessages.fetchIbukiMessage, null)
                        })
                        .catch(() => { }) // important to have otherwise eror
                }
            }
        )
        const subs3 = filterOn(gridActionMessages.printIbukiMessage).subscribe(
            (d: any) => {
                const row = d.data?.row
                megaData.executeMethodForKey(
                    'doPrintPreview:stockJournalTotals',
                    row.id1
                )
            }
        )
        return () => {
            subs1.unsubscribe()
            subs2.unsubscribe()
            subs3.unsubscribe()
        }
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

    async function populateStockJournalOnId(id: number) {
        const ret = await fetchStockJournalOnId(id)
        if (ret) {
            megaData.accounts.stockJournal = stockJournalMegaData()
            const stockJournal = megaData.accounts.stockJournal
            stockJournal.selectedStockJournalRawData = ret?.jsonResult
            stockJournal.selectedStockJournalId = id
            prepareStockJournalData(ret, stockJournal)

        }
        // populate megaData.acounts.stockJournal from database
        function prepareStockJournalData(data: any, stockJournal: any) {
            const res = data?.jsonResult
            loadTranH(res)
            loadStockJournal(res)
            megaData.executeMethodForKey('closeDialog:stockJournalCrown')
            megaData.executeMethodForKey('render:stockJournal', {})
            megaData.executeMethodForKey(
                'computeSummary:stockJournalItemsFooter:inputSection'
            )
            megaData.executeMethodForKey(
                'computeSummary:stockJournalItemsFooter:outputSection'
            )

            function loadTranH(res: any) {
                const tranH = res.tranH
                stockJournal.autoRefNo = tranH.autoRefNo
                stockJournal.id = tranH.id
                stockJournal.remarks = tranH.remarks
                stockJournal.tranDate = tranH.tranDate
                stockJournal.userRefNo = tranH.userRefNo
            }

            function loadStockJournal(res: any) {
                const sj: any[] = res?.stockJournal
                const stockJournalInputs: any[] = sj.filter(
                    (el: any) => el.dc === 'C'
                )
                stockJournal.inputSection.items = []
                stockJournalInputs.forEach((el: any, ind: number) => {
                    stockJournal.inputSection.items.push({})
                    stockJournal.inputSection.items[ind].id = el.id
                    stockJournal.inputSection.items[ind].productId =
                        el.productId
                    stockJournal.inputSection.items[ind].productCode =
                        el.productCode
                    stockJournal.inputSection.items[ind].label = el.label
                    stockJournal.inputSection.items[ind].catName = el.catName
                    stockJournal.inputSection.items[ind].info = el.info
                    stockJournal.inputSection.items[ind].qty = el.qty
                    stockJournal.inputSection.items[ind].price = el.price
                    stockJournal.inputSection.items[ind].serialNumbers =
                        el.serialNumbers
                    stockJournal.inputSection.items[ind].lineRefNo =
                        el.lineRefNo
                    stockJournal.inputSection.items[ind].lineRemarks =
                        el.lineRemarks
                    stockJournal.inputSection.items[ind].productDetails =
                        ''.concat(
                            el.brandName,
                            ' ',
                            el.catName,
                            ' ',
                            el.label,
                            ' ',
                            el.info
                        )
                    stockJournal.inputSection.items[ind].amount = el.qty * el.price
                })
                const stockJournaloutputs: any[] = sj.filter(
                    (el: any) => el.dc === 'D'
                )
                stockJournal.outputSection.items = []
                stockJournaloutputs.forEach((el: any, ind: number) => {
                    stockJournal.outputSection.items.push({})
                    stockJournal.outputSection.items[ind].id = el.id
                    stockJournal.outputSection.items[ind].productId =
                        el.productId
                    stockJournal.outputSection.items[ind].productCode =
                        el.productCode
                    stockJournal.outputSection.items[ind].label = el.label
                    stockJournal.outputSection.items[ind].catName = el.catName
                    stockJournal.outputSection.items[ind].info = el.info
                    stockJournal.outputSection.items[ind].qty = el.qty
                    stockJournal.outputSection.items[ind].price = el.price
                    stockJournal.outputSection.items[ind].serialNumbers =
                        el.serialNumbers
                    stockJournal.outputSection.items[ind].lineRefNo =
                        el.lineRefNo
                    stockJournal.outputSection.items[ind].lineRemarks =
                        el.lineRemarks
                    stockJournal.outputSection.items[ind].productDetails =
                        ''.concat(
                            el.brandName,
                            ' ',
                            el.catName,
                            ' ',
                            el.label,
                            ' ',
                            el.info
                        )
                    stockJournal.outputSection.items[ind].amount = el.qty * el.price
                })
            }
        }
    }

    function getXXGridParams() {
        const columns = [
            {
                headerName: '#',
                description: 'Index',
                field: 'id',
                // type: 'number',
                width: 60,
                disableColumnMenu: true,
            },
            {
                headerName: 'Id',
                description: 'Id',
                field: 'id1',
                // type: 'number',
                width: 90,
            },
            {
                headerName: 'Pr. code',
                description: 'Product code',
                field: 'productCode',
                // type: 'number',
                width: 90,
            },
            {
                headerName: 'Date',
                description: 'Date',
                field: 'tranDate',
                width: 100,
                type: 'date',
                valueFormatter: (params: any) =>
                    moment(params.value).format(dateFormat),
            },
            {
                headerName: 'Ref no',
                description: 'Ref no',
                field: 'autoRefNo',
                width: 130,
            },
            {
                headerName: 'User ref no',
                description: 'User ref no',
                field: 'userRefNo',
                width: 150,
            },
            {
                headerName: 'Product',
                description: 'Product details',
                field: '',
                width: 200,
                valueGetter: (params: any) =>
                    `${params.row.catName} ${params.row.brandName} ${params.row.label
                    } ${params.row.info ?? ''}`,
            },
            {
                headerName: 'Credits (Input)',
                description: 'Credits',
                field: 'credits',
                type: 'number',
                valueGetter: (params: any) => params.row.credits || '',
                renderHeader: (params: any) => (
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            mt: 0.5,
                            mb: 0.5,
                        }}>
                        <Typography variant="body2">Input</Typography>
                        <Typography variant="body2">(Credits)</Typography>
                    </Box>
                ),
                width: 75,
            },
            {
                headerName: 'Output',
                description: 'Debits',
                field: 'debits',
                type: 'number',
                valueGetter: (params: any) => params.row.debits || '',
                renderHeader: (params: any) => (
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            mt: 0.5,
                            mb: 0.5,
                        }}>
                        <Typography variant="body2">Output</Typography>
                        <Typography variant="body2">(Debits)</Typography>
                    </Box>
                ),
                width: 70,
            },
            {
                headerName: 'Common remarks',
                description: 'Common remarks',
                field: 'remarks',
                width: 200,
            },
            {
                headerName: 'Line ref no',
                description: 'Line ref no',
                field: 'lineRefNo',
                width: 200,
            },
            {
                headerName: 'Line remarks',
                description: 'Line remarks',
                field: 'lineRemarks',
                width: 200,
            },
            {
                headerName: 'Serial numbers',
                description: 'Serial numbers',
                field: 'serialNumbers',
                width: 200,
            },
        ]
        const queryId = 'get_stock_journal_view'
        const queryArgs = {
            no: 100,
        }
        const summaryColNames: string[] = ['debits', 'credits']
        const specialColumns = {
            isEdit: true,
            isEditDisabled: isControlDisabled('inventory-stock-journal-edit'),
            isDelete: true,
            isDeleteDisabled: isControlDisabled(
                'inventory-stock-journal-delete'
            ),
            isPrint: true,
        }
        const gridActionMessages = {
            fetchIbukiMessage: 'XX-GRID-HOOK-FETCH-STOCK-JOURNAL-DATA',
            editIbukiMessage: 'STOCK-JOURNAL-VIEW-HOOK-XX-GRID-EDIT-CLICKED',
            deleteIbukiMessage:
                'STOCK-JOURNAL-VIEW-HOOK-XX-GRID-DELETE-CLICKED',
            printIbukiMessage: 'STOCK-JOURNAL-VIEW-HOOK-XX-GRID-PRINT-CLICKED',
        }

        return {
            columns,
            gridActionMessages,
            queryId,
            queryArgs,
            summaryColNames,
            specialColumns,
        }
    }

    return { getXXGridParams, meta }
}

export { useStockJournalViewContent }
