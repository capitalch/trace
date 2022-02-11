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
        meta.current.isMounted = true
        const subs = filterOn('SHOW-LOADING-INDICATOR').subscribe(d => {
            meta.current.isLoading = d.data
            meta.current.isMounted && setRefresh({})
        })

        return (() => {
            subs.unsubscribe()
            meta.current.isMounted = false
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

