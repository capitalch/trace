import { Box, Button, FormControlLabel, MegaDataContext, Radio, TextField, Typography, useContext,useState, useTheme } from './redirect'

function AccSales() {
    const [, setRefresh] = useState({})
    return (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', rowGap: 1 }}>
            <Drawyer />
            <AccSalesMain />
        </Box>
    )
}
export { AccSales }

function Drawyer() {
    const theme = useTheme()
    return (
        <Box sx={{ width: '260px', height: '100vh', backgroundColor: theme.palette.grey[300] }}></Box>
    )
}

function AccSalesMain() {
    const [, setRefresh] = useState({})
    const theme = useTheme()
    const megaData = useContext(MegaDataContext)
    const sales = megaData.accounts.sales
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, }}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Typography variant='subtitle2' component='div'>Sales</Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', border: '4px solid orange', p: 2, rowGap: 2 }}>

                    {/* Ref no, date, user ref no*/}
                    <Box sx={{ display: 'flex', columnGap: 2, rowGap: 1, mt: 1 }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                            <Typography variant='caption'>Ref no</Typography>
                            <TextField variant='standard' value={sales.autoRefNo || ''}
                                onChange={(e: any) => handleTextChanged('autoRefNo', e)} />
                        </Box>
                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                            <Typography variant='caption'>Date</Typography>
                            <TextField variant='standard' type='date' value={sales.tranDate || ''}
                                onChange={(e: any) => handleTextChanged('tranDate', e)} />
                        </Box>
                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                            <Typography variant='caption'>User ref no</Typography>
                            <TextField variant='standard' value={sales.userRefNo || ''}
                                onChange={(e: any) => handleTextChanged('userRefNo', e)} />
                        </Box>
                    </Box>

                    {/* Sales type / variety */}
                    {/* <SaleVariety /> */}

                    {/* Bill to */}
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Typography variant='subtitle2'>Bill to</Typography>
                        <Typography variant='caption'>Customer search</Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <TextField variant='standard' sx={{ flex: 0.95 }} />
                            <Button size='medium' sx={{ color: theme.palette.lightBlue.main }}>Search</Button>
                            <Button size='medium' sx={{ color: theme.palette.lightBlue.main }}>New / Edit</Button>
                            <Button size='medium' sx={{ color: theme.palette.lightBlue.main }}>Clear</Button>
                        </Box>
                    </Box>

                    {/* ship to */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', }}>
                        <Typography variant='subtitle2'>Ship to</Typography>
                        <Box sx={{ display: 'flex' }}>
                            <Button size='medium' sx={{ color: theme.palette.lightBlue.main }}>New / Edit</Button>
                            <Button size='medium' sx={{ color: theme.palette.lightBlue.main }}>Clear</Button>
                        </Box>
                    </Box>

                    {/* Gstin, remarks */}
                    <Box sx={{ display: 'flex', columnGap: 2 }}>
                        {/* Gstin */}
                        <TextField variant='standard' label='Gstin' value={sales.gstin || ''}
                            onChange={(e: any) => handleTextChanged( 'gstin', e)} />
                        <TextField variant='standard' value={sales.commonRemarks || ''} label='Remarks' sx={{ flex: 2 }} onChange={(e: any) => handleTextChanged('commonRemarks', e)} />
                    </Box>
                    {/* <PaymentMethods /> */}
                </Box>
            </Box>
        </Box>
    )

    function handleTextChanged( propName: string, e: any) {
        sales[propName] = e.target.value
        setRefresh({})
    }
}
