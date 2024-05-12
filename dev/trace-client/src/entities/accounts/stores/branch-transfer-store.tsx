import { Signal, signal } from "@preact/signals-react"
import _ from 'lodash'
import moment from "moment"

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
        }
    }
}

let BranchTransferStore: BranchTransferStoreType = _.cloneDeep(BranchTransferStoreT)

export { BranchTransferStore }

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
        }
    }
}

type ErrorType = () => string