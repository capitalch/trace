import { _, Badge, Box, Button, Card, Checkbox, Chip, CloseSharp, FormControlLabel, IconButton, MegaDataContext, moment, NumberFormat, Radio, RadioGroup, TextField, Typography, useContext, useState, useTheme } from './redirect'
import { useAccSales } from './acc-sales-hook'
import { useEffect } from 'react'

function AccSales() {
    const [, setRefresh] = useState({})
    useAccSales()
    return (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', rowGap: 1, '& .vertical': { display: 'flex', flexDirection: 'column' }, '& .right-aligned': { '& input': { textAlign: 'end' }, } }}>
            <Drawyer />
            <Box className='vertical'>
                <Typography variant='subtitle1' sx={{ mt: 1, ml: 1 }}>Sales</Typography>
                <ButtonControls />
                <CustomerInfo />

                <PaymentsInfo />
            </Box>
            <ProductsInfo />
        </Box>
    )
}
export { AccSales }

function Drawyer() {
    const theme = useTheme()
    return (
        <Box sx={{ width: '260px', height: '100%', backgroundColor: theme.palette.grey[300] }}></Box>
    )
}

function ButtonControls() {
    // const { initSalesMegaData } = useAccSales()
    return (<Box sx={{ border: '4px solid lightGrey', m: 1, mt: 0, p: 1, display: 'flex', flexWrap: 'wrap', rowGap: 1, columnGap: 2 }}>
        <Button variant='contained' size='small' color='error'
        // onClick={(e: any) => initSalesMegaData(true)}
        >Reset</Button>
        <Button variant='contained' size='small' color='secondary'>View</Button>
        <Button variant='contained' size='large' sx={{ ml: 'auto' }} color='success'>Submit</Button>
    </Box>)
}

function CustomerInfo() {
    const [, setRefresh] = useState({})
    const theme = useTheme()
    const megaData = useContext(MegaDataContext)
    const sales = megaData.accounts.sales
    const isoDateFormat = 'YYYY-MM-DD'
    return (
        <Box className='vertical' sx={{ p: 1 }}>
            {/* <Typography variant='subtitle1' component='div'>Sales</Typography> */}
            <Box className='vertical' sx={{ border: '4px solid orange', p: 2, }}>
                <Typography variant='subtitle2' sx={{ textDecoration: 'underline' }}>Customer info ( Bill to )</Typography>
                {/* Ref no, date, user ref no*/}
                <Box sx={{ display: 'flex', columnGap: 2, mt: 1 }}>
                    <Box className='vertical'>
                        <Typography variant='caption'>Ref no</Typography>
                        <TextField variant='standard' value={sales.autoRefNo || ''}
                            onChange={(e: any) => handleTextChanged('autoRefNo', e)} />
                    </Box>
                    <Box className='vertical'>
                        <Typography variant='caption'>Date</Typography>
                        <TextField variant='standard' type='date' value={sales.tranDate || moment().format(isoDateFormat)}
                            onChange={(e: any) => handleTextChanged('tranDate', e)} />
                    </Box>
                    <Box className='vertical'>
                        <Typography variant='caption'>User ref no</Typography>
                        <TextField variant='standard' value={sales.userRefNo || ''} sx={{ maxWidth: theme.spacing(16) }}
                            onChange={(e: any) => handleTextChanged('userRefNo', e)} />
                    </Box>
                </Box>

                {/* Bill to */}
                <Box className='vertical' sx={{ mt: 1 }}>
                    <Typography variant='caption'>Customer search</Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <TextField variant='standard' sx={{ flex: 0.95 }} />
                        <Button size='medium' sx={{ color: theme.palette.lightBlue.main }}>Search</Button>
                        <Button size='medium' sx={{ color: theme.palette.lightBlue.main }}>New / Edit</Button>
                        <Button size='medium' sx={{ color: theme.palette.lightBlue.main }}>Clear</Button>
                    </Box>
                </Box>

                {/* Gstin, remarks */}
                <Box sx={{ display: 'flex', columnGap: 2, mt: 1 }}>
                    {/* Gstin */}
                    <Box className='vertical'>
                        <Typography variant='caption'>Gstin no</Typography>
                        <TextField variant='standard' value={sales.gstin || ''}
                            onChange={(e: any) => handleTextChanged('gstin', e)} />
                    </Box>
                    {/* CommonRemarks */}
                    <Box className='vertical' sx={{ flex: 2 }}>
                        <Typography variant='caption'>Common remarks</Typography>
                        <TextField variant='standard' value={sales.commonRemarks || ''} onChange={(e: any) => handleTextChanged('commonRemarks', e)} />
                    </Box>
                </Box>
            </Box>
        </Box>
        // </Box>
    )

    function handleTextChanged(propName: string, e: any) {
        sales[propName] = e.target.value
        setRefresh({})
    }
}

function ProductsInfo() {
    const [, setRefresh] = useState({})
    const theme = useTheme()
    const megaData = useContext(MegaDataContext)
    const sales = megaData.accounts.sales
    sales.productsInfoRefresh = setRefresh
    if (_.isEmpty(sales.products)) {
        sales.products = []
    }
    const products = sales.products
    // const products = sales.products || []
    useEffect(() => {
        computeSummary()
        setRefresh({})
    }, [])


    const Summary = () => <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {/* Products label */}
        <Box sx={{ display: 'flex', justifyContent: 'space-evenly', flexWrap: 'wrap', alignItems: 'center', columnGap: 2, }}>
            <Typography variant='subtitle2' sx={{ textDecoration: 'underline' }}>Products info</Typography>
            <Typography color='slateblue' sx={{ mt: .3 }} variant='caption'>{''.concat('Count:', products.length, ' Qty:', sales.qty)}</Typography>
        </Box>
        {/* Reset, Igst check, Add */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Button size='small' sx={{ height: theme.spacing(3), color: theme.palette.lightBlue.main, mr: 1 }} onClick={handleReset}>Reset</Button>
            <FormControlLabel sx={{ fontSize: theme.spacing(1) }} label='Igst'
                control={
                    <Checkbox size='small' checked={sales.isIgst || false} onChange={handleChangeIgst} />} />
            <Button size='small' sx={{ height: theme.spacing(3), color: theme.palette.lightBlue.main }} onClick={handleAdd}>Add</Button>
        </Box>
    </Box>
    return (<Box sx={{ display: 'flex', flex: 2, border: '4px solid orange', m: 1, mt: 4.5, height: '100%' }}>
        <Box className='vertical' sx={{ p: 2, pt: 1 }}>
            <Summary />
            <ProductLineItems />
            <Summary />
        </Box>
    </Box>)

    function ProductLineItems() {
        const [, setRefresh] = useState({})
        useEffect(() => {
            // computeSummary()
        }, [])
        if (products.length === 0) {
            products.push({ productDetails: 'hjhjj jhjhj hjhjjh jhjhj hhjhj jhjh hj jhjhyuyer qe evbvb qe cqfhjfqk This is but the maximum last line. But this is nnnot to be shown in any manner' })
        }
        const lineItems: any[] = products.map((item: any, index: number) => {
            return <Box key={index}>
                <ProductLineItem item={item} index={index} />
            </Box>
        })
        return (<Box className='vertical' sx={{ rowGap: 1 }}>
            {lineItems}
        </Box>)
        function ProductLineItem({ item, index, }: any) {
            const [, setRefresh] = useState({})

            return (
                <Box sx={{ display: 'flex', alignItems: 'center', border: '1px solid lightGrey', flexWrap: 'wrap', p: 2, rowGap: 2, columnGap: 2 }}>
                    {/* Index */}
                    <Box className='vertical' sx={{ width: theme.spacing(5) }}>
                        {/* <Typography variant='caption' sx={{  }}>#</Typography> */}
                        {/* Delete */}
                        <IconButton sx={{ ml: -4, mt: -1 }} size='small' color='error'
                            onClick={() => handleDeleteRow(index)}>
                            <CloseSharp />
                        </IconButton>
                        <Typography variant='body2' sx={{ mt: 1, textDecoration: 'underline', fontSize: theme.spacing(1.5) }} color={theme.palette.secondary.main}>{index + 1}</Typography>
                    </Box>
                    {/* Product search */}
                    <Box className='vertical' >
                        <Typography variant='caption'>Product search</Typography>
                        <TextField
                            autoComplete='off'
                            variant='standard'
                            // label='Product search'
                            value={item.productSearch || ''}
                            onChange={(e: any) => handleTextChanged(item, 'productSearch', e)} />
                    </Box>
                    {/* Upc */}
                    <Box className='vertical'>
                        <Typography variant='caption'>Upc</Typography>
                        <TextField
                            autoComplete='off'
                            sx={{ maxWidth: theme.spacing(13), }}
                            variant='standard'
                            // label='Upc'
                            value={item.upc || ''}
                            onChange={(e: any) => handleTextChanged(item, 'upc', e)} />
                    </Box>
                    {/* Product code */}
                    <Box className='vertical'>
                        <Typography variant='caption'>Product code</Typography>
                        <TextField
                            autoComplete='off'
                            onFocus={(e: any) => {
                                e.target.select()
                            }}
                            className='right-aligned'
                            sx={{ maxWidth: theme.spacing(13) }}
                            variant='standard'
                            // label='Product code'
                            value={item.productCode || 0}
                            onChange={(e: any) => handleTextChanged(item, 'productCode', e)} />
                    </Box>
                    {/* Hsn */}
                    <Box className='vertical'>
                        <Typography variant='caption'>Hsn</Typography>
                        <TextField
                            autoComplete='off'
                            className='right-aligned'
                            onFocus={(e: any) => {
                                e.target.select()
                            }}
                            sx={{ maxWidth: theme.spacing(8) }}
                            variant='standard'
                            // label='Hsn'
                            value={sales.hsn}
                            onChange={(e: any) => {
                                // handleTextChanged(item, 'hsn', e)
                                sales.hsn = e.target.value
                                setRefresh({})
                            }
                            } />
                    </Box>
                    {/* Gst(%) */}
                    <Box className='vertical'>
                        <Typography sx={{ textAlign: 'right' }} variant='caption'>Gst(%)</Typography>
                        <NumberFormat sx={{ maxWidth: theme.spacing(7) }}
                            allowNegative={false}
                            autoComplete='off'
                            className='right-aligned'
                            customInput={TextField}
                            decimalScale={2}
                            fixedDecimalScale={true}
                            // label='Gst(%)'
                            value={item.gstRate || 0.00}
                            variant='standard'
                            onFocus={(e: any) => {
                                e.target.select()
                            }} />
                    </Box>
                    {/* Qty */}
                    <Box className='vertical'>
                        <Typography sx={{ textAlign: 'right' }} variant='caption'>Qty</Typography>
                        <NumberFormat sx={{ maxWidth: theme.spacing(10) }}
                            autoComplete='off'
                            allowNegative={false}
                            className='right-aligned'
                            customInput={TextField}
                            decimalScale={2}
                            fixedDecimalScale={true}
                            // label='Qty'
                            value={item.qty || 1.00}
                            onFocus={(e: any) => {
                                e.target.select()
                            }}
                            onValueChange={(value) => {
                                const { floatValue } = value
                                item.qty = floatValue
                                // sales.productsInfoRefresh({})
                                // setRefresh({})
                            }}
                            variant='standard' />
                    </Box>
                    {/* Price */}
                    <Box className='vertical'>
                        <Typography sx={{ textAlign: 'right' }} variant='caption'>Price</Typography>
                        <NumberFormat sx={{ maxWidth: theme.spacing(13) }}
                            autoComplete='off'
                            allowNegative={false}
                            className='right-aligned'
                            customInput={TextField}
                            decimalScale={2}
                            fixedDecimalScale={true}
                            // label='Price'
                            value={item.price || 0.00}
                            onFocus={(e: any) => {
                                e.target.select()
                            }}
                            variant='standard' />
                    </Box>
                    {/* Price(Gst) */}
                    <Box className='vertical'>
                        <Typography sx={{ textAlign: 'right' }} variant='caption'>Price(Gst)</Typography>
                        <NumberFormat sx={{ maxWidth: theme.spacing(13) }}
                            autoComplete='off'
                            allowNegative={false}
                            className='right-aligned'
                            customInput={TextField}
                            decimalScale={2}
                            fixedDecimalScale={true}
                            value={item.priceGst || 0.00}
                            // label='Price(Gst)'
                            onFocus={(e: any) => {
                                e.target.select()
                            }}
                            variant='standard' />
                    </Box>
                    {/* Discount(unit) */}
                    <Box className='vertical'>
                        <Typography sx={{ textAlign: 'right' }} variant='caption'>Discount(unit)</Typography>
                        <NumberFormat sx={{ maxWidth: theme.spacing(13) }}
                            autoComplete='off'
                            allowNegative={false}
                            className='right-aligned'
                            customInput={TextField}
                            decimalScale={2}
                            fixedDecimalScale={true}
                            // label='Discount(unit)'
                            value={item.discount || 0.00}
                            onFocus={(e: any) => {
                                e.target.select()
                            }}
                            variant='standard' />
                    </Box>
                    {/* Remarks */}
                    <Box className='vertical' >
                        <Typography variant='caption'>Remarks</Typography>
                        <TextField
                            autoComplete='off'
                            variant='standard'
                            value={item.remarks || ''}
                            onChange={(e: any) => handleTextChanged(item, 'remarks', e)} />
                    </Box>
                    {/* Serial numbers */}
                    <Badge
                        badgeContent={
                            (item.serialNumbers || '')
                                .split(',')
                                .filter(Boolean).length
                        }
                        // color={
                        //     getSlNoError(item)
                        //         ? 'error'
                        //         : 'secondary'
                        // }
                        showZero={true}>
                        <Chip
                            sx={{ p: 2 }}
                            size="small"
                            label="Serial no's"
                            color="info"
                            onClick={() => handleSerialNo(item)}
                        />
                    </Badge>
                    {/* Product details */}
                    <Card variant='outlined' sx={{ ml: 'auto', maxWidth: theme.spacing(20), maxHeight: theme.spacing(8), p: 1, backgroundColor: theme.palette.grey[200] }}>
                        <Typography sx={{
                            fontWeight: 'bold', overflow: 'hidden', color: theme.palette.primary.dark,
                        }} variant='caption'>{item.productDetails || ''}</Typography>
                    </Card>
                    {/* Gst */}
                    <Card variant='outlined' className='vertical' sx={{ textAlign: 'right', p: 1, backgroundColor: theme.palette.grey[200] }} >
                        <Typography fontWeight='bold' variant='caption'>{''.concat('Cgst: ', item.cgst || 0.00)}</Typography>
                        <Typography fontWeight='bold' variant='caption'>{''.concat('Sgst: ', item.sgst || 0.00)}</Typography>
                        <Typography fontWeight='bold' variant='caption'>{''.concat('Igst: ', item.igst || 0.00)}</Typography>
                    </Card>
                    {/* amount */}
                    <Card variant='outlined' className='vertical' sx={{ p: 1, backgroundColor: theme.palette.grey[200] }} >
                        <Typography variant='subtitle1' sx={{ textAlign: 'right', }}>Amount</Typography>
                        <Typography variant='h6' sx={{ textAlign: 'right', color: theme.palette.lightBlue.main }} >{item.amount || 12345.00}</Typography>
                    </Card>


                </Box>)
            function handleTextChanged(item: any, propName: string, e: any) {
                item[propName] = e.target.value
                computeSummary()
                setRefresh({})
            }
        }
    }

    function computeSummary() {
        const total = products.reduce((pre: any, curr: any) => {
            const obj: any = {}
            obj.qty = pre.qty + (curr.qty || 0)
            obj.cgst = pre.cgst + (curr.cgst || 0.00)
            obj.sgst = pre.sgst + (curr.sgst || 0.00)
            obj.igst = pre.igst + (curr.igst || 0.00)
            obj.amount = pre.amount + (curr.amount || 0.00)
            return (obj)
        }, { qty: 0, cgst: 0, sgst: 0, igst: 0, amount: 0 })
        sales.qty = total.qty
        sales.cgst = total.cgst
        sales.sgst = total.sgst
        sales.igst = total.igst
        sales.amount = total.amount
        // setRefresh({})
    }

    function handleAdd() {
        products.push({})
        setRefresh({})
    }

    function handleChangeIgst(e: any) {
        sales.isIgst = e.target.checked
        setRefresh({})
    }

    function handleDeleteRow(index: number) {
        if (products.length === 1) {
            return
        }
        products.splice(index, 1)
        setRefresh({})
    }

    function handleReset() {
        products.length = 0
        products.push({})
        setRefresh({})
    }

    function handleSerialNo(item: any) {

    }
}

function PaymentsInfo() {
    const [, setRefresh] = useState({})
    const theme = useTheme()
    const megaData = useContext(MegaDataContext)
    const sales = megaData.accounts.sales
    return (
        <Box className='vertical' sx={{ p: 2, m: 1, backgroundColor: theme.palette.grey[200], border: '4px solid orange' }}>
            <Typography variant='subtitle2' sx={{ textDecoration: 'underline' }}>Payments info</Typography>
            <SaleVariety />
            <PaymentMethods />
            {/* ship to */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                <Typography variant='subtitle2'>Ship to</Typography>
                <Box sx={{ display: 'flex' }}>
                    <Button size='medium' sx={{ color: theme.palette.lightBlue.main }}>New / Edit</Button>
                    <Button size='medium' sx={{ color: theme.palette.lightBlue.main }}>Clear</Button>
                </Box>
            </Box>
        </Box>)

    function SaleVariety() {
        return (
            // <Box sx={{ display: 'flex' }}>
            <Box >
                <RadioGroup row>
                    <FormControlLabel
                        control={
                            <Radio
                                // disabled={arbitraryData.id} // in edit mode changeover is not allowed
                                onClick={(e: any) => {
                                    handleSaleVariety('r')
                                    // resetAddresses()
                                    // handleRetailCashBankSales()
                                }}
                                size="small"
                                color="secondary"
                                checked={sales.saleVariety === 'r'}
                            />
                        }
                        label="Retail sales"
                    />
                    <FormControlLabel
                        control={
                            <Radio
                                // disabled={arbitraryData.id} // in edit mode changeover is not allowed
                                onClick={(e: any) => {
                                    handleSaleVariety('a')
                                    // resetAddresses()
                                    // handleAutoSubledgerSales()
                                }}
                                size="small"
                                color="secondary"
                                checked={sales.saleVariety === 'a'}
                            />
                        }
                        label="Auto subledger sales"
                    />
                    <FormControlLabel
                        control={
                            <Radio
                                // disabled={arbitraryData.id} // in edit mode changeover is not allowed
                                onClick={(e: any) => {
                                    handleSaleVariety('i')
                                    // resetAddresses()
                                    // handleInstitutionSales()
                                }}
                                size="small"
                                color="secondary"
                                checked={sales.saleVariety === 'i'}
                            />
                        }
                        label="Institution sales"
                    />
                </RadioGroup>
            </Box>
            // </Box>
        )

        function handleSaleVariety(variety: string) {
            sales.saleVariety = variety
            setRefresh({})
        }
    }

    function PaymentMethods() {
        const [, setRefresh] = useState({})
        // const list: any[] = [{},]
        const paymentMethods = sales.paymentMethods || []
        if (paymentMethods.length === 0) {
            paymentMethods.push({})
        }
        return (
            <Box className='vertical' >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant='body2'>Payment methods</Typography>
                    {/* Add button */}
                    <Button sx={{ color: theme.palette.lightBlue.main }} onClick={handleAddPaymentMethod}>Add</Button>
                </Box>
                <Payments paymentMethodsList={paymentMethods} />
            </Box>
        )

        function handleAddPaymentMethod() {
            paymentMethods.push({})
            setRefresh({})
        }

        function Payments({ paymentMethodsList }: any) {
            const [, setRefresh] = useState({})
            const payments: any[] = paymentMethodsList.map((item: any, index: number) => {
                return (
                    <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', alignItems: 'center', rowGap: 1 }}>
                        <Box className='vertical'>
                            <Typography variant='caption'>Debit account</Typography>
                            <TextField />
                            {/* <LedgerSubledger rowData={{}} /> */}
                        </Box>
                        <TextField label='Instr no' variant='standard' value={item.instrNo || ''}
                            sx={{ maxWidth: theme.spacing(15) }} onChange={(e: any) => { item.instrNo = e.target.value; setRefresh({}) }} />
                        <NumberFormat sx={{ flex: 0.4, minWidth: theme.spacing(15) }}
                            allowNegative={false}
                            className='right-aligned'
                            customInput={TextField}
                            decimalScale={2}
                            fixedDecimalScale={true}
                            label='Amount'
                            onFocus={(e: any) => {
                                e.target.select()
                            }}
                            variant='standard' />

                        <IconButton sx={{ ml: -6, mt: -5 }} size='small' color='error' onClick={() => handleDeleteRow(index)}>
                            <CloseSharp />
                        </IconButton>
                    </Box>)

            })
            return (<>{payments}</>)

            function handleDeleteRow(index: number) {
                if (paymentMethodsList.length === 1) {
                    return
                }
                paymentMethodsList.splice(index, 1)
                setRefresh({})
            }
        }
    }
}
