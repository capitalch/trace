function useAdminManageBusUsers() {
    const columns: any[] = []
    const gridActionMessages = {}
    const queryId = ''
    const queryArgs = {}
    const specialColumns = {
        isEdit: true,
        isDelete: true,
    }
    const summaryColNames: string[] = []

    return { columns, gridActionMessages, queryArgs, queryId, specialColumns, summaryColNames }
}

export { useAdminManageBusUsers }
