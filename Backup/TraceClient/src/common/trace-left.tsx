import { StyledLeft } from './trace-styled-components'
import React, { useState, useEffect, useRef } from 'react'
import {
    useMediaQuery, Drawer, Box, CssBaseline, AppBar, Toolbar, List, Typography
    , Divider, IconButton, Button, Grid, Paper, TextField, FormControl, Chip, Avatar, Container
} from '@material-ui/core'
import { makeStyles, useTheme, Theme, createStyles } from '@material-ui/core/styles'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'
import { useIbuki } from '../common-utils/ibuki'
import { manageEntitiesState } from '../common-utils/esm'
// import { graphqlService } from '../common-utils/graphql-service'
import { utilMethods } from '../common-utils/util-methods'
import globalMessages from '../messages.json'
import { TraceLeftMenu } from './trace-left-menu'

function TraceLeft({ open, matches, handleDrawerClose }: any) {
    const meta: any = useRef({
        data: {}
        , data1: {}
    })
    const [, setRefresh] = useState({})
    const { filterOn, emit } = useIbuki()
    // const { queryGraphql } = graphqlService()
    const { setCurrentEntity, resetCurrentEntity } = manageEntitiesState()
    const { getDashedEntityName } = utilMethods()
    const classes = useStyles()

    const theme = useTheme()
    async function loadEntity(entityName: string) {
        try {
            setCurrentEntity(entityName)
            // camel case to dashed case
            const entityNameDashed = getDashedEntityName(entityName) // entityName.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()
            await import(`../entities/${entityNameDashed}/initialize-react-form`) // to enroll the artifacts of this entity and record them in react-form
            emit(entityName.concat('-', 'EXECUTE-INIT-CODE'), '')
        } catch (error) {
            console.log(error)
            emit('SHOW-MESSAGE', { message: globalMessages['initError'], severity: 'error', duration: null })
        }
    }

    useEffect(() => {
        let subs: any = {}
        subs = filterOn('TOP-MENU-ITEM-CLICKED').subscribe((d: any) => {
            let entityName: string = d.data.name
            meta.current.data = {}
            loadEntity(entityName)
            meta.current.data1 = d.data
            if (entityName !== 'accounts') {
                meta.current.data = d.data
            }
            setRefresh({})
        })
        const subs1 = filterOn('LOAD-LEFT-JUST-REFRESH').subscribe(d => {
            resetCurrentEntity()
            setRefresh({})
        })
        const subs2 = filterOn('LOAD-LEFT-MENU').subscribe(d => {
            meta.current.data = meta.current.data1
            setRefresh({})
        })
        subs.add(subs1).add(subs2)
        return (() => {
            subs.unsubscribe()
        })
    }, [])

    return (
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
                {matches ? <span></span> : <IconButton onClick={handleDrawerClose} color='inherit'>
                    {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                </IconButton>}
            </div>
            <Divider />
            <TraceLeftMenu value={meta.current.data} close = {handleDrawerClose} matches = {matches}></TraceLeftMenu>
        </Drawer>
    )
}

export { TraceLeft }

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
        appbarButton: {
            border: 'none'
            , minHeight: 'inherit'
        },

        toolbarIcon: {
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
            backgroundColor: theme.palette.primary.dark
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
            transition: theme.transitions.create('margin', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
            }),
            marginLeft: -drawerWidth,
            marginTop: '91px'
        },

        appbarFooter: {
            marginTop: 'calc(100vh - 64px + 42px)'
        },
        
        toolbarFooter: {
            backgroundColor: theme.palette.neutral.light
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