import { Tab, Tabs } from '../../../../imports/gui-imports'
import { } from '../../../../imports/icons-import'
import { usePurchases, useStyles } from './purchases-hook'
import { PurchaseView } from './purchase-view'
import { PurchaseItems } from './purchase-items'
import { PurchaseBody } from './purchase-body'
import { PurchasesProvider } from './purchases-provider'

function Purchases({ purchaseType, drillDownEditAttributes }: any) {

    const { arbitraryData, handleOnTabChange, meta } = usePurchases(
        drillDownEditAttributes
    )
    const classes = useStyles({ purchaseType })
    meta.current.purchaseTypeLabel =
        purchaseType === 'pur' ? 'Purchase' : 'Purchase return'
    return (
        <div className={classes.content}>
            <PurchasesProvider value={arbitraryData.current}>
                <Tabs
                    className="tabs"
                    indicatorColor="primary"
                    onChange={handleOnTabChange}
                    value={meta.current.value}>
                    <Tab label={meta.current.purchaseTypeLabel} />
                    <Tab label="View" />
                </Tabs>
                <div className="purchase-body" hidden={meta.current.value !== 0}>
                    <PurchaseBody                        
                        purchaseType={purchaseType}
                    />
                    <PurchaseItems arbitraryData={arbitraryData.current} />
                </div>
                <div hidden={meta.current.value !== 1}>
                    <PurchaseView
                        purchaseType={purchaseType}
                        drillDownEditAttributes={drillDownEditAttributes}
                    />
                </div>
            </PurchasesProvider>
        </div>
    )
}

export { Purchases }
