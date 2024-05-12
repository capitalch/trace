import { Signal, signal } from "@preact/signals-react"
import _ from 'lodash'

const BranchTransferStoreT: BranchTransferStoreType = {
    tabValue: signal(0)
}

let branchTransferStore: BranchTransferStoreType = _.cloneDeep(BranchTransferStoreT)

export { branchTransferStore }

type BranchTransferStoreType = {
    tabValue: Signal<number>,
}