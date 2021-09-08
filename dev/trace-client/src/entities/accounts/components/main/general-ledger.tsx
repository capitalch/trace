import { emit } from 'process'
import { useState } from 'react'
import { useSharedElements } from '../common/shared-elements-hook'
import { useGeneralLedger, useStyles } from './general-ledger-hook'

function GeneralLedger() {
    const [, setRefresh] = useState({})
    const classes = useStyles()
    const { handleFetchData, meta } = useGeneralLedger()

    const {
        _,
        accountsMessages,
        Box,
        Checkbox,
        emit,
        getGeneralLedger,
        FormControlLabel,
        getAccountName,
        IconButton,
        LedgerSubledger,
        moment,
        PrimeDialog,
        SyncIcon,
        toDecimalFormat,
        traceGlobalSearch,
        Typography,
        XXGrid,
    } = useSharedElements()

    const { fetchData, getLedgerColumns, LedgerDataTable } =
        getGeneralLedger(meta)
    return (
        <div className={classes.content}>
            <div className='header'>
                <Typography variant="h6" className="heading" component="span">
                    {meta.current.accName}
                </Typography>
                <div className="select-ledger">
                    <Typography component="label" variant="subtitle2">
                        Select ledger account
                    </Typography>
                    <LedgerSubledger
                        className="ledger-subledger"
                        allAccounts={meta.current.allAccounts}
                        ledgerAccounts={meta.current.ledgerAccounts}
                        rowData={meta.current.ledgerSubledger}
                        onChange={() => {
                            meta.current.accId =
                                meta.current.ledgerSubledger.accId
                            meta.current.accName = getAccountName(meta.current.accId)
                            meta.current.sqlQueryArgs = {id:  meta.current.accId}
                            if (meta.current.accId) {
                                emit('XX-GRID-FETCH-DATA', meta.current.sqlQueryArgs)
                            } else {
                                emit('XX-GRID-RESET', null)
                            }
                            meta.current.isMounted && setRefresh({})
                        }}
                    />
                </div>
            </div>
            <div className='data-grid'>
                <XXGrid
                    autoFetchData={false}
                    columns={getArtifacts().columns}
                    hideViewLimit={true}
                    summaryColNames={getArtifacts().summaryColNames}
                    title="Ledger view"
                    sqlQueryId="get_accountsLedger"
                    sqlQueryArgs={meta.current.sqlQueryArgs}
                    specialColumns={getArtifacts().specialColumns}
                    toShowOpeningBalance={true}
                    toShowClosingBalance={true}
                    xGridProps={{ disableSelectionOnClick: true }}
                    jsonFieldPath="jsonResult.transactions" // data is available in nested jason property
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
        const specialColumns = {
            isEdit: true,
            isDelete: true,
            editIbukiMessage: 'ACCOUNTS-LEDGER-DIALOG-XX-GRID-EDIT-CLICKED',
            deleteIbukiMessage: 'ACCOUNTS-LEDGER-DIALOG-XX-GRID-DELETE-CLICKED',
        }
        return { columns, summaryColNames, args, specialColumns }
    }


}
export { GeneralLedger }

{/* <Box className="header">
                <div>
                    <IconButton
                        size="medium"
                        color="secondary"
                        onClick={handleFetchData}>
                        <SyncIcon></SyncIcon>
                    </IconButton>
                </div>
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={meta.current.isDailySummary}
                            onChange={(e: any) => {
                                meta.current.isDailySummary = e.target.checked
                                handleFetchData()
                            }}
                        />
                    }
                    label="Daily summary"
                />
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={meta.current.isReverseOrder}
                            onChange={(e: any) => {
                                meta.current.isReverseOrder = e.target.checked
                                handleFetchData()
                            }}
                        />
                    }
                    label="Reverse order"
                />

                {traceGlobalSearch({ meta: meta, isMediumSizeUp: true })}
            </Box>
            <LedgerDataTable isScrollable={true} className="data-table" /> */}