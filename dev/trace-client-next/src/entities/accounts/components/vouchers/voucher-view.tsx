import { useSharedElements } from '../shared/shared-elements-hook'
import { useVoucherView, useStyles } from './voucher-view-hook'
import {Box,} from '../../../../imports/gui-imports'
function VoucherView({ hidden, tranTypeId }: any) {
    const classes = useStyles()
    const {
        args,
        columns,
        meta,
        specialColumns,
        sqlQueryId,
        summaryColNames,
    } = useVoucherView(hidden, tranTypeId)

    const {
        XXGrid,
    } = useSharedElements()
    // (!hidden) &&
    return (
        <Box className={classes.content} hidden={hidden} >
            { <XXGrid
                columns={columns}
                summaryColNames={summaryColNames}
                title={meta.current.title}
                sqlQueryId={sqlQueryId}
                sqlQueryArgs={args}
                specialColumns={specialColumns}
                xGridProps={{ disableSelectionOnClick: true }}
                viewLimit={100}
            />}
        </Box>
    )
}

export { VoucherView }
