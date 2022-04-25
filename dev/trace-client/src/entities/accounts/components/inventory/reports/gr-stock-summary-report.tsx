import {
    Box, CloseSharp, DataGridPro,
    GridToolbarFilterButton,
    GridToolbarExport,
    GridToolbarContainer,
    GridToolbarColumnsButton,
    GridFooterContainer,
    IconButton, moment, ReactSelect, SyncSharp, TextField,
    Typography, useRef, useState, useTheme,
    useStockSummaryReport, utilMethods,
} from '../redirect'
import { GridSearchBox } from '../../common/grid-search-box'

function StockSummaryReport() {
    const { fetchData, getAgeingOptions, getColumns, getGridSx, getRowClassName, handleAgeingOptionSelected, meta, onSelectModelChange, } = useStockSummaryReport()
    const pre = meta.current
    const theme = useTheme()
    const { toDecimalFormat } = utilMethods()
    pre.searchTextRef = useRef({})

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
            componentsProps={{
                row: {
                    // onMouseOver: handleOnMouseOver, 
                    // onMouseEnter: handleOnMouseEnter
                }
            }}
            disableColumnMenu={true}
            disableSelectionOnClick={true}
            getRowClassName={getRowClassName}
            // isRowSelectable={(e:any)=>false}
            onSelectionModelChange={onSelectModelChange}
            rowHeight={70}
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
                        {/* Sync */}
                        <IconButton
                            size="small"
                            color="secondary"
                            onClick={fetchData}>
                            <SyncSharp fontSize='small'></SyncSharp>
                        </IconButton>
                        <ReactSelect menuPlacement='auto' placeholder='Select ageing'
                            styles={reactSelectStyles}
                            options={getAgeingOptions()}
                            value={pre.selectedAgeingOption} onChange={handleAgeingOptionSelected}
                        />
                        <Box sx={{ display: 'flex', ml: 1, flexWrap: 'wrap', alignItems: 'center', border: '1px solid lightGrey' }}>
                            <Typography sx={{ ml: 1, }} variant='subtitle2'>Stock on date:</Typography>
                            <IconButton
                                title="Clear"
                                aria-label="Clear"
                                size="small"
                                onClick={() => {
                                    // multiData.generic.stockOnDate = moment().format('YYYY-MM-DD')
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
                                    // multiData.generic.stockOnDate = e.target.value
                                    pre.stockDate = e.target.value
                                    setRefresh({})
                                }}
                                onFocus={(e: any) => e.target.select()}
                                // value={multiData.generic.stockOnDate || ''}
                                value={pre.stockDate || ''}
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
                        </Box>
                    </Box>
                    <GridSearchBox parentMeta={meta} />
                </Box>
            </GridToolbarContainer>
        )
    }

    function CustomFooter() {
        return (<GridFooterContainer >
            <Box sx={{ width:'100%', display: 'flex', fontSize: theme.spacing(1.8), color: theme.palette.common.black }}>
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

export { StockSummaryReport }