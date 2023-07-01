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
        computedInvoiceAmount: 0,
        computedTotalQty: 0,
        computedCgst: 0,
        computedSgst: 0,
        computedIgst: 0,
        header: {
            id: undefined,
            refNo: signal(undefined),
            tranDate: signal(undefined),
            invoiceNo: signal(undefined),
            commonRemarks: signal(undefined),
            isCreditPurchase: signal(true),
            isGstInvoice: signal(true),
            isSubmitDisabled: signal(true)
        },
        subheader: {
            ledgerSubledgerPurchase: { isLedgerSubledgerError: true },
            purchaseAccountCode: signal(''),
            otherAccountCode: signal(''),
            gstinNumber: signal(''),
            invoiceAmount: signal(0.00),
            totalQty: signal(0),
            cgst: signal(0),
            sgst: signal(0),
            igst: signal(0),
        },
        lineItems: signal([
            {
                productCodeOrUpc: signal(''),
                productCode:signal(''),
                upcCode: signal(''),
                hsn: signal(0),
                productDetails: signal(''),
                gstRate: signal(0),
                clos: signal(0),
                qty: signal(0),
                price: signal(0),
                priceGst: signal(0),
                discount: signal(0),
                subTotal: signal(0),
                amount: signal(0),
                serialNumber: signal(''),
                remarks: signal(''),
                cgst: signal(0),
                sgst: signal(0),
                igst: signal(0)
            }
        ]),
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
        computedInvoiceAmount: number,
        computedTotalQty: number,
        computedCgst: number,
        computedSgst: number,
        computedIgst: number,
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
            purchaseAccountCode: Signal<string>
            otherAccountCode: Signal<string>
            gstinNumber: Signal<string>
            invoiceAmount: Signal<number>
            totalQty: Signal<number>
            cgst: Signal<number>
            sgst: Signal<number>
            igst: Signal<number>
        },
        lineItems: Signal<PurchaseLineItemType[]>
    },

}

function getPurchaseLineItemInstance(): PurchaseLineItemType {
    return ({
        productCodeOrUpc: signal(''),
        productCode:signal(''),
        upcCode: signal(''),
        hsn: signal(0),
        productDetails: signal(''),
        gstRate: signal(0),
        clos: signal(0),
        qty: signal(0),
        price: signal(0),
        priceGst: signal(0),
        discount: signal(0),
        subTotal: signal(0),
        amount: signal(0),
        serialNumber: signal(''),
        remarks: signal(''),
        cgst: signal(0),
        sgst: signal(0),
        igst: signal(0)
    })
}
export { getPurchaseLineItemInstance }

type PurchaseLineItemType = {
    productCodeOrUpc: Signal<string>
    productCode:Signal<string>
    upcCode: Signal<string>
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
    serialNumber: Signal<string>
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

export { PurchaseStore }


// const purchaseMainlineItemInstance: LineItemType = {
//     index: 0,
//     productCode: '',
//     hsn: 0,
//     productDetails: '',
//     gstRate: 0,
//     clos: 0,
//     qty: 0,
//     price: 0,
//     priceGst: 0,
//     discount: 0,
//     subTotal: 0,
//     amount: 0,
//     serialNumber: '',
//     remarks: '',
//     cgst: 0,
//     sgst: 0,
//     igst: 0
// }
// export { purchaseMainlineItemInstance }

// function getInstance() {
//     return ({
//         index: signal(0),
//         productCode: signal(''),
//         hsn: signal(0),
//         productDetails: signal(''),
//         gstRate: signal(0),
//         clos: signal(0),
//         qty: signal(0),
//         price: signal(0),
//         priceGst: signal(0),
//         discount: signal(0),
//         subTotal: signal(0),
//         amount: signal(0),
//         serialNumber: signal(''),
//         remarks: signal(''),
//         cgst: signal(0),
//         sgst: signal(0),
//         igst: signal(0)
//     })
// }

// export { getInstance }

// errors: {
//     tranDate: signal(''),
//     invoiceNo: signal(''),
//     purchaseAccountCode: signal(''),
//     otherAccountCode: signal(''),
//     gstinNumber: signal(''),
//     invoiceAmount: signal(''),
//     totalQty: signal(''),
//     cgst: signal(''),
//     sgst: signal(''),
//     igst: signal(''),
//     lineItems: [
//         {
//             productCode: signal(''),
//             hsn: signal(''),
//             gstPercent: signal(''),
//             qty: signal('')
//         }
//     ],
// },

// errors: {
//     tranDate: Signal<string>
//     invoiceNo: Signal<string>
//     purchaseAccountCode: Signal<string>
//     otherAccountCode: Signal<string>
//     gstinNumber: Signal<string>
//     invoiceAmount: Signal<string>
//     totalQty: Signal<string>
//     cgst: Signal<string>
//     sgst: Signal<string>
//     igst: Signal<string>
//     lineItems: LineItemErrorType[]
// },