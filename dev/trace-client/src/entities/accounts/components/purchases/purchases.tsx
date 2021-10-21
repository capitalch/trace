import { Tab, Tabs, Typography } from '../../../../imports/gui-imports'
import { usePurchases, useStyles } from './purchases-hook'
import { PurchaseView } from './purchase-view'
import { PurchaseItems } from './purchase-items'
import { PurchaseBody } from './purchase-body'
// import { PurchasesProvider } from './purchases-provider'

function Purchases({ purchaseType, drillDownEditAttributes }: any) {

    const { multiData, handleOnTabChange, meta } = usePurchases(
        drillDownEditAttributes
    )
    const classes = useStyles({ purchaseType })
    meta.current.purchaseTypeLabel =
        purchaseType === 'pur' ? 'Purchase' : 'Purchase return'
        
    return (
        <div className={classes.content}>
            {/* <PurchasesProvider value={multiData.purchases}> */}
                <Typography color='secondary' variant='subtitle1' component='div'>{(purchaseType==='pur') ? 'Purchase': 'Purchase return'}</Typography>
                <Tabs
                    className="tabs"
                    indicatorColor="primary"
                    onChange={handleOnTabChange}
                    value={meta.current.value}>
                    <Tab label="Main" />
                    <Tab label="View" />
                </Tabs>
                <div className="purchase-body" hidden={meta.current.value !== 0}>
                    <PurchaseBody                        
                        purchaseType={purchaseType}
                    />
                    <PurchaseItems arbitraryData={multiData.purchases} />
                </div>
                <div hidden={meta.current.value !== 1}>
                    <PurchaseView
                        purchaseType={purchaseType}
                        drillDownEditAttributes={drillDownEditAttributes}
                    />
                </div>
            {/* </PurchasesProvider> */}
        </div>
    )
}

export { Purchases }
