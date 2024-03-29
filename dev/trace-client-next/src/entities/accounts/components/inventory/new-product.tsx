import { useNewProduct } from './new-product-hook'
import { Box, Button, Input, NumberFormat, TextField, Typography, useInventoryUtils, useTheme, useSharedElements, utilMethods } from './redirect'

function NewProduct({ onClose, product = undefined }: any) {
    const { getFromBag, ReactSelect } = useSharedElements()
    const { checkError, getUnitOptions, handleSubmit, meta, onBrandChanged, onCategoryChanged, setRefresh } = useNewProduct(onClose, product)
    const pre: any = meta.current
    const theme = useTheme()
    const { Mandatory } = utilMethods()
    const { fetchBrandsCategoriesUnits } = useInventoryUtils()

    // To reduce space between two items of drop down
    const styles = {
        option: (base: any) => ({
            ...base,
            padding: '.05rem',
            paddingLeft: '0.5rem',
        }),
        control: (provided: any) => ({
            ...provided,
            width: '100%',
        })
    }
    const vertStyle = { display: 'flex', flexDirection: 'column', }
    const rightAlignedNumeric = { '& input': { textAlign: 'end' } }
    const errorStyle = (selected: string) => {
        return {
            control: (provided: any) => ({
                ...provided,
                border: pre[selected]?.value ? '1px solid lightGrey' : '3px solid red'
            })
        }
    }

    return (
        <Box sx={{ ...vertStyle, rowGap: theme.spacing(3) }}>

            {/* Categories */}
            <Box sx={vertStyle}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant='subtitle2'>Category <Mandatory /> </Typography>
                    <Button sx={{ height: theme.spacing(1), fontSize: theme.spacing(1.6) }}
                        color='info' onClick={async () => { await fetchBrandsCategoriesUnits(); setRefresh({}) }}>Refresh</Button>
                </Box>
                <ReactSelect menuPlacement='auto' styles={{ ...styles, ...errorStyle('selectedCategory') }} placeholder='Select category'
                    options={getFromBag('categories') || []} value={pre.selectedCategory} onChange={onCategoryChanged} />
            </Box>

            {/* Brands */}
            <Box sx={vertStyle}>
                <Typography variant='subtitle2'>Brand <Mandatory /></Typography>
                <ReactSelect menuPlacement='auto' styles={{ ...styles, ...errorStyle('selectedBrand') }} placeholder='Select brand'
                    options={getFromBag('brands') || []} value={pre.selectedBrand} onChange={onBrandChanged} />
            </Box>

            {/* Label */}
            <Box sx={vertStyle}>
                <Typography variant='subtitle2'>Product label <Mandatory /></Typography>
                <TextField
                    sx={{ borderWidth: '4px' }}
                    onChange={(e: any) => {
                        pre.label = e.target.value
                        setRefresh({})
                    }}
                    error={!Boolean(pre.label)}
                    value={pre.label || ''}
                    autoComplete='off'
                />
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', rowGap: theme.spacing(1) }}>
                {/* hsn */}
                <Box sx={vertStyle}>
                    <Typography variant='subtitle2'>Hsn</Typography>
                    <NumberFormat
                        sx={{ width: theme.spacing(10) }}
                        allowNegative={false}
                        customInput={Input}
                        onFocus={(e: any) => {
                            e.target.select()
                        }}
                        value={pre.hsn || 0}
                        onChange={(e: any) => {
                            pre.hsn = e.target.value
                            setRefresh({})
                        }}
                    />
                </Box>
                {/* gst rate */}
                <Box sx={vertStyle}>
                    <Typography variant='subtitle2'>Gst rate (%)</Typography>
                    <NumberFormat
                        sx={{ width: theme.spacing(7), ...rightAlignedNumeric, }}
                        allowNegative={false}
                        decimalScale={2}
                        fixedDecimalScale={true}
                        customInput={Input}
                        onFocus={(e: any) => {
                            e.target.select()
                        }}
                        value={pre.gstRate || 0}
                        onChange={(e: any) => {
                            pre.gstRate = e.target.value
                            setRefresh({})
                        }}
                    />
                </Box>
                {/* UPC code */}
                <Box sx={vertStyle}>
                    <Typography variant='subtitle2'>UPC code</Typography>
                    <NumberFormat
                        sx={{ width: theme.spacing(16) }}
                        allowNegative={false}
                        customInput={Input}
                        onFocus={(e: any) => {
                            e.target.select()
                        }}
                        value={pre.upcCode || ''}
                        onChange={(e: any) => {
                            pre.upcCode = e.target.value
                            setRefresh({})
                        }}
                    />
                </Box>
                {/* unit of measurement */}
                <Box sx={vertStyle}>
                    <Typography variant='subtitle2'>Unit of measurement</Typography>
                    <TextField
                        select
                        SelectProps={{
                            native: true,
                        }}
                        value={pre.unitId}
                        variant='standard'>
                        {getUnitOptions()}
                    </TextField>
                </Box>
            </Box>

            {/* Info */}
            <Box sx={vertStyle}>
                <Typography variant='subtitle2'>Product details</Typography>
                <TextField
                    onChange={(e: any) => {
                        pre.info = e.target.value
                        setRefresh({})
                    }}
                    autoComplete='off'
                    value={pre.info || ''}
                />
            </Box>

            {/* prices */}
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Typography variant='subtitle2'>Product prices</Typography>
                <Box sx={{ border: '1px solid lightGrey' }}>
                    <Box sx={{ display: 'flex', columnGap: 1, rowGap: 1, flexWrap: 'wrap', justifyContent: 'space-between', margin: 2 }}>
                        {/* Max retail price */}
                        <NumberFormat
                            sx={{ width: theme.spacing(16), ...rightAlignedNumeric, }}
                            allowNegative={false}
                            autoComplete='off'
                            decimalScale={2}
                            fixedDecimalScale={true}
                            customInput={TextField}
                            thousandSeparator={true}
                            onFocus={(e: any) => {
                                e.target.select()
                            }}
                            value={pre.maxRetailPrice || 0}
                            onChange={(e: any) => {
                                pre.maxRetailPrice = e.target.value
                                setRefresh({})
                            }}
                            variant='standard'
                            label='Max retail price'
                        />
                        {/* sale price */}
                        <NumberFormat sx={{ width: theme.spacing(16), ...rightAlignedNumeric, }}
                            allowNegative={false}
                            autoComplete='off'
                            decimalScale={2}
                            fixedDecimalScale={true}
                            thousandSeparator={true}
                            customInput={TextField}
                            onFocus={(e: any) => {
                                e.target.select()
                            }}
                            value={pre.salePrice || 0}
                            onChange={(e: any) => {
                                pre.salePrice = e.target.value
                                setRefresh({})
                            }}
                            variant='standard'
                            label='Sale price'
                        />
                        {/* Sale price gst */}
                        <NumberFormat sx={{ width: theme.spacing(16), ...rightAlignedNumeric, }}
                            allowNegative={false}
                            autoComplete='off'
                            thousandSeparator={true}
                            decimalScale={2}
                            fixedDecimalScale={true}
                            customInput={TextField}
                            onFocus={(e: any) => {
                                e.target.select()
                            }}
                            value={pre.salePriceGst || 0}
                            onChange={(e: any) => {
                                pre.salePriceGst = e.target.value
                                setRefresh({})
                            }}
                            variant='standard'
                            label='Sale price (gst)'
                        />
                    </Box>
                    {/* Purchase prices */}
                    <Box sx={{ display: 'flex', columnGap: 1, rowGap: 1, flexWrap: 'wrap', justifyContent: 'space-between', margin: 2 }}>
                        {/* Dealer price */}
                        <NumberFormat sx={{ width: theme.spacing(16), ...rightAlignedNumeric, }}
                            allowNegative={false}
                            thousandSeparator={true}
                            autoComplete='off'
                            decimalScale={2}
                            fixedDecimalScale={true}
                            customInput={TextField}
                            onFocus={(e: any) => {
                                e.target.select()
                            }}
                            value={pre.dealerPrice || 0}
                            onChange={(e: any) => {
                                pre.dealerPrice = e.target.value
                                setRefresh({})
                            }}
                            variant='standard'
                            label='Dealer price'
                        />
                        {/* Purch price */}
                        <NumberFormat sx={{ width: theme.spacing(16), ...rightAlignedNumeric, }}
                            allowNegative={false}
                            thousandSeparator={true}
                            autoComplete='off'
                            decimalScale={2}
                            fixedDecimalScale={true}
                            customInput={TextField}
                            onFocus={(e: any) => {
                                e.target.select()
                            }}
                            value={pre.purPrice || 0}
                            onChange={(e: any) => {
                                pre.purPrice = e.target.value
                                setRefresh({})
                            }}
                            variant='standard'
                            label='Purch price'
                        />
                        {/* Pur price gst */}
                        <NumberFormat sx={{ width: theme.spacing(16), ...rightAlignedNumeric, }}
                            allowNegative={false}
                            thousandSeparator={true}
                            autoComplete='off'
                            decimalScale={2}
                            fixedDecimalScale={true}
                            customInput={TextField}
                            onFocus={(e: any) => {
                                e.target.select()
                            }}
                            value={pre.purPriceGst || 0}
                            onChange={(e: any) => {
                                pre.purPriceGst = e.target.value
                                setRefresh({})
                            }}
                            variant='standard'
                            label='Purch price(gst)'
                        />
                    </Box>
                </Box>
            </Box>

            <Button variant='contained' color='success' disabled={checkError()} onClick={handleSubmit}>Submit</Button>
        </Box>)

}
export { NewProduct }