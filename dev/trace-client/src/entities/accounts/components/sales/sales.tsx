import { useSharedElements } from '../common/shared-elements-hook'
import { Button } from '@material-ui/core'
import { useSales, useStyles } from './sales-hook'
import { SaleCrown } from './sale-crown'
import { SaleHeader } from './sale-header'
import { SaleItems } from './sale-items'
import { SaleFooter } from './sale-footer'
import { SaleView } from './sale-view'


function Sales({ saleType, drillDownEditAttributes }: any) {
    const classes = useStyles()
    const { multiData, handleChange, meta } = useSales(saleType, drillDownEditAttributes)

    const {
        Tabs,
        Tab,
    } = useSharedElements()

    return (
        <div className={classes.content}>
            <SaleCrown arbitraryData={multiData.sales} saleType={saleType} drillDownEditAttributes={drillDownEditAttributes} />
            <Tabs
                className="tabs"
                indicatorColor="primary"
                onChange={handleChange}
                value={meta.current.tabValue}>
                <Tab label="Header" />
                <Tab label="Items" />
                <Tab label="Footer" />
                <Tab label="View" />
                <Button variant='contained' color='secondary'>Reset</Button>
            </Tabs>
            <div hidden={meta.current.tabValue !== 0}>
                <SaleHeader arbitraryData={multiData.sales} />
            </div>

            <div hidden={meta.current.tabValue !== 1}>
                <SaleItems arbitraryData={multiData.sales} />
            </div>
            <div hidden={meta.current.tabValue !== 2}>
                <SaleFooter arbitraryData={multiData.sales} />
            </div>
            <div hidden={meta.current.tabValue !== 3}>
                <SaleView arbitraryData={multiData.sales} drillDownEditAttributes={drillDownEditAttributes} />
            </div>
        </div>
    )
}

export { Sales }
