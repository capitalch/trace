import {
    useState,
    useEffect,
    useRef,
} from '../../../../imports/regular-imports'
import {
    makeStyles,
    Theme,
    createStyles,
} from '../../../../imports/gui-imports'
import { PrintIcon } from '../../../../imports/icons-import'
import { useSharedElements } from '../common/shared-elements-hook'
import { InvoiceA } from '../pdf/invoices/invoiceA'

function useSaleCrown(
    arbitraryData: any,
    saleType: string,
    drillDownEditAttributes: any
) {
    const [, setRefresh] = useState({})
    const {
        emit,
        getCurrentComponent,
        genericUpdateMasterDetails,
        getFromBag,
        isInvalidDate,
        isInvalidGstin,
        PDFViewer,
    } = useSharedElements()
    useEffect(() => {
        meta.current.isMounted = true
        arbitraryData.salesCrownRefresh = () => setRefresh({})
        return () => {
            meta.current.isMounted = false
        }
    }, [])

    const meta: any = useRef({
        isMounted: false,
        showDialog: false,
        dialogConfig: {
            title: '',
            content: () => <></>,
            actions: () => {},
        },
        title: saleType === 'sal' ? 'Sales' : 'Sales return',
    })
    const pre = meta.current

    function getError() {
        const ab = arbitraryData
        const errorObject: any = ab.saleErrorObject

        function headError() {
            function dateError() {
                errorObject.dateError =
                    isInvalidDate(ab.tranDate) || !ab.tranDate
                return errorObject.dateError
            }
            function saleAccountError() {
                errorObject.saleAccountError = ab.rowData.isLedgerSubledgerError
                return errorObject.saleAccountError
            }
            function billToError() {
                errorObject.billToError = !(
                    ab.billTo.id || ab.billTo.contactName
                )
                return errorObject.billToError
            }
            function gstinError() {
                errorObject.gstinError = isInvalidGstin(
                    arbitraryData.billTo.gstin
                )
                return errorObject.gstinError
            }
            function shipToError() {
                return false
            }
            const d = dateError(),
                s = saleAccountError(),
                b = billToError(),
                sh = shipToError(),
                g = gstinError()
            errorObject.headError = d || s || b || sh || g
            return errorObject.headError
        }

        function itemsError() {
            const ret: any = arbitraryData.lineItems.reduce(
                (prev: any, curr: any, index: number) => {
                    curr.isError =
                        !!!curr.productCode ||
                        !!!curr.hsn ||
                        !!!curr.qty ||
                        arbitraryData.saleErrorMethods.errorMethods.getSlNoError(
                            arbitraryData.lineItems[index]
                        ) ||
                        curr.gstRate > 30
                    prev.isError = prev.isError || curr.isError
                    return prev
                },
                { isError: false }
            )
            errorObject.itemsError = ret.isError
            return errorObject.itemsError
        }

        function footerError() {
            const ret: any = arbitraryData.footer.items.reduce(
                (prev: any, curr: any, index: number) => {
                    curr.isError =
                        !!arbitraryData.footer.items[index]
                            .isLedgerSubledgerError ||
                        arbitraryData.footer.items[index].amount === 0
                    prev.isError = prev.isError || curr.isError
                    return prev
                },
                { isError: false }
            )
            errorObject.footerError = ret.isError
            return errorObject.footerError
        }

        function debitCreditError() {
            errorObject.debitCreditError =
                Math.abs(
                    arbitraryData.footer.amount - arbitraryData.summary.amount
                ) === 0
                    ? false
                    : true
            return errorObject.debitCreditError
        }

        const h = headError()
        const i = itemsError()
        const f = footerError()
        const d = debitCreditError()
        const ret: boolean = h || i || f || d
        return ret
    }

    async function handleBillPreview() {
        const dialog = pre.dialogConfig
        dialog.title = 'Sale invoice'
        dialog.content = () => (
            <PDFViewer showToolbar={true} width={800} height={900} >
                <InvoiceA />
            </PDFViewer>
        )
        pre.showDialog = true
        pre.isMounted && setRefresh({})
    }

    async function handleSubmit() {
        const ad = arbitraryData
        const header = extractHeader()
        const details = extractDetails()
        header.data[0].details = details
        const ret = await genericUpdateMasterDetails([header])
        console.log(JSON.stringify(header))
        if (ret.error) {
            console.log(ret.error)
        } else {
            if (ad.shouldCloseParentOnSave) {
                emit('ACCOUNTS-LEDGER-DIALOG-CLOSE-DRILL-DOWN-CHILD-DIALOG', '')
            } else if (ad.isViewBack) {
                // arbitraryData.salesHookResetData()
                emit('LAUNCH-PAD:LOAD-COMPONENT', getCurrentComponent())
                emit('SALES-HOOK-CHANGE-TAB', 3)
                // arbitraryData.salesHookChangeTab(3)
                arbitraryData.saleViewHookFetchData()
            } else {
                emit('LAUNCH-PAD:LOAD-COMPONENT', getCurrentComponent())
            }
            ad.isViewBack = false // no go back to view
        }

        function extractHeader() {
            const finYearId = getFromBag('finYearObject')?.finYearId
            const branchId = getFromBag('branchObject')?.branchId || 1
            const obj: any = {
                tableName: 'TranH',
                data: [],
            }
            const item = {
                contactsId: ad.billTo.id,
                id: ad.id,
                tranDate: ad.tranDate,
                userRefNo: ad.userRefNo,
                remarks: ad.commonRemarks,
                tags: undefined,
                jData: ad.shipTo?.address1
                    ? JSON.stringify({ shipTo: ad.shipTo })
                    : null,
                finYearId: finYearId,
                branchId: branchId,
                posId: '1',
                autoRefNo: ad.autoRefNo,
                tranTypeId: ad.saleType === 'sal' ? 4 : 9,
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
                    ad?.footer.deletedIds.length > 0
                        ? [...ad.footer.deletedIds]
                        : undefined,
                data: [],
            }

            const saleDataRow: any = {
                id: ad.rowData.id || undefined,
                accId: ad.rowData.accId,
                dc: ad.saleType === 'sal' ? 'C' : 'D',
                amount: ad.summary.amount,
                details: [],
            }
            saleTranD.data.push(saleDataRow)

            for (let item of ad.footer.items) {
                saleTranD.data.push({
                    accId: item.accId,
                    dc: ad.saleType === 'sal' ? 'D' : 'C',
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
                        id: ad.extGstTranDId || undefined,
                        gstin: ad.billTo.gstin,
                        cgst: ad.summary.cgst,
                        sgst: ad.summary.sgst,
                        igst: ad.summary.igst,
                        isInput: ad.saleType === 'sal' ? false : true,
                    },
                ],
            }
            saleDataRow.details.push(gst)
            const products = {
                tableName: 'SalePurchaseDetails',
                fkeyName: 'tranDetailsId',
                deletedIds:
                    ad?.deletedSalePurchaseIds.length > 0
                        ? [...ad.deletedSalePurchaseIds]
                        : undefined,
                data: ad.lineItems.map((item: any) => ({
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

    return { handleBillPreview, handleSubmit, getError, meta }
}

export { useSaleCrown }

const useStyles: any = makeStyles((theme: Theme) =>
    createStyles({
        content: {
            '& .sales-crown': {
                display: 'flex',
                flexWrap: 'wrap',
                columnGap: theme.spacing(1),
                alignItems: 'center',
                backgroundColor: theme.palette.grey[100],
                '& .crown-title': {
                    color: theme.palette.secondary.main,
                },
                '& .crown-content': {
                    display: 'flex',
                    flexWrap: 'wrap',
                    marginTop: theme.spacing(0.5),
                    alignItems: 'center',
                    columnGap: theme.spacing(2),
                    color: theme.palette.blue.main,
                    fontWeight: 'bold',
                    marginLeft: 'auto',
                    '& ..preview-icon': {
                        color: theme.palette.orange.light,
                    },
                    '& .mail-icon': {
                        color: theme.palette.amber.dark,
                    },
                    '& .sms-icon': {
                        color: theme.palette.indigo.light,
                    },
                },
            },
        },
    })
)

export { useStyles }
