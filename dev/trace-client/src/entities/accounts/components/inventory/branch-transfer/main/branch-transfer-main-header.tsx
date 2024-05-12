import { Box, Button, TextField, useTheme } from "@mui/material";
import { BranchTransferStore } from "../../../../stores/branch-transfer-store";

export function BranchTransferMainHeader() {
    const theme = useTheme()
    const header = BranchTransferStore.main.header
    const errorsObject = BranchTransferStore.errorsObject
    return (<Box sx={{ display: 'flex', columnGap: 4, flexWrap: 'wrap', rowGap: theme.spacing(4), alignItems: 'center', mt: theme.spacing(2) }}>

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

        {/* User ref no  */}
        <TextField
            label="User ref no"
            variant="standard"
            sx={{ maxWidth: '15rem', width: '13rem' }}
            // error={Boolean(errorsObject.invoiceNoError())}
            onChange={(e: any) => {
                header.userRefNo.value = e.target.value
            }}
            value={header.userRefNo.value || ''}
        />

        {/* remarks */}
        <TextField
            sx={{ maxWidth: '24rem', width: '18rem', ml: .3 }}
            label="Common remarks"
            variant="standard"
            onChange={(e: any) => {
                header.commonRemarks.value = e.target.value
            }}
            value={header?.commonRemarks.value || ''}
        />
        {/* Reset */}
        <Button color='info' sx={{
            height: theme.spacing(5),
            ml: 'auto'
        }} variant='contained'
        // onClick={handleOnReset}
        >Reset</Button>

        {/* Submit */}
        <Button
            sx={{ height: theme.spacing(5), width: theme.spacing(16), }}
            type='button'
            variant="contained"
            size="medium"
            color="secondary"
        // disabled={isFormError()}
        // startIcon={
        //     PurchaseStore.main.functions.isFormError() ? (
        //         <Error color="error" />
        //     ) : (
        //         <Check style={{ color: 'white' }} />
        //     )
        // }
        // onClick={handleSubmit}
        >
            Submit
        </Button>

    </Box>)
}