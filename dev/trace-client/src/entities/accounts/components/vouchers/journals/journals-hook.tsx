import React, { useState, useEffect, useRef } from 'react'
import { makeStyles, Theme, createStyles } from '@material-ui/core'
import { useSharedElements } from '../../common/shared-elements-hook'
import { useLayoutEffect } from 'react'

function useJournals() {
    const [, setRefresh] = useState({})

    const { emit, execGenericView, filterOn, getFromBag } = useSharedElements()

    useEffect(() => {
        meta.current.isMounted = true
        setAccounts()
        emit('JOURNAL-MAIN-REFRESH', '') // refresh accounts in child
        const subs1 = filterOn('JOURNAL-CHANGE-TAB-TO-EDIT').subscribe(
            (d: any) => {
                const tranHeaderId = d.data?.tranHeaderId
                tranHeaderId && fetchAndPopulateDataOnId(tranHeaderId)
                arbitraryData.current.isGobackToEdit = true
                handleOnTabChange(null, 0)
            }
        )
        const subs2 = filterOn('JOURNAL-RESET').subscribe(() => {
            arbitraryData.current.header = {}
            arbitraryData.current.debits = [{ key: 0 }]
            arbitraryData.current.credits = [{ key: 0 }]
            arbitraryData.current.deletedDetailsIds = []
            arbitraryData.current.deletedGstIds = []
            setRefresh({})
        })
        const subs3 = filterOn('JOURNAL-CHANGE-TAB').subscribe((d: any) => {
            handleOnTabChange(null, d.data?.tabValue || 1)
        })
        return () => {
            meta.current.isMounted = false
            subs1.unsubscribe()
            subs2.unsubscribe()
            subs3.unsubscribe()
        }
    }, [])

    const meta: any = useRef({
        isMounted: false,
        title: 'Journals',
        tabValue: 0,
    })

    const arbitraryData: any = useRef({
        accounts: {
            all: [],
            journal: [],
        },
        header: {},
        deletedDetailsIds: [],
        // deletedGstIds:[],
        debits: [{ key: 0 }],
        credits: [{ key: 0 }],
    })

    async function fetchAndPopulateDataOnId(tranHeaderId: number) {
        emit('SHOW-LOADING-INDICATOR', true)
        try {
            const ret: any = await execGenericView({
                isMultipleRows: false,
                args: {
                    id: tranHeaderId,
                },
                sqlKey: 'getJson_tranHeader_details',
            })
            populateData(ret?.jsonResult)
            console.log(JSON.stringify(ret.jsonResult))
        } catch (e) {
            console.log(e.message)
        } finally {
            emit('SHOW-LOADING-INDICATOR', false)
        }

        function populateData(jsonResult: any) {
            const tranDetails: any[] = jsonResult.tranDetails
            const tranHeader: any = jsonResult.tranHeader
            // const tranTypeId = tranHeader.tranTypeId
            const ad = arbitraryData.current
            ad.header = tranHeader
            ad.debits = []
            ad.credits = []
            for (let detail of tranDetails) {
                if (detail.gst) {
                    ad.header.isGst = true
                    ad.header.gstin = detail.gst?.gstin
                    if (detail.gst.igst) {
                        detail.gst.isIgst = true
                    }
                }
                if (detail.dc === 'D') {
                    ad.debits.push(detail)
                } else {
                    ad.credits.push(detail)
                }
            }
            doReIndexKeys('debits')
            doReIndexKeys('credits')
            meta.current.isMounted && setRefresh({})

            function doReIndexKeys(tp: string) {
                let ind = 0
                function incr() {
                    return ind++
                }
                for (let it of ad[tp]) {
                    it.key = incr()
                }
            }
        }
    }

    function handleOnTabChange(e: any, newValue: number) {
        meta.current.tabValue = newValue
        meta.current.isMounted && setRefresh({})
    }

    function setAccounts() {
        const allAccounts = getFromBag('allAccounts') || []
        arbitraryData.current.accounts.all = allAccounts
        const jouAccounts = allAccounts.filter(
            (el: any) =>
                [
                    'branch',
                    'capital',
                    'other',
                    'loan',
                    'iexp',
                    'dexp',
                    'dincome',
                    'iincome',
                    'creditor',
                    'debtor',
                ].includes(el.accClass) &&
                (el.accLeaf === 'Y' || el.accLeaf === 'L')
        )
        arbitraryData.current.accounts.journal = jouAccounts
    }

    return { arbitraryData, handleOnTabChange, meta, setRefresh }
}

export { useJournals }

const useStyles: any = makeStyles((theme: Theme) =>
    createStyles({
        content: {
            '& .tabs': {
                color: theme.palette.common.white,
                backgroundColor: theme.palette.grey[600],
            },
            '& .tab': {},
        },
    })
)

export { useStyles }
