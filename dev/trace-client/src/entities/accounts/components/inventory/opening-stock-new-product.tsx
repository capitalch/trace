import { TextField, Typography } from '@mui/material'
import { useOpeninfStockNewProduct } from './opening-stock-new-product-hook'
import { Box, Button, Input, NumberFormat, useTheme, useSharedElements, utilMethods } from './redirect'
function OpeningStockNewProduct() {
    const { getFromBag, ReactSelect } = useSharedElements()
    const { checkError, getUnitOptions, handleSubmit, meta, onBrandChanged, onCategoryChanged, setRefresh } = useOpeninfStockNewProduct()
    const pre: any = meta.current
    const theme = useTheme()
    const { Mandatory } = utilMethods()

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
                <Typography variant='subtitle2'>Category <Mandatory /> </Typography>
                <ReactSelect menuPlacement='auto' styles={{ ...styles, ...errorStyle('selectedCategory') }} placeholder='Select category'
                    options={getFromBag('categories')} value={pre.selectedCategory} onChange={onCategoryChanged} />
            </Box>

            {/* Brands */}
            <Box sx={vertStyle}>
                <Typography variant='subtitle2'>Brand <Mandatory /></Typography>
                <ReactSelect menuPlacement='auto' styles={{ ...styles, ...errorStyle('selectedBrand') }} placeholder='Select brand'
                    options={getFromBag('brands')} value={pre.selectedBrand} onChange={onBrandChanged} />
            </Box>

            {/* Label */}
            <Box sx={vertStyle}>
                <Typography variant='subtitle2'>Product label <Mandatory /></Typography>
                <TextField
                    // sx={{ maxWidth: '70%' }}
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
                        value={pre.hsn || ''}
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
                        sx={{ width: theme.spacing(7), '& input': { textAlign: 'end' }, }}
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
                        value={pre.unitOfMeasurement}
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

            <Button variant='contained' color='success' disabled={checkError()} onClick={handleSubmit}>Submit</Button>
        </Box>)

}
export { OpeningStockNewProduct }