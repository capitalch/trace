import _ from 'lodash'
import { manageEntitiesState, useIbuki, } from '../../../../imports/trace-imports'
function useServerSocketMessageHandler() {
    const { emit, } = useIbuki()
    const { getFromBag } = manageEntitiesState()
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
        // set accounts balances in data-cache
        const allAccounts: any[] = getFromBag('allAccounts')
        if (!_.isEmpty(data)) {
            for (const key of Object.keys(data)) {
                const acc = allAccounts.find((x: any) => x.id === (+key))
                acc && (acc.balance = +data[key])
            }
        }
        emit('TRACE-SERVER-MASTER-DETAILS-UPDATE-DONE', data)
    }
    
    function newAccountCreated(data: any) {
        // change accId to id and append data to global accounts
        data.id = data.accId
        data.accId = undefined
        const allAccounts: any[] = getFromBag('allAccounts')
        allAccounts.push(data)
    }

    return ({ socketMessageHandler })
}

export { useServerSocketMessageHandler }

