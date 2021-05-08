import { useEffect, useRef, useState } from 'react'
import { makeStyles, Theme, createStyles } from '@material-ui/core'
import { useSharedElements } from '../shared-elements-hook'
import { TrackSaleSms } from './track-sale-sms'

function useMainBody() {
    const [, setRefresh] = useState({})
    const {useIbuki } = useSharedElements()
    const meta = useRef({
        isMounted: false,
        selectedComponent: <>Nothing</>,
    })
    const { filterOn } = useIbuki()

    useEffect(() => {
        meta.current.isMounted = true
        const subs1 = filterOn('TOPMENU-MAINBODY-LOAD-COMPONENT').subscribe(
            (d: any) => {
                meta.current.selectedComponent = selectLogic[d.data]
                meta.current.isMounted && setRefresh({})
            }
        )        
        return () => {
            meta.current.isMounted = false
            subs1.unsubscribe()
        }
    }, [])

    const selectLogic: any = {
        trackSaleSms: <TrackSaleSms />,
        trackSaleImport: <>Track sale import</>,
        serviceSaleImport: <>Service sale import</>,
    }

    return { meta, setRefresh }
}

export { useMainBody }

const useStyles: any = makeStyles((theme: Theme) =>
    createStyles({
        content: {
            padding: theme.spacing(1),
            minHeight: theme.spacing(20),
        },
    })
)
export { useStyles }
