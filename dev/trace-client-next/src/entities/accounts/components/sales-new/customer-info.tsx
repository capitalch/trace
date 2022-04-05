import { useCustomerInfo } from './customer-info-hook'
import { Box, Button, CloseSharp, Dialog, DialogContent, DialogTitle, IconButton, InputAdornment, moment, Search, TextField, Tooltip, Typography, MegaDataContext, useContext, useState, useTheme } from './redirect'
import { CustomerDialogContent } from './customer-info-hook'

function CustomerInfo() {
    const [, setRefresh] = useState({})
    const theme = useTheme()
    const megaData = useContext(MegaDataContext)
    const sales = megaData.accounts.sales
    const { handleCloseDialog, handleCustomerSearch, meta } = useCustomerInfo()
    const pre = meta.current
    const isoDateFormat = 'YYYY-MM-DD'
    return (
        <Box className='vertical' sx={{ display: 'flex', border: '1px solid lightGrey', p: 2, rowGap: 2, flexWrap: 'wrap', flexGrow: 1 }}>
            <Typography variant='subtitle2' sx={{ textDecoration: 'underline' }}>Customer info ( Bill to )</Typography>
            {/* Ref no, date, user ref no*/}
            <Box sx={{ display: 'flex', columnGap: 2, mt: 1, flexWrap: 'wrap', rowGap: 2 }}>
                {/* ref no */}
                <Box className='vertical' sx={{ minWidth: theme.spacing(12) }}>
                    <Typography variant='caption'>Ref no</Typography>
                    <TextField variant='standard' value={sales.autoRefNo || ''} autoComplete='off'
                        onChange={(e: any) => handleTextChanged('autoRefNo', e)} />
                </Box>
                {/* tran date */}
                <Box className='vertical'>
                    <Typography variant='caption'>Date</Typography>
                    <TextField variant='standard' type='date' value={sales.tranDate || moment().format(isoDateFormat)}
                        onChange={(e: any) => handleTextChanged('tranDate', e)} />
                </Box>
                {/* User ref no */}
                <Box className='vertical' sx={{ minWidth: theme.spacing(12) }}>
                    <Typography variant='caption'>User ref no</Typography>
                    <TextField variant='standard' value={sales.userRefNo || ''} sx={{ maxWidth: theme.spacing(16) }} autoComplete='off'
                        onChange={(e: any) => handleTextChanged('userRefNo', e)} />
                </Box>
                {/* Gstin */}
                <Box className='vertical'>
                    <Typography variant='caption'>Gstin no</Typography>
                    <TextField variant='standard' value={sales.gstin || ''} autoComplete='off'
                        onChange={(e: any) => handleTextChanged('gstin', e)} />
                </Box>
                {/* Remarks */}
                <Box className='vertical' sx={{ minWidth: theme.spacing(14), flex: 1 }}>
                    <Typography variant='caption'>Common remarks</Typography>
                    <TextField variant='standard' value={sales.commonRemarks || ''} autoComplete='off' onChange={(e: any) => handleTextChanged('commonRemarks', e)} />
                </Box>
            </Box>
            <Box sx={{ display: 'flex', columnGap: 3, rowGap: 2, flexWrap: 'wrap' }}>
                {/* Customer search */}
                <Box className='vertical'>
                    <Typography variant='caption'>Customer search</Typography>
                    <TextField
                        autoComplete='off'
                        InputProps={{
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
                                        onClick={(e: any) => {
                                        }}>
                                        <CloseSharp color='error' />
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                        onChange={(e: any) => { pre.searchFilter = e.target.value; setRefresh({}) }}
                        onKeyDown={(e: any) => {
                            if (e.keyCode === 13) {
                                handleCustomerSearch()
                            }
                        }}
                        sx={{ minWidth: theme.spacing(15) }}
                        value={pre.searchFilter || ''}
                        variant='standard'
                    />
                </Box>
                <Typography variant='caption' sx={{ minWidth: theme.spacing(50), height: theme.spacing(8), backgroundColor: theme.palette.grey[200] }}>{sales.customerDetails}</Typography>
                <Box sx={{ display: 'flex', }}>
                    {/* New / edit */}
                    <Button size='medium' sx={{ color: theme.palette.lightBlue.main, }}>New / Edit</Button>
                    {/* clear */}
                    <Button size='medium' sx={{ color: theme.palette.lightBlue.main }}>Clear</Button>
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

export { CustomerInfo }