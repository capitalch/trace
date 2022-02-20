// import _ from 'lodash'
import { useSharedElements } from './shared-elements-hook'

function useCommonArtifacts() {
    const {
        _,
        clearServerError,
        confirm,
        doValidateForm,
        getCurrentEntity,
        getFormData,
        getSqlObjectString,
        isValidForm,
        messages,
        mutateGraphql,
        queries,
        resetForm,
        emit,
        genericUpdateMaster,
    } = useSharedElements()

    const gridActionMessages = {
        addIbukiMessage: 'ADD-IBUKI-MESSAGE',
        deleteIbukiMessage: 'DELETE-IBUKI-MESSAGE',
        editIbukiMessage: 'EDIT-IBUKI-MESSAGE',
        fetchIbukiMessage: 'FETCH-IBUKI-MESSAGE',
        onDataFetchedIbukiMessage: 'ON-DATA-FETCHED-IBUKI-MESSAGE',
    }

    function handleDelete(id1: any, tableName: string) {
        const options = {
            description: messages.deleteConfirm,
            confirmationText: 'Yes',
            cancellationText: 'No',
        }
        
        confirm(options)
            .then(async () => {
                const id = +id1 // to make it numeric from string
                emit('SHOW-LOADING-INDICATOR', true)
                try {
                    await genericUpdateMaster({
                        deletedIds: [id],
                        tableName: tableName,
                    })
                } catch (e: any) {
                    console.log(e)
                    throw e
                } finally {
                    emit('SHOW-LOADING-INDICATOR', false)
                }

                emit('SHOW-MESSAGE', {})
                emit(gridActionMessages.fetchIbukiMessage, null)
            })
            .catch((e: any) => {
                console.log(e)
            }) // important to have otherwise eror
    }

    async function doSubmit({
        data,
        formId,
        graphQlKey,
        tableName,
        handleCloseDialog,
        idInsert,
    }: {
        data?: any
        formId?: string
        graphQlKey: string
        tableName: string
        handleCloseDialog: any
        idInsert?: boolean
    }) {
        let formData: any
        if (_.isEmpty(data)) {
            formData = getFormData(formId || '')
            clearServerError(formId || '')
            await doValidateForm(formId || '')
            if (isValidForm(formId || '')) {
                await saveData()
            }
        } else {
            formData = data
            await saveData()
        }

        async function saveData() {
            const sqlObjectString = getSqlObjectString({
                data: formData,
                tableName: tableName,
                idInsert: idInsert || false,
            })
            const q = queries[graphQlKey](sqlObjectString, getCurrentEntity())
            if (q) {
                emit('SHOW-LOADING-INDICATOR', true)
                try {
                    let ret1 = await mutateGraphql(q)
                    const ret = ret1?.data?.authentication?.[graphQlKey]
                    resetForm(formId || '')
                    if(ret.message){ // error
                        emit('SHOW-MESSAGE', {
                            severity: 'error',
                            message: ret.message || messages['errorInOperation'],
                            duration: null,
                        })
                    }
                    else if (ret) {
                        emit('SHOW-MESSAGE', {})
                        handleCloseDialog()
                        emit('FETCH-DATA-MESSAGE', null)
                        emit(gridActionMessages.fetchIbukiMessage, null)
                    } else {
                        emit('SHOW-MESSAGE', {
                            severity: 'error',
                            message: messages['errorInOperation'],
                            duration: null,
                        })
                    }
                } catch (err: any) {
                    emit('SHOW-MESSAGE', {
                        severity: 'error',
                        message: err.message || messages['errorInOperation'],
                        duration: null,
                    })
                }
                emit('SHOW-LOADING-INDICATOR', false)
            }
        }
    }

    return { doSubmit, gridActionMessages, handleDelete }
}

export { useCommonArtifacts }
