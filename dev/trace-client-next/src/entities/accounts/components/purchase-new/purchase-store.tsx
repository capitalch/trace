import { signal, Signal, _ } from '../../../../imports/regular-imports'

const PurchaseStoreT: PurchaseStoreType = {
    tabValue: signal(0),
    purchaseType: 'pur',
    errorsObject: {
        tranDateError: () => '',
        invoiceNoError: () => '',
        gstinError: () => '',
        invoiceAmountError: () => '',
        totalQtyError: () => '',
        totalCgstError: () => '',
        totalSgstError: () => '',
        totalIgstError: () => ''
    },

    main: {
        functions: {
            addLineItem: () => { },
            clearLineItem: () => { },
            computeRow: () => { },
            computeSummary: () => { },
            deleteLineItem: () => { },
            populateLineItem: () => { },
            setPrice: () => { },
            setPriceGst: () => { },
        },
        header: {
            id: undefined,
            refNo: signal(undefined),
            tranDate: signal(undefined),
            invoiceNo: signal(undefined),
            commonRemarks: signal(undefined),
            isCreditPurchase: signal(true),
            isGstInvoice: signal(false),
            isSubmitDisabled: signal(true)
        },
        subheader: {
            ledgerSubledgerPurchase: { isLedgerSubledgerError: true },
            ledgerSubledgerOther: { isLedgerSubledgerError: true },
            purchaseAccId: signal(0),
            otherAccId: signal(0),
            gstinNumber: signal(''),
            invoiceAmount: signal(0.00),
            totalQty: signal(0),
            cgst: signal(0),
            sgst: signal(0),
            igst: signal(0),
        },
        lineItems: signal([
        ]),
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
}

const PurchaseStore: PurchaseStoreType = _.cloneDeep(PurchaseStoreT)

type PurchaseStoreType = {
    tabValue: Signal<number>,
    purchaseType: 'pur' | 'ret'
    errorsObject: {
        tranDateError: ErrorType
        invoiceNoError: ErrorType
        gstinError: ErrorType
        invoiceAmountError: ErrorType
        totalQtyError: ErrorType
        totalCgstError: ErrorType
        totalSgstError: ErrorType
        totalIgstError: ErrorType
    },

    main: {
        functions: {
            addLineItem: (index: number) => void
            clearLineItem: (row: PurchaseLineItemType) => void
            computeRow: (row: PurchaseLineItemType) => void
            computeSummary: () => void
            deleteLineItem: (index: number) => void
            populateLineItem: (row: PurchaseLineItemType, data: any) => void
            setPrice: (row: PurchaseLineItemType) => void
            setPriceGst: (row: PurchaseLineItemType) => void
        }
        header: {
            id: string | undefined
            refNo: Signal<string | undefined>
            tranDate: Signal<string | undefined>
            invoiceNo: Signal<string | undefined>
            commonRemarks: Signal<string | undefined>
            isCreditPurchase: Signal<boolean>
            isGstInvoice: Signal<boolean>
            isSubmitDisabled: Signal<boolean>
        },
        subheader: {
            ledgerSubledgerPurchase: { isLedgerSubledgerError: boolean }
            ledgerSubledgerOther: { isLedgerSubledgerError: boolean }
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

}

// function populateLineItem(item: PurchaseLineItemType, data: any) {
//     item.productCodeOrUpc.value = ''
//     item.productCode.value = data.productCode
//     item.upcCode.value = data.upcCode
//     item.productId.value = data.productId
//     item.hsn.value = data.hsn
//     item.productDetails.value = `${data.catName} ${data.brandName} ${data.label}`
//     item.gstRate.value = data.gstRate
//     item.qty.value = 1
//     item.price.value = data.lastPurchasePrice
//     item.discount.value = 0
//     item.subTotal.value = 0
//     item.amount.value = 0
//     item.serialNumbers.value = ''
//     item.remarks.value = ''
//     item.cgst.value = 0
//     item.sgst.value = 0
//     item.igst.value = 0
// }
// export { populateLineItem }

type PurchaseLineItemType = {
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
    remarks: Signal<string>
    cgst: Signal<number>
    sgst: Signal<number>
    igst: Signal<number>
}

export type { PurchaseLineItemType }

type LineItemErrorType = {
    productCode: Signal<string>
    hsn: Signal<string>
    gstPercent: Signal<string>
    qty: Signal<string>
}

type ErrorType = () => string

export { PurchaseStore, PurchaseStoreT }