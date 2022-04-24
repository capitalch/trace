import { useEffect } from 'react'
import { Box, Button, IMegaData, manageEntitiesState, MegaDataContext, salesMegaData, useContext, useIbuki, useState, useTheme, utils, utilMethods } from '../redirect'

function useCrown() {
    const [, setRefresh] = useState({})
    const megaData: IMegaData = useContext(MegaDataContext)
    const sales = megaData.accounts.sales
    const { emit } = useIbuki()
    const {getFromBag} = manageEntitiesState()
    const {genericUpdateMasterDetails,} = utilMethods()

    useEffect(() => {
        megaData.registerKeyWithMethod('render:crown', setRefresh)
    }, [])

    function handleReset() {
        megaData.accounts.sales = salesMegaData()
        emit('TRACE-MAIN:JUST-REFRESH', null)
    }

    async function handleSubmit() {
        // const ad = arbitraryData
        // setInBag('rawSaleData', null)
        const header = extractHeader()
        const details = extractDetails()
        header.data[0].details = details
        let ret = await genericUpdateMasterDetails([header])
        if (ret.error) {
            console.log(ret.error)
        } else {
            const id = ret?.data?.accounts?.genericUpdateMasterDetails
            // if (id) {
            //     ret = await execSaleInvoiceView({
            //         isMultipleRows: false,
            //         sqlKey: 'getJson_sale_purchase_on_id',
            //         args: {
            //             id: id,
            //         },
            //     })
            //     if (ret) {
            //         setInBag('rawSaleData', ret)
            //         ad.rawSaleData = ret
            //         setRefresh({})
            //     }
            // }
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
                isAutoSubledger: sales.paymentVariety==='a'? true : false,
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
                // deletedIds:
                //     sales?.footer.deletedIds.length > 0
                //         ? [...sales.footer.deletedIds]
                //         : undefined,
                data: [],
            }

            // const saleDataRow: any = {
            //     id: ad.rowData.id || undefined,
            //     accId: ad.rowData.accId,
            //     dc: ad.saleType === 'sal' ? 'C' : 'D',
            //     amount: ad.summary.amount,
            //     details: [],
            // }
            // saleTranD.data.push(saleDataRow)

            // for (let item of ad.footer.items) {
            //     saleTranD.data.push({
            //         accId: item.accId,
            //         dc: ad.saleType === 'sal' ? 'D' : 'C',
            //         amount: item.amount,
            //         remarks: item.remarks,
            //         instrNo: item.instrNo,
            //         id: item.id || undefined,
            //     })
            // }

            // const gst = {
            //     tableName: 'ExtGstTranD',
            //     fkeyName: 'tranDetailsId',
            //     data: [
            //         {
            //             id: ad.extGstTranDId || undefined,
            //             gstin: ad.billTo.gstin,
            //             cgst: ad.summary.cgst,
            //             sgst: ad.summary.sgst,
            //             igst: ad.summary.igst,
            //             isInput: ad.saleType === 'sal' ? false : true,
            //         },
            //     ],
            // }
            // saleDataRow.details.push(gst)
            // const products = {
            //     tableName: 'SalePurchaseDetails',
            //     fkeyName: 'tranDetailsId',
            //     deletedIds:
            //         ad?.deletedSalePurchaseIds.length > 0
            //             ? [...ad.deletedSalePurchaseIds]
            //             : undefined,
            //     data: ad.lineItems.map((item: any) => ({
            //         id: item.id || undefined,
            //         productId: item.productId,
            //         qty: item.qty,
            //         priceGst: item.priceGst,
            //         price: item.price,
            //         discount: item.discount,
            //         amount: item.amount,
            //         gstRate: item.gstRate,
            //         cgst: item.cgst,
            //         sgst: item.sgst,
            //         igst: item.igst,
            //         hsn: item.hsn,
            //         jData: JSON.stringify({
            //             serialNumbers: item.serialNumbers,
            //             remarks: item.remarks,
            //         }),
            //     })),
            // }

            // saleDataRow.details.push(products)

            return saleTranD
        }
    }

    return ({ handleReset, handleSubmit })
}
export { useCrown }