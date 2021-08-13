import { useState, useEffect, useRef } from 'react'
import { makeStyles, Theme, createStyles } from '@material-ui/core'
import { useSharedElements } from '../common/shared-elements-hook'

function usePurchaseView(arbitraryData: any, purchaseType: string) {
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
        AddIcon,
        confirm,
        DeleteIcon,
        EditIcon,
        emit,
        execGenericView,
        filterOn,
        genericUpdateMaster,
        getAccountClass,
        getFromBag,
        isDateAuditLocked,
        moment,
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

        const subs1 = filterOn(
            'PURCHASE-VIEW-HOOK-GET-PURCHASE-ON-ID'
        ).subscribe((d: any) => {
            loadPurchaseOnId(d.data, false) // isModify; 2nd arg is false for new entries in table
        })

        return () => {
            meta.current.isMounted = false
            subs1.unsubscribe()
        }
    }, [])

    useEffect(() => {
        const subs1 = filterOn('PURCHASE-VIEW-HOOK-FETCH-DATA').subscribe(
            () => {
                fetchData()
            }
        )
        return () => subs1.unsubscribe()
    }, [])

    const dateFormat = getFromBag('dateFormat')

    function getActionsList() {
        return [
            {
                icon: () => <AddIcon />,
                toolTip: 'Select party',
                name: 'selectParty',
                isFreeAction: true, // isFreeAction puts the icon in toolbar
                onClick: () => { }, // Reload the component for new entry
            },
            {
                icon: () => <AddIcon />, // Here the <Addicon> is placeholder. It is later customized to select control
                name: 'select',
                isFreeAction: true,
                onClick: () => { }, // This empty onClick is a hack. Without this warning appears
            },
            {
                icon: () => <EditIcon color="primary" />,
                toolTip: 'Edit transaction',
                name: 'edit',
                onClick: async (e: any, rowData: any) => {
                    const tranDate = rowData.tranDate
                    if (isDateAuditLocked(tranDate)) {
                        emit('SHOW-MESSAGE', {
                            severity: 'error',
                            message: accountsMessages.auditLockError,
                            duration: null,
                        })
                    } else if (rowData?.clearDate) { // already reconciled so edit /delete not possible
                        emit('SHOW-MESSAGE', {
                            severity: 'error',
                            message: accountsMessages.reconcillationDone,
                            duration: null,
                        })
                    } else {
                        await loadPurchaseOnId(rowData.id, true) // modify
                        emit('PURCHASE-BODY-SUBMIT-REFRESH', null)
                    }
                },
            },
            {
                icon: () => <DeleteIcon color="error"></DeleteIcon>,
                toolTip: 'Delete transaction',
                name: 'delete',
                onClick: async (e: any, rowData: any) => {
                    const options = {
                        description: accountsMessages.transactionDelete,
                        confirmationText: 'Yes',
                        cancellationText: 'No',
                    }
                    if (isDateAuditLocked(rowData.tranDate)) {
                        emit('SHOW-MESSAGE', {
                            severity: 'error',
                            message: accountsMessages.auditLockError,
                            duration: null,
                        })
                    } else if (rowData?.clearDate) { // already reconciled so edit /delete not possible
                        emit('SHOW-MESSAGE', {
                            severity: 'error',
                            message: accountsMessages.reconcillationDone,
                            duration: null,
                        })
                    } else {
                        confirm(options)
                            .then(async () => {
                                const id = rowData['id']
                                emit('SHOW-LOADING-INDICATOR', true)
                                await genericUpdateMaster({
                                    deletedIds: [id],
                                    tableName: 'TranH',
                                })
                                emit('SHOW-LOADING-INDICATOR', false)
                                emit('SHOW-MESSAGE', {})
                                fetchData()
                            })
                            .catch(() => { }) // important to have otherwise eror
                    }
                },
            },
        ]
    }

    function getColumnsArray(): any[] {
        return [
            { title: 'Index', field: 'index', width: '4px' },
            { title: 'Id', field: 'id' },
            { title: 'Ref no', field: 'autoRefNo' },
            {
                title: 'Date',
                field: 'tranDate',
                type: 'date',
                render: (rowData: any) =>
                    moment(rowData.tranDate).format(dateFormat),
            },
            {
                title: 'Account',
                field: 'accounts',
            },
            { title: 'Invoice no', field: 'userRefNo' },
            {
                title: "Aggr",
                field: 'aggr',
                align: 'right',
                type: 'numeric',
                render: (rowData: any) => toDecimalFormat(rowData.aggr)
            },
            {
                title: "Cgst",
                field: 'cgst',
                align: 'right',
                type: 'numeric',
                render: (rowData: any) => toDecimalFormat(rowData.cgst)
            },
            {
                title: "Sgst",
                field: 'sgst',
                align: 'right',
                type: 'numeric',
                render: (rowData: any) => toDecimalFormat(rowData.sgst)
            },
            {
                title: "Igst",
                field: 'igst',
                align: 'right',
                type: 'numeric',
                render: (rowData: any) => toDecimalFormat(rowData.igst)
            },
            {
                title: 'Amount',
                field: 'amount',
                align: 'right',
                type: 'numeric',
                render: (rowData: any) => toDecimalFormat(rowData.amount),
            },
            { title: 'Labels', field: 'labels' },
            {
                title: 'Remarks',
                field: 'remarks',
            },
            {
                title: "Serial no's",
                field: 'serialNumbers',
            },
        ]
    }

    async function fetchData() {
        emit('SHOW-LOADING-INDICATOR', true)
        const label =
            purchaseType === 'pur' ? 'purchaseTran' : 'purchaseRetTran'
        let no = getFromBag(label)
        no = no ?? meta.current.no // new operator; if null or undefined then meta.current.no
        const ret = await execGenericView({
            isMultipleRows: true,
            sqlKey: 'get_sale_purchase_headers',
            args: {
                tranTypeId: purchaseType === 'pur' ? 5 : 10,
                no: no || null,
                accId: meta.current.selectedAccount?.id
                    ? meta.current.selectedAccount.id + ''
                    : '%',
                tranDc: purchaseType === 'pur' ? 'D' : 'C',
            },
        })
        emit('SHOW-LOADING-INDICATOR', false)
        if (ret) {
            let index = 1
            for (let item of ret) {
                item.index = index++
                item.serialNumbers = smoothOut(item.serialNumbers) //item.serialNumbers.split(',').filter(Boolean).toString()
            }
            meta.current.data = ret
        }
        meta.current.isMounted && setRefresh({})
        function smoothOut(sl: any) {
            let ret = sl.split(',').map((x: string) => x.trim()) // removes space
            ret = ret.filter(Boolean) // removes empty items in array
            ret = ret.join() // comma separated string out from array
            return (ret)
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
            emit('CHANGE-TAB-PURCHASES', 0) // change to tab 0 for new entry
        }
        emit('PURCHASE-BODY-SUBMIT-REFRESH', null)
        emit("PURCHASE-ITEMS-REFRESH", null)

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
                if ((extGstTranD?.cgst === 0) && (extGstTranD?.sgst === 0) && (extGstTranD?.igst === 0)) {
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
                        ? `${item.catName || ''}, ${item.brandName || ''}, ${item.label || ''
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

    return { getActionsList, getColumnsArray, fetchData, meta }
}

export { usePurchaseView }

const useStyles: any = makeStyles((theme: Theme) =>
    createStyles({
        content: {
            '& .select-last': {
                marginLeft: theme.spacing(2),
            },
        },
    })
)

export { useStyles }
