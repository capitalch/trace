import {
    moment,
    useConfirm,
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
import { truncateSync } from 'fs'
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
        meta.current.isMounted = true
        const subs = filterOn('SHOW-LEDGER').subscribe(async (d) => {
            meta.current.showDialog = true
            meta.current.accId = d.data
            meta.current.accName = getAccountName(d.data)
            setRefresh({})
        })
        const subs1 = filterOn(
            getArtifacts().gridActionMessages.editIbukiMessage
        ).subscribe((d: any) => {
            const { tranDate, clearDate, id1, tranTypeId } = d.data?.row
            if (isAllowedUpdate({ tranDate, clearDate })) {
                meta.current.showChildDialog = true
                meta.current.drillDownEditAttributes.tranHeaderId = id1
                meta.current.drillDownEditAttributes.tranTypeId = tranTypeId
                setRefresh({})
            }
        })
        const subs2 = filterOn(
            'ACCOUNTS-LEDGER-DIALOG-CLOSE-DRILL-DOWN-CHILD-DIALOG'
        ).subscribe(() => {
            meta.current.showChildDialog = false
            setRefresh({})
            if (meta.current.showDialog) {
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
            meta.current.isMounted = false
        }
    }, [])

    return (
        <div>
            <Dialog
                className={classes.content}
                open={meta.current.showDialog}
                maxWidth="lg"
                fullWidth={true}
                onClose={closeDialog}>
                <DialogTitle
                    // disableTypography
                    id="generic-dialog-title"
                    className="dialog-title">
                    <div>{'Account: '.concat(meta.current.accName)}</div>
                    <IconButton
                        size="small"
                        color="default"
                        onClick={closeDialog}
                        aria-label="close">
                        <CloseSharp />
                    </IconButton>
                </DialogTitle>
                <DialogContent className={classes.dialogContent}>
                    <XXGrid
                        gridActionMessages={getArtifacts().gridActionMessages}
                        autoFetchData={true}
                        columns={getArtifacts().columns}
                        hideViewLimit={true}
                        summaryColNames={getArtifacts().summaryColNames}
                        title="Ledger view"
                        sqlQueryId="get_accountsLedger"
                        sqlQueryArgs={getArtifacts().args}
                        specialColumns={getArtifacts().specialColumns}
                        toShowOpeningBalance={true}
                        toShowClosingBalance={true}
                        // toShowColumnBalance={true}
                        toShowDailySummary={true}
                        toShowReverseCheckbox={true}
                        // xGridProps={{ disableSelectionOnClick: true }}
                        jsonFieldPath="jsonResult.transactions" // data is available in nested jason property
                    />
                </DialogContent>
                <DialogActions></DialogActions>
            </Dialog>
            {/* Child dialog */}
            <Dialog
                className={classes.content}
                open={meta.current.showChildDialog}
                maxWidth="xl"
                fullWidth={true}
                onClose={closeChildDialog}
                // fullScreen={true}
            >
                <DialogTitle
                    // disableTypography
                    id="generic-child-dialog-title"
                    className="dialog-title">
                    <div>{meta.current.childDialogTiitle}</div>
                    <IconButton
                        size="small"
                        color="default"
                        onClick={closeChildDialog}
                        aria-label="close">
                        <CloseSharp />
                    </IconButton>
                </DialogTitle>
                <DialogContent className={classes.dialogContent}>
                    <DrillDownEditComponent />
                </DialogContent>
                <DialogActions></DialogActions>
            </Dialog>
        </div>
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
                .catch(() => {}) // important to have otherwise eror
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
            // 4: Sales, 9: sales return
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
            isDelete: truncateSync,
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
