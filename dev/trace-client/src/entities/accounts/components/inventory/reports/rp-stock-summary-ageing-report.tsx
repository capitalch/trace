import { } from '@mui/material'

import {
    Box, CloseSharp, DataGridPro,
    GridToolbarFilterButton,
    GridToolbarExport,
    GridToolbarContainer,
    GridToolbarColumnsButton,
    GridCellParams,
    GridFooterContainer, GridRowId,
    IconButton, Search, SyncSharp, TextField,
    Typography, useIbuki, useRef, useState, useTheme,
    useStockSummaryAgeingReport, utilMethods, utils
} from '../redirect'

function StockSummaryAgeingReport() {
    const { meta, fetchData, getColumns, getRowClassName } = useStockSummaryAgeingReport()
    const pre = meta.current
    const theme = useTheme()
    const { toDecimalFormat } = utilMethods()
    const { emit } = useIbuki()
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
            // rowSpacingType='margin'
            showCellRightBorder={true}
            showColumnRightBorder={true}
            sx={getGridSx()}
        />
    )

    function CustomToolbar() {
        return (
            <GridToolbarContainer className='grid-toolbar'>
                {/* <Box sx={{ display: 'flex', flexDirection:'column' }}> */}
                <Box>
                    <Typography variant='subtitle2'>{pre.subTitle}</Typography>
                </Box>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant='subtitle1' sx={{ fontWeight: 'bold' }}>{pre.title}</Typography>
                    <GridToolbarColumnsButton color='secondary' />
                    <GridToolbarFilterButton color='primary' />
                    <GridToolbarExport color='info' />
                    <IconButton
                        size="small"
                        color="secondary"
                        onClick={fetchData}>
                        <SyncSharp fontSize='small'></SyncSharp>
                    </IconButton>
                    <GridSearchBox parentMetaCurrent={pre} />
                </Box>
                {/* </Box> */}
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
                minHeight: theme.spacing(60),
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
function GridSearchBox({parentMetaCurrent}:any) {
    const [, setRefresh] = useState({})
    const meta: any = useRef({
        // searchText: ''
    })
    const pre = meta.current

    return (<TextField
        inputRef={meta.current.searchTextRef}
        variant="standard"
        autoComplete='off'
        // autoFocus={!meta.current.isFirstTime}
        value={pre.searchText || ''}
        onChange={handleOnChange}
        // onChange={props.onChange}
        placeholder="Search…"
        // className="global-search"
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
                    // style={{
                    //     visibility: props.value
                    //         ? 'visible'
                    //         : 'hidden',
                    // }}
                    onClick={handleClear}>
                    <CloseSharp fontSize="small" />
                </IconButton>
            ),
        }}
    />)

    function handleOnChange(e: any) {
        parentMetaCurrent.searchText = e.target.value
        // setRefresh({})
        parentMetaCurrent.parentRefresh({})
    }

    function handleClear(e: any) {
        parentMetaCurrent.searchText = ''
        setRefresh({})
    }
}