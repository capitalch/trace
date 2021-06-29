import { useState, useEffect, useRef } from 'react'
import { makeStyles, Theme, createStyles } from '@material-ui/core'
import { useSharedElements } from '../common/shared-elements-hook'

function usePurchases() {
    const [, setRefresh] = useState({})
    const isoFormat = 'YYYY-MM-DD'
    const { emit, filterOn, moment, } = useSharedElements()
    useEffect(() => {
        meta.current.isMounted = true
        const subs1 = filterOn('CHANGE-TAB-PURCHASES').subscribe((d) => {
            meta.current.value = d.data // changes the tab. if d.data is 0 then new purchase tab is selected
            setRefresh({})
        })
        const subs2 = filterOn('PURCHASE-CLEAR-ALL').subscribe(() => {            
            arbitraryData.current = JSON.parse(JSON.stringify(initData))
            meta.current.isMounted && setRefresh({})
        })
        // subs1.add(subs2)
        return () => {
            meta.current.isMounted = false
            subs1.unsubscribe()
            subs2.unsubscribe()
        }
    }, [])

    const meta: any = useRef({
        isMounted: false,
        purchaseTypeLabel: '',
        value: 0,
    })

    const initData = {
        autoRefNo: undefined,
        cgst: 0.0,
        commonRemarks: undefined,
        deletedSalePurchaseIds: [],
        gstin: undefined,
        id: undefined,
        igst: 0.0,
        isIgst: false,
        isGstInvoice: true,
        ledgerSubledgerPurchase: { isLedgerSubledgerError: true },
        ledgerSubledgerOther: { isLedgerSubledgerError: true },
        invoiceAmount: 0.0,
        lineItems: [],
        purchaseCashCredit: 'credit',
        qty: 0,
        sgst: 0.0,
        summary: {},
        tranDate: undefined, //moment().format(isoFormat),
        userRefNo: '',
    }
    const arbitraryData: any = useRef(JSON.parse(JSON.stringify(initData)))
    const ad = arbitraryData.current

    function handleOnTabChange(e: any, newValue: number) {
        meta.current.value = newValue
        if (newValue === 1) { // to refresh view
            emit('PURCHASE-VIEW-HOOK-FETCH-DATA', null)
        }
        meta.current.isMounted && setRefresh({})
    }

    return { arbitraryData, handleOnTabChange, meta }
}

export { usePurchases }

const useStyles: any = makeStyles((theme: Theme) =>
    createStyles({
        content: {
            // marginTop: theme.spacing(2),
            '& .tabs': {
                color: ({ purchaseType }: any) => (purchaseType === 'pur') ? theme.palette.common.white : theme.palette.blue.dark,// theme.palette.common.white,
                backgroundColor: ({ purchaseType }: any) => (purchaseType === 'pur') ? 'dodgerBlue' : theme.palette.warning.dark,
            },

            '& .purchase-body': {
                marginTop: theme.spacing(1),
            }
        },
    })
)

export { useStyles }
