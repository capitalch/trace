import moment from 'moment'
const isoDateFormat = 'YYYY-MM-DD'

const inventoryMegaData = () => ({
    allTags: [],
    selectedReportName: undefined,
})

const salesMegaData = () => ({
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
        // amount: 0,
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
    // rawSaleData: undefined,
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
    tranDate: moment().format(isoDateFormat),
    userRefNo: undefined,
})

const settingsMegaData = () => ({
    smallFontTextField: { style: { fontSize: 14 } },
})

const stockJournalMegaData = () => ({
    allErrors: {},
    autoRefNo: undefined,
    id: undefined,
    inputSection: {
        allErrors: {},
        currentItemIndex: 0,
        deletedIds:[],
        items: [{ qty: 1 }],
        summary: {
            count: 1,
            qty: 1,
        },
        title: 'Source (Consumption / input / credit)',
    },
    outputSection: {
        allErrors: {},
        currentItemIndex: 0,
        deletedIds:[],
        items: [{ qty: 1 }],
        summary: {
            count: 1,
            qty: 1,
        },
        title: 'Destination (Production / output / debit)',
    },
    remarks: undefined,
    selectedStockJournalId: undefined,
    selectedStockJournalRawData: undefined,
    tranDate: moment().format(isoDateFormat),
    userRefNo: undefined,
})

export {
    inventoryMegaData,
    salesMegaData,
    settingsMegaData,
    stockJournalMegaData,
}
