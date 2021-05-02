import React, { useEffect, useState } from 'react'
import clsx from 'clsx';
import { makeStyles, useTheme, Theme, createStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import useMediaQuery from '@material-ui/core/useMediaQuery'
import Box from '@material-ui/core/Box';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import { Button, Grid, Paper, TextField, FormControl } from '@material-ui/core'
import Chip from '@material-ui/core/Chip'
import AddBoxSharp from '@material-ui/icons/AddBoxSharp'
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';
import { useTraceGlobal } from './utils/trace-global'
import AppMenu from './AppMenu'
import { useIbuki } from './utils/ibuki'
import { Avatar, Container, Hidden } from '@material-ui/core';

function PersistentDrawerLeft(props: any) {
    // const { BreakpointHideWithSpan, isMatch, isMediumUp } = useTraceGlobal()
    const classes = useStyles();
    const theme = useTheme();
    const { getCurrentMediaSize } = useTraceGlobal()
    // const [, setRefresh] = useState({})
    // const { filterOn } = useIbuki()
    const [open, setOpen] = React.useState(true)
    const matches = useMediaQuery(theme.breakpoints.up('md'), { noSsr: true })

    const breakpointName = getCurrentMediaSize()
    console.log('BP name:', breakpointName)

    // const xsEquals = useMediaQuery(theme.breakpoints.only('xs'))
    // const smEquals = useMediaQuery(theme.breakpoints.between('xs', 'sm'))
    // const mdEquals = useMediaQuery(theme.breakpoints.between('sm','md'))

    const xsEquals = useMediaQuery(theme.breakpoints.only('xs'))
    const smEquals = useMediaQuery(theme.breakpoints.only('sm'))
    const mdEquals = useMediaQuery(theme.breakpoints.only('md'))

    const handleDrawerOpen = () => {
        setOpen(true);
    }

    const handleDrawerClose = () => {
        setOpen(false);
    };

    function init() {
        if (matches) {
            setOpen(true)
        } else {
            setOpen(false)
        }
    }

    useEffect(() => {
        init()
    }, [matches])

    
    return (
        <div className={classes.root}>
            <CssBaseline />
            <AppBar
                position="fixed"
                className={clsx(classes.appBar, {
                    [classes.appBarShift]: open,
                })}>
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerOpen}
                        edge="start"
                        className={clsx(classes.menuButton, open && classes.hide)}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Button size='large' variant="outlined" color="inherit"
                        className={classes.appbarButton}
                        classes = {{
                            root: classes.myRoot
                            }
                        }                        >
                        
                        Button 1
                    </Button>
                    <Button variant="outlined" color="inherit" className={classes.appbarButton}>
                        Button 2
                    </Button>
                    {matches && <Button variant="outlined" color="inherit" className={classes.appbarButton}>
                        Big device button
                    </Button>}
                    {/* <Typography variant="h6" noWrap>
                        Persistent drawer
                    </Typography> */}
                </Toolbar>
                <Toolbar className={classes.toolbarSubHeader}>
                    <Chip avatar={<Avatar>BU</Avatar>} label='Bu: Demo' size='small' clickable={true}></Chip>
                    <Chip label='Bu: Demo' size='small' clickable={true}></Chip>
                    <Box component="span">
                        <IconButton aria-label="delete" className={classes.margin} size="small">
                            <AddBoxSharp fontSize="large" className={classes.toolbarIcon} />
                        </IconButton>
                        <Chip avatar={<Avatar>BU</Avatar>} label='Bu: Demo' size='small' clickable={true}></Chip>
                    </Box>
                </Toolbar>
            </AppBar>

            <Drawer
                className={classes.drawer}
                variant="persistent"
                anchor="left"
                open={open}
                classes={{
                    paper: classes.drawerPaper,
                }}>
                <div className={classes.drawerHeader} >
                    <span></span>
                    <Typography component='div' color="inherit" align='left' variant='h4'>
                        <Box fontWeight="bold" fontStyle='italic'>TRACE</Box>
                    </Typography>
                    {matches ? <span></span> : <IconButton onClick={handleDrawerClose}>
                        {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                    </IconButton>}
                    {/* <Hidden mdUp>
                        <IconButton onClick={handleDrawerClose}>
                            {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                        </IconButton>
                    </Hidden> */}

                </div>
                <Divider />
                <AppMenu></AppMenu>
            </Drawer>
            <Container
                className={clsx(classes.content, {
                    [classes.contentShift]: open,
                })}>
                <p>Geckos are a group of usually small, usually nocturnal lizards. They are found on every continent except Australia.</p>

                <p>Many species of gecko have adhesive toe pads which enable them to climb walls and even windows.</p>
                <p>Geckos are a group of usually small, usually nocturnal lizards. They are found on every continent except Australia.</p>

                <p>Many species of gecko have adhesive toe pads which enable them to climb walls and even windows.</p>
                <p>Geckos are a group of usually small, usually nocturnal lizards. They are found on every continent except Australia.</p>

                <p>Many species of gecko have adhesive toe pads which enable them to climb walls and even windows.</p>
                <Button>Test</Button>
                <Grid container >
                    <Grid item xs={12} lg={1} sm={4} >
                        {/* <Paper elevation={16}> */}
                        <Box><input type='text'></input></Box>
                        {/* </Paper> */}
                    </Grid>
                </Grid>
                <p>Geckos are a group of usually small, usually nocturnal lizards. They are found on every continent except Australia.</p>

                <p>Many species of gecko have adhesive toe pads which enable them to climb walls and even windows.</p>
                <p>Geckos are a group of usually small, usually nocturnal lizards. They are found on every continent except Australia.</p>

                <p>Many species of gecko have adhesive toe pads which enable them to climb walls and even windows.</p>
                <p>Geckos are a group of usually small, usually nocturnal lizards. They are found on every continent except Australia.</p>

            </Container>

            <AppBar position='fixed'
                className={clsx(classes.appbarFooter, {
                    [classes.appBarShift]: open,
                })}>
                <Toolbar className={classes.toolbarFooter}>
                    <Button style={{ padding: 0, minHeight: 'inherit', color: 'inherit' }}>Test</Button>
                </Toolbar>
            </AppBar>
        </div>
    )
}

export { PersistentDrawerLeft }

const drawerWidth = 260
const useStyles: any = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'flex'
        },

        myRoot: {
            backgroundColor: 'teal'
            , textTransform:'capitalize'
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
        appbarButton: {
            border: 'none'
            , minHeight: 'inherit'
            // , height: '10rem'
        },

        toolbarIcon: {
            // backgroundColor: theme.palette.info.light
            // , 
            color: theme.palette.success.light
        },
        toolbarSubHeader: {
            backgroundColor: theme.palette.secondary.light
            , minHeight: '35px'
            , flexWrap: 'wrap'
        },

        menuButton: {
            marginRight: theme.spacing(2),
        },
        hide: {
            display: 'none',
        },
        drawer: {
            width: drawerWidth,
            flexShrink: 0,
        },
        drawerPaper: {
            width: drawerWidth,
        },
        drawerHeader: {
            display: 'flex',
            color: theme.palette.grey[100],
            backgroundColor: theme.palette.grey[700],
            alignItems: 'center',
            padding: theme.spacing(0, 1),
            minHeight: '28px',
            // necessary for content to be below app bar
            ...theme.mixins.toolbar,
            justifyContent: 'space-between',
        },
        content: {
            // flexGrow: 1,
            // padding: theme.spacing(3),
            transition: theme.transitions.create('margin', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
            }),
            marginLeft: -drawerWidth,
            marginTop: '91px'
        },
        appbarFooter: {
            marginTop: 'calc(100vh - 64px + 42px)'
            // marginTop: '400px'
        },
        toolbarFooter: {
            backgroundColor: theme.palette.neutral.light
            // , minHeight: '18px'
            , minHeight: '14px'
            , color: 'white'
        },

        contentShift: {
            transition: theme.transitions.create('margin', {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen,
            }),
            marginLeft: 0,
        },
    }),
)