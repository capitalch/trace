import { useEffect, useState, useRef } from '../imports/regular-imports'
import {Backdrop,CircularProgress, makeStyles, createStyles } from '../imports/gui-imports'
import {useIbuki} from '../imports/trace-imports'

function TraceLoadingIndicator() {
    const meta = useRef({
        isMounted: false,
        isLoading: false,
    })
    const { filterOn } = useIbuki()
    const [, setRefresh] = useState({})
    const classes = useStyles()

    useEffect(() => {
        const curr = meta.current
        curr.isMounted = true
        const subs = filterOn('SHOW-LOADING-INDICATOR').subscribe(d => {
            curr.isLoading = d.data
            curr.isMounted && setRefresh({})
        })

        return (() => {
            subs.unsubscribe()
            curr.isMounted = false
        })
    }, [])

    return <div>
        <Backdrop
            className={classes.backdrop}
            open={meta.current.isLoading}>
            <CircularProgress color="inherit" />
        </Backdrop>
    </div>
}

export { TraceLoadingIndicator }

const useStyles: any = makeStyles((theme:any) =>
    createStyles({
        backdrop: {
            zIndex: 9999, // less than this does not work
            color: theme.palette.primary.dark,
        },
    }),
)

