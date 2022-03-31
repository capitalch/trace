import { _, Badge, Big, Box, Button, Card, Checkbox, Chip, CloseSharp, FormControlLabel, IconButton, InputAdornment, NumberFormat, Radio, RadioGroup, Search, TextField, Typography, useContext, useEffect, MegaDataContext, useState, useTheme, utilMethods } from './redirect'

function ProductsInfo() {
    const [, setRefresh] = useState({})
    const theme = useTheme()
    const megaData = useContext(MegaDataContext)
    const sales = megaData.accounts.sales
    const products = sales.products
    const { extractAmount, toDecimalFormat } = utilMethods()
    return (<Box sx={{ display: 'flex', flex: 1, border: '1px solid lightGrey', m: 1, height: '100%' }}>
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
            {/* Igst check, Add */}
            <Box sx={{ display: 'flex', alignItems: 'center', columnGap: 2, }}>
                {/* cgst */}
                <Typography color='slateblue' className='footer' >{''.concat('Cgst: ', toDecimalFormat(sales.summary.cgst))}</Typography>
                {/* sgst */}
                <Typography color='slateblue' className='footer' >{''.concat('Sgst: ', toDecimalFormat(sales.summary.sgst))}</Typography>
                {/* igst */}
                <Typography color='slateblue' className='footer' >{''.concat('Igst: ', toDecimalFormat(sales.summary.igst))}</Typography>


                <Button size='small' variant='outlined' color='info' onClick={handleRoundOff}>Round off</Button>
                {/* Back calculate */}
                <Box sx={{ display: 'flex', columnGap: 1 }}>
                    <Button size='small' variant='outlined' color='info' onClick={handleBackCalculate}>Back cal</Button>
                    <NumberFormat
                        sx={{ maxWidth: theme.spacing(15) }}
                        autoComplete='off'
                        className='right-aligned'
                        allowNegative={false}
                        customInput={TextField}
                        decimalScale={2}
                        InputProps={megaData.accounts.settings.smallFontTextField}
                        variant='standard'
                        fixedDecimalScale={true}
                        onFocus={(e: any) => e.target.select()}
                        onValueChange={(value: any) => {
                            const { floatValue } = value
                            sales.summary.backCalculateAmount = floatValue
                            setRefresh({})
                        }}
                        thousandSeparator={true}
                        value={sales.summary.backCalculateAmount}
                    />
                </Box>
                {/* amount */}
                <Typography color='dodgerBlue' sx={{ fontSize: theme.spacing(1.8), fontWeight: 'bolder' }} >{''.concat('Amount: ', toDecimalFormat(sales.summary.amount))}</Typography>
                {/* Reset */}
                <Button size='small' sx={{ height: theme.spacing(3), color: theme.palette.blue.main, mt: .3 }} onClick={handleReset}>Reset</Button>
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
            sales.summary.backCalculateAmount = total.amount
            setRefresh({})
        }

        function handleBackCalculate() {
            const defaultAmount = sales.summary.backCalculateAmount
            if (defaultAmount === 0) {
                return
            }

            const factor: number = defaultAmount / sales.summary.amount
            for (let item of sales.products) {
                item.priceGst = item.priceGst - (item.discount || 0)
                item.discount = 0.0
                item.priceGst = item.priceGst * factor
                item.price = _.round(item.priceGst / (1 + item.gstRate / 100), 2)
            }
            sales.computeAllRows() // Does the entire calculation on each row
        }

        function handleRoundOff() {
            sales.summary.backCalculateAmount = Math.round(sales.summary.amount)
            handleBackCalculate()
        }
    }

    function ProductLineItems() {
        const [, setRefresh] = useState({})
        sales.computeAllRows = computeAllRows
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
                <Box sx={{ display: 'flex', alignItems: 'center', border: '4px solid orange', flexWrap: 'wrap', p: 2, rowGap: 2, columnGap: 2 }}>
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
        setRefresh({})
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

export { ProductsInfo }