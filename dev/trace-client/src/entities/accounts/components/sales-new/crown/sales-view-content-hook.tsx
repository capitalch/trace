import { _, accountsMessages, IMegaData, manageEntitiesState, MegaDataContext, moment, useConfirm, useContext, useEffect, useIbuki, useRef, utils, utilMethods} from '../redirect'

function useSalesViewContent() {
    const megaData: IMegaData = useContext(MegaDataContext)
    const sales = megaData.accounts.sales
    const confirm = useConfirm()
    const { isControlDisabled, genericUpdateMaster, toDecimalFormat } = utilMethods()
    const { emit, filterOn } = useIbuki()
    const { getFromBag, setInBag, } = manageEntitiesState()
    const dateFormat = getFromBag('dateFormat')
    const { isAllowedUpdate, execSaleInvoiceView, getAccountClassWithAutoSubledger } = utils()

    const meta: any = useRef({
        selectedAccountId: ''
    })
    const pre = meta.current

    useEffect(() => {
        const { gridActionMessages } = getXXGridParams()
        emit(gridActionMessages.fetchIbukiMessage, null)
        const subs1 = filterOn(gridActionMessages.editIbukiMessage).subscribe((d: any) => {
            const { tranDate, clearDate, id1 } = d.data?.row
            if (isAllowedUpdate({ tranDate, clearDate })) {
                loadSaleOnId(id1, true) // isModify; 2nd arg is true for no new entry in tables
            }
        })
        const subs2 = filterOn(gridActionMessages.deleteIbukiMessage).subscribe((d: any) => {
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
                        emit(gridActionMessages.fetchIbukiMessage, null)
                    })
                    .catch(() => { }) // important to have otherwise eror
            }
        })
        const subs3 = filterOn(gridActionMessages.printIbukiMessage).subscribe((d: any) => {
            const row = d.data?.row
            doPrintPreview(row.id1)
        })
        return (() => {
            subs1.unsubscribe()
            subs2.unsubscribe()
            subs3.unsubscribe()
        })
    }, [])

    async function doPrintPreview(id: number) {
        emit('SHOW-LOADING-INDICATOR', true)
        const ret = await execSaleInvoiceView({
            isMultipleRows: false,
            sqlKey: 'getJson_sale_purchase_on_id',
            args: {
                id: id,
            },
        })
        emit('SHOW-LOADING-INDICATOR', false)
        megaData.executeMethodForKey('handleBillPreviewFromSalesView:debitsCreditsPreview', ret)
    }

    function getXXGridParams() {
        const columns = [
            {
                headerName: '#',
                description: 'Index',
                field: 'id',
                type: 'number',
                width: 80,
                disableColumnMenu: true,
            },
            {
                headerName: 'Id',
                description: 'Id',
                field: 'id1',
                type: 'number',
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
            {
                headerName: 'Contact',
                field: 'contact',
                width: 200,
            },
            {
                headerName: 'Line remarks',
                field: 'lineRemarks',
                width: 200,
            },
        ]
        const queryId = 'get_sale_purchase_headers'
        const queryArgs = {
            tranTypeId: (sales.saleType === 'sal') ? 4 : 9,
            no: 100,
            accId: pre.selectedAccountId || '%',
            tranDc: (sales.saleType === 'sal') ? 'C' : 'D',
        }
        const summaryColNames: string[] = ['amount']
        const specialColumns = {
            isEdit: true,
            isEditDisabled: isControlDisabled('salespurchases-simple-sales-edit'),
            isDelete: true,
            isDeleteDisabled: isControlDisabled('salespurchases-simple-sales-delete'),
            isPrint: true,
        }
        const gridActionMessages = {
            fetchIbukiMessage: 'XX-GRID-HOOK-FETCH-SALES-DATA',
            editIbukiMessage: 'SALE-VIEW-HOOK-XX-GRID-EDIT-CLICKED',
            deleteIbukiMessage: 'SALE-VIEW-HOOK-XX-GRID-DELETE-CLICKED',
            printIbukiMessage: 'SALE-VIEW-HOOK-XX-GRID-PRINT-CLICKED'
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
        emit('SHOW-LOADING-INDICATOR', true)
        const ret = await execSaleInvoiceView({
            isMultipleRows: false,
            sqlKey: 'getJson_sale_purchase_on_id',
            args: {
                id: id,
            },
        })
        emit('SHOW-LOADING-INDICATOR', false)
        if (ret) {
            setInBag('rawSaleData', ret) // for printing in sale-crown.tsx
            prepareSalesData(ret)
        }

        // populates the megaData.accounts.sales from database
        function prepareSalesData(data: any) {
            const res = data.jsonResult
            loadTranH(res)
            loadExtGstTranD(res)
            loadSalePurchaseDetails(res)
            loadTranD(res)
            megaData.executeMethodForKey('closeDialog:crown')
            megaData.executeMethodForKey('render:salesNew', {})

            function loadExtGstTranD(res: any) {
                const extGstTranD = res.extGstTranD
                sales.billTo.gstin = extGstTranD.gstin
                sales.summary.cgst = extGstTranD.cgst
                sales.summary.sgst = extGstTranD.sgst
                sales.summary.igst = extGstTranD.igst
                sales.extGstTranDId = isModify ? extGstTranD.id : undefined
                sales.isIgst = sales.summary.igst ? true : false
                // sales.summary.igst ? (sales.isIgst = true) : (sales.isIgst = false)
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
                sales.items.length = 0
                for (const item of salePurchaseDetails) {
                    sales.items.push({
                        id: isModify ? item.id : undefined,
                        index: incr(),
                        remarks: item.remarks,
                        upcCode: item.upcCode,
                        productCode: item.productCode,
                        productDetails: item.label
                            ? `${item.catName || ''}, ${item.brandName || ''}, ${item.label || ''
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
                    })
                }
                sales.summary.qty = 0
                sales.items.reduce((prev: any, item: any) => {
                    sales.summary.qty = prev.qty + item.qty
                    return sales.summary
                }, sales.summary)
            }

            function loadTranD(res: any) {
                const tranD = res.tranD //an array of 2 or multiple items. If multipe payments received in footer then more than 2 rows
                sales.payments.paymentVariety = 'r'
                sales.payments.paymentMethodsList = []
                for (let item of tranD) {
                    const accObj: any = getAccountClassWithAutoSubledger(
                        item.accId
                    )
                    if (_.isEmpty(accObj)) {
                        emit('SHOW-MESSAGE', {
                            message: accountsMessages.warningToDoRefresh,
                            severity: 'warning',
                            duration: null,
                        })
                        return
                    }
                    if (accObj?.accClass === 'sale') {
                        sales.salesAccount.accId = item.accId
                        sales.summary.amount = item.amount
                        sales.summary.backCalculateAmount = item.amount
                        sales.salesAccount.id = isModify ? item.id : undefined // id from table TranD
                    } else {
                        const obj: any = {
                            rowData: { accId: item.accId },
                            amount: item.amount,
                            instrNo: item.instrNo,
                            remarks: item.remarks,
                            id: isModify ? item.id : undefined, // id from table TranD
                        }
                        if (accObj?.isAutoSubledger) {
                            sales.payments.paymentVariety = 'a'
                            obj.ledgerFilterMethodName = 'autoSubledgers'
                        } else if (
                            ['debtor', 'creditor'].includes(accObj?.accClass)
                        ) {
                            sales.payments.paymentVariety = 'i'
                            obj.ledgerFilterMethodName = 'debtorsCreditors'
                        } else {
                            sales.payments.paymentVariety = 'r'
                            obj.ledgerFilterMethodName = 'cashBank'
                        }
                        sales.payments.paymentMethodsList.push(obj)
                    }
                }
            }

            function loadTranH(res: any) {
                const tranH = res.tranH
                res.businessContacts && (res.businessContacts.id = undefined)
                const billTo = res.billTo || res.businessContacts || {}
                sales.id = isModify ? tranH.id : undefined
                sales.autoRefNo = tranH.autoRefNo
                sales.tranDate = isModify ? tranH.tranDate : null
                sales.userRefNo = tranH.userRefNo
                sales.commonRemarks = tranH.remarks
                sales.billTo = billTo
                sales.shipTo = tranH?.jData?.shipTo?.address1
                    ? tranH.jData.shipTo
                    : {}
            }
        }
    }

    return ({ getXXGridParams, })
}

export { useSalesViewContent }