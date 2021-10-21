import { createContext } from "../../../../imports/regular-imports"
import moment from 'moment'
const MultiDataContext = createContext({})

const isoDateFormat = 'YYYY-MM-DD'
const getSalesArbitraryData = (saleType: string) => ({
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
})

export{MultiDataContext, getSalesArbitraryData}


