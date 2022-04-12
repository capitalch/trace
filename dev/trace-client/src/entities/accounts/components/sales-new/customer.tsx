import { useCustomer } from './customer-hook'
import { Box, Button, Checkbox, CloseSharp, Dialog, DialogContent, DialogTitle, IconButton, InputAdornment, moment, Search, TextField, Tooltip, Typography, MegaDataContext, useContext, useState, useTheme } from './redirect'
import { CustomerDialogContent } from './customer-hook'

function Customer() {
    const [, setRefresh] = useState({})
    const theme = useTheme()
    const megaData = useContext(MegaDataContext)
    const sales = megaData.accounts.sales
    const { handleCloseDialog,handleCustomerClear, handleCustomerSearch, handleCustomerSearchClear, meta } = useCustomer()
    const pre = meta.current
    const isoDateFormat = 'YYYY-MM-DD'
    const billTo = sales?.billTo
    return (
        <Box className='vertical' sx={{ display: 'flex', border: '1px solid orange', p: 2, rowGap: 3, flexWrap: 'wrap', }}>
            <Box sx={{ display: 'flex', columnGap: 2, mt: 1, flexWrap: 'wrap', rowGap: 2, alignItems: 'center' }}>
                <Typography variant='subtitle1' sx={{ textDecoration: 'underline', fontWeight: 'bold' }}>Customer</Typography>
                {/* ref no */}
                <Box className='vertical' sx={{ minWidth: theme.spacing(12), ml: 4 }}>
                    <Typography variant='body2' >Ref no</Typography>
                    <TextField variant='standard' value={sales.autoRefNo || ''} autoComplete='off' disabled={true} />
                </Box>
                {/* tran date */}
                <Box className='vertical'>
                    <Typography variant='body2'>Date</Typography>
                    <TextField variant='standard' type='date' value={sales.tranDate || moment().format(isoDateFormat)}
                        onChange={(e: any) => handleTextChanged('tranDate', e)} />
                </Box>
                {/* User ref no */}
                <Box className='vertical' sx={{ minWidth: theme.spacing(12) }}>
                    <Typography variant='body2'>User ref no</Typography>
                    <TextField variant='standard' value={sales.userRefNo || ''} sx={{ maxWidth: theme.spacing(16) }} autoComplete='off'
                        onChange={(e: any) => handleTextChanged('userRefNo', e)} />
                </Box>
                {/* Gstin */}
                <Box className='vertical'>
                    <Typography variant='body2'>Gstin no</Typography>
                    <TextField variant='standard' value={sales.gstin || ''} autoComplete='off'
                        onChange={(e: any) => handleTextChanged('gstin', e)} />
                </Box>
                {/* Remarks */}
                <Box className='vertical' sx={{ minWidth: theme.spacing(14), }}>
                    <Typography variant='body2'>Remarks</Typography>
                    <TextField variant='standard' value={sales.commonRemarks || ''} autoComplete='off' onChange={(e: any) => handleTextChanged('commonRemarks', e)} />
                </Box>
            </Box>
            <Box sx={{ display: 'flex', columnGap: 3, rowGap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
                {/* Customer search */}
                <Box className='vertical' sx={{ minWidth: theme.spacing(40) }}>
                    <Typography variant='body2'>Customer search</Typography>
                    <TextField
                        autoComplete='off'
                        autoFocus={true}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position='start' >
                                    <Box sx={{ display: 'flex', flexDirection: 'column', }}>
                                        <Typography variant='caption' sx={{ mt: 0, ml: 1.35, color: theme.palette.cyan.light }}>Or</Typography>
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
                        variant='standard'
                    />
                </Box>
                {/* Customer details */}
                <Box sx={{
                    display: 'flex', fontFamily:'sans-serif', color:theme.palette.common.black,
                    fontSize: theme.spacing(1.6), p: 0.5, pl: 1, minWidth: theme.spacing(50), maxWidth: theme.spacing(60)
                    , height: theme.spacing(10),  flexWrap: 'wrap', overflow:'clip'
                }}>
                    <Typography sx={{fontWeight:'bold'}}>{billTo?.contactName ? billTo.contactName.concat(',') : ''}</Typography>
                    <Typography sx={{fontWeight:'bold'}}>{billTo?.mobileNumber ? ''.concat(' M: ', billTo.mobileNumber, ', ') : ''}</Typography>
                    <Typography>{billTo?.address1 ? ''.concat(' ', billTo.address1, ',') : ''}</Typography>
                    <Typography>{billTo?.address2 ? ''.concat(' ', billTo.address2, ',') : ''}</Typography>
                    <Typography>{billTo?.email ? ''.concat(' ', billTo.email, ',') : ''}</Typography>
                    <Typography>{billTo?.country ? ''.concat(' ', billTo.country, ',') : ''}</Typography>
                    <Typography>{billTo?.state ? ''.concat(' ', billTo.state, ',') : ''}</Typography>
                    <Typography sx={{fontWeight:'bold'}}>{billTo?.city ? ''.concat(' ', billTo.city, ',') : ''}</Typography>
                    <Typography sx={{fontWeight:'bold'}}>{billTo?.pin ? ' Pin: '.concat(' ', billTo.pin,) : ''}</Typography>
                </Box>
                <Box sx={{ display: 'flex', ml: 'auto' }}>
                    {/* New / edit */}
                    <Button size='medium' color='secondary' variant='outlined' sx={{ height: theme.spacing(5) }}>New / Edit</Button>
                    {/* clear */}
                    <Button size='medium' color='secondary' onClick={handleCustomerClear} variant='outlined' sx={{ height: theme.spacing(5), ml: 2 }}>Clear</Button>
                </Box>
            </Box>
            <Dialog
                open={pre.showDialog}
                onClose={(e, reason) => {
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
                    <CustomerDialogContent meta={meta} />
                    {/* <NewProduct onClose={handleCloseDialog} /> */}
                </DialogContent>
            </Dialog>
        </Box>
    )

    function handleTextChanged(propName: string, e: any) {
        sales[propName] = e.target.value
        setRefresh({})
    }
}

export { Customer }