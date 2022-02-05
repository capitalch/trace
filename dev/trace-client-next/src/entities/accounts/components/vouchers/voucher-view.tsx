import { useSharedElements } from '../common/shared-elements-hook'
import { useVoucherView, useStyles } from './voucher-view-hook'
import { Box } from '../../../../imports/gui-imports'
function VoucherView({ hidden, tranTypeId }: any) {
    const classes = useStyles()
    const {
        args,
        columns,
        gridActionMessages,
        meta,
        specialColumns,
        sqlQueryId,
        summaryColNames,
    } = useVoucherView(hidden, tranTypeId)

    const {getGridReportSubTitle, XXGrid } = useSharedElements()
    return (
        <Box className={classes.content} hidden={hidden}>
            {
                <XXGrid
                    gridActionMessages={gridActionMessages}
                    columns={columns}
                    subTitle={getGridReportSubTitle()}
                    summaryColNames={summaryColNames}
                    title={meta.current.title}
                    sqlQueryId={sqlQueryId}
                    sqlQueryArgs={args}
                    specialColumns={specialColumns}
                    viewLimit="100"
                />
            }
        </Box>
    )
}

export { VoucherView }
