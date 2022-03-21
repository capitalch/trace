import {
    Box, CloseSharp, DataGridPro,
    GridToolbarFilterButton,
    GridToolbarExport,
    GridToolbarContainer,
    GridToolbarColumnsButton,
    GridFooterContainer,
    IconButton, moment, ReactSelect, SyncSharp, TextField,
    Typography, useRef, useState, useTheme,
    useStockSummaryAgeingReport, utilMethods,
} from '../redirect'
import { GridSearchBox } from './grid-search-box'
import {usePurchaseReport} from './rp-purchase-report-hook'

function PurchaseReport() {
    const { fetchData, getColumns, getGridSx, 
        // getSalesPeriodOptions, getRowClassName, handleOptionSelected, 
        meta, multiData } = usePurchaseReport()
    const pre = meta.current
    const theme = useTheme()
    const { toDecimalFormat } = utilMethods()
    return (<div>Purchase</div>)
}
export { PurchaseReport }