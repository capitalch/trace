import {
    _,
    PrimeDialog,
    moment,
    useState,
} from '../../../../imports/regular-imports'
import { Dialog, DialogContent, DialogTitle, IconButton, Tooltip, Typography } from '../../../../imports/gui-imports'
import {
    CloseSharp,
    Preview,
} from '../../../../imports/icons-import'
import { XXGrid } from '../../../../imports/trace-imports'
import { useSharedElements } from '../common/shared-elements-hook'
import { useGeneralLedger, useStyles } from './general-ledger-hook'
import {PdfLedger} from '../pdf/ledgers/pdf-ledger'

function GeneralLedger() {
    const [, setRefresh] = useState({})
    const classes = useStyles()
    const { handleLedgerDialogClose, handleLedgerPreview, meta } = useGeneralLedger(getArtifacts)

    const {
        accountsMessages,
        emit,
        getAccountName,
        LedgerSubledger,
        PDFViewer,
        toDecimalFormat,
    } = useSharedElements()

    return (
        <div className={classes.content}>
            <div className="header">

                <Typography variant="h6" className="heading" component="span">
                    {meta.current.accName}
                </Typography>

                <div className="select-ledger">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography component="label" variant="subtitle2">
                            Select ledger account
                        </Typography>
                        <Tooltip
                            title="Print preview">
                            <IconButton
                                size="small"
                                disabled={false}
                                onClick={handleLedgerPreview}>
                                <Preview className="preview-icon" />
                            </IconButton>
                        </Tooltip>
                    </div>

                    <LedgerSubledger
                        className="ledger-subledger"
                        allAccounts={meta.current.allAccounts}
                        ledgerAccounts={meta.current.ledgerAccounts}
                        rowData={meta.current.ledgerSubledger}
                        onChange={() => {
                            meta.current.accId =
                                meta.current.ledgerSubledger.accId
                            meta.current.accName = getAccountName(
                                meta.current.accId
                            )
                            meta.current.sqlQueryArgs = {
                                id: meta.current.accId,
                            }
                            if (meta.current.accId) {
                                emit(
                                    getArtifacts().gridActionMessages.fetchIbukiMessage,
                                    meta.current.sqlQueryArgs
                                )
                            } else {
                                emit('XX-GRID-RESET', null)
                            }
                            meta.current.isMounted && setRefresh({})
                        }} />
                </div>
            </div>

            <div className="data-grid">
                <XXGrid
                    autoFetchData={false}
                    columns={getArtifacts().columns}
                    gridActionMessages={getArtifacts().gridActionMessages}
                    hideViewLimit={true}
                    jsonFieldPath="jsonResult.transactions" // data is available in nested jason property
                    sharedData={meta.current.sharedData}
                    summaryColNames={getArtifacts().summaryColNames}
                    sqlQueryId="get_accountsLedger"
                    sqlQueryArgs={meta.current.sqlQueryArgs}
                    specialColumns={getArtifacts().specialColumns}
                    title="Ledger view"
                    toShowOpeningBalance={true}
                    toShowColumnBalanceCheckBox={true}
                    toShowClosingBalance={true}
                    toShowDailySummary={true}
                    toShowReverseCheckbox={true}
                />
            </div>
            <PrimeDialog
                header={accountsMessages.selectAccountHeader}
                visible={meta.current.showDialog}
                onHide={() => {
                    meta.current.showDialog = false
                    meta.current.isMounted && setRefresh({})
                }}>
                {accountsMessages.selectAccountDetails}
            </PrimeDialog>
            <Dialog
                open={meta.current.showLedgerDialog}
                fullWidth={true}
                maxWidth="md">
                <DialogTitle>
                    <div className={classes.previewTitle}>
                        <div>Ledger view: {meta.current.accName}</div>
                        <Tooltip title="Close">
                            <IconButton
                                size="small"
                                disabled={false}
                                onClick={handleLedgerDialogClose}>
                                <CloseSharp />
                            </IconButton>
                        </Tooltip>
                    </div>
                </DialogTitle>
                <DialogContent>
                    <PDFViewer showToolbar={true} width={840} height={600}>
                        <PdfLedger ledgerData={meta.current.sharedData.filteredRows} accName={meta.current.accName} />
                    </PDFViewer>
                </DialogContent>
            </Dialog>
        </div>
    )

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
                headerName: 'Balance',
                field: 'balance',
                type: 'number',
                sortable: false,
                width: 160,
                valueFormatter: (params: any) => toDecimalFormat(params.value),
            },

            {
                headerName: 'Instr',
                field: 'instrNo',
                width: 200,
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
        const specialColumns = {
            isEdit: true,
            isDelete: true,

        }
        const gridActionMessages = {
            fetchIbukiMessage: 'XX-GRID-HOOK-FETCH-GENERAL-LEDGER-DATA',
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
export { GeneralLedger }
