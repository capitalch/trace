import { manageEntitiesState, useIbuki, } from '../../../../imports/trace-imports'
function useServerSocketMessageHandler() {
    const { emit, } = useIbuki()
    const {getFromBag} = manageEntitiesState()
    const socketObject: any = {
        'TRACE-SERVER-MASTER-DETAILS-UPDATE-DONE': handleMasterDetailsUpdateDone,
        'TRACE-SERVER-NEW-ACCOUNT-CREATED': newAccountCreated,
    }
    function socketMessageHandler(d: any) {
        const { message, data } = d
        try {
            socketObject[message](data)
        }
        catch (e: any) {
            console.log(e)
        }
    }

    function handleMasterDetailsUpdateDone(data: any) {
        emit('TRACE-SERVER-MASTER-DETAILS-UPDATE-DONE', null)
    }

    function newAccountCreated(data: any) {
        // change accId to id and append data to global accounts
        data.id = data.accId
        data.accId = undefined
        const allAccounts:any[] = getFromBag('allAccounts')
        allAccounts.push(data)
    }

    return ({ socketMessageHandler })
}

export { useServerSocketMessageHandler }

