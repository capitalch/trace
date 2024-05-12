import { BranchTransferStore } from "../../../stores/branch-transfer-store"

export function useBranchTransfer() {
    function handleOnChangeTab(e: any, newValue: number) {
        BranchTransferStore.tabValue.value = newValue
    }
    return ({ handleOnChangeTab })
}