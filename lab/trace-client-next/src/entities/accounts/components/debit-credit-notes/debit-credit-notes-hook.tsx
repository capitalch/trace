import {
    _,
    useState,
    useEffect,
    useRef,
} from '../../../../imports/regular-imports'
import {
    makeStyles,
    Theme,
    createStyles,
} from '../../../../imports/gui-imports'
import { useIbuki } from '../../../../imports/trace-imports'

function useDebitCreditNotes(drillDownEditAttributes: any = {}) {
    const [, setRefresh] = useState({})
    const { emit, filterOn } = useIbuki()
    const meta: any = useRef({
        isMounted: false,
        setRefresh: setRefresh,
        value: 0,
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
            meta.current.shouldCloseParentOnSave = true
        }
        return () => {
            meta.current.isMounted = false
        }
    }, [])

    useEffect(() => {
        const subs1 = filterOn('DEBIT-CREDIT-NOTES-HOOK-CHANGE-TAB').subscribe(
            (d: any) => {
                handleOnChange(null, d.data)
            }
        )
        return () => {
            subs1.unsubscribe()
        }
    }, [])

    function handleOnChange(e: any, newValue: number) {
        meta.current.value = newValue
        if (newValue === 1) {
            emit('DEBIT-CREDIT-NOTES-VIEW-HOOK-FETCH-DATA', null)
        }
        meta.current.isMounted && setRefresh({})
    }

    return { handleOnChange, meta }
}

export { useDebitCreditNotes }

const useStyles: any = makeStyles((theme: Theme) =>
    createStyles({
        content: {
            '& .tabs': {
                color: theme.palette.common.white,
                backgroundColor: 'dodgerBlue',
                marginTop: theme.spacing(0.5),
            },
        },
    })
)

export { useStyles }
