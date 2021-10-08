import {
    _,
    Big,
    clsx,
    CascadeSelect,
    DataTable,
    InputMask,
    InputNumber,
    InputSwitch,
    InputTextarea,
    MaterialTable,
    moment,
    PrimeColumn,
    PrimeDialog,
    MTableToolbar,
    MTableBody,
    MTableBodyRow,
    MTableHeader,
    NumberFormat,
    PrimeInputMask,
    ReactSelect,
    Tree,
    TreeTable,
    useConfirm,
} from '../../../../imports/regular-imports'

import {
    Avatar,
    Badge,
    Box,
    Button,
    Card,
    Checkbox,
    Chip,
    Container,
    createStyles,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    FormControl,
    FormControlLabel,
    FormHelperText,
    Grid,
    Icon,
    IconButton,
    Input,
    InputAdornment,
    InputLabel,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    makeStyles,
    NativeSelect,
    Paper,
    Radio,
    RadioGroup,
    Switch,
    Tabs,
    Tab,
    TextareaAutosize,
    TextField,
    Theme,
    Typography,
    useTheme,
} from '../../../../imports/gui-imports'

import {
    AddIcon,
    AddCircle,
    EditIcon,
    Check as CheckIcon,
    Clear,
    ClearAll,
    CloseIcon,
    DeleteIcon,
    ErrorIcon,
    faSpinner,
    FontAwesomeIcon,
    LinkIcon,
    MinusIcon,
    RemoveCircle,
    SearchIcon,
    SendIcon,
    SyncIcon,
    ZoomInIcon,
    ZoomOutIcon,
} from '../../../../imports/icons-import'

import { tableIcons } from './material-table-icons'
import {
    globalMessages,
    graphqlService,
    LedgerSubledger,
    LedgerSubledgerCascade,
    manageEntitiesState,
    manageFormsState,
    queries,
    ReactForm,
    useIbuki,
    usingIbuki,
    useTraceGlobal,
    useTraceMaterialComponents,
    XXGrid,
} from '../../../../imports/trace-imports'

import { utilMethods } from '../../../../common-utils/util-methods'
import accountsMessages from '../../json/accounts-messages.json'
import messages from '../../../../messages.json'
import { getArtifacts } from '../../../../react-form/common/react-form-hook'
import { useGeneric } from '../../../../react-form/core/generic-item'
import {  } from './ledger-subledger'
import { map } from 'rxjs/operators'
import { utils } from '../../utils'
import { initCode } from '../../init-code'

function useSharedElements() {
    const theme = useTheme()
    const { queryGraphql, mutateGraphql } = graphqlService()
    const {
        getCurrentEntity,
        getCurrentComponent,
        getFromBag,
        getLoginData,
        setInBag,
    } = manageEntitiesState()
    const {
        resetForm,
        resetAllFormErrors,
        releaseForm,
        getFormData,
        clearServerError,
        getFormObject,
        doFormRefresh,
        getValidationFabric,
        init,
        setFormError,
    } = manageFormsState()
    const { doValidateForm, isValidForm } = getValidationFabric()
    const {
        extractAmount,
        saveForm,
        genericUpdateMaster,
        genericUpdateMasterDetails,
        genericUpdateMasterNoForm,
        isControlDisabled,
        execGenericView,
        toDecimalFormat,
    } = utilMethods()
    const { hotEmit, hotFilterOn, emit, filterOn } = usingIbuki()
    const {
        TraceDialog,
        traceGlobalSearch,
        TraceFullWidthSubmitButton,
        TraceSearchBox,
    } = useTraceMaterialComponents()
    const { getCurrentMediaSize, isMediumSizeUp, getCurrentWindowSize } =
        useTraceGlobal()
    const confirm = useConfirm()
    const {
        // deleteRow,
        getAccountClass,
        getAccountName,
        getAccountClassWithAutoSubledger,
        getGeneralLedger,
        getMappedAccounts,
        getTranType,
        getUnitHeading,
        isDateNotAuditLocked,
        isDateAuditLocked,
        isGoodToDelete,
        isImproperDate,
        isInvalidDate,
        isInvalidEmail,
        isInvalidGstin,
        isInvalidIndiaMobile,
        isInvalidIndiaPin,
        isInvalidStateCode,
        registerAccounts,
    } = utils()
    return {
        _,
        accountsMessages,
        AddCircle,
        AddIcon,
        Avatar,
        Badge,
        Big,
        Box,
        Button,
        // Cascader,
        CascadeSelect,
        Card,
        CheckIcon,
        Checkbox,
        Chip,
        Clear,
        CloseIcon,
        clearServerError,
        clsx,
        Container,
        confirm,
        DataTable,
        DeleteIcon,
        // deleteRow,
        Dialog,
        DialogActions,
        DialogContent,
        DialogTitle,
        Divider,
        doFormRefresh,
        doValidateForm,
        EditIcon,
        emit,
        ErrorIcon,
        execGenericView,
        extractAmount,
        faSpinner,
        filterOn,
        FontAwesomeIcon,
        FormControl,
        FormControlLabel,
        FormHelperText,
        genericUpdateMaster,
        genericUpdateMasterDetails,
        genericUpdateMasterNoForm,
        getAccountClass,
        getAccountName,
        getAccountClassWithAutoSubledger,
        getArtifacts,
        getCurrentComponent,
        getCurrentEntity,
        getCurrentMediaSize,
        getCurrentWindowSize,
        getFromBag,
        getFormData,
        getFormObject,
        getGeneralLedger,
        getLoginData,
        getMappedAccounts,
        getTranType,
        getUnitHeading,
        getValidationFabric,
        globalMessages,
        Grid,
        hotEmit,
        hotFilterOn,
        Icon,
        init,
        initCode,
        isControlDisabled,
        isDateAuditLocked,
        isDateNotAuditLocked,
        isGoodToDelete,
        isMediumSizeUp,
        IconButton,
        Input,
        InputAdornment,
        InputLabel,
        InputMask,
        InputNumber,
        InputSwitch,
        InputTextarea,
        isImproperDate,
        isInvalidDate,
        isInvalidEmail,
        isInvalidGstin,
        isInvalidIndiaMobile,
        isInvalidIndiaPin,
        isInvalidStateCode,
        isValidForm,
        LedgerSubledger,
        LedgerSubledgerCascade,
        LinkIcon,
        List,
        ListItem,
        ListItemAvatar,
        ListItemText,
        manageFormsState,
        map,
        MinusIcon,
        MTableBody,
        MTableBodyRow,
        MTableHeader,
        MTableToolbar,
        MaterialTable,
        messages,
        moment,
        mutateGraphql,
        NativeSelect,
        NumberFormat,
        Paper,
        PrimeColumn,
        PrimeDialog,
        PrimeInputMask,
        queries,
        queryGraphql,
        Radio,
        RadioGroup,
        ReactForm,
        ReactSelect,
        registerAccounts,
        releaseForm,
        RemoveCircle,
        resetForm,
        resetAllFormErrors,
        // RsuiteButton,
        saveForm,
        SearchIcon,
        SendIcon,
        setInBag,
        setFormError,
        Switch,
        SyncIcon,
        tableIcons,
        Tabs,
        Tab,
        TextareaAutosize,
        TextField,
        theme,
        toDecimalFormat,
        TraceDialog,
        TraceFullWidthSubmitButton,
        traceGlobalSearch,
        TraceSearchBox,
        Tree,
        // TreePicker,
        TreeTable,
        Typography,
        useGeneric,
        useTheme,
        useTraceMaterialComponents,
        useTraceGlobal,
        XXGrid,
        ZoomInIcon,
        ZoomOutIcon,
    }
}

export { useSharedElements }
export { makeStyles, createStyles }
export type { Theme } // this is a workaround

const useStyles: any = makeStyles((theme: Theme) =>
    createStyles({
        addButton: {
            float: 'left',
            color: 'blue', // theme.palette.blue.main,
        },

        addressEntry: {
            '& .x-add-icon, .x-minus-icon': {
                fontSize: '4rem',
                border: '1px solid grey',
            },

            '& .x-set': {
                border: '1px solid grey',
                padding: theme.spacing(2),
                marginTop: theme.spacing(1),
            },

            '& .textField': {
                marginTop: '.8rem',
            },
        },

        content: {
            marginBottom: theme.spacing(1),
            overflowX: 'auto',
        },

        deleteButton: {
            float: 'left',
            marginLeft: theme.spacing(1),
            color: theme.palette.error.main,
        },

        dialogPaper: {},

        dialogTitle: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingBottom: '0px',
        },

        dialogActions: {
            marginRight: theme.spacing(4),
        },

        editButton: {
            float: 'left',
            marginLeft: theme.spacing(1),
        },

        expandRefresh: {
            display: 'flex',
            alignItems: 'center',
            float: 'right',
        },

        header: {
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: theme.spacing(1),
        },

        syncIconButton: {
            paddingRight: theme.spacing(2),
        },

        typography: {
            verticalAlign: 'middle',
        },

        // To provide distances between labels and input boxes
        common: {
            '& select, input': {
                marginTop: theme.spacing(1),
                height: '2rem',
            },
            '& label': {
                marginTop: theme.spacing(1),
            },
        },
    })
)
export { useStyles }
