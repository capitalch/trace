import { Box, Button, IMegaData, manageEntitiesState, MegaDataContext, salesMegaData, useContext, useEffect, useIbuki, useRef, useState, useTheme, utils, utilMethods, XXGrid } from '../redirect'
import { SalesViewContent } from './sales-view-content'

function useCrown() {
    const [, setRefresh] = useState({})
    const megaData: IMegaData = useContext(MegaDataContext)
    const sales = megaData.accounts.sales
    const { emit } = useIbuki()
    const { getFromBag, setInBag } = manageEntitiesState()
    const { genericUpdateMasterDetails, } = utilMethods()
    const { execSaleInvoiceView } = utils()

    const meta: any = useRef({
        showDialog: false,
        dialogConfig: {
            title: 'View sales',
            content: () => <></>,
            // fullScreen: true,
        }
    })
    const pre = meta.current

    useEffect(() => {
        megaData.registerKeyWithMethod('render:crown', setRefresh)
        megaData.registerKeyWithMethod('closeDialog:crown', closeDialog)
    }, [])

    function closeDialog() {
        pre.showDialog = false
        setRefresh({})
    }

    function handleReset() {
        megaData.accounts.sales = salesMegaData()
        emit('TRACE-MAIN:JUST-REFRESH', null)
    }

    function handleViewSalesDialog() {
        pre.showDialog = true
        pre.dialogConfig.content = SalesViewContent
        setRefresh({})
    }

    async function handleSubmit() {
        setInBag('rawSaleData', null)
        const header = extractHeader()
        const details = extractDetails()
        header.data[0].details = details
        console.log(JSON.stringify(header))
        let ret = await genericUpdateMasterDetails([header])
        // let ret:any = {error:true}
        if (ret.error) {
            console.log(ret.error)
        } else {
            const id = ret?.data?.accounts?.genericUpdateMasterDetails
            if (id) {
                ret = await execSaleInvoiceView({
                    isMultipleRows: false,
                    sqlKey: 'getJson_sale_purchase_on_id',
                    args: {
                        id: id,
                    },
                })
                if (ret) {
                    setInBag('rawSaleData', ret)
                    // sales.rawSaleData = ret
                    setRefresh({})
                }
                handleReset()
            }
            // if (ad.shouldCloseParentOnSave) {
            //     emit('ACCOUNTS-LEDGER-DIALOG-CLOSE-DRILL-DOWN-CHILD-DIALOG', '')
            // } else if (ad.isViewBack) {
            //     emit('LAUNCH-PAD:LOAD-COMPONENT', getCurrentComponent())
            //     emit('SALES-HOOK-CHANGE-TAB', 3)
            //     arbitraryData.saleViewHookFetchData()
            // } else {
            //     emit('LAUNCH-PAD:LOAD-COMPONENT', getCurrentComponent())
            // }
            // ad.isViewBack = false // no go back to view
        }

        function extractHeader() {
            const finYearId = getFromBag('finYearObject')?.finYearId
            const branchId = getFromBag('branchObject')?.branchId || 1
            const obj: any = {
                tableName: 'TranH',
                isAutoSubledger: sales.paymentVariety === 'a' ? true : false,
                data: [],
            }
            const item = {
                contactsId: sales.billTo.id,
                id: sales.id || undefined,
                tranDate: sales.tranDate,
                userRefNo: sales.userRefNo,
                remarks: sales.commonRemarks,
                tags: undefined,
                jData: sales.shipTo?.address1
                    ? JSON.stringify({ shipTo: sales.shipTo })
                    : null,
                finYearId: finYearId,
                branchId: branchId,
                posId: '1',
                autoRefNo: sales.autoRefNo,
                tranTypeId: sales.saleType === 'sal' ? 4 : 9,
                details: [],
            }
            obj.data.push(item)
            return obj
        }

        function extractDetails() {
            const saleTranD: any = {
                tableName: 'TranD',
                fkeyName: 'tranHeaderId',
                deletedIds:
                    sales?.payments.deletedIds.length > 0
                        ? [...sales.payments.deletedIds]
                        : undefined,
                data: [],
            }

            const saleDataRow: any = {
                id: sales.salesAccount.id || undefined,
                accId: sales.salesAccount.accId,
                dc: sales.saleType === 'sal' ? 'C' : 'D',
                amount: sales.summary.amount,
                details: [],
            }
            saleTranD.data.push(saleDataRow)

            for (let item of sales.payments.paymentMethodsList) {
                saleTranD.data.push({
                    accId: item.rowData.accId,
                    dc: sales.saleType === 'sal' ? 'D' : 'C',
                    amount: item.amount,
                    remarks: item.remarks,
                    instrNo: item.instrNo,
                    id: item.id || undefined,
                })
            }

            const gst = {
                tableName: 'ExtGstTranD',
                fkeyName: 'tranDetailsId',
                data: [
                    {
                        id: sales.extGstTranDId || undefined,
                        gstin: sales.billTo.gstin,
                        cgst: sales.summary.cgst,
                        sgst: sales.summary.sgst,
                        igst: sales.summary.igst,
                        isInput: sales.saleType === 'sal' ? false : true,
                    },
                ],
            }
            saleDataRow.details.push(gst)
            const products = {
                tableName: 'SalePurchaseDetails',
                fkeyName: 'tranDetailsId',
                deletedIds:
                    sales.deletedSalePurchaseIds.length > 0
                        ? [...sales.deletedSalePurchaseIds]
                        : undefined,
                data: sales.items.map((item: any) => ({
                    id: item.id || undefined,
                    productId: item.productId,
                    qty: item.qty,
                    priceGst: item.priceGst,
                    price: item.price,
                    discount: item.discount,
                    amount: item.amount,
                    gstRate: item.gstRate,
                    cgst: item.cgst,
                    sgst: item.sgst,
                    igst: item.igst,
                    hsn: item.hsn,
                    jData: JSON.stringify({
                        serialNumbers: item.serialNumbers,
                        remarks: item.remarks,
                    }),
                })),
            }

            saleDataRow.details.push(products)

            return saleTranD
        }
    }

    return ({ handleReset, handleViewSalesDialog, handleSubmit, meta })
}
export { useCrown }