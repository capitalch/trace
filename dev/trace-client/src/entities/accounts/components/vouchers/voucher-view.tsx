// import { menuPortalCSS } from 'react-select/src/components/Menu'
import { useSharedElements } from '../common/shared-elements-hook'
import { useVoucherView, useStyles } from './voucher-view-hook'

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
        Box,
        XXGrid,
    } = useSharedElements()

    return (
        <Box className={classes.content} hidden={hidden}>
            {(!hidden) && <XXGrid
                columns={columns}
                summaryColNames={summaryColNames}
                title={meta.current.title}
                sqlQueryId={sqlQueryId}
                sqlQueryArgs={args}
                specialColumns={specialColumns}
                xGridProps={{ disableSelectionOnClick: true }}
            />}
        </Box>
    )
}

export { VoucherView }
