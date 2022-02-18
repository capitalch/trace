import { _ } from '../../../../imports/regular-imports'
import { useSharedElements } from './shared-elements-hook'

function useServerSocketMessageHandler() {
    const { emit, getFromBag, } = useSharedElements()
    const allAccounts: any[] = getFromBag('allAccounts')
    const socketObject: any = {
        'TRACE-SERVER-MASTER-DETAILS-UPDATE-DONE': handleMasterDetailsUpdateDone,
        'TRACE-SERVER-NEW-ACCOUNT-CREATED': newAccountCreated,
        'TRACE-SERVER-ACCOUNT-ADDED-OR-UPDATED': accountAddedOrUpdated,
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

    function accountAddedOrUpdated(data: any){
        const acc = allAccounts.find((x:any)=>x.id === data.id)
        if(acc){
            acc.accCode = data.accCode
            acc.accName = data.accName
        } else {
            
        }
    }

    function handleMasterDetailsUpdateDone(data: any) {
        // set accounts balances in data-cache
        
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

