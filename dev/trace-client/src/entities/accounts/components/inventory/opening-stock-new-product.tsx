import { TextField, Typography } from '@mui/material'
import { useOpeninfStockNewProduct } from './opening-stock-new-product-hook'
import { Box, Button, NumberFormat, useTheme, useSharedElements } from './redirect'
function OpeningStockNewProduct() {
    const { ReactSelect } = useSharedElements()
    const { meta, setRefresh } = useOpeninfStockNewProduct()
    const pre = meta.current
    const theme = useTheme()
    // To reduce space between two items of drop down
    const styles = {
        option: (base: any) => ({
            ...base,
            padding: '.1rem',
            paddingLeft: '0.5rem',
        }),
        control: (provided: any) => ({
            ...provided,
            width: '100%',
        })
    }
    const vertStyle = { display: 'flex', flexDirection: 'column', }

    // const errorStyle = (selected: string) => {
    //     return {
    //         control: (provided: any) => ({
    //             ...provided,
    //             border: pre[selected]?.value ? '1px solid lightGrey' : '3px solid red'
    //         })
    //     }
    // }
    // , rowGap: theme.spacing(2) display: 'flex', flexDirection: 'column',}
    return (
        <Box sx={{ ...vertStyle, rowGap: theme.spacing(3) }}>

            {/* Categories */}
            <Box sx={vertStyle}>                
                <Typography variant='subtitle2'>Category</Typography>
                <ReactSelect />
            </Box>

            {/* Brands */}
            <Box sx={vertStyle}>                
                <Typography variant='subtitle2'>Brand</Typography>
                <ReactSelect />
            </Box>

            {/* Label */}
            <Box sx={vertStyle}>
                <Typography variant='subtitle2'>Product label</Typography>
                <TextField
                    // sx={{ maxWidth: '70%' }}
                    onChange={(e: any) => {
                        pre.label = e.target.value
                        setRefresh({})
                    }}
                    // variant='standard'
                    value={pre.label  || ''}
                    helperText=''
                    autoComplete='off'
                />
            </Box>

            {/* Info */}
            <Box sx={vertStyle}>
                <Typography variant='subtitle2'>Product details</Typography>
                <TextField
                    sx={{}}
                    onChange={(e: any) => {
                        pre.info = e.target.value
                        setRefresh({})
                    }}
                    // variant='standard'
                    autoComplete='off'
                    value={pre.info || ''}
                />
            </Box>

            <Box sx={{display:'flex', justifyContent:'space-between'}}>
                <Box sx={vertStyle}>
                    <Typography variant='subtitle2'>Hsn</Typography>
                    <NumberFormat />
                </Box>
                <Box sx={vertStyle}>
                    <Typography variant='subtitle2'>Gst rate (%)</Typography>
                    <NumberFormat />
                </Box>
                <Box sx={vertStyle}>
                    <Typography variant='subtitle2'>Unit of measurement</Typography>
                    {/* < /> */}
                </Box>
            </Box>
            <Box sx={vertStyle}>
                <Typography variant='subtitle2'>UPC code</Typography>
                <NumberFormat />
            </Box>
            <Button variant='contained' color='success'>Submit</Button>
        </Box>)

}
export { OpeningStockNewProduct }