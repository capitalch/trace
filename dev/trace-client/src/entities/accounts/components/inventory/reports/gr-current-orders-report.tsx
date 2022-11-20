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
import { useCurrentOrdersReport } from './gr-current-orders-report-hook'

function CurrentOrdersReport() {
    const { fetchData, getColumns, getGridSx, meta } = useCurrentOrdersReport()
    const pre = meta.current
    const theme = useTheme()
    const { toDecimalFormat } = utilMethods()
    return (
        <DataGridPro
            checkboxSelection={true}
            columns={getColumns()}
            // components={{
            //     Toolbar: CustomToolbar,
            //     Footer: CustomFooter,
            // }}
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
}

export { CurrentOrdersReport }