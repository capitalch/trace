import React, { useEffect, useState } from 'react'
import clsx from 'clsx';
import 'fontsource-roboto'
import { makeStyles, useTheme, Theme, createStyles } from '@material-ui/core/styles';
import {
    useMediaQuery, Drawer, Box, CssBaseline, AppBar, Toolbar, List, Typography
    , Divider, IconButton, Button, Grid, Paper, TextField, FormControl, Chip, Avatar, Container
} from '@material-ui/core'
// import { Menu, ChevronLeft, ChevronRight, AddBoxSharp } from '@material-ui/icons';
import MenuIcon from '@material-ui/icons/Menu'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'
import AddBoxSharpIcon from '@material-ui/icons/AddBoxSharp'

import _ from 'lodash'
import { useTraceGlobal } from './common-utils/trace-global'
import menu from './data/data-menu.json'
// import { StyledContainer } from './common/trace-styled-components'
import { TraceHeader } from './common/trace-header'
import { TraceLeft } from './common/trace-left'
import { TraceMain } from './common/trace-main'
import { TraceSubHeader } from './common/trace-subheader'
import { TraceFooter } from './common/trace-footer'
import { useIbuki } from './common-utils/ibuki'
import messages from './messages.json'
// import { TraceLeftMenu } from './common/trace-left-menu'

function AppMain() {
    const { emit } = useIbuki()
    const classes = useStyles()
    const theme = useTheme()
    const [open, setOpen] = useState(false)
    const {isMediumSizeUp} = useTraceGlobal()

    // const matches = useMediaQuery(theme.breakpoints.up('md'), { noSsr: true })

    useEffect(() => {
        init()
    }, [isMediumSizeUp])

    useEffect(() => {
        try {
            init()
            emit('MENU-RECEIVED-FROM-SERVER', menu)
            emit('DATABASE-SERVER-CONNECTION-RESULT', {
                status: "success",
                message: messages.dbServerConnected
            })
        } catch (exception) {
            emit('DATABASE-SERVER-CONNECTION-RESULT', {
                status: "failure",
                message: messages.dbServerConnectionError
            })
        }
        return (() => { })
    }, [])

    function handleDrawerOpen() {
        setOpen(true)
    }

    function handleDrawerClose() {
        setOpen(false)
    }

    function init() {
        if (isMediumSizeUp) {
            setOpen(true)
        } else {
            setOpen(false)
        }
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

            {/* Footer */}
            {/* <AppBar position='fixed'
                className={clsx(classes.appbarFooter, {
                    [classes.appBarShift]: open,
                })}>
                <Toolbar className={classes.toolbarFooter}>
                    <Button style={{ padding: 0, minHeight: 'inherit', color: 'inherit' }}>Test</Button>
                </Toolbar>
            </AppBar> */}
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
        
        // appbarButton: {
        //     border: 'none'
        //     , minHeight: 'inherit'
        //     // , height: '10rem'
        // },

        // toolbarIcon: {
        //     // backgroundColor: theme.palette.info.light
        //     // , 
        //     color: theme.palette.success.light
        // },
        // toolbarSubHeader: {
        //     backgroundColor: theme.palette.secondary.light
        //     , minHeight: '35px'
        //     , flexWrap: 'wrap'
        // },

        // menuButton: {
        //     marginRight: theme.spacing(2),
        // },
        // hide: {
        //     display: 'none',
        // },
        // drawer: {
        //     width: drawerWidth,
        //     flexShrink: 0,
        // },
        // drawerPaper: {
        //     width: drawerWidth,
        // },
        // drawerHeader: {
        //     display: 'flex',
        //     color: theme.palette.grey[100],
        //     backgroundColor: theme.palette.grey[700],
        //     alignItems: 'center',
        //     padding: theme.spacing(0, 1),
        //     minHeight: '28px',
        //     // necessary for content to be below app bar
        //     ...theme.mixins.toolbar,
        //     justifyContent: 'space-between',
        // },
        // content: {
        //     // flexGrow: 1,
        //     // padding: theme.spacing(3),
        //     transition: theme.transitions.create('margin', {
        //         easing: theme.transitions.easing.sharp,
        //         duration: theme.transitions.duration.leavingScreen,
        //     }),
        //     marginLeft: -drawerWidth,
        //     marginTop: '91px'
        // },
        // appbarFooter: {
        //     marginTop: 'calc(100vh - 64px + 42px)'
        //     // marginTop: '400px'
        // },
        // toolbarFooter: {
        //     backgroundColor: theme.palette.neutral.light
        //     // , minHeight: '18px'
        //     , minHeight: '14px'
        //     , color: 'white'
        // },

        // contentShift: {
        //     transition: theme.transitions.create('margin', {
        //         easing: theme.transitions.easing.easeOut,
        //         duration: theme.transitions.duration.enteringScreen,
        //     }),
        //     marginLeft: 0,
        // },
    }),
)



/*
<Toolbar className={classes.toolbarSubHeader}>
                    <Chip avatar={<Avatar>BU</Avatar>} label='Bu: Demo' size='small' clickable={true}></Chip>
                    <Chip label='Bu: Demo' size='small' clickable={true}></Chip>
                    <Box component="span">
                        <IconButton aria-label="delete" className={classes.margin} size="small">
                            <AddBoxSharpIcon fontSize="large" className={classes.toolbarIcon} />
                        </IconButton>
                        <Chip avatar={<Avatar>BU</Avatar>} label='Bu: Demo' size='small' clickable={true}></Chip>
                    </Box>
                </Toolbar>
<StyledContainer>
    <TraceHeader ></TraceHeader>
    <TraceLeft></TraceLeft>
    <TraceMain></TraceMain>
    <TraceSubHeader></TraceSubHeader>
    <TraceFooter></TraceFooter>
</StyledContainer>
<BreakpointShow large up>
</BreakpointShow>
const screenResized = useRef(0) // used for forceful execution of useEffect. otherwise it is not executed when screen is resized
const handleWindowResize = _.debounce(() => {
    setWindowWidth(window.innerWidth)
    screenResized.current = screenResized.current + 1
    console.log(screenResized.current)
    setRefresh({})
    }, 3000)
window.addEventListener("resize", handleWindowResize)
window.removeEventListener("resize", handleWindowResize)
*/
