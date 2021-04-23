import _ from 'lodash'
import { utilMethods } from '../../common-utils/util-methods'
import { manageFormsState } from '../../react-form/core/fsm'
import { graphqlQueries } from '../../shared-artifacts/graphql-queries-mutations'
import { graphqlService } from '../../common-utils/graphql-service'
import { manageEntitiesState } from '../../common-utils/esm'

const accStore: any = {}

function utils() {
    const { extractAmount } = utilMethods()
    const { mutateGraphql } = graphqlService()
    const { getFromBag, getCurrentEntity } = manageEntitiesState()

    function getAccountClass(accId: number) {
        let ret = undefined
        const allAccounts: any[] = accStore['allAccounts']
        const account = allAccounts.find(x => x.id === accId)
        account && (ret = account.accClass)
        return (ret)
    }

    function registerAccounts(allAccounts: any[]) {
        accStore.allAccounts = allAccounts
    }

    function getGloballyFilteredData(data: any[], columns: any[], filterText: string) {
        const filteredData = data.filter((item: any) => {
            const ret = columns.reduce(((prev: any, curr: any) => {
                const expr = String(item[curr.selector]).toLowerCase().includes(filterText.toLowerCase())
                return prev || expr
            }), false)
            return ret
        })
        return (filteredData)
    }

    function extractGst(x: any) {
        const clone: any = { ...x }
        clone.rate = clone.rate || '0.00'
        clone.rate = parseFloat(extractAmount(clone.rate))

        clone.sgst = clone.sgst || '0.00'
        clone.sgst = parseFloat(extractAmount(clone.sgst))

        clone.cgst = clone.cgst || '0.00'
        clone.cgst = parseFloat(extractAmount(clone.cgst))

        clone.igst = clone.igst || '0.00'
        clone.igst = parseFloat(extractAmount(clone.igst))
        return (clone)
    }

    function getDebitCreditTotals(formId: string): any {
        const { getFormData } = manageFormsState()
        const formData = getFormData(formId)
        // let ret:any = { debits: 0, credits: 0 }
        let debits = formData.debits
        let credits = formData.credits

        function process(drcr: any) {
            let total = 0.00
            if (drcr) {
                if (!Array.isArray(drcr)) {
                    drcr = [drcr]
                }
                if (drcr.length > 0) {
                    for (let el of drcr) {
                        const amount = String(el['amount'] || '')
                        const amt = Number(amount.replace(/[^\d.-]/g, '')) // replaces rs symbol and comma from the debitAmount
                        if (!isNaN(amt)) {
                            total = total + amt
                        }
                    }
                }
            }
            return total
        }
        const ret = { debits: process(debits), credits: process(credits) }
        return ret
    }

    function getTotalDebits(formId: string): number {
        const { getFormData } = manageFormsState()
        const formData = getFormData(formId)
        let sum = 0
        let debits = formData.debits

        if (debits) {
            if (!Array.isArray(debits)) {
                debits = [debits]
            }
            if (debits.length > 0) {
                for (let el of debits) {
                    const debitAmount = String(el['amount'] || '')
                    const amt = Number(debitAmount.replace(/[^\d.-]/g, '')) // replaces rs symbol and comma from the debitAmount
                    if (!isNaN(amt)) {
                        sum = sum + amt
                    }
                }
            }
        }
        return (sum)
    }

    function getTotalCredits(formId: string): number {
        const { getFormData } = manageFormsState()
        const formData = getFormData(formId)
        let sum = 0
        let credits = formData.credits

        if (credits) {
            if (!Array.isArray(credits)) {
                credits = [credits]
            }
            if (credits.length > 0) {
                for (let el of credits) {
                    let amt: any = el['amount'] || ''
                    if (typeof (amt) === 'string') {
                        amt = Number(amt.replace(/[^\d.-]/g, '')) // replaces rs symbol and comma from the debitAmount
                    }
                    if (!isNaN(amt)) {
                        sum = sum + amt
                    }
                }
            }
        }
        return (sum)
    }

    async function transferClosingBalances() {
        const q = graphqlQueries['genericQueryBuilder']({ // in shared artifacts
            queryName: 'transferClosingBalances'
            , queryType: 'mutation'
        })
        if (q) {
            // meta.current.isLoading = true
            const ret: any = await mutateGraphql(q)
            return ret
            // meta.current.isLoading = false
            // meta.current.isMounted && setRefresh({})
        }
    }

    function getUnitHeading() {
        const entityName = _.upperFirst(getCurrentEntity())
        const unitName = getFromBag('unitInfo')?.unitName || ''
        const startDate = getFromBag('finYearObject')?.startDate || ''
        const endDate = getFromBag('finYearObject')?.endDate || ''
        const branch = getFromBag('branchObject')?.branchName || ''
        // return entityName.concat(': ', unitName, ', FY: ', startDate, ' - ', endDate, ', Branch: ', branch)
        return entityName.concat(': ', unitName)
    }

    return {
        extractGst, getTotalDebits, getTotalCredits, registerAccounts
        , getAccountClass, getGloballyFilteredData, getDebitCreditTotals
        , transferClosingBalances, getUnitHeading
    }
}

export { utils }