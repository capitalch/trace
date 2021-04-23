import { useEffect, useState, useRef } from 'react'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import {
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from '@material-ui/core'
import CloseIcon from '@material-ui/icons/CloseSharp'
// import moment from 'moment'
import _ from 'lodash'
import { usingIbuki } from '../../../../common-utils/ibuki'
import { manageFormsState } from '../../../../react-form/core/fsm'

import { manageEntitiesState } from '../../../../common-utils/esm'
import ReactForm from '../../../../react-form/react-form'
import { utilMethods } from '../../../../common-utils/util-methods'
// import { utils } from '../../utils'
import { initCode } from '../../init-code'
import messages from '../../../../messages.json'
// import accountMessages from '../../json/accounts-messages.json'
import { useTraceGlobal } from '../../../../common-utils/trace-global'
import { useTraceMaterialComponents } from '../../../../common/trace-material-components'

function GenericDialoges({ loadDialog }: any) {
    const meta: any = useRef({
        showDialog: false,
        isMounted: true,
        dialogConfig: {
            title: '',
            formId: '',
            jsonObject: {},
            height: '40rem',
            width: '31rem',
            loginScreenSize: '360px',
        },
    })
    //For increasing width of dialog window when medium size i.e 960 px and up is achieved
    const { isMediumSizeUp } = useTraceGlobal()
    if (isMediumSizeUp) {
        meta.current.dialogConfig.loginScreenSize = '360px'
    } else {
        meta.current.dialogConfig.loginScreenSize = '290px'
    }

    const classes = useStyles({
        loginScreenSize: meta.current.dialogConfig.loginScreenSize,
    })
    const { TraceFullWidthSubmitButton }: any = useTraceMaterialComponents()
    // const { getUnitHeading } = utils()
    const {
        // getLoginData,
        getCurrentEntity,
        // setInBag,
        // getFromBag,
        setCurrentComponent,
    } = manageEntitiesState()
    const { emit } = usingIbuki()
    const [, setRefresh] = useState({})
    const {
        execGenericView,
        genericUpdateMaster,
        isControlDisabled,
    } = utilMethods()
    const {
        resetAllValidators,
        clearServerError,
        resetForm,
        getFormData,
        setFormData,
        getValidationFabric,
    } = manageFormsState()
    const { isValidForm, doValidateForm } = getValidationFabric()
    const { setLastBuCodeFinYearIdBranchId, execDataCache } = initCode()

    useEffect(() => {
        meta.current.isMounted = true
        dialogSelectLogic()[loadDialog].read()
        return () => {
            meta.current.isMounted = false
        }
    }, [])

    const ifElsePermissionMap: any = {
        unitInfo: 'unitInfoEdit',
        generalSettings: 'generalSettingsEdit',
    }

    return (
        <>
            <Dialog
                classes={{
                    // for adjustment of dialog size as per viewport
                    paper: classes.dialogPaper,
                }}
                open={meta.current.showDialog}
                onClose={() => {
                    closeDialog()
                }}>
                <DialogTitle
                    disableTypography
                    id="generic-dialog-title"
                    className={classes.dialogTitle}>
                    <h2>{meta.current.dialogConfig.title}</h2>
                    <IconButton
                        size="small"
                        color="default"
                        onClick={closeDialog}
                        aria-label="close">
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent className={classes.dialogContent}>
                    <DlgContent></DlgContent>
                </DialogContent>
                <DialogActions className={classes.dialogActions}>
                    <TraceFullWidthSubmitButton
                        disabled={isControlDisabled(
                            ifElsePermissionMap[loadDialog]
                        )}
                        onClick={() => {
                            dialogSelectLogic()[loadDialog].update()
                        }}></TraceFullWidthSubmitButton>
                </DialogActions>
            </Dialog>
        </>
    )

    function dialogSelectLogic() {
        const entityName = getCurrentEntity()
        // const authEntityName = 'authentication'
        // const loginData = getLoginData()
        // const dateFormat: string = getFromBag('dateFormat')
        const logic: any = {
            unitInfo: {
                read: async () => {
                    meta.current.dialogConfig.formId = 'unitInfo'
                    meta.current.dialogConfig.title = 'Unit info'
                    meta.current.dialogConfig.jsonObject = unitInfoJson
                    emit('SHOW-LOADING-INDICATOR', true)
                    meta.current.showDialog = true
                    const ret = await execGenericView({
                        isMultipleRows: false,
                        sqlKey: 'get_unitInfo',
                        args: {},
                        entityName: entityName,
                    })
                    const pre = ret?.jData
                    if (pre) {
                        setFormData(meta.current.dialogConfig.formId, pre)
                    }
                    emit('SHOW-LOADING-INDICATOR', false)
                    meta.current.isMounted && setRefresh({})
                },
                update: async () => {
                    const formId = meta.current.dialogConfig.formId
                    clearServerError(formId)
                    await doValidateForm(formId)
                    if (!isValidForm(formId)) {
                        meta.current.isMounted && setRefresh({})
                        return
                    }
                    const formData = JSON.stringify(
                        getFormData(meta.current.dialogConfig.formId)
                    )
                    emit('SHOW-LOADING-INDICATOR', true)
                    const ret: any = await genericUpdateMaster({
                        formId: meta.current.dialogConfig.formId,
                        customCodeBlock: 'upsert_unitInfo',
                        entityName: entityName,
                        data: { jData: formData },
                        setRefresh: setRefresh,
                    })
                    if ((ret === true) || (ret?.length <= 9)) {
                        execDataCache()
                        emit('SHOW-MESSAGE', {})
                        closeDialog()
                    } else if (ret && ret.message) {
                        emit('SHOW-MESSAGE', {
                            severity: 'error',
                            message: ret.message,
                            duration: null,
                        })
                    } else {
                        emit('SHOW-MESSAGE', {
                            severity: 'error',
                            message: messages['errorInOperation'],
                            duration: null,
                        })
                    }
                    emit('SHOW-LOADING-INDICATOR', false)
                    meta.current.isMounted && setRefresh({})
                },
            },

            generalSettings: {
                read: async () => {
                    meta.current.dialogConfig.formId = 'generalSettings'
                    meta.current.dialogConfig.title = 'General settings'
                    meta.current.dialogConfig.jsonObject = generalSettingsJson
                    meta.current.showDialog = true
                    emit('SHOW-LOADING-INDICATOR', true)
                    const ret = await execGenericView({
                        isMultipleRows: false,
                        sqlKey: 'get_generalSettings',
                        args: {},
                        entityName: entityName,
                    })
                    const pre = ret?.jData
                    if (pre?.auditLockDate) {
                        meta.current.dialogConfig.jsonObject.items[2].value =
                            pre.auditLockData
                    }
                    if (pre) {
                        setFormData(meta.current.dialogConfig.formId, pre)
                    }
                    emit('SHOW-LOADING-INDICATOR', false)
                    meta.current.isMounted && setRefresh({})
                },
                update: async () => {
                    const formId = meta.current.dialogConfig.formId
                    clearServerError(formId)
                    await doValidateForm(formId)
                    if (!isValidForm(formId)) {
                        meta.current.isMounted && setRefresh({})
                        return
                    }
                    const formData = JSON.stringify(
                        getFormData(meta.current.dialogConfig.formId)
                    )
                    const ret: any = await genericUpdateMaster({
                        formId: meta.current.dialogConfig.formId,
                        customCodeBlock: 'upsert_generalSettings',
                        entityName: entityName,
                        data: { jData: formData },
                        setRefresh: setRefresh,
                    })
                    if ((ret === true) || (ret?.length <= 9)) {
                        setLastBuCodeFinYearIdBranchId()
                        emit('SHOW-MESSAGE', {})
                        emit('LOAD-MAIN-JUST-REFRESH', null)
                        closeDialog()
                    } else if (ret && ret.message) {
                        emit('SHOW-MESSAGE', {
                            severity: 'error',
                            message: ret.message,
                            duration: null,
                        })
                    } else {
                        emit('SHOW-MESSAGE', {
                            severity: 'error',
                            message: messages['errorInOperation'],
                            duration: null,
                        })
                    }
                },
            },
        }
        return logic
    }

    function DlgContent() {
        resetAllValidators(meta.current.dialogConfig.formId)
        return (
            <ReactForm
                localMethods={{
                    resetAuditLockDate: () =>
                        console.log('Reset audit lock date'),
                }}
                formId={meta.current.dialogConfig.formId}
                jsonText={JSON.stringify(meta.current.dialogConfig.jsonObject)}
                name={getCurrentEntity()}
                className={classes.common}></ReactForm>
        )
    }

    function closeDialog() {
        meta.current.showDialog = false
        resetForm(meta.current.dialogConfig.formId)
        setCurrentComponent({})
        emit('LOAD-MAIN-JUST-REFRESH', '') //this is necessary otherwise on click of accounts this dialog window opens automatically
    }
}

export { GenericDialoges }

const useStyles: any = makeStyles((theme: Theme) =>
    createStyles({
        //As per documentation of material the "rule" paper can be overridden. This is actual the dialog box. The container of dialog box
        dialogPaper: {
            width: ({ loginScreenSize }: any) => loginScreenSize,
        },
        dialogTitle: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingBottom: '0px',
        },
        dialogContent: {
            minHeight: '15rem',
        },
        dialogActions: {
            zIndex: 0,
        },
        common: {
            '& input, select': {
                marginTop: theme.spacing(1),
                height: '2rem',
            },
            '& label': {
                marginTop: theme.spacing(1),
            },
        },
    })
)

const unitInfoJson: any = {
    class: 'generic-dialog',
    items: [
        {
            type: 'TextMaterial',
            name: 'unitName',
            placeholder: 'Name of unit',
            label: 'Name of unit',
            materialProps: {
                size: 'small',
                fullWidth: true,
            },
            validations: [
                {
                    name: 'required',
                    message: 'Please provide a name for this unit',
                },
            ],
        },
        {
            type: 'TextMaterial',
            name: 'shortName',
            placeholder: 'Short name',
            label: 'Short name',
            materialProps: {
                size: 'small',
                fullWidth: true,
            },
            validations: [
                {
                    name: 'required',
                    message: 'Please provide a short name for this unit',
                },
            ],
        },
        {
            type: 'TextMaterial',
            name: 'address1',
            placeholder: 'Address1',
            label: 'Address1',
            materialProps: {
                size: 'small',
                fullWidth: true,
            },
            validations: [
                {
                    name: 'required',
                    message: 'Please provide an address for this unit',
                },
            ],
        },
        {
            type: 'TextMaterial',
            name: 'address2',
            placeholder: 'Address2',
            label: 'Address2',
            materialProps: {
                size: 'small',
                fullWidth: true,
            },
            validations: [],
        },
        {
            type: 'TextMaterial',
            name: 'pin',
            placeholder: 'Pin',
            label: 'Pin',
            materialProps: {
                size: 'small',
                fullWidth: true,
            },
            validations: [
                {
                    name: 'required',
                    message: 'Please provide Pin code',
                },
            ],
        },
        {
            type: 'TextMaterial',
            name: 'email',
            placeholder: 'Email',
            label: 'Email',
            materialProps: {
                size: 'small',
                fullWidth: true,
            },
            validations: [
                {
                    name: 'required',
                    message: 'Please provide the email for this unit',
                },
            ],
        },
        {
            type: 'TextMaterial',
            name: 'tin',
            placeholder: 'Tin',
            materialProps: {
                size: 'small',
                fullWidth: true,
            },
            label: 'Tin',
            validations: [],
        },
    ],
}

const generalSettingsJson: any = {
    class: 'generic-dialog',
    items: [
        {
            type: 'TypeSelect',
            name: 'dateFormat',
            placeholder: 'Date format',
            label: 'Select date format',
            options: [
                {
                    label: 'MM/DD/YYYY',
                    value: 'MM/DD/YYYY',
                },
                {
                    label: 'DD/MM/YYYY',
                    value: 'DD/MM/YYYY',
                },
                {
                    label: 'YYYY-MM-DD',
                    value: 'YYYY-MM-DD',
                },
            ],
            validations: [
                {
                    name: 'required',
                    message: 'Please select a date format',
                },
            ],
        },
        {
            type: 'Text',
            name: 'autoLogoutTimeInMins',
            label: 'Auto log off time in minutes',
            placeholder: 'Auto log off time',
            validations: [
                {
                    name: 'required',
                    message: 'Auto log off time cannot be empty',
                },
            ],
        },
        {
            type: 'DatepickerWithReset',
            name: 'auditLockDate',
            label: 'Audit lock date',
            validations: [
                {
                    name: 'dateInFinYearOrEmpty',
                    message: 'Wrong audit lock date',
                },
            ],
        },
    ],
}

const selectBuJson: any = {
    class: 'generic-dialog',
    items: [
        {
            type: 'TypeSelect',
            name: 'buCode',
            placeholder: 'Business units',
            label: 'Select business unit',
            options: [],
            validations: [
                {
                    name: 'required',
                    message: 'Please select a business unit',
                },
            ],
        },
    ],
}

const selectFinYearJson: any = {
    class: 'generic-dialog',
    items: [
        {
            // "type": "TypeSelect",
            class: 'select-fin-year',
            type: 'Select',
            name: 'id',
            placeholder: 'Financial years',
            label: 'Select financial year',
            options: [],
            validations: [
                {
                    name: 'required',
                    message: 'Please select a financial year',
                },
            ],
        },
    ],
}

const selectBranchJson: any = {
    class: 'generic-dialog',
    items: [
        {
            type: 'TypeSelect',
            name: 'id',
            placeholder: 'Branches',
            label: 'Select branch',
            options: [],
            validations: [
                {
                    name: 'required',
                    message: 'Please select a branch',
                },
            ],
        },
    ],
}
