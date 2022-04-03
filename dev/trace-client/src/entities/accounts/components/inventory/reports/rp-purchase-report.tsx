import {
    Box, DataGridPro,
    GridToolbarFilterButton,
    GridToolbarExport,
    GridToolbarContainer,
    GridToolbarColumnsButton,
    GridFooterContainer,
    IconButton, ReactSelect, SyncSharp, TextField,
    Typography, useRef, useState, useTheme,
    utilMethods,
} from '../redirect'
import { GridSearchBox } from './grid-search-box'
import { usePurchaseReport } from './rp-purchase-report-hook'

function PurchaseReport() {
    const { fetchData, getColumns, getGridSx,
        getPurchasePeriodOptions,
        getRowClassName,
        handleOptionSelected,
        onSelectionModelChange,
        meta, multiData } = usePurchaseReport()
    const pre = meta.current
    const theme = useTheme()
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
            // height:theme.spacing(1.5)
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
            onSelectionModelChange={onSelectionModelChange}
            rowHeight={25}
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
                        {/* Sale period */}
                        <ReactSelect menuPlacement='auto' placeholder='Select Sale period'
                            styles={reactSelectStyles}
                            options={getPurchasePeriodOptions()}
                            value={pre.selectedOption}
                            onChange={
                                (optionSelected: any) => {
                                    handleOptionSelected(optionSelected)
                                    setRefresh({})
                                }} />
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
            <Box sx={{ display: 'flex', flexDirection: 'row', columnGap: theme.spacing(2), fontSize: theme.spacing(1.8), color: 'dodgerblue', flexWrap: 'wrap', }}>
                <Box>{''.concat('Count', ' : ', String(toDecimalFormat(pre.filteredRows.length - 1) || 0))}</Box>
                <Box>{''.concat('Count(selected)', ' : ', String(pre.selectedRowsObject?.count || 0))}</Box>
                <Box>{''.concat('Aggr purchase(Selected)', ' : ', toDecimalFormat(pre?.selectedRowsObject?.aggrPurchase || 0))}</Box>
                <Box>{''.concat('Purchase with gst(Selected)', ' : ', toDecimalFormat(pre?.selectedRowsObject?.amount || 0))}</Box>
                {/* <Box>{''.concat('Selected gross profit', ' : ', toDecimalFormat(pre?.selectedRowsObject?.profit || 0))}</Box> */}
                <Box>{''.concat('Total qty', ' : ', toDecimalFormat(pre?.totals?.qty || 0))}</Box>
                <Box>{''.concat('Aggr purchase', ' : ', toDecimalFormat(pre?.totals?.aggrPurchase || 0))}</Box>
                <Box>{''.concat('Purchase with gst', ' : ', toDecimalFormat(pre?.totals?.amount || 0))}</Box>
                {/* <Box>{''.concat('Gross profit', ' : ', toDecimalFormat((pre?.totals?.grossProfit || 0) - (pre?.totals?.opValue || 0)))}</Box> */}
            </Box>
        </GridFooterContainer>)
    }
}
export { PurchaseReport }