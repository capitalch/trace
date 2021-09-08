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
        getGeneralLedger,
        FormControlLabel,
        IconButton,
        LedgerSubledger,
        PrimeDialog,
        SyncIcon,
        traceGlobalSearch,
        Typography,
    } = useSharedElements()

    const { fetchData, getLedgerColumns, LedgerDataTable } =
        getGeneralLedger(meta)
    return (
        <div className={classes.content}>
            <div className='header'>
                <Typography variant="h6" className="heading" component="span">
                    {meta.current.headerConfig.title}
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
                        onChange={async () => {
                            meta.current.accId =
                                meta.current.ledgerSubledger.accId
                            meta.current.accId && await fetchData()
                            meta.current.isMounted && setRefresh({})
                        }}
                    />
                </div>
            </div>
            <Box className="header">
                <div>
                    <IconButton
                        // className={classes.syncIconButton}
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
            <LedgerDataTable isScrollable={true} className="data-table" />

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
}

export { GeneralLedger }
