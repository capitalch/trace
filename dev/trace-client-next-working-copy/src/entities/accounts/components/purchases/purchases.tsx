import { useState } from '../../../../imports/regular-imports'
import { useSharedElements } from '../common/shared-elements-hook'
import { usePurchases, useStyles } from './purchases-hook'
import { PurchaseView } from './purchase-view'
import { PurchaseItems } from './purchase-items'
import { PurchaseBody } from './purchase-body'

function Purchases({ purchaseType, drillDownEditAttributes }: any) {
    const [] = useState({})

    const { arbitraryData, handleOnTabChange, meta } = usePurchases(drillDownEditAttributes)
    const classes = useStyles({ purchaseType })
    meta.current.purchaseTypeLabel =
        purchaseType === 'pur' ? 'Purchase' : 'Purchase return'
    const { Tab, Tabs } = useSharedElements()

    return (
        <div className={classes.content}>
            <Tabs
                className="tabs"
                indicatorColor="primary"
                onChange={handleOnTabChange}
                value={meta.current.value}>
                <Tab label={meta.current.purchaseTypeLabel} />
                <Tab label="View" />
            </Tabs>
            <div className='purchase-body' hidden={meta.current.value !== 0}>
                <PurchaseBody
                    arbitraryData={arbitraryData.current}
                    purchaseType={purchaseType}
                />
                <PurchaseItems arbitraryData={arbitraryData.current} />
            </div>
            <div hidden={meta.current.value !== 1}>
                <PurchaseView arbitraryData={arbitraryData.current} purchaseType={purchaseType} drillDownEditAttributes={drillDownEditAttributes} />
            </div>
        </div>
    )
}

export { Purchases }
