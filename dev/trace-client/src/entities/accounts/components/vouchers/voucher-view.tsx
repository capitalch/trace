import { menuPortalCSS } from 'react-select/src/components/Menu'
import { useSharedElements } from '../common/shared-elements-hook'
import { useVoucherView, useStyles } from './voucher-view-hook'

function VoucherView({ hidden }: any) {
    const classes = useStyles()
    const {
        args,
        columns,
        meta,
        specialColumns,
        sqlQueryId,
        summaryColNames,
    } = useVoucherView(hidden)

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
        globalMessages,
        FormControlLabel,
        Icon,
        IconButton,
        Input,
        InputAdornment,
        isInvalidDate,
        isInvalidGstin,
        isValidForm,
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
        XXGrid,
    } = useSharedElements()

    return (
        <Box className={classes.content} hidden={hidden}>
            <XXGrid
                columns={columns}
                summaryColNames={summaryColNames}
                title={meta.current.title}
                sqlQueryId={sqlQueryId}
                sqlQueryArgs={args}
                specialColumns={specialColumns}
                xGridProps={{ disableSelectionOnClick: true }}
            />
        </Box>
    )
}

export { VoucherView }
