import { Box, Button, TextField, Typography, useTheme } from "@mui/material";
import { BranchTransferStore } from "../../../stores/branch-transfer-store";

export function BranchTransferHeader() {
    const theme = useTheme()
    const header = BranchTransferStore.main.header
    const errorsObject = BranchTransferStore.errorsObject
    return (
        <Box sx={{
            display: 'flex', columnGap: 4, flexWrap: 'wrap',
            rowGap: theme.spacing(4), alignItems: 'center', mt: theme.spacing(2)
        }}>

            {/* auto ref no */}
            <Typography
                sx={{
                    fontWeight: 'bold',
                    mt: 2,
                    width: theme.spacing(14),
                }}
                variant="body2">{header.refNo.value || ''}</Typography>

            {/* tran date */}
            <Box className="vertical">
                <Typography variant="body2">Date</Typography>
                <TextField
                    autoFocus
                    variant="standard"
                    type="date"
                    value={header.tranDate.value || ''}
                    error={Boolean(errorsObject.tranDateError())}
                    helperText={errorsObject.tranDateError()}

                    onChange={(e: any) => {
                        header.tranDate.value = e.target.value
                    }}
                    onFocus={(e: any) => e.target.select()}
                />
            </Box>

            {/* User ref no  */}
            <Box className="vertical" sx={{ width: theme.spacing(22) }}>
                <Typography variant="body2">User ref no</Typography>
                <TextField
                    variant="standard"
                    value={header.userRefNo.value || ''}
                    sx={{ width: theme.spacing(22) }}
                    autoComplete="off"
                    onChange={(e: any) => header.userRefNo.value = e.target.value}
                />
            </Box>

            {/* Remarks */}
            <Box
                className="vertical"
                sx={{ width: theme.spacing(55), ml: 1 }}>
                <Typography variant="body2">Remarks</Typography>
                <TextField
                    sx={{ width: theme.spacing(55) }}
                    variant="standard"
                    value={header?.commonRemarks.value || ''}
                    autoComplete="off"
                    onChange={(e: any) => {
                        header.commonRemarks.value = e.target.value
                    }}
                />

            </Box>

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