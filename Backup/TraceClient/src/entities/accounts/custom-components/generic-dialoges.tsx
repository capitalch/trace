import React, { useEffect, useState, useRef } from 'react'
// import { Button } from 'primereact/button'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import {
    Toolbar, Typography
    , Button, IconButton, Chip, Backdrop
    , Dialog, DialogTitle, DialogContent, DialogActions
} from '@material-ui/core'
import CloseIcon from '@material-ui/icons/CloseSharp'
import CircularProgress from '@material-ui/core/CircularProgress'
import moment from 'moment'
import { useIbuki } from '../../../common-utils/ibuki'
import { manageFormsState } from '../../../react-form/core/fsm'

// import Combobox from 'react-widgets/lib/Combobox'
// import { getArtifacts } from '../../../react-form/common/react-form-hook'
import { manageEntitiesState } from '../../../common-utils/esm'
import ReactForm from '../../../react-form/react-form'
import { componentStore } from '../../../react-form/component-store/html-core'
// import { graphqlService } from '../../../common-utils/graphql-service'
// import queries from '../entities/accounts/artifacts/graphql-queries-mutations'
import { utilMethods } from '../../../common-utils/util-methods'
// import queries from '../artifacts/graphql-queries-mutations'
// import { DialogContent } from '@material-ui/core'
// import { initialize } from '../../../react-form/common/react-form-hook'
import { utils } from '../utils'
import { initCode } from '../init-code'
import messages from '../../../messages.json'
import accountMessages from '../accounts-messages.json'
import { useTraceGlobal } from '../../../common-utils/trace-global'
import { useTraceMaterialComponents } from '../../../common/trace-material-components'

function GenericDialoges({ loadDialog }: any) {
    const meta: any = useRef({
        showDialog: false
        , isMounted: true
        , isLoading: false
        , dialogConfig: {
            title: ''
            , formId: ''
            , jsonObject: {}
            , height: '40rem'
            , width: '31rem'
            , loginScreenSize: '360px'
        }
    })
    //For increasing width of dialog window when medium size i.e 960 px and up is achieved
    const { isMediumSizeUp } = useTraceGlobal()
    if (isMediumSizeUp) {
        meta.current.dialogConfig.loginScreenSize = '360px'
    }
    else {
        meta.current.dialogConfig.loginScreenSize = '290px'
    }

    const classes = useStyles({ loginScreenSize: meta.current.dialogConfig.loginScreenSize }) //{width: '620px'}
    const { TraceFullWidthSubmitButton }: any = useTraceMaterialComponents()
    const { getUnitHeading } = utils()
    const { getLoginData, getCurrentEntity, setInBag, getFromBag, setCurrentComponent } = manageEntitiesState()
    const { emit } = useIbuki()
    const [, setRefresh] = useState({})
    const { execGenericView, genericUpdateMaster } = utilMethods()
    // const { queryGraphql, mutateGraphql } = graphqlService()
    // const { getDashedEntityName } = utilMethods()
    const { resetAllValidators, clearServerError, resetForm, getFormData, setFormData, getValidationFabric } = manageFormsState()
    const { isValidForm, doValidateForm } = getValidationFabric()
    const { setLastBuCodeFinYearIdBranchId, execDataCache } = initCode()

    useEffect(() => {
        meta.current.isMounted = true
        dialogSelectLogic()[loadDialog].read()
        return (() => {
            meta.current.isMounted = false
        })
    }, [])

    return <>
        <Dialog
            classes={{
                // for adjustment of dialog size as per viewport
                paper: classes.dialogPaper
            }}
            open={meta.current.showDialog}
            onClose={() => {
                closeDialog()
            }}>
            <DialogTitle disableTypography id="generic-dialog-title"
                className={classes.dialogTitle}>
                <h2>
                    {meta.current.dialogConfig.title}
                </h2>
                <IconButton size='small' color="default"
                    onClick={closeDialog} aria-label="close">
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent className={classes.dialogContent}>
                <DlgContent></DlgContent>
            </DialogContent>
            <DialogActions
                className={classes.dialogActions}>
                <TraceFullWidthSubmitButton
                    onClick={() => {
                        dialogSelectLogic()[loadDialog].update()
                    }}></TraceFullWidthSubmitButton>
            </DialogActions>
        </Dialog>
        <Backdrop //used to show progressbar
            className={classes.backdrop}
            open={meta.current.isLoading}>
            <CircularProgress color="inherit" />
        </Backdrop>
    </>

    function dialogSelectLogic() {
        const entityName = getCurrentEntity()
        const authEntityName = 'authentication'
        const loginData = getLoginData()
        const dateFormat: string = getFromBag('dateFormat')
        const logic: any = {

            unitInfo:
            {
                read:
                    async () => {
                        meta.current.dialogConfig.formId = 'unitInfo'
                        meta.current.dialogConfig.title = 'Unit info'
                        meta.current.dialogConfig.jsonObject = unitInfoJson
                        meta.current.isLoading = true
                        setRefresh({})
                        meta.current.showDialog = true
                        const ret = await execGenericView({
                            isMultipleRows: false
                            , sqlKey: 'get_unitInfo'
                            , args: {
                            }
                            , entityName: entityName
                        })
                        const pre = ret?.jData
                        if (pre) {
                            setFormData(meta.current.dialogConfig.formId, pre)
                        }
                        meta.current.isLoading = false
                        meta.current.isMounted && setRefresh({})
                    }
                , update:
                    async () => {
                        const formId = meta.current.dialogConfig.formId
                        clearServerError(formId)
                        await doValidateForm(formId)
                        if (!isValidForm(formId)) {
                            setRefresh({})
                            return
                        }
                        const formData = JSON.stringify(getFormData(meta.current.dialogConfig.formId))
                        meta.current.isLoading = true
                        setRefresh({})
                        const ret: any = await genericUpdateMaster({
                            formId: meta.current.dialogConfig.formId
                            , customCodeBlock: 'upsert_unitInfo'
                            , entityName: entityName
                            , data: { jData: formData }
                            , setRefresh: setRefresh
                        })
                        if (ret === true) {
                            execDataCache()
                            emit('SHOW-MESSAGE', {})
                            closeDialog()
                        } else if (ret && ret.message) {
                            emit('SHOW-MESSAGE', { severity: 'error', message: ret.message, duration: null })
                        } else {
                            emit('SHOW-MESSAGE', { severity: 'error', message: messages['errorInOperation'], duration: null })
                        }
                        meta.current.isLoading = false
                        setRefresh({})
                    }
            },

            generalSettings: {
                read: async () => {
                    meta.current.dialogConfig.formId = 'generalSettings'
                    meta.current.dialogConfig.title = 'General settings'
                    meta.current.dialogConfig.jsonObject = generalSettingsJson
                    meta.current.showDialog = true
                    meta.current.isLoading = true
                    setRefresh({})
                    const ret = await execGenericView({
                        isMultipleRows: false
                        , sqlKey: 'get_generalSettings'
                        , args: {
                        }
                        , entityName: entityName
                    })
                    const pre = ret?.jData
                    if (pre) {
                        setFormData(meta.current.dialogConfig.formId, pre)
                    }
                    meta.current.isLoading = false
                    meta.current.isMounted && setRefresh({})
                }, update:
                    async () => {
                        const formId = meta.current.dialogConfig.formId
                        clearServerError(formId)
                        await doValidateForm(formId)
                        if (!isValidForm(formId)) {
                            setRefresh({})
                            return
                        } 
                        const formData = JSON.stringify(getFormData(meta.current.dialogConfig.formId))
                        const ret: any = await genericUpdateMaster({
                            formId: meta.current.dialogConfig.formId
                            , customCodeBlock: 'upsert_generalSettings'
                            , entityName: entityName
                            , data: { jData: formData }
                            , setRefresh: setRefresh
                        })
                        if (ret === true) {
                            // execDataCache()
                            setLastBuCodeFinYearIdBranchId()
                            emit('SHOW-MESSAGE', {})
                            closeDialog()
                        } else if (ret && ret.message) {
                            emit('SHOW-MESSAGE', { severity: 'error', message: ret.message, duration: null })
                        } else {
                            emit('SHOW-MESSAGE', { severity: 'error', message: messages['errorInOperation'], duration: null })
                        }
                    }
            },

            selectBu:
            {
                read:
                    async () => {
                        meta.current.isLoading = true
                        // setRefresh({}) 
                        meta.current.dialogConfig.formId = 'selectBu'
                        meta.current.dialogConfig.title = 'Select business unit'
                        meta.current.dialogConfig.jsonObject = selectBuJson  
                                             
                        meta.current.showDialog = true                        
                        const ret = await execGenericView({
                            isMultipleRows: true
                            , sqlKey: 'get_businessUnits_for_loggedinUser'
                            , args: {
                                entityName: entityName
                                , id: loginData.id
                            }
                            , entityName: authEntityName

                        })
                        meta.current.isLoading = false                        
                        if (!ret) return
                        const bu: any[] = ret
                        meta.current.bu = bu.map((x) => {
                            return {
                                label: x.buCode
                                , value: x.buCode
                            }
                        })
                        selectBuJson.items[0].options = meta.current.bu
                        const buCode = getFromBag('buCode')
                        buCode && (selectBuJson.items[0].value = buCode)
                       
                        meta.current.isMounted && setRefresh({})
                    }
                , update:
                    async () => {
                        const formData = getFormData(meta.current.dialogConfig.formId)
                        const ret: any = await genericUpdateMaster({
                            formId: meta.current.dialogConfig.formId
                            , customCodeBlock: 'update_lastUsedBuCode'
                            , entityName: authEntityName
                            , data: {
                                userId: getLoginData().id
                                , buCode: formData.buCode
                            }
                            , setRefresh: setRefresh
                        })
                        if (ret === true) {
                            setInBag('buCode', formData.buCode)
                            emit('SHOW-MESSAGE', {})
                            //when buCode is changed then set the default branch id which is 1
                            setLastBuCodeFinYearIdBranchId(1) // to restart init-code to load bu, finYear and branch in trace-subheader. The finYear and branch depend on bu. 
                            closeDialog()
                        } else if (ret && ret.message) {
                            emit('SHOW-MESSAGE', { severity: 'error', message: ret.message, duration: null })
                        } else {
                            emit('SHOW-MESSAGE', { severity: 'error', message: messages['errorInOperation'], duration: null })
                        }
                    }
            }
            , selectFinYear: {
                read:
                    async () => {
                        meta.current.dialogConfig.formId = 'selectFinYear'
                        meta.current.dialogConfig.title = 'Select financial year'
                        meta.current.dialogConfig.jsonObject = selectFinYearJson
                        meta.current.isLoading = true
                        setRefresh({}) 
                        meta.current.showDialog = true
                        const ret = await execGenericView({
                            isMultipleRows: true
                            , sqlKey: 'get_finYears'
                            , args: {}
                            , entityName: entityName
                        })
                        if (!ret) {
                            emit('SHOW-MESSAGE', { severity: 'error', message: accountMessages['getFinYearsFailed'], duration: null })
                            return
                        }
                        const finYears: any[] = ret
                        setInBag('finYears', finYears) // to be used in update, at later stage
                        meta.current.finYears = finYears.map((x) => {
                            return {
                                label: String(x.id).concat(' : ( ', moment(x.startDate).format(dateFormat), ' to ', moment(x.endDate).format(dateFormat), ' )')
                                , value: x.id
                            }
                        })
                        selectFinYearJson.items[0].options = meta.current.finYears
                        const finYearObject = getFromBag('finYearObject')
                        finYearObject && (selectFinYearJson.items[0].value = finYearObject.finYearId)
                        meta.current.isMounted && setRefresh({})
                    }
                , update:
                    async () => {
                        const formData = getFormData(meta.current.dialogConfig.formId)
                        const finYears: any[] = getFromBag('finYears')
                        const finYearId = formData.id
                        const finYearObject = getFromBag('finYearObject')
                        if (finYearObject?.finYearId !== finYearId) {
                            const selectedObject: any = finYears.find((x) => {
                                return x.id === +finYearId
                            }
                            )
                            finYearObject.finYearId = selectedObject?.id
                            finYearObject.startDate = moment(selectedObject.startDate).format(dateFormat)
                            finYearObject.endDate = moment(selectedObject.endDate).format(dateFormat)
                            emit('SHOW-MESSAGE', {})
                            emit('LOAD-SUBHEADER-JUST-REFRESH', '')
                            emit('LOAD-MAIN-JUST-REFRESH', { mainHeading: getUnitHeading() })
                        }
                        closeDialog()
                    }
            }
            , selectBranch: {
                read:
                    async () => {
                        meta.current.dialogConfig.formId = 'selectBranch'
                        meta.current.dialogConfig.title = 'Select branch'
                        meta.current.dialogConfig.jsonObject = selectBranchJson
                        meta.current.showDialog = true
                        const ret = await execGenericView({
                            isMultipleRows: true
                            , sqlKey: 'get_branches'
                            , args: {}
                            , entityName: entityName
                        })
                        if (!ret) return
                        const branches: any[] = ret
                        setInBag('branches', branches) // to be used in update, at later stage
                        meta.current.branches = branches.map((x) => {
                            return {
                                label: x.branchCode.concat(' : ', x.branchName)
                                , value: x.id
                            }
                        })
                        selectBranchJson.items[0].options = meta.current.branches
                        const branchObject = getFromBag('branchObject')
                        branchObject && (selectBranchJson.items[0].value = branchObject.branchId)
                        meta.current.isMounted && setRefresh({})
                    }

                , update:
                    async () => {
                        const formData = getFormData(meta.current.dialogConfig.formId)
                        const branches: any[] = getFromBag('branches')
                        const branchId = formData.id
                        const branchObject = getFromBag('branchObject')
                        if (branchObject?.branchId !== branchId) {
                            const selectedObject = branches.find((x) => x.id === branchId)
                            branchObject.branchId = selectedObject.id
                            branchObject.branchName = selectedObject.branchName
                            // save in authenticatio DB useHistory table
                            const ret: any = await genericUpdateMaster({
                                formId: meta.current.dialogConfig.formId
                                , customCodeBlock: 'update_lastUsedBranchId'
                                , entityName: authEntityName
                                , data: {
                                    userId: getLoginData().id
                                    , branchId: formData.id
                                }
                                , setRefresh: setRefresh
                            })
                            if (ret === true) {
                                emit('SHOW-MESSAGE', {})
                                emit('LOAD-SUBHEADER-JUST-REFRESH', '')
                                emit('LOAD-MAIN-JUST-REFRESH', { mainHeading: getUnitHeading() })
                            }
                        }
                        closeDialog()
                    }
            }
        }
        return logic
    }

    function DlgContent() {
        resetAllValidators(meta.current.dialogConfig.formId)
        return <ReactForm
            formId={meta.current.dialogConfig.formId}
            jsonText={JSON.stringify(meta.current.dialogConfig.jsonObject)}
            name={getCurrentEntity()}
            // componentStore={componentStore}
        ></ReactForm>
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
        backdrop: { // for showing progress indicator
            zIndex: theme.zIndex.drawer + 1000, // it is working with 1000 z-index
            color: theme.palette.primary.dark,
        },
        //As per documentation of material the "rule" paper can be overridden. This is actual the dialog box. The container of dialog box is backdrop
        dialogPaper: {
            width: ({ loginScreenSize }: any) => loginScreenSize
        },
        dialogTitle: {
            display: 'flex'
            , justifyContent: 'space-between'
            , alignItems: 'center'
            , paddingBottom: '0px'
        },
        dialogContent: {
            minHeight: '15rem',
        },
        dialogActions: {
            marginRight: theme.spacing(2),
            zIndex: 0,
        },
    })
)

const unitInfoJson: any = {
    "class": "generic-dialog",
    "items": [
        {
            "type": "TextMaterial",
            "name": "unitName",
            "placeholder": "Name of unit",
            "label": "Name of unit",
            "validations": [
                {
                    "name": "required",
                    "message": "Please provide a name for this unit"
                }
            ]
        },
        {
            "type": "Text",
            "name": "shortName",
            "placeholder": "Short name",
            "label": "Short name",
            "validations": [
                {
                    "name": "required",
                    "message": "Please provide a short name for this unit"
                }
            ]
        },
        {
            "type": "Text",
            "name": "address1",
            "placeholder": "Address1",
            "label": "Address1",
            "validations": [
                {
                    "name": "required",
                    "message": "Please provide an address for this unit"
                }
            ]
        },
        {
            "type": "Text",
            "name": "address2",
            "placeholder": "Address2",
            "label": "Address2",
            "validations": [
            ]
        },
        {
            "type": "Text",
            "name": "pin",
            "placeholder": "Pin",
            "label": "Pin",
            "validations": [
                {
                    "name": "required",
                    "message": "Please provide Pin code"
                }
            ]
        },
        {
            "type": "Text",
            "name": "email",
            "placeholder": "Email",
            "label": "Email",
            "validations": [
                {
                    "name": "required",
                    "message": "Please provide the email for this unit"
                }
            ]
        },
        {
            "type": "Text",
            "name": "tin",
            "placeholder": "Tin",
            "label": "Tin",
            "validations": [
            ]
        }
    ]
}

const generalSettingsJson: any = {
    "class": "generic-dialog",
    "items": [
        {
            "type": "TypeSelect",
            "name": "dateFormat",
            "placeholder": "Date format",
            "label": "Select date format",
            "options": [
                {
                    "label": "MM/DD/YYYY",
                    "value": "MM/DD/YYYY"
                },
                {
                    "label": "DD/MM/YYYY",
                    "value": "DD/MM/YYYY"
                },
                {
                    "label": "YYYY-MM-DD",
                    "value": "YYYY-MM-DD"
                }
            ],
            "validations": [
                {
                    "name": "required",
                    "message": "Please select a date format"
                }
            ]
        }
    ]
}

const selectBuJson: any = {
    "class": "generic-dialog",
    "items": [
        {
            "type": "TypeSelect",
            "name": "buCode",
            "placeholder": "Business units",
            "label": "Select business unit",
            "options": [],
            "validations": [
                {
                    "name": "required",
                    "message": "Please select a business unit"
                }
            ]
        }
    ]
}

const selectFinYearJson: any = {
    "class": "generic-dialog",
    "items": [
        {
            // "type": "TypeSelect",
            "class": "select-fin-year",
            "type": "Select",
            "name": "id",
            "placeholder": "Financial years",
            "label": "Select financial year",
            "options": [],
            "validations": [
                {
                    "name": "required",
                    "message": "Please select a financial year"
                }
            ]
        }
    ]
}

const selectBranchJson: any = {
    "class": "generic-dialog",
    "items": [
        {
            "type": "TypeSelect",
            "name": "id",
            "placeholder": "Branches",
            "label": "Select branch",
            "options": [],
            "validations": [
                {
                    "name": "required",
                    "message": "Please select a branch"
                }
            ]
        }
    ]
}