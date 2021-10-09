import { DataTable, useState } from '../../../../imports/regular-imports'
import { useSharedElements } from '../shared/shared-elements-hook'
import { usePurchaseItems, useStyles } from './purchase-items-hook'
import { Badge, } from '../../../../imports/gui-imports'
import { ZoomInIcon, ZoomOutIcon, } from '../../../../imports/icons-import'

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
        <div className={classes.content}>
            <Badge
                className="badge-extender"
                badgeContent={
                    meta.current.zoomIn ? (
                        <ZoomInIcon
                            onClick={() => {
                                meta.current.zoomIn = false
                                meta.current.isMounted && setRefresh({})
                            }}
                            cursor="pointer"
                        />
                    ) : (
                        <ZoomOutIcon
                            onClick={() => {
                                meta.current.zoomIn = true
                                meta.current.isMounted && setRefresh({})
                            }}
                            cursor="pointer"
                        />
                    )
                }>
                <DataTable
                    rowHover={true}
                    scrollable={true}

                    scrollHeight={meta.current.zoomIn ? '36vh' : '55vh'}
                    className="items"
                    value={arbitraryData.lineItems}>
                    {getColumns()}
                </DataTable>
            </Badge>
            <TraceDialog meta={meta} />
        </div>
    )
}

export { PurchaseItems }
