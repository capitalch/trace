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
import { useStockTransactionReport } from "./gr-stock-transaction-report-hook"

function StockTransactionReport() {
    const { fetchData, getColumns, getGridSx, getRowClassName, handleSelectedBrand, handleSelectedCategory, handleSelectedTag, meta } = useStockTransactionReport()
    const megaData: IMegaData = useContext(MegaDataContext)
    const pre = meta.current
    const theme = useTheme()
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
            // density='compact'
            disableColumnMenu={true}
            disableSelectionOnClick={true}
            getRowClassName={getRowClassName}
            // onSelectionModelChange={onSelectModelChange}
            getRowHeight={() => 'auto'}
            // rowHeight={23}
            // isRowSelectable={()=>false}
            rows={pre.filteredRows}
            // rowSpacingType='border'
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
                        <GridToolbarColumnsButton color='secondary' />
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
                        {/* <ReactSelect
                            menuPlacement='auto' placeholder='Select tag'
                            styles={reactSelectStyles}
                            // options={allTagsOptions}
                            value={pre.selectedTagOption}
                            onChange={
                                (selectedTag: any) => {
                                    // handleSelectedTagOption(selectedTag)
                                }}
                        /> */}
                        {/* Select tag */}
                        {/* <Typography variant='body2' sx={{ ml: 1, mr: 1 }}> Tag</Typography> */}
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
                    {/* <GridSearchBox parentMeta={meta} /> */}
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