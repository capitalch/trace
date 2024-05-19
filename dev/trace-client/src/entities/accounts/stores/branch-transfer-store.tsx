import { Signal, signal } from "@preact/signals-react"
import produce from "immer"
import _ from 'lodash'
import moment from "moment"

const currentDate = moment().format('YYYY-MM-DD')

const BranchTransferStoreT: BranchTransferStoreType = {
    tabValue: signal(0),
    errorsObject: {
        tranDateError: () => ''
    },
    main: {
        sourchBranchId: signal(0),
        destBranchId: signal(0),
        header: {
            id: undefined,
            refNo: signal(undefined),
            tranDate: signal(currentDate),
            userRefNo: signal(undefined),
            commonRemarks: signal(undefined),
            isSubmitDisabled: signal(true)
        },
        lineItems: signal([getEmptyBranchTransferLineItem()]),
        lineItemsFooter: {
            debitQty: signal(0),
            creditQty: signal(0),
            debitAmount: signal(0),
            creditAmount: signal(0)
        }
    }
}

let BranchTransferStore: BranchTransferStoreType = _.cloneDeep(BranchTransferStoreT)

export { BranchTransferStore }

export function addBranchTransferLineItem(index: number) {
    BranchTransferStore.main.lineItems.value = produce(BranchTransferStore.main.lineItems.value, (draft: any[]) => {
        draft.splice(index + 1, 0, getEmptyBranchTransferLineItem())
        return (draft)
    })
    computeFooterBranchTransferLineItem()
}

export function computeAmountBranchTransferLineItem(item: BranchTransferLineItemType) {
    item.amount.value = item.qty.value * item.price.value
    computeFooterBranchTransferLineItem()
}

export function computeFooterBranchTransferLineItem() {
    let debitQty = 0
    let creditQty = 0
    let debitAmount = 0
    let creditAmount = 0

    BranchTransferStore.main.lineItems.value.forEach((item: BranchTransferLineItemType) => {
        if (item.dbCr.value === 'D') {
            debitQty += item.qty.value
            debitAmount += item.amount.value
        } else {
            creditQty += item.qty.value
            creditAmount += item.amount.value
        }
    })

    BranchTransferStore.main.lineItemsFooter.debitQty.value = debitQty
    BranchTransferStore.main.lineItemsFooter.creditQty.value = creditQty
    BranchTransferStore.main.lineItemsFooter.debitAmount.value = debitAmount
    BranchTransferStore.main.lineItemsFooter.creditAmount.value = creditAmount

}

export function clearBranchTransferLineItem(index: number) {
    BranchTransferStore.main.lineItems.value = produce(BranchTransferStore.main.lineItems.value, (draft: any[]) => {
        draft.splice(index, 1)
        return (draft)
    })
    addBranchTransferLineItem(index)
}

export function deleteBranchTransferLineItem(index: number) {
    if (BranchTransferStore.main.lineItems.value.length === 1) { // No delete for 1 item in the list
        return
    }
    BranchTransferStore.main.lineItems.value = produce(BranchTransferStore.main.lineItems.value, (draft: any[]) => {
        draft.splice(index, 1)
        return (draft)
    })
    computeFooterBranchTransferLineItem()
}

export function populateBranchTransferLineItem(item: BranchTransferLineItemType, data: any) {
    item.productCodeOrUpc.value = ''
    item.productCode.value = data.productCode
    item.upcCode.value = data.upcCode
    item.productId.value = data.productId
    item.productDetails.value = `${data.catName} ${data.brandName} ${data.label}`
    item.qty.value = 1
    item.price.value = data.lastPurchasePrice
    item.amount.value = 0
    item.serialNumbers.value = ''
    item.remarks.value = ''
    computeAmountBranchTransferLineItem(item)
}

function getEmptyBranchTransferLineItem() {
    const lineItem = {
        id: undefined,
        productCodeOrUpc: signal(''),
        productCode: signal(''),
        upcCode: signal(''),
        productId: signal(0),
        productDetails: signal(''),
        branchId: signal(''),
        dbCr: signal('D'),
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
        sourchBranchId: Signal<number>
        destBranchId: Signal<number>
        header: {
            id: number | undefined
            refNo: Signal<string | undefined>
            tranDate: Signal<string | undefined>
            userRefNo: Signal<string | undefined>
            commonRemarks: Signal<string | undefined>
            isSubmitDisabled: Signal<boolean>
        },
        lineItems: Signal<BranchTransferLineItemType[]>
        lineItemsFooter: {
            debitQty: Signal<number>
            creditQty: Signal<number>
            debitAmount: Signal<number>
            creditAmount: Signal<number>
        }
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
    branchId: Signal<string>
    dbCr: Signal<string>
    qty: Signal<number>
    price: Signal<number>
    amount: Signal<number>
    serialNumbers: Signal<string>
    serialNumberCount: Signal<number>
    remarks: Signal<string>
}