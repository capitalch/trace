import {
    _,
    moment,
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
    const isoDateFormat = 'YYYY-MM-DD'
    const multiData: any = useContext(MultiDataContext)
    multiData.sales.saleType = saleType
    const { emit, filterOn, getFromBag, setInBag } = useSharedElements()

    useEffect(() => {
        meta.current.isMounted = true
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

        return () => {
            meta.current.isMounted = false
            subs1.unsubscribe()
            subs2.unsubscribe()
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
                backgroundColor: 'dodgerBlue',
                color: theme.palette.common.white,
                marginTop: theme.spacing(0.5),
                '& .reset':{
                    backgroundColor: theme.palette.amber.main,
                    color: theme.palette.amber.contrastText,
                    height: theme.spacing(4),
                    margin:'auto',
                    // marginRight: '20%'
                }
            },
        },
    })
)

export { useStyles }


    // const arbitraryData: any = useRef({
    //     accounts: {
    //         cashBankAccountsWithLedgers: [],
    //         cashBankAccountsWithSubledgers: [],
    //         debtorCreditorAccountsWithLedgers: [],
    //         debtorCreditorAccountsWithSubledgers: [],
    //         autoSubledgerAccounts: [],
    //     },

    //     allAccounts: [],
    //     autoRefNo: undefined,
    //     backCalulateAmount: 0.0,
    //     billTo: {
    //         id: undefined,
    //     },

    //     commonRemarks: undefined,
    //     deletedSalePurchaseIds: [],
    //     footer: {
    //         items: [], // for TranD table
    //         deletedIds: [],
    //         amount: 0,
    //     },
    //     id: undefined,
    //     isIgst: false,
    //     isAssignmentReturn: saleType === 'ret',
    //     isSales: saleType === 'sal',
    //     ledgerAccounts: [],
    //     lineItems: [], // for product details of SalePurchaseDetails table
    //     rowData: {},

    //     saleErrorMethods: {
    //         headError: () => false,
    //         itemsError: () => false,
    //         footerError: () => false,
    //         errorMethods: {
    //             getSlNoError: () => false,
    //         },
    //     },

    //     saleErrorObject: {},

    //     saleVariety: 'r',
    //     shipTo: {},
    //     summary: {},
    //     totalCredits: 0.0,
    //     totalDebits: 0.0,
    //     tranDate: moment().format(isoDateFormat),
    //     isViewBack: false,
    // })