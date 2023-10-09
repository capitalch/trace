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
import { utilMethods } from '../../../../imports/trace-imports'
import { useSharedElements } from '../common/shared-elements-hook'
// import { GeneralLedgerPdf } from './general-ledger-pdf'
import { PdfLedger } from '../pdf/ledgers/pdf-ledger'

function useGeneralLedger(getArtifacts: any) {
    const [, setRefresh] = useState({})
    // const { showPdf } = utilMethods()
    const { emit, filterOn, getFromBag, PDFViewer } = useSharedElements()

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
        isDailySummary: false,
        isMounted: false,
        isReverseOrder: false,
        sharedData: {},
        showDialog: false,
        showLedgerDialog: false,
        transactions: [],
        ledgerSubledger: {},
        sqlQueryArgs: null,
        setRefresh: setRefresh,
        dialogConfig: {
            title: 'Ledger view',
            content: () => <></>,
            fullWidth:false,
        },
    })

    function handleLedgerDialogClose() {
        meta.current.showLedgerDialog = false
        setRefresh({})
    }

    function handleLedgerPreview() {
        meta.current.showDialog = true
        meta.current.dialogConfig.content = () => (
            <PDFViewer showToolbar={true} width={840} height={600}>
                <PdfLedger
                    ledgerData={meta.current.sharedData.filteredRows || []}
                    accName={meta.current.accName}
                />
            </PDFViewer>
        )
        setRefresh({})

    }
    return { handleLedgerDialogClose, handleLedgerPreview, meta }
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
                marginBottom: theme.spacing(1),
                '& .heading': {
                    fontWeight: 'bold',
                },
                '& .expand': {
                    position: 'relative',
                    top: '.2rem',
                },
                '& .select-ledger': {
                    // marginTop: theme.spacing(1),
                    display: 'flex',
                    flexDirection: 'column',
                    '& .ledger-subledger': {
                        position: 'relative',
                    },
                },
            },
            '& .data-grid': {
                height: 'calc(100vh - 253px)',
            },
        },
        previewTitle: {
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
        },
    })
)

export { useStyles }
