import { createContext, moment } from '../../../../imports/regular-imports'
const MultiDataContext = createContext({})

const isoDateFormat = 'YYYY-MM-DD'
function getSalesArbitraryData(saleType: string) {
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
        isAssignmentReturn: saleType === 'ret',
        isSales: saleType === 'sal',
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
        totalCredits: 0.0,
        totalDebits: 0.0,
        tranDate: moment().format(isoDateFormat),
        isViewBack: false,
    }
}

function getPurchasesArbitraryData(){
    return {
        accounts: {
            allAccounts:[],
            debtorCreditorLedgerAccounts:[],
            purchaseLedgerAccounts:[],
            cashBankLedgerAccounts:[],
            ledgerAccounts:[],
        },
        autoRefNo: undefined,
        cgst: 0.0,
        commonRemarks: undefined,
        deletedSalePurchaseIds: [],
        gstin: undefined,
        id: undefined,
        igst: 0.0,
        isIgst: false,
        isGstInvoice: true,
        ledgerSubledgerPurchase: { isLedgerSubledgerError: true },
        ledgerSubledgerOther: { isLedgerSubledgerError: true },
        invoiceAmount: 0.0,
        lineItems: [],
        purchaseCashCredit: 'credit',
        qty: 0,
        sgst: 0.0,
        summary: {},
        tranDate: undefined,
        userRefNo: '',
        isViewBack: false,
    }
}

export { MultiDataContext, getSalesArbitraryData, getPurchasesArbitraryData }
