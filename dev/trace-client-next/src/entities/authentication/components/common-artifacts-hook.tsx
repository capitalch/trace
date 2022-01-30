import { useSharedElements } from './shared-elements-hook'

function useCommonArtifacts() {
    const { clearServerError, confirm, doValidateForm, getCurrentEntity, getFormData, getSqlObjectString, isValidForm, messages, mutateGraphql, queries, resetForm, emit, genericUpdateMaster } = useSharedElements()

    const gridActionMessages = {
        addIbukiMessage: 'ADD-IBUKI-MESSAGE',
        deleteIbukiMessage: 'DELETE-IBUKI-MESSAGE',
        editIbukiMessage: 'EDIT-IBUKI-MESSAGE',
        fetchIbukiMessage: 'FETCH-IBUKI-MESSAGE',
        onDataFetchedIbukiMessage: 'ON-DATA-FETCHED-IBUKI-MESSAGE'
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
                await genericUpdateMaster({
                    deletedIds: [id],
                    tableName: tableName,
                })
                emit('SHOW-LOADING-INDICATOR', false)
                emit('SHOW-MESSAGE', {})
                emit(gridActionMessages.fetchIbukiMessage, null)
            })
            .catch(() => { }) // important to have otherwise eror
    }

    async function doSubmit(
        { formId, graphQlKey, tableName, handleCloseDialog }: any
    ) {
        clearServerError(formId)
        await doValidateForm(formId)
        if (isValidForm(formId)) {
            await saveData()
        }

        async function saveData() {
            const formData = getFormData(formId)
            const sqlObjectString = getSqlObjectString({
                data: formData,
                tableName: tableName,
            })
            const q = queries[graphQlKey](sqlObjectString, getCurrentEntity())
            if (q) {
                emit('SHOW-LOADING-INDICATOR', true)
                try {
                    let ret1 = await mutateGraphql(q)
                    const ret = ret1?.data?.authentication?.[graphQlKey]
                    resetForm(formId)
                    if (ret) {
                        emit('SHOW-MESSAGE', {})
                        handleCloseDialog()
                        emit('FETCH-DATA-MESSAGE', null)
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

    return { doSubmit, gridActionMessages, handleDelete, }
}

export { useCommonArtifacts }
