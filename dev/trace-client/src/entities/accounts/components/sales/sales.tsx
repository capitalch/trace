import {Button, Tabs, Tab } from '../../../../imports/gui-imports'
import { useSales, useStyles } from './sales-hook'
import {useSharedElements} from '../common/shared-elements-hook'
import { SaleCrown } from './sale-crown'
import { SaleHeader } from './sale-header'
import { SaleItems } from './sale-items'
import { SaleFooter } from './sale-footer'
import { SaleView } from './sale-view'

function Sales({ saleType, drillDownEditAttributes }: any) {
    const classes = useStyles()
    const {emit} = useSharedElements()
    const { multiData, handleChangeTab, meta } = useSales(
        saleType,
        drillDownEditAttributes
    )

    return (
        <div className={classes.content}>
                <SaleCrown                    
                    saleType={saleType}
                    drillDownEditAttributes={drillDownEditAttributes}
                />
                <Tabs
                    className="tabs"
                    indicatorColor="primary"
                    onChange={handleChangeTab}
                    value={multiData.sales.tabValue}>
                    <Tab label="Header" />
                    <Tab label="Items" />
                    <Tab label="Footer" />
                    <Tab label="View" />
                    <Button className='reset' variant='contained' onClick={()=>emit('LAUNCH-PAD:LOAD-COMPONENT',null)}>Reset</Button>
                </Tabs>
                <div hidden={multiData.sales.tabValue !== 0}>
                    <SaleHeader />
                </div>

                <div hidden={multiData.sales.tabValue !== 1}>
                    <SaleItems />
                </div>
                <div hidden={multiData.sales.tabValue !== 2}>
                    <SaleFooter />
                </div>
                <div hidden={multiData.sales.tabValue !== 3}>
                    <SaleView
                        drillDownEditAttributes={drillDownEditAttributes}
                    />
                </div>
            {/* </SalesProvider> */}
        </div>
    )
}

export { Sales }
