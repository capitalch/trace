import {
    Box,
    CloseSharp,
    DataGridPro,
    GridToolbarFilterButton,
    GridToolbarExport,
    GridToolbarContainer,
    GridToolbarColumnsButton,
    GridFooterContainer,
    IconButton,
    moment,
    ReactSelect,
    SyncSharp,
    TextField,
    Typography,
    useRef,
    useState,
    useTheme,
    useStockSummaryReport,
    utilMethods,
} from '../redirect'
import { GridSearchBox } from '../../common/grid-search-box'
import { useProductsListReport } from './gr-products-list-report-hook'

function ProductsListReport() {
    const theme = useTheme()
    const { toDecimalFormat } = utilMethods()
    const {fetchData, getColumns, getGridSx, meta } = useProductsListReport()
    const pre = meta.current
    pre.searchTextRef = useRef({})

    return (
        <DataGridPro
            checkboxSelection={true}
            columns={getColumns()}
            components={{
                Toolbar: CustomToolbar,
            }}
            disableColumnMenu={true}
            disableSelectionOnClick={true}
            // getRowClassName={getRowClassName}
            // onSelectionModelChange={onSelectModelChange}
            rowHeight={70}
            rows={pre.filteredRows}
            showCellRightBorder={true}
            showColumnRightBorder={true}
            sx={getGridSx()}
        />
    )

    function CustomToolbar(){
        const [, setRefresh] = useState({})
        return(
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
                    </Box>
                    <GridSearchBox parentMeta={meta} />
                </Box>
            </GridToolbarContainer>
        )
    }
}

export { ProductsListReport }
