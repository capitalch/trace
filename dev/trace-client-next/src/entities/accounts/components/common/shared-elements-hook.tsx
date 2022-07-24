import { makeStyles, Theme, createStyles, } from '../../../../imports/gui-imports'
import { useConfirm } from '../../../../imports/regular-imports'
import { Document, BlobProvider, Line, Page, pdf, PDFViewer, StyleSheet, Svg, Text, usePDF, View, } from '@react-pdf/renderer'
import { Document as MDocument, BlobProvider as MBlobProvider, Line as MLine, Page as MPage, pdf as mpdf, PDFViewer as MPDFViewer, StyleSheet as MStyleSheet, Svg as MSvg, Text as MText, usePDF as musePDF, View as MView, } from '@react-pdf/renderer'
import { components as reactSelectComponents } from 'react-select'
import ReactSelect from 'react-select'

import {
    globalMessages,
    graphqlService,
    LedgerSubledger,
    manageEntitiesState,
    manageFormsState,
    queries,
    ReactForm,
    useIbuki,
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
        execGenericView,
        extractAmount,
        getDateMaskMap,
        genericUpdateMaster,
        genericUpdateMasterDetails,
        genericUpdateMasterNoForm,
        isControlDisabled,
        numberToWordsInRs,
        saveForm,
        sendEmail,
        sendSms,
        toDecimalFormat,
    } = utilMethods()
    const { hotEmit, hotFilterOn, emit, filterOn, debounceEmit, debounceFilterOn } = useIbuki()
    const {
        BasicMaterialDialog,
        TraceDialog,
        traceGlobalSearch,
        TraceFullWidthSubmitButton,
        TraceSearchBox,
    } = useTraceMaterialComponents()
    const { getCurrentMediaSize, isMediumSizeDown, isMediumSizeUp, getCurrentWindowSize } =
        useTraceGlobal()
    const confirm = useConfirm()
    const {
        execSaleInvoiceView,
        getAccountBalanceFormatted,
        getAccountClass,
        getAccountName,
        getAccountClassWithAutoSubledger,
        getGridReportSubTitle,
        getMappedAccounts,
        getTranType,
        getUnitHeading,
        isDateNotAuditLocked,
        isDateAuditLocked,
        isGoodToDelete,
        isAllowedUpdate,
        isImproperDate,
        isInvalidDate,
        isInvalidEmail,
        isInvalidGstin,
        isInvalidIndiaMobile,
        isInvalidIndiaPin,
        isInvalidStateCode,
        registerAccounts,
        transferClosingBalances,
    } = utils()
    return {
        accountsMessages,
        BasicMaterialDialog,
        BlobProvider,
        clearServerError,
        confirm,
        debounceEmit,
        debounceFilterOn,
        Document,
        doFormRefresh,
        doValidateForm,
        emit,
        execGenericView,
        execSaleInvoiceView,
        extractAmount,
        filterOn,
        getAccountBalanceFormatted,
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
        getDateMaskMap,
        getFromBag,
        getFormData,
        getFormObject,
        getGridReportSubTitle,
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
        isAllowedUpdate,
        isControlDisabled,
        isDateAuditLocked,
        isDateNotAuditLocked,
        isGoodToDelete,
        isMediumSizeDown,
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
        Line,
        manageFormsState,
        map,
        messages,
        mutateGraphql,
        numberToWordsInRs,
        Page,
        pdf,
        PDFViewer,
        queries,
        queryGraphql,
        ReactForm,
        reactSelectComponents,
        ReactSelect,
        registerAccounts,
        releaseForm,
        resetForm,
        resetAllFormErrors,
        saveForm,
        sendEmail,
        sendSms,
        setInBag,
        setFormError,
        StyleSheet,
        Svg,
        Text,
        toDecimalFormat,
        TraceDialog,
        TraceFullWidthSubmitButton,
        traceGlobalSearch,
        TraceSearchBox,
        transferClosingBalances,
        useGeneric,
        useTraceMaterialComponents,
        useTraceGlobal,
        usePDF,
        View,
        XXGrid,
        MDocument,
        MBlobProvider,
        MLine,
        MPage,
        mpdf,
        MPDFViewer,
        MStyleSheet,
        MSvg,
        MText,
        musePDF,
        MView
    }
}
// import { Document as _Document, BlobProvider as _BlobProvider, Line as _Line, Page as _Page, pdf as _pdf, PDFViewer as _PDFViewer, StyleSheet as _StyleSheet, Svg as _Svg, Text as _Text, usePDF as _usePDF, View as _View, } from '@react-pdf/renderer'
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

        syncSharpButton: {
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
