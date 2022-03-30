import { _, Badge, Big, Box, Button, Card, Checkbox, Chip, CloseSharp, extractAmount, FormControlLabel, IconButton, InputAdornment, MegaDataContext, moment, NumberFormat, Radio, RadioGroup, Search, TextField, toDecimalFormat, Typography, useContext, useEffect, useState, useTheme } from './redirect'
import { useAccSales } from './acc-sales-hook'
import { isTemplateTail } from 'typescript'
import { TodayTwoTone } from '@mui/icons-material'
import { ThemeContext } from '@emotion/react'

function AccSales() {
    const [, setRefresh] = useState({})
    const theme = useTheme()
    return (
        <Box sx={{ display: 'flex', flexGrow: 1, '& .vertical': { display: 'flex', flexDirection: 'column', }, '& .right-aligned': { '& input': { textAlign: 'end' } } }}>
            <Drawyer />
            <Box className='vertical' sx={{ flexGrow: 1 }}>
                <Typography variant='subtitle1' sx={{ ml: 1 }}>Sales</Typography>
                <Box sx={{ display: 'flex' }}>
                    <CustomerInfo />
                    <Crown />
                </Box>
                <ProductsInfo />
                <PaymentsInfo />
            </Box>
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

function Crown() {
    const [, setRefresh] = useState({})
    const megaData = useContext(MegaDataContext)
    const sales = megaData.accounts.sales
    const theme = useTheme()
    sales.setRefreshCrown = setRefresh
    return (<Box className='vertical' sx={{ border: '4px solid lightGrey', m: 1, mt: 0, mb: 0, p: 1, display: 'flex', columnGap: 2, rowGap: 2 }}>
        <Button variant='contained' size='large' sx={{ height: theme.spacing(5), ml: 'auto' }} color='success'>Submit</Button>
        <Button variant='contained' size='small' sx={{ height: theme.spacing(5) }} color='secondary'>View</Button>
        <Button variant='contained' size='small' sx={{ height: theme.spacing(5), mt:'auto' }} color='error'>Reset</Button>
        
        
    </Box>)
}

function CustomerInfo() {
    const [, setRefresh] = useState({})
    const theme = useTheme()
    const megaData = useContext(MegaDataContext)
    const sales = megaData.accounts.sales
    const isoDateFormat = 'YYYY-MM-DD'
    return (
        <Box className='vertical' sx={{ display: 'flex', border: '4px solid orange', p: 2, ml: 1, mr: 1, rowGap: 2, flexWrap: 'wrap', flexGrow: 1 }}>
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
            <Box sx={{ display: 'flex', columnGap: 3, rowGap:2,  flexWrap: 'wrap' }}>
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
                                        onClick={(e: any) => {
                                        }}>
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
                        onChange={(e: any) => handleTextChanged('customerSearch', e)}
                        onKeyDown={(e: any) => {
                            if (e.keyCode === 13) {
                                // handleSearch()
                            }
                        }}
                        sx={{ minWidth: theme.spacing(15) }}

                        value={sales.customerSearch || ''}

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
        </Box>
    )

    function handleTextChanged(propName: string, e: any) {
        sales[propName] = e.target.value
        setRefresh({})
    }
}

function PaymentsInfo() {
    const [, setRefresh] = useState({})
    const theme = useTheme()
    const megaData = useContext(MegaDataContext)
    const sales = megaData.accounts.sales
    return (
        <Box className='vertical' sx={{ p: 2, ml: 1, mr: 1, mb: 1, backgroundColor: theme.palette.grey[200], border: '4px solid orange', maxWidth: theme.spacing(70) }}>
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
        const paymentMethods = sales.paymentMethods || []
        if (paymentMethods.length === 0) {
            paymentMethods.push({})
        }
        return (
            <Box className='vertical' >
                <Box sx={{ display: 'flex', alignItems: 'center', }}>
                    <Typography variant='body2'>Payment methods</Typography>
                    {/* Add button */}
                    <Button sx={{ color: theme.palette.lightBlue.main, ml: 'auto' }} onClick={handleAddPaymentMethod}>Add</Button>
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
                    <Box key={index} sx={{ display: 'flex', columnGap: 2, flexWrap: 'wrap', alignItems: 'center', rowGap: 2, }}>
                        <Box className='vertical'>
                            <Typography variant='caption'>Debit account</Typography>
                            <TextField />
                            {/* <LedgerSubledger rowData={{}} /> */}
                        </Box>
                        <TextField label='Instr no' variant='standard' value={item.instrNo || ''} autoComplete='off'
                            sx={{ maxWidth: theme.spacing(15) }} onChange={(e: any) => { item.instrNo = e.target.value; setRefresh({}) }} />
                        <NumberFormat sx={{ maxWidth: theme.spacing(18) }}
                            allowNegative={false}
                            autoComplete='off'
                            className='right-aligned'
                            customInput={TextField}
                            decimalScale={2}
                            fixedDecimalScale={true}
                            label='Amount'
                            onFocus={(e: any) => {
                                e.target.select()
                            }}
                            variant='standard' />

                        <IconButton sx={{ mt: -6, ml: -5, }} size='small' color='error' onClick={() => handleDeleteRow(index)}>
                            <CloseSharp />
                        </IconButton>
                    </Box>)

            })
            return (<Box className='vertical' sx={{ rowGap: 1 }}>{payments}</Box>)

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

function ProductsInfo() {
    const [, setRefresh] = useState({})
    const theme = useTheme()
    const megaData = useContext(MegaDataContext)
    const sales = megaData.accounts.sales
    const products = sales.products

    return (<Box sx={{ display: 'flex', flex: 1, border: '4px solid orange', m: 1, height: '100%' }}>
        <Box className='vertical' sx={{ p: 2, pt: 1, pb: 0, flex: 1 }}>
            <Summary />
            <ProductLineItems />
            <Summary />
        </Box>
    </Box>)

    function Summary() {
        const [, setRefresh] = useState({})
        sales.computeSummary = computeSummary
        return (<Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', m: .5, '& .footer': { mt: .1, fontWeight: 'bold', fontSize: theme.spacing(1.6) } }}>
            {/* Products label */}
            <Box sx={{ display: 'flex', justifyContent: 'space-evenly', flexWrap: 'wrap', alignItems: 'center', columnGap: 2, }}>
                <Typography variant='subtitle2' sx={{ textDecoration: 'underline' }}>Products info</Typography>
                <Typography color='slateblue' className='footer' >{''.concat('Count: ', products.length)}</Typography>
                <Typography color='slateblue' className='footer' >{''.concat('Qty: ', toDecimalFormat(sales.summary.qty))}</Typography>
            </Box>
            {/* Reset, Igst check, Add */}
            <Box sx={{ display: 'flex', alignItems: 'center', columnGap: 2, }}>
                <Typography color='slateblue' className='footer' >{''.concat('Cgst: ', toDecimalFormat(sales.summary.cgst))}</Typography>
                <Typography color='slateblue' className='footer' >{''.concat('Sgst: ', toDecimalFormat(sales.summary.sgst))}</Typography>
                <Typography color='slateblue' className='footer' >{''.concat('Igst: ', toDecimalFormat(sales.summary.igst))}</Typography>
                <Typography color='slateblue' className='footer' >{''.concat('Amount: ', toDecimalFormat(sales.summary.amount))}</Typography>
                {/* Back calculate */}
                <Box sx={{ display: 'flex', columnGap: 1 }}>
                    <Button size='small' variant='outlined' color='info' >Back cal</Button>
                    <NumberFormat />
                </Box>
                {/* Reset */}
                <Button size='small' sx={{ height: theme.spacing(3), color: theme.palette.error.main, mt: .3 }} onClick={handleReset}>Reset</Button>
                {/* Igst */}
                <FormControlLabel sx={{ fontSize: theme.spacing(1) }} label='Igst'
                    control={
                        <Checkbox size='small' sx={{ mt: -0.2 }} checked={sales.isIgst || false} onChange={handleChangeIgst} />} />
                {/* Add */}
                <Button size='small' variant='outlined' sx={{ color: theme.palette.lightBlue.main, }} onClick={handleAddProduct}>Add</Button>
            </Box>
        </Box>)

        function computeSummary() {
            const total = products.reduce((pre: any, curr: any) => {
                const obj: any = {}
                obj.qty = +Big(pre.qty).plus(Big(curr.qty || 0))
                obj.cgst = +Big(pre.cgst).plus(Big(curr.cgst || 0.00))
                obj.sgst = +Big(pre.sgst).plus(Big(curr.sgst || 0.00))
                obj.igst = +Big(pre.igst).plus(Big(curr.igst || 0.00))
                obj.amount = +Big(pre.amount).plus(Big(curr.amount || 0.00))
                return (obj)
            }, { qty: 0, cgst: 0, sgst: 0, igst: 0, amount: 0 })
            sales.summary.qty = total.qty
            sales.summary.cgst = total.cgst
            sales.summary.sgst = total.sgst
            sales.summary.igst = total.igst
            sales.summary.amount = total.amount
            setRefresh({})
        }
    }

    function ProductLineItems() {
        const [, setRefresh] = useState({})
        useEffect(() => {
            if (products.length === 0) {
                handleAddProduct()
            }
            setRefresh({})
        }, [])

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
            const smallFontTextField = megaData.accounts.settings.smallFontTextField
            return (
                <Box sx={{ display: 'flex', alignItems: 'center', border: '1px solid lightGrey', flexWrap: 'wrap', p: 2, rowGap: 2, columnGap: 2 }}>
                    {/* Index */}
                    <Box className='vertical' sx={{ width: theme.spacing(3) }}>
                        {/* Delete */}
                        <IconButton sx={{ ml: -2, mt: -1 }} size='small' color='error'
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
                            value={item.productSearch || ''}
                            onChange={(e: any) => handleTextChanged(item, 'productSearch', e)}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            size="large"
                                            color='secondary'
                                            onClick={(e: any) => {
                                            }}>
                                            <Search />
                                        </IconButton>
                                    </InputAdornment>
                                ), ...smallFontTextField
                            }}
                        />
                    </Box>
                    {/* Upc */}
                    {/* <Box className='vertical'>
                        <Typography variant='caption'>Upc</Typography>
                        <TextField
                            autoComplete='off'
                            sx={{ maxWidth: theme.spacing(13), }}
                            variant='standard'
                            value={item.upc || ''}
                            onChange={(e: any) => handleTextChanged(item, 'upc', e)} />
                    </Box> */}
                    {/* Product code */}
                    <Box className='vertical'>
                        <Typography variant='caption'>Product code</Typography>
                        <NumberFormat sx={{ maxWidth: theme.spacing(8) }}
                            allowNegative={false}
                            autoComplete='off'
                            InputProps={smallFontTextField}
                            className='right-aligned'
                            customInput={TextField}
                            decimalScale={0}
                            fixedDecimalScale={true}
                            value={item.productCode || 0.00}
                            variant='standard'
                            onChange={(e: any) => handleTextChanged(item, 'productCode', e)}
                            onFocus={(e: any) => {
                                e.target.select()
                            }} />
                    </Box>
                    {/* Hsn */}
                    <Box className='vertical'>
                        <Typography sx={{ textAlign: 'right' }} variant='caption'>Hsn</Typography>
                        <NumberFormat sx={{ maxWidth: theme.spacing(8) }}
                            allowNegative={false}
                            autoComplete='off'
                            InputProps={smallFontTextField}
                            className='right-aligned'
                            customInput={TextField}
                            decimalScale={0}
                            fixedDecimalScale={true}
                            value={item.hsn || 0}
                            variant='standard'
                            onChange={(e: any) => handleTextChanged(item, 'productCode', e)}
                            onFocus={(e: any) => {
                                e.target.select()
                            }} />
                    </Box>
                    {/* Gst(%) */}
                    <Box className='vertical'>
                        <Typography sx={{ textAlign: 'right' }} variant='caption'>Gst(%)</Typography>
                        <NumberFormat sx={{ maxWidth: theme.spacing(5) }}
                            allowNegative={false}
                            autoComplete='off'
                            InputProps={smallFontTextField}
                            className='right-aligned'
                            customInput={TextField}
                            decimalScale={2}
                            fixedDecimalScale={true}
                            value={item.gstRate || 0.00}
                            variant='standard'
                            onFocus={(e: any) => {
                                e.target.select()
                            }}
                            onValueChange={(values: any) => {
                                const { floatValue } = values
                                item.gstRate = floatValue || 0.0
                                setRefresh({})
                                computeRow(item)
                            }} />
                    </Box>
                    {/* Qty */}
                    <Box className='vertical'>
                        <Typography sx={{ textAlign: 'right' }} variant='caption'>Qty</Typography>
                        <NumberFormat sx={{ maxWidth: theme.spacing(8) }}
                            autoComplete='off'
                            allowNegative={false}
                            InputProps={smallFontTextField}
                            className='right-aligned'
                            customInput={TextField}
                            decimalScale={2}
                            fixedDecimalScale={true}
                            value={item.qty || 1.00}
                            onFocus={(e: any) => {
                                e.target.select()
                            }}
                            onValueChange={(value) => {
                                const { floatValue } = value
                                item.qty = floatValue
                                setRefresh({})
                                computeRow(item)
                            }}
                            thousandSeparator={true}
                            variant='standard' />
                    </Box>
                    {/* Price */}
                    <Box className='vertical'>
                        <Typography sx={{ textAlign: 'right' }} variant='caption'>Price</Typography>
                        <NumberFormat sx={{ maxWidth: theme.spacing(11) }}
                            autoComplete='off'
                            allowNegative={false}
                            InputProps={smallFontTextField}
                            className='right-aligned'
                            customInput={TextField}
                            decimalScale={2}
                            fixedDecimalScale={true}
                            value={item.price || 0.00}
                            onChange={(e: any) => {
                                item.price = +extractAmount(e.target.value) || 0.0
                                setPriceGst(item)
                                setRefresh({})
                                computeRow(item)
                            }}
                            onFocus={(e: any) => {
                                e.target.select()
                            }}
                            thousandSeparator={true}
                            variant='standard' />
                    </Box>
                    {/* Price(Gst) */}
                    <Box className='vertical'>
                        <Typography sx={{ textAlign: 'right' }} variant='caption'>Price(Gst)</Typography>
                        <NumberFormat sx={{ maxWidth: theme.spacing(11) }}
                            autoComplete='off'
                            allowNegative={false}
                            InputProps={smallFontTextField}
                            className='right-aligned'
                            customInput={TextField}
                            decimalScale={2}
                            fixedDecimalScale={true}
                            value={item.priceGst || 0.00}
                            onFocus={(e: any) => {
                                e.target.select()
                            }}
                            onChange={(e: any) => {
                                item.priceGst = +extractAmount(e.target.value) || 0.0
                                setPrice(item)
                                setRefresh({})
                                computeRow(item)
                            }}
                            thousandSeparator={true}
                            variant='standard' />
                    </Box>
                    {/* Discount(unit) */}
                    <Box className='vertical'>
                        <Typography sx={{ textAlign: 'right' }} variant='caption'>Disc(unit)</Typography>
                        <NumberFormat sx={{ maxWidth: theme.spacing(8) }}
                            autoComplete='off'
                            allowNegative={false}
                            InputProps={smallFontTextField}
                            className='right-aligned'
                            customInput={TextField}
                            decimalScale={2}
                            fixedDecimalScale={true}
                            value={item.discount || 0.00}
                            onFocus={(e: any) => {
                                e.target.select()
                            }}
                            onValueChange={(values: any) => {
                                const { floatValue } = values
                                item.discount = floatValue || 0.0
                                setRefresh({})
                                computeRow(item)
                            }}
                            variant='standard' />
                    </Box>
                    {/* Remarks */}
                    <Box className='vertical' >
                        <Typography variant='caption'>Remarks</Typography>
                        <TextField
                            autoComplete='off'
                            InputProps={smallFontTextField}
                            sx={{ maxWidth: theme.spacing(18) }}
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
                    <Card variant='outlined' sx={{ ml: 'auto', width: theme.spacing(20), height: theme.spacing(8), p: .5, pt: 0, backgroundColor: theme.palette.grey[100] }}>
                        <Typography sx={{
                            fontSize: theme.spacing(1.4),
                            fontWeight: 'bold', overflow: 'hidden', color: theme.palette.primary.dark,
                        }} variant='caption'>{item.productDetails || 'hgjg hggh hgh hg hjg'}</Typography>
                    </Card>
                    {/* Gst */}
                    {/* <Card variant='outlined' className='vertical' sx={{ textAlign: 'right', p: 1, backgroundColor: theme.palette.grey[200] }} >
                        <Typography fontWeight='bold' variant='caption'>{''.concat('Cgst: ', item.cgst || 0.00)}</Typography>
                        <Typography fontWeight='bold' variant='caption'>{''.concat('Sgst: ', item.sgst || 0.00)}</Typography>
                        <Typography fontWeight='bold' variant='caption'>{''.concat('Igst: ', item.igst || 0.00)}</Typography>
                    </Card> */}
                    {/* amount */}
                    <Card variant='outlined' className='vertical' sx={{ p: 1, backgroundColor: theme.palette.grey[200] }} >
                        <Typography variant='caption' sx={{ textAlign: 'right', }}>Amount</Typography>
                        <Typography variant='caption' sx={{ textAlign: 'right', color: theme.palette.lightBlue.main }} >{toDecimalFormat(item.amount || 0.00)}</Typography>
                    </Card>
                </Box>)

            function handleTextChanged(item: any, propName: string, e: any) {
                item[propName] = e.target.value
                setRefresh({})
            }
        }
    }

    function computeAllRows() {
        for (let lineItem of sales.products) {
            computeRow(lineItem, false)
        }
        sales.computeSummary()
    }

    function computeRow(item: any, toComputeSummary = true) {
        const gstRate = item.gstRate || 0.0
        let priceGst = item.priceGst
        let price = item.price
        const discount = item.discount
        const qty = item.qty
        let amount, gst, sgst, cgst

        if (priceGst) {
            price = priceGst / (1 + gstRate / 100)
            item.price = price
        } else if (price) {
            priceGst = price * (1 + gstRate / 100)
            item.priceGst = priceGst
        }

        if (discount === 0) {
            amount = priceGst * qty
            gst = (priceGst - price) * qty
        } else {
            amount = (price - discount) * qty * (1 + gstRate / 100)
            gst = amount - (price - discount) * qty
        }
        cgst = _.round(gst / 2, 2)
        sgst = cgst
        if (sales.isIgst) {
            item.igst = _.round(gst, 2)
            item.cgst = 0.0
            item.sgst = 0.0
        } else {
            item.igst = 0.0
            item.cgst = cgst
            item.sgst = sgst
        }
        item.amount = _.round(amount, 2)
        toComputeSummary && sales.computeSummary()
    }

    function handleAddProduct() {
        products.push({ upc: '', productCode: '', hsn: '', gstRate: 0, qty: 1, price: 0, priceGst: 0, discount: 0, remarks: null, amount: 0, cgst: 0, sgst: 0, igst: 0 })
        sales.computeSummary()
        setRefresh({})
    }

    function handleChangeIgst(e: any) {
        sales.isIgst = e.target.checked
        computeAllRows()
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
        handleAddProduct()
    }

    function handleSerialNo(item: any) {

    }

    function setPrice(item: any) {
        const priceGst = item.priceGst
        const gstRate = item.gstRate
        const price = +Big(priceGst).div(Big(1).plus(Big(gstRate).div(Big(100))))
        item.price = price
    }

    function setPriceGst(item: any) {
        const price = item.price
        const gstRate = item.gstRate
        const priceGst = +Big(price).mul(Big(1).plus(Big(gstRate).div(Big(100))))
        item.priceGst = priceGst
    }
}
