import { useState, useEffect, useRef } from 'react'
import { makeStyles, createStyles } from '@material-ui/core'
import { useSharedElements } from './shared-elements-hook'

function useDebitCreditNotesView(arbitraryData: any, tranType: string) {
    const [, setRefresh] = useState({})
    const { emit, execGenericView,filterOn, getFromBag, moment } = useSharedElements()
    useEffect(() => {
        meta.current.isMounted = true
        getData()
        setRefresh({})
        const subs1 = filterOn('DEBIT-CREDIT-NOTES-VIEW-HOOK-LOAD-DATA').subscribe((d:any)=>{
            loadData(d.data)
        })
        return () => {
            meta.current.isMounted = false
            subs1.unsubscribe()
        }
    }, [])

    const meta: any = useRef({
        isMounted: false,
        title: tranType === 'dn' ? 'Debit notes' : 'Credit notes',
        no: 10,
    })

    

    async function getData() {
        emit('SHOW-LOADING-INDICATOR', true)
        const label = tranType==='dn' ? 'debitNotesTran' : 'creditNotesTran'
        let no = getFromBag(label)
        no = no ?? meta.current.no
        const ret = await execGenericView({
            isMultipleRows: true,
            sqlKey: 'get_all_debit_credit_notes',
            args: {
                tranTypeId: tranType === 'dn' ? 7 : 8,
                no: no || null,
            },
        })
        emit('SHOW-LOADING-INDICATOR', false)
        if (ret) {
            let index = 1
            for (let item of ret) {
                item.index = index++
            }
            meta.current.data = ret
            meta.current.isMounted && setRefresh({})
        }
    }

    async function loadData(id: number) {
        emit('SHOW-LOADING-INDICATOR', true)
        const ret = await execGenericView({
            isMultipleRows: false,
            sqlKey: 'getJson_debit_credit_note',
            args: {
                id: id,
            },
        })
        emit('SHOW-LOADING-INDICATOR', false)
        const isoDateFormat = 'YYYY-MM-DD'
        const ah = arbitraryData.body
        if (ret) {
            ah.autoRefNo = ret.autoRefNo
            ah.id = ret.id
            ah.tranDate = moment(ret.tranDate).format(isoDateFormat)
            ah.commonRemarks = ret?.remarks
            ah.userRefNo = ret?.userRefNo
            ah.amount = ret?.debits[0]?.amount
            ah.ledgerSubledgerCredit = {
                accId: ret?.credits[0]?.accId,
            }
            ah.ledgerSubledgerDebit = {
                accId: ret?.debits[0]?.accId,
            }
            ah.lineRefNoDebit = ret?.debits[0]?.lineRefNo
            ah.lineRefNoCredit = ret?.credits[0]?.lineRefNo
            ah.lineRemarksCredit = ret?.credits[0]?.remarks
            ah.lineRemarksDebit = ret?.debits[0]?.remarks
            ah.tranDetailsIdDebit = ret?.debits[0]?.tranDetailsId
            ah.tranDetailsIdCredit = ret?.credits[0]?.tranDetailsId
        }

        arbitraryData.value = 0
        arbitraryData.setRefresh({})
    }

    return { getData, loadData, meta }
}

export { useDebitCreditNotesView }

const useStyles: any = makeStyles(() =>
    createStyles({
        content: {},
    })
)

export { useStyles }
