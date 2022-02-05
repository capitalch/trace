import { useSharedElements } from '../common/shared-elements-hook'
import { useContext } from '../../../../imports/regular-imports'
import { usePurchaseView, useStyles } from './purchase-view-hook'
import { MultiDataContext } from '../common/multi-data-bridge'

function PurchaseView({ purchaseType }: any) {
    const classes = useStyles()
    const multiData: any = useContext(MultiDataContext)
    const { getXXGridParams } = usePurchaseView(
        multiData.purchases,
        purchaseType
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
        <div className={classes.content}>
            <XXGrid
                gridActionMessages={gridActionMessages}
                columns={columns}
                sqlQueryId={queryId}
                sqlQueryArgs={queryArgs}
                specialColumns={specialColumns}
                subTitle={getGridReportSubTitle()}
                summaryColNames={summaryColNames}
                title={
                    purchaseType === 'pur'
                        ? 'Purchase view'
                        : 'Purchase return view'
                }
                viewLimit="100"
            />
        </div>
    )
}

export { PurchaseView }
