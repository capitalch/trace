import { useSharedElements } from '../../accounts/components/common/shared-elements-hook'

function useCommonArtifacts() {
    const { confirm, messages, emit, genericUpdateMaster } = useSharedElements()

    const gridActionMessages = {
        addIbukiMessage: 'ADD-IBUKI-MESSAGE',
        deleteIbukiMessage: 'DELETE-IBUKI-MESSAGE',
        editIbukiMessage: 'EDIT-IBUKI-MESSAGE',
        fetchIbukiMessage: 'FETCH-IBUKI-MESSAGE',
        onDataFetchedIbukiMessage:'ON-DATA-FETCHED-IBUKI-MESSAGE'
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
            .catch(() => {}) // important to have otherwise eror
    }

    return { gridActionMessages, handleDelete }
}

export { useCommonArtifacts }
