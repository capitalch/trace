import { signal, Signal, _ } from '../../../../imports/regular-imports'

const PurchaseNewStoreT: PurchaseNewStoreType = {
    tabValue: signal(0),
    errors: {
        tranDate: signal(''),
        invoiceNo: signal(''),
        purchaseAccountCode: signal(''),
        otherAccountCode: signal(''),
        gstinNumber: signal(''),
        invoiceAmount: signal(''),
        totalQty: signal(''),
        cgst: signal(''),
        sgst: signal(''),
        igst: signal(''),
        lineItems: signal([
            {
                productCode: signal(''),
                hsn: signal(''),
                gstPercent: signal(''),
                qty:signal('')
            }
        ]),
    },
    main: {
        header: {
            id: undefined,
            refNo: signal(''),
            tranDate: signal(''),
            invoiceNo: signal(''),
            commonRemarks: signal(''),
            isCreditPurchase: signal(true),
            isGstInvoice: signal(true),
            isSubmitDisabled: signal(true)
        },
        subHeader: {
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
                index: signal(0),
                productCode: signal(''),
                hsn: signal(''),
                productDetails: signal(''),
                gstPercent: signal(0),
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

const PurchaseNewStore: PurchaseNewStoreType = _.cloneDeep(PurchaseNewStoreT)

type PurchaseNewStoreType = {
    tabValue: Signal<number>,
    errors: {
        tranDate: Signal<string>
        invoiceNo: Signal<string>
        purchaseAccountCode: Signal<string>
        otherAccountCode: Signal<string>
        gstinNumber: Signal<string>
        invoiceAmount: Signal<string>
        totalQty: Signal<string>
        cgst: Signal<string>
        sgst: Signal<string>
        igst: Signal<string>
        lineItems: Signal<Array<LineItemErrorType>>
    },
    main: {
        header: {
            id: string | undefined
            refNo: Signal<string>
            tranDate: Signal<string>
            invoiceNo: Signal<string>
            commonRemarks: Signal<string>
            isCreditPurchase: Signal<boolean>
            isGstInvoice: Signal<boolean>
            isSubmitDisabled: Signal<boolean>
        },
        subHeader: {
            purchaseAccountCode: Signal<string>
            otherAccountCode: Signal<string>
            gstinNumber: Signal<string>
            invoiceAmount: Signal<number>
            totalQty: Signal<number>
            cgst: Signal<number>
            sgst: Signal<number>
            igst: Signal<number>
        },
        lineItems: Signal<Array<LineItemType>>
    },

}

type LineItemType = {
    index: Signal<number>
    productCode: Signal<string>
    hsn: Signal<string>
    productDetails: Signal<string>
    gstPercent: Signal<number>
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

type LineItemErrorType = {
    productCode: Signal<string>
    hsn: Signal<string>
    gstPercent: Signal<string>
    qty: Signal<string>
}

export { PurchaseNewStore }