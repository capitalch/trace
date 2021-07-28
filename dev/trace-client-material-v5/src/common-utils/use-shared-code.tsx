import { useState} from "react"
import { ProgressSpinner } from 'primereact/progressspinner'
import styled from 'styled-components'
import _ from 'lodash'
import { manageFormsState } from '../react-form/core/fsm'
import { utilMethods } from './util-methods'
import { usingIbuki } from './ibuki'
import messages from '../messages.json'
import { graphqlService } from './graphql-service'
import ReactForm from '../react-form/react-form'
import { manageEntitiesState } from './esm'
import { componentStore } from '../react-form/component-store/html-core'
import { getArtifacts } from '../react-form/common/react-form-hook'


function useSharedCode(meta: any) {
    const [, setRefresh] = useState({})
    const { getValidationFabric, resetForm, getFormData,
        resetAllFormErrors, clearServerError, doFormRefresh, showServerError
        , resetAllValidators } = manageFormsState()
    const { isValidForm, doValidateForm } = getValidationFabric()
    const { getSqlObjectString } = utilMethods()
    const { mutateGraphql } = graphqlService()
    const { getCurrentEntity } = manageEntitiesState()
    const { emit } = usingIbuki()
    function closeDialog(): void {
        meta.current.isMounted && (meta.current.showDialog = false)
        resetForm(meta.current.dialogConfig.formId)
        meta.current.isMounted && resetAllFormErrors(meta.current.dialogConfig.formId)
        meta.current.isMounted && setRefresh({})
    }

    function DialogContent({ formJson }: any) {            
        resetAllValidators(meta.current.dialogConfig.formId)
        return <ReactForm
            formId={meta.current.dialogConfig.formId}
            jsonText={JSON.stringify(formJson)}
            name={getCurrentEntity()}
            componentStore={componentStore}
        ></ReactForm>
    }

    function onRowEditInit(e: any) {
        const dt = { ...e.data } //cloned
        meta.current.origData[dt['id']] = dt
    }

    function onRowEditorValidator(rowData: any) {
        return true
    }

    interface SaveDataOptions {
        sqlObjectString: string
        , graphQlKey: string
        , closeDialog: boolean
    }

    async function saveData(options: SaveDataOptions) {
        const currentEntity = getCurrentEntity()
        const artifacts = getArtifacts(currentEntity)
        const queries = artifacts['graphqlQueries']
        const q = queries[options.graphQlKey](options.sqlObjectString, getCurrentEntity())
        if (meta.current.dialogConfig.showSpinner) {
            meta.current.dialogConfig.showSpinner = 'block'
            meta.current.isMounted && setRefresh({})
        }
        if (q) {
            let ret: any
            try {
                ret = await mutateGraphql(q)
                const objectPath = 'data'.concat('.', currentEntity, '.', options.graphQlKey)
                const result = _.get(ret, objectPath)
                if (result === true) {
                    emit('SHOW-MESSAGE', {})
                    meta.current.isDataChanged = true
                    meta.current.isMounted && setRefresh({})
                    options.closeDialog && closeDialog()
                } else if (result && result.message) {
                    emit('SHOW-MESSAGE', { severity: 'error', message: result.message, duration: null })
                } else {
                    emit('SHOW-MESSAGE', { severity: 'error', message: messages['errorInOperation'], duration: null })
                }
            } catch (err) {
                emit('SHOW-MESSAGE', { severity: 'error', message: messages['errorInOperation'], duration: null })
            }
        }
        if (meta.current.dialogConfig.showSpinner) {
            meta.current.dialogConfig.showSpinner = 'none'
            meta.current.isMounted && setRefresh({})
        }
    }

    function Spinner({ showSpinner }: any) {
        return <ProgressSpinner style={{
            width: '50px'
            , height: '50px'
            , margin: 'auto'
            , zIndex: '100'
            , top: 0
            , bottom: 0
            , left: 0
            , right: 0

            , position: 'absolute'
            , display: `${showSpinner === undefined ? 'none' : showSpinner}`
        }}
            strokeWidth="8" fill="#EEEEEE" animationDuration=".5s" />
    }

    interface DialogOptions {
        tableName?: string
        idInsert?: boolean
        graphQlKey: string
        closeDialog: boolean
        customCodeBlock?: string
    }

    async function submitDialog(options: DialogOptions) {
        const formId = meta.current.dialogConfig.formId
        try {
            clearServerError(formId)
            await doValidateForm(formId)
            meta.current.isMounted && setRefresh({})
            if (isValidForm(formId)) {
                const data = getFormData(formId)
                if (data.isActive === '') {
                    data.isActive = false
                }
                if (meta.current.dialogConfig.isEditMode) {
                    data.id = meta.current.dialogConfig.node.id // in edit mode id is used to update table
                } else if(!options.idInsert) {
                    delete data.id
                }
                const sqlObjectString = getSqlObjectString({
                    data: data,
                    tableName: options.tableName || undefined,
                    idInsert: options.idInsert || false,
                    customCodeBlock: options.customCodeBlock
                })

                meta.current.isMounted && setRefresh({})
                saveData({ sqlObjectString, graphQlKey: options.graphQlKey , closeDialog: options.closeDialog })
            } else {
                doFormRefresh(formId) // this shows validation messages
            }
        } catch (e) {
            showServerError(meta.current.dialogConfig.formId, e.message)
        }
    }

    return {
        Spinner
        , submitDialog
        , saveData
        , closeDialog
        , onRowEditInit
        , onRowEditorValidator
        , DialogContent
        , TableHeaderDiv
        , ColumnHeaderLeftDiv
    }
}

const TableHeaderDiv = styled.div`
    text-align:left;
    font-size: 1.2rem;
    text-transform: capitalize;
    display:flex;`

const ColumnHeaderLeftDiv = styled.div`
    text-align: left;`

export { useSharedCode }