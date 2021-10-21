import { NumberFormat, useState, useEffect, useContext } from '../../../../imports/regular-imports'
import {
    Button, Typography,
    Checkbox, FormControlLabel,
    InputAdornment,
    Radio,
    TextField,
} from '../../../../imports/gui-imports'
import { Error, Check } from '../../../../imports/icons-import'
import { useSharedElements } from '../common/shared-elements-hook'
import { usePurchaseBody, useStyles } from './purchase-body-hook'
import { LedgerSubledger } from '../../../../imports/trace-imports'
import { PurchaseInvoiceNoSelect } from './purchase-invoice-no-select'
import { ClearAll } from '../../../../imports/icons-import'
// import { PurchasesContext } from './purchases-provider'
import { MultiDataContext } from '../common/multi-data-bridge' 

function PurchaseBody({ purchaseType }: any) {
    //purchaseType is 'pur' for purchase and 'ret' for purchase return
    const [, setRefresh] = useState({})
    const classes = useStyles()
    const multiData: any = useContext(MultiDataContext)
    
    const {
        allErrorMethods,
        getError,
        handleClear,
        handleIsGstInvoice,
        handlePurchaseCashCredit,
        handleSubmit,
        meta,
        queryGstin,
    } = usePurchaseBody(multiData.purchases, purchaseType)
    const {
        getDateError,
        getGstError,
        getGstinError,
        getInvoiceError,
        getInvoiceAmountError,
        getOtherAccountError,
        getPurchaseAccountError,
        getQtyError,
    } = allErrorMethods()

    const {
        accountsMessages,
        emit,
        filterOn,
        TraceDialog,
    } = useSharedElements()

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

        return (
            <Button
                className="submit"
                variant="contained"
                size="small"
                color="secondary"
                onClick={handleSubmit}
                startIcon={
                    getError() ? (
                        <Error color="error" />
                    ) : (
                        <Check style={{ color: 'white' }} />
                    )
                }
                disabled={getError()}>
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
                    variant='standard'
                    disabled={true}
                    label="Ref no"
                    value={multiData.purchases.autoRefNo || ''}
                />
                {/* date */}
                <TextField
                    label={multiData.purchases.tranDate ? 'Date' : undefined}
                    variant='standard'
                    error={getDateError()}
                    helperText={
                        getDateError()
                            ? 'Date range / Audit lock error'
                            : undefined
                    }
                    type="date"
                    onChange={(e: any) => {
                        multiData.purchases.tranDate = e.target.value
                        setRefresh({})
                    }}
                    onFocus={(e) => e.target.select()}
                    value={multiData.purchases.tranDate || ''}
                />
                {/* invoice no  */}
                <TextField
                    label="Invoice no"
                    variant='standard'
                    className="invoice-no"
                    error={getInvoiceError()}
                    onChange={(e: any) => {
                        multiData.purchases.userRefNo = e.target.value
                        setRefresh({})
                    }}
                    value={multiData.purchases.userRefNo || ''}
                />
                {/* remarks */}
                <TextField
                    label="Common remarks"
                    variant='standard'
                    className="common-remarks"
                    onChange={(e: any) => {
                        multiData.purchases.commonRemarks = e.target.value
                        setRefresh({})
                    }}
                    value={multiData.purchases.commonRemarks || ''}
                />

                <PurchaseCashCredit />

                {/* gst invoice  */}
                <FormControlLabel
                    className="gst-invoice"
                    control={
                        <Checkbox
                            checked={multiData.purchases.isGstInvoice}
                            onChange={
                                handleIsGstInvoice
                                // (
                                //     e: any) => {
                                //     arbitraryData.isGstInvoice = e.target.checked
                                //     setRefresh({})
                                // }
                            }
                        />
                    }
                    label="Gst invoice"
                />
                {/* submit */}
                <SubmitComponent />
            </div>
        )
    }

    function PurchaseBodyLine2() {
        const [, setRefresh] = useState({})
        return (
            <div className="body-line-2">
                <div>
                    <Typography variant="caption">Purchase a/c</Typography>
                    {/* purchase */}
                    <LedgerSubledger
                        allAccounts={meta.current.allAccounts}
                        className="ledger-subledger"
                        ledgerAccounts={meta.current.purchaseLedgerAccounts}
                        onChange={() => {
                            getPurchaseAccountError()
                            setRefresh({})
                            emit('PURCHASE-BODY-SUBMIT-REFRESH', null)
                        }}
                        rowData={multiData.purchases.ledgerSubledgerPurchase}
                    />
                </div>
                <div>
                    <Typography variant="caption">Credit a/c</Typography>
                    {/* credit account */}
                    <LedgerSubledger
                        allAccounts={meta.current.allAccounts}
                        className="ledger-subledger"
                        ledgerAccounts={meta.current.ledgerAccounts}
                        onChange={async () => {
                            getOtherAccountError()
                            const gstin: string = await queryGstin(
                                multiData.purchases.ledgerSubledgerOther?.accId
                            )
                            multiData.purchases.gstin = gstin
                            setRefresh({})
                            emit('PURCHASE-BODY-SUBMIT-REFRESH', null)
                        }}
                        rowData={multiData.purchases.ledgerSubledgerOther}
                    />
                </div>
                {/* gstin */}
                <TextField
                    className="gstin"
                    variant='standard'
                    label="Gstin no"
                    error={getGstinError()}
                    onChange={(e: any) => {
                        multiData.purchases.gstin = e.target.value
                        setRefresh({})
                        emit('PURCHASE-BODY-SUBMIT-REFRESH', null)
                    }}
                    value={multiData.purchases.gstin || ''}
                />
                <div className="invoice">
                    {/* Invoice amount */}
                    <NumberFormat
                        className="total-amount"
                        label="Invoice amount"
                        allowNegative={false}
                        customInput={TextField}
                        decimalScale={2}
                        error={getInvoiceAmountError()}
                        fixedDecimalScale={true}
                        onFocus={(e) => {
                            e.target.select()
                        }}
                        onValueChange={(values: any) => {
                            //using onChange event stores formatted value
                            const { floatValue } = values
                            multiData.purchases.invoiceAmount = floatValue
                            setRefresh({})
                            emit('PURCHASE-BODY-SUBMIT-REFRESH', null)
                        }}
                        thousandSeparator={true}
                        value={multiData.purchases.invoiceAmount || 0.0}
                    />
                    <NumberFormat
                        label="Total qty"
                        allowNegative={false}
                        customInput={TextField}
                        decimalScale={2}
                        error={getQtyError()}
                        onFocus={(e) => {
                            e.target.select()
                        }}
                        onValueChange={(values: any) => {
                            const { floatValue } = values
                            multiData.purchases.qty = floatValue
                            setRefresh({})
                            emit('PURCHASE-BODY-SUBMIT-REFRESH', null)
                        }}
                        thousandSeparator={true}
                        value={multiData.purchases.qty || 0}
                    />
                </div>

                <div className="gst">
                    {/* cgst */}
                    <NumberFormat
                        allowNegative={false}
                        customInput={TextField}
                        decimalScale={2}
                        error={getGstError()}
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
                            multiData.purchases.cgst = floatValue
                            multiData.purchases.sgst = floatValue
                            multiData.purchases.igst = 0.0
                            setRefresh({})
                            emit('PURCHASE-BODY-SUBMIT-REFRESH', null)
                        }}
                        onFocus={(e) => e.target.select()}
                        thousandSeparator={true}
                        value={multiData.purchases.cgst || 0.0}
                    />
                    {/* sgst */}
                    <NumberFormat
                        allowNegative={false}
                        customInput={TextField}
                        decimalScale={2}
                        error={getGstError()}
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
                            multiData.purchases.cgst = floatValue
                            multiData.purchases.sgst = floatValue
                            multiData.purchases.igst = 0.0
                            setRefresh({})
                            emit('PURCHASE-BODY-SUBMIT-REFRESH', null)
                        }}
                        onFocus={(e) => e.target.select()}
                        thousandSeparator={true}
                        value={multiData.purchases.sgst || 0.0}
                    />
                    {/* igst */}
                    <NumberFormat
                        allowNegative={false}
                        customInput={TextField}
                        decimalScale={2}
                        error={getGstError()}
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
                            multiData.purchases.cgst = 0.0
                            multiData.purchases.sgst = 0.0
                            multiData.purchases.igst = floatValue
                            setRefresh({})
                            emit('PURCHASE-BODY-SUBMIT-REFRESH', null)
                        }}
                        onFocus={(e) => e.target.select()}
                        thousandSeparator={true}
                        value={multiData.purchases.igst || 0.0}
                    />
                </div>
                <Button
                    className="reset"
                    size="small"
                    color="secondary"
                    onClick={handleClear}
                    startIcon={<ClearAll />}>
                    Clear all
                </Button>
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
                    variant='standard'
                    disabled={true}
                    label="Ref no"
                    value={multiData.purchases.autoRefNo || ''}
                />
                {/* date */}
                <TextField
                    label={multiData.purchases.tranDate ? 'Date' : undefined}
                    variant='standard'
                    error={getDateError()}
                    helperText={
                        getDateError()
                            ? accountsMessages.dateRangeAuditLockMessage
                            : undefined
                    }
                    type="date"
                    onChange={(e: any) => {
                        multiData.purchases.tranDate = e.target.value
                        setRefresh({})
                    }}
                    onFocus={(e) => e.target.select()}
                    value={multiData.purchases.tranDate || ''}
                />
                <PurchaseInvoiceNoSelect arbitraryData={multiData.purchases} />
                {/* remarks */}
                <TextField
                    label="Common remarks"
                    variant='standard'
                    className="common-remarks"
                    onChange={(e: any) => {
                        multiData.purchases.commonRemarks = e.target.value
                        setRefresh({})
                    }}
                    value={multiData.purchases.commonRemarks || ''}
                />
                {/* gst invoice  */}
                <FormControlLabel
                    className="gst-invoice"
                    control={
                        <Checkbox
                            checked={multiData.purchases.isGstInvoice}
                            onChange={
                                handleIsGstInvoice
                                //     (e: any) => {
                                //     arbitraryData.isGstInvoice = e.target.checked
                                //     setRefresh({})
                                // }
                            }
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
                <div>
                    <Typography variant="caption">Purchase a/c</Typography>
                    {/* purchase */}
                    <LedgerSubledger
                        allAccounts={meta.current.allAccounts}
                        className="ledger-subledger"
                        ledgerAccounts={meta.current.purchaseLedgerAccounts}
                        onChange={() => {
                            getPurchaseAccountError()
                            setRefresh({})
                            emit('PURCHASE-BODY-SUBMIT-REFRESH', null)
                        }}
                        rowData={multiData.purchases.ledgerSubledgerPurchase}
                    />
                </div>
                <div>
                    <Typography variant="caption">Debit a/c</Typography>
                    {/* debit account */}
                    <LedgerSubledger
                        allAccounts={meta.current.allAccounts}
                        className="ledger-subledger"
                        ledgerAccounts={meta.current.ledgerAccounts}
                        onChange={async () => {
                            getOtherAccountError()
                            const gstin: string = await queryGstin(
                                multiData.purchases.ledgerSubledgerOther?.accId
                            )
                            multiData.purchases.gstin = gstin
                            setRefresh({})
                            emit('PURCHASE-BODY-SUBMIT-REFRESH', null)
                        }}
                        rowData={multiData.purchases.ledgerSubledgerOther}
                    />
                </div>
                {/* gstin */}
                <TextField
                    className="gstin"
                    variant='standard'
                    label="Gstin no"
                    error={getGstinError()}
                    onChange={(e: any) => {
                        multiData.purchases.gstin = e.target.value
                        setRefresh({})
                        emit('PURCHASE-BODY-SUBMIT-REFRESH', null)
                    }}
                    value={multiData.purchases.gstin || ''}
                />
                <div className="invoice">
                    {/* Invoice amount */}
                    <NumberFormat
                        className="total-amount"
                        label="Invoice amount"
                        allowNegative={false}
                        customInput={TextField}
                        decimalScale={2}
                        error={getInvoiceAmountError()}
                        fixedDecimalScale={true}
                        onFocus={(e) => {
                            e.target.select()
                        }}
                        onValueChange={(values: any) => {
                            //using onChange event stores formatted value
                            const { floatValue } = values
                            multiData.purchases.invoiceAmount = floatValue
                            setRefresh({})
                            emit('PURCHASE-BODY-SUBMIT-REFRESH', null)
                        }}
                        thousandSeparator={true}
                        value={multiData.purchases.invoiceAmount || 0.0}
                    />
                    <NumberFormat
                        label="Total qty"
                        allowNegative={false}
                        customInput={TextField}
                        decimalScale={2}
                        error={getQtyError()}
                        onFocus={(e) => {
                            e.target.select()
                        }}
                        onValueChange={(values: any) => {
                            const { floatValue } = values
                            multiData.purchases.qty = floatValue
                            setRefresh({})
                            emit('PURCHASE-BODY-SUBMIT-REFRESH', null)
                        }}
                        thousandSeparator={true}
                        value={multiData.purchases.qty || 0}
                    />
                </div>

                <div className="gst">
                    {/* cgst */}
                    <NumberFormat
                        allowNegative={false}
                        customInput={TextField}
                        decimalScale={2}
                        error={getGstError()}
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
                            multiData.purchases.cgst = floatValue
                            multiData.purchases.sgst = floatValue
                            multiData.purchases.igst = 0.0
                            setRefresh({})
                            emit('PURCHASE-BODY-SUBMIT-REFRESH', null)
                        }}
                        onFocus={(e) => e.target.select()}
                        thousandSeparator={true}
                        value={multiData.purchases.cgst || 0.0}
                    />
                    {/* sgst */}
                    <NumberFormat
                        allowNegative={false}
                        customInput={TextField}
                        decimalScale={2}
                        error={getGstError()}
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
                            multiData.purchases.cgst = floatValue
                            multiData.purchases.sgst = floatValue
                            multiData.purchases.igst = 0.0
                            setRefresh({})
                            emit('PURCHASE-BODY-SUBMIT-REFRESH', null)
                        }}
                        onFocus={(e) => e.target.select()}
                        thousandSeparator={true}
                        value={multiData.purchases.sgst || 0.0}
                    />
                    {/* igst */}
                    <NumberFormat
                        allowNegative={false}
                        customInput={TextField}
                        decimalScale={2}
                        error={getGstError()}
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
                            multiData.purchases.cgst = 0.0
                            multiData.purchases.sgst = 0.0
                            multiData.purchases.igst = floatValue
                            setRefresh({})
                            emit('PURCHASE-BODY-SUBMIT-REFRESH', null)
                        }}
                        onFocus={(e) => e.target.select()}
                        thousandSeparator={true}
                        value={multiData.purchases.igst || 0.0}
                    />
                </div>
                <Button
                    className="reset"
                    size="small"
                    color="secondary"
                    onClick={handleClear}
                    startIcon={<ClearAll />}>
                    Clear all
                </Button>
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
                                handlePurchaseCashCredit('credit')
                            }}
                            size="small"
                            color="secondary"
                            checked={
                                multiData.purchases.purchaseCashCredit === 'credit'
                            }
                        />
                    }
                    label="Credit purchase"
                />

                <FormControlLabel
                    control={
                        <Radio
                            onClick={(e) => {
                                handlePurchaseCashCredit('cash')
                            }}
                            size="small"
                            color="secondary"
                            checked={
                                multiData.purchases.purchaseCashCredit === 'cash'
                            }
                        />
                    }
                    label="Cash purchase"
                />
            </div>
        )
    }
}

export { PurchaseBody }
