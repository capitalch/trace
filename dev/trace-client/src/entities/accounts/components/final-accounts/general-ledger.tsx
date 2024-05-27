import {
    InputSwitch,
    moment,
    useState,
} from '../../../../imports/regular-imports'
import {
    Box,
    IconButton,
    Tooltip,
    Typography,
    useTheme,
} from '../../../../imports/gui-imports'
import { Preview } from '../../../../imports/icons-import'
import { useTraceMaterialComponents, XXGrid } from '../../../../imports/trace-imports'
import { useSharedElements } from '../common/shared-elements-hook'
import { useGeneralLedger, useStyles } from './general-ledger-hook'
import { TypographySmart } from '../common/typography-smart'
import { getFromBag } from '../inventory/redirect'
function GeneralLedger() {
    const [, setRefresh] = useState({})
    const theme = useTheme()
    const classes = useStyles()
    const branchObject: any = getFromBag('branchObject')
    const { handleLedgerPreview, meta } =
        useGeneralLedger(getArtifacts)

    const {
        emit,
        getAccountName,
        getGridReportSubTitle,
        LedgerSubledger,
        toDecimalFormat,
    } = useSharedElements()

    const { BasicMaterialDialog } = useTraceMaterialComponents()

    return (
        <div className={classes.content}>
            <div className="header">
                <Typography variant="h6" className="heading" component="span">
                    {meta.current.accName}
                </Typography>

                <Box component='span' display='flex' alignItems='center'>
                    <span style = {{marginRight: theme.spacing(2)}}>This branch</span>
                    <InputSwitch
                        checked={meta.current.isAllBranches}
                        onChange={(e: any) => {
                            meta.current.isAllBranches = e.target.value
                            meta.current.sqlQueryArgs = {
                                id: meta.current.accId,
                                branchId: meta.current.isAllBranches ? null : branchObject.branchId
                            }
                            setRefresh({})
                            if (meta.current.accId) {
                                emit(
                                    getArtifacts().gridActionMessages
                                        .fetchIbukiMessage,
                                    meta.current.sqlQueryArgs
                                )
                            } else {
                                emit('XX-GRID-RESET', null)
                            }
                        }}></InputSwitch>
                    <span style={{ marginLeft: theme.spacing(2) }}>All branches</span>
                </Box>

                <div className="select-ledger">
                    <Box
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}>
                        <Typography component="label" variant="subtitle2">
                            Ledger account
                        </Typography>

                        <TypographySmart item={meta.current.ledgerSubledger} />

                        <Tooltip title="Print preview">
                            <IconButton
                                size="small"
                                disabled={false}
                                onClick={handleLedgerPreview}>
                                <Preview className="preview-icon" />
                            </IconButton>
                        </Tooltip>
                    </Box>

                    <LedgerSubledger
                        className="ledger-subledger"
                        ledgerFilterMethodName='all'
                        rowData={meta.current.ledgerSubledger}
                        onChange={() => {
                            meta.current.accId =
                                meta.current.ledgerSubledger.accId
                            meta.current.accName = getAccountName(
                                meta.current.accId
                            )
                            meta.current.sqlQueryArgs = {
                                id: meta.current.accId,
                                branchId: meta.current.isAllBranches ? null : branchObject.branchId
                            }
                            if (meta.current.accId) {
                                emit(
                                    getArtifacts().gridActionMessages
                                        .fetchIbukiMessage,
                                    meta.current.sqlQueryArgs
                                )
                            } else {
                                emit('XX-GRID-RESET', null)
                            }
                            meta.current.isMounted && setRefresh({})
                            emit('TYPOGRAPHY-SMART-REFRESH', '')
                        }}
                    />
                </div>
            </div>
            <Box className='data-grid'>
                <XXGrid
                    autoFetchData={false}
                    columns={getArtifacts().columns}
                    gridActionMessages={getArtifacts().gridActionMessages}
                    hideViewLimit={true}
                    jsonFieldPath="jsonResult.transactions" // data is available in nested json property
                    sharedData={meta.current.sharedData}
                    summaryColNames={getArtifacts().summaryColNames}
                    sqlQueryId="get_accountsLedger"
                    sqlQueryArgs={meta.current.sqlQueryArgs}
                    subTitle={getGridReportSubTitle()}
                    specialColumns={getArtifacts().specialColumns}
                    title={''.concat('Ledger view: ', meta.current.accName || '')}
                    toShowOpeningBalance={true}
                    toShowColumnBalanceCheckBox={true}
                    toShowClosingBalance={true}
                    toShowDailySummary={true}
                    toShowReverseCheckbox={true}
                />
            </Box>
            <BasicMaterialDialog parentMeta={meta} />
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
            {
                headerName: 'Br code',
                field: 'branchCode',
                width: 150,
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