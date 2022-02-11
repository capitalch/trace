import {
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

function useGeneralLedger(getArtifacts: any) {
    const [, setRefresh] = useState({})

    const {
        emit,
        filterOn,
        getFromBag,
    } = useSharedElements()

    useEffect(() => {
        const curr = meta.current
        curr.isMounted = true
        curr.allAccounts = (getFromBag('allAccounts') || []).map(
            (item: any) => ({
                label: item.accName,
                value: item.id,
                ...item,
            })
        )
        curr.ledgerAccounts = curr.allAccounts
            .filter((el: any) => el.accLeaf === 'Y' || el.accLeaf === 'L')
            .map((el: any) => {
                return {
                    label: el.accName,
                    value: el.id,
                    accLeaf: el.accLeaf,
                    subledgers: el.accLeaf === 'L' ? [] : null,
                }
            })
        const subs1 = filterOn('ROOT-WINDOW-REFRESH').subscribe(() => {
            emit(
                getArtifacts().gridActionMessages.fetchIbukiMessage,
                curr.sqlQueryArgs
            )
        })
        setRefresh({})
        return () => {
            curr.isMounted = false
            subs1.unsubscribe()
        }
    }, [])

    const meta: any = useRef({
        accId: 0,
        allAccounts: [],
        data: [],
        dateFormat: getFromBag('dateFormat'),
        ledgerAccounts: [],
        isDailySummary: false,
        isMounted: false,
        isReverseOrder: false,
        sharedData : {},
        showDialog: false,
        showLedgerDialog: false,
        transactions: [],
        ledgerSubledger: {},
        sqlQueryArgs: null,
        dialogConfig: {
            title: '',
            ledgerViewTitle:'',
            content: () => {},
            actions: () => {},
        },
    })

    function handleLedgerDialogClose(){
        meta.current.showLedgerDialog = false
        setRefresh({})
    }

    function handleLedgerPreview(){
        meta.current.showLedgerDialog = true
        setRefresh({})
    }

    return {handleLedgerDialogClose,handleLedgerPreview, meta }
}

export { useGeneralLedger }

const useStyles: any = makeStyles((theme: Theme) =>
    createStyles({
        content: {
            '& .header': {
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: theme.spacing(4),
                '& .heading': {
                    fontWeight: 'bold',
                },
                '& .expand': {
                    position: 'relative',
                    top: '.2rem',
                },
                '& .select-ledger': {
                    marginTop: theme.spacing(2),
                    display: 'flex',
                    flexDirection: 'column',
                    '& .ledger-subledger': {
                        position: 'relative',
                    },
                },
            },
            '& .data-grid': {
                height: 'calc(100vh - 303px)',
            },
        },
        previewTitle: {
            display: 'flex',
            flexDirection:'row',
            justifyContent:'space-between'
        }
    })
)

export { useStyles }
