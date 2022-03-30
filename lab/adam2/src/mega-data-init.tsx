import moment from 'moment'
const isoDateFormat = 'YYYY-MM-DD'
const megaData = { accounts: { sales: {}, settings: {} } }
const settingsMegaData = {
    smallFontTextField: { style: { fontSize: 14 } }
}
const salesMegaData = {
    autoRefNo: undefined,
    billTo: {},
    commonRemarks: undefined,
    credits: 0,
    debits: 0,
    gstin: undefined,
    paymentMethods: [],
    products: [],
    saleVariety: 'r',
    shipTo: {},
    summary: {
        qty: 0, cgst: 0, sgst: 0, igst: 0, amount: 0,
    },
    tranDate: moment().format(isoDateFormat),
    userRefNo: undefined,
}
Object.assign(megaData.accounts.sales, salesMegaData)
Object.assign(megaData.accounts.settings, settingsMegaData)

export { megaData, salesMegaData }