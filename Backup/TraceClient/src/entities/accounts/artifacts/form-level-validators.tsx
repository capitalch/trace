import messages from '../accounts-messages.json'
import { utils } from '../utils'
const formLevelValidators: any = {
    sampleAsyncValidation1: (a: any, formData: any, putErrors: any) => {
        const promise = new Promise((resolve) => {
            setTimeout(() => {
                putErrors(a.name, a.message);
                resolve('success');
            }, 5000)
        })
        return promise;
    },
    sampleFormValidation1: (a: any, formData: any, putErrors: any) => {
        let ret: any = 'sampleFormValidation1 failed'
        let i = 1
        if (i === 2) {
            ret = undefined
        }
        putErrors(a.name, ret)
    },

    paymentVoucherDebitCredit: (a: any, formData: any, putErrors: any) => {
        let ret: any = messages['debitCreditNotEqual']
        const creditString = formData.credits.amount
        const debitsArray1: [{}] = formData.debits
        const credits = Number(creditString.replace(/[^\d.-]/g, '')) // extract decimal number with decimal point from a string
        const debits = debitsArray1.reduce((prev: any, curr: any, index: number) => {
            prev = prev + Number(curr.amount.replace(/[^\d.-]/g, ''))
            return prev
        }, 0)
        if (debits === credits) {
            ret = undefined
        }
        putErrors(a.name, ret)
    },

    contraSameAccountCodes:(a: any, formData: any, putErrors: any) =>{
        let ret: any = a.message || messages['contraSameAccountCodes']
        const debitAccId = formData?.debits?.accId
        const creditAccId = formData?.credits?.accId
        if(debitAccId && creditAccId && (debitAccId !== creditAccId)){
            ret = undefined
        }
        putErrors(a.name, ret)
    },

    mandatoryInstrNoWhenBank: (a: any, formData: any, putErrors: any) => {
        const { getAccountClass } = utils()
        // let ret: any = undefined //messages.instrNoRequired
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
                } else if (['ecash', 'bank'].includes(accClass)) { //bank etc
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
    }
}


export default formLevelValidators