import { useSharedElements } from '../common/shared-elements-hook'
import { useContext } from '../../../../imports/regular-imports'
import { useSaleView, useStyles } from './sale-view-hook'
import { Box, } from '../../../../imports/gui-imports'
import { SalesContext } from './sales-provider'

function SaleView({ drillDownEditAttributes }: any) {
    const classes = useStyles()
    const arbitraryData: any = useContext(SalesContext)
    const { getXXGridParams, meta } = useSaleView(
        arbitraryData,
        drillDownEditAttributes
    )

    const {
        XXGrid
    } = useSharedElements()
    const { columns, queryArgs, queryId, specialColumns, summaryColNames } = getXXGridParams()
    return (
        <Box className={classes.content}>
            <XXGrid
                columns={columns}
                sqlQueryId={queryId}
                sqlQueryArgs={queryArgs}
                specialColumns={specialColumns}
                summaryColNames={summaryColNames}
                title=''
                viewLimit='100'
            />
        </Box>
    )
}

export { SaleView }