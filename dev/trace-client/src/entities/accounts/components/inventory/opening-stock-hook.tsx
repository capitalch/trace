import { moment, useEffect, useRef, useSharedElements, } from './redirect'
import messages from '../../../../messages.json'
function useOpeningStock() {
    // const [, setRefresh] = useState({})
    const { globalMessages, confirm, emit, execGenericView, filterOn, genericUpdateMaster, getFromBag, toDecimalFormat } = useSharedElements()
    const meta = useRef({
        title: 'Opening stock (New / Edit)',
    })
    const actionMessages = getXXGriArtifacts().actionMessages
    const dateFormat = getFromBag('dateFormat')

    useEffect(() => {
        const subs1 = filterOn(actionMessages.deleteIbukiMessage).subscribe(handleDelete)
        return (() => {
            subs1.unsubscribe()
        })
    }, [])

    function getXXGriArtifacts() {
        const sqlQueryId = 'getJson_opening_stock'
        const jsonFieldPath = 'jsonResult.openingStock'
        const sqlQueryArgs = {}
        const actionMessages = {
            fetchIbukiMessage: 'XX-GRID-HOOK-FETCH-OPENING-STOCK',
            editIbukiMessage: 'OPENING-STOCK-XX-GRID-EDIT-CLICKED',
            deleteIbukiMessage: 'OPENING-STOCK-XX-GRID-DELETE-CLICKED'
        }
        const summaryColNames: any[] = []
        const specialColumns = {
            isEdit: true,
            isDelete: true,
        }
        const columns: any[] = [
            {
                headerName: 'Ind',
                description: 'Index',
                field: 'id',
                width: 60,
                disableColumnMenu: true,
                footerName: 'aaa'
            },
            { headerName: 'Id', field: 'id1', width: 70 },
            {
                headerName: 'Category',
                description: 'Category',
                field: 'catName',
                width: 150,
            },
            {
                headerName: 'Brand',
                description: 'Brand',
                field: 'brandName',
                width: 150,
            },
            {
                headerName: 'Label',
                description: 'Label',
                field: 'label',
                width: 200,
            },

            {
                headerName: 'Qty',
                description: 'Qty',
                field: 'qty',
                type: 'number',
                width: 70,
            },
            {
                headerName: 'Op price',
                description: 'Opening price',
                field: 'openingPrice',
                type: 'number',
                valueFormatter: (params: any) => toDecimalFormat(params.value),
                width: 140,
            },
            {
                headerName: 'Purch dt',
                description: 'Last purchase date',
                field: 'lastPurchaseDate',
                type: 'date',
                valueFormatter: (params: any) =>
                    moment(params.value).format(dateFormat),
                width: 110,
            },
            {
                headerName: 'Info',
                description: 'Info',
                field: 'info',
                width: 250,
            },
        ]

        return ({ actionMessages, columns, jsonFieldPath, meta, sqlQueryArgs, sqlQueryId, summaryColNames, specialColumns, })
    }

    function handleDelete(d: any) {
        const toDeleteId = d?.data?.row?.id1
        const options = {
            description: globalMessages.deleteConfirm,
            confirmationText: 'Yes',
            cancellationText: 'No',
        }
        if (toDeleteId) {
            confirm(options)
                .then(async () => {
                    await genericUpdateMaster({
                        deletedIds: [toDeleteId],
                        tableName: 'ProductOpBal',
                    })
                    emit('SHOW-MESSAGE', {})
                    emit(actionMessages.fetchIbukiMessage, '')
                })
                .catch(() => { }) // important to have otherwise eror
        } else {
            emit('SHOW-MESSAGE', {
                message: globalMessages.deleteError,
                severity: 'error',
                duration: null,
            })
        }
    }

    function handleStockTransferToNextYear() {
        const options = {
            description: globalMessages.stockTransferMessage,
            confirmationText: 'Yes',
            cancellationText: 'No',
        }
        const finYearId = getFromBag('finYearObject')?.finYearId
        const endDate = getFromBag('finYearObject')?.isoEndDate
        const branchId = getFromBag('branchObject')?.branchId
        confirm(options)
            .then(async () => {
                emit(actionMessages.fetchIbukiMessage, '')
                const ret = await execGenericView({
                    sqlKey: 'exec_stock_transfer',
                    args: {
                        branchId: branchId,
                        finYearId: finYearId,
                        closingDate: endDate
                    },
                    isMultipleRows: true
                })
                if (ret) {
                    emit('SHOW-MESSAGE', {})
                }
            })
            .catch(() => { }) // important to have otherwise eror
    }

    return ({ getXXGriArtifacts, handleStockTransferToNextYear })

}

export { useOpeningStock }