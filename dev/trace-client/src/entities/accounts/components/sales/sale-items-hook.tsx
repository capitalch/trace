import { useState, useEffect, useRef } from 'react'
import { makeStyles, Theme, createStyles } from '@material-ui/core'
import { useProductUtils } from '../common/product-utils-hook'
import { useSharedElements } from '../common/shared-elements-hook'

function useSaleItems(arbitraryData: any) {
    const [, setRefresh] = useState({})
    const lineItems = arbitraryData.lineItems

    const {
        _,
        Badge,
        Big,
        Button,
        confirm,
        emit,
        filterOn,
        messages,
        TextareaAutosize,
    } = useSharedElements()

    useEffect(() => {
        meta.current.isMounted = true
        arbitraryData.saleErrorMethods.errorMethods.getSlNoError = getSlNoError
        const subs1 = filterOn('SALE-ITEMS-REFRESH').subscribe(()=>{
            setRefresh({})
        })
        return () => {
            meta.current.isMounted = false
            subs1.unsubscribe()
        }
    }, [])

    useEffect(() => {
        lineItems.length === 0 && handleAddItem()
    }, [lineItems.length])

    const meta: any = useRef({
        isMounted: false,
        showDialog: false,
        dialogConfig: {
            title: '',
            content: () => <></>,
            actions: () => {},
        },
    })

    const {
        searchProduct,
        searchProductOnProductCode,
        searchProductOnUpcCode,
    } = useProductUtils(meta, (pr: any) => (computeRow(pr), computeSummary()))

    function clearObject(rowData: any) {
        rowData.upcCode = undefined
        rowData.productCode = undefined
        rowData.hsn = undefined
        rowData.productDetails = undefined
        rowData.gstRate = 0.0
        rowData.qty = 1
        rowData.priceGst = 0.0
        rowData.discount = 0.0
        rowData.amount = 0.0
        rowData.lineRefNo = undefined
        rowData.serialNumbers = ''
        rowData.searchFilter = ''
    }

    function clearRow(rowData: any) {
        clearObject(rowData)
        computeSummary()
    }

    function computeAllRows() {
        for (let lineItem of arbitraryData.lineItems) {
            computeRow(lineItem)
        }
    }

    function computeRow(rowData: any) {
        const gstRate = rowData.gstRate
        const priceGst = rowData.priceGst
        const price = rowData.price
        const discount = rowData.discount
        const qty = rowData.qty
        const amount = _.round((price - discount) * qty, 2)
        const gst = ((gstRate / 100) * amount) / (1 + gstRate / 100)
        const sgst = _.round(gst / 2, 2)
        const cgst = sgst
        const actualSalePrice = amount - gst
        if (arbitraryData.isIgst) {
            rowData.igst = _.round(gst, 2)
            rowData.cgst = 0.0
            rowData.sgst = 0.0
        } else {
            rowData.igst = 0.0
            rowData.cgst = cgst
            rowData.sgst = sgst
        }
        rowData.actualSalePrice = _.round(actualSalePrice, 2)
        rowData.amount = amount
    }

    function computeSummary() {
        if (arbitraryData.lineItems.length === 0) {
            const summ = arbitraryData.summary
            summ.amount = 0.0
            summ.count = 0.0
            summ.discount = 0.0
            summ.qty = 0.0
            summ.cgst = 0
            summ.sgst = 0
            summ.igst = 0
        } else {
            arbitraryData.summary = arbitraryData.lineItems.reduce(
                (prev: any, curr: any) => {
                    prev.amount = +Big(curr.amount || 0).plus(
                        Big(prev.amount || 0)
                    )
                    prev.cgst = +Big(curr.cgst || 0).plus(Big(prev.cgst || 0))
                    prev.sgst = +Big(curr.sgst || 0).plus(Big(prev.sgst || 0))
                    prev.igst = +Big(curr.igst || 0).plus(Big(prev.igst || 0))
                    prev.discount = +Big(curr.discount || 0).plus(
                        Big(prev.discount || 0)
                    )
                    prev.qty = +Big(curr.qty).plus(Big(prev.qty))
                    return prev
                },
                { qty: 0 }
            )
            arbitraryData.summary.count = arbitraryData.lineItems.length
            arbitraryData.backCalulateAmount = arbitraryData.summary.amount
            if(arbitraryData.footer.items.length === 1){ // if footer has one row then set its amount
                arbitraryData.footer.items[0].amount = arbitraryData.summary.amount
            }
        }
        meta.current.isMounted && setRefresh({})
        emit('SALES-CROWN-REFRESH', null)
    }

    function getEmptyRowData() {
        return {
            amount: 0.0,
            cgst: 0.0,
            discount: 0.0,
            gstRate: 0.0,
            hsn: undefined,
            igst: 0.0,
            index: arbitraryData.lineItems.length + 1,
            isError: true,
            isGstInvoice: true, // Later on you can provide a checkbox for isGstInvoice. At present gst is true by default
            isSelected: false,
            lineRefNo: undefined,
            lineRemarks: undefined,
            price: 0.0,
            priceGst: 0.0,
            productCode: undefined,
            productDetails: undefined,
            serialNumbers: '',
            sgst: 0.0,
            qty: 1,
            upcCode: undefined,
        }
    }

    function getSlNoError(rowData: any) {
        function getCount() {            
            return rowData.serialNumbers.split(',').filter(Boolean).length
        }
        const ok = getCount() === rowData.qty || getCount() === 0
        return !ok
    }

    function handleAddItem() {
        const obj = getEmptyRowData()
        lineItems.push(obj)
        computeSummary()
    }

    function handleBackCalculate() {
        const defaultAmount = arbitraryData.backCalulateAmount
        if (defaultAmount === 0) {
            return
        }

        const factor: number = defaultAmount / arbitraryData.summary.amount
        for (let item of arbitraryData.lineItems) {
            item.price = item.price - (item.discount || 0)
            item.discount = 0.0
            item.price = item.price * factor
        }
        arbitraryData.backCalulateAmount =
            arbitraryData.summary.amount
        computeAllRows() // Does the entire calculation on each row
        computeSummary()
    }

    function handleDeleteItem(e: any, rowData: any) {
        const rowIndex = rowData.index - 1
        lineItems.splice(rowIndex, 1)
        if (rowData.id) {
            arbitraryData.deletedSalePurchaseIds.push(rowData.id) // deletion is actually done in table salePurchaseDetails
        }
        for (let i = 0; i < arbitraryData.lineItems.length; i++) {
            arbitraryData.lineItems[i].index = i + 1
        }
        computeSummary()
    }

    async function handleSearchOnProduct(rowData: any) {
        if (rowData.searchFilter) {
            meta.current.showDialog = true
            meta.current.dialogConfig.isSearchBox = true
            meta.current.dialogConfig.title = 'Product search results'
            meta.current.dialogConfig.searchBoxFilter = ''
            meta.current.searchFilter = rowData.searchFilter
            await searchProduct(rowData)
        } else {
            const opts: any = {
                description: messages.giveSearchCriteria,
                title: messages.emptySearchCriteria,
                cancellationText: undefined,
            }
            confirm(opts)
        }
    }

    function handleSerialNo(rowData: any) {
        meta.current.showDialog = true
        meta.current.dialogConfig.isSearchBox = false
        meta.current.dialogConfig.title = 'Serial numbers (Comma separated)'
        meta.current.dialogConfig.serialNumbers = rowData.serialNumbers || ''
        meta.current.dialogConfig.content = Content

        function Content() {
            const pre = meta.current.dialogConfig
            const met: any = useRef({
                slNo: pre.serialNumbers,
                count: pre.serialNumbers.split(',').filter(Boolean).length,
            })
            const [, setRefresh] = useState({})

            return (
                <div>
                    <Badge
                        color="secondary"
                        showZero={true}
                        badgeContent={met.current.count}></Badge>
                    <TextareaAutosize
                        autoFocus={true}
                        className="serial-number"
                        rowsMin={5}
                        onChange={(e: any) => {
                            met.current.slNo = e.target.value
                            processCount()
                        }}
                        value={met.current.slNo || ''}
                    />
                    <br></br>
                    <Button
                        style={{ float: 'right' }}
                        size="small"
                        color="primary"
                        variant="contained"
                        onClick={() => {
                            handleClose(met.current.slNo)
                        }}>
                        Ok
                    </Button>
                </div>
            )

            function processCount() {
                met.current.count = met.current.slNo
                    .split(',')
                    .filter(Boolean).length
                setRefresh({})
            }
        }

        meta.current.isMounted && setRefresh({})

        function handleClose(slNo: string) {
            const pre = meta.current.dialogConfig
            pre.serialNumbers = smoothOut(slNo)
            rowData.serialNumbers = JSON.parse(
                JSON.stringify(pre.serialNumbers)
            )
            meta.current.showDialog = false
            meta.current.isMounted && setRefresh({})
        }

        function smoothOut(str: string) {
            // removes out extra commas from string
            return str.split(',').filter(Boolean).toString()
        }
    }

    return {
        computeAllRows,
        computeRow,
        computeSummary,
        clearRow,
        getSlNoError,
        handleAddItem,
        handleBackCalculate,
        handleDeleteItem,
        handleSearchOnProduct,
        handleSerialNo,
        meta,
        searchProductOnProductCode,
        searchProductOnUpcCode,
    }
}

export { useSaleItems }

const useStyles: any = makeStyles((theme: Theme) =>
    createStyles({
        content: {
            marginTop: theme.spacing(1),
            '& .sale-items': {
                '& input': {
                    fontFamily: 'modern', // good font for numeric
                    fontSize: '0.9rem',
                },
                '& .index-header': {
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    '& .index': {
                        marginLeft:'0.2rem'
                    },
                    '& .add-box': {
                        position: 'relative',
                        left: '-0.9rem',
                        marginLeft: '0px',
                        '& .add-icon': {
                            fontSize: '2.2rem',
                            color: theme.palette.secondary.main,

                        },
                    },
                },
                '& .index-body': {
                    '& .delete-icon': {
                        fontSize: '1.5rem',
                        color: theme.palette.secondary.dark,
                    },
                    '&  .clear-icon': {
                        color: 'dodgerBlue',
                    },
                },
                '& .right-aligned-numeric': {
                    '& input': {
                        textAlign: 'end',
                    },
                },
                '& .center-aligned-numeric': {
                    '& input': {
                        textAlign: 'center',
                    },
                },
                '& .product-details': {
                    fontFamily: 'lato',
                    fontSize: '0.8rem',
                },
                '& .line-amount': {
                    fontSize: '1.0rem',
                    fontWeight: 'bold',
                    color: 'dodgerBlue',
                    margin: 0,
                    padding: 0,
                },
                '& .is-igst': {
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    marginTop: '0.8rem',
                    '& div': { fontSize: '0.7rem', marginTop: '-0.5rem' },
                },
                '& .gst-details': {
                    fontSize: '0.7rem',
                    color: theme.palette.grey[900],
                },
                '& .back-calculate': {
                    backgroundColor: 'dodgerBlue',
                    color: theme.palette.common.white,
                    textTransform: 'none',
                    fontSize:'0.8rem',
                },
                '& .total-amount':{
                    '& input': {
                        fontWeight: 'bold',
                        fontSize: '1rem',
                        color: 'dodgerBlue'
                    }
                    
                }
            },
        },
    })
)

export { useStyles }
