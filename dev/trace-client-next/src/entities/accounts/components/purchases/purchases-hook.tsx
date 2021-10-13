import {
    _,
    moment,
    useState,
    useEffect,
    useRef,
} from '../../../../imports/regular-imports'
import {
    makeStyles,
    Theme,
    createStyles,
} from '../../../../imports/gui-imports'
import { useSharedElements } from '../common/shared-elements-hook'

function usePurchases(drillDownEditAttributes: any) {
    const [, setRefresh] = useState({})
    const isoFormat = 'YYYY-MM-DD'
    const { emit, filterOn } = useSharedElements()

    useEffect(() => {
        meta.current.isMounted = true
        if (drillDownEditAttributes && !_.isEmpty(drillDownEditAttributes)) {
            // showChildDialog is used to prevent firing of message when child dialog is being closed. Otherwise the message is fired and unnecessary loading is done
            drillDownEditAttributes.showChildDialog &&
                emit(
                    'PURCHASE-VIEW-HOOK-GET-PURCHASE-ON-ID-DRILL-DOWN-EDIT',
                    drillDownEditAttributes.tranHeaderId
                )
            arbitraryData.current.shouldCloseParentOnSave = true
        }
        const subs1 = filterOn('PURCHASES-HOOK-CHANGE-TAB').subscribe((d) => {
            meta.current.value = d.data // changes the tab. if d.data is 0 then new purchase tab is selected
            setRefresh({})
        })
        const subs2 = filterOn('PURCHASE-CLEAR-ALL').subscribe(() => {
            arbitraryData.current = JSON.parse(JSON.stringify(initData))
            meta.current.isMounted && setRefresh({})
        })
        // const subs3 = filterOn('PURCHASE-HOOK-RESET-DATA').subscribe(() => {
        //     resetData()
        // })
        return () => {
            meta.current.isMounted = false
            subs1.unsubscribe()
            subs2.unsubscribe()
            // subs3.unsubscribe()
        }
    }, [])

    const meta: any = useRef({
        isMounted: false,
        purchaseTypeLabel: '',
        value: 0,
    })

    const initData = {
        autoRefNo: undefined,
        cgst: 0.0,
        commonRemarks: undefined,
        deletedSalePurchaseIds: [],
        // extGstTranDId: undefined,
        gstin: undefined,
        id: undefined,
        igst: 0.0,
        isIgst: false,
        isGstInvoice: true,
        ledgerSubledgerPurchase: { isLedgerSubledgerError: true },
        ledgerSubledgerOther: { isLedgerSubledgerError: true },
        invoiceAmount: 0.0,
        lineItems: [],
        purchaseCashCredit: 'credit',
        qty: 0,
        sgst: 0.0,
        summary: {},
        tranDate: undefined,
        userRefNo: '',
        isViewBack: false,
    }
    const arbitraryData: any = useRef(JSON.parse(JSON.stringify(initData)))


    // function resetData() {
    //     // const ad = arbitraryData.current
    //     // Object.assign(ad,initData)
    //     arbitraryData.current = initData
    //     // Object.assign(arbitraryData.current, initData)
    // }

    function handleOnTabChange(e: any, newValue: number) {
        meta.current.value = newValue
        if (newValue === 1) {
            // to refresh view
            emit('PURCHASE-VIEW-HOOK-FETCH-DATA', null)
        }
        meta.current.isMounted && setRefresh({})
    }

    return { arbitraryData, handleOnTabChange, meta }
}

export { usePurchases }

const useStyles: any = makeStyles((theme: Theme) =>
    createStyles({
        content: {
            // marginTop: theme.spacing(2),
            '& .tabs': {
                color: ({ purchaseType }: any) =>
                    purchaseType === 'pur'
                        ? theme.palette.common.white
                        : theme.palette.blue.dark, // theme.palette.common.white,
                backgroundColor: ({ purchaseType }: any) =>
                    purchaseType === 'pur'
                        ? 'dodgerBlue'
                        : theme.palette.warning.dark,
            },

            '& .purchase-body': {
                marginTop: theme.spacing(1),
            },
        },
    })
)

export { useStyles }
