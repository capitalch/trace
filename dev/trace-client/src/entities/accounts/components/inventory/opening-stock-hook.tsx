import { _, Box, moment, Typography, useEffect, useRef, useSharedElements, useState, useTheme } from './redirect'

function useOpeningStock() {
    const [, setRefresh] = useState({})
    const { globalMessages, confirm, emit, filterOn, genericUpdateMaster, getFromBag, toDecimalFormat } = useSharedElements()
    const meta = useRef({
        title: 'Opening stock (New / Edit)',
    })
    const actionMessages = getXXGriArtifacts().actionMessages
    const dateFormat = getFromBag('dateFormat')
    const pre = meta.current
    useEffect(() => {
        const subs1 = filterOn(actionMessages.deleteIbukiMessage).subscribe(handleDelete)
        // const subs2 = filterOn(actionMessages.editIbukiMessage).subscribe((d: any) => emit('OPENING-STOCH-WORK-BENCH-HOOK-EDIT-OPENING-STOCK', d.data))
        return (() => {
            subs1.unsubscribe()
            // subs2.unsubscribe()
        })
    }, [])

    function getXXGriArtifacts() {
        const sqlQueryId = 'get_stock_op_bal'
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
                description: 'CQtyategory',
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

        return ({ actionMessages, columns, sqlQueryArgs, sqlQueryId, summaryColNames, specialColumns, })
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

    function handleEdit(d: any) {

    }

    return ({ getXXGriArtifacts, meta })

}

export { useOpeningStock }