import { useState, useEffect, useRef, useContext } from 'react'
import { makeStyles, Theme, createStyles } from '@material-ui/core'
import { useSharedElements } from '../common/shared-elements-hook'
import _ from 'lodash'
import { MultiDataContext } from '../common/multi-data-context'
import { getSalesArbitraryData } from '../common/arbitrary-data'

function useSales(saleType: string, drillDownEditAttributes: any) {
    const [, setRefresh] = useState({})
    const isoDateFormat = 'YYYY-MM-DD'
    const multiData: any = useContext(MultiDataContext)
    const {
        _,
        emit,
        filterOn,
        getFromBag,
        setInBag,
        moment,
    } = useSharedElements()

    useEffect(() => {
        meta.current.isMounted = true
        setAccounts()
        if (drillDownEditAttributes && (!_.isEmpty(drillDownEditAttributes))) {
            // showChildDialog is used to prevent firing of message when child dialog is being closed. Otherwise the message is fired and unnecessary loading is done
            drillDownEditAttributes.showChildDialog && emit('SALE-VIEW-HOOK-GET-SALE-ON-ID', drillDownEditAttributes.tranHeaderId)
            multiData.sales.shouldCloseParentOnSave = true
        }

        const subs1 = filterOn('CHANGE-TAB-SALES').subscribe((d) => {
            meta.current.tabValue = d.data // changes the tab. if d.data is 0 then new purchase tab is selected
            setRefresh({})
        })

        const subs2 = filterOn('DRAWYER-STATUS-CHANGED').subscribe(()=>{
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
        tabValue: 0,
        dialogConfig: {
            title: '',
            content: () => { },
            actions: () => { },
        },
    })

    const salesData  = getFromBag('salesData')
    if(salesData){
        multiData.sales = salesData
        setInBag('salesData', undefined)
    }

    // multiData.sales = getSalesArbitraryData(saleType)
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
    //         id: undefined
    //     },

    //     commonRemarks: undefined,
    //     deletedSalePurchaseIds: [],
    //     footer: {
    //         items: [], // for TranD table
    //         deletedIds: [],
    //     },
    //     id: undefined,
    //     isIgst: false,
    //     isSalesReturn: saleType === 'ret',
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
    //         }
    //     },

    //     saleErrorObject: {},

    //     saleVariety: 'r',
    //     shipTo: {},
    //     summary: {},
    //     totalCredits: 0.0,
    //     totalDebits: 0.0,
    //     tranDate: moment().format(isoDateFormat),
    // })

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
        multiData.sales.accounts.cashBankAccountsWithLedgers = cashBankAccountsWithLedgers

        const cashBankAccountsWithSubledgers = allAccounts.filter(
            (el: any) =>
                cashBankArray.includes(el.accClass) &&
                (el.accLeaf === 'Y' || el.accLeaf === 'S')
        )
        multiData.sales.accounts.cashBankAccountsWithSubledgers = cashBankAccountsWithSubledgers
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
        multiData.sales.accounts.debtorCreditorAccountsWithLedgers = debtorCreditorAccountsWithLedgers
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
        multiData.sales.accounts.debtorCreditorAccountsWithSubledgers = debtorCreditorAccountsWithSubledgers
        // auto subledger accounts
        const autoSubledgerAccounts = allAccounts.filter(
            (el: any) =>
                ['debtor'].includes(el.accClass) &&
                (el.accLeaf === 'Y' || el.accLeaf === 'L') &&
                el.isAutoSubledger
        )
        multiData.sales.accounts.autoSubledgerAccounts = autoSubledgerAccounts
    }

    return { multiData, handleChange, meta }
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
