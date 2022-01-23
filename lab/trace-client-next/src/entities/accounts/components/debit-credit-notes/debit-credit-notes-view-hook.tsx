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
        confirm,
        emit,
        execGenericView,
        filterOn,
        getFromBag,
        genericUpdateMaster,
        isAllowedUpdate,
        accountsMessages,
        toDecimalFormat,
    } = useSharedElements()
    const dateFormat = getFromBag('dateFormat')

    useEffect(() => {
        const curr = meta.current
        curr.isMounted = true
        const subs1 = filterOn(
            'DEBIT-CREDIT-NOTES-VIEW-HOOK-FETCH-DATA'
        ).subscribe(() => {
            emit(getXXGridParams().gridActionMessages.fetchIbukiMessage, null)
        })
        const subs2 = filterOn(
            getXXGridParams().gridActionMessages.editIbukiMessage
        ).subscribe((d: any) => {
            const { tranDate, clearDate, id1 } = d.data?.row
            if (isAllowedUpdate({ tranDate, clearDate })) {
                arbitraryData.isViewBack = true
                loadDataOnId(id1)
            }
        })
        const subs3 = filterOn(
            'DEBIT-CREDIT-NOTES-FETCH-DATA-ON-ID-DRILL-DOWN-EDIT'
        ).subscribe((d: any) => {
            loadDataOnId(d.data)
        })
        const subs4 = filterOn(
            getXXGridParams().gridActionMessages.deleteIbukiMessage
        ).subscribe((d: any) => {
            const { tranDate, clearDate, id1 } = d.data?.row
            const options = {
                description: accountsMessages.transactionDelete,
                confirmationText: 'Yes',
                cancellationText: 'No',
            }
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
                        emit('DEBIT-CREDIT-NOTES-VIEW-HOOK-FETCH-DATA', null)
                    })
                    .catch(() => { }) // important to have otherwise eror
            }
        })
        return () => {
            curr.isMounted = false
            subs1.unsubscribe()
            subs2.unsubscribe()
            subs3.unsubscribe()
            subs4.unsubscribe()
        }
    }, [accountsMessages.transactionDelete, arbitraryData, isAllowedUpdate, ])

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
        }
        const gridActionMessages = {
            fetchIbukiMessage: 'XX-GRID-HOOK-FETCH-DEBIT-CREDIT-NOTES-DATA',
            editIbukiMessage:
                'DEBIT-CREDIT-NOTES-VIEW-HOOK-XX-GRID-EDIT-CLICKED',
            deleteIbukiMessage:
                'DEBIT-CREDIT-NOTES-VIEW-HOOK-XX-GRID-DELETE-CLICKED',
        }
        return {
            columns,
            gridActionMessages,
            queryId,
            queryArgs,
            summaryColNames,
            specialColumns,
            title,
        }
    }

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

            arbitraryData.tabValue = 0
            arbitraryData.isViewBack = true
            emit('DEBIT-CREDIT-NOTES-HOOK-CHANGE-TAB', 0)
            setRefresh({})
        }


    }

    return { getXXGridParams, loadDataOnId, meta }
}

export { useDebitCreditNotesView }

const useStyles: any = makeStyles(() =>
    createStyles({
        content: {
            height: 'calc(100vh - 245px)',
            width: '100%',
        },
    })
)

export { useStyles }
