import { useSharedElements } from '../common/shared-elements-hook'
import { useContext } from '../../../../imports/regular-imports'
import { usePurchaseView, useStyles } from './purchase-view-hook'
import { MultiDataContext } from '../common/multi-data-bridge'

function PurchaseView({ purchaseType, drillDownEditAttributes }: any) {
    const classes = useStyles()
    const multiData: any = useContext(MultiDataContext)
    const { meta, getXXGridParams } = usePurchaseView(
        multiData.purchases,
        purchaseType,
        // drillDownEditAttributes
    )

    const { XXGrid } = useSharedElements()

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
                summaryColNames={summaryColNames}
                title=""
                viewLimit="100"
            />
        </div>
    )
}

export { PurchaseView }
