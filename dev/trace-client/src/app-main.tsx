import { clsx, useEffect, useState } from './imports/regular-imports'
import 'fontsource-roboto'
import { createStyles, makeStyles, Theme } from './imports/gui-imports'
import { Box, AppBar } from './imports/gui-imports'
import {
    TraceLoadingIndicator,
    useIbuki,
    useTraceGlobal,
} from './imports/trace-imports'
import { TraceHeader } from './common/trace-header'
import { TraceLeft } from './common/trace-left'
import { TraceMain } from './common/trace-main'
import { TraceSubHeader } from './common/trace-subheader'
import { MegaContext } from './imports/trace-imports'

function AppMain() {
    const { emit } = useIbuki()
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
        } catch (exception) { }
        return () => { }
    }, [])

    function handleDrawerOpen() {
        setInGlobalBag('isDrawyerOpen', true)
        emit('DRAWER-STATUS-CHANGED', null)
        setOpen(true)
    }

    function handleDrawerClose() {
        setInGlobalBag('isDrawyerOpen', false)
        emit('DRAWER-STATUS-CHANGED', null)
        setOpen(false)
    }

    return (
        <Box className={classes.root}>
            {/* header */}
            <AppBar
                position="fixed"
                className={clsx(classes.appBar, {
                    [classes.appBarShift]: open,
                })}>
                {/* Header */}
                <TraceHeader
                    open={open}
                    handleDrawerOpen={handleDrawerOpen}></TraceHeader>

                {/* Subheader */}
                <TraceSubHeader></TraceSubHeader>
            </AppBar>
            {/* Left */}
            <TraceLeft
                open={open}
                matches={isMediumSizeUp}
                handleDrawerClose={handleDrawerClose}></TraceLeft>
            {/* Main */}
            {/*   */}
                <TraceMain open={open}></TraceMain>
            {/* </MegaContext.Provider> */}
            {/* universal loading indicator */}
            <TraceLoadingIndicator></TraceLoadingIndicator>
        </Box>
    )
}

export { AppMain }

const drawerWidth = 260
const useStyles: any = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'flex',
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
    })
)
