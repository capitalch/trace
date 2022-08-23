import { atom } from 'recoil'
import moment from 'moment'

const salesData = {
    allErrors: {},
    autoRefNo: undefined,
    billTo: {},
    currentItemIndex: 0,
    commonRemarks: undefined,
    credits: 0,
    debits: 0,
    deletedSalePurchaseIds: [],
    extGstTranDId: undefined,
    salesAccount: {
        id: undefined, // id from table TranD for row which is for sales
        accId: undefined,
    },
    gstin: undefined,
    id: undefined, // from table TranH
    isIgst: false,
    items: [], // id from salePurchaseDetails table
    payments: {
        deletedIds: [],
        paymentMethodsList: [], // id from TranD table // object array of type: {id, amount, instrNo, remarks, rowData:{accId}, ledgerFilterMethodName, }
        paymentVariety: 'r',
    },
    saleType: 'sal',
    shipTo: {},
    summary: {
        qty: 0,
        cgst: 0,
        sgst: 0,
        igst: 0,
        amount: 0,
        backCalculateAmount: 0,
    },
    tranDate: moment().format('YYYY-MM-DD'),
    userRefNo: undefined,
}

const salesAtom:any = atom({
    key: 'sales-recoil',
    default: salesData,
})


export {salesAtom}
