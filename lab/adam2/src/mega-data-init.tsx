import moment from 'moment'
const isoDateFormat = 'YYYY-MM-DD'
const megaData = { accounts: { sales: {} } }
const salesMegaData = {
    amount:0,
    autoRefNo: undefined,
    billTo: {},
    cgst:0,
    commonRemarks: undefined,
    credits:0,
    debits:0,
    gstin: undefined,
    igst:0,
    paymentMethods: [],
    products: [],
    qty:0,
    setRefresh: {},
    saleVariety: 'r',
    sgst:0,
    shipTo: {},
    tranDate: moment().format(isoDateFormat),
    userRefNo: undefined,
}
Object.assign(megaData.accounts.sales, salesMegaData)

export { megaData, salesMegaData }