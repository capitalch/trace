import {
    Big,
    NumberFormat,
    PrimeColumn,
    useState,
    useEffect,
    useRef,
} from '../../../../imports/regular-imports'
import {
    Box,
    makeStyles,
    Theme,
    createStyles,
    Badge,
    TextField,
    IconButton,
    TextareaAutosize,
    Button,
    Typography,
    Checkbox,
    Chip,
} from '../../../../imports/gui-imports'
import {
    AddCircle,
    Search,
    ClearAll,
    CloseSharp,
} from '../../../../imports/icons-import'
import { useSharedElements } from '../common/shared-elements-hook'
import { useProductUtils } from '../common/product-utils-hook'

function usePurchaseItems(arbitraryData: any) {
    const [, setRefresh] = useState({})
    const errorObject = arbitraryData.errorObject
    const {
        confirm,
        debounceEmit,
        debounceFilterOn,
        emit,
        extractAmount,
        filterOn,
        messages,
        toDecimalFormat,
    } = useSharedElements()

    useEffect(() => {
        const curr = meta.current
        curr.isMounted = true
        arbitraryData.summary = {
            gst: {
                cgst: 0.0,
                sgst: 0.0,
                igst: 0.0,
            },
            subTotal: 0.0,
            discount: 0.0,
            qty: 0,
            count: 1,
        }
        const subs1 = filterOn('PURCHASE-ITEMS-COMPUTE-ALL-ROWS').subscribe(
            (d) => {
                computeAllRows()
                computeSummary()
            }
        )
        const subs2 = filterOn('PURCHASE-ITEMS-REFRESH').subscribe(() => {
            curr.isMounted && setRefresh({})
        })

        const subs3 = debounceFilterOn('DEBOUNCE-ON-CHANGE', 1200).subscribe(
            (d: any) => {
                if (d.data.source === 'upcCode') {
                    searchProductOnUpcCode(d.data.value)
                } else if (d.data.source === 'productCode') {
                    searchProductOnProductCode(d.data.value)
                }
            }
        )
        return () => {
            curr.isMounted = false
            subs1.unsubscribe()
            subs2.unsubscribe()
            subs3.unsubscribe()
        }
    }, [])

    useEffect(() => {
        if (arbitraryData.lineItems.length === 0) {
            handleAddItem()
        }
    }, [arbitraryData.lineItems.length])

    const meta: any = useRef({
        tranType: 'purchase',
        dialogConfig: {
            title: '',
            content: () => { },
            actions: () => { },
            serialNumbers: '',
        },
        isMounted: false,
        searchFilter: '',
        showDialog: false,
        zoomIn: true,
    })

    const {
        searchProduct,
        searchProductOnProductCode,
        searchProductOnUpcCode,
    } = useProductUtils(meta)

    function getEmptyRowData() {
        return {
            amount: 0.0,
            cgst: 0.0,
            discount: 0.0,
            errorsObject: {
                qtyError: undefined,
                discountError: undefined,
                gstRateError: undefined,
                productCodeError: true,
                hsnError: true,
                slNoError: undefined,
            },
            gstRate: 0.0,
            gstRateCopy: 0.0,
            hsn: undefined,
            igst: 0.0,
            index: arbitraryData.lineItems.length + 1,
            isError: true,
            isGstInvoice: arbitraryData.isGstInvoice,
            isSelected: false,
            lineRefNo: undefined,
            lineRemarks: undefined,
            price: 0.0,
            priceGst: 0.0,
            productCode: undefined,
            productDetails: undefined,
            serialNumbers: '',
            sgst: 0.0,
            subTotal: 0.0,
            qty: 1,
            upcCode: undefined,
        }
    }

    function handleAddItem() {
        const obj = getEmptyRowData()
        arbitraryData.lineItems.push(obj)
        arbitraryData.summary.count = arbitraryData.lineItems.length
        computeSummary()
        emit('PURCHASE-BODY-SUBMIT-REFRESH', null)
        meta.current.isMounted && setRefresh({})
    }

    function clearObject(rowData: any) {
        rowData.upcCode = undefined
        rowData.productCode = undefined
        rowData.hsn = undefined
        rowData.productDetails = undefined
        rowData.gstRate = 0.0
        rowData.qty = 1
        rowData.price = 0.0
        rowData.discount = 0.0
        rowData.amount = 0.0
        rowData.lineRefNo = undefined
        rowData.serialNumbers = ''
    }

    function clearRow(rowData: any) {
        clearObject(rowData)
        meta.current.isMounted && setRefresh({})
    }

    function computeAllRows() {
        const as = arbitraryData.summary
        if (arbitraryData.lineItems.length === 0) {
            as.cgst = 0.0
            as.sgst = 0.0
            as.igst = 0.0
        } else {
            for (let rowData of arbitraryData.lineItems) {
                computeRow(rowData)
            }
        }
    }

    function computeRow(rowData: any) {
        const actualPrice = +Big(rowData.price).minus(Big(rowData.discount))
        rowData.subTotal = +Big(rowData.qty).mul(actualPrice)
        rowData.priceGst = rowData.price * (1 + rowData.gstRate / 100)
        if (arbitraryData.isIgst) {
            rowData.cgst = 0.0
            rowData.sgst = 0.0
            rowData.igst = +Big(rowData.subTotal)
                .mul(Big(rowData.gstRate))
                .div(Big(100))
            rowData.amount = +Big(rowData.subTotal).plus(rowData.igst)
        } else {
            rowData.igst = 0.0
            rowData.cgst = +Big(rowData.subTotal)
                .mul(Big(rowData.gstRate))
                .div(Big(200))
            rowData.sgst = rowData.cgst
            rowData.amount = +Big(rowData.subTotal)
                .plus(rowData.cgst)
                .plus(rowData.sgst)
        }
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
            summ.subTotal = 0.0
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
                    prev.subTotal = +Big(curr.subTotal || 0).plus(
                        Big(prev.subTotal || 0)
                    )
                    prev.qty = +Big(curr.qty).plus(Big(prev.qty))
                    return prev
                },
                { qty: 0 }
            )
            arbitraryData.summary.count = arbitraryData.lineItems.length
        }
        emit('PURCHASE-BODY-SUBMIT-REFRESH', null)
    }

    function handleDelete(e: any, rowData: any) {
        const rowIndex = rowData.index - 1
        arbitraryData.lineItems.splice(rowIndex, 1)
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
                        minRows={5}
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

            function smoothOut(str: string) {
                // removes out extra commas from string [,,1,,,4,3].filter(Boolean) yields [1,4,3]
                return str.split(',').filter(Boolean).toString()
            }
        }
    }

    function IsIgst() {
        return (
            <div className="is-igst">
                <Checkbox
                    checked={arbitraryData.isIgst}
                    onChange={(e: any) => {
                        arbitraryData.isIgst = e.target.checked
                        computeAllRows()
                        computeSummary()
                        meta.current.isMounted && setRefresh({})
                    }}
                    size="small"
                />
                <div>Igst</div>
            </div>
        )
    }

    function GstDetails({ rowData }: any) {
        return (
            <Typography
                component="span"
                variant="body2"
                className="gst-details">{`Cgst: ${toDecimalFormat(
                    rowData?.cgst
                )}, Sgst: ${toDecimalFormat(rowData?.sgst)}, Igst:${toDecimalFormat(
                    rowData?.igst
                )},`}</Typography>
        )
    }

    function getColumns() {
        let numb = 0
        function incr() {
            // key generator
            return numb++
        }
        return [
            // Index
            <PrimeColumn
                key={incr()}
                style={{ width: '6rem', textAlign: 'right' }}
                header={
                    <div className="index-header">
                        <IconButton
                            className="add-box"
                            aria-label="add"
                            size="small"
                            onClick={handleAddItem}>
                            <AddCircle className="add-icon" />
                        </IconButton>
                        <span className="index">Index</span>
                    </div>
                }
                body={(rowData: any) => (
                    <span>
                        <IconButton
                            size="small"
                            onClick={(e: any) => {
                                handleDelete(e, rowData)
                                meta.current.isMounted && setRefresh({})
                            }}
                            disabled={
                                arbitraryData.lineItems.length === 1
                                    ? true
                                    : false
                            }>
                            <CloseSharp className="delete-icon" />
                        </IconButton>
                        {rowData.index}
                        <IconButton
                            size="small"
                            onClick={() => {
                                clearRow(rowData)
                            }}>
                            <ClearAll className="clear-icon" />
                        </IconButton>
                    </span>
                )}
                footer={arbitraryData?.summary?.count || 1}
            />,
            // Search
            <PrimeColumn
                key={incr()}
                style={{ width: '10rem' }}
                header={
                    <div className="search-header">
                        <Typography
                            style={{ fontWeight: 'bold', marginTop: '3px' }}
                            variant="body1">
                            Search
                        </Typography>
                    </div>
                }
                body={(rowData: any) => (
                    <div>
                        {/* product search */}
                        <TextField
                            autoComplete='off'
                            // autoFocus={true}
                            variant="standard"
                            style={{ maxWidth: '12rem' }}
                            placeholder="Product(abc, def,...)"
                            value={rowData.searchFilter || ''}
                            onKeyDown={(e: any) => {
                                if (e.keyCode === 13) {
                                    handleSearchOnProduct(rowData)
                                } else if ([27, 9].includes(e.keyCode)) {
                                    rowData.searchFilter = ''
                                    meta.current.isMounted && setRefresh({})
                                }
                            }}
                            onChange={(e: any) => {
                                rowData.searchFilter = e.target.value
                                meta.current.isMounted && setRefresh({})
                            }}
                            InputProps={{
                                endAdornment: (
                                    <>
                                        <IconButton
                                            size="small"
                                            onClick={() =>
                                                handleSearchOnProduct(rowData)
                                            }>
                                            <Search />
                                        </IconButton>
                                    </>
                                ),
                            }}
                        />
                        {/* upc */}
                        <TextField
                            autoComplete='off'
                            placeholder="Upc"
                            sx={{ mt: 1 }}
                            variant="standard"
                            value={rowData.upcCode || ''}
                            onChange={(e: any) => {
                                rowData.upcCode = e.target.value
                                rowData.isGstInvoice =
                                    arbitraryData.isGstInvoice
                                meta.current.isMounted && setRefresh({})
                                if (rowData?.upcCode) {
                                    debounceEmit('DEBOUNCE-ON-CHANGE', {
                                        source: 'upcCode',
                                        value: rowData,
                                    })
                                } else {
                                    clearRow(rowData)
                                }
                            }}
                            onFocus={(e: any) => {
                                e.target.select()
                            }}
                            onKeyDown={(e: any) => {
                                if (e.keyCode === 13) {
                                } else if (e.keyCode === 27) {
                                    rowData.upcCode = undefined
                                    meta.current.isMounted && setRefresh({})
                                }
                            }}
                        />
                    </div>
                )}
            />,

            // product code / hsn
            <PrimeColumn
                key={incr()}
                header="Prod code / hsn"
                style={{ width: '10rem' }}
                body={(rowData: any) => (
                    <div>
                        <NumberFormat
                            autoComplete='off'
                            placeholder="Product code"
                            allowNegative={false}
                            customInput={TextField}
                            variant="standard"
                            error={errorObject.isProductCodeError(rowData)}
                            onChange={(e: any) => {
                                rowData.productCode = e.target.value
                                meta.current.isMounted && setRefresh({})
                                if (rowData.productCode) {
                                    debounceEmit('DEBOUNCE-ON-CHANGE', {
                                        source: 'productCode',
                                        value: rowData,
                                    })
                                } else {
                                    clearRow(rowData)
                                }
                            }}
                            onFocus={(e: any) => {
                                e.target.select()
                            }}
                            onKeyDown={(e: any) => {
                                if (e.keyCode === 13) {
                                    searchProductOnProductCode(rowData)
                                } else if (e.keyCode === 27) {
                                    clearRow(rowData)
                                }
                            }}
                            value={rowData.productCode || ''}
                        />
                        {/* hsn */}
                        <NumberFormat
                            autoComplete='off'
                            placeholder="Hsn"
                            sx={{ mt: 1 }}
                            allowNegative={false}
                            customInput={TextField}
                            variant="standard"
                            error={errorObject.isHsnError(rowData)}
                            onValueChange={(values: any) => {
                                const { value } = values
                                rowData.hsn = value
                                meta.current.isMounted && setRefresh({})
                            }}
                            value={rowData.hsn || ''}
                            onFocus={(e: any) => e.target.select()}
                        />
                    </div>
                )}
            />,
            // Product details
            <PrimeColumn
                key={incr()}
                header="Product details"
                style={{ width: '10rem' }}
                body={(rowData: any) => (
                    <Typography className="product-details">
                        {rowData.productDetails}
                    </Typography>
                )}
            />,

            // Gst (%)
            <PrimeColumn
                key={incr()}
                header="Gst(%)"
                style={{ width: '5rem' }}
                body={(rowData: any) => (
                    <div>
                        <NumberFormat
                            allowNegative={false}
                            className="right-aligned-numeric"
                            customInput={TextField}
                            decimalScale={2}
                            variant="standard"
                            error={errorObject.isGstRateError(rowData)}
                            fixedDecimalScale={true}
                            onValueChange={(values: any) => {
                                const { floatValue } = values
                                rowData.gstRate = floatValue || 0.0
                                meta.current.isDataChanged = true
                                computeRow(rowData)
                                computeSummary()
                                meta.current.isMounted && setRefresh({})
                            }}
                            onFocus={(e: any) => {
                                e.target.select()
                            }}
                            onKeyDown={(e: any) => {
                                if ([9, 13].includes(e.keyCode)) {
                                    computeRow(rowData)
                                    computeSummary()
                                    meta.current.isDataChanged = false
                                }
                            }}
                            value={rowData.gstRate || 0.0}
                        />
                    </div>
                )}
                footer="Total:"
            />,
            //qty
            <PrimeColumn
                key={incr()}
                field="qty"
                style={{ width: '5rem', textAlign: 'center' }}
                header="Qty"
                body={(rowData: any) => {
                    return (
                        <NumberFormat
                            variant="standard"
                            allowNegative={false}
                            className="center-aligned-numeric"
                            customInput={TextField}
                            error={errorObject.isQtyError(rowData)}
                            fixedDecimalScale={false}
                            onValueChange={(values: any) => {
                                //using onChange event stores formatted value
                                const { floatValue } = values
                                rowData.qty = floatValue || 0.0
                                meta.current.isDataChanged = true
                                computeRow(rowData)
                                computeSummary()
                                meta.current.isMounted && setRefresh({})
                            }}
                            onFocus={(e: any) => {
                                e.target.select()
                            }}
                            onKeyDown={(e: any) => {
                                if ([9, 13].includes(e.keyCode)) {
                                    computeRow(rowData)
                                    computeSummary()
                                    meta.current.isDataChanged = false
                                }
                            }}
                            thousandSeparator={true}
                            value={rowData.qty || 0.0}
                        />
                    )
                }}
                footer={arbitraryData?.summary?.qty || 0}
            />,
            //price
            <PrimeColumn
                key={incr()}
                field="price"
                header="Price"
                style={{ width: '8rem', textAlign: 'end' }}
                body={(rowData: any) => {
                    return (
                        <NumberFormat
                            variant='standard'
                            allowNegative={false}
                            className="right-aligned-numeric"
                            customInput={TextField}
                            decimalScale={2}
                            error={errorObject.isDiscountError(rowData)}
                            fixedDecimalScale={true}
                            onValueChange={(values: any) => {
                                //using onChange event stores formatted value
                                const { floatValue } = values
                                rowData.price = floatValue || 0.0
                                meta.current.isDataChanged = true
                                computeRow(rowData)
                                computeSummary()
                                meta.current.isMounted && setRefresh({})
                            }}
                            onFocus={(e: any) => {
                                e.target.select()
                            }}
                            onKeyDown={(e: any) => {
                                if ([9, 13].includes(e.keyCode)) {
                                    computeRow(rowData)
                                    computeSummary()
                                    meta.current.isDataChanged = false
                                }
                            }}
                            thousandSeparator={true}
                            value={rowData.price || 0.0}
                        />
                    )
                }}
                footer=""
            />,
            //price(GST)
            <PrimeColumn
                key={incr()}
                field="price"
                header="Price (Gst)"
                style={{ width: '8rem', textAlign: 'end' }}
                body={(rowData: any) => {
                    return (
                        <NumberFormat
                            allowNegative={false}
                            variant='standard'
                            className="right-aligned-numeric"
                            customInput={TextField}
                            decimalScale={2}
                            isNumericString={true}
                            error={errorObject.isDiscountError(rowData)}
                            fixedDecimalScale={true}
                            onValueChange={(values: any) => {
                                const { floatValue } = values
                                rowData.priceGst = floatValue || 0.0
                                meta.current.isDataChanged = true
                                meta.current.isMounted && setRefresh({})
                            }}
                            onFocus={(e: any) => {
                                e.target.select()
                                meta.current.isDataChanged = false
                            }}
                            onBlur={(e: any) => {
                                rowData.price =
                                    +extractAmount(e.target.value) /
                                    (1 + rowData.gstRate / 100)
                                computeRow(rowData)
                                computeSummary()
                                meta.current.isMounted && setRefresh({})
                                meta.current.isDataChanged = false
                            }}
                            onKeyDown={(e: any) => {
                                if ([9, 13].includes(e.keyCode)) {
                                    computeRow(rowData)
                                    computeSummary()
                                    meta.current.isDataChanged = false
                                }
                            }}
                            thousandSeparator={true}
                            value={rowData.priceGst || 0.0}
                        />
                    )
                }}
                footer=""
            />,
            // discount
            <PrimeColumn
                key={incr()}
                field="discount"
                header="Discount"
                style={{ width: '7rem', textAlign: 'end' }}
                body={(rowData: any) => {
                    return (
                        <NumberFormat
                            allowNegative={false}
                            variant='standard'
                            className="right-aligned-numeric"
                            customInput={TextField}
                            decimalScale={2}
                            error={errorObject.isDiscountError(rowData)}
                            fixedDecimalScale={true}
                            onValueChange={(values: any) => {
                                const { floatValue } = values
                                meta.current.isDataChanged = true
                                rowData.discount = floatValue || 0.0
                                computeRow(rowData)
                                computeSummary()
                                meta.current.isMounted && setRefresh({})
                            }}
                            onFocus={(e: any) => {
                                e.target.select()
                                meta.current.isDataChanged = false
                            }}
                            onKeyDown={(e: any) => {
                                if ([9, 13].includes(e.keyCode)) {
                                    computeRow(rowData)
                                    computeSummary()
                                    meta.current.isDataChanged = false
                                }
                            }}
                            thousandSeparator={true}
                            value={rowData.discount || 0.0}
                        />
                    )
                }}
                footer={toDecimalFormat(
                    arbitraryData?.summary?.discount || 0.0
                )}
            />,

            //Sub total
            <PrimeColumn
                key={incr()}
                field="subTotal"
                header="Sub total"
                style={{ width: '8rem', textAlign: 'end' }}
                body={(rowData: any) => {
                    return (
                        <Typography sx={{ ml: 'auto' }} >{toDecimalFormat(rowData.subTotal) || 0.0}</Typography>
                    )
                }}
                footer={toDecimalFormat(
                    arbitraryData?.summary?.subTotal || 0.0
                )}
            />,
            //Amount / gst
            <PrimeColumn
                key={incr()}
                style={{ width: '12rem', textAlign: 'end' }}
                header={
                    <span
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            columnGap: '0.2rem',
                        }}>
                        <IsIgst />
                        <label>Amount / Gst</label>
                    </span>
                }
                body={(rowData: any) => (
                    // cgst
                    <div>
                        <div className="line-amount">
                            {toDecimalFormat(rowData.amount)}
                        </div>
                        <GstDetails rowData={rowData} />
                        <Button
                            style={{ padding: '.6rem', marginLeft: '.2rem' }}
                            color="primary"
                            variant="text"
                            size="small"
                            onClick={() => {
                                computeRow(rowData)
                                computeSummary()
                                meta.current.isMounted && setRefresh({})
                            }}>
                            Recalc
                        </Button>
                    </div>
                )}
                footer={
                    <div>
                        <div>
                            {toDecimalFormat(arbitraryData?.summary?.amount)}
                        </div>
                        <GstDetails rowData={arbitraryData.summary} />
                    </div>
                }
            />,

            // serial / remarks (stored in jData)
            <PrimeColumn
                key={incr()}
                header="Serial / remarks"
                // style={{ width: '8rem' }}
                body={(rowData: any) => {
                    return (
                        <Box >
                            {/* Boolean keyword removes falsy values from array */}
                            <Badge
                                badgeContent={
                                    rowData.serialNumbers
                                        .split(',')
                                        .filter(Boolean).length // .filter(Boolean) removes empty values from the array
                                }

                                color={
                                    errorObject.isSlNoError(rowData)
                                        ? 'error'
                                        : 'secondary'
                                }
                                showZero={true}>
                                <Chip
                                    size="small"
                                    label="Serial no's"
                                    color="primary"
                                    onClick={() => handleSerialNo(rowData)}
                                />
                            </Badge>
                            <TextField
                                placeholder="Remarks"
                                variant="standard"
                                autoComplete='off'
                                sx={{ mt: 1 }}
                                value={rowData.remarks || ''}
                                onChange={(e: any) => {
                                    rowData.remarks = e.target.value
                                    meta.current.isMounted && setRefresh({})
                                }}
                                onFocus={(e: any) => {
                                    e.target.select()
                                }}
                            />
                        </Box>
                    )
                }}
            />,
        ]
    }

    return {
        getColumns,
        handleAddItem,
        meta,
    }
}

export { usePurchaseItems }

const useStyles: any = makeStyles((theme: Theme) =>
    createStyles({
        content: { // This error goes away when following errors in comments are removed
            marginTop: theme.spacing(4),
            position: 'relative',
            zIndex: 0, //without zIndex: 0 the purchase items grid come to front and it covers the ledger-subledger drop down list
            top: (meta: any) => (meta.current.zoomIn ? '0rem' : '-13rem'),

            '& .search-header': {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
            },
            '& .items': {
                '& .delete-icon': {
                    fontSize: '1.5rem',
                    color: theme.palette.secondary.main,
                },
                '& .clear-icon': {
                    color: theme.palette.blue.main,
                },
                '& .close-icon': {
                    fontSize: '0.8rem',
                    color: theme.palette.secondary.main,
                },
                '& .right-aligned-numeric': {
                    '& input': {
                        textAlign: 'end', // error
                    },
                },
                '& .center-aligned-numeric': {
                    '& input': {
                        textAlign: 'center', // error
                    },
                },

                '& input': {
                    fontFamily: 'Helvetica', // good font for numeric
                    color: theme.palette.common.black
                },
                '& .product-details': {
                    fontFamily: 'lato',
                    fontSize: '0.8rem',
                },
                '& .index-header': {
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    '& .index': {
                        position: 'relative', // error
                        left: '-0.8rem',
                    },
                    '& .add-box': {
                        position: 'relative', // error
                        left: '-0.8rem',
                        marginLeft: '0px',
                        '& .add-icon': {
                            fontSize: '2.2rem',
                            color: theme.palette.secondary.main,
                        },
                    },
                },
            },

            '& .line-amount': {
                fontWeight: 'bold',
                color: 'dodgerBlue',
            },
            '& .gst-details': {
                fontSize: '0.8rem',
                color: theme.palette.grey[900],
            },
            '& .is-igst': {
                display: 'flex',
                // flexDirection: 'column',
                alignItems: 'center',
                marginTop: '0.8rem',
                '& div': { fontSize: '0.8rem', marginTop: '-0.5rem' },
            },

            '& .gst-footer': {
                fontSize: '0.8rem',
                display: 'flex',
                flexWrap: 'wrap',
                fontWeight: 'bold',
                columnGap: theme.spacing(0.2),
            },

            '& .gst-adorement': {
                fontSize: '0.8rem',
            },
        },
    })
)

export { useStyles }