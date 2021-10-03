import { useEffect, useRef, useState } from "react"
import { makeStyles, Theme, createStyles } from '@material-ui/core'
import { useSharedElements } from '../common/shared-elements-hook'

function useExpences() {
    const [, setRefresh] = useState({})
    const { emit, filterOn } = useSharedElements()

    const meta: any = useRef({
        isMounted: false,
        tabLabel:'Expences',
        tabValue: 0,
    })

    useEffect(() => {
        meta.current.isMounted = true

        return (() => {
            meta.current.isMounted = false
        })
    }, [])

    const arbitraryData: any = useRef({
        autoRefNo: undefined,
        cgst: 0.0,
        commonRemarks: undefined,
        gstin: undefined,
        id: undefined,
        igst: 0.0,
        isIgst: false,
        isGstInvoice: true,
        invoiceAmount: 0.0,
        ledgerSubledgerExpences: { isLedgerSubledgerError: true },
        ledgerSubledgerOther: { isLedgerSubledgerError: true },
        lineItems: [],
        cashOrCredit: 'credit',
        sgst: 0.0,
        summary: {},
        tranDate: undefined,
        userRefNo: '',
    })

    function handleOnTabChange(e: any, newValue: number) {
        meta.current.tabValue = newValue
        // if (newValue === 1) { // to refresh view
        //     emit('PURCHASE-VIEW-HOOK-FETCH-DATA', null)
        // }
        meta.current.isMounted && setRefresh({})
    }

    return { arbitraryData,handleOnTabChange, meta, setRefresh, }
}
export { useExpences, useStyles }

const useStyles: any = makeStyles((theme: Theme) =>
    createStyles({
        content: {
            '& .tabs': {
                color: theme.palette.common.white,
                backgroundColor: 'dodgerBlue',
            },

            '& .purchase-body': {
                marginTop: theme.spacing(1),
            }
        },
    })
)