import { Box, Button, TextField, Typography, useTheme } from "@mui/material";
import { BranchTransferStore } from "../../../stores/branch-transfer-store";
import { useBranchTransferheader } from "./branch-transfer-header-hook";
import { getFromBag } from "../redirect";

export function BranchTransferHeader() {
    const theme = useTheme()
    const header = BranchTransferStore.main.header
    const errorsObject = BranchTransferStore.errorsObject
    const branchObject = getFromBag('branchObject')
    const { getbranchesOptions, getCurrentBranchObject } = useBranchTransferheader()
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', mt: theme.spacing(3), pb: theme.spacing(4), borderBottom: '1px solid black' }}>

            <Box sx={{ display: 'flex', columnGap: theme.spacing(4), alignItems: 'end', }}>

                {/* Source branch */}
                <Box sx={{ display: 'flex', flexDirection: 'column', rowGap: 0.5, width: '100%' }}>
                    <Typography variant="body2" fontWeight='bold'>Source branch</Typography>

                    <Typography variant="body1" fontWeight='bold' height='2rem' border='1px solid lightGrey' p={0.8}>{branchObject.branchName}</Typography>
                    {/* <select disabled style={{ height: '2rem', width: '100%' }} value={branchObject.branchId}>
                        {getbranchesOptions()}
                    </select> */}
                </Box>

                {/* Destination branch */}
                <Box sx={{ display: 'flex', flexDirection: 'column', rowGap: 0.5, width: '100%' }}>
                    <Typography variant="body2" fontWeight='bold'>Destination branch</Typography>
                    <select style={{ height: '2rem', width: '100%', border: '1px solid lightGrey' }}>
                        {getbranchesOptions()}
                    </select>
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
                >Submit
                </Button>
            </Box>

            <Box sx={{
                display: 'flex', columnGap: 4, flexWrap: 'wrap',
                rowGap: theme.spacing(4), alignItems: 'center', mt: theme.spacing(2)
            }}>

                {/* auto ref no */}
                <Box className="vertical">
                    <Typography fontWeight='bold'
                        variant="body2">{header.refNo.value || 'Auto ref no'}</Typography>
                    <TextField
                        variant="standard"
                        value={header.refNo.value || ''}
                        sx={{ width: theme.spacing(22) }}
                        disabled={true}
                    />
                </Box>

                {/* tran date */}
                <Box className="vertical">
                    <Typography variant="body2" fontWeight='bold'>Date</Typography>
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
                    <Typography variant="body2" fontWeight='bold'>User ref no</Typography>
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
                    sx={{ width: theme.spacing(55), ml: 'auto' }}>
                    <Typography variant="body2" fontWeight='bold'>Remarks</Typography>
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


            </Box>
        </Box>
    )
}