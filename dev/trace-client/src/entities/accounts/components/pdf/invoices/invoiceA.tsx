import { useSharedElements } from '../../common/shared-elements-hook'
import { useInvoiceA } from './invoiceA-hook'
import { _, moment } from '../../../../../imports/regular-imports'

function InvoiceA({
    unitInfo,
    rawSaleData,
}: {
    unitInfo: any
    rawSaleData: any
}) {
    const { getAccountClass, getFromBag, toDecimalFormat } = useSharedElements()
    const { InvoicePdf } = useInvoiceA()
    const dateFormat = getFromBag('dateFormat')
    const invoiceData = getInvoiceData(unitInfo, rawSaleData)
    console.log(invoiceData)
    return <InvoicePdf invoiceData={invoiceData} />

    function getInvoiceData(traceCompany: any, traceInvoice: any) {
        const tc = traceCompany,
            ti = traceInvoice.jsonResult
        const i: {
            invoiceInfo: any
            companyInfo: any
            billTo: any
            shipTo: any
            items: any[]
            summary: any
            receipts: any[]
        } = {
            invoiceInfo: null,
            companyInfo: null,
            billTo: null,
            shipTo: null,
            items: [],
            summary: null,
            receipts: [],
        }
        i.invoiceInfo = {
            title: 'Tax Invoice',
            titleRight: 'Original for recipient',
            invoiceNo: ti.tranH.autoRefNo,
            invoiceDate: moment(ti.tranH.tranDate).format(dateFormat),
            type: ti.tranH.tranTypeId === 4 ? 'Sale' : 'Sale Ret',
            terms: '',
        }
        i.companyInfo = {
            name: tc.unitName,
            address1: tc.address1,
            address2: tc.address2,
            pin: tc.pin,
            phone: ''.concat(tc.landPhone, ' ', tc.mobileNumber),
            email: tc.email,
            web: tc.webSite,
            gstin: tc.gstin,
            stateName: 'West Bengal', // Get from stateCode from data
            stateCode: tc.state,
        }
        const billTo = ti.billTo || ti.businessContacts
        i.billTo = {
            name: billTo?.contactName || '',
            address1: billTo?.address1 || '',
            address2: billTo?.address2 || '',
            pin: billTo?.pin || billTo?.jAddress?.pin || '',
            phone: ''.concat(
                billTo?.mobileNumber || '',
                ' ',
                billTo?.landPhone || ''
            ),
            email: billTo?.email,
            gstin: billTo?.gstin,
            stateName: billTo?.selectedStateOption?.label || billTo?.state || billTo?.jAddress?.state,
            stateCode: billTo?.stateCode,
        }
        let shipTo = ti.tranH.jData?.shipTo
        if (_.isEmpty(shipTo)) {
            shipTo = billTo
        }
        i.shipTo = {
            name: shipTo?.contactName || '',
            address1: shipTo?.address1 || '',
            address2: shipTo?.address2 || '',
            pin: shipTo?.pin || '',
            phone: shipTo?.mobileNumber || '',
            email: shipTo?.email || '',
            state: shipTo?.state || '',
            country: shipTo?.country || '',
        }
        i.items = ti.salePurchaseDetails.map((x: any) => ({
            desc: ''.concat(
                x.catName,
                ', ',
                x.brandName,
                ', ',
                x.label,
                x.serialNumbers ? ', Sl nos: '.concat(x.serialNumbers) : '',
                ', HSN ',
                x.hsn, ', ', x.remarks ? 'Remarks: ' + x.remarks : ''
            ),
            qty: x.qty,
            price: toDecimalFormat(x.price),
            discount: toDecimalFormat(x.discount),
            aggr: toDecimalFormat(x.qty * (x.price - x.discount)),
            cgst: toDecimalFormat(x.cgst),
            sgst: toDecimalFormat(x.sgst),
            igst: toDecimalFormat(x.igst),
            gst: toDecimalFormat(x.cgst + x.sgst + x.igst),
            gstRate: toDecimalFormat(x.gstRate),
            amount: toDecimalFormat(x.amount),
        }))
        const gstObj = ti.extGstTranD
        i.summary = {
            cgst: toDecimalFormat(gstObj?.cgst || 0.0),
            sgst: toDecimalFormat(gstObj?.sgst || 0.0),
            igst: toDecimalFormat(gstObj?.igst || 0.0),
            amount: 0,
            aggr: 0,
            taxAmount: toDecimalFormat((gstObj?.cgst || 0.0) + (gstObj?.sgst || 0.0) + (gstObj?.igst || 0.0)),
            qty: 0,
            discount: 0,
        }
        const temp = ti.salePurchaseDetails.reduce((prev: any, current: any) => {
            const obj = {
                qty: prev.qty + (current.qty || 0),
                discount: (prev.discount + current.discount || 0),
                aggr: (prev.aggr + ((current.qty * (current.price - current.discount)) || 0))
            }
            return (obj)
        }, { qty: 0, discount: 0, aggr: 0 })

        i.summary.qty = temp.qty
        i.summary.discount = toDecimalFormat(temp.discount)
        i.summary.amountInWords = ti.amountInWords
        i.summary.aggr = toDecimalFormat(temp.aggr)
        i.receipts = []
        for (const item of ti.tranD) {
            const accClass = getAccountClass(item.accId)
            const accCode = item.accCode
            if (accClass === 'sale') {
                i.summary.amount = toDecimalFormat(item?.amount || 0)
            } else {
                i.invoiceInfo.accCode = ''
                if (['debtor', 'creditor'].includes(accClass)) {
                    i.invoiceInfo.type = i.invoiceInfo.type.concat(' ', 'on credit')
                    i.invoiceInfo.accCode = item?.accCode || ''
                }
                i.receipts.push({
                    type: `${accClass}: ${accCode}`,
                    instrument: item.instrNo || '',
                    remarks: ''.concat(
                        item.lineRefNo || '',
                        item.remarks || ''
                    ),
                    amount: toDecimalFormat(item?.amount || 0),
                })
            }
        }
        return i
    }
}

export { InvoiceA }