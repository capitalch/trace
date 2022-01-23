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
            multiData.purchases.tabValue = d.data // changes the tab. if d.data is 0 then new purchase tab is selected
            setRefresh({})
        })
        const subs2 = filterOn('DRAWER-STATUS-CHANGED').subscribe(() => {
            setInBag('purchasesData', multiData.purchases)
        })

        return () => {
            meta.current.isMounted = false
            subs1.unsubscribe()
            subs2.unsubscribe()
        }
    }, [])

    const meta: any = useRef({
        isMounted: false,
        purchaseTypeLabel: '',
    })

    const purchasesData = getFromBag('purchasesData')
    if (purchasesData) {
        multiData.purchases = purchasesData
        setInBag('purchasesData', undefined)
    }

    function handleOnTabChange(e: any, newValue: number) {
        multiData.purchases.tabValue = newValue
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
            '& .tabs': {
                backgroundColor: theme.palette.grey[200],
                color: theme.palette.primary.dark,
                marginTop: theme.spacing(0.5),

                '& .reset':{
                    backgroundColor: theme.palette.blue.main,
                    color: theme.palette.getContrastText(theme.palette.blue.main),
                    height: theme.spacing(4),
                    margin:'auto',
                }
            },
            '& .purchase-body': {
                marginTop: theme.spacing(1),
            },
        },
    })
)

export { useStyles }
