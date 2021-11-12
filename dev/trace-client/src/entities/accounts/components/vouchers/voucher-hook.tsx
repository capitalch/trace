import {
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

function useVoucher(loadComponent: string, drillDownEditAttributes: any) {
    const [, setRefresh] = useState({})
    const { emit, execGenericView, filterOn, getFromBag } = useSharedElements()
    const multiData: any = useContext(MultiDataContext)
    // const arbitraryData: any = getFromBag(loadComponent.concat('-voucher')) //In init-code, arbitraryData is set in global bag as setInBag('journal',...), setInBag('payment',...) ...
    const arbitraryData = multiData.vouchers
    
    arbitraryData && (arbitraryData.header.tranTypeId = getTranTypeId())
    useEffect(() => {
        meta.current.isMounted = true
        arbitraryData.shouldViewReload = true
        arbitraryData.shouldGoBackToView = false
        setAccounts()
        setRefresh({})
        const subs1 = filterOn('VOUCHER-CHANGE-TAB-TO-EDIT').subscribe(
            (d: any) => {
                const tranHeaderId = d.data?.tranHeaderId
                tranHeaderId && fetchAndPopulateDataOnId(tranHeaderId)
                arbitraryData.shouldGoBackToView = true
                handleOnTabChange(null, 0)
            }
        )
        const subs2 = filterOn('VOUCHER-RESET').subscribe(() => {
            arbitraryData.shouldViewReload = true
            arbitraryData.shouldGoBackToView = false
            arbitraryData.header = {}
            arbitraryData.debits = [{ key: 0 }]
            arbitraryData.credits = [{ key: 0 }]
            arbitraryData.deletedDetailsIds = []
            arbitraryData.deletedGstIds = []
            setRefresh({})
        })
        const subs3 = filterOn('VOUCHER-CHANGE-TAB').subscribe((d: any) => {
            handleOnTabChange(null, d.data?.tabValue || 1)
        })

        const subs4 = filterOn('VOUCHER-HANDLE-DRILL-DOWN-EDIT').subscribe(
            async (d: any) => {
                const tranHeaderId = d.data?.tranHeaderId
                tranHeaderId && (await fetchAndPopulateDataOnId(tranHeaderId))
                arbitraryData.shouldCloseParentOnSave = true
                handleOnTabChange(null, 0)
            }
        )
        return () => {
            meta.current.isMounted = false
            subs1.unsubscribe()
            subs2.unsubscribe()
            subs3.unsubscribe()
            subs4.unsubscribe()
        }
    }, [])

    useEffect(() => {
        emit('VOUCHER-HANDLE-DRILL-DOWN-EDIT', {
            tranHeaderId: drillDownEditAttributes?.tranHeaderId,
        })
    }, [drillDownEditAttributes?.tranHeaderId])

    const meta: any = useRef({
        isMounted: false,
        title: getTitle(),
        tabValue: 0,
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
        } catch (e: any) {
            console.log(e.message)
        } finally {
            emit('SHOW-LOADING-INDICATOR', false)
        }

        function populateData(jsonResult: any) {
            const tranDetails: any[] = jsonResult.tranDetails
            const tranHeader: any = jsonResult.tranHeader
            const ad = arbitraryData
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

    function getTitle() {
        const tit: any = {
            journal: 'Journals',
            payment: 'Payments',
            receipt: 'Receipts',
            contra: 'Contra',
        }
        return tit[loadComponent]
    }

    function getTranTypeId() {
        const logic: any = {
            journal: 1,
            payment: 2,
            receipt: 3,
            contra: 6,
        }
        return logic[loadComponent]
    }

    function handleOnTabChange(e: any, newValue: number) {
        meta.current.tabValue = newValue
        meta.current.isMounted && setRefresh({})
    }

    function setAccounts() {
        const allAccounts = getFromBag('allAccounts') || []
        arbitraryData.accounts.all = allAccounts
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
        arbitraryData.accounts.journal = jouAccounts

        arbitraryData.accounts.cashBank = allAccounts.filter(
            (el: any) =>
                ['ecash', 'bank', 'card', 'cash'].includes(el.accClass) &&
                (el.accLeaf === 'Y' || el.accLeaf === 'L')
        )
        arbitraryData.accounts.paymentOther = allAccounts.filter(
            (el: any) =>
                [
                    'debtor',
                    'creditor',
                    'dexp',
                    'iexp',
                    'purchase',
                    'loan',
                    'capital',
                    'other',
                ].includes(el.accClass) &&
                (el.accLeaf === 'Y' || el.accLeaf === 'L')
        )
        arbitraryData.accounts.receiptOther = allAccounts.filter(
            (el: any) =>
                [
                    'debtor',
                    'creditor',
                    'dexp',
                    'iexp',
                    'loan',
                    'other',
                    'capital',
                    'iincome',
                    'dincome',
                    'sale',
                ].includes(el.accClass) &&
                (el.accLeaf === 'Y' || el.accLeaf === 'L')
        )
    }

    return { arbitraryData, getTranTypeId, handleOnTabChange, meta }
}

export { useVoucher }

const useStyles: any = makeStyles((theme: Theme) =>
    createStyles({
        content: {
            '& .tabs': {
                color: theme.palette.common.white,
                backgroundColor: theme.palette.grey[600],
            },
        },
    })
)

export { useStyles }
