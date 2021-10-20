import { Tabs, Tab } from '../../../../imports/gui-imports'
import { useSales, useStyles } from './sales-hook'
import { SaleCrown } from './sale-crown'
import { SaleHeader } from './sale-header'
import { SaleItems } from './sale-items'
import { SaleFooter } from './sale-footer'
import { SaleView } from './sale-view'

function Sales({ saleType, drillDownEditAttributes }: any) {
    const classes = useStyles()
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
                    value={meta.current.tabValue}>
                    <Tab label="Header" />
                    <Tab label="Items" />
                    <Tab label="Footer" />
                    <Tab label="View" />
                </Tabs>
                <div hidden={meta.current.tabValue !== 0}>
                    <SaleHeader />
                </div>

                <div hidden={meta.current.tabValue !== 1}>
                    <SaleItems />
                </div>
                <div hidden={meta.current.tabValue !== 2}>
                    <SaleFooter />
                </div>
                <div hidden={meta.current.tabValue !== 3}>
                    <SaleView
                        drillDownEditAttributes={drillDownEditAttributes}
                    />
                </div>
            {/* </SalesProvider> */}
        </div>
    )
}

export { Sales }
