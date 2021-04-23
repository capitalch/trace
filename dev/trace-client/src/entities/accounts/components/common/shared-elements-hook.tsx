import _ from 'lodash'
import clsx from 'clsx'
import NumberFormat from 'react-number-format'
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
} from '@material-ui/core'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'

import {
    MTableToolbar,
    MTableBody,
    MTableBodyRow,
    MTableHeader,
} from 'material-table'
import Big from 'big.js'
import MaterialTable from 'material-table'
import { tableIcons } from './material-table-icons'
import { useConfirm } from 'material-ui-confirm'
import moment from 'moment'
import SyncIcon from '@material-ui/icons/SyncSharp'
import SearchIcon from '@material-ui/icons/Search'
import CloseIcon from '@material-ui/icons/Close'
import AddIcon from '@material-ui/icons/Add'
import EditIcon from '@material-ui/icons/Edit'
import SendIcon from '@material-ui/icons/Send'
import {
    AddCircle,
    Link as LinkIcon,
    Check as CheckIcon,
    Error as ErrorIcon,
    ClearAll as Clear,
    ZoomIn as ZoomInIcon,
    ZoomOut as ZoomOutIcon,
    RemoveCircleOutline as MinusIcon,
} from '@material-ui/icons'
import DeleteIcon from '@material-ui/icons/Delete'
import { useTraceMaterialComponents } from '../../../../common/trace-material-components'
import { useTraceGlobal } from '../../../../common-utils/trace-global'
import { TreeTable } from 'primereact/treetable'
import { DataTable } from 'primereact/datatable'
import { InputMask as PrimeInputMask } from 'primereact/inputmask'
import InputMask from 'react-input-mask'
import { Tree } from 'primereact/tree'
import { CascadeSelect } from 'primereact/cascadeselect'
import { Column as PrimeColumn } from 'primereact/column'
import { Dialog as PrimeDialog} from 'primereact/dialog'
import { InputSwitch } from 'primereact/inputswitch'
import { InputTextarea } from 'primereact/inputtextarea'
import { usingIbuki } from '../../../../common-utils/ibuki'
import { manageFormsState } from '../../../../react-form/core/fsm'
import { graphqlService } from '../../../../common-utils/graphql-service'
import queries from '../../artifacts/graphql-queries-mutations'
import { manageEntitiesState } from '../../../../common-utils/esm'
import ReactForm from '../../../../react-form/react-form'
import { utilMethods } from '../../../../common-utils/util-methods'
import globalMessages from '../../../../messages.json'
import accountsMessages from '../../json/accounts-messages.json'
import messages from '../../../../messages.json'
import { getArtifacts } from '../../../../react-form/common/react-form-hook'
import { useGeneric } from '../../../../react-form/core/generic-item'
import { LedgerSubledger } from './ledger-subledger'
import { map } from 'rxjs/operators'
import { utils } from '../../utils'
import { Button as RsuiteButton, Cascader, TreePicker } from 'rsuite'
import ReactSelect from 'react-select'
import {LedgerSubledgerCascade} from './ledger-subledger-cascade'
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
        saveForm,
        genericUpdateMaster,
        genericUpdateMasterNoForm,
        isControlDisabled,
        execGenericView,
        toDecimalFormat,
    } = utilMethods()
    const { hotFilterOn, emit, filterOn } = usingIbuki()
    const {
        TraceDialog,
        traceGlobalSearch,
        TraceFullWidthSubmitButton,
        TraceSearchBox,
    } = useTraceMaterialComponents()
    const {
        getCurrentMediaSize,
        isMediumSizeUp,
        getCurrentWindowSize,
    } = useTraceGlobal()
    const confirm = useConfirm()
    const {
        getAccountClass,
        getAccountClassWithAutoSubledger,
        getGeneralLedger,
        getMappedAccounts,
        getUnitHeading,
        isDateNotAuditLocked,
        isDateAuditLocked,
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
        Cascader,
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
        faSpinner,
        filterOn,
        FontAwesomeIcon,
        FormControl,
        FormControlLabel,
        FormHelperText,
        genericUpdateMaster,
        genericUpdateMasterNoForm,
        getAccountClass,
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
        getUnitHeading,
        getValidationFabric,
        globalMessages,
        Grid,
        hotFilterOn,
        Icon,
        init,
        initCode,
        isControlDisabled,
        isDateAuditLocked,
        isDateNotAuditLocked,
        isMediumSizeUp,
        IconButton,
        Input,
        InputAdornment,
        InputLabel,
        InputMask,
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
        resetForm,
        resetAllFormErrors,
        RsuiteButton,
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
        TreePicker,
        TreeTable,
        Typography,
        useGeneric,
        useTheme,
        useTraceMaterialComponents,
        useTraceGlobal,
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
