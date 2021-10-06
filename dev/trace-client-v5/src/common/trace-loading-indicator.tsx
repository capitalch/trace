import { useEffect, useState, useRef } from 'react'
import { makeStyles, Theme, createStyles } from '@mui/material/styles';
import {
    Backdrop
} from '@mui/material'
import CircularProgress from '@mui/material/CircularProgress'
import { usingIbuki } from '../common-utils/ibuki'

function TraceLoadingIndicator() {
    const meta = useRef({
        isMounted: false,
        isLoading: false,
    })
    const { filterOn } = usingIbuki()
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

const useStyles: any = makeStyles((theme: Theme) =>
    createStyles({
        backdrop: {
            zIndex: 9999, // less than this does not work
            color: theme.palette.primary.dark,
        },
    }),
)

