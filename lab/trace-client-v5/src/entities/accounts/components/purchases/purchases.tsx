import {Button, Tab, Tabs, Typography } from '../../../../imports/gui-imports'
import {useSharedElements} from '../common/shared-elements-hook'
import { usePurchases, useStyles } from './purchases-hook'
import { PurchaseView } from './purchase-view'
import { PurchaseItems } from './purchase-items'
import { PurchaseBody } from './purchase-body'

function Purchases({ purchaseType, drillDownEditAttributes }: any) {

    const { multiData, handleOnTabChange, meta } = usePurchases(
        drillDownEditAttributes
    )
    const classes = useStyles({ purchaseType })
    const {emit} = useSharedElements()
    meta.current.purchaseTypeLabel =
        purchaseType === 'pur' ? 'Purchase' : 'Purchase return'
        
    return (
        <div className={classes.content}>
                <Typography color='secondary' variant='subtitle1' component='div'>{(purchaseType==='pur') ? 'Purchase': 'Purchase return'}</Typography>
                <Tabs
                    className="tabs"
                    indicatorColor="primary"
                    onChange={handleOnTabChange}
                    value={multiData.purchases.tabValue}>
                    <Tab label="Main" />
                    <Tab label="View" />
                    <Button className='reset' variant='contained' onClick={()=>emit('LAUNCH-PAD:LOAD-COMPONENT',null)}>Reset</Button>
                </Tabs>
                <div className="purchase-body" hidden={multiData.purchases.tabValue !== 0}>
                    <PurchaseBody                        
                        purchaseType={purchaseType}
                    />
                    <PurchaseItems arbitraryData={multiData.purchases} />
                </div>
                <div hidden={multiData.purchases.tabValue !== 1}>
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
