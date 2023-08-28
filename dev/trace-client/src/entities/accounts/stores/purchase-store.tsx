import { signal, Signal, _ } from '../../../imports/regular-imports'
// import { produce } from 'immer'

const PurchaseStoreT: PurchaseStoreType = {
    tabValue: signal(0),
    purchaseType: 'pur',
    errorsObject: {
        tranDateError: () => '',
        invoiceNoError: () => '',

        purchaseAcError: () => '',
        otherAcError: () => '',
        gstinError: () => '',

        invoiceAmountError: () => '',
        totalQtyError: () => '',
        totalCgstError: () => '',
        totalSgstError: () => '',
        totalIgstError: () => '',
        cgstSgstIgstError:()=>'',
        igstError:() => '',

        productCodeError: () => '',
        productDetailsError: () => '',
        hsnError: () => '',
        gstRateError: () => '',

        qtyError: () => '',
        slNoError: () => ''
    },

    main: {
        functions: {
            addLineItem: () => { },
            clearSubheaderTotals: () => { },
            clearLineItem: () => { },
            computeRow: () => { },
            computeSummary: () => { },
            deleteLineItem: () => { },
            getComputedInvoiceAmount: () => 0,
            getComputedTotalQty: () => 0,
            getComputedTotalCgst: () => 0,
            getComputedTotalSgst: () => 0,
            getComputedTotalIgst: () => 0,
            isFormError: () => true,
            populateLineItem: () => { },
            // refreshPurchaseLineItems: () => {},
            refreshSubheader: () => {},
            setPrice: () => { },
            setPriceGst: () => { },
        },
        header: {
            id: undefined,
            refNo: signal(undefined),
            tranDate: signal(undefined),
            invoiceNo: signal(undefined),
            commonRemarks: signal(undefined),
            // isCreditPurchase: signal(true),
            isGstInvoice: signal(false),
            isSubmitDisabled: signal(true)
        },
        subheader: {
            extGstTranDId: undefined,
            ledgerSubledgerPurchase: { isLedgerSubledgerError: true, accId: undefined, id: undefined},
            ledgerSubledgerOther: { isLedgerSubledgerError: true, accId: undefined, id: undefined},
            purchaseAccId: signal(0),
            otherAccId: signal(0),
            gstinNumber: signal(''),
            invoiceAmount: signal(0.00),
            totalQty: signal(0),
            cgst: signal(0),
            sgst: signal(0),
            igst: signal(0),
        },
        lineItems: signal([getEmptyPurchaseLineItem()]),
        lineItemsHeader: {
            isIgst: signal(false),
        },
        lineItemsFooter: {
            qty: signal(0.0),
            discount: signal(0.0),
            subTotal: signal(0.0),
            amount: signal(0.0),
            cgst: signal(0.0),
            sgst: signal(0.0),
            igst: signal(0.0),
        }
    },
    view: {
        rows: [],
    }
}

let PurchaseStore: PurchaseStoreType = _.cloneDeep(PurchaseStoreT)

function resetPurchaseStore() {
    PurchaseStore = _.cloneDeep(PurchaseStoreT)
}

type PurchaseStoreType = {
    tabValue: Signal<number>,
    purchaseType: 'pur' | 'ret'
    errorsObject: {
        tranDateError: ErrorType
        invoiceNoError: ErrorType

        purchaseAcError: ErrorType
        otherAcError: ErrorType
        gstinError: ErrorType
        invoiceAmountError: ErrorType
        totalQtyError: ErrorType
        totalCgstError: ErrorType
        totalSgstError: ErrorType
        totalIgstError: ErrorType
        cgstSgstIgstError: ErrorType
        igstError: ErrorType

        productCodeError: ErrorTypeWithLineItem
        productDetailsError: ErrorTypeWithLineItem
        hsnError: ErrorTypeWithLineItem
        gstRateError: ErrorTypeWithLineItem
        qtyError: ErrorTypeWithLineItem
        slNoError: ErrorTypeWithLineItem
    },

    main: {
        functions: {
            addLineItem: (index: number) => void
            clearSubheaderTotals: () => void
            clearLineItem: (row: PurchaseLineItemType) => void
            computeRow: (row: PurchaseLineItemType) => void
            computeSummary: () => void
            deleteLineItem: (index: number) => void
            getComputedInvoiceAmount: () => number
            getComputedTotalQty: () => number
            getComputedTotalCgst: () => number
            getComputedTotalSgst: () => number
            getComputedTotalIgst: () => number
            isFormError: () => boolean
            populateLineItem: (row: PurchaseLineItemType, data: any) => void
            // refreshPurchaseLineItems: () => void
            refreshSubheader: () => void
            setPrice: (row: PurchaseLineItemType) => void
            setPriceGst: (row: PurchaseLineItemType) => void
        }
        header: {
            id: number | undefined
            refNo: Signal<string | undefined>
            tranDate: Signal<string | undefined>
            invoiceNo: Signal<string | undefined>
            commonRemarks: Signal<string | undefined>
            // isCreditPurchase: Signal<boolean>
            isGstInvoice: Signal<boolean>
            isSubmitDisabled: Signal<boolean>
        },
        subheader: {
            extGstTranDId: number | undefined
            ledgerSubledgerPurchase: { isLedgerSubledgerError: boolean, accId: string | undefined, id: number | undefined }
            ledgerSubledgerOther: { isLedgerSubledgerError: boolean, accId: string | undefined, id: number | undefined }
            purchaseAccId: Signal<number>
            otherAccId: Signal<number>
            gstinNumber: Signal<string>
            invoiceAmount: Signal<number>
            totalQty: Signal<number>
            cgst: Signal<number>
            sgst: Signal<number>
            igst: Signal<number>
        },
        lineItems: Signal<PurchaseLineItemType[]>,
        lineItemsHeader: {
            isIgst: Signal<boolean>
        },
        lineItemsFooter: {
            discount: Signal<number>
            qty: Signal<number>
            subTotal: Signal<number>
            amount: Signal<number>
            cgst: Signal<number>
            sgst: Signal<number>
            igst: Signal<number>
        }
    },

    view: {
        rows: Signal<any>[]
    }
}
export function getEmptyPurchaseLineItem() {
    const lineItem = {
        id: undefined,
        productCodeOrUpc: signal(''),
        productCode: signal(''),
        upcCode: signal(''),
        productId: signal(0),
        hsn: signal(0),
        productDetails: signal(''),
        gstRate: signal(0),
        clos: signal(0),
        qty: signal(1),
        price: signal(0),
        priceGst: signal(0),
        discount: signal(0),
        subTotal: signal(0),
        amount: signal(0),
        serialNumbers: signal(''),
        serialNumberCount: signal(0),
        remarks: signal(''),
        cgst: signal(0),
        sgst: signal(0),
        igst: signal(0),
    }
    return ({ ...lineItem })
}

type PurchaseLineItemType = {
    id: number | undefined
    productCodeOrUpc: Signal<string>
    productCode: Signal<string>
    upcCode: Signal<string>
    productId: Signal<number | undefined>
    hsn: Signal<number>
    productDetails: Signal<string>
    gstRate: Signal<number>
    clos?: Signal<number>
    qty: Signal<number>
    price: Signal<number>
    priceGst: Signal<number>
    discount: Signal<number>
    subTotal: Signal<number>
    amount: Signal<number>
    serialNumbers: Signal<string>
    serialNumberCount: Signal<number>
    remarks: Signal<string>
    cgst: Signal<number>
    sgst: Signal<number>
    igst: Signal<number>
}

export { type PurchaseLineItemType, resetPurchaseStore }

// type LineItemErrorType = {
//     productCode: Signal<string>
//     hsn: Signal<string>
//     gstPercent: Signal<string>
//     qty: Signal<string>
// }

type ErrorType = () => string
type ErrorTypeWithLineItem = (lineItem: PurchaseLineItemType) => string

export { PurchaseStore, PurchaseStoreT }