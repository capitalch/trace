import { useSharedElements } from '../common/shared-elements-hook'
import { useVoucher, useStyles } from './voucher-hook'
import { Journal } from './voucher-type/journal'
import { Payment } from './voucher-type/payment'
import {Receipt} from './voucher-type/receipt'
import {Contra} from './voucher-type/contra'
import { VoucherView } from './voucher-view'

function Voucher({ loadComponent }: any) {
    const classes = useStyles()
    const {getTranTypeId, handleOnTabChange, meta } = useVoucher(loadComponent)
    const { Tab, Tabs, Typography } = useSharedElements()

    function SelectedVoucherComponent({ hidden, tranTypeId }: any) {
        const logic: any = {
            journal: <Journal hidden={hidden} tranTypeId={tranTypeId} />,
            payment: <Payment hidden={hidden} tranTypeId={tranTypeId} />,
            receipt: <Receipt hidden={hidden} tranTypeId={tranTypeId} />,
            contra: <Contra hidden={hidden} tranTypeId={tranTypeId} />,
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
            <SelectedVoucherComponent hidden={meta.current.tabValue !== 0} tranTypeId = {getTranTypeId()} />
            <VoucherView
                hidden={meta.current.tabValue !== 1}
                tranTypeId={getTranTypeId()}
            />
        </div>
    )
}

export { Voucher }
