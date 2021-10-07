import { useState} from 'react'
import { useSharedElements } from '../common/shared-elements-hook'
import { usePurchaseItems, useStyles } from './purchase-items-hook'

function PurchaseItems({ arbitraryData }: any) {
    const [, setRefresh] = useState({})

    const {
        getColumns,
        meta,
    } = usePurchaseItems(arbitraryData)
    const classes = useStyles(meta)
    const {
        Badge,
        DataTable,
        TraceDialog,
        ZoomInIcon,
        ZoomOutIcon,
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
