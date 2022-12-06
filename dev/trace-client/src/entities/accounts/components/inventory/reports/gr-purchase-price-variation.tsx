import {
    Box, Button, CloseSharp, DataGridPro,
    GridToolbarFilterButton,
    GridToolbarExport,
    GridToolbarContainer,
    GridToolbarColumnsButton,
    GridFooterContainer,
    IconButton, IMegaData, MegaDataContext, moment, ReactSelect, SyncSharp, TextField, TreeSelect,
    Typography, useContext, useRef, useState, useTheme,
    useStockSummaryReport, utilMethods,
} from '../redirect'
import { usePurchasePriceVariation } from './gr-purchase-price-variation-hook'
function PurchasePriceVariation() {
    // const { fetchData, getAgeingOptions, getColumns, getGridSx, getRowClassName, handleAgeingOptionSelected, handleSelectedBrand, handleSelectedCategory, handleSelectedTag, handleTrim, meta, onSelectModelChange, } = usePurchasePriceVariation()
    const { getColumns, getGridSx, getRowClassName, meta } = usePurchasePriceVariation()
    const megaData: IMegaData = useContext(MegaDataContext)
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
            getRowClassName={getRowClassName}
            // onSelectionModelChange={onSelectModelChange}
            rowHeight={25}
            getRowHeight={() => 'auto'}
            rows={pre.filteredRows}
            showCellRightBorder={true}
            showColumnRightBorder={true}
            sx={getGridSx()}
        />
    )
}
export { PurchasePriceVariation }