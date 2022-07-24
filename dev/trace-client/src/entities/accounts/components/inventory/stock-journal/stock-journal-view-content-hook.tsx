import {
    Box,
    genericUpdateMasterDetails, getFromBag, IMegaData, manageEntitiesState, MegaDataContext, moment, stockJournalMegaData, Typography, useConfirm, useContext, useEffect, useIbuki, useRef, useState, useTheme, utils, utilMethods
} from '../redirect'

function useStockJournalViewContent() {
    const megaData: IMegaData = useContext(MegaDataContext)
    const stockJournal = megaData.accounts.stockJournal
    const confirm = useConfirm()
    const { isControlDisabled, genericUpdateMaster, toDecimalFormat } = utilMethods()
    const { emit, filterOn } = useIbuki()
    const { getFromBag, setInBag, } = manageEntitiesState()
    const dateFormat = getFromBag('dateFormat')
    const { isAllowedUpdate, execSaleInvoiceView, getAccountClassWithAutoSubledger } = utils()
    const theme = useTheme()

    useEffect(() => {
        const { gridActionMessages } = getXXGridParams()
        emit(gridActionMessages.fetchIbukiMessage, null)
        const subs1 = filterOn(gridActionMessages.editIbukiMessage).subscribe((d: any) => {
            const { tranDate, clearDate, id1 } = d.data?.row
            if (isAllowedUpdate({ tranDate, clearDate })) {
                // loadSaleOnId(id1, true) // isModify; 2nd arg is true for no new entry in tables
            }
        })
        const subs2 = filterOn(gridActionMessages.deleteIbukiMessage).subscribe((d: any) => {
            const options: any = {
                // description: accountsMessages.transactionDelete,
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
        })
        const subs3 = filterOn(gridActionMessages.printIbukiMessage).subscribe((d: any) => {
            const row = d.data?.row
            // doPrintPreview(row.id1)
        })
        return (() => {
            subs1.unsubscribe()
            subs2.unsubscribe()
            subs3.unsubscribe()
        })
    }, [])


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
                headerName: 'Common remarks',
                description: 'Common remarks',
                field: 'remarks',
                width: 200,
            },
            {
                headerName: 'Product',
                description: 'Product details',
                // field: '1',
                width: 250,
                // renderCell: (params: any) => <Product params={params} />,
                valueGetter: (params: any) => `Pr code:${params.row.productCode} ${params.row.catName} ${params.row.brandName} ${params.row.label} ${params.row.info ?? ''}`
            },
            {
                headerName: 'Debits',
                description: 'Debits',
                field: 'debits',
                type: 'number',
                
                width: 70,
            },
            {
                headerName: 'Credits',
                description: 'Credits',
                field: 'credits',
                type: 'number',
                width: 70,
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
        ]
        const queryId = 'get_stock_journal_view'
        const queryArgs = {
            no: 100,
        }
        const summaryColNames: string[] = ['debits', 'credits']
        const specialColumns = {
            isEdit: true,
            isEditDisabled: isControlDisabled('salespurchases-simple-sales-edit'),
            isDelete: true,
            isDeleteDisabled: isControlDisabled('salespurchases-simple-sales-delete'),
            isPrint: true,
        }
        const gridActionMessages = {
            fetchIbukiMessage: 'XX-GRID-HOOK-FETCH-STOCK-JOURNAL-DATA',
            editIbukiMessage: 'STOCK-JOURNAL-VIEW-HOOK-XX-GRID-EDIT-CLICKED',
            deleteIbukiMessage: 'STOCK-JOURNAL-VIEW-HOOK-XX-GRID-DELETE-CLICKED',
            printIbukiMessage: 'STOCK-JOURNAL-VIEW-HOOK-XX-GRID-PRINT-CLICKED'
        }

        // function Product({ params }: any) {
        //     return (
        //         <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
        //             <Typography sx={{ fontSize: theme.spacing(1.7), fontWeight: 'bold' }}>{params.row.brandName}</Typography>
        //             {params.row.catName && <Typography sx={{ fontSize: theme.spacing(1.7) }}>&nbsp;{params.row.catName}</Typography>}
        //             {params.row.label && <Typography sx={{ display: 'inline-block', whiteSpace: 'pre-line', fontSize: theme.spacing(1.7) }}>&nbsp;{params.row.label}</Typography>}
        //         </Box>
        //     )
        // }

        // function ProductDetails({ params }: any) {
        //     return (
        //         <Typography sx={{ display: 'inline-block', whiteSpace: 'pre-line', fontSize: theme.spacing(1.6), }}>{params.row.info}</Typography>
        //     )
        // }
        return {
            columns,
            gridActionMessages,
            queryId,
            queryArgs,
            summaryColNames,
            specialColumns,
        }
    }
    return { getXXGridParams }
}

export { useStockJournalViewContent }