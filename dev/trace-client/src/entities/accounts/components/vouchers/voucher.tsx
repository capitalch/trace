import { useSharedElements } from '../common/shared-elements-hook'
import { useVoucher, useStyles } from './voucher-hook'
import { Journal } from './voucher-type/journal'
import { Payment } from './voucher-type/payment'
import { VoucherView } from './voucher-view'

function Voucher({ loadComponent }: any) {
    const classes = useStyles()
    const { handleOnTabChange, meta } = useVoucher(loadComponent)
    // console.log('loadComponent:', loadComponent)
    const {
        Tab,
        Tabs,
        Typography,
    } = useSharedElements()

    function SelectedVoucherType({ hidden }: any) {
        const logic: any = {
            journal: <Journal hidden={hidden} />,
            payment: <Payment hidden={hidden} />
        }
        return (logic[loadComponent])
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
            <SelectedVoucherType
                hidden={meta.current.tabValue !== 0}
            />
            <VoucherView hidden={meta.current.tabValue !== 1} />
        </div>
    )
}

export { Voucher }
