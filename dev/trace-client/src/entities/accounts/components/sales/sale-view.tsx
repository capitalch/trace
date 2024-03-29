import { useSharedElements } from '../common/shared-elements-hook'
import { useContext } from '../../../../imports/regular-imports'
import { useSaleView, useStyles } from './sale-view-hook'
import { Box } from '../../../../imports/gui-imports'
import { MultiDataContext } from '../common/multi-data-bridge'

function SaleView({ drillDownEditAttributes }: any) {
    const classes = useStyles()
    const multiData: any = useContext(MultiDataContext)
    const arbitraryData: any = multiData.sales
    const { getXXGridParams } = useSaleView(
        arbitraryData,
        drillDownEditAttributes
    )

    const { getGridReportSubTitle, XXGrid } = useSharedElements()
    const {
        columns,
        gridActionMessages,
        queryArgs,
        queryId,
        specialColumns,
        summaryColNames,
    } = getXXGridParams()
    return (
        <Box className={classes.content}>
            <XXGrid
                gridActionMessages={gridActionMessages}
                columns={columns}
                sqlQueryId={queryId}
                sqlQueryArgs={queryArgs}
                specialColumns={specialColumns}
                subTitle={getGridReportSubTitle()}
                summaryColNames={summaryColNames}
                title={
                    arbitraryData.saleType === 'sal'
                        ? 'Sales view'
                        : 'Sales return view'
                }
                viewLimit="100"
            />
        </Box>
    )
}

export { SaleView }
