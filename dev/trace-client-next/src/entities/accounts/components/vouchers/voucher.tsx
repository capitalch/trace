import { Tab, Tabs, Typography } from '../../../../imports/gui-imports'
import { useVoucher, useStyles } from './voucher-hook'
import { Journal } from './voucher-type/journal'
import { Payment } from './voucher-type/payment'
import { Receipt } from './voucher-type/receipt'
import { Contra } from './voucher-type/contra'
import { VoucherView } from './voucher-view'

function Voucher({ loadComponent, drillDownEditAttributes }: any) {
    const classes = useStyles()
    const { getTranTypeId, handleOnTabChange, meta } = useVoucher(loadComponent, drillDownEditAttributes)

    function SelectedVoucherComponent({ hidden }: any) {
        const logic: any = {
            journal: <Journal hidden={hidden} />,
            payment: <Payment hidden={hidden} />,
            receipt: <Receipt hidden={hidden} />,
            contra: <Contra hidden={hidden} />,
        }
        return logic[loadComponent]
    }

    return (
        <div className={classes.content}>
            <Typography component="div" variant="subtitle1" color="secondary">
                {meta.current.title}
            </Typography>
            <Tabs
                className="tabs"
                indicatorColor="secondary"
                onChange={handleOnTabChange}
                value={meta.current.tabValue}>
                <Tab className="tab" label="New / Edit" />
                <Tab label="View" />
            </Tabs>
            <SelectedVoucherComponent hidden={meta.current.tabValue !== 0} />
            <VoucherView
                hidden={meta.current.tabValue !== 1}
                tranTypeId={getTranTypeId()}
            />
        </div>
    )
}

export { Voucher }