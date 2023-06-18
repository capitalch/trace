import { ThemeConsumer } from 'styled-components'
import { Box, Button, FormControlLabel, Radio, Tab, Tabs, TextField, Typography, useTheme } from '../../../../../imports/gui-imports'
import { Error, Check, PrintIcon } from '../../../../../imports/icons-import'
import { PurchaseNewStore } from '../purchase-new-store'
import { usePurchaseNewHeader } from './purchase-new-main-header-hook'
function PurchaseNewMainHeader({ formik }: any) {
    const theme = useTheme()
    // const { errors, getFieldProps, handleBlur, handleChange, handleSubmit, isValid, touched, values } = formik
    const header = PurchaseNewStore.main.header
    const errors = PurchaseNewStore.errors
    const { isInValidInvoiceNo } = usePurchaseNewHeader()
    return (<Box sx={{ display: 'flex', columnGap: theme.spacing(4), flexWrap: 'wrap' }}>

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
            error={errors.tranDate.value ? Boolean(errors.tranDate.value) : false}

            // error={
            //     errorObject?.isDateError
            //         ? errorObject.isDateError()
            //         : true
            // }
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
            sx={{ maxWidth: '10rem' }}
            label="Common remarks"
            variant="standard"
            onChange={(e: any) => {
                header.commonRemarks.value = e.target.value
            }}
            value={header.commonRemarks.value}
        />

        {/* Submit */}
        <Button
            type='button'
            variant="contained"
            size="small"
            color="secondary"
        >
            Submit
        </Button>
    </Box>)
}
export { PurchaseNewMainHeader }

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