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
import { MultiDataContext } from '../common/multi-data-bridge'
import {useSharedElements} from '../common/shared-elements-hook'

function useDebitCreditNotes(drillDownEditAttributes: any = {}) {
    const [, setRefresh] = useState({})
    const { emit, filterOn, getFromBag, setInBag } = useSharedElements()
    const multiData: any = useContext(MultiDataContext)
    const meta: any = useRef({
        isMounted: false,
        setRefresh: setRefresh,
    })
    useEffect(() => {
        meta.current.isMounted = true
        if (drillDownEditAttributes && !_.isEmpty(drillDownEditAttributes)) {
            // showChildDialog is used to prevent firing of message when child dialog is being closed. Otherwise the message is fired and unnecessary loading is done
            drillDownEditAttributes.showChildDialog &&
                emit(
                    'DEBIT-CREDIT-NOTES-FETCH-DATA-ON-ID-DRILL-DOWN-EDIT',
                    drillDownEditAttributes.tranHeaderId
                )
            // meta.current.shouldCloseParentOnSave = true
            multiData.debitCreditNotes.shouldCloseParentOnSave = true
        }
        return () => {
            meta.current.isMounted = false
        }
    }, [])

    useEffect(() => {
        const subs1 = filterOn('DEBIT-CREDIT-NOTES-HOOK-CHANGE-TAB').subscribe(
            (d: any) => {
                handleOnTabChange(null, d.data)
            }
        )
        const subs2 = filterOn('DRAWER-STATUS-CHANGED').subscribe(() => {
            setInBag('debitCreditNotesData', multiData.debitCreditNotes)
        })
        return () => {
            subs1.unsubscribe()
            subs2.unsubscribe()
        }
    }, [])
    const debitCreditNotesData = getFromBag('debitCreditNotesData')
    if(debitCreditNotesData){
        multiData.debitCreditNotes = debitCreditNotesData
        setInBag('debitCreditNotesData', undefined)
    }
    function handleOnTabChange(e: any, newValue: number) {
        // meta.current.value = newValue
        multiData.debitCreditNotes.tabValue = newValue
        if (newValue === 1) {
            emit('DEBIT-CREDIT-NOTES-VIEW-HOOK-FETCH-DATA', null)
        }
        meta.current.isMounted && setRefresh({})
    }

    return { handleOnTabChange, meta, multiData }
}

export { useDebitCreditNotes }

const useStyles: any = makeStyles((theme: Theme) =>
    createStyles({
        content: {
            '& .tabs': {
                color: theme.palette.primary.dark,
                backgroundColor: theme.palette.grey[200],
                marginTop: theme.spacing(0.5),
                '& .reset':{
                    backgroundColor: theme.palette.blue.main,
                    color: theme.palette.getContrastText(theme.palette.blue.main),
                    height: theme.spacing(4),
                    margin:'auto',
                }
            },
        },
    })
)

export { useStyles }
