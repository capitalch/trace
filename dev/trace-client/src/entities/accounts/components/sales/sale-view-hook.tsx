import {
    _,
    moment,
    useEffect,
    useRef,
} from '../../../../imports/regular-imports'
import {
    makeStyles,
    Theme,
    createStyles,
} from '../../../../imports/gui-imports'
import { useSharedElements } from '../common/shared-elements-hook'

function useSaleView(arbitraryData: any, drillDownEditAttributes: any) {
    const meta: any = useRef({
        allAccounts: [],
        data: [],
        isMounted: false,
        ledgerAccounts: [],
        no: 10,
        selectedAccount: undefined,
        title: '',
    })
    const {
        accountsMessages,
        confirm,
        emit,
        execGenericView,
        execSaleInvoiceView,
        filterOn,
        genericUpdateMaster,
        getAccountClassWithAutoSubledger,
        getFromBag,
        getMappedAccounts,
        isAllowedUpdate,
        setInBag,
        toDecimalFormat,
    } = useSharedElements()
    const dateFormat = getFromBag('dateFormat')

    useEffect(() => {
        meta.current.isMounted = true
        arbitraryData.saleViewHookFetchData = () =>
            emit(getXXGridParams().gridActionMessages.fetchIbukiMessage, null)

        const subs2 = filterOn('SALE-VIEW-HOOK-GET-SALE-ON-ID').subscribe(
            (d: any) => {
                loadSaleOnId(d.data, true) // isModify; 2nd arg is false for new entries in table
            }
        )
        const subs3 = filterOn('SALE-VIEW-HOOK-GET-SALE-ON-ID-NEW').subscribe(
            (d: any) => {
                loadSaleOnId(d.data, false) // isModify; 2nd arg is false for new entries in table
            }
        )

        const subs4 = filterOn(
            getXXGridParams().gridActionMessages.editIbukiMessage
        ).subscribe((d: any) => {
            const { tranDate, clearDate, id1 } = d.data?.row
            if (isAllowedUpdate({ tranDate, clearDate })) {
                arbitraryData.isViewBack = true // go back to sale view
                loadSaleOnId(id1, true) // isModify; 2nd arg is true for no new entry in tables
            }
        })

        const subs5 = filterOn(
            getXXGridParams().gridActionMessages.deleteIbukiMessage
        ).subscribe((d: any) => {
            const options: any = {
                description: accountsMessages.transactionDelete,
                confirmationText: 'Yes',
                cancellationText: 'No',
            }
            const { tranDate, clearDate, id1 } = d.data?.row
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
                        arbitraryData.saleViewHookFetchData()
                    })
                    .catch(() => {}) // important to have otherwise eror
            }
        })

        return () => {
            meta.current.isMounted = false
            subs2.unsubscribe()
            subs3.unsubscribe()
            subs4.unsubscribe()
            subs5.unsubscribe()
        }
    }, [])

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
                width: 120,
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
            tranTypeId: (arbitraryData.saleType ==='sal') ? 4 : 9,
            no: 100,
            accId: meta.current.selectedAccount?.id
                ? meta.current.selectedAccount.id + ''
                : '%',
            tranDc: (arbitraryData.saleType==='sal') ? 'C' : 'D',
        }
        const summaryColNames: string[] = ['amount']
        const specialColumns = {
            isEdit: true,
            isDelete: true,
        }
        const gridActionMessages = {
            fetchIbukiMessage: 'XX-GRID-HOOK-FETCH-SALES-DATA',
            editIbukiMessage: 'SALE-VIEW-HOOK-XX-GRID-EDIT-CLICKED',
            deleteIbukiMessage: 'SALE-VIEW-HOOK-XX-GRID-DELETE-CLICKED',
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

    async function loadSaleOnId(id: number, isModify: boolean = true) {
        // isModify: if isEdit then id's of tables are there so as to enforce modify sql. Otherwise id's of table are reset to undefined, so new rows are inserted in tables
        const ad = arbitraryData
        emit('SHOW-LOADING-INDICATOR', true)
        // const ret = await execGenericView({
        //     isMultipleRows: false,
        //     sqlKey: 'getJson_sale_purchase_on_id',
        //     args: {
        //         id: id,
        //     },
        // })
        const ret = await execSaleInvoiceView({
            isMultipleRows: false,
            sqlKey: 'getJson_sale_purchase_on_id',
            args: {
                id: id,
            },
        })
        emit('SHOW-LOADING-INDICATOR', false)
        if (ret) {
            console.log(JSON.stringify(ret))
            // arbitraryData.rawSaleData = ret
            setInBag('rawSaleData', ret) // for printing in sale-crown.tsx
            prepareArbitraryData(ret)
            arbitraryData.saleItemsRefresh()
            // arbitraryData.salesHookChangeTab(0)
            emit('SALES-HOOK-CHANGE-TAB', 0)
        }

        function prepareArbitraryData(data: any) {
            const res = data.jsonResult
            loadTranH(res)
            loadExtGstTranD(res)
            loadSalePurchaseDetails(res)
            loadTranD(res)
            ad.salesCrownRefresh()

            function loadExtGstTranD(res: any) {
                const extGstTranD = res.extGstTranD
                ad.billTo.gstin = extGstTranD.gstin
                ad.summary.cgst = extGstTranD.cgst
                ad.summary.sgst = extGstTranD.sgst
                ad.summary.igst = extGstTranD.igst
                ad.extGstTranDId = isModify ? extGstTranD.id : undefined
                ad.summary.igst ? (ad.isIgst = true) : (ad.isIgst = false)
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
                    remarks: item.remarks,
                    upcCode: item.upcCode,
                    productCode: item.productCode,
                    productDetails: item.label
                        ? `${item.catName || ''}, ${item.brandName || ''}, ${
                              item.label || ''
                          }, ${item.info || ''}`
                        : '',
                    productId: item.productId,
                    hsn: item.hsn,
                    gstRate: item.gstRate,
                    cgst: item.cgst,
                    sgst: item.sgst,
                    igst: item.igst,
                    qty: item.qty,
                    priceGst: item.priceGst,
                    price: item.price,
                    discount: item.discount,
                    amount: item.amount || 0,
                    serialNumbers: item.serialNumbers || '',
                }))
                ad.summary.qty = 0
                ad.lineItems.reduce((prev: any, item: any) => {
                    ad.summary.qty = prev.qty + item.qty
                    return ad.summary
                }, ad.summary)
            }

            function loadTranD(res: any) {
                const tranD = res.tranD //an array of 2 or multiple items. If multipe payments received in footer then more than 2 rows
                ad.saleVariety = 'r'
                ad.footer.items = []
                for (let item of tranD) {
                    const accObj: any = getAccountClassWithAutoSubledger(
                        item.accId
                    )
                    if (accObj.accClass === 'sale') {
                        ad.rowData.accId = item.accId
                        ad.summary.amount = item.amount
                        ad.footer.amount = item.amount
                        ad.rowData.id = isModify ? item.id : undefined
                    } else {
                        const obj: any = {
                            accId: item.accId,
                            amount: item.amount,
                            instrNo: item.instrNo,
                            remarks: item.remarks,
                            id: isModify ? item.id : undefined,
                            allAccounts: arbitraryData.allAccounts,
                        }
                        if (accObj.isAutoSubledger) {
                            ad.saleVariety = 'a'
                            obj.ledgerAccounts = getMappedAccounts(
                                arbitraryData.accounts['autoSubledgerAccounts']
                            )
                        } else if (
                            ['debtor', 'creditor'].includes(accObj.accClass)
                        ) {
                            ad.saleVariety = 'i'
                            obj.ledgerAccounts = getMappedAccounts(
                                arbitraryData.accounts[
                                    'debtorCreditorAccountsWithLedgers'
                                ]
                            )
                        } else {
                            ad.saleVariety = 'r'
                            obj.ledgerAccounts = getMappedAccounts(
                                arbitraryData.accounts[
                                    'cashBankAccountsWithSubledgers'
                                ]
                            )
                        }
                        ad.footer.items.push(obj)
                    }
                }
            }

            function loadTranH(res: any) {
                const tranH = res.tranH
                res.businessContacts && (res.businessContacts.id = undefined)
                const billTo = res.billTo || res.businessContacts || {}
                ad.id = isModify ? tranH.id : undefined
                ad.autoRefNo = tranH.autoRefNo
                ad.tranDate = isModify ? tranH.tranDate : null
                ad.userRefNo = tranH.userRefNo
                ad.commonRemarks = tranH.remarks
                ad.billTo = billTo
                ad.shipTo = tranH?.jData?.shipTo?.address1
                    ? tranH.jData.shipTo
                    : {}
            }
        }
    }

    return { getXXGridParams, meta }
}

export { useSaleView }

const useStyles: any = makeStyles((theme: Theme) =>
    createStyles({
        content: {
            height: 'calc(100vh - 245px)',
            width: '100%',
            marginTop: '5px',
            '& .select-last': {
                marginLeft: theme.spacing(2),
            },
        },
    })
)

export { useStyles }
