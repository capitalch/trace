import { Box, Button, TextField, Typography, useTheme } from "@mui/material";
import { BranchTransferStore, resetBranchTransferStore } from "../../../stores/branch-transfer-store";
import { useBranchTransferheader } from "./branch-transfer-header-hook";
import { getFromBag, useState } from "../redirect";
import { Dropdown } from 'primereact/dropdown'

export function BranchTransferHeader() {
    const [, setRefresh] = useState({})
    const theme = useTheme()
    const header = BranchTransferStore.main.header
    const errorsObject = BranchTransferStore.errorsObject
    const branchObject = getFromBag('branchObject')
    const { getOptionsOtherThanCurrentBranch } = useBranchTransferheader()
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', }}>
            <Box sx={{
                display: 'flex', columnGap: 4, flexWrap: 'wrap',
                rowGap: theme.spacing(4), alignItems: 'center', mt: theme.spacing(3)
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
                    sx={{ width: theme.spacing(55), }}>
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

                {/* Reset */}
                <Button color='info' sx={{
                    height: theme.spacing(5),
                    ml: 'auto'
                }} variant='contained'
                    onClick={resetBranchTransferStore}
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

            <Box sx={{ display: 'flex', columnGap: theme.spacing(4), alignItems: 'end', mt: theme.spacing(4), }}>
                {/* Source branch */}
                <Box sx={{ display: 'flex', flexDirection: 'column', rowGap: 0.5, width: '100%' }}>
                    <Typography variant="body2" fontWeight='bold'>Source branch</Typography>
                    <Typography variant="body1" fontSize='1rem' height='2.4rem' border='1px solid lightGrey' p={1}>{branchObject.branchName}</Typography>
                </Box>

                {/* Destination branch */}
                <Box sx={{ display: 'flex', flexDirection: 'column', rowGap: 0.5, width: '100%' }}>
                    <Typography variant="body2" fontWeight='bold'>Destination branch</Typography>
                    {/* <select style={{ height: '2rem', width: '100%', border: errorsObject.destBranchError() ? '2px solid red' : '1px solid lightGrey' }}
                        value={BranchTransferStore.main.destBranchId.value}
                        onChange={(e: any) => {
                            BranchTransferStore.main.destBranchId.value = e.target.value
                            console.log(BranchTransferStore.main.destBranchId.value)
                            setRefresh({})
                        }}
                    >
                        {getOptionsOtherThanCurrentBranch()}
                    </select> */}
                        <Dropdown  placeholder="Select destination branch"
                        value={BranchTransferStore.main.destBranchId.value}
                        />
                </Box>
            </Box>
        </Box>
    )
}