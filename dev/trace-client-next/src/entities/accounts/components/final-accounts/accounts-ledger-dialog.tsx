import {} from 'react'
import {
    moment,
    useState,
    useEffect,
    useRef,
} from '../../../../imports/regular-imports'
import {
    IconButton,
    Dialog,
    DialogTitle,
    DialogActions,
    DialogContent,
    Theme,
    createStyles,
    makeStyles,
} from '../../../../imports/gui-imports'

import { CloseSharp } from '../../../../imports/icons-import'
import { useSharedElements } from '../common/shared-elements-hook'
import {
    manageEntitiesState,
    useIbuki,
} from '../../../../imports/trace-imports'
import { Voucher } from '../vouchers/voucher'
import { Sales } from '../sales/sales'
import { Purchases } from '../purchases/purchases'
import { DebitNotes } from '../debit-credit-notes/debit-notes'
import { CreditNotes } from '../debit-credit-notes/credit-notes'
// import { truncateSync } from 'fs'
import {
    MultiDataContext,
    getPurchasesArbitraryData,
    getSalesArbitraryData,
    getDebitCreditNotesArbitraryData,
    getVouchersArbitraryData,
} from '../../components/common/multi-data-bridge'

function AccountsLedgerDialog() {
    const [, setRefresh] = useState({})
    const { getFromBag } = manageEntitiesState()
    const {
        accountsMessages,
        confirm,
        emit,
        getAccountName,
        genericUpdateMaster,
        getTranType,
        isAllowedUpdate,
        isGoodToDelete,
        toDecimalFormat,
        XXGrid,
    } = useSharedElements()
    const meta: any = useRef({
        accId: 0,
        accName: '',
        childDialogTiitle: 'Drill down edit',
        dateFormat: '',
        dialogConfig: {
            dialogWidth: '900px',
        },
        drillDownEditAttributes: {
            tranTypeId: undefined,
            tranHeaderId: undefined,
        },
        finalBalance: 0.0,
        finalBalanceType: ' Dr',
        isMounted: false,
        sum: [{ debit: 0, credit: 0 }],
        opBalance: { debit: 0, credit: 0 },

        showDialog: false,
        showChildDialog: false,
        transactions: [{ debit: 0, credit: 0 }],
    })
    const { filterOn } = useIbuki()
    const classes = useStyles({ meta: meta })
    meta.current.dateFormat = getFromBag('dateFormat')

    useEffect(() => {
        const curr = meta.current
        curr.isMounted = true
        const subs = filterOn('SHOW-LEDGER').subscribe(async (d:any) => {
            curr.showDialog = true
            curr.accId = d.data
            curr.accName = getAccountName(d.data)
            setRefresh({})
        })
        const subs1 = filterOn(
            getArtifacts().gridActionMessages.editIbukiMessage
        ).subscribe((d: any) => {
            const { tranDate, clearDate, id1, tranTypeId } = d.data?.row
            if (isAllowedUpdate({ tranDate, clearDate })) {
                curr.showChildDialog = true
                curr.drillDownEditAttributes.tranHeaderId = id1
                curr.drillDownEditAttributes.tranTypeId = tranTypeId
                setRefresh({})
            }
        })
        const subs2 = filterOn(
            'ACCOUNTS-LEDGER-DIALOG-CLOSE-DRILL-DOWN-CHILD-DIALOG'
        ).subscribe(() => {
            curr.showChildDialog = false
            setRefresh({})
            if (curr.showDialog) {
                emit(getArtifacts().gridActionMessages.fetchIbukiMessage, null) // If main dialog is open then only xx-grid fetch data
            } else {
                emit('ROOT-WINDOW-REFRESH', '') // otherwise refresh data in root window
            }
        })
        const subs3 = filterOn(
            getArtifacts().gridActionMessages.deleteIbukiMessage
        ).subscribe((d: any) => {
            doDelete(d.data)
        })

        return () => {
            subs.unsubscribe()
            subs1.unsubscribe()
            subs2.unsubscribe()
            subs3.unsubscribe()
            curr.isMounted = false
        }
    }, [isAllowedUpdate])

    return (
    <div></div>
    )

    function closeDialog() {
        meta.current.showDialog = false
        setRefresh({})
    }

    function closeChildDialog() {
        meta.current.showChildDialog = false
        setRefresh({})
    }

    async function doDelete(params: any) {
        const row = params.row
        const tranHeaderId = row['id1']
        const options = {
            description: accountsMessages.transactionDelete,
            confirmationText: 'Yes',
            cancellationText: 'No',
        }
        if (isGoodToDelete(params)) {
            confirm(options)
                .then(async () => {
                    await genericUpdateMaster({
                        deletedIds: [tranHeaderId],
                        tableName: 'TranH',
                    })
                    emit('SHOW-MESSAGE', {})
                    emit(
                        getArtifacts().gridActionMessages.fetchIbukiMessage,
                        null
                    )
                    setRefresh({})
                })
                .catch(() => { }) // important to have otherwise eror
        }
    }

    function DrillDownEditComponent() {
        const attrs = meta.current.drillDownEditAttributes
        attrs.showChildDialog = meta.current.showChildDialog
        let ret = <></>
        if ([1, 2, 3, 6].includes(attrs.tranTypeId)) {
            //It is voucher
            ret = (
                <Voucher
                    loadComponent={getTranType(attrs.tranTypeId)}
                    drillDownEditAttributes={attrs}
                />
            )
        } else if (attrs.tranTypeId === 4) {
            ret = <Sales saleType="sal" drillDownEditAttributes={attrs} />
        } else if (attrs.tranTypeId === 9) {
            ret = <Sales saleType="ret" drillDownEditAttributes={attrs} />
        } else if (attrs.tranTypeId === 5) {
            ret = (
                <Purchases purchaseType="pur" drillDownEditAttributes={attrs} />
            )
        } else if (attrs.tranTypeId === 10) {
            ret = (
                <Purchases purchaseType="ret" drillDownEditAttributes={attrs} />
            )
        } else if (attrs.tranTypeId === 7) {
            //debit notes
            ret = <DebitNotes drillDownEditAttributes={attrs} />
        } else if (attrs.tranTypeId === 8) {
            // credit notes
            ret = <CreditNotes drillDownEditAttributes={attrs} />
        }
        return (
            <MultiDataContext.Provider
                value={{
                    sales: getSalesArbitraryData(),
                    purchases: getPurchasesArbitraryData(),
                    debitCreditNotes: getDebitCreditNotesArbitraryData(),
                    vouchers: getVouchersArbitraryData()
                }}>
                {ret}
            </MultiDataContext.Provider>
        )
    }

    function getArtifacts() {
        const columns = [
            {
                headerName: 'Ind',
                description: 'Index',
                field: 'id',
                width: 80,
                disableColumnMenu: true,
            },
            { headerName: 'Id', field: 'id1', width: 90 },
            {
                headerName: 'Date',
                field: 'tranDate',
                width: 120,
                type: 'date',
                valueFormatter: (params: any) =>
                    moment(params.value).format('DD/MM/YYYY'),
            },
            { headerName: 'Ref', field: 'autoRefNo', width: 200 },
            {
                headerName: 'Other accounts',
                field: 'otherAccounts',
                width: 200,
            },
            {
                headerName: 'Debits',
                field: 'debit',
                type: 'number',
                width: 160,
                valueFormatter: (params: any) => toDecimalFormat(params.value),
            },
            {
                headerName: 'Credits',
                field: 'credit',
                type: 'number',
                width: 160,
                valueFormatter: (params: any) => toDecimalFormat(params.value),
            },

            {
                headerName: 'Instr',
                field: 'instrNo',
                width: 160,
                sortable: false,
            },
            {
                headerName: 'User ref no',
                field: 'userRefNo',
                width: 160,
                sortable: false,
            },
            {
                headerName: 'Remarks',
                field: 'remarks',
                width: 200,
                sortable: false,
            },
            {
                headerName: 'Line ref no',
                field: 'lineRefNo',
                width: 200,
                sortable: false,
            },
            {
                headerName: 'Line remarks',
                field: 'lineRemarks',
                width: 200,
                sortable: false,
            },
            {
                headerName: 'Tags',
                field: 'tags',
                width: 200,
                sortable: false,
            },
        ]
        const summaryColNames = ['debit', 'credit']
        const args = {
            id: meta.current.accId,
        }
        const specialColumns: any = {
            isEdit: true,
            // isDelete: truncateSync,
        }
        const gridActionMessages = {
            fetchIbukiMessage: 'XX-GRID-HOOK-FETCH-ACCOUNTS-LEDGER-DATA',
            editIbukiMessage: 'ACCOUNTS-LEDGER-DIALOG-XX-GRID-EDIT-CLICKED',
            deleteIbukiMessage: 'ACCOUNTS-LEDGER-DIALOG-XX-GRID-DELETE-CLICKED',
        }
        return {
            columns,
            gridActionMessages,
            summaryColNames,
            args,
            specialColumns,
        }
    }
}

export { AccountsLedgerDialog }

const useStyles: any = makeStyles((theme: Theme) =>
    createStyles({
        content: {
            '& .dialog-title': {
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingBottom: '0px',
            },
        },
        dialogContent: {
            height: 'calc(100vh - 163px)',
        },
    })
)
