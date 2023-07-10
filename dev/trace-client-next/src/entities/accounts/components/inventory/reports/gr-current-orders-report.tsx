import {
    DataGridPro,
} from '../redirect'
import { useCurrentOrdersReport } from './gr-current-orders-report-hook'

function CurrentOrdersReport() {
    const { getColumns, getGridSx, getRowClassName, meta } = useCurrentOrdersReport()
    const pre = meta.current
    // const theme = useTheme()
    // const { toDecimalFormat } = utilMethods()
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
            // getCellClassName={()=>'cell-class'}
            getRowClassName={getRowClassName}
            // onSelectionModelChange={onSelectModelChange}
            getRowHeight={() => 'auto'}
            rows={pre.filteredRows}
            showCellRightBorder={true}
            showColumnRightBorder={true}
            sx={getGridSx()}
        />
    )
}

export { CurrentOrdersReport }