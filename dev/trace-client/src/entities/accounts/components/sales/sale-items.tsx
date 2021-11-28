import {
    clsx, NumberFormat, PrimeColumn, useContext,
    DataTable, useState
} from '../../../../imports/regular-imports'
import {
    Badge, Paper,
    Button,
    Checkbox, IconButton, TextField,
    Typography,
    Chip,
} from '../../../../imports/gui-imports'
import {
    AddCircle, Clear, ClearAll,
    Search,
    CloseSharp,
} from '../../../../imports/icons-import'
import { useSharedElements } from '../common/shared-elements-hook'
import { useSaleItems, useStyles } from './sale-items-hook'
import { MultiDataContext } from '../common/multi-data-bridge'

function SaleItems() {
    const [, setRefresh] = useState({})
    const classes = useStyles()
    const multiData: any = useContext(MultiDataContext)
    const arbitraryData: any = multiData.sales
    const {
        clearRow,
        computeAllRows,
        computeRow,
        computeSummary,
        getSlNoError,
        handleAddItem,
        handleBackCalculate,
        handleDeleteItem,
        handleSearchOnProduct,
        handleSerialNo,
        meta,
        searchProductOnProductCode,
    } = useSaleItems(arbitraryData)
    const lineItems = arbitraryData.lineItems

    const {
        debounceEmit,
        extractAmount,
        toDecimalFormat,
        TraceDialog,
    } = useSharedElements()

    return (
        <div className={classes.content}>
            <DataTable
                style={{ marginTop: 0 }}
                className="sale-items"
                rowHover={true}
                scrollable={true}
                scrollHeight="calc(100vh - 22rem)"
                value={arbitraryData.lineItems}>
                {getColumns()}
            </DataTable>
            <TraceDialog meta={meta} />
        </div>
    )

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

    function getColumns() {
        let numb = 0
        function incr() {
            // key generator
            return numb++
        }

        function setPrice(rowData: any) {
            const priceGst = rowData.priceGst
            const gstRate = rowData.gstRate
            const price = priceGst / (1 + (gstRate / 100))
            rowData.price = price
        }

        function setPriceGst(rowData: any) {
            const price = rowData.price
            const gstRate = rowData.gstRate
            const priceGst = price * (1 + (gstRate / 100))
            rowData.priceGst = priceGst
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
                            <span className="index">Index</span>
                        </IconButton>
                    </div>
                }
                body={(rowData: any) => (
                    <span className="index-body">
                        {rowData.index}
                        <IconButton
                            size="small"
                            onClick={(e: any) => {
                                handleDeleteItem(e, rowData)
                                meta.current.isMounted && setRefresh({})
                            }}
                            disabled={lineItems.length === 1 ? true : false}>
                            <CloseSharp className="delete-icon" />
                        </IconButton>
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

            //     Search
            <PrimeColumn
                key={incr()}
                style={{ width: '12rem' }}
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
                            autoFocus={true}
                            variant='standard'
                            style={{ maxWidth: '12rem' }}
                            placeholder="Product(abc, def,...)"
                            value={rowData.searchFilter || ''}
                            onKeyDown={(e: any) => {
                                if ((e.keyCode === 13) || (e.keyCode === 9)) { //enter
                                    handleSearchOnProduct(rowData)
                                } else if ([27].includes(e.keyCode)) { //ESC, TAB
                                    rowData.searchFilter = ''
                                    meta.current.isMounted && setRefresh({})
                                }
                            }}
                            onChange={(e) => {
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
                            placeholder="Upc"
                            variant='standard'
                            value={rowData.upcCode || ''}
                            onChange={(e: any) => {
                                rowData.upcCode = e.target.value
                                // meta.current.isDataChanged = true
                                meta.current.isMounted && setRefresh({})
                                if (rowData?.upcCode) {
                                    debounceEmit('DEBOUNCE-ON-CHANGE', { source: 'upcCode', value: rowData })
                                } else {
                                    clearRow(rowData)
                                }

                            }}
                            onKeyDown={(e: any) => {
                                if (e.keyCode === 13) {
                                    // if (rowData?.upcCode) {
                                    //     searchProductOnUpcCode(rowData)
                                    // } else {
                                    //     clearRow(rowData)
                                    // }
                                    // e.target.blur()
                                } else
                                    if (e.keyCode === 27) {
                                        rowData.upcCode = undefined
                                        meta.current.isMounted && setRefresh({})
                                    }
                            }}
                            // onBlur={(e: any) => {
                            //     if (meta.current.isDataChanged) {
                            //         meta.current.isDataChanged = false
                            //         searchProductOnUpcCode(rowData)
                            //     }
                            // }}
                            onFocus={(e) => {
                                // meta.current.isDataChanged = false
                                e.target.select()
                            }}
                        />
                    </div>
                )}
            />,

            // product code / hsn
            <PrimeColumn
                key={incr()}
                header="Product code / hsn"
                style={{ width: '10rem' }}
                body={(rowData: any) => (
                    <div>
                        <NumberFormat
                            placeholder="Product code"
                            allowNegative={false}
                            customInput={TextField}
                            error={rowData.productCode ? false : true}
                            onChange={(e: any) => {
                                rowData.productCode = e.target.value
                                // meta.current.isDataChanged = true
                                meta.current.isMounted && setRefresh({})
                                if (rowData.productCode) {
                                    debounceEmit('DEBOUNCE-ON-CHANGE', { source: 'productCode', value: rowData })
                                } else {
                                    clearRow(rowData)
                                }
                                arbitraryData.salesCrownRefresh()
                            }}
                            // onValueChange={(values: any) => {
                            //     const { value } = values
                            //     rowData.productCode = value
                            //     // meta.current.isDataChanged = true
                            //     meta.current.isMounted && setRefresh({})
                            //     if (rowData.productCode) {
                            //         debounceEmit('DEBOUNCE-ON-CHANGE', { source: 'productCode', value: rowData })
                            //     } else {
                            //         clearRow(rowData)
                            //     }
                            //     arbitraryData.salesCrownRefresh()
                            // }}
                            onFocus={(e) => {
                                // meta.current.isDataChanged = false
                                e.target.select()
                            }}
                            onKeyDown={(e: any) => {
                                if (e.keyCode === 13) {
                                    if (rowData.productCode) {
                                        searchProductOnProductCode(rowData)
                                    } else {
                                        clearRow(rowData)
                                    }
                                    // e.target.blur()
                                } else if (e.keyCode === 27) {
                                    rowData.productCode = undefined
                                    meta.current.isMounted && setRefresh({})
                                }
                            }}
                            // onBlur={(e: any) => {
                            //     if (meta.current.isDataChanged) {
                            //         meta.current.isDataChanged = false
                            //         searchProductOnProductCode(rowData)
                            //     }
                            // }}
                            value={rowData.productCode || ''}
                        />
                        {/* hsn */}
                        <NumberFormat
                            placeholder="Hsn"
                            allowNegative={false}
                            customInput={TextField}
                            error={rowData.hsn ? false : true}
                            onValueChange={(values: any) => {
                                const { value } = values
                                rowData.hsn = value
                                meta.current.isMounted && setRefresh({})
                                arbitraryData.salesCrownRefresh()
                                // emit('SALES-CROWN-REFRESH', null)
                            }}
                            value={rowData.hsn || ''}
                            onFocus={(e) => e.target.select()}
                        />
                    </div>
                )}
            />,

            //  Product details
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
                            error={rowData?.gstRate > 30 ? true : false}
                            customInput={TextField}
                            decimalScale={2}
                            fixedDecimalScale={true}
                            onValueChange={(values: any) => {
                                const { floatValue } = values
                                rowData.gstRate = floatValue || 0.0
                                computeRow(rowData)
                                computeSummary()
                                meta.current.isDataChanged = true
                                arbitraryData.salesCrownRefresh()
                                meta.current.isMounted && setRefresh({})
                            }}
                            onFocus={(e) => {
                                e.target.select()
                                meta.current.isDataChanged = false
                            }}
                            onKeyDown={(e: any) => {
                                if ([9, 13].includes(e.keyCode)) {
                                    meta.current.isDataChanged &&
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
                header="Qty"
                style={{ width: '5rem', textAlign: 'center' }}
                body={(rowData: any) => {
                    return (
                        <NumberFormat
                            allowNegative={false}
                            className="center-aligned-numeric"
                            customInput={TextField}
                            error={rowData.qty ? undefined : true}
                            onValueChange={(values: any) => {
                                //using onChange event stores formatted value
                                const { floatValue } = values
                                rowData.qty = floatValue || 0.0
                                computeRow(rowData)
                                computeSummary()
                                arbitraryData.salesCrownRefresh()
                            }}
                            onFocus={(e) => {
                                e.target.select()
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
                            allowNegative={false}
                            className="right-aligned-numeric"
                            customInput={TextField}
                            decimalScale={2}
                            fixedDecimalScale={true}
                            onChange={(e: any) => {
                                const price = extractAmount(e.target.value)
                                rowData.price = price || 0.0
                                meta.current.isDataChanged = true
                                setPriceGst(rowData)
                                computeRow(rowData)
                                computeSummary()
                                arbitraryData.salesCrownRefresh()
                                meta.current.isMounted && setRefresh({})
                            }}
                            // onValueChange={(values: any) => {
                            //     const { floatValue } = values
                            //     rowData.price = floatValue || 0.0
                            //     meta.current.isDataChanged = true
                            //     // meta.current.isPriceChanged = true
                            //     // if (meta.current.isPriceGstChanged) {
                            //     //     meta.current.isPriceGstChanged = false
                            //     // } else {
                            //         setPriceGst(rowData)
                            //     // }
                            //     computeRow(rowData)
                            //     computeSummary()
                            //     arbitraryData.salesCrownRefresh()
                            //     meta.current.isMounted && setRefresh({})
                            // }}
                            onFocus={(e) => {
                                e.target.select()
                                meta.current.isDataChanged = false
                            }}
                            onKeyDown={(e: any) => {
                                if ([9, 13].includes(e.keyCode)) {
                                    if (meta.current.isDataChanged) {
                                        setPriceGst(rowData)
                                        computeRow(rowData)
                                    }
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
                field="priceGst"
                header="Price (Gst)"
                style={{ width: '8rem', textAlign: 'end' }}
                body={(rowData: any) => {
                    return (
                        <NumberFormat
                            allowNegative={false}
                            className="right-aligned-numeric"
                            customInput={TextField}
                            decimalScale={2}
                            fixedDecimalScale={true}
                            onChange={(e: any) => {
                                const priceGst = extractAmount(e.target.value)
                                rowData.priceGst = priceGst || 0.0
                                meta.current.isDataChanged = true
                                setPrice(rowData)
                                computeRow(rowData)
                                computeSummary()
                                arbitraryData.salesCrownRefresh()
                                meta.current.isMounted && setRefresh({})
                            }}
                            onValueChange={(values: any) => {
                                // const { floatValue } = values
                                // rowData.priceGst = floatValue || 0.0
                                // meta.current.isDataChanged = true
                                //     // meta.current.isPriceGstChanged = true
                                //     // if (meta.current.isPriceChanged) {
                                //     //     meta.current.isPriceChanged = false
                                //     // } else {
                                //         // setPrice(rowData) // sets the price based on priceGst and gstRate
                                //     // }
                                // computeRow(rowData)
                                // computeSummary()
                                // arbitraryData.salesCrownRefresh()
                                // meta.current.isMounted && setRefresh({})
                            }}

                            onFocus={(e) => {
                                e.target.select()
                                meta.current.isDataChanged = false
                            }}
                            onKeyDown={(e: any) => {
                                if ([9, 13].includes(e.keyCode)) {
                                    if (meta.current.isDataChanged) {
                                        setPrice(rowData)
                                        computeRow(rowData)
                                    }
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
                header="Discount / unit"
                style={{ width: '8rem', textAlign: 'end' }}
                body={(rowData: any) => {
                    return (
                        <NumberFormat
                            allowNegative={false}
                            className="right-aligned-numeric"
                            customInput={TextField}
                            decimalScale={2}
                            fixedDecimalScale={true}
                            onValueChange={(values: any) => {
                                const { floatValue } = values
                                meta.current.isDataChanged = true
                                rowData.discount = floatValue || 0.0
                                computeRow(rowData)
                                computeSummary()
                                arbitraryData.salesCrownRefresh()
                                meta.current.isMounted && setRefresh({})
                            }}
                            onFocus={(e) => {
                                e.target.select()
                                meta.current.isDataChanged = false
                            }}

                            onKeyDown={(e: any) => {
                                if ([9, 13].includes(e.keyCode)) {
                                    meta.current.isDataChanged &&
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
                    <div>
                        <div className="line-amount">
                            {toDecimalFormat(rowData.amount)}
                        </div>
                        <GstDetails rowData={rowData} />
                    </div>
                )}
                footer={
                    <div>
                        <div className="line-amount">
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
                body={(rowData: any) => {
                    return (
                        <div>
                            {/* Boolean keyword removes falsy values from array */}
                            <Badge
                                badgeContent={
                                    rowData.serialNumbers
                                        .split(',')
                                        .filter(Boolean).length
                                }
                                color={
                                    getSlNoError(rowData)
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
                                variant='standard'
                                value={rowData.remarks || ''}
                                onChange={(e: any) => {
                                    rowData.remarks = e.target.value
                                    arbitraryData.salesCrownRefresh()
                                    meta.current.isMounted && setRefresh({})
                                }}
                                onFocus={(e) => {
                                    e.target.select()
                                }}
                            />
                        </div>
                    )
                }}
                footer={
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            rowGap: '1rem',
                        }}>
                        <NumberFormat
                            allowNegative={false}
                            className={clsx(
                                'right-aligned-numeric',
                                'total-amount'
                            )}
                            customInput={TextField}
                            decimalScale={2}
                            fixedDecimalScale={true}
                            onFocus={(e) => {
                                e.target.select()
                            }}
                            onKeyDown={(e: any) => {
                                if (e.keyCode === 13) {
                                    handleBackCalculate()
                                }
                            }}
                            onValueChange={(values: any) => {
                                //using onChange event stores formatted value
                                const { floatValue } = values
                                arbitraryData.backCalulateAmount = floatValue
                                meta.current.isMounted && setRefresh({})
                            }}
                            thousandSeparator={true}
                            value={arbitraryData.backCalulateAmount || 0.0}
                        />
                        <Button
                            variant="contained"
                            size="small"
                            className="back-calculate"
                            onClick={handleBackCalculate}>
                            Back Cal
                        </Button>
                    </div>
                }
            />,
        ]
    }
}

export { SaleItems }
