import {
    moment,
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

function usePurchaseView(
    arbitraryData: any,
    purchaseType: string,
    drillDownEditAttributes: any
) {
    const [, setRefresh] = useState({})
    const meta: any = useRef({
        allAccounts: [],
        data: [],
        isAlreadyLoaded: false,
        isMounted: false,
        ledgerAccounts: [],
        no: 10,
        selectedAccount: undefined,
        title:
            purchaseType === 'pur' ? 'Purchase view' : 'Purchase return view',
    })

    const {
        accountsMessages,
        confirm,
        emit,
        execGenericView,
        filterOn,
        genericUpdateMaster,
        getAccountClass,
        getFromBag,
        isAllowedUpdate,
        isDateAuditLocked,
        toDecimalFormat,
    } = useSharedElements()

    useEffect(() => {
        meta.current.isMounted = true
        const allAccounts = getFromBag('allAccounts') || []
        meta.current.allAccounts = allAccounts
        meta.current.ledgerAccounts = allAccounts
            .filter(
                (el: any) =>
                    ['debtor', 'creditor'].includes(el.accClass) &&
                    (el.accLeaf === 'Y' || el.accLeaf === 'L') &&
                    !el.isAutoSubledger
            )
            .map((el: any) => {
                return {
                    accName: el.accName,
                    id: el.id,
                    accLeaf: el.accLeaf,
                    subledgers: el.accLeaf === 'L' ? [] : null,
                }
            })
        meta.current.ledgerAccounts.unshift({
            accName: 'All parties',
            id: undefined,
        })
        return () => {
            meta.current.isMounted = false
        }
    }, [])

    useEffect(() => {
        const subs = filterOn('PURCHASE-VIEW-HOOK-FETCH-DATA').subscribe(
            (d: any) => {
                // emit('XX-GRID-FETCH-DATA', null)
                emit(
                    getXXGridParams().gridActionMessages.fetchIbukiMessage,
                    null
                )
            }
        )
        const subs1 = filterOn(
            'PURCHASE-VIEW-HOOK-GET-PURCHASE-ON-ID'
        ).subscribe((d: any) => {
            loadPurchaseOnId(d.data, false) // isModify; 2nd arg is false for new entries in table
        })

        const subs2 = filterOn(
            'PURCHASE-VIEW-HOOK-GET-PURCHASE-ON-ID-DRILL-DOWN-EDIT'
        ).subscribe((d: any) => {
            loadPurchaseOnId(d.data, true) // isModify; 2nd arg is false for new entries in table
        })

        const subs3 = filterOn(
            getXXGridParams().gridActionMessages.editIbukiMessage
        ).subscribe((d: any) => {
            const { tranDate, clearDate, id1 } = d.data?.row
            if (isAllowedUpdate({ tranDate, clearDate })) {
                arbitraryData.isViewBack = true
                loadPurchaseOnId(id1, true) // modify
                emit('PURCHASE-BODY-SUBMIT-REFRESH', null)
            }
        })

        const subs4 = filterOn(
            getXXGridParams().gridActionMessages.deleteIbukiMessage
        ).subscribe((d: any) => {
            const { tranDate, clearDate, id1 } = d.data?.row
            const options = {
                description: accountsMessages.transactionDelete,
                confirmationText: 'Yes',
                cancellationText: 'No',
            }
            if (isAllowedUpdate({ tranDate, clearDate })) {
                confirm(options)
                    .then(async () => {
                        const id = id1
                        emit('SHOW-LOADING-INDICATOR', true)
                        await genericUpdateMaster({
                            deletedIds: [id],
                            tableName: 'TranH',
                        })
                        emit('SHOW-LOADING-INDICATOR', false)
                        emit('SHOW-MESSAGE', {})
                        emit('PURCHASE-VIEW-HOOK-FETCH-DATA', null)
                    })
                    .catch(() => {}) // important to have otherwise eror
            }
        })

        return () => {
            subs.unsubscribe()
            subs1.unsubscribe()
            subs2.unsubscribe()
            subs3.unsubscribe()
            subs4.unsubscribe()
        }
    }, [])

    const dateFormat = getFromBag('dateFormat')

    function getXXGridParams() {
        const columns = [
            {
                headerName: 'Ind',
                description: 'Index',
                field: 'id',
                width: 80,
                disableColumnMenu: true,
            },
            {
                headerName: 'Id',
                description: 'Id',
                field: 'id1',
                width: 90,
            },
            {
                headerName: 'Date',
                description: 'Date',
                field: 'tranDate',
                width: 110,
                type: 'date',
                valueFormatter: (params: any) =>
                    moment(params.value).format(dateFormat),
            },
            {
                headerName: 'Ref no',
                description: 'Ref no',
                field: 'autoRefNo',
                width: 200,
            },
            {
                headerName: 'Account',
                field: 'accounts',
                width: 200,
            },
            {
                headerName: 'Aggr',
                field: 'aggr',
                sortable: false,
                type: 'number',
                width: 160,
                valueFormatter: (params: any) => toDecimalFormat(params.value),
            },
            {
                headerName: 'Cgst',
                field: 'cgst',
                sortable: false,
                type: 'number',
                width: 120,
                valueFormatter: (params: any) => toDecimalFormat(params.value),
            },
            {
                headerName: 'Sgst',
                field: 'sgst',
                sortable: false,
                type: 'number',
                width: 120,
                valueFormatter: (params: any) => toDecimalFormat(params.value),
            },
            {
                headerName: 'Igst',
                field: 'igst',
                sortable: false,
                type: 'number',
                width: 120,
                valueFormatter: (params: any) => toDecimalFormat(params.value),
            },
            {
                headerName: 'Amount',
                field: 'amount',
                sortable: false,
                type: 'number',
                width: 160,
                valueFormatter: (params: any) => toDecimalFormat(params.value),
            },
            {
                headerName: 'Labels',
                field: 'labels',
                width: 200,
            },
            {
                headerName: 'Remarks',
                field: 'remarks',
                width: 200,
            },
            {
                headerName: "Serial no's",
                field: 'serialNumbers',
                width: 160,
            },
        ]
        const queryId = 'get_sale_purchase_headers'
        const queryArgs = {
            tranTypeId: purchaseType === 'pur' ? 5 : 10,
            no: 100,
            accId: meta.current.selectedAccount?.id
                ? meta.current.selectedAccount.id + ''
                : '%',
            tranDc: purchaseType === 'pur' ? 'D' : 'C',
        }
        const summaryColNames: string[] = [
            'aggr',
            'cgst',
            'sgst',
            'igst',
            'amount',
        ]
        const specialColumns = {
            isEdit: true,
            isDelete: true,
        }
        const gridActionMessages = {
            fetchIbukiMessage: 'XX-GRID-HOOK-FETCH-PURCHASES-DATA',
            editIbukiMessage: 'PURCHASE-VIEW-HOOK-XX-GRID-EDIT-CLICKED',
            deleteIbukiMessage: 'PURCHASE-VIEW-HOOK-XX-GRID-DELETE-CLICKED',
        }
        return {
            columns,
            gridActionMessages,
            queryId,
            queryArgs,
            summaryColNames,
            specialColumns,
        }
    }

    async function loadPurchaseOnId(id: number, isModify: boolean = true) {
        // isModify: if isEdit then id's of tables are there so as to enforce modify sql. Otherwise id's of table are reset to undefined, so new rows are inserted in tables
        const ad = arbitraryData
        emit('SHOW-LOADING-INDICATOR', true)
        const ret = await execGenericView({
            isMultipleRows: false,
            sqlKey: 'getJson_sale_purchase_on_id',
            args: {
                id: id,
            },
        })
        emit('SHOW-LOADING-INDICATOR', false)
        if (ret) {
            prepareArbitraryData(ret)
            emit('PURCHASES-HOOK-CHANGE-TAB', 0) // change to tab 0 for new entry
        }
        emit('PURCHASE-BODY-SUBMIT-REFRESH', null)
        emit('PURCHASE-ITEMS-REFRESH', null)

        function prepareArbitraryData(data: any) {
            const res = data.jsonResult
            loadTranH(res)
            loadExtGstTranD(res)
            loadSalePurchaseDetails(res)
            ad.gstin || ad.cgst || ad.sgst || ad.igst
                ? (ad.isGstInvoice = true)
                : (ad.isGstInvoice = false)

            loadTranD(res)
            const accId = ad.ledgerSubledgerOther?.accId
            const accClass: string = getAccountClass(accId)
            if (['creditor', 'debtor'].includes(accClass)) {
                ad.purchaseType = 'credit'
            } else {
                ad.purchaseType = 'cash'
            }
            emit('PURCHASE-ITEMS-COMPUTE-ALL-ROWS', null)
            emit('PURCHASE-BODY-HANDLE-PURCHASE-CASH-CREDIT', ad.purchaseType)

            loadTranD(res) //intentional to do it twice because otherwise it does not work.

            meta.current.isMounted && setRefresh({})

            function loadExtGstTranD(res: any) {
                const extGstTranD = res?.extGstTranD
                ad.gstin = extGstTranD?.gstin
                ad.cgst = extGstTranD?.cgst
                ad.sgst = extGstTranD?.sgst
                ad.igst = extGstTranD?.igst
                if (
                    extGstTranD?.cgst === 0 &&
                    extGstTranD?.sgst === 0 &&
                    extGstTranD?.igst === 0
                ) {
                    ad.isGstInvoice = true
                } else {
                    ad.isGstInvoice = false
                }
                ad.igst ? (ad.isIgst = true) : (ad.isIgst = false)
                ad.extGstTranDId = isModify ? extGstTranD.id : undefined
            }

            function loadSalePurchaseDetails(res: any) {
                const salePurchaseDetails = res.salePurchaseDetails || [] //array
                if (salePurchaseDetails?.length === 0) {
                    return
                }
                let numb = 1
                function incr() {
                    return numb++
                }
                ad.lineItems = salePurchaseDetails.map((item: any) => ({
                    id: isModify ? item.id : undefined,
                    index: incr(),
                    errorsObject: {},
                    remarks: item.remarks,
                    upcCode: item.upcCode,
                    productCode: item.productCode,
                    productId: item.productId,
                    productDetails: item.label
                        ? `${item.catName || ''}, ${item.brandName || ''}, ${
                              item.label || ''
                          }, ${item.info || ''}`
                        : '',
                    hsn: item.hsn,
                    gstRate: item.gstRate,
                    qty: item.qty,
                    price: item.price,
                    priceGst: item.priceGst,
                    discount: item.discount,
                    amount: item.amount || 0,
                    cgst: item.cgst,
                    sgst: item.sgst,
                    igst: item.igst,
                    serialNumbers: item.serialNumbers || '',
                }))
                ad.qty = 0
                ad.lineItems.reduce((prev: any, item: any) => {
                    ad.qty = prev.qty + item.qty
                    return ad
                }, ad)
            }

            function loadTranD(res: any) {
                const isPurchase = purchaseType === 'pur'
                const tranD = res.tranD //an array with only two elements
                if (tranD.length !== 2) {
                    emit('SHOW-MESSAGE', {
                        severity: 'error',
                        message: accountsMessages.purchaseError,
                        duration: null,
                    })
                    return
                }

                for (let row of tranD) {
                    if (isPurchase) {
                        if (row.dc === 'D') {
                            ad.ledgerSubledgerPurchase.accId = row.accId
                            ad.invoiceAmount = row.amount
                            ad.ledgerSubledgerPurchase.id = isModify
                                ? row.id
                                : undefined
                        } else {
                            ad.ledgerSubledgerOther.accId = row.accId
                            ad.invoiceAmount = row.amount
                            ad.ledgerSubledgerOther.id = isModify
                                ? row.id
                                : undefined
                        }
                    } else {
                        if (row.dc === 'D') {
                            ad.ledgerSubledgerOther.accId = row.accId
                            ad.invoiceAmount = row.amount
                            ad.ledgerSubledgerOther.id = isModify
                                ? row.id
                                : undefined
                        } else {
                            ad.ledgerSubledgerPurchase.accId = row.accId
                            ad.invoiceAmount = row.amount
                            ad.ledgerSubledgerPurchase.id = isModify
                                ? row.id
                                : undefined
                        }
                    }
                }
            }

            function loadTranH(res: any) {
                const tranH = res.tranH
                ad.id = isModify ? tranH.id : undefined
                ad.autoRefNo = tranH.autoRefNo
                ad.tranDate = tranH.tranDate
                ad.userRefNo = tranH.userRefNo
                ad.commonRemarks = tranH.remarks
            }
        }
    }

    return { meta, getXXGridParams }
}

export { usePurchaseView }

const useStyles: any = makeStyles((theme: Theme) =>
    createStyles({
        content: {
            height: 'calc(100vh - 245px)',
            width: '100%',
            marginTop: '5px',
        },
    })
)

export { useStyles }
