import {
    moment,
    useState,
    useEffect,
    useRef,
} from '../../../../imports/regular-imports'
import { makeStyles, createStyles } from '../../../../imports/gui-imports'
import { useSharedElements } from '../common/shared-elements-hook'

function useDebitCreditNotesView(arbitraryData: any, tranType: string) {
    const [, setRefresh] = useState({})
    const {
        emit,
        execGenericView,
        filterOn,
        getFromBag,
        isDateAuditLocked,
        accountsMessages,
        toDecimalFormat,
    } = useSharedElements()
    const dateFormat = getFromBag('dateFormat')

    useEffect(() => {
        meta.current.isMounted = true
        // getData()
        setRefresh({})
        // const subs1 = filterOn(
        //     'DEBIT-CREDIT-NOTES-VIEW-HOOK-LOAD-DATA'
        // ).subscribe((d: any) => {
        //     loadData(d.data)
        // })
        return () => {
            meta.current.isMounted = false
            // subs1.unsubscribe()
        }
    }, [])

    useEffect(() => {
        const subs1 = filterOn(
            'DEBIT-CREDIT-NOTES-VIEW-HOOK-FETCH-DATA'
        ).subscribe(() => {
            emit('XX-GRID-FETCH-DATA', null)
        })
        const subs2 = filterOn(
            'DEBIT-CREDIT-NOTES-VIEW-HOOK-XX-GRID-EDIT-CLICKED'
        ).subscribe((d: any) => {
            const rowData = d.data?.row
            const tranDate = rowData.tranDate
            if (isDateAuditLocked(tranDate)) {
                emit('SHOW-MESSAGE', {
                    severity: 'error',
                    message: accountsMessages.auditLockError,
                    duration: null,
                })
            } else if (rowData?.clearDate) {
                // already reconciled so edit /delete not possible
                emit('SHOW-MESSAGE', {
                    severity: 'error',
                    message: accountsMessages.reconcillationDone,
                    duration: null,
                })
            } else {
                arbitraryData.isViewBack = true
                loadDataOnId(rowData.id1)
                // loadPurchaseOnId(rowData.id1, true) // modify
                // emit('PURCHASE-BODY-SUBMIT-REFRESH', null)
            }
        })
        const subs3 = filterOn(
            'DEBIT-CREDIT-NOTES-FETCH-DATA-ON-ID-DRILL-DOWN-EDIT'
        ).subscribe((d: any) => {
            loadDataOnId(d.data)
        })
        return () => {
            subs1.unsubscribe()
            subs2.unsubscribe()
            subs3.unsubscribe()
        }
    }, [])

    const meta: any = useRef({
        isMounted: false,
        title: tranType === 'dn' ? 'Debit notes' : 'Credit notes',
        no: 10,
    })

    function getXXGridParams() {
        const columns = [
            {
                headerName: 'Ind',
                description: 'Index',
                field: 'id',
                width: 80,
                disableColumnMenu: true,
            },
            {
                headerName: 'Id',
                description: 'Id',
                field: 'id1',
                width: 90,
            },
            {
                headerName: 'Date',
                description: 'Date',
                field: 'tranDate',
                width: 110,
                type: 'date',
                valueFormatter: (params: any) =>
                    moment(params.value).format(dateFormat),
            },
            {
                headerName: 'Ref no',
                description: 'Ref no',
                field: 'autoRefNo',
                width: 200,
            },
            {
                headerName: 'Amount',
                field: 'amount',
                sortable: false,
                type: 'number',
                width: 160,
                valueFormatter: (params: any) => toDecimalFormat(params.value),
            },
            {
                headerName: 'User ref',
                field: 'userRefNo',
                width: 200,
            },
            {
                headerName: 'Debit a/c',
                field: 'debitAccount',
                width: 150,
            },
            {
                headerName: 'Credit a/c',
                field: 'creditAccount',
                width: 150,
            },
            {
                headerName: 'Remarks',
                field: 'remarks',
                width: 200,
            },
            {
                headerName: 'Line ref',
                field: 'lineRefNo',
                width: 160,
            },
            {
                headerName: 'Line remarks',
                field: 'lineRemarks',
                width: 160,
            },
        ]
        const queryId = 'get_all_debit_credit_notes'
        const queryArgs = {
            tranTypeId: tranType === 'dn' ? 7 : 8,
            no: 100,
        }
        const summaryColNames: string[] = ['amount']
        const title = tranType === 'dn' ? 'Debit notes' : 'Credit notes'
        const specialColumns = {
            isEdit: true,
            isDelete: true,
            editIbukiMessage:
                'DEBIT-CREDIT-NOTES-VIEW-HOOK-XX-GRID-EDIT-CLICKED',
            deleteIbukiMessage:
                'DEBIT-CREDIT-NOTES-VIEW-HOOK-XX-GRID-DELETE-CLICKED',
        }
        return {
            columns,
            queryId,
            queryArgs,
            summaryColNames,
            specialColumns,
            title,
        }
    }

    // async function getData() {
    //     emit('SHOW-LOADING-INDICATOR', true)
    //     const label = tranType === 'dn' ? 'flightLandTran' : 'flightTakeoffTran'
    //     let no = getFromBag(label)
    //     no = no ?? meta.current.no
    //     const ret = await execGenericView({
    //         isMultipleRows: true,
    //         sqlKey: 'get_all_debit_credit_notes',
    //         args: {
    //             tranTypeId: tranType === 'dn' ? 7 : 8,
    //             no: no || null,
    //         },
    //     })
    //     emit('SHOW-LOADING-INDICATOR', false)
    //     if (ret) {
    //         let index = 1
    //         for (let item of ret) {
    //             item.index = index++
    //         }
    //         meta.current.data = ret
    //         meta.current.isMounted && setRefresh({})
    //     }
    // }

    async function loadDataOnId(id: number) {
        emit('SHOW-LOADING-INDICATOR', true)
        const ret = await execGenericView({
            isMultipleRows: false,
            sqlKey: 'getJson_debit_credit_note',
            args: {
                id: id,
            },
        })
        emit('SHOW-LOADING-INDICATOR', false)
        const isoDateFormat = 'YYYY-MM-DD'
        const ah = arbitraryData.body
        if (ret) {
            ah.autoRefNo = ret.autoRefNo
            ah.id = ret.id
            ah.tranDate = moment(ret.tranDate).format(isoDateFormat)
            ah.commonRemarks = ret?.remarks
            ah.userRefNo = ret?.userRefNo
            ah.amount = ret?.debits[0]?.amount
            ah.ledgerSubledgerCredit = {
                accId: ret?.credits[0]?.accId,
            }
            ah.ledgerSubledgerDebit = {
                accId: ret?.debits[0]?.accId,
            }
            ah.lineRefNoDebit = ret?.debits[0]?.lineRefNo
            ah.lineRefNoCredit = ret?.credits[0]?.lineRefNo
            ah.lineRemarksCredit = ret?.credits[0]?.remarks
            ah.lineRemarksDebit = ret?.debits[0]?.remarks
            ah.tranDetailsIdDebit = ret?.debits[0]?.tranDetailsId
            ah.tranDetailsIdCredit = ret?.credits[0]?.tranDetailsId
        }

        arbitraryData.value = 0
        arbitraryData.body.isViewBack = true
        arbitraryData.setRefresh({})
    }

    return { getXXGridParams, loadDataOnId, meta }
}

export { useDebitCreditNotesView }

const useStyles: any = makeStyles(() =>
    createStyles({
        content: {
            height: 'calc(100vh - 245px)',
            width: '100%',
            // marginTop: '5px',
        },
    })
)

export { useStyles }
