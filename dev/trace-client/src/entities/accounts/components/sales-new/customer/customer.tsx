import { useCustomer } from './customer-hook'
import { Box, Button, Checkbox, CloseSharp, Dialog, DialogContent, DialogTitle, IconButton, InputAdornment, moment, Search, TextField, Tooltip, Typography, MegaDataContext, useContext, useState, useTheme, utils, } from '../redirect'

function Customer() {
    const [, setRefresh] = useState({})
    const theme = useTheme()
    const megaData = useContext(MegaDataContext)
    const sales = megaData.accounts.sales
    const allErrors = sales.allErrors
    const { checkAllErrors, handleCloseDialog, handleCustomerClear, handleCustomerSearch, handleCustomerSearchClear, handleNewEditCustomer, handleTextChanged, meta } = useCustomer()
    const pre = meta.current
    const billTo = sales?.billTo
    checkAllErrors()

    return (
        <Box className='vertical' sx={{ display: 'flex', border: '1px solid lightGrey', p: 2, pl: 1, pr: 1, rowGap: 2, flexWrap: 'wrap', width: theme.spacing(120) }}>
            <Box sx={{ display: 'flex', columnGap: 2, flexWrap: 'wrap', rowGap: 2, alignItems: 'center' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', rowGap: 1, columnGap: 1, width: theme.spacing(25) }}>
                    <Typography variant='subtitle1' sx={{ textDecoration: 'underline', fontWeight: 'bold' }}>Customer</Typography>
                    {/* ref no */}
                    <Typography variant='body2'>{sales.autoRefNo || ''}</Typography>

                </Box>
                {/* tran date */}
                <Box className='vertical'>
                    <Typography variant='body2'>Date</Typography>
                    <TextField variant='standard' type='date' value={sales.tranDate || ''}
                        error={Boolean(allErrors['dateError'])}
                        helperText={allErrors['dateError']}
                        onChange={(e: any) => { sales.tranDate = e.target.value; setRefresh({}) }} />
                </Box>
                {/* User ref no */}
                <Box className='vertical' sx={{ maxWidth: theme.spacing(12) }}>
                    <Typography variant='body2'>User ref no</Typography>
                    <TextField variant='standard' value={sales.userRefNo || ''} sx={{ maxWidth: theme.spacing(16) }} autoComplete='off'
                        onChange={(e: any) => handleTextChanged('userRefNo', e)} />
                </Box>
                {/* Gstin */}
                <Box className='vertical' sx={{ maxWidth: theme.spacing(15) }}>
                    <Typography variant='body2'>Gstin no</Typography>
                    <TextField variant='standard' value={billTo.gstin || ''} autoComplete='off'
                        error={Boolean(allErrors.gstinError)}
                        onChange={(e: any) => { billTo.gstin = e.target.value; setRefresh({}) }} />
                </Box>
                {/* Remarks */}
                <Box className='vertical' sx={{ maxWidth: theme.spacing(18), width: theme.spacing(18) }}>
                    <Typography variant='body2'>Remarks</Typography>
                    <TextField sx={{ width: theme.spacing(40) }} variant='standard' value={sales.commonRemarks || ''} autoComplete='off' onChange={(e: any) => handleTextChanged('commonRemarks', e)} />
                </Box>
            </Box>
            <Box sx={{ pointerEvents: sales.paymentVariety === 'i' ? 'none' : 'all', opacity: sales.paymentVariety === 'i' ? 0.4 : 1, display: 'flex', columnGap: 2, rowGap: 2, flexWrap: 'wrap', alignItems: 'flex-end' }}>
                {/* Customer search */}
                <Box className='vertical' sx={{ maxWidth: theme.spacing(32) }}>
                    <Typography variant='body2'>Customer search</Typography>
                    <TextField
                        autoComplete='off'
                        autoFocus={true}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position='start' >
                                    <Box sx={{ display: 'flex', flexDirection: 'column', }}>
                                        <Typography variant='caption' sx={{ mt: 0, ml: 1.35, color: theme.palette.secondary.light }}>Or</Typography>
                                        <Checkbox sx={{ mt: -2 }} size='small' checked={sales.isSearchTextOr || false} onClick={(e: any) => {
                                            sales.isSearchTextOr = e.target.checked
                                            setRefresh({})
                                        }} />
                                    </Box>
                                </InputAdornment>
                            ),
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        size="small"
                                        color='secondary'
                                        onClick={handleCustomerSearch}>
                                        <Search />
                                    </IconButton>
                                    <IconButton
                                        size="small"
                                        color='secondary'
                                        onClick={handleCustomerSearchClear}>
                                        <CloseSharp color='error' />
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                        onChange={(e: any) => handleTextChanged('searchText', e)}
                        onKeyDown={(e: any) => {
                            if (e.keyCode === 13) {
                                handleCustomerSearch()
                            }
                        }}
                        sx={{ minWidth: theme.spacing(15) }}
                        value={sales.searchText || ''}
                        variant='standard' />
                </Box>

                {/* Customer details */}
                <Typography sx={{
                    overflow: 'clip', fontSize: theme.spacing(1.8), fontWeight: 'bold', width: theme.spacing(40),
                    maxWidth: theme.spacing(40), maxHeight: theme.spacing(8), height: theme.spacing(8),
                    border: '2px solid white', borderColor: allErrors['customerError'] ? theme.palette.error.light : 'white'
                }}>{''.concat(
                    (billTo?.id ? 'id: ' + billTo.id : '')
                    , (billTo?.contactName ? ', ' + billTo.contactName : '')
                    , (billTo?.mobileNumber ? ', ' + billTo.mobileNumber : '')
                    , (billTo?.address1 ? ', ' + billTo.address1 : '')
                    , (billTo?.address2 ? ', ' + billTo.address2 : '')
                    , (billTo?.email ? ', ' + billTo.email : '')
                    , (billTo?.pin ? ', ' + billTo.pin : '')
                )}</Typography>

                <Box sx={{ display: 'flex', }}>
                    {/* clear */}
                    <Button size='small' color='warning' onClick={handleCustomerClear} variant='contained' sx={{ height: theme.spacing(5), }}>Clear</Button>
                    {/* New / edit */}
                    <Button size='small' color='secondary' onClick={handleNewEditCustomer} variant='contained' sx={{ height: theme.spacing(5), ml: 1 }}>New / Edit</Button>
                </Box>
            </Box>
            <Dialog
                open={pre.showDialog}
                onClose={(e: any, reason: any) => {
                    if (!['escapeKeyDown', 'backdropClick'].includes(reason)) {
                        handleCloseDialog()
                    }
                }}
                fullWidth={true}>
                <DialogTitle>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant='h6'>{pre.dialogConfig.title}</Typography>
                        <Tooltip title="Close">
                            <IconButton
                                size="small"
                                disabled={false}
                                onClick={handleCloseDialog}>
                                <CloseSharp />
                            </IconButton>
                        </Tooltip>
                    </Box>
                </DialogTitle>
                <DialogContent>
                    <pre.dialogConfig.content />
                </DialogContent>
            </Dialog>
        </Box>
    )
}

export { Customer }