import { useSharedElements } from '../shared/shared-elements-hook'
import { useSales, useStyles } from './sales-hook'
import { SaleCrown } from './sale-crown'
import { SaleHeader } from './sale-header'
import { SaleItems } from './sale-items'
import { SaleFooter } from './sale-footer'
import { SaleView } from './sale-view'


function Sales({ saleType, drillDownEditAttributes }: any) {
    const classes = useStyles()
    const { arbitraryData, handleChange, meta } = useSales(saleType, drillDownEditAttributes)

    const {
        Tabs,
        Tab,
    } = useSharedElements()

    return (
        <div className={classes.content}>
            <SaleCrown arbitraryData={arbitraryData.current} saleType={saleType} drillDownEditAttributes={drillDownEditAttributes} />
            <Tabs
                className="tabs"
                indicatorColor="primary"
                onChange={handleChange}
                value={meta.current.tabValue}>
                <Tab label="Header" />
                <Tab label="Items" />
                <Tab label="Footer" />
                <Tab label="View" />
            </Tabs>
            <div hidden={meta.current.tabValue !== 0}>
                <SaleHeader arbitraryData={arbitraryData.current} />
            </div>

            <div hidden={meta.current.tabValue !== 1}>
                <SaleItems arbitraryData={arbitraryData.current} />
            </div>
            <div hidden={meta.current.tabValue !== 2}>
                <SaleFooter arbitraryData={arbitraryData.current} />
            </div>
            <div hidden={meta.current.tabValue !== 3}>
                <SaleView arbitraryData={arbitraryData.current} drillDownEditAttributes={drillDownEditAttributes} />
            </div>
        </div>
    )
}

export { Sales }
