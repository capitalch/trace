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

function ProductsListReport() {
    const theme = useTheme()
    const { toDecimalFormat } = utilMethods()
    const { getColumns, meta } = useStockSummaryReport()
    const pre = meta.current
    pre.searchTextRef = useRef({})

    return (<DataGridPro
        checkboxSelection={true}
        columns={getColumns()}
        disableColumnMenu={true}
        disableSelectionOnClick={true}
        // getRowClassName={getRowClassName}
        // onSelectionModelChange={onSelectModelChange}
        rowHeight={70}
        rows={pre.filteredRows}
        showCellRightBorder={true}
        showColumnRightBorder={true}
    // sx={getGridSx()}
    />)
}

export { ProductsListReport }