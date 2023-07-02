import { useEffect } from 'react'
import { Box, Button, Checkbox, FormControlLabel, Radio, Tab, Tabs, TextField, Typography, useTheme } from '../../../../../imports/gui-imports'
import { Error, Check, PrintIcon } from '../../../../../imports/icons-import'
import { PurchaseStore } from '../purchase-store'
import { usePurchaseMainHeader } from './purchase-main-header-hook'
import { useSharedElements } from '../../common/shared-elements-hook'

function PurchaseMainHeader() {
    const theme = useTheme()
    const { handleOnReset, handleSubmit } = usePurchaseMainHeader()
    const header = PurchaseStore.main.header
    const errorsObject = PurchaseStore.errorsObject

    return (<Box sx={{ display: 'flex', columnGap: 4, flexWrap: 'wrap', rowGap: theme.spacing(4), alignItems: 'center' }}>

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
            sx={{ maxWidth: '10rem' }}
            // error={isInValidInvoiceNo()}
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
            sx={{ position: 'relative', top: theme.spacing(1), ml: 'auto' }}
            control={
                <Checkbox checked={Boolean(header.isGstInvoice.value || false)}
                    onChange={() => {
                        header.isGstInvoice.value = !header.isGstInvoice.value
                    }}
                />
            }
            label='Gst invoice'
        />

        <Button color='warning' sx={{
            // backgroundColor: theme.palette.amber.main, 
            // color: theme.palette.getContrastText(theme.palette.amber.main),
            height: theme.spacing(5),
            // margin: 'auto',
        }} variant='contained' onClick={() => { }}>Reset</Button>

        {/* Submit */}
        <Button
            sx={{ height: theme.spacing(5), width: theme.spacing(16), }}
            type='button'
            variant="contained"
            size="medium"
            color="secondary"
            // disabled={isError()}
            // startIcon={
            //     isError() ? (
            //         <Error color="error" />
            //     ) : (
            //         <Check style={{ color: 'white' }} />
            //     )
            // }
            onClick={handleSubmit}
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