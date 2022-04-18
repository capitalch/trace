import { useSharedElements } from '../common/shared-elements-hook'

function useCrudUtils(meta: any) {
    const {
        accountsMessages,
        confirm,
        emit,
        genericUpdateMaster,
        getCurrentEntity,
        globalMessages,
        manageFormsState,
        ReactForm,
    } = useSharedElements()

    const { clearServerError, getFormData, resetForm } =
        manageFormsState()

    function getReactFormContent(jsonText: string) {
        const pre = meta.current.dialogConfig
        return () => (
            <ReactForm
                formId={pre.formId}
                jsonText={jsonText}
                name={getCurrentEntity()}
            />
        )
    }

    async function handleSubmit(e: any, formData: any = null) {
        const pre = meta.current.dialogConfig
        const formId = pre.formId
        clearServerError(formId)
        if (!formData) {
            formData = getFormData(formId)
        }
        // If id field is there then server considers it as edit
        if (pre.isEditMode) {
            formData['id'] = pre.id
        }
        const ret = await genericUpdateMaster({
            formId: formId,
            entityName: getCurrentEntity(),
            tableName: pre.tableName,
            data: formData,
            idInsert: pre.idInsert,
            customCodeBlock: pre.codeBlock,
        })
        if (ret === true || ret?.length <= 9 || typeof ret === 'number') {
            resetForm(formId)
            emit('SHOW-MESSAGE', {})
            emit(pre.ibukiFetchDataMessage, null)
            handleCloseDialog()
        } else if (ret && ret.message) {
            emit('SHOW-MESSAGE', {
                severity: 'error',
                message: ret.message,
                duration: null,
            })
        } else {
            emit('SHOW-MESSAGE', {
                severity: 'error',
                message: globalMessages['errorInOperation'],
                duration: null,
            })
        }
    }

    function handleCloseDialog() {
        meta.current.showDialog = false
        meta.current.setRefresh({})
    }

    async function handleDelete(id1: string) {
        const pre = meta.current.dialogConfig
        const options = {
            description: accountsMessages.transactionDelete,
            confirmationText: 'Yes',
            cancellationText: 'No',
        }
        confirm(options)
            .then(async () => {
                const id = +id1 // to make it numeric from string
                emit('SHOW-LOADING-INDICATOR', true)
                await genericUpdateMaster({
                    deletedIds: [id],
                    tableName: pre.tableName,
                })
                emit('SHOW-LOADING-INDICATOR', false)
                emit('SHOW-MESSAGE', {})
                emit(pre.ibukiFetchDataMessage, null)
            })
            .catch(() => {
                emit('SHOW-LOADING-INDICATOR', false)
            }) // important to have otherwise eror
    }

    return {
        getReactFormContent,
        handleCloseDialog,
        handleDelete,
        handleSubmit,
    }
}

export { useCrudUtils }
