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
        AddCircle,
        AddIcon,
        Avatar,
        Big,
        Box,
        Button,
        Card,
        Checkbox,
        CheckIcon,
        Chip,
        CloseIcon,
        confirm,
        DataTable,
        DeleteIcon,
        Dialog,
        DialogTitle,
        DialogContent,
        DialogActions,
        Divider,
        doValidateForm,
        EditIcon,
        emit,
        ErrorIcon,
        execGenericView,
        genericUpdateMaster,
        getCurrentEntity,
        getFormData,
        getFormObject,
        getFromBag,
        getGeneralLedger,
        globalMessages,
        Grid,
        FormControlLabel,
        Icon,
        IconButton,
        Input,
        InputAdornment,
        isInvalidDate,
        isInvalidGstin,
        isValidForm,
        LedgerSubledger,
        List,
        ListItem,
        ListItemAvatar,
        ListItemText,
        MaterialTable,
        messages,
        moment,
        MTableBody,
        MTableToolbar,
        NativeSelect,
        NumberFormat,
        Paper,
        PrimeColumn,
        PrimeDialog,
        queries,
        queryGraphql,
        Radio,
        ReactForm,
        releaseForm,
        resetAllFormErrors,
        resetForm,
        saveForm,
        SearchIcon,
        setFormError,
        setInBag,
        Switch,
        SyncIcon,
        tableIcons,
        TextField,
        toDecimalFormat,
        TraceDialog,
        TraceFullWidthSubmitButton,
        traceGlobalSearch,
        TraceSearchBox,
        Typography,
        useGeneric,
    } = useSharedElements()

    const { fetchData, getLedgerColumns, LedgerDataTable } = getGeneralLedger(meta)
    return (
        <div className={classes.content}>
            <Box className="header">
                <Typography variant="h6" className="heading" component="span">
                    {meta.current.headerConfig.title}
                </Typography>
                <div className="select-ledger">
                    <Typography component="label" variant="subtitle1">
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
                            await fetchData()
                            meta.current.isMounted && setRefresh({})
                        }}
                    />
                </div>
                <div>
                    <IconButton
                        // className={classes.syncIconButton}
                        size="medium"
                        color="secondary"
                        onClick={handleFetchData}>
                        <SyncIcon></SyncIcon>
                    </IconButton>
                </div>
                {traceGlobalSearch({ meta: meta, isMediumSizeUp: true })}
            </Box>
            <LedgerDataTable isScrollable={true} className='data-table' />
            {/* <DataTable
                className='data-table'
                rowHover={true}
                scrollable={true}
                scrollHeight="calc(100vh - 24rem)"
                value={meta.current.transactions}>
                {getLedgerColumns()}
            </DataTable> */}

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
