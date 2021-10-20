import { useEffect, useState } from 'react'
import clsx from 'clsx';
import 'fontsource-roboto'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import {
    CssBaseline, AppBar
} from '@material-ui/core'
import { useTraceGlobal } from './common-utils/trace-global'
import { TraceHeader } from './common/trace-header'
import { TraceLeft } from './common/trace-left'
import { TraceMain } from './common/trace-main'
import { TraceSubHeader } from './common/trace-subheader'
import { usingIbuki } from './common-utils/ibuki'
import { TraceLoadingIndicator } from './common/trace-loading-indicator'

function AppMain() {
    const { emit } = usingIbuki()
    const classes = useStyles()
    const [open, setOpen] = useState(false)
    const { setInGlobalBag, isMediumSizeUp } = useTraceGlobal()

    useEffect(() => {
        setInGlobalBag('isDrawyerOpen', isMediumSizeUp)
        setOpen(isMediumSizeUp)
    }, [isMediumSizeUp])

    useEffect(() => {
        try {
            emit('TRACE-HEADER-LOAD-MENU', null)
        } catch (exception) {
        }
        return (() => { })
    }, [])

    function handleDrawerOpen() {
        setInGlobalBag('isDrawyerOpen', true)
        emit('DRAWYER-STATUS-CHANGED', null)
        setOpen(true)
    }

    function handleDrawerClose() {
        setInGlobalBag('isDrawyerOpen', false)
        emit('DRAWYER-STATUS-CHANGED', null)
        setOpen(false)
    }

    return (
        <div className={classes.root}>
            <CssBaseline />
            {/* header */}
            <AppBar
                position="fixed"
                className={clsx(classes.appBar, {
                    [classes.appBarShift]: open,
                })}>

                {/* Header */}
                <TraceHeader open={open} handleDrawerOpen={handleDrawerOpen}></TraceHeader>

                {/* Subheader */}
                <TraceSubHeader></TraceSubHeader>
            </AppBar>
            {/* Left */}
            <TraceLeft open={open} matches={isMediumSizeUp} handleDrawerClose={handleDrawerClose}></TraceLeft>
            {/* Main */}
            <TraceMain open={open}></TraceMain>
            {/* universal loading indicator */}
            <TraceLoadingIndicator></TraceLoadingIndicator>
        </div>
    )
}

export { AppMain }

const drawerWidth = 260
const useStyles: any = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'flex'
        },

        appBar: {
            transition: theme.transitions.create(['margin', 'width'], {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
            }),
        },

        appBarShift: {
            width: `calc(100% - ${drawerWidth}px)`,
            marginLeft: drawerWidth,
            transition: theme.transitions.create(['margin', 'width'], {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen,
            }),
        },
    }),
)