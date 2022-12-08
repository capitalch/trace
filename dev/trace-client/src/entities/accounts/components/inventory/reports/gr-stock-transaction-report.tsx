import {
    Box,CloseSharp, DataGridPro,
    GridToolbarFilterButton,
    GridToolbarExport,
    GridToolbarContainer,
    GridToolbarColumnsButton,
    GridFooterContainer,
    IconButton, ReactSelect, Search, SyncSharp, TextField, TreeSelect,
    Typography, useRef, useState, useTheme,
    utilMethods,
} from '../redirect'
import { useStockTransactionReport } from "./gr-stock-transaction-report-hook"
import { GridSearchBox } from '../../common/grid-search-box'

function StockTransactionReport() {
    const { fetchData, getColumns, getGridSx, getRowClassName, handleOnChangeProductSearch, handleSelectedBrand, handleSelectedCategory, handleSelectedTag, meta } = useStockTransactionReport()
    const pre = meta.current
    const theme = useTheme()
    pre.searchTextRef = useRef({})
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
    )

    function CustomToolbar() {
        const [, setRefresh] = useState({})
        return (
            <GridToolbarContainer className='grid-toolbar'>
                <Box>
                    <Typography variant='subtitle2'>{pre.subTitle}</Typography>
                </Box>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', rowGap: 1, justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                    <Box sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', rowGap: 1 }}>
                        <Typography variant='subtitle1' sx={{ fontWeight: 'bold' }}>{pre.title}</Typography>
                        {/* <GridToolbarColumnsButton color='secondary' /> */}
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
                    
                        {/* Product search */}
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
                                        // onClick={handleClear}
                                        >
                                        <CloseSharp fontSize="small" />
                                    </IconButton>
                                ),
                            }}
                            onChange={handleOnChangeProductSearch}
                            placeholder='Product search'
                            size='small'
                            sx={{marginLeft:'0.8rem'}}
                            value = {pre.productSearchText}
                            variant='outlined'
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
                    <Box>{''.concat('Count', ' : ', String(toDecimalFormat(pre.filteredRows.length - 1) || 0))}</Box>
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