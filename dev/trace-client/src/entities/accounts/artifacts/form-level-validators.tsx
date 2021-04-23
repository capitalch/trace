import messages from '../json/accounts-messages.json'
import { utils } from '../utils'
const formLevelValidators: any = {
    paymentVoucherDebitCredit: (a: any, formData: any, putErrors: any) => {
        let ret: any = messages['debitCreditNotEqual']
        const creditString = formData.credits.amount
        const debitsArray1: [{}] = formData.debits
        const credits = Number(creditString.replace(/[^\d.-]/g, '')) // extract decimal number with decimal point from a string
        const debits = debitsArray1.reduce(
            (prev: any, curr: any, index: number) => {
                prev = prev + Number(curr.amount.replace(/[^\d.-]/g, ''))
                return prev
            },
            0
        )
        if (debits === credits) {
            ret = undefined
        }
        putErrors(a.name, ret)
    },

    contraSameAccountCodes: (a: any, formData: any, putErrors: any) => {
        let ret: any = a.message || messages['contraSameAccountCodes']
        const debitAccId = formData?.debits?.accId
        const creditAccId = formData?.credits?.accId
        if (debitAccId && creditAccId && debitAccId !== creditAccId) {
            ret = undefined
        }
        putErrors(a.name, ret)
    },

    mandatoryInstrNoWhenBank: (a: any, formData: any, putErrors: any) => {
        const { getAccountClass } = utils()
        let credits = formData.credits
        let debits = formData.debits
        if (!Array.isArray(credits)) {
            credits = [credits]
        }
        if (!Array.isArray(debits)) {
            debits = [debits]
        }

        function validateInstrNo(debitsOrCredits: any[]) {
            let ret: any = undefined
            for (let it of debitsOrCredits) {
                const accClass = getAccountClass(it.accId)
                const instrNo = it.instrNo
                if (accClass === 'cash') {
                    if (instrNo) {
                        ret = messages.instrNoRequired
                        break
                    }
                } else if (['ecash', 'bank'].includes(accClass)) {
                    //bank etc
                    if (!instrNo) {
                        ret = messages.instrNoRequired
                        break
                    }
                }
            }
            return ret
        }
        let ret = validateInstrNo(credits)
        if (!ret) {
            ret = validateInstrNo(debits)
        }
        putErrors(a.name, ret)
    },
}

export default formLevelValidators
