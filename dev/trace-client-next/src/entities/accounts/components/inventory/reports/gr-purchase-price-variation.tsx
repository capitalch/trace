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
import { usePurchasePriceVariation } from './gr-purchase-price-variation-hook'
function PurchasePriceVariation() {
    // const { fetchData, getAgeingOptions, getColumns, getGridSx, getRowClassName, handleAgeingOptionSelected, handleSelectedBrand, handleSelectedCategory, handleSelectedTag, handleTrim, meta, onSelectModelChange, } = usePurchasePriceVariation()
    const {fetchData, getColumns, getGridSx, getRowClassName, handleSelectedBrand, handleSelectedCategory, handleSelectedTag, meta } = usePurchasePriceVariation()
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
                // Footer: CustomFooter,
            }}
            disableColumnMenu={true}
            disableSelectionOnClick={true}
            getRowClassName={getRowClassName}
            rowHeight={25}
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
                        <TreeSelect options={pre.options.catTree} style={{marginLeft:'0.8rem'}}
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
                    {/* <GridSearchBox parentMeta={meta} /> */}
                </Box>
            </GridToolbarContainer>
        )
    }
}
export { PurchasePriceVariation }