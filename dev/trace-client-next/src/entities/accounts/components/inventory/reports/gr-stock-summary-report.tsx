import {
    Box, Button, CloseSharp, DataGridPro,
    GridToolbarFilterButton,
    GridToolbarExport,
    GridToolbarContainer,
    GridToolbarColumnsButton,
    GridFooterContainer,
    IconButton, IMegaData, MegaDataContext, moment, ReactSelect, SyncSharp, TextField, TreeSelect,
    Typography, useContext, useRef, useState, useTheme,
    useStockSummaryReport, utilMethods,
} from '../redirect'
import { GridSearchBox } from '../../common/grid-search-box'

function StockSummaryReport() {
    const { fetchData, getAgeingOptions, getColumns, getGridSx, getRowClassName, handleAgeingOptionSelected, handleSelectedBrand, handleSelectedCategory, handleSelectedTag, handleTrim, meta, onSelectModelChange, } = useStockSummaryReport()
    const megaData: IMegaData = useContext(MegaDataContext)
    const pre = meta.current
    const theme = useTheme()
    const { toDecimalFormat } = utilMethods()
    pre.searchTextRef = useRef({})
    const allTags: any[] = megaData.accounts.inventory.allTags
    const allTagsOptions = allTags.map((x: any) => ({ label: x.tagName, value: x.id1 }))
    allTagsOptions.unshift({ label: 'All', value: 0 })

    const reactSelectStyles = {
        option: (base: any) => ({
            ...base,
            padding: '.1rem',
            paddingLeft: '0.8rem',
            width: theme.spacing(18),
        }),
        control: (provided: any) => ({
            ...provided,
            width: theme.spacing(18),
            marginLeft: '.4rem',
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
            onSelectionModelChange={onSelectModelChange}
            rowHeight={25}
            // getRowHeight={() => 'auto'}
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
                        <ReactSelect menuPlacement='auto' placeholder='Select ageing'
                            styles={reactSelectStyles}
                            options={getAgeingOptions()}
                            value={pre.selectedAgeingOption} onChange={handleAgeingOptionSelected}
                        />
                        <Box sx={{ display: 'flex', ml: 1, flexWrap: 'wrap', alignItems: 'center', border: '1px solid lightGrey' }}>
                            <Typography sx={{ ml: 1, }} variant='subtitle2'>Stk dt:</Typography>
                            <IconButton
                                title="Clear"
                                aria-label="Clear"
                                size="small"
                                onClick={() => {
                                    pre.stockDate = moment().format('YYYY-MM-DD')
                                    fetchData()
                                }}>
                                <CloseSharp fontSize="small" />
                            </IconButton>
                            <TextField
                                color='primary'
                                variant="standard"
                                type="date"
                                InputLabelProps={{ shrink: true }}
                                onChange={(e: any) => {
                                    pre.stockDate = e.target.value
                                    setRefresh({})
                                }}
                                onFocus={(e: any) => e.target.select()}
                                value={pre.stockDate || ''}
                            />
                        </Box>
                        <Button variant='outlined' color='primary' sx={{ ml: 1 }} size='small' onClick={handleTrim}>Trim</Button>

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
                        <TreeSelect options={pre.options.catTree} style={{marginLeft:'0.4rem'}}
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
                            onClick={() => {
                                fetchData()
                            }}>
                            <SyncSharp fontSize='small'></SyncSharp>
                        </IconButton>

                        {/* Select tag */}
                        {/* <Typography variant='body2' sx={{ ml: 1, mr: 1 }}> Tag</Typography>
                        <ReactSelect
                            menuPlacement='auto' placeholder='Select tag'
                            styles={reactSelectStyles}
                            options={allTagsOptions}
                            value={pre.selectedTagOption}
                            onChange={
                                (selectedTag: any) => {
                                    handleSelectedTagOption(selectedTag)
                                }}
                        /> */}
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
                    <Box>{''.concat('Gp', ' : ', toDecimalFormat(pre?.totals?.grossProfit || 0))}</Box>
                    <Box>{''.concat('Op', ' : ', toDecimalFormat(pre?.totals?.opValue || 0))}</Box>
                    <Box sx={{ fontWeight: 'bolder' }}>{''.concat('Clos', ' : ', toDecimalFormat(pre?.totals?.closValue || 0))}</Box>
                    <Box>{''.concat('Increase', ' : ', toDecimalFormat((pre?.totals?.closValue || 0) - (pre?.totals?.opValue || 0)))}</Box>
                </Box>
            </Box>
        </GridFooterContainer>)
    }
}

export { StockSummaryReport }