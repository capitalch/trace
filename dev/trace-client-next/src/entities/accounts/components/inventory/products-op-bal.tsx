import { useSharedElements } from "../common/shared-elements-hook"
import {
    Box,
    Card,
    Theme,
    createStyles,
    makeStyles,
} from '../../../../imports/gui-imports'
import { useProductsOpBal } from "./products-op-bal-hook"
function ProductsOpBal() {
    const { XXGrid } = useSharedElements()
    const { getXXGridAttributes } = useProductsOpBal()
    const { actionMessages, columns, sqlQueryArgs, sqlQueryId, specialColumns, summaryColNames, title } = getXXGridAttributes()
    return (<Box>
        <XXGrid
            columns={columns}
            gridActionMessages={actionMessages}
            hideFiltersButton={true}
            hideColumnsButton={true}
            // hideFilteredButton={true}
            hideExportButton={true}
            hideViewLimit={true}
            specialColumns={specialColumns}
            sqlQueryArgs={sqlQueryArgs}
            sqlQueryId={sqlQueryId}
            summaryColNames={summaryColNames}
            title={title}
        />
    </Box>)
}

export { ProductsOpBal }