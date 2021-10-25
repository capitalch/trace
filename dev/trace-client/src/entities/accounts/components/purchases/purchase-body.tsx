import {
    NumberFormat,
    useState,
    useEffect,
    useContext,
} from '../../../../imports/regular-imports'
import {
    Button,
    Typography,
    Checkbox,
    FormControlLabel,
    InputAdornment,
    Radio,
    TextField,
} from '../../../../imports/gui-imports'
import { Error, Check } from '../../../../imports/icons-import'
import { useSharedElements } from '../common/shared-elements-hook'
import { usePurchaseBody, useStyles } from './purchase-body-hook'
import { LedgerSubledger } from '../../../../imports/trace-imports'
import { PurchaseInvoiceNoSelect } from './purchase-invoice-no-select'
// import { ClearAll } from '../../../../imports/icons-import'
// import { PurchasesContext } from './purchases-provider'
import { MultiDataContext } from '../common/multi-data-bridge'

function PurchaseBody({ purchaseType }: any) {
    //purchaseType is 'pur' for purchase and 'ret' for purchase return
    const [, setRefresh] = useState({})
    const classes = useStyles()
    const multiData: any = useContext(MultiDataContext)
    const ad = multiData.purchases
    const errorObject = ad.errorObject
    const {
        // allErrorMethods,
        // getError,
        // handleClear,
        handleIsGstInvoice,
        preHandlePurchaseCashCredit,
        handleSubmit,
        meta,
        queryGstin,
    } = usePurchaseBody(ad, purchaseType)
    // const {
    //     getDateError,
    //     getGstError,
    //     getGstinError,
    //     getInvoiceError,
    //     getInvoiceAmountError,
    //     getOtherAccountError,
    //     getPurchaseAccountError,
    //     getQtyError,
    // } = allErrorMethods()

    const { accountsMessages, emit, getMappedAccounts, filterOn, TraceDialog } =
        useSharedElements()

    return (
        <div className={classes.content}>
            {purchaseType === 'pur' ? (
                <PurchaseBodyLine1 />
            ) : (
                <AssignmentReturnedBodyLine1 />
            )}
            {purchaseType === 'pur' ? (
                <PurchaseBodyLine2 />
            ) : (
                <AssignmentReturnedBodyLine2 />
            )}
            <TraceDialog meta={meta} />
        </div>
    )

    function SubmitComponent() {
        const [, setRefresh] = useState({})
        useEffect(() => {
            const subs1 = filterOn('PURCHASE-BODY-SUBMIT-REFRESH').subscribe(
                () => {
                    setRefresh({})
                }
            )
            return () => {
                subs1.unsubscribe()
            }
        }, [])
        const isError: boolean = errorObject?.isError
            ? ad.errorObject.isError()
            : true //getError()
        return (
            <Button
                className="submit"
                variant="contained"
                size="small"
                color="secondary"
                onClick={handleSubmit}
                startIcon={
                    isError ? (
                        <Error color="error" />
                    ) : (
                        <Check style={{ color: 'white' }} />
                    )
                }
                disabled={isError}>
                Submit
            </Button>
        )
    }

    function PurchaseBodyLine1() {
        const [, setRefresh] = useState({})
        return (
            <div className="body-line-1">
                {/* auto ref no */}
                <TextField
                    className="auto-ref-no"
                    variant="standard"
                    disabled={true}
                    label="Ref no"
                    value={ad?.autoRefNo || ''}
                />
                {/* date */}
                <TextField
                    label={ad.tranDate ? 'Date' : undefined}
                    variant="standard"
                    error={
                        errorObject?.isDateError
                            ? errorObject.isDateError()
                            : true
                    }
                    helperText={(() => {
                        let ret
                        if (errorObject.isDateError) {
                            if (errorObject.isDateError()) {
                                ret = 'Date range / Audit lock error'
                            }
                        } else {
                            ret = 'Date range / Audit lock error'
                        }
                        return ret
                    })()}
                    type="date"
                    onChange={(e: any) => {
                        ad.tranDate = e.target.value
                        setRefresh({})
                    }}
                    onFocus={(e) => e.target.select()}
                    value={ad.tranDate || ''}
                />
                {/* invoice no  */}
                <TextField
                    label="Invoice no"
                    variant="standard"
                    className="invoice-no"
                    error={
                        errorObject.isInvoiceError
                            ? errorObject.isInvoiceError()
                            : true
                    }
                    onChange={(e: any) => {
                        ad.userRefNo = e.target.value
                        setRefresh({})
                    }}
                    value={ad.userRefNo || ''}
                />
                {/* remarks */}
                <TextField
                    label="Common remarks"
                    variant="standard"
                    className="common-remarks"
                    onChange={(e: any) => {
                        ad.commonRemarks = e.target.value
                        setRefresh({})
                    }}
                    value={ad.commonRemarks || ''}
                />

                <PurchaseCashCredit />

                {/* gst invoice  */}
                <FormControlLabel
                    className="gst-invoice"
                    control={
                        <Checkbox
                            checked={ad.isGstInvoice}
                            onChange={handleIsGstInvoice}
                        />
                    }
                    label="Gst invoice"
                />
                <SubmitComponent />
            </div>
        )
    }

    function PurchaseBodyLine2() {
        const [, setRefresh] = useState({})
        return (
            <div className="body-line-2">
                <div className="left">
                    <div>
                        <Typography variant="caption">Purchase a/c</Typography>
                        {/* purchase */}
                        <LedgerSubledger
                            // allAccounts={meta.current.allAccounts}
                            allAccounts={ad.accounts.allAccounts}
                            className="ledger-subledger"
                            // ledgerAccounts={meta.current.purchaseLedgerAccounts}
                            ledgerAccounts={getMappedAccounts(
                                ad.accounts.purchaseLedgerAccounts
                            )}
                            onChange={() => {
                                // getPurchaseAccountError()
                                setRefresh({})
                                emit('PURCHASE-BODY-SUBMIT-REFRESH', null)
                            }}
                            rowData={ad.ledgerSubledgerPurchase}
                        />
                    </div>
                    <div>
                        <Typography variant="caption">Credit a/c</Typography>
                        {/* credit account */}
                        <LedgerSubledger
                            // allAccounts={meta.current.allAccounts}
                            allAccounts={ad.accounts.allAccounts}
                            className="ledger-subledger"
                            ledgerAccounts={getMappedAccounts(
                                ad.accounts.ledgerAccounts
                            )}
                            onChange={async () => {
                                // getOtherAccountError()
                                const gstin: string = await queryGstin(
                                    ad.ledgerSubledgerOther?.accId
                                )
                                ad.gstin = gstin
                                setRefresh({})
                                emit('PURCHASE-BODY-SUBMIT-REFRESH', null)
                            }}
                            rowData={ad.ledgerSubledgerOther}
                        />
                    </div>
                    {/* gstin */}
                    <TextField
                        className="gstin"
                        variant="standard"
                        label="Gstin no"
                        // error={getGstinError()}
                        error={
                            errorObject.isGstinError
                                ? errorObject.isGstinError()
                                : true
                        }
                        onChange={(e: any) => {
                            ad.gstin = e.target.value
                            setRefresh({})
                            emit('PURCHASE-BODY-SUBMIT-REFRESH', null)
                        }}
                        value={ad.gstin || ''}
                    />
                </div>
                <div className="right">
                    <div className="invoice">
                        {/* Invoice amount */}
                        <NumberFormat
                            className="total-amount"
                            label="Invoice amount"
                            allowNegative={false}
                            customInput={TextField}
                            decimalScale={2}
                            // error={getInvoiceAmountError()}
                            error={
                                errorObject.isInvoiceAmountError
                                    ? errorObject.isInvoiceAmountError()
                                    : true
                            }
                            fixedDecimalScale={true}
                            onFocus={(e) => {
                                e.target.select()
                            }}
                            onValueChange={(values: any) => {
                                //using onChange event stores formatted value
                                const { floatValue } = values
                                ad.invoiceAmount = floatValue
                                setRefresh({})
                                emit('PURCHASE-BODY-SUBMIT-REFRESH', null)
                            }}
                            thousandSeparator={true}
                            value={ad.invoiceAmount || 0.0}
                        />
                        <NumberFormat
                            label="Total qty"
                            allowNegative={false}
                            customInput={TextField}
                            decimalScale={2}
                            // error={getQtyError()}
                            error={
                                errorObject.isTotalQtyError
                                    ? errorObject.isTotalQtyError()
                                    : true
                            }
                            onFocus={(e) => {
                                e.target.select()
                            }}
                            onValueChange={(values: any) => {
                                const { floatValue } = values
                                ad.qty = floatValue
                                setRefresh({})
                                emit('PURCHASE-BODY-SUBMIT-REFRESH', null)
                            }}
                            thousandSeparator={true}
                            value={ad.qty || 0}
                        />
                    </div>

                    <div className="gst">
                        {/* cgst */}
                        <NumberFormat
                            allowNegative={false}
                            customInput={TextField}
                            decimalScale={2}
                            // error={getGstError()}
                            error={
                                errorObject.isGstError
                                    ? errorObject.isGstError()
                                    : true
                            }
                            fixedDecimalScale={true}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Typography
                                            variant="caption"
                                            component="span">
                                            Cgst
                                        </Typography>
                                    </InputAdornment>
                                ),
                            }}
                            onValueChange={(values: any) => {
                                const { floatValue } = values
                                ad.cgst = floatValue
                                ad.sgst = floatValue
                                ad.igst = 0.0
                                setRefresh({})
                                emit('PURCHASE-BODY-SUBMIT-REFRESH', null)
                            }}
                            onFocus={(e) => e.target.select()}
                            thousandSeparator={true}
                            value={ad.cgst || 0.0}
                        />
                        {/* sgst */}
                        <NumberFormat
                            allowNegative={false}
                            customInput={TextField}
                            decimalScale={2}
                            // error={getGstError()}
                            error={
                                errorObject.isGstError
                                    ? errorObject.isGstError()
                                    : true
                            }
                            fixedDecimalScale={true}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Typography
                                            variant="caption"
                                            component="span">
                                            Sgst
                                        </Typography>
                                    </InputAdornment>
                                ),
                            }}
                            onValueChange={(values: any) => {
                                const { floatValue } = values
                                ad.cgst = floatValue
                                ad.sgst = floatValue
                                ad.igst = 0.0
                                setRefresh({})
                                emit('PURCHASE-BODY-SUBMIT-REFRESH', null)
                            }}
                            onFocus={(e) => e.target.select()}
                            thousandSeparator={true}
                            value={ad.sgst || 0.0}
                        />
                        {/* igst */}
                        <NumberFormat
                            allowNegative={false}
                            customInput={TextField}
                            decimalScale={2}
                            // error={getGstError()}
                            error={
                                errorObject.isGstError
                                    ? errorObject.isGstError()
                                    : true
                            }
                            fixedDecimalScale={true}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Typography
                                            variant="caption"
                                            component="span">
                                            Igst
                                        </Typography>
                                    </InputAdornment>
                                ),
                            }}
                            onValueChange={(values: any) => {
                                const { floatValue } = values
                                ad.cgst = 0.0
                                ad.sgst = 0.0
                                ad.igst = floatValue
                                setRefresh({})
                                emit('PURCHASE-BODY-SUBMIT-REFRESH', null)
                            }}
                            onFocus={(e) => e.target.select()}
                            thousandSeparator={true}
                            value={ad.igst || 0.0}
                        />
                    </div>
                </div>
            </div>
        )
    }

    function AssignmentReturnedBodyLine1() {
        const [, setRefresh] = useState({})
        return (
            <div className="body-line-1">
                {/* auto ref no */}
                <TextField
                    className="auto-ref-no"
                    variant="standard"
                    disabled={true}
                    label="Ref no"
                    value={ad.autoRefNo || ''}
                />
                {/* date */}
                <TextField
                    label={ad.tranDate ? 'Date' : undefined}
                    variant="standard"
                    // error={getDateError()}
                    error={
                        errorObject?.isDateError
                            ? errorObject.isDateError()
                            : true
                    }
                    helperText={(() => {
                        let ret
                        if (errorObject.isDateError) {
                            if (errorObject.isDateError()) {
                                ret = 'Date range / Audit lock error'
                            }
                        } else {
                            ret = 'Date range / Audit lock error'
                        }
                        return ret
                    })()}
                    type="date"
                    onChange={(e: any) => {
                        ad.tranDate = e.target.value
                        setRefresh({})
                    }}
                    onFocus={(e) => e.target.select()}
                    value={ad.tranDate || ''}
                />
                <PurchaseInvoiceNoSelect arbitraryData={ad} />
                {/* remarks */}
                <TextField
                    label="Common remarks"
                    variant="standard"
                    className="common-remarks"
                    onChange={(e: any) => {
                        ad.commonRemarks = e.target.value
                        setRefresh({})
                    }}
                    value={ad.commonRemarks || ''}
                />
                {/* gst invoice  */}
                <FormControlLabel
                    className="gst-invoice"
                    control={
                        <Checkbox
                            checked={ad.isGstInvoice}
                            onChange={handleIsGstInvoice}
                        />
                    }
                    label="Gst invoice"
                />
                {/* submit */}
                <SubmitComponent />
            </div>
        )
    }

    function AssignmentReturnedBodyLine2() {
        const [, setRefresh] = useState({})
        return (
            <div className="body-line-2">
                <div className="left">
                    <div>
                        <Typography variant="caption">Purchase a/c</Typography>
                        {/* purchase */}
                        <LedgerSubledger
                            allAccounts={ad.accounts.allAccounts}
                            className="ledger-subledger"
                            ledgerAccounts={getMappedAccounts(
                                ad.accounts.purchaseLedgerAccounts
                            )}
                            onChange={() => {
                                // getPurchaseAccountError()
                                setRefresh({})
                                emit('PURCHASE-BODY-SUBMIT-REFRESH', null)
                            }}
                            rowData={ad.ledgerSubledgerPurchase}
                        />
                    </div>
                    <div>
                        <Typography variant="caption">Debit a/c</Typography>
                        {/* debit account */}
                        <LedgerSubledger
                            allAccounts={ad.accounts.allAccounts}
                            className="ledger-subledger"
                            ledgerAccounts={getMappedAccounts(
                                ad.accounts.ledgerAccounts
                            )}
                            onChange={async () => {
                                // getOtherAccountError()
                                const gstin: string = await queryGstin(
                                    ad.ledgerSubledgerOther?.accId
                                )
                                ad.gstin = gstin
                                setRefresh({})
                                emit('PURCHASE-BODY-SUBMIT-REFRESH', null)
                            }}
                            rowData={ad.ledgerSubledgerOther}
                        />
                    </div>
                    {/* gstin */}
                    <TextField
                        className="gstin"
                        variant="standard"
                        label="Gstin no"
                        error={
                            errorObject.isGstinError
                                ? errorObject.isGstinError()
                                : true
                        }
                        onChange={(e: any) => {
                            ad.gstin = e.target.value
                            setRefresh({})
                            emit('PURCHASE-BODY-SUBMIT-REFRESH', null)
                        }}
                        value={ad.gstin || ''}
                    />
                </div>
                <div className="right">
                    <div className="invoice">
                        {/* Invoice amount */}
                        <NumberFormat
                            className="total-amount"
                            label="Invoice amount"
                            allowNegative={false}
                            customInput={TextField}
                            decimalScale={2}
                            // error={getInvoiceAmountError()}
                            error={
                                errorObject.isInvoiceAmountError
                                    ? errorObject.isInvoiceAmountError()
                                    : true
                            }
                            fixedDecimalScale={true}
                            onFocus={(e) => {
                                e.target.select()
                            }}
                            onValueChange={(values: any) => {
                                //using onChange event stores formatted value
                                const { floatValue } = values
                                ad.invoiceAmount = floatValue
                                setRefresh({})
                                emit('PURCHASE-BODY-SUBMIT-REFRESH', null)
                            }}
                            thousandSeparator={true}
                            value={ad.invoiceAmount || 0.0}
                        />
                        <NumberFormat
                            label="Total qty"
                            allowNegative={false}
                            customInput={TextField}
                            decimalScale={2}
                            // error={getQtyError()}
                            error={
                                errorObject.isTotalQtyError
                                    ? errorObject.isTotalQtyError()
                                    : true
                            }
                            onFocus={(e) => {
                                e.target.select()
                            }}
                            onValueChange={(values: any) => {
                                const { floatValue } = values
                                ad.qty = floatValue
                                setRefresh({})
                                emit('PURCHASE-BODY-SUBMIT-REFRESH', null)
                            }}
                            thousandSeparator={true}
                            value={ad.qty || 0}
                        />
                    </div>

                    <div className="gst">
                        {/* cgst */}
                        <NumberFormat
                            allowNegative={false}
                            customInput={TextField}
                            decimalScale={2}
                            // error={getGstError()}
                            error={
                                errorObject.isGstError
                                    ? errorObject.isGstError()
                                    : true
                            }
                            fixedDecimalScale={true}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Typography
                                            variant="caption"
                                            component="span">
                                            Cgst
                                        </Typography>
                                    </InputAdornment>
                                ),
                            }}
                            onValueChange={(values: any) => {
                                const { floatValue } = values
                                ad.cgst = floatValue
                                ad.sgst = floatValue
                                ad.igst = 0.0
                                setRefresh({})
                                emit('PURCHASE-BODY-SUBMIT-REFRESH', null)
                            }}
                            onFocus={(e) => e.target.select()}
                            thousandSeparator={true}
                            value={ad.cgst || 0.0}
                        />
                        {/* sgst */}
                        <NumberFormat
                            allowNegative={false}
                            customInput={TextField}
                            decimalScale={2}
                            error={
                                errorObject.isGstError
                                    ? errorObject.isGstError()
                                    : true
                            }
                            fixedDecimalScale={true}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Typography
                                            variant="caption"
                                            component="span">
                                            Sgst
                                        </Typography>
                                    </InputAdornment>
                                ),
                            }}
                            onValueChange={(values: any) => {
                                const { floatValue } = values
                                ad.cgst = floatValue
                                ad.sgst = floatValue
                                ad.igst = 0.0
                                setRefresh({})
                                emit('PURCHASE-BODY-SUBMIT-REFRESH', null)
                            }}
                            onFocus={(e) => e.target.select()}
                            thousandSeparator={true}
                            value={ad.sgst || 0.0}
                        />
                        {/* igst */}
                        <NumberFormat
                            allowNegative={false}
                            customInput={TextField}
                            decimalScale={2}
                            error={
                                errorObject.isGstError
                                    ? errorObject.isGstError()
                                    : true
                            }
                            fixedDecimalScale={true}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Typography
                                            variant="caption"
                                            component="span">
                                            Igst
                                        </Typography>
                                    </InputAdornment>
                                ),
                            }}
                            onValueChange={(values: any) => {
                                const { floatValue } = values
                                ad.cgst = 0.0
                                ad.sgst = 0.0
                                ad.igst = floatValue
                                setRefresh({})
                                emit('PURCHASE-BODY-SUBMIT-REFRESH', null)
                            }}
                            onFocus={(e) => e.target.select()}
                            thousandSeparator={true}
                            value={ad.igst || 0.0}
                        />
                    </div>
                </div>
            </div>
        )
    }

    function PurchaseCashCredit() {
        return (
            <div className="purchase-type">
                <FormControlLabel
                    control={
                        <Radio
                            onClick={(e) => {
                                preHandlePurchaseCashCredit('credit')
                            }}
                            size="small"
                            color="secondary"
                            checked={ad.purchaseCashCredit === 'credit'}
                        />
                    }
                    label="Credit purchase"
                />

                <FormControlLabel
                    control={
                        <Radio
                            onClick={(e) => {
                                preHandlePurchaseCashCredit('cash')
                            }}
                            size="small"
                            color="secondary"
                            checked={ad.purchaseCashCredit === 'cash'}
                        />
                    }
                    label="Cash purchase"
                />
            </div>
        )
    }
}

export { PurchaseBody }
