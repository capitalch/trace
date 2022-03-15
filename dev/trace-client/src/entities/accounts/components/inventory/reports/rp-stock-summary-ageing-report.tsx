import {
    Box, CloseSharp, DataGridPro, FormControl, FormControlLabel,
    GridToolbarFilterButton,
    GridToolbarExport,
    GridToolbarContainer,
    GridToolbarColumnsButton,
    GridCellParams,
    GridFooterContainer, GridRowId,
    IconButton, Radio, RadioGroup, ReactSelect, Search, SyncSharp, TextField,
    Typography, useEffect, useIbuki, useRef, useState, useTheme,
    useStockSummaryAgeingReport, utilMethods, utils
} from '../redirect'

function StockSummaryAgeingReport() {
    const { meta, fetchData, getColumns, getRowClassName } = useStockSummaryAgeingReport()
    const pre = meta.current
    const theme = useTheme()
    const { toDecimalFormat } = utilMethods()
    pre.searchTextRef = useRef({})

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
            rowHeight={25}
            rows={pre.filteredRows}
            showCellRightBorder={true}
            showColumnRightBorder={true}
            sx={getGridSx()}
        />
    )

    function CustomToolbar() {
        return (
            <GridToolbarContainer className='grid-toolbar'>
                <Box>
                    <Typography variant='subtitle2'>{pre.subTitle}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                    <Box sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
                        <Typography variant='subtitle1' sx={{ fontWeight: 'bold', mt:.5 }}>{pre.title}</Typography>
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
                        <ReactSelect menuPlacement='auto' placeholder='Stock ageing' 
                        // styles={styles}
                            // options={reportsJson} value={pre.selectedReport} onChange={onReportSelected}
                             />
                        {/* <FormControl> */}
                        {/* <Box sx={{display:'flex', flexDirection:'row', flexWrap:'wrap'}} > */}
                        {/* <RadioGroup row sx={{ display: 'flex', fontSize:theme.spacing(1) }}> */}
                        {/* <div radioGroup='grp-name'>
                            <FormControlLabel sx={{ fontSize: theme.spacing(0.5) }} value='allDates' label='All' control={<Radio size='small' name='grp-name' />} />
                            <FormControlLabel value='lessThan90' label='< 90 D' control={<Radio size='small' radioGroup='grp-name' />} />
                            <FormControlLabel value='greaterThan90' label='> 90 D' control={<Radio size='small' radioGroup='grp-name' />} />
                            <FormControlLabel value='greaterThan180' label='> 180 D' control={<Radio size='small' radioGroup='grp-name' />} />
                            <FormControlLabel value='greaterThan270' label='> 270 D' control={<Radio size='small' radioGroup='grp-name' />} />
                            <FormControlLabel value='greaterThan360' label='> 360 D' control={<Radio size='small' radioGroup='grp-name' />} />
                        </div> */}
                        {/* </RadioGroup> */}
                        {/* </Box> */}
                        {/* </FormControl> */}
                    </Box>
                    <GridSearchBox parentMeta={meta} />
                </Box>
            </GridToolbarContainer>
        )
    }

    function CustomFooter() {
        return (<GridFooterContainer >
            <Box sx={{ display: 'flex', flexDirection: 'row', columnGap: theme.spacing(2), fontWeight: 'bold', fontSize: theme.spacing(1.8), color: 'dodgerblue', flexWrap: 'wrap', }}>
                <Box>{''.concat('Count', ' : ', String(toDecimalFormat(pre.filteredRows.length - 1) || 0))}</Box>
                <Box>{''.concat('Op stock value', ' : ', toDecimalFormat(pre?.totals?.opValue || 0))}</Box>
                <Box>{''.concat('Clos stock value', ' : ', toDecimalFormat(pre?.totals?.closValue || 0))}</Box>
                <Box>{''.concat('Incr in stock value', ' : ', toDecimalFormat((pre?.totals?.closValue || 0) - (pre?.totals?.opValue || 0)))}</Box>
            </Box>
        </GridFooterContainer>)
    }

    function getGridSx() {
        return (
            {
                border: '4px solid orange',
                p: 1, width: '100%',
                fontSize: theme.spacing(1.5),
                minHeight: theme.spacing(80),
                height: 'calc(100vh - 230px)',
                fontFamily: 'sans-serif',
                '& .footer-row-class': {
                    backgroundColor: theme.palette.grey[300]
                },
                '& .header-class': {
                    fontWeight: 'bold',
                    color: 'green',
                    fontSize: theme.spacing(1.8),
                    // backgroundColor: theme.palette.grey[300]
                },
                '& .grid-toolbar': {
                    width: '100%',
                    borderBottom: '1px solid lightgrey',
                    display: 'flex',
                    flexDirection: 'column',
                    // justifyContent:'start',
                    alignItems: 'start'
                }
            }
        )
    }
}

export { StockSummaryAgeingReport }
// { filteredRows, origRows, parentRefresh }: any

function GridSearchBox({ parentMeta }: any) {
    // const [, setRefresh] = useState({})
    const pre = parentMeta.current
    const { debounceEmit, } = useIbuki()

    return (<TextField
        inputRef={pre.searchTextRef}
        variant="standard"
        autoComplete='off'
        value={pre.searchText || ''}
        onChange={handleOnChange}
        placeholder="Search…"
        InputProps={{
            startAdornment: <Search fontSize="small" />,
            endAdornment: (
                <IconButton
                    title="Clear"
                    aria-label="Clear"
                    size="small"
                    sx={{
                        visibility: pre.searchText ? 'visible' : 'hidden'
                    }}
                    onClick={handleClear}>
                    <CloseSharp fontSize="small" />
                </IconButton>
            ),
        }}
    />)

    function handleOnChange(e: any) {
        pre.searchText = e.target.value
        pre.isSearchTextEdited = true

        pre.parentRefresh({})
        debounceEmit('XXX', [requestSearch, e.target.value])
    }

    function handleClear(e: any) {
        pre.searchText = ''
        requestSearch('')
    }

    function requestSearch(searchValue: string) {
        if (searchValue) {
            pre.filteredRows = pre.allRows.filter(
                (row: any) => {
                    return Object.keys(row).some((field) => {
                        const temp: string = row[field]
                            ? row[field].toString()
                            : ''
                        return temp
                            .toLowerCase()
                            .includes(searchValue.toLowerCase())
                    })
                }
            )
        } else {
            pre.filteredRows = pre.allRows.map((x: any) => ({
                ...x,
            }))
        }
        pre.totals = pre.getTotals()
        pre.filteredRows.push(pre.totals)
        pre.parentRefresh({})
    }
}