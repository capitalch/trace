import { _, Big, Box, Button, IMegaData, MegaDataContext, NumberFormat, ProductsSearch, TextField, Typography, useContext, useEffect, useIbuki, useRef, useState, useTheme, useTraceMaterialComponents, utilMethods } from '../redirect'

function ItemsFooter() {
    const [, setRefresh] = useState({})
    const theme = useTheme()
    const megaData: IMegaData = useContext(MegaDataContext)
    const sales = megaData.accounts.sales
    const items = sales.items
    const { emit } = useIbuki()
    const { toDecimalFormat } = utilMethods()
    const { BasicMaterialDialog } = useTraceMaterialComponents()
    const meta: any = useRef({
        showDialog: false,
        dialogConfig: {
            content: () => <></>,
            maxWidth: 'lg',
        },
        // setRefresh: setRefresh
    })
    const pre = meta.current

    useEffect(() => {
        megaData.registerKeyWithMethod('computeSummary:itemsFooter', computeSummary)
        megaData.registerKeyWithMethod('render:itemsFooter', setRefresh)
        computeSummary()
    }, [])
    
    useEffect(() => {
        emit('ALL-ERRORS-JUST-REFRESH', null)
    })

    return (<Box sx={{ pt: 2, pb: 1, display: 'flex', rowGap: 3, flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between',  '& .footer': { mt: .1, fontWeight: 'bold', fontSize: theme.spacing(1.6) } }}>

        <Box sx={{ display: 'flex', justifyContent: 'space-evenly', flexWrap: 'wrap', alignItems: 'center', columnGap: 2, rowGap: 3, }}>
            {/* Item search button */}
            <Button size='small' variant='contained' color='secondary' onClick={handleItemSearch}>Item search</Button>
            {/* Count */}
            <Typography color={theme.palette.common.black} className='footer' >{''.concat('Count: ', items.length)}</Typography>
            {/* Qty */}
            <Typography color={theme.palette.common.black} className='footer' >{''.concat('Qty: ', toDecimalFormat(sales.summary.qty))}</Typography>
        </Box>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', rowGap: 3, alignItems: 'center', columnGap: 2, }}>
            {/* cgst */}
            <Typography color={theme.palette.common.black} className='footer' >{''.concat('Cgst: ', toDecimalFormat(sales.summary.cgst))}</Typography>
            {/* sgst */}
            <Typography color={theme.palette.common.black} className='footer' >{''.concat('Sgst: ', toDecimalFormat(sales.summary.sgst))}</Typography>
            {/* igst */}
            <Typography color={theme.palette.common.black} className='footer' >{''.concat('Igst: ', toDecimalFormat(sales.summary.igst))}</Typography>

            {/* clear */}
            <Button size='small' color='secondary' variant='outlined' onClick={handleClear}>Clear</Button>

            <Button size='small' variant='outlined' color='secondary' onClick={handleRoundOff}>Round off</Button>
            <Button size='small' variant='outlined' color='secondary' onClick={handleBackCalculate}>Back cal</Button>

            {/* Back calculate */}
            <Box sx={{ display: 'flex', columnGap: 1 }}>
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
            {/* Amount */}
            <Typography color={theme.palette.common.black} sx={{ mr: .5, fontSize: theme.spacing(1.8), fontWeight: 'bolder' }} >{toDecimalFormat(sales.summary.amount)}</Typography>
        </Box>
        <BasicMaterialDialog parentMeta={meta} />
    </Box>)

    function computeSummary() {
        const total = items.reduce((pre: any, curr: any) => {
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
        megaData.executeMethodForKey('setAmountForPayment:paymentMethods')
        setRefresh({})
    }

    function handleClear() {
        items.length = 0
        megaData.executeMethodForKey('handleAddItem:itemsHeader')
    }

    function handleBackCalculate() {
        const defaultAmount = sales.summary.backCalculateAmount
        if (defaultAmount === 0) {
            return
        }

        const factor: number = defaultAmount / sales.summary.amount
        for (let item of sales.items) {
            item.priceGst = item.priceGst - (item.discount || 0)
            item.discount = 0.0
            item.priceGst = item.priceGst * factor
            item.price = _.round(item.priceGst / (1 + item.gstRate / 100), 2)
        }
        megaData.executeMethodForKey('computeAllRows:lineItems')
    }

    function handleItemSearch() {
        pre.dialogConfig.title = 'Search from all products'
        pre.dialogConfig.content = () => <ProductsSearch parentMeta={meta} />
        pre.showDialog = true
        setRefresh({})
    }

    function handleRoundOff() {
        sales.summary.backCalculateAmount = Math.round(sales.summary.amount)
        handleBackCalculate()
    }
}

export { ItemsFooter }