import React, { useState, useEffect, useRef } from 'react'
import hash from 'object-hash'
import {
    Checkbox,
    IconButton,
    Theme,
    useTheme,
    createStyles,
    makeStyles,
} from '@material-ui/core'

import EditIcon from '@material-ui/icons/Edit'
import CloseIcon from '@material-ui/icons/Close'
import Settings from '@material-ui/icons/Settings'
import _ from 'lodash'
import { useTraceMaterialComponents } from '../../../common/trace-material-components'
import { Column } from 'primereact/column'
import { manageEntitiesState } from '../../../common-utils/esm'
import { manageFormsState } from '../../../react-form/core/fsm'
import { utilMethods } from '../../../common-utils/util-methods'
import messages from '../../../messages.json'
import { usingIbuki } from '../../../common-utils/ibuki'
import { useTraceGlobal } from '../../../common-utils/trace-global'
import queries from '../artifacts/graphql-queries-mutations'
import { graphqlService } from '../../../common-utils/graphql-service'

function useSharedElements(meta: any = {}) {
    const { getCurrentEntity, getFromBag, getLoginData } = manageEntitiesState()
    const {
        showServerError,
        doFormRefresh,
        resetForm,
        getFormObject,
        getFormData,
        resetAllValidators,
        resetAllFormErrors,
        clearServerError,
        getValidationFabric,
    } = manageFormsState()
    const { doValidateForm, isValidForm } = getValidationFabric()
    const {
        execGenericView,
        genericUpdateMaster,
        getSqlObjectString,
    } = utilMethods()
    const { emit } = usingIbuki()
    const dateFormat = getFromBag('dateFormat')
    const isoDateFormat = 'YYYY-MM-DD'
    const { genericUpdateMasterNoForm } = utilMethods()
    const {
        traceGlobalSearch,
        TraceFullWidthSubmitButton,
    } = useTraceMaterialComponents()
    const theme = useTheme()
    const { getCurrentMediaSize, isMediumSizeUp } = useTraceGlobal()
    const { queryGraphql, mutateGraphql } = graphqlService()
    const [, setRefresh] = useState({})

    interface SubmitDialogOptions {
        tableName?: string
        idInsert?: boolean
        graphQlKey: string
        customCodeBlock?: string
        afterMethod?: any
    }

    function closeDialog(): void {
        meta.current.isMounted && (meta.current.showDialog = false)
        resetForm(meta.current.dialogConfig.formId)
        meta.current.isMounted &&
            resetAllFormErrors(meta.current.dialogConfig.formId)
        meta.current.dialogConfig.permissionConfig.isPermission = false
        meta.current.dialogConfig.isEditMode = false
        meta.current.isMounted && setRefresh({})
    }

    async function deleteRow(node: any, afterMethod: any = null) {
        const id = node.id
        const toDelete = window.confirm(messages['deleteConfirm'])
        if (toDelete) {
            try {
                const ret: any = await genericUpdateMaster({
                    formId: meta.current.dialogConfig.formId,
                    entityName: getCurrentEntity(),
                    tableName: meta.current.dialogConfig.tableName,
                    deletedIds: [id],
                })
                if ((ret === true) || (ret?.length <=9)) {
                    emit('SHOW-MESSAGE', {})
                    afterMethod && afterMethod()
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
            } catch (error:any) {
                emit('SHOW-MESSAGE', {
                    severity: 'error',
                    message: error.message || messages['errorInOperation'],
                    duration: null,
                })
            }
        }
    }

    async function submitDialog(options: SubmitDialogOptions) {
        interface SaveDataOptions {
            sqlObjectString: string
            graphQlKey: string
            afterMethod?: any
        }
        async function saveData(options: SaveDataOptions) {
            const currentEntity = getCurrentEntity()
            const q = queries[options.graphQlKey](
                options.sqlObjectString,
                getCurrentEntity()
            )
            if (q) {
                let ret: any
                emit('SHOW-LOADING-INDICATOR', true)
                try {
                    ret = await mutateGraphql(q)
                    const objectPath = 'data'.concat(
                        '.',
                        currentEntity,
                        '.',
                        options.graphQlKey
                    )
                    const result = _.get(ret, objectPath)
                    if (result) {
                        emit('SHOW-MESSAGE', {})
                        closeDialog()
                        options.afterMethod && (await options.afterMethod())
                    } else if (result && result.message) {
                        emit('SHOW-MESSAGE', {
                            severity: 'error',
                            message: result.message,
                            duration: null,
                        })
                    } else {
                        emit('SHOW-MESSAGE', {
                            severity: 'error',
                            message: messages['errorInOperation'],
                            duration: null,
                        })
                    }
                } catch (err:any) {
                    emit('SHOW-MESSAGE', {
                        severity: 'error',
                        message: err.message || messages['errorInOperation'],
                        duration: null,
                    })
                }
                emit('SHOW-LOADING-INDICATOR', false)
            }
        }
        const formId = meta.current.dialogConfig.formId
        try {
            clearServerError(formId)
            await doValidateForm(formId)
            if (isValidForm(formId)) {
                const data = getFormData(formId)
                if (data.isActive === '') {
                    data.isActive = false
                }
                if (meta.current.dialogConfig.isEditMode) {
                    data.id = meta.current.dialogConfig.node.id // in edit mode id is used to update table
                } else if (!options.idInsert) {
                    delete data.id
                }
                const sqlObjectString = getSqlObjectString({
                    data: data,
                    tableName: options.tableName || undefined,
                    idInsert: options.idInsert || false,
                    customCodeBlock: options.customCodeBlock,
                })
                saveData({
                    sqlObjectString,
                    graphQlKey: options.graphQlKey,
                    afterMethod: options.afterMethod,
                })
            } else {
                doFormRefresh(formId) // this shows validation messages
            }
        } catch (e:any) {
            showServerError(meta.current.dialogConfig.formId, e.message)
        }
    }

    return {
        _,
        clearServerError,
        CloseIcon,
        Column,
        Checkbox,
        closeDialog,
        dateFormat,
        deleteRow,
        doValidateForm,
        doFormRefresh,
        EditIcon,
        emit,
        execGenericView,
        genericUpdateMaster,
        genericUpdateMasterNoForm,
        getCurrentEntity,
        getCurrentMediaSize,
        getFormData,
        getFormObject,
        getFromBag,
        getLoginData,
        getSqlObjectString,
        getValidationFabric,
        hash,
        IconButton,
        isoDateFormat,
        isMediumSizeUp,
        isValidForm,
        mutateGraphql,
        queryGraphql,
        queries,
        resetAllFormErrors,
        resetAllValidators,
        resetForm,
        Settings,
        showServerError,
        submitDialog,
        theme,
        TraceFullWidthSubmitButton,
        traceGlobalSearch,
        useStyles,
    }
}

export { useSharedElements }

const useStyles: any = makeStyles((theme: Theme) =>
    createStyles({
        content: {
            marginBottom: theme.spacing(1),
            overflowX: 'auto',
        },

        header: {
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: theme.spacing(1),
        },

        dialogPaper: {
            width: (props: any) => props.meta.current.dialogConfig.dialogWidth,
        },

        dialogTitle: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingBottom: '0px',
        },

        dialogContent: {
            '& select': {
                color: theme.palette.primary.dark,
                padding: theme.spacing(0.5),
                marginTop: theme.spacing(0.5),
                width: '100%',
            },
        },
    })
)
