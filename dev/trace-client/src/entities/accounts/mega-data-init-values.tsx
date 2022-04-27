import moment from 'moment'
const isoDateFormat = 'YYYY-MM-DD'
const settingsMegaData = () => ({
    smallFontTextField: { style: { fontSize: 14 } }
})

const salesMegaData = () => ({
    allErrors: {},
    autoRefNo: undefined,
    billTo: {},
    commonRemarks: undefined,
    credits: 0,
    debits: 0,
    salesAccountId: 0,
    gstin: undefined,
    id: undefined,
    isIgst: false,
    items: [],
    payments: {
        deletedIds: [],
        paymentMethodsList: [],
        paymentVariety: 'r',
    },
    // paymentMethodsList: [], // to be removed
    // paymentVariety: 'r', // to be removed
    rawSaleData: undefined,
    saleType: 'sal',
    shipTo: {},
    summary: {
        qty: 0, cgst: 0, sgst: 0, igst: 0, amount: 0, backCalculateAmount: 0,
    },
    tranDate: moment().format(isoDateFormat),
    userRefNo: undefined,
})

export { salesMegaData, settingsMegaData }