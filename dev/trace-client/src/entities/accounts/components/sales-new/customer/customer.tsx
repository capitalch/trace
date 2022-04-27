import { useCustomer } from './customer-hook'
import { accountsMessages, Box, Button, Checkbox, CloseSharp, Dialog, DialogContent, DialogTitle, IconButton, InputAdornment, moment, Search, TextField, Tooltip, Typography, MegaDataContext, useContext, useState, useTheme, utils, } from '../redirect'

function Customer() {
    const [, setRefresh] = useState({})
    const theme = useTheme()
    const megaData = useContext(MegaDataContext)
    const sales = megaData.accounts.sales
    const allErrors = sales.allErrors
    const { checkAllErrors, handleCloseDialog, handleCustomerClear, handleCustomerSearch, handleCustomerSearchClear, handleNewEditCustomer, handleTextChanged, meta } = useCustomer()
    const pre = meta.current
    const isoDateFormat = 'YYYY-MM-DD'
    const billTo = sales?.billTo
    checkAllErrors()

    return (
        <Box className='vertical' sx={{ mr: 1, display: 'flex', border: '1px solid lightBlue', p: 2, rowGap: 3, flexWrap: 'wrap', }}>
            <Box sx={{ display: 'flex', columnGap: 2, flexWrap: 'wrap', rowGap: 2, alignItems: 'center' }}>
                <Typography variant='subtitle1' sx={{ mt: theme.spacing(-2), textDecoration: 'underline', fontWeight: 'bold' }}>Customer</Typography>
                {/* ref no */}
                <Box className='vertical' sx={{ minWidth: theme.spacing(12), ml: 4 }}>
                    <Typography variant='body2' sx={{ mt: -2.0 }}>Ref no</Typography>
                    <Typography variant='body2'>{sales.autoRefNo || ''}</Typography>
                    {/* <TextField variant='standard' value={sales.autoRefNo || ''} autoComplete='off' disabled={true} /> */}
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
                <Box className='vertical' sx={{ maxWidth: theme.spacing(16), width: theme.spacing(16) }}>
                    <Typography variant='body2'>Remarks</Typography>
                    <TextField variant='standard' value={sales.commonRemarks || ''} autoComplete='off' onChange={(e: any) => handleTextChanged('commonRemarks', e)} />
                </Box>
            </Box>
            <Box sx={{ pointerEvents: sales.paymentVariety === 'i' ? 'none' : 'all', opacity: sales.paymentVariety === 'i' ? 0.4 : 1, display: 'flex', columnGap: 2, rowGap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
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
                <Box sx={{
                    display: 'flex', fontFamily: 'sans-serif', color: theme.palette.common.black,
                    fontSize: theme.spacing(1.6), p: 0.5, pl: 1, minWidth: theme.spacing(40), maxWidth: theme.spacing(60)
                    , height: theme.spacing(10), flexWrap: 'wrap', overflow: 'clip', border: '2px solid lightGrey', borderColor: allErrors['customerError'] ? theme.palette.error.light : 'lightgrey'
                }}>
                    <Typography sx={{ fontWeight: 'bold' }}>{billTo?.id ? ''.concat('Id:', billTo.id, ', ') : ''}</Typography>
                    <Typography sx={{ fontWeight: 'bold' }}>{billTo?.contactName ? billTo.contactName.concat(', ') : ''}</Typography>
                    <Typography sx={{ fontWeight: 'bold' }}>{billTo?.mobileNumber ? ''.concat(' M: ', billTo.mobileNumber, ', ') : ''}</Typography>
                    <Typography>{billTo?.address1 ? ''.concat(' ', billTo.address1, ', ') : ''}</Typography>
                    <Typography>{billTo?.address2 ? ''.concat(' ', billTo.address2, ', ') : ''}</Typography>
                    <Typography>{billTo?.email ? ''.concat(' ', billTo.email, ', ') : ''}</Typography>
                    <Typography>{billTo?.country ? ''.concat(' ', billTo.country, ', ') : ''}</Typography>
                    <Typography>{billTo?.state ? ''.concat(' ', billTo.state, ', ') : ''}</Typography>
                    <Typography sx={{ fontWeight: 'bold' }}>{billTo?.city ? ''.concat(' ', billTo.city, ', ') : ''}</Typography>
                    <Typography sx={{ fontWeight: 'bold' }}>{billTo?.pin ? ' Pin: '.concat(' ', billTo.pin,) : ''}</Typography>
                </Box>
                <Box sx={{ display: 'flex', }}>
                    {/* New / edit */}
                    <Button size='small' color='secondary' onClick={handleNewEditCustomer} variant='contained' sx={{ height: theme.spacing(5) }}>New / Edit</Button>
                    {/* clear */}
                    <Button size='small' color='warning' onClick={handleCustomerClear} variant='contained' sx={{ height: theme.spacing(5),ml:1 }}>Clear</Button>
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