import { Box, Button, InputAdornment, TextField, Typography } from "@mui/material"
import { LedgerSubledger } from "../../common/ledger-subledger"
import { PurchaseStore } from "../../../stores/purchase-store"
import { NumberFormat } from '../../../../../imports/regular-imports'
import { useTheme } from '../../../../../imports/gui-imports'
import { usePurchaseMainSubheader } from "./purchase-main-subheader-hook"

function PurchaseMainSubheader() {
    const theme = useTheme()
    const { errorsObject, handleClearSubHeaderTotals, handleLedgerSubledgerPurchase, handleLedgerSubledgerOther } = usePurchaseMainSubheader()
    const subheader = PurchaseStore.main.subheader
    const purchaseType = PurchaseStore.purchaseType
    return (<Box sx={{ display: 'flex', mt: 2, columnGap: 4, rowGap: 4, flexWrap: 'wrap',alignItems:'center' }}>
        
        {/* Purchase a/c */}
        <Box>
            <Typography variant="caption">Purchase a/c</Typography>
            <LedgerSubledger
                className="ledger-subledger"
                ledgerFilterMethodName='purchaseAccounts'
                onChange={handleLedgerSubledgerPurchase}
                rowData={subheader.ledgerSubledgerPurchase}
            />
        </Box>

        {/* Credit / Debit a/c */}
        <Box>
            <Typography variant="caption">{purchaseType==='pur'? 'Credit a/c' : 'Debit a/c'}</Typography>
            <LedgerSubledger
                className="ledger-subledger"
                ledgerFilterMethodName='debtorsCreditorsCashBank'
                onChange={handleLedgerSubledgerOther}
                rowData={subheader.ledgerSubledgerOther}
            />
        </Box>

        {/* gstin */}
        <TextField
            className="gstin"
            variant="standard"
            label="Gstin no"
            error={
                Boolean(errorsObject.gstinError())
            }
            onChange={(e: any) => {
                subheader.gstinNumber.value = e.target.value
            }}
            value={subheader.gstinNumber.value || ''}
        />

        {/* Right */}
        <Box sx={{ display: 'flex',  p: 1, border: '1px solid lightGray',  columnGap: 6, backgroundColor: theme.palette.grey[50], '& input': { textAlign: 'end' } }}>
            {/* Invoice amt, qty */}
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>

                {/* Invoice amount */}
                <NumberFormat
                    sx={{ maxWidth: 150 }}
                    size='small'
                    variant="standard"
                    label='Invoice amount'
                    allowNegative={false}
                    customInput={TextField}
                    decimalScale={2}
                    error={Boolean(errorsObject.invoiceAmountError())}
                    fixedDecimalScale={true}
                    onFocus={(e: any) => {
                        e.target.select()
                    }}
                    onValueChange={(values: any) => {
                        //using onChange event stores formatted value
                        const { floatValue } = values
                        subheader.invoiceAmount.value = floatValue
                        // setRefresh({})
                        // emit('PURCHASE-BODY-SUBMIT-REFRESH', null)
                    }}
                    thousandSeparator={true}
                    value={subheader.invoiceAmount.value || 0.00}
                />
                {/* Total qty */}
                <NumberFormat
                    sx={{mt:1,  maxWidth: 150 }}
                    size='small'
                    variant="standard"
                    label='Total qty'
                    allowNegative={false}
                    customInput={TextField}
                    decimalScale={2}
                    error={Boolean(errorsObject.totalQtyError())}
                    fixedDecimalScale={true}
                    onFocus={(e: any) => {
                        e.target.select()
                    }}
                    onValueChange={(values: any) => {
                        //using onChange event stores formatted value
                        const { floatValue } = values
                        subheader.totalQty.value = floatValue
                        // setRefresh({})
                        // emit('PURCHASE-BODY-SUBMIT-REFRESH', null)
                    }}
                    thousandSeparator={true}
                    value={subheader.totalQty.value || 0.00}
                />
                <Button variant="text" onClick={handleClearSubHeaderTotals} color='info' sx={{ mt: 1, width: 2, height: 2, }}>Clear</Button>
            </Box>

            {/* Cgst, Sgst, Igst  */}
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>

                {/* cgst */}
                <NumberFormat
                    sx={{ mt: 0, maxWidth: 150 }}
                    variant="standard"
                    allowNegative={false}
                    customInput={TextField}
                    decimalScale={2}
                    size="small"
                    error={Boolean(errorsObject.totalCgstError() || errorsObject.cgstSgstIgstError())}
                    fixedDecimalScale={true}
                    onFocus={(e: any) => {
                        e.target.select()
                    }}
                    onValueChange={(values: any) => {
                        //using onChange event stores formatted value
                        const { floatValue } = values
                        subheader.cgst.value = floatValue
                        // setRefresh({})
                        // emit('PURCHASE-BODY-SUBMIT-REFRESH', null)
                    }}
                    thousandSeparator={true}
                    value={subheader.cgst.value || 0.00}
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
                />
                {/* sgst */}
                <NumberFormat
                    sx={{ mt: 1, maxWidth: 150 }}
                    variant="standard"
                    allowNegative={false}
                    customInput={TextField}
                    decimalScale={2}
                    size='small'
                    error={Boolean(errorsObject.totalSgstError() || errorsObject.cgstSgstIgstError())}
                    fixedDecimalScale={true}
                    onFocus={(e: any) => {
                        e.target.select()
                    }}
                    onValueChange={(values: any) => {
                        //using onChange event stores formatted value
                        const { floatValue } = values
                        subheader.sgst.value = floatValue
                        // setRefresh({})
                        // emit('PURCHASE-BODY-SUBMIT-REFRESH', null)
                    }}
                    thousandSeparator={true}
                    value={subheader.sgst.value || 0.00}
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
                />

                {/* igst */}
                <NumberFormat
                    sx={{ mt: 1, maxWidth: 150 }}
                    variant="standard"
                    allowNegative={false}
                    customInput={TextField}
                    decimalScale={2}
                    size='small'
                    error={Boolean(errorsObject.totalIgstError() || errorsObject.igstError() || errorsObject.cgstSgstIgstError())}
                    fixedDecimalScale={true}
                    onFocus={(e: any) => {
                        e.target.select()
                    }}
                    onValueChange={(values: any) => {
                        //using onChange event stores formatted value
                        const { floatValue } = values
                        subheader.igst.value = floatValue
                        // setRefresh({})
                        // emit('PURCHASE-BODY-SUBMIT-REFRESH', null)
                    }}
                    thousandSeparator={true}
                    value={subheader.igst.value || 0.00}
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
                />
            </Box>
        </Box>

        
    </Box>)
}
export { PurchaseMainSubheader }