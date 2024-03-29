import { DataTable, useState } from '../../../../imports/regular-imports'
import { useSharedElements } from '../common/shared-elements-hook'
import { usePurchaseItems, useStyles } from './purchase-items-hook'
import { Badge, Box, } from '../../../../imports/gui-imports'
import { ZoomIn, ZoomOut, } from '../../../../imports/icons-import'

function PurchaseItems({ arbitraryData }: any) {
    const [, setRefresh] = useState({})
    const {
        getColumns,
        meta,
    } = usePurchaseItems(arbitraryData)
    const classes = useStyles(meta)
    const {
        TraceDialog,
    } = useSharedElements()

    return (
        <Box className={classes.content} sx={{height:'80vh'}}>
            <Badge
                className="badge-extender"
                badgeContent={
                    meta.current.zoomIn ? (
                        <ZoomIn
                            onClick={() => {
                                meta.current.zoomIn = false
                                meta.current.isMounted && setRefresh({})
                            }}
                            cursor="pointer"
                        />
                    ) : (
                        <ZoomOut
                            onClick={() => {
                                meta.current.zoomIn = true
                                meta.current.isMounted && setRefresh({})
                            }}
                            cursor="pointer"
                        />
                    )
                }>
                <DataTable
                rows={10}
                    rowHover={true}
                    scrollable={true}
                    // scrollHeight={meta.current.zoomIn ? '36vh' : '55vh'}
                    // height='80vh'
                    className="items"
                    value={arbitraryData.lineItems}>
                    {getColumns()}
                </DataTable>
            </Badge>
            <TraceDialog meta={meta} />
        </Box>
    )
}

export { PurchaseItems }
