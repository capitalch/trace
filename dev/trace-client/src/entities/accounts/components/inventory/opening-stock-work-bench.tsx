import { useOpeningStockWorkBench } from "./opening-stock-work-bench-hook"
import { Box, Button, CloseSharp, Dialog, DialogContent, DialogTitle, IconButton, Input, NumberFormat, TextField, Tooltip, Typography, useSharedElements, useTheme } from './redirect'
import { OpeningStockNewProduct } from './opening-stock-new-product'

function OpeningStockWorkBench() {
    const { ReactSelect } = useSharedElements()
    const { checkError, handleCloseDialog, handleNewProduct, handleReset, handleSubmit, meta, onBrandChanged, onCategoryChanged, onProductChanged, setRefresh } = useOpeningStockWorkBench()
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

    const errorStyle = (selected: string) => {
        return {
            control: (provided: any) => ({
                ...provided,
                border: pre[selected]?.value ? '1px solid lightGrey' : '3px solid red'
            })
        }
    }

    return (
        <Box sx={{ display: 'flex', border: '4px solid orange', rowGap: 3, flexDirection: 'column', p: 3, w: 30 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Typography variant="caption" color='GrayText'>Category</Typography>
                <ReactSelect options={pre.filteredCategories || []} maxMenuHeight={250} placeholder='Select category'
                    menuPlacement="auto" styles={{ ...styles, ...errorStyle('selectedCategory') }} onChange={onCategoryChanged} value={pre.selectedCategory} />
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Typography variant="caption" color='GrayText'>Brand</Typography>
                <ReactSelect options={pre.filteredBrands || []} maxMenuHeight={250} placeholder='Select brand'
                    menuPlacement="auto" styles={{ ...styles, ...errorStyle('selectedBrand') }} onChange={onBrandChanged} value={pre.selectedBrand} />
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Typography variant="caption" color='GrayText'>Label</Typography>
                <ReactSelect options={pre.filteredProducts || []} maxMenuHeight={200} placeholder='Select label'
                    menuPlacement="auto" styles={{ ...styles, ...errorStyle('selectedProduct') }} onChange={onProductChanged} value={pre.selectedProduct} />
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Typography variant="caption" color='GrayText'>Qty</Typography>
                    <NumberFormat
                        placeholder="Qty"
                        sx={{ width: theme.spacing(14), '& input': { textAlign: 'end' }, }}

                        allowNegative={true}

                        customInput={Input}
                        decimalScale={2}
                        fixedDecimalScale={true}
                        onFocus={(e: any) => {
                            e.target.select()
                        }}
                        error={pre?.qty === 0}
                        onValueChange={(values: any) => {
                            const { floatValue } = values
                            pre.qty = floatValue
                            setRefresh({})
                        }}
                        thousandSeparator={true}
                        value={pre.qty || 0.0}
                    />
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Typography variant="caption" color='GrayText'>Opening price</Typography>
                    <NumberFormat
                        sx={{ width: theme.spacing(14), '& input': { textAlign: 'end' }, }}
                        allowNegative={false}
                        customInput={Input}
                        decimalScale={2}
                        fixedDecimalScale={true}
                        onFocus={(e: any) => {
                            e.target.select()
                        }}
                        onValueChange={(values: any) => {
                            const { floatValue } = values
                            pre.openingPrice = floatValue
                            setRefresh({})
                        }}
                        thousandSeparator={true}
                        value={pre.openingPrice || 0.0}
                    />
                </Box>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Typography variant='caption' color='GrayText'>Last purchase date</Typography>
                <TextField
                    sx={{ maxWidth: '60%' }}
                    variant='standard'
                    type="date"
                    onChange={(e: any) => {
                        pre.lastPurchaseDate = e.target.value
                        setRefresh({})
                    }}
                    onFocus={(e: any) => e.target.select()}
                    value={pre.lastPurchaseDate}
                />
            </Box>
            <Button variant="contained" color="success" size='medium' disabled={checkError()} onClick={handleSubmit} >
                Submit
            </Button>
            <Button variant="contained" color="warning" size='medium' onClick={handleReset}>
                Reset
            </Button>
            <Button variant="contained" color="info" size='medium' onClick={handleNewProduct}>
                New product
            </Button>
            <Dialog
                open={pre.showDialog}
                onClose={(e, reason) => {
                    if (!['escapeKeyDown', 'backdropClick'].includes(reason)) {
                        handleCloseDialog()
                    }
                }}
                fullWidth={true}
                // maxWidth="md"
            >
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
                    <OpeningStockNewProduct />
                </DialogContent>
            </Dialog>
        </Box>
    )
}

export { OpeningStockWorkBench }