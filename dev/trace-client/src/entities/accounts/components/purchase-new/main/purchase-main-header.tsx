import { useEffect } from 'react'
import { Box, Button, Checkbox, FormControlLabel, Radio, Tab, Tabs, TextField, Typography, useTheme } from '../../../../../imports/gui-imports'
import { Error, Check, PrintIcon } from '../../../../../imports/icons-import'
import { PurchaseStore } from '../purchase-store'
import { usePurchaseNewHeader } from './purchase-main-header-hook'
import { useSharedElements } from '../../common/shared-elements-hook'
function PurchaseMainHeader() {
    const theme = useTheme()
    // const { errors, getFieldProps, handleBlur, handleChange, handleSubmit, isValid, touched, values } = formik
    const header = PurchaseStore.main.header
    // const errors = PurchaseStore.errors
    const { isError, isInValidInvoiceNo, isGstinExists, isInvalidTranDate } = usePurchaseNewHeader()
    const { isInvalidDate } = useSharedElements()

    

    return (<Box sx={{ display: 'flex', columnGap: theme.spacing(4), flexWrap: 'wrap', rowGap: theme.spacing(4) }}>

        {/* auto ref no */}
        <TextField
            sx={{ maxWidth: theme.spacing(20) }}
            variant="standard"
            disabled={true}
            label="Ref no"
            value={header.refNo.value}
        />

        {/* date */}
        <TextField
            // sx={{ mt: theme.spacing(2) }}
            label={header.tranDate.value ? 'Date' : undefined}
            variant='standard'
            type='date'
            value={header.tranDate.value || ''}
            // error={errors.tranDate.value ? Boolean(errors.tranDate.value) : false}

            error={
                isInvalidTranDate() ? true : false
            }
            // helperText={PurchaseStore.errors.tranDate.value}
            // helperText={(() => {
            //     let ret
            //     if (errorObject.isDateError) {
            //         if (errorObject.isDateError()) {
            //             ret = 'Date range / Audit lock error'
            //         }
            //     } else {
            //         ret = 'Date range / Audit lock error'
            //     }
            //     return ret
            // })()}
            onChange={(e: any) => {
                header.tranDate.value = e.target.value
            }}
            onFocus={(e: any) => e.target.select()}
        />

        {/* invoice no  */}
        <TextField
            label="Invoice no"
            variant="standard"
            sx={{ maxWidth: '10rem' }}
            error={isInValidInvoiceNo()}
            onChange={(e: any) => { header.invoiceNo.value = e.target.value }}
            value={header.invoiceNo.value}
        />

        {/* remarks */}
        <TextField
            sx={{ maxWidth: '30rem' }}
            label="Common remarks"
            variant="standard"
            onChange={(e: any) => {
                header.commonRemarks.value = e.target.value
            }}
            value={header.commonRemarks.value}
        />

        <FormControlLabel
            sx={{ position: 'relative', top: theme.spacing(1) }}
            control={
                <Checkbox checked={header.isGstInvoice.value}
                    onChange={() => (header.isGstInvoice.value = !header.isGstInvoice.value)}
                />
            }
            label='Gst invoice'
        />

        {/* Submit */}
        <Button
            sx={{ ml: 'auto', height: theme.spacing(4) }}
            type='button'
            variant="contained"
            size="large"
            color="secondary"
            // disabled={isError()}
            // startIcon={
            //     isError() ? (
            //         <Error color="error" />
            //     ) : (
            //         <Check style={{ color: 'white' }} />
            //     )
            // }
        >
            Submit
        </Button>
    </Box>)
}
export { PurchaseMainHeader }

// function PurchaseCashCredit() {
//     const theme = useTheme()
//     const header = PurchaseNewStore.main.header
//     return (<Box sx={{ position: 'relative', top: theme.spacing(1) }}>
//         <FormControlLabel
//             label='Credit purchase'
//             control={
//                 <Radio
//                     disabled={Boolean(header.id)}
//                     size='small'
//                     color='secondary'
//                     checked={header.isCreditPurchase.value}
//                     onClick={() => {
//                         header.isCreditPurchase.value = true
//                     }}
//                 />
//             } />

//         <FormControlLabel
//             label='Cash purchase'
//             control={
//                 <Radio
//                     disabled={Boolean(header.id)}
//                     size='small'
//                     color='secondary'
//                     checked={header.isCreditPurchase.value}
//                     onClick={() => {
//                         header.isCreditPurchase.value = true
//                     }}
//                 />
//             } />
//     </Box>)
// }