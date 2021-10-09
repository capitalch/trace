import { moment } from '../../../imports/regular-imports'
import { utils } from '../utils'
import messages from '../json/accounts-messages.json'
import {
    manageEntitiesState,
    manageFormsState,
} from '../../../imports/trace-imports'

const itemLevelValidators: any = {
    paymentVoucherGst: (a: any, value: any, putErrors: any) => {
        let ret: any = a.message || 'Should have one special char'
        const format = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/
        ;(value.length === 0 || format.test(value)) && (ret = undefined)
        putErrors(a.name, ret)
    },

    //To be removed
    dateInFinYear1: (a: any, value: any, putErrors: any) => {
        const { getFromBag } = manageEntitiesState()
        const { getDateValidatorFormat } = manageFormsState()
        const dateFormat = getFromBag('dateFormat')
        const isoDateFormat = 'YYYY-MM-DD'
        const auditLockDate = getFromBag('auditLockDate')

        const dateValidatorFormat =
            getDateValidatorFormat(a.formId, a.controlId) || isoDateFormat

        let ret: any = a.message || 'Invalid date in financial year'
        const finYearObject = getFromBag('finYearObject')
        const startDate = moment(finYearObject.startDate, dateFormat)
        const endDate = moment(finYearObject.endDate, dateFormat)
        const tranDate = moment(value, dateValidatorFormat) //,dateFormat
        if (tranDate.isBetween(startDate, endDate, undefined, '[]')) {
            // from and to dates are included
            ret = undefined
        }
        putErrors(a.name, ret)
    },

    dateInFinYear: (a: any, value: any, putErrors: any) => {
        const { getFromBag } = manageEntitiesState()
        const { getDateValidatorFormat } = manageFormsState()
        const { isDateAuditLocked } = utils()

        const dateFormat = getFromBag('dateFormat')
        const isoDateFormat = 'YYYY-MM-DD'
        const auditLockDate = getFromBag('auditLockDate')

        const dateValidatorFormat =
            getDateValidatorFormat(a.formId, a.controlId) || isoDateFormat

        let ret: any = a.message || messages.dateRangeError
        const finYearObject = getFromBag('finYearObject')
        const startDate = moment(finYearObject.startDate, dateFormat)
        const endDate = moment(finYearObject.endDate, dateFormat)
        const tranDate = moment(value) //, dateValidatorFormat)
        if (tranDate.isBetween(startDate, endDate, undefined, '[]')) {
            // from and to dates are included
            if (isDateAuditLocked(value)) {
                ret = messages.auditLockMessage
            } else {
                ret = undefined
            }
        }
        putErrors(a.name, ret)
    },

    dateInFinYearOrEmpty: (a: any, value: any, putErrors: any) => {
        const { getFromBag } = manageEntitiesState()
        const { getDateValidatorFormat } = manageFormsState()
        const dateFormat = getFromBag('dateFormat')
        const isoDateFormat = 'YYYY-MM-DD'

        const dateValidatorFormat =
            getDateValidatorFormat(a.formId, a.controlId) || isoDateFormat

        let ret: any = a.message || messages.dateRangeError
        const finYearObject = getFromBag('finYearObject')
        const startDate = moment(finYearObject.startDate, dateFormat)
        const endDate = moment(finYearObject.endDate, dateFormat)
        const tranDate = moment(value, dateValidatorFormat) //,dateFormat
        if (!value || (tranDate >= startDate && tranDate <= endDate)) {
            ret = undefined
        }
        putErrors(a.name, ret)
    },

    gstinValidation: (a: any, value: any, putErrors: any) => {
        const message =
            a.args &&
            Array.isArray(a.args) &&
            a.args.length > 0 &&
            a.message &&
            a.message.replace('$args', a.args[0])
        let ret: any = message || a.message || 'Invalid GSTIN'
        const isValid: boolean =
            value === '' || value === undefined || value === null
                ? true
                : /^([0][1-9]|[1-2][0-9]|[3][0-7])([A-Z]{5})([0-9]{4})([A-Z]{1}[1-9A-Z]{1})([Z]{1})([0-9A-Z]{1})+$/.test(
                      value
                  )
        isValid && (ret = undefined)
        putErrors(a.name, ret)
    },

    gstValidation: (a: any, value: any, putErrors: any) => {
        const { extractGst } = utils()
        if (!value.isGst) {
            return
        }
        const gst = extractGst(value) //clones the value object and provides numeric values in it

        //gstin validation
        let ret = undefined
        if (!gst.gstin) {
            ret = messages['gstinRequired']
        } else {
            const gstinformat =
                /^([0][1-9]|[1-2][0-9]|[3][0-7])([A-Z]{5})([0-9]{4})([A-Z]{1}[1-9A-Z]{1})([Z]{1})([0-9A-Z]{1})+$/
            if (!gstinformat.test(gst.gstin)) {
                ret = messages['invalidGstin']
            }
        }
        putErrors('gstinError', ret)

        //gst rate cannot be zero
        ret = undefined
        if (gst.rate === 0) {
            ret = messages['gstRateRequired']
        }
        putErrors('gstRateRequired', ret)

        //gst rate cannot be too high
        ret = undefined
        if (gst.rate > 50) {
            ret = messages['gstRateTooHigh']
        }
        putErrors('gstRateRequired', ret)

        // igst cannot be together with sgst or cgst
        ret = undefined
        if (gst.igst > 0) {
            if (gst.sgst > 0 || gst.cgst > 0) {
                ret = messages['igstWithCgstAndSgst']
            }
        } else if (gst.sgst > 0 || gst.cgst > 0) {
            if (gst.igst > 0) {
                ret = messages['igstWithCgstAndSgst']
            }
        }
        putErrors('igstWithCgstAndSgst', ret)

        // cgst not equals sgat
        ret = undefined
        if (gst.sgst !== gst.cgst) {
            ret = messages['cgstSgstEqual']
        }
        putErrors('cgstSgstEqual', ret)

        // gst cannot be zero
        ret = undefined
        if (gst.sgst + gst.cgst + gst.igst === 0) {
            ret = messages['gstZero']
        }
        putErrors('gstZero', ret)

        // gst error
        ret = undefined
        const amt = +gst.amount
        let sgst = 0.0,
            cgst = 0.0,
            igst = 0.0
        const rate = +gst.rate
        if (amt && amt > 0 && rate && rate > 0) {
            igst = (amt * rate) / (rate + 100)
            cgst = igst / 2
            sgst = cgst
        }
        //igst error
        const igstError =
            gst.igst > 0 ? Math.abs(igst - gst.igst) / gst.igst : 0
        const sgstError =
            gst.sgst > 0 ? Math.abs(sgst - gst.sgst) / gst.sgst : 0
        const cgstError =
            gst.cgst > 0 ? Math.abs(cgst - gst.cgst) / gst.cgst : 0
        if (igstError > 0.02 || cgstError > 0.02 || sgstError > 0.02) {
            ret = messages.gstCalculationError
        }
        putErrors('gstCalculationError', ret)
    },
}

export default itemLevelValidators
