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

function useVoucher(loadComponent: string, drillDownEditAttributes: any) {
    const [, setRefresh] = useState({})
    const {
        emit,
        execGenericView,
        filterOn,
        getAccountName,
        getFromBag,
        setInBag,
    } = useSharedElements()
    const multiData: any = useContext(MultiDataContext)
    const arbitraryData: any = multiData.vouchers

    arbitraryData && (arbitraryData.header.tranTypeId = getTranTypeId())

    const meta: any = useRef({
        isMounted: false,
        title: getTitle(),
        tabValue: 0,
        isClone: false,
        setRefresh: setRefresh,
        showDialog: false,
        dialogConfig: {
            title: 'Vouchers print preview',
            content: () => <></>,
            fullWidth: false,
        },
    })

    useEffect(() => {
        const curr = meta.current
        curr.isMounted = true
        arbitraryData.shouldViewReload = true
        arbitraryData.shouldGoBackToView = false
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

        const subs5 = filterOn('DRAWER-STATUS-CHANGED').subscribe(() => {
            setInBag('vouchersData', multiData.vouchers)
        })

        const subs6 = filterOn('VOUCHER-CHANGE-TAB-TO-CLONE').subscribe((d: any) => {
            const tranHeaderId = d.data?.tranHeaderId
            meta.current.isClone = true
            tranHeaderId && fetchAndPopulateDataOnId(tranHeaderId)
            arbitraryData.shouldGoBackToView = true
            handleOnTabChange(null, 0)
        })

        return () => {
            curr.isMounted = false
            subs1.unsubscribe()
            subs2.unsubscribe()
            subs3.unsubscribe()
            subs4.unsubscribe()
            subs5.unsubscribe()
            subs6.unsubscribe()
        }
    }, [])

    useEffect(() => {
        emit('VOUCHER-HANDLE-DRILL-DOWN-EDIT', {
            tranHeaderId: drillDownEditAttributes?.tranHeaderId,
        })
    }, [drillDownEditAttributes?.tranHeaderId])

    const vouchersData = getFromBag('vouchersData')
    if (vouchersData) {
        multiData.vouchers = vouchersData
        setInBag('vouchersData', undefined)
    }

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
            preparePdfVoucher()
            meta.current.isMounted && setRefresh({})
        } catch (e: any) {
            console.log(e.message)
        } finally {
            emit('SHOW-LOADING-INDICATOR', false)
        }

        function populateData(jsonResult: any) {
            const tranDetails: any[] = jsonResult.tranDetails
            const tranHeader: any = jsonResult.tranHeader
            if (meta.current.isClone) {
                tranHeader.autoRefNo = ''
                tranHeader.id = undefined
                tranHeader.tranDate = null
                tranDetails.forEach((row: any) => {
                    row.id = undefined
                    row.tranHeaderId = undefined
                    if(row.gst){
                        row.gst.id = undefined
                    }
                })
            }
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

        function preparePdfVoucher() {
            const ad = arbitraryData
            const dateFormat = getFromBag('dateFormat')
            ad.pdfVoucher = {}
            const vou = ad.pdfVoucher
            vou.heading = _.capitalize(loadComponent)
            vou.unitInfo = getFromBag('unitInfo')
            vou.tranDate = moment(ad.header.tranDate).format(dateFormat)
            vou.debits = ad.debits.map((item: any) => ({
                ...item,
                accName: getAccountName(item.accId),
            }))
            vou.credits = ad.credits.map((item: any) => ({
                ...item,
                accName: getAccountName(item.accId),
            }))
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

    return { arbitraryData, getTranTypeId, handleOnTabChange, meta }
}

export { useVoucher }

const useStyles: any = makeStyles((theme: Theme) =>
    createStyles({
        content: {
            '& .tabs': {
                color: theme.palette.primary.dark,
                backgroundColor: theme.palette.grey[200],
            },
        },
    })
)

export { useStyles }
