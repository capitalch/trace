import {
    Box, CloseSharp, DataGridPro,
    GridToolbarFilterButton,
    GridToolbarExport,
    GridToolbarContainer,
    GridFooterContainer,
    IconButton, ReactSelect, Search, SyncSharp, TextField, TreeSelect,
    Typography, useEffect, useIbuki, useRef, useState, useTheme, utils,
    utilMethods,
} from '../redirect'
import { useStockTransactionReport } from "./gr-stock-transaction-report-hook"
import { GridSearchBox } from '../../common/grid-search-box'

function StockTransactionReport() {
    const { fetchData, getColumns, getGridSx, getRowClassName, handleSelectedBrand, handleSelectedCategory, handleSelectedTag, meta } = useStockTransactionReport()
    const pre = meta.current
    const theme = useTheme()
    pre.searchTextRef = useRef({})
    pre.productSearchRef = useRef({})
    const { toDecimalFormat } = utilMethods()

    const reactSelectStyles = {
        option: (base: any) => ({
            ...base,
            padding: '.1rem',
            paddingLeft: '0.8rem',
            width: theme.spacing(22),
        }),
        control: (provided: any) => ({
            ...provided,
            width: theme.spacing(22),
            marginLeft: '.8rem',
        })
    }

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <ProductSearch parentMeta={meta} />
            </Box>
            <DataGridPro
                checkboxSelection={true}
                columns={getColumns()}
                components={{
                    Toolbar: CustomToolbar,
                    Footer: CustomFooter,
                }}
                disableColumnMenu={true}
                disableSelectionOnClick={true}
                getRowClassName={getRowClassName}
                getRowHeight={() => 'auto'}
                rows={pre.filteredRows}
                showCellRightBorder={true}
                showColumnRightBorder={true}
                sx={getGridSx()}
            />
        </Box>
    )

    function CustomToolbar() {
        return (
            <GridToolbarContainer className='grid-toolbar'>
                <Box>
                    <Typography variant='subtitle2'>{pre.subTitle}</Typography>
                </Box>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', rowGap: 1, justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                    <Box sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', rowGap: 1 }}>
                        <Typography variant='subtitle1' sx={{ fontWeight: 'bold' }}>{pre.title}</Typography>
                        <GridToolbarFilterButton color='primary' />
                        <GridToolbarExport color='info' />

                        {/* Select brand */}
                        <ReactSelect
                            menuPlacement='auto' placeholder='Select tag'
                            styles={reactSelectStyles}
                            options={pre.options.optionsBrand}
                            value={pre.options.selectedBrand}
                            onChange={
                                (selectedBrand: any) => {
                                    handleSelectedBrand(selectedBrand)
                                }}
                        />
                        {/* Select category */}
                        <TreeSelect options={pre.options.catTree}
                            onChange={(e: any) => handleSelectedCategory(e.value)}
                            value={pre.options.selectedCategory}
                        />

                        {/* Select tag */}
                        <ReactSelect
                            menuPlacement='auto' placeholder='Select tag'
                            styles={reactSelectStyles}
                            options={pre.options.optionsTag}
                            value={pre.options.selectedTag}
                            onChange={
                                (selectedTag: any) => {
                                    handleSelectedTag(selectedTag)
                                }}
                        />

                        {/* Sync */}
                        <IconButton
                            size="small"
                            color="secondary"
                            onClick={fetchData}>
                            <SyncSharp fontSize='small'></SyncSharp>
                        </IconButton>
                    </Box>
                    <GridSearchBox parentMeta={meta} />
                </Box>
            </GridToolbarContainer>
        )
    }

    function CustomFooter() {
        return (<GridFooterContainer >
            <Box sx={{ width: '100%', display: 'flex', fontSize: theme.spacing(1.8), color: theme.palette.common.black }}>
                <Box sx={{ display: 'flex', columnGap: theme.spacing(2), rowGap: theme.spacing(1) }}>
                    <Box>{''.concat('Count', ' : ', String(toDecimalFormat(pre.filteredRows.length) || 0))}</Box>
                    <Box>{''.concat('Selected count', ' : ', String(pre.selectedRowsObject?.count || 0))}</Box>
                    <Box>{''.concat('Selected close', ' : ', toDecimalFormat(pre?.selectedRowsObject?.closValue || 0))}</Box>
                </Box>
                <Box sx={{ display: 'flex', ml: 'auto', columnGap: theme.spacing(2), rowGap: theme.spacing(1) }}>
                    <Box>{''.concat('Op', ' : ', toDecimalFormat(pre?.totals?.opValue || 0))}</Box>
                    <Box sx={{ fontWeight: 'bolder' }}>{''.concat('Clos', ' : ', toDecimalFormat(pre?.totals?.closValue || 0))}</Box>
                    <Box>{''.concat('Increase', ' : ', toDecimalFormat((pre?.totals?.closValue || 0) - (pre?.totals?.opValue || 0)))}</Box>
                </Box>
            </Box>
        </GridFooterContainer>)
    }
}

export { StockTransactionReport }

function ProductSearch({ parentMeta }: any) {
    const [, setRefresh] = useState({})
    const { debounceEmit, debounceFilterOn, emit, } = useIbuki()
    const theme = useTheme()
    const pre = parentMeta.current
    const { getGridReportSubTitle } = utils()

    useEffect(() => {
        pre.subTitle = getGridReportSubTitle()
        const subs1 = debounceFilterOn(pre.productSearchDebounceMessage).subscribe((d: any) => {
            productSearch(d.data)
        })
        return (() => {
            subs1.unsubscribe()
        })
    }, [])

    return (
        <TextField
            autoComplete='off'
            InputProps={{
                startAdornment: <>
                    <Search fontSize="small" />
                </>,
                endAdornment: (
                    <IconButton
                        title="Clear"
                        aria-label="Clear"
                        size="small"
                        sx={{
                            visibility: pre.productSearchText ? 'visible' : 'hidden'
                        }}
                        onClick={handleProductSearchClear} >
                        <CloseSharp fontSize="small" />
                    </IconButton>
                ),
            }}
            onChange={handleOnChangeProductSearch}
            label='Product search'
            placeholder='Product search'
            size='small'
            sx={{ marginBottom: theme.spacing(1) }}
            value={pre.productSearchText || ''}
            variant='standard'
        />
    )

    function handleOnChangeProductSearch(e: any) {
        pre.productSearchText = e.target.value
        setRefresh({})
        debounceEmit(pre.productSearchDebounceMessage, e.target.value)
    }

    function handleProductSearchClear(e: any) {
        pre.productSearchText = ''
        productSearch('')
    }

    function productSearch(txt: string) {
        pre.filteredRows = pre.allRows.filter((row: any) => row.product.toLowerCase().includes(txt.toLowerCase()))
        pre.setRefresh({})
    }
}
