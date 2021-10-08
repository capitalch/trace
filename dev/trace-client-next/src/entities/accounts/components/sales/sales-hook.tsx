import {_, useState, useEffect, useRef } from '../../../../imports/regular-imports'
import { makeStyles, Theme, createStyles } from '../../../../imports/gui-imports'
import { useSharedElements } from '../common/shared-elements-hook'

function useSales(saleType: string, drillDownEditAttributes: any) {
    const [, setRefresh] = useState({})
    const isoDateFormat = 'YYYY-MM-DD'
    const {
        _,
        emit,
        filterOn,
        getFromBag,
        moment,
    } = useSharedElements()

    useEffect(() => {
        meta.current.isMounted = true
        setAccounts()
        if (drillDownEditAttributes && (!_.isEmpty(drillDownEditAttributes))) {
            // showChildDialog is used to prevent firing of message when child dialog is being closed. Otherwise the message is fired and unnecessary loading is done
            drillDownEditAttributes.showChildDialog && emit('SALE-VIEW-HOOK-GET-SALE-ON-ID', drillDownEditAttributes.tranHeaderId)
            arbitraryData.current.shouldCloseParentOnSave = true
        }

        const subs1 = filterOn('CHANGE-TAB-SALES').subscribe((d) => {
            meta.current.tabValue = d.data // changes the tab. if d.data is 0 then new purchase tab is selected
            setRefresh({})
        })

        return () => {
            meta.current.isMounted = false
            subs1.unsubscribe()
        }
    }, [])

    const meta: any = useRef({
        isMounted: false,
        saleTypeLabel: 'Sale',
        showDialog: false,
        tabValue: 0,
        dialogConfig: {
            title: '',
            content: () => { },
            actions: () => { },
        },
    })

    const arbitraryData: any = useRef({
        accounts: {
            cashBankAccountsWithLedgers: [],
            cashBankAccountsWithSubledgers: [],
            debtorCreditorAccountsWithLedgers: [],
            debtorCreditorAccountsWithSubledgers: [],
            autoSubledgerAccounts: [],
        },

        allAccounts: [],
        autoRefNo: undefined,
        backCalulateAmount: 0.0,
        billTo: {
            id: undefined
        },

        commonRemarks: undefined,
        deletedSalePurchaseIds: [],
        footer: {
            items: [], // for TranD table
            deletedIds: [],
        },
        id: undefined,
        isIgst: false,
        isSalesReturn: saleType === 'ret',
        isSales: saleType === 'sal',
        ledgerAccounts: [],
        lineItems: [], // for product details of SalePurchaseDetails table
        rowData: {},

        saleErrorMethods: {
            headError: () => false,
            itemsError: () => false,
            footerError: () => false,
            errorMethods: {
                getSlNoError: () => false,
            }
        },

        saleErrorObject: {},

        saleVariety: 'r',
        shipTo: {},
        summary: {},
        totalCredits: 0.0,
        totalDebits: 0.0,
        tranDate: moment().format(isoDateFormat),
    })

    function handleChange(e: any, newValue: number) {
        meta.current.tabValue = newValue
        if (newValue === 3) { // view
            emit('SALE-VIEW-HOOK-FETCH-DATA', null)
        }
        meta.current.isMounted && setRefresh({})
    }

    function setAccounts() {
        //saleAccounts
        const allAccounts = getFromBag('allAccounts') || []
        arbitraryData.current.allAccounts = allAccounts
        const saleAccounts = allAccounts.filter(
            (el: any) =>
                ['sale'].includes(el.accClass) &&
                (el.accLeaf === 'Y' || el.accLeaf === 'L')
        )
        arbitraryData.current.ledgerAccounts = saleAccounts

        // Cash bank accounts
        const cashBankArray = ['cash', 'bank', 'card', 'ecash']
        const cashBankAccountsWithLedgers = allAccounts.filter(
            (el: any) =>
                cashBankArray.includes(el.accClass) &&
                (el.accLeaf === 'Y' || el.accLeaf === 'L')
        )
        arbitraryData.current.accounts.cashBankAccountsWithLedgers = cashBankAccountsWithLedgers

        const cashBankAccountsWithSubledgers = allAccounts.filter(
            (el: any) =>
                cashBankArray.includes(el.accClass) &&
                (el.accLeaf === 'Y' || el.accLeaf === 'S')
        )
        arbitraryData.current.accounts.cashBankAccountsWithSubledgers = cashBankAccountsWithSubledgers
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
        arbitraryData.current.accounts.debtorCreditorAccountsWithLedgers = debtorCreditorAccountsWithLedgers
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
        arbitraryData.current.accounts.debtorCreditorAccountsWithSubledgers = debtorCreditorAccountsWithSubledgers
        // auto subledger accounts
        const autoSubledgerAccounts = allAccounts.filter(
            (el: any) =>
                ['debtor'].includes(el.accClass) &&
                (el.accLeaf === 'Y' || el.accLeaf === 'L') &&
                el.isAutoSubledger
        )
        arbitraryData.current.accounts.autoSubledgerAccounts = autoSubledgerAccounts
    }

    return { arbitraryData, handleChange, meta }
}

export { useSales }

const useStyles: any = makeStyles((theme: Theme) =>
    createStyles({
        content: {
            '& .tabs': {
                backgroundColor: 'dodgerBlue',
                color: theme.palette.common.white,
                marginTop: theme.spacing(0.5),
            },
        },
    })
)

export { useStyles }
