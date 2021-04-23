import moment from 'moment'
import { utils } from '../utils'
import messages from '../accounts-messages.json'
import {manageEntitiesState} from '../../../common-utils/esm'

const itemLevelValidators: any = {
    paymentVoucherGst: (a: any, value: any, putErrors: any) => {
        let ret: any = a.message || 'Should have one special char';
        const format = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
        ((value.length === 0) || format.test(value)) && (ret = undefined)
        putErrors(a.name, ret);
    },

    dateInFinYear: (a: any, value: any, putErrors: any) =>{
        const {getFromBag} = manageEntitiesState()
        const dateFormat = getFromBag('dateFormat')
        let ret : any = a.message || 'Invalid date in financial year'
        const finYearObject = getFromBag('finYearObject')
        const startDate = moment(finYearObject.startDate, dateFormat)
        const endDate = moment(finYearObject.endDate, dateFormat)
        const tranDate = moment(value,dateFormat)
        if((tranDate >= startDate) && (tranDate <= endDate)){
            ret = undefined
        }
        putErrors(a.name, ret)        
    },

    gstValidation: (a: any, value: any, putErrors: any) => {
        const { extractGst } = utils()
        if (!value.isGst) {
            return
        }
        const gst = extractGst(value) //cloned
        let ret = undefined
        if (!gst.gstin) {
            ret = messages['gstinRequired']
        } else {
            const gstinformat = /^([0][1-9]|[1-2][0-9]|[3][0-7])([A-Z]{5})([0-9]{4})([A-Z]{1}[1-9A-Z]{1})([Z]{1})([0-9A-Z]{1})+$/
            if(!gstinformat.test(gst.gstin)){
                ret = messages['invalidGstin']
            }
        }
        putErrors('gstinError', ret)
        

        // ret = undefined
        // /^([0-9]{2}[a-zA-Z]{4}([a-zA-Z]{1}|[0-9]{1})[0-9]{4}[a-zA-Z]{1}([a-zA-Z]|[0-9]){3}){0,15}$/
        
        // putErrors('invalidGstin', ret)

        ret = undefined
        if (gst.rate === 0) {
            ret = messages['gstRateRequired']
        }
        putErrors('gstRateRequired', ret)
        ret = undefined
        if (gst.igst > 0) {
            if ((gst.sgst > 0) || (gst.cgst > 0)) {
                ret = messages['igstWithCgstAndSgst']
            }
        } else if ((gst.sgst > 0) || (gst.cgst > 0)) {
            if (gst.igst > 0) {
                ret = messages['igstWithCgstAndSgst']
            }
        }
        putErrors('igstWithCgstAndSgst', ret)
        ret = undefined
        if (gst.sgst !== gst.cgst) {
            ret = messages['cgstSgstEqual']
        }
        putErrors('cgstSgstEqual', ret)
        ret = undefined
        if ((gst.sgst + gst.cgst + gst.igst) === 0) {
            ret = messages['gstZero']
        }
        putErrors('gstZero', ret)
    }
}

export default itemLevelValidators