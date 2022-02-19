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

function useSales(saleType: string, drillDownEditAttributes: any) {
    const [, setRefresh] = useState({})
    const multiData: any = useContext(MultiDataContext)
    multiData.sales.saleType = saleType
    const { emit, filterOn, getFromBag, setInBag } = useSharedElements()

    useEffect(() => {
        const curr = meta.current
        curr.isMounted = true
        setAccounts()
        if (drillDownEditAttributes && !_.isEmpty(drillDownEditAttributes)) {
            // showChildDialog is used to prevent firing of message when child dialog is being closed. Otherwise the message is fired and unnecessary loading is done
            drillDownEditAttributes.showChildDialog &&
                emit(
                    'SALE-VIEW-HOOK-GET-SALE-ON-ID',
                    drillDownEditAttributes.tranHeaderId
                )
            multiData.sales.shouldCloseParentOnSave = true
        }

        const subs1 = filterOn('SALES-HOOK-CHANGE-TAB').subscribe((d: any) => {            
            multiData.sales.tabValue = d.data
            setRefresh({})
        })

        const subs2 = filterOn('DRAWER-STATUS-CHANGED').subscribe(() => {
            setInBag('salesData', multiData.sales)
        })

        const subs3 = filterOn('TRACE-SERVER-ACCOUNT-ADDED-OR-UPDATED').subscribe(()=>{
            setAccounts()
            setRefresh({})
        })

        return () => {
            curr.isMounted = false
            subs1.unsubscribe()
            subs2.unsubscribe()
            subs3.unsubscribe()
        }
    }, [])

    const meta: any = useRef({
        isMounted: false,
        saleTypeLabel: 'Sale',
        showDialog: false,
        dialogConfig: {
            title: '',
            content: () => {},
            actions: () => {},
        },
    })

    const salesData = getFromBag('salesData')
    if (salesData) {
        multiData.sales = salesData
        setInBag('salesData', undefined)
    }

    function handleChangeTab(e: any, newValue: number) {
        multiData.sales.tabValue = newValue
        if (newValue === 3) {
            // view
            multiData.sales.saleViewHookFetchData()
        } else {
            multiData.sales.salesCrownRefresh()
        }
        meta.current.isMounted && setRefresh({})
    }

    function setAccounts() {
        //saleAccounts
        const allAccounts = getFromBag('allAccounts') || []
        multiData.sales.allAccounts = allAccounts
        const saleAccounts = allAccounts.filter(
            (el: any) =>
                ['sale'].includes(el.accClass) &&
                (el.accLeaf === 'Y' || el.accLeaf === 'L')
        )
        multiData.sales.ledgerAccounts = saleAccounts

        // Cash bank accounts
        const cashBankArray = ['cash', 'bank', 'card', 'ecash']
        const cashBankAccountsWithLedgers = allAccounts.filter(
            (el: any) =>
                cashBankArray.includes(el.accClass) &&
                (el.accLeaf === 'Y' || el.accLeaf === 'L')
        )
        multiData.sales.accounts.cashBankAccountsWithLedgers =
            cashBankAccountsWithLedgers

        const cashBankAccountsWithSubledgers = allAccounts.filter(
            (el: any) =>
                cashBankArray.includes(el.accClass) &&
                (el.accLeaf === 'Y' || el.accLeaf === 'S')
        )
        multiData.sales.accounts.cashBankAccountsWithSubledgers =
            cashBankAccountsWithSubledgers
        // Debtors creditors accounts
        const debtorCreditorAccountsWithLedgers = allAccounts
            .filter(
                (el: any) =>
                    ['debtor', 'creditor'].includes(el.accClass) &&
                    (el.accLeaf === 'Y' || el.accLeaf === 'L') &&
                    !el.isAutoSubledger
            )
            .sort((a: any, b: any) => {
                if (a.accName > b.accName) return 1
                if (a.accName < b.accName) return -1
                return 0
            })
        multiData.sales.accounts.debtorCreditorAccountsWithLedgers =
            debtorCreditorAccountsWithLedgers
        const debtorCreditorAccountsWithSubledgers = allAccounts
            .filter(
                (el: any) =>
                    ['debtor', 'creditor'].includes(el.accClass) &&
                    (el.accLeaf === 'Y' || el.accLeaf === 'S') &&
                    !el.isAutoSubledger
            )
            .sort((a: any, b: any) => {
                if (a.accName > b.accName) return 1
                if (a.accName < b.accName) return -1
                return 0
            })
        multiData.sales.accounts.debtorCreditorAccountsWithSubledgers =
            debtorCreditorAccountsWithSubledgers
        // auto subledger accounts
        const autoSubledgerAccounts = allAccounts.filter(
            (el: any) =>
                ['debtor'].includes(el.accClass) &&
                (el.accLeaf === 'Y' || el.accLeaf === 'L') &&
                el.isAutoSubledger
        )
        multiData.sales.accounts.autoSubledgerAccounts = autoSubledgerAccounts
    }

    return { multiData, handleChangeTab, meta }
}

export { useSales }

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
        },
    })
)

export { useStyles }

