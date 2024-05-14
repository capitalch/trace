import { Signal, signal } from "@preact/signals-react"
import _ from 'lodash'
import moment from "moment"
import { PurchaseLineItemType } from "./purchase-store"

const currentDate = moment().format('YYYY-MM-DD')
const BranchTransferStoreT: BranchTransferStoreType = {
    tabValue: signal(0),
    errorsObject: {
        tranDateError: () => ''
    },
    main: {
        header: {
            id: undefined,
            refNo: signal(undefined),
            tranDate: signal(currentDate),
            userRefNo: signal(undefined),
            commonRemarks: signal(undefined),
            isSubmitDisabled: signal(true)
        },
        lineItems: signal([getEmptyBranchTransferLineItem()])
    }
}

let BranchTransferStore: BranchTransferStoreType = _.cloneDeep(BranchTransferStoreT)

export { BranchTransferStore }

export function getEmptyBranchTransferLineItem() {
    const lineItem = {
        id: undefined,
        productCodeOrUpc: signal(''),
        productCode: signal(''),
        upcCode: signal(''),
        productId: signal(0),
        productDetails: signal(''),
        qty: signal(1),
        price: signal(0),
        amount: signal(0),
        serialNumbers: signal(''),
        serialNumberCount: signal(0),
        remarks: signal(''),
    }
    return ({ ...lineItem })
}

type BranchTransferStoreType = {
    tabValue: Signal<number>,
    errorsObject: {
        tranDateError: ErrorType
    }
    main: {
        header: {
            id: number | undefined
            refNo: Signal<string | undefined>
            tranDate: Signal<string | undefined>
            userRefNo: Signal<string | undefined>
            commonRemarks: Signal<string | undefined>
            isSubmitDisabled: Signal<boolean>
        },
        lineItems: Signal<BranchTransferLineItemType[]>
    }
}

type ErrorType = () => string
export type BranchTransferLineItemType = {
    id: number | undefined
    productCodeOrUpc: Signal<string>
    productCode: Signal<string>
    upcCode: Signal<string>
    productId: Signal<number | undefined>
    productDetails: Signal<string>
    qty: Signal<number>
    price: Signal<number>
    amount: Signal<number>
    serialNumbers: Signal<string>
    serialNumberCount: Signal<number>
    remarks: Signal<string>
}