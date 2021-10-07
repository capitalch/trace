import { useState, useEffect, useRef } from 'react'
import { makeStyles, Theme, createStyles } from '@material-ui/core'
import { useSharedElements } from '../common/shared-elements-hook'
import _ from 'lodash'

function useSaleView(arbitraryData: any, drillDownEditAttributes: any) {
    const [, setRefresh] = useState({})

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
        AddIcon,
        confirm,
        DeleteIcon,
        EditIcon,
        emit,
        execGenericView,
        filterOn,
        genericUpdateMaster,
        getAccountClassWithAutoSubledger,
        getFromBag,
        getMappedAccounts,
        isDateAuditLocked,
        moment,
        toDecimalFormat,
    } = useSharedElements()

    useEffect(() => {
        meta.current.isMounted = true
        const subs1 = filterOn('SALE-VIEW-HOOK-FETCH-DATA').subscribe(() => {
            fetchData()
        })
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

        return () => {
            meta.current.isMounted = false
            subs1.unsubscribe()
            subs2.unsubscribe()
            subs3.unsubscribe()
        }
    }, [])

    useEffect(() => {
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
    }, [])

    const dateFormat = getFromBag('dateFormat')

    async function fetchData() {
        emit('SHOW-LOADING-INDICATOR', true)
        const label = arbitraryData.isSales ? 'salesTran' : 'salesRetTran'
        let no = getFromBag(label)
        no = no ?? meta.current.no
        const ret = await execGenericView({
            isMultipleRows: true,
            sqlKey: 'get_sale_purchase_headers',
            args: {
                tranTypeId: arbitraryData.isSales ? 4 : 9,
                no: no || null,
                accId: meta.current.selectedAccount?.id
                    ? meta.current.selectedAccount.id + ''
                    : '%',
                tranDc: arbitraryData.isSales ? 'C' : 'D',
            },
        })
        emit('SHOW-LOADING-INDICATOR', false)
        if (ret) {
            let index = 1
            for (let item of ret) {
                item.index = index++
            }
            meta.current.data = ret
        }
        meta.current.isMounted && setRefresh({})
    }

    function getActionsList() {
        return [
            {
                icon: () => <AddIcon />,
                toolTip: 'Select party',
                name: 'selectParty',
                isFreeAction: true, // isFreeAction puts the icon in toolbar
                onClick: () => {}, // Reload the component for new sale entry
            },
            {
                icon: () => <AddIcon />, // Here the <Addicon> is placeholder. It is later customized to select control
                name: 'select',
                isFreeAction: true,
                onClick: () => {}, // This empty onClick is a hack. Without this warning appears
            },
            {
                icon: () => <EditIcon color="secondary" fontSize="small" />,
                toolTip: 'Edit transaction',
                name: 'edit',
                onClick: (e: any, rowData: any) => {
                    const tranDate = rowData.tranDate
                    if (isDateAuditLocked(tranDate)) {
                        emit('SHOW-MESSAGE', {
                            severity: 'error',
                            message: accountsMessages.auditLockError,
                            duration: null,
                        })
                    } else if (rowData?.clearDate) {
                        // already reconciled so edit /delete not possible
                        emit('SHOW-MESSAGE', {
                            severity: 'error',
                            message: accountsMessages.reconcillationDone,
                            duration: null,
                        })
                    } else {
                        loadSaleOnId(rowData.id, true) // isModify; 2nd arg is true for no new entry in tables
                    }
                },
            },
            {
                icon: () => (
                    <DeleteIcon color="error" fontSize="small"></DeleteIcon>
                ),
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
                    } else if (rowData?.clearDate) {
                        // already reconciled so edit /delete not possible
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
                                emit('PURCHASE-ROOT-CLEAR-ALL', null) //must clear the total purchase data
                                fetchData()
                            })
                            .catch(() => {}) // important to have otherwise eror
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
            // { title: 'Invoice no', field: 'userRefNo' },
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

    async function loadSaleOnId(id: number, isModify: boolean = true) {
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
        // console.log('Sale:', ret)
        if (ret) {
            prepareArbitraryData(ret)
            emit('SALE-ITEMS-REFRESH', null)
            emit('CHANGE-TAB-SALES', 0) // change to tab 0 for new entry
        }

        function prepareArbitraryData(data: any) {
            const res = data.jsonResult

            loadTranH(res)
            loadExtGstTranD(res)
            loadSalePurchaseDetails(res)
            loadTranD(res)

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
                ad.tranDate = tranH.tranDate
                ad.userRefNo = tranH.userRefNo
                ad.commonRemarks = tranH.remarks
                ad.billTo = billTo
                ad.shipTo = tranH?.jData?.shipTo?.address1
                    ? tranH.jData.shipTo
                    : {}
            }
        }
    }

    return { fetchData, getActionsList, getColumnsArray, meta }
}

export { useSaleView }

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
