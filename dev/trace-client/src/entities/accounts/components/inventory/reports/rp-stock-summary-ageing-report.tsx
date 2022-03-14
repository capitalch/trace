import { fontSize } from '@mui/system'
import {
    Box, DataGridPro,
    GridToolbarFilterButton,
    GridToolbarExport,
    GridToolbarContainer,
    GridToolbarColumnsButton,
    GridCellParams,
    GridFooterContainer, GridRowId, useTheme,
    useStockSummaryAgeingReport
} from '../redirect'

function StockSummaryAgeingReport() {
    const { meta, fetchData, getColumns, } = useStockSummaryAgeingReport()
    const pre = meta.current
    const theme = useTheme()
    return (
        <DataGridPro
            checkboxSelection={true}
            columns={getColumns()}
            components={{
                Toolbar: CustomToolbar,
                // Footer: CustomFooter
            }}
            disableColumnMenu={true}
            rowHeight={25}
            rows={pre.rows}
            showCellRightBorder={true}
            showColumnRightBorder={true}
            
            sx={{ border: '4px solid orange', p: 1, width: '100%', fontSize: theme.spacing(1.5), minHeight: theme.spacing(60), height: 'calc(100vh - 230px)', fontFamily: 'sans-serif' }}
        />
    )

    function CustomToolbar() {
        return (
            <GridToolbarContainer style={{borderBottom: '1px solid lightgrey'}}>
                <Box>ABCD</Box>
            </GridToolbarContainer>
        )
    }

    function CustomFooter() {
        <GridFooterContainer>
            <Box>ABCD</Box>
        </GridFooterContainer>
    }
}

export { StockSummaryAgeingReport }