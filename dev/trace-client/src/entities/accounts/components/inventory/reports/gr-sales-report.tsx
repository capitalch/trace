import {
    Box, DataGridPro,
    GridToolbarFilterButton,
    GridToolbarExport,
    GridToolbarContainer,
    GridToolbarColumnsButton,
    GridFooterContainer,
    IconButton, IMegaData, MegaDataContext, ReactSelect, SyncSharp, TextField,
    Typography, useContext, useRef, useState, useTheme, utilMethods,
} from '../redirect'
import { GridSearchBox } from '../../common/grid-search-box'
import { useSalesReport } from './gr-sales-report-hook'

function SalesReport() {
    const { fetchData, getAgeingOptions, getColumns, getGridSx, getSalesPeriodOptions, getRowClassName, handleAgeingOptionSelected, handleOptionSelected, handleSelectedTagOption, meta, onSelectModelChange } = useSalesReport()
    const pre = meta.current
    const theme = useTheme()
    const megaData: IMegaData = useContext(MegaDataContext)
    const allTags: any[] = megaData.accounts.inventory.allTags
    const allTagsOptions = allTags.map((x: any) => ({ label: x.tagName, value: x.id1 }))
    allTagsOptions.unshift({ label: 'All', value: 0 })
    const { toDecimalFormat } = utilMethods()

    pre.searchTextRef = useRef({})

    const reactSelectStyles = {
        option: (base: any) => ({
            ...base,
            padding: '.1rem',
            paddingLeft: '0.8rem',
            width: theme.spacing(15),
            fontSize: theme.spacing(1.6)
        }),
        control: (provided: any) => ({
            ...provided,
            width: theme.spacing(18),
            fontSize: theme.spacing(1.7),
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
            rowHeight={75}
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
                    <Box sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', rowGap: 1, columnGap:0.5 }}>
                        <Typography variant='subtitle1' sx={{ fontWeight: 'bold' }}>{pre.title}</Typography>
                        <GridToolbarColumnsButton color='secondary' />
                        <GridToolbarFilterButton color='primary' />
                        <GridToolbarExport color='info' />
                        {/* Sale period */}
                        <ReactSelect menuPlacement='auto' placeholder='Select Sale period'
                            styles={reactSelectStyles}
                            options={getSalesPeriodOptions()}
                            value={pre.selectedOption}
                            onChange={
                                (optionSelected: any) => {
                                    handleOptionSelected(optionSelected)
                                    setRefresh({})
                                }} />
                        {/* Select tag */}
                        <Typography variant='body2' sx={{ ml: 1, mr: 1 }}> Tag</Typography>
                        <ReactSelect
                            menuPlacement='auto' placeholder='Select tag'
                            styles={reactSelectStyles}
                            options={allTagsOptions}
                            value={pre.selectedTagOption}
                            onChange={
                                (selectedTag: any) => {
                                    handleSelectedTagOption(selectedTag)
                                }}
                        />
                        <Typography variant='subtitle1' sx={{ ml: 2 }}>From</Typography>
                        {/* from date  */}
                        <TextField
                            sx={{ ml: 2 }}
                            size='small'
                            type='date'
                            value={pre.startDate || ''}
                            onChange={(e: any) => {
                                pre.startDate = e.target.value
                                setRefresh({})
                            }}
                        />
                        <Typography variant='subtitle1' sx={{ ml: 2 }}>To</Typography>
                        {/* to date */}
                        <TextField
                            sx={{ ml: 2 }}
                            size='small'
                            type='date'
                            onChange={(e: any) => {
                                pre.endDate = e.target.value
                                setRefresh({})
                            }}

                            value={pre.endDate || ''}
                        />
                        <ReactSelect menuPlacement='auto' placeholder='Select ageing'
                            styles={reactSelectStyles}
                            options={getAgeingOptions()}
                            value={pre.selectedAgeingOption} onChange={handleAgeingOptionSelected}
                        />
                        {/* Sync */}
                        <IconButton
                            size="small"
                            color="secondary"
                            onClick={fetchData}>
                            <SyncSharp fontSize='small'></SyncSharp>
                        </IconButton>
                        <GridSearchBox parentMeta={meta} />
                    </Box>
                    
                </Box>
            </GridToolbarContainer>
        )
    }

    function CustomFooter() {
        return (<GridFooterContainer >
            <Box sx={{ width: '100%', display: 'flex', columnGap: theme.spacing(2), fontSize: theme.spacing(1.8), color: theme.palette.common.black, flexWrap: 'wrap', }}>
                <Box>{''.concat('Count', ' : ', String(toDecimalFormat(pre.filteredRows.length - 1) || 0))}</Box>
                <Box>{''.concat('Count(Selected)', ' : ', String(pre.selectedRowsObject?.count || 0))}</Box>
                <Box>{''.concat('Aggr(Selected)', ' : ', toDecimalFormat(pre?.selectedRowsObject?.aggrSale || 0))}</Box>
                <Box>{''.concat('Sale(Selected)', ' : ', toDecimalFormat(pre?.selectedRowsObject?.amount || 0))}</Box>
                <Box>{''.concat('GP(Selected)', ' : ', toDecimalFormat(pre?.selectedRowsObject?.grossProfit || 0))}</Box>
                <Box sx={{ display: 'flex', fontWeight: 'bold', ml: 'auto', flexWrap: 'wrap', columnGap: theme.spacing(2), rowGap: theme.spacing(1) }}>
                    <Box>{''.concat('Qty', ' : ', toDecimalFormat(pre?.totals?.qty || 0))}</Box>
                    <Box>{''.concat('Sale', ' : ', toDecimalFormat(pre?.totals?.amount || 0))}</Box>
                    <Box >{''.concat('Aggr', ' : ', toDecimalFormat(pre?.totals?.aggrSale || 0))}</Box>
                    <Box>{''.concat('GP', ' : ', toDecimalFormat((pre?.totals?.grossProfit || 0) - (pre?.totals?.opValue || 0)))}</Box>
                    <Box>{''.concat('Age360Sale', ' : ', toDecimalFormat((pre?.totals?.age360Sale || 0)))}</Box>
                    <Box>{''.concat('Age360Aggr', ' : ', toDecimalFormat((pre?.totals?.age360Aggr || 0)))}</Box>
                    <Box>{''.concat('Age360GP', ' : ', toDecimalFormat((pre?.totals?.age360GrossProfit || 0)))}</Box>
                </Box>
            </Box>
        </GridFooterContainer>)
    }

}

export { SalesReport }
