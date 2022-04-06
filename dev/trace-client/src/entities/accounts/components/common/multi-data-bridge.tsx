import { createContext, moment } from '../../../../imports/regular-imports'
const MultiDataContext = createContext({})
// const MegaContext = createContext({})

const isoDateFormat = 'YYYY-MM-DD'

function getSalesArbitraryData() {
    return {
        accounts: {
            cashBankAccountsWithLedgers: [],
            cashBankAccountsWithSubledgers: [],
            debtorCreditorAccountsWithLedgers: [],
            debtorCreditorAccountsWithSubledgers: [],
            autoSubledgerAccounts: [],
        },

        allAccounts: [],
        autoRefNo: undefined,
        backCalulateAmount: 0.0,
        billTo: {
            id: undefined,
        },

        commonRemarks: undefined,
        deletedSalePurchaseIds: [],
        footer: {
            items: [], // for TranD table
            deletedIds: [],
            amount: 0,
        },
        id: undefined,
        isIgst: false,
        ledgerAccounts: [],
        lineItems: [], // for product details of SalePurchaseDetails table
        rowData: {},
        saleErrorMethods: {
            headError: () => false,
            itemsError: () => false,
            footerError: () => false,
            errorMethods: {
                getSlNoError: () => false,
            },
        },

        saleErrorObject: {},
        saleVariety: 'r',
        shipTo: {},
        summary: {},
        tabValue: 0,
        totalCredits: 0.0,
        totalDebits: 0.0,
        tranDate: moment().format(isoDateFormat),
        isViewBack: false,
    }
}

function getPurchasesArbitraryData() {
    return {
        accounts: {
            allAccounts: [],
            debtorCreditorLedgerAccounts: [],
            purchaseLedgerAccounts: [],
            cashBankLedgerAccounts: [],
            ledgerAccounts: [],
        },
        autoRefNo: undefined,
        cgst: 0.0,
        commonRemarks: undefined,
        deletedSalePurchaseIds: [],
        errorObject: {},
        gstin: undefined,
        id: undefined,
        igst: 0.0,
        isIgst: false,
        isGstInvoice: true,
        ledgerSubledgerPurchase: { isLedgerSubledgerError: true },
        ledgerSubledgerOther: { isLedgerSubledgerError: true },
        invoiceAmount: 0.0,
        isViewBack: false,
        lineItems: [],
        purchaseCashCredit: 'credit',
        qty: 0,
        sgst: 0.0,
        summary: {},
        tabValue: 0,
        tranDate: undefined,
        userRefNo: '',
    }
}

function getDebitCreditNotesArbitraryData() {
    return {
        isViewBack: false,
        tabValue: 0,
        body: {
            accounts: {
                debtorCreditorLedgerAccounts: [],
                saleLedgerAccounts: [],
                purchaseLedgerAccounts: [],
                allAccounts: [],
            },
            amount: 0.0,
            autoRefNo: undefined,
            commonRemarks: undefined,
            ledgerSubledgerCredit: {},
            ledgerSubledgerDebit: {},
            lineRefNoDebit: undefined,
            lineRefNoCredit: undefined,
            lineRemarksDebit: undefined,
            lineRemarksCredit: undefined,
            tranDate: moment().format(isoDateFormat),
            tranDetailsIdDebit: undefined,
            tranDetailsIdCredit: undefined,
            tranHeaderIdDebit: undefined,
            tranHeaderIdCredit: undefined,
            userRefNo: undefined,
        },
    }
}

function getVouchersArbitraryData() {
    return {
        accounts: {
            all: [],
            journal: [],
        },
        header: {
            tranDate: moment().format(isoDateFormat),
        },
        deletedDetailsIds: [],
        debits: [{ key: 0 }],
        credits: [{ key: 0 }],
    }
}

export {
    // MegaContext,
    MultiDataContext,
    getSalesArbitraryData,
    getPurchasesArbitraryData,
    getDebitCreditNotesArbitraryData,
    getVouchersArbitraryData,
}
