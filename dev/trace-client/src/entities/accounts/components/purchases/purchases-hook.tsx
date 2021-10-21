import {
    _,
    useContext,
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
import { MultiDataContext } from '../common/multi-data-bridge'

function usePurchases(drillDownEditAttributes: any) {
    const [, setRefresh] = useState({})
    const isoFormat = 'YYYY-MM-DD'
    const { emit, filterOn, getFromBag, setInBag } = useSharedElements()
    const multiData: any = useContext(MultiDataContext)
    useEffect(() => {
        meta.current.isMounted = true
        if (drillDownEditAttributes && !_.isEmpty(drillDownEditAttributes)) {
            // showChildDialog is used to prevent firing of message when child dialog is being closed. Otherwise the message is fired and unnecessary loading is done
            drillDownEditAttributes.showChildDialog &&
                emit(
                    'PURCHASE-VIEW-HOOK-GET-PURCHASE-ON-ID-DRILL-DOWN-EDIT',
                    drillDownEditAttributes.tranHeaderId
                )
            multiData.purchases.shouldCloseParentOnSave = true
        }
        const subs1 = filterOn('PURCHASES-HOOK-CHANGE-TAB').subscribe((d) => {
            meta.current.value = d.data // changes the tab. if d.data is 0 then new purchase tab is selected
            setRefresh({})
        })
        const subs2 = filterOn('PURCHASE-CLEAR-ALL').subscribe(() => {
            // arbitraryData.current = JSON.parse(JSON.stringify(initData))
            // meta.current.isMounted && setRefresh({})
        })
        const subs3 = filterOn('DRAWER-STATUS-CHANGED').subscribe(() => {
            setInBag('purchasesData', multiData.purchases)
        })

        return () => {
            meta.current.isMounted = false
            subs1.unsubscribe()
            subs2.unsubscribe()
            subs3.unsubscribe()
        }
    }, [])

    const meta: any = useRef({
        isMounted: false,
        purchaseTypeLabel: '',
        value: 0,
    })

    const purchasesData = getFromBag('purchasesData')
    if (purchasesData) {
        multiData.purchases = purchasesData
        setInBag('purchasesData', undefined)
    }

    // const initData = {
    //     autoRefNo: undefined,
    //     cgst: 0.0,
    //     commonRemarks: undefined,
    //     deletedSalePurchaseIds: [],
    //     gstin: undefined,
    //     id: undefined,
    //     igst: 0.0,
    //     isIgst: false,
    //     isGstInvoice: true,
    //     ledgerSubledgerPurchase: { isLedgerSubledgerError: true },
    //     ledgerSubledgerOther: { isLedgerSubledgerError: true },
    //     invoiceAmount: 0.0,
    //     lineItems: [],
    //     purchaseCashCredit: 'credit',
    //     qty: 0,
    //     sgst: 0.0,
    //     summary: {},
    //     tranDate: undefined,
    //     userRefNo: '',
    //     isViewBack: false,
    // }
    // const arbitraryData: any = useRef(JSON.parse(JSON.stringify(initData)))

    function handleOnTabChange(e: any, newValue: number) {
        meta.current.value = newValue
        if (newValue === 1) {
            // to refresh view
            emit('PURCHASE-VIEW-HOOK-FETCH-DATA', null)
        }
        meta.current.isMounted && setRefresh({})
    }

    return { multiData, handleOnTabChange, meta }
}

export { usePurchases }

const useStyles: any = makeStyles((theme: Theme) =>
    createStyles({
        content: {
            // marginTop: theme.spacing(2),
            '& .tabs': {
                backgroundColor: 'dodgerBlue',
                color: theme.palette.common.white,
                marginTop: theme.spacing(0.5),
                // color: ({ purchaseType }: any) =>
                //     purchaseType === 'pur'
                //         ? theme.palette.common.white
                //         : theme.palette.blue.dark, // theme.palette.common.white,
                // backgroundColor: ({ purchaseType }: any) =>
                //     purchaseType === 'pur'
                //         ? 'dodgerBlue'
                //         : theme.palette.warning.dark,
            },

            '& .purchase-body': {
                marginTop: theme.spacing(1),
            },
        },
    })
)

export { useStyles }
