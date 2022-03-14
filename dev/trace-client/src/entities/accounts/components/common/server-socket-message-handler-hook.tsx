import { _ } from '../../../../imports/regular-imports'
import { useSharedElements } from './shared-elements-hook'

function useServerSocketMessageHandler() {
    const { emit, getFromBag, } = useSharedElements()
    const allAccounts: any[] = getFromBag('allAccounts')    
    const socketObject: any = {
        'TRACE-SERVER-MASTER-DETAILS-UPDATE-DONE': handleMasterDetailsUpdateDone,
        'TRACE-SERVER-NEW-SUBLEDGER-ACCOUNT-CREATED': newSubledgerAccountCreated,
        'TRACE-SERVER-ACCOUNT-ADDED-OR-UPDATED': accountAddedOrUpdated,
        'TRACE-SERVER-PRODUCT-ADDED-OR-UPDATED': productAddedOrUpdated
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

    function accountAddedOrUpdated(data: any) {
        const acc = allAccounts.find((x: any) => x.id === data.id)
        if (acc) {
            acc.accCode = data.accCode
            acc.accName = data.accName
        } else {
            allAccounts.push(data)
        }
        emit('TRACE-SERVER-ACCOUNT-ADDED-OR-UPDATED', '')
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

    function newSubledgerAccountCreated(data: any) {
        // change accId to id and append data to global accounts
        data.id = data.accId
        data.accId = undefined
        const allAccounts: any[] = getFromBag('allAccounts')
        allAccounts.push(data)
    }

    function productAddedOrUpdated(data: any) {
        const products: any[] = getFromBag('products')
        if(_.isEmpty(products)){
            return
        }
        let product = products.find((x: any) => x.id === data.id)
        if(product){
            product = data
        } else{
            products.unshift(data)
        }
        emit('OPENING-STOCK-WORK-BENCH-HOOK-PRODUCT-UPSERTED-AT-SERVER','')
    }

    return ({ socketMessageHandler })
}

export { useServerSocketMessageHandler }

