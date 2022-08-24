import { useCustomer } from './customer-hook'
import { useHookstate } from '@hookstate/core'
import {
    Box,
    Button,
    Checkbox,
    CloseSharp,
    Dialog,
    DialogContent,
    DialogTitle,
    IconButton,
    InputAdornment,
    moment,
    Search,
    TextField,
    Typography,
    MegaDataContext,
    useContext,
    useState,
    useTheme,
    utils,
} from '../redirect'
import { salesGlobal } from '../sales-global-state/sales-global'
import { MyLocationOutlined } from '@mui/icons-material'

function Customer() {
    const [, setRefresh] = useState({})
    const salesState: any = useHookstate(salesGlobal)
    const theme = useTheme()

    return (
        <Box
            className="vertical"
            sx={{
                display: 'flex',
                border: '1px solid lightGrey',
                p: 2,
                pl: 1,
                pr: 1,
                rowGap: 2,
                flexWrap: 'wrap',
            }}>
            <Box
                sx={{
                    display: 'flex',
                    columnGap: 2,
                    flexWrap: 'wrap',
                    rowGap: 2,
                    alignItems: 'center',
                }}>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        rowGap: 1,
                        columnGap: 1,
                        width: theme.spacing(25),
                    }}>
                    <Typography
                        variant="subtitle1"
                        sx={{
                            textDecoration: 'underline',
                            fontWeight: 'bold',
                        }}>
                        Customer
                    </Typography>
                    {/* ref no */}
                    <Typography variant="body2">
                        {salesState.autoRefNo.get() || ''}
                    </Typography>
                </Box>

                {/* tran date */}
                <Box className="vertical">
                    <Typography variant="body2">Date</Typography>
                    <TextField
                        variant="standard"
                        type="date"
                        value={salesState.tranDate.get() || ''}
                        // error={Boolean(allErrors['dateError'])}
                        // helperText={allErrors['dateError']}
                        onChange={(e: any) => {
                            salesState.tranDate.set(
                                (old: any) => e.target.value
                            )
                        }}
                    />
                </Box>
                {/* User ref no */}
                <Box className="vertical" sx={{ maxWidth: theme.spacing(12) }}>
                    <Typography variant="body2">User ref no</Typography>
                    <TextField
                        variant="standard"
                        value={salesState.userRefNo.get() || ''}
                        sx={{ maxWidth: theme.spacing(16) }}
                        autoComplete="off"
                        onChange={(e: any) =>
                            salesState.userRefNo.set(
                                (old: string) => e.target.value
                            )
                        }
                    />
                </Box>
                {/* Gstin */}
                <Box className="vertical" sx={{ maxWidth: theme.spacing(15) }}>
                    <Typography variant="body2">Gstin no</Typography>
                    <TextField
                        variant="standard"
                        value={salesState.billTo.gstin.get() || ''}
                        autoComplete="off"
                        // error={Boolean(allErrors.gstinError)}
                        onChange={(e: any) => {
                            salesState.billTo.gstin.set(
                                (old: string) => e.target.value
                            )
                        }}
                    />
                </Box>
                {/* Remarks */}
                <Box
                    className="vertical"
                    sx={{
                        maxWidth: theme.spacing(18),
                        width: theme.spacing(18),
                    }}>
                    <Typography variant="body2">Remarks</Typography>
                    <TextField
                        variant="standard"
                        value={salesState.commonRemarks.get() || ''}
                        autoComplete="off"
                        onChange={(e: any) =>
                            salesState.commonRemarks.set(e.target.value)
                        }
                    />
                </Box>
                <Box
                    sx={{
                        // pointerEvents:
                        // salesState.paymentVariety === 'i' ? 'none' : 'all',
                        // opacity: salesAtomValue.paymentVariety === 'i' ? 0.4 : 1,
                        display: 'flex',
                        columnGap: 2,
                        rowGap: 2,
                        flexWrap: 'wrap',
                        alignItems: 'flex-end',
                    }}>
                    {/* Customer search */}
                    <Box
                        className="vertical"
                        sx={{ maxWidth: theme.spacing(32) }}>
                        <Typography variant="body2">Customer search</Typography>
                        <TextField
                            autoComplete="off"
                            autoFocus={true}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                            }}>
                                            <Typography
                                                variant="caption"
                                                sx={{
                                                    mt: 0,
                                                    ml: 1.35,
                                                    color: theme.palette
                                                        .secondary.light,
                                                }}>
                                                Or
                                            </Typography>
                                            <Checkbox
                                                sx={{ mt: -2 }}
                                                size="small"
                                                // checked={
                                                //     salesState.isSearchTextOr ||
                                                //     false
                                                // }
                                                // onClick={(e: any) => {
                                                //     salesAtomValue.isSearchTextOr =
                                                //         e.target.checked
                                                //     setRefresh({})
                                                // }}
                                            />
                                        </Box>
                                    </InputAdornment>
                                ),
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            size="small"
                                            color="secondary"
                                            // onClick={handleCustomerSearch}
                                        >
                                            <Search />
                                        </IconButton>
                                        <IconButton
                                            size="small"
                                            color="secondary"
                                            // onClick={handleCustomerSearchClear}
                                        >
                                            <CloseSharp color="error" />
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                            // onChange={(e: any) =>
                            //     handleTextChanged('searchText', e)
                            // }
                            // onKeyDown={(e: any) => {
                            //     if (e.keyCode === 13) {
                            //         handleCustomerSearch()
                            //     }
                            // }}
                            sx={{ minWidth: theme.spacing(15) }}
                            value={salesState.searchText.get() || ''}
                            variant="standard"
                        />
                    </Box>

                    {/* Customer details */}
                    <Typography
                        sx={{
                            overflow: 'clip',
                            fontSize: theme.spacing(1.8),
                            fontWeight: 'bold',
                            width: theme.spacing(40),
                            maxWidth: theme.spacing(40),
                            maxHeight: theme.spacing(8),
                            height: theme.spacing(8),
                            border: '2px solid white',
                            // borderColor: allErrors['customerError']
                            //     ? theme.palette.error.light
                            //     : 'white',
                        }}>
                        {/* {''.concat(
                            billTo?.id ? 'id: ' + billTo.id : '',
                            billTo?.contactName
                                ? ', ' + billTo.contactName
                                : '',
                            billTo?.mobileNumber
                                ? ', ' + billTo.mobileNumber
                                : '',
                            billTo?.address1 ? ', ' + billTo.address1 : '',
                            billTo?.address2 ? ', ' + billTo.address2 : '',
                            billTo?.email ? ', ' + billTo.email : '',
                            billTo?.pin ? ', ' + billTo.pin : ''
                        )} */}
                    </Typography>

                    <Box sx={{ display: 'flex' }}>
                        {/* clear */}
                        <Button
                            size="small"
                            color="warning"
                            onClick={
                                () => {
                                    // const myObj = Object.assign({}, salesState.get())
                                    console.log(JSON.parse(JSON.stringify(salesState.get())))
                                }
                                // handleCustomerClear
                            }
                            variant="contained"
                            sx={{ height: theme.spacing(5) }}>
                            Clear
                        </Button>
                        {/* New / edit */}
                        <Button
                            size="small"
                            color="secondary"
                            // onClick={handleNewEditCustomer}
                            variant="contained"
                            sx={{ height: theme.spacing(5), ml: 1 }}>
                            New / Edit
                        </Button>
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}
export { Customer }
