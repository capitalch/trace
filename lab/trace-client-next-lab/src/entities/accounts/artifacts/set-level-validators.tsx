import { utils } from '../utils'
import { utilMethods } from '../../../global-utils/misc-utils'
import messages from '../../accounts/json/accounts-messages.json'
const setLevelValidators: any = {
    gstPaymentVoucherValidation: (a: any, dataObject: any, putErrors: any) => {
        const { extractGst } = utils()
        const { extractAmount } = utilMethods()
        let ret = a.message || messages['gstCalculationError']
        if (dataObject.gst && dataObject.gst.isGst) {
            const gstClone = extractGst(dataObject.gst)
            const rate = gstClone.rate
            const amount: number = +extractAmount(dataObject.amount)
            const sgst = gstClone.sgst
            const cgst = gstClone.cgst
            const igst = gstClone.igst
            const backCalculatedGst: number = Number(
                ((amount * rate) / (rate + 100)).toFixed(2)
            )
            if (igst === 0) {
                if (Math.abs(sgst + cgst - backCalculatedGst) <= 0.9) {
                    //permissible limit
                    ret = undefined
                }
            } else {
                if (igst - backCalculatedGst <= 0.9) {
                    ret = undefined
                }
            }
        } else {
            ret = undefined
        }
        putErrors(a.name, ret)
    },
}

export default setLevelValidators
