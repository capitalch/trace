import { makeStyles, Theme, createStyles , } from '../../../../imports/gui-imports'
import { useConfirm } from '../../../../imports/regular-imports'
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
    usingIbuki,
    useTraceGlobal,
    useTraceMaterialComponents,
    XXGrid,
} from '../../../../imports/trace-imports'

import { utilMethods } from '../../../../global-utils/misc-utils'
import accountsMessages from '../../json/accounts-messages.json'
import messages from '../../../../messages.json'
import { getArtifacts } from '../../../../react-form/common/react-form-hook'
import { useGeneric } from '../../../../react-form/core/generic-item'
import { map } from 'rxjs/operators'
import { utils } from '../../utils'
import { initCode } from '../../init-code'

function useSharedElements() {
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
        accountsMessages,
        clearServerError,
        confirm,
        doFormRefresh,
        doValidateForm,
        emit,
        execGenericView,
        extractAmount,
        filterOn,
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
        hotEmit,
        hotFilterOn,
        init,
        initCode,
        isControlDisabled,
        isDateAuditLocked,
        isDateNotAuditLocked,
        isGoodToDelete,
        isMediumSizeUp,
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
        manageFormsState,
        map,
        messages,
        mutateGraphql,
        queries,
        queryGraphql,
        ReactForm,
        registerAccounts,
        releaseForm,
        resetForm,
        resetAllFormErrors,
        saveForm,
        setInBag,
        setFormError,
        tableIcons,
        toDecimalFormat,
        TraceDialog,
        TraceFullWidthSubmitButton,
        traceGlobalSearch,
        TraceSearchBox,
        useGeneric,
        useTraceMaterialComponents,
        useTraceGlobal,
        XXGrid,
    }
}

export { useSharedElements }

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
