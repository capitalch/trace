import { useEffect } from 'react'
import { Box, Button, Checkbox, FormControlLabel, Radio, Tab, Tabs, TextField, Typography, useTheme } from '../../../../../imports/gui-imports'
import { Error, Check, PrintIcon } from '../../../../../imports/icons-import'
import { PurchaseStore } from '../../../stores/purchase-store'
import { usePurchaseMainHeader } from './purchase-main-header-hook'
import { useSharedElements } from '../../common/shared-elements-hook'

function PurchaseMainHeader() {
    const theme = useTheme()
    const { handleOnChangeGstInvoiceCheckbox, handleOnReset, handleSubmit, isFormError } = usePurchaseMainHeader()
    const header = PurchaseStore.main.header
    const errorsObject = PurchaseStore.errorsObject

    return (<Box sx={{ display: 'flex', columnGap: 4, flexWrap: 'wrap', rowGap: theme.spacing(4), alignItems: 'center' }}>

        {/* auto ref no */}
        <TextField
            sx={{ maxWidth: theme.spacing(20) }}
            variant="standard"
            disabled={true}
            label="Ref no"
            value={header.refNo.value || ''}
        />

        {/* date */}
        <TextField
            autoFocus
            label={header.tranDate.value ? 'Date' : undefined}
            variant='standard'
            type='date'
            value={header.tranDate.value || ''}
            error={
                Boolean(errorsObject.tranDateError())
            }
            helperText={errorsObject.tranDateError()}
            onChange={(e: any) => {
                header.tranDate.value = e.target.value
            }}
            onFocus={(e: any) => e.target.select()}
        />

        {/* invoice no  */}
        <TextField
            label="Invoice no"
            variant="standard"
            sx={{ maxWidth: '15rem', width: '13rem' }}
            error={Boolean(errorsObject.invoiceNoError())}
            onChange={(e: any) => {
                header.invoiceNo.value = e.target.value
            }}
            value={header.invoiceNo.value || ''}
        />

        {/* remarks */}
        <TextField
            sx={{ maxWidth: '12rem', width: '11rem', ml: .3 }}
            label="Common remarks"
            variant="standard"
            onChange={(e: any) => {
                header.commonRemarks.value = e.target.value
            }}
            value={header?.commonRemarks.value || ''}
        />

        <FormControlLabel
            sx={{ position: 'relative', top: theme.spacing(1), }}
            control={
                <Checkbox checked={Boolean(header.isGstInvoice.value || false)}
                    onChange={handleOnChangeGstInvoiceCheckbox} />
            }
            label='Gst invoice'
        />

        <Button color='info' sx={{
            height: theme.spacing(5),
            ml: 'auto'
        }} variant='contained' onClick={handleOnReset}>Reset</Button>

        {/* Submit */}
        <Button
            sx={{ height: theme.spacing(5), width: theme.spacing(16), }}
            type='button'
            variant="contained"
            size="medium"
            color="secondary"
            disabled={isFormError()}
            startIcon={
                PurchaseStore.main.functions.isFormError() ? (
                    <Error color="error" />
                ) : (
                    <Check style={{ color: 'white' }} />
                )
            }
            onClick={handleSubmit}>
            Submit
        </Button>
    </Box>)
}
export { PurchaseMainHeader }