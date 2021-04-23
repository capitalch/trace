import React, { useState, useEffect } from 'react'
import clsx from 'clsx'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import Snackbar from '@material-ui/core/Snackbar'
import MenuIcon from '@material-ui/icons/Menu'
import ArrowDropDown from '@material-ui/icons/ArrowDropDownSharp'
import {
    Toolbar, Typography
    , Button, IconButton, Chip
    , Dialog
} from '@material-ui/core'
import { useIbuki } from '../common-utils/ibuki'
import { manageEntitiesState } from '../common-utils/esm'
import '../entities/authentication/initialize-react-form'
import { useTraceHeader } from './trace-header-hook'
import { useTraceGlobal } from '../common-utils/trace-global'

function TraceHeader({ open, handleDrawerOpen }: any) {

    const { filterOn, emit } = useIbuki()
    const { getLoginData, setLoginData, getCurrentComponent, setCurrentComponent, resetBag }: any = manageEntitiesState() //login data is independent of any entity
    const [, setRefresh] = useState({})

    const {
        closeDialog
        , meta
        , snackbar
        , Alert
        , handleClose
        , isUserLoggedIn
        , showDialogMenu
        , doLogin
    } = useTraceHeader({ setRefresh })

    //For increasing width of dialog window when medium size i.e 960 px and up is achieved
    const { isMediumSizeUp } = useTraceGlobal()
    if (isMediumSizeUp) {
        meta.current.dialogConfig.loginScreenSize = '360px'
    }
    else {
        meta.current.dialogConfig.loginScreenSize = '290px'
    }

    const classes = useStyles({ loginScreenSize: meta.current.dialogConfig.loginScreenSize }) //{width: '620px'}

    function shortCircuit(){
        setLoginData({
            token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1aWQiOiJkIiwidXNlclR5cGUiOiJhIiwiaWQiOjIsImNsaWVudElkIjoyfQ.rZd0cUhxNqIHrl8Pp2pylYm0DLZA5kPRP6xx61xgkNw',
            userType: 'a',
            uid: 'd',
            id: 2,
            entityNames: ["accounts"]
        })
        handleEntityClicked(meta.current.menuHead.menu[0])
    }

    useEffect(() => {
        meta.current.isMounted = true
        const subs = filterOn('MENU-RECEIVED-FROM-SERVER').subscribe(d => {
            meta.current.menuHead = d.data
            shortCircuit() // This line is for doing autologin in development environment
            meta.current.isMounted && setRefresh({})
        })

        const subs1 = filterOn('LOGIN-SUCCESSFUL').subscribe(d => {
            meta.current.uid = d.data
            meta.current.isMounted && setRefresh({})
        })
        const subs2 = filterOn('SHOW-MESSAGE').subscribe(d => {
            snackbar.current.open = true
            snackbar.current.severity = d.data.severity || 'success'
            snackbar.current.message = d.data.message || 'Operation was successful'
            snackbar.current.duration = (d.data.duration !== undefined) ? d.data.duration : 4000
            meta.current.isMounted && setRefresh({})
        })

        subs.add(subs1).add(subs2)

        return (() => {
            meta.current.isMounted = false
            subs.unsubscribe()
        })
    }, [])

    function handleLoginClick(e: any) {
        const item = { name: 'authentication' }
        emit('LOAD-MAIN-JUST-REFRESH', 'reset')
        emit('LOAD-LEFT-JUST-REFRESH', '')
        emit('TOP-MENU-ITEM-CLICKED', item)
        meta.current.showDialog = true
        if (isUserLoggedIn()) {
            showDialogMenu()
        } else {
            doLogin()
        }
    }

    function handleEntityClicked(item:any){
        resetBag()
        emit('TOP-MENU-ITEM-CLICKED', item)
        emit('LOAD-MAIN-JUST-REFRESH', '')
        // This line was added to remove genericDialog custom component. It is not desirable to show the dialog when button is clicked
        if (getCurrentComponent()?.isCustomComponent) {
            setCurrentComponent({})
        }
    }

    // getLoginData() has entityNames array, which determines which entity is assigned to current logged in user.
    // Labels array has markup for all those entities which are present in entityNames array
    const Labels = (props: any) => {
        const { menuHead }: any = props || {}
        let labels: any = []
        if (menuHead && (menuHead.menu) && (menuHead.menu.length > 0)) {
            const entityNames = getLoginData().entityNames
            entityNames && Array.isArray(entityNames) && (entityNames.length > 0) &&
                (labels = menuHead.menu.map((item: any, index: number) => {
                    let ret: any = undefined
                    if (entityNames.includes(item.name)) {
                        ret =
                            <Button
                                color='inherit'
                                variant='outlined'
                                size='large'
                                className={classes.appBarButton}
                                key={index} 
                                onClick={e => {
                                    handleEntityClicked(item)
                                }}>{item.label}
                            </Button>
                    } else {
                        ret = null
                    }
                    return ret
                }
                ))
            //login button
            labels.push(
                <Button key='1' className={clsx(classes.appBarButton, classes.loginButton)}
                    size='large'
                    component='span'
                    variant="outlined"
                    color='inherit'
                    classes={{ endIcon: classes.loginButtonEndIcon }} //this is over riding. endIcon name is taken from material api documentation of Button
                    endIcon={<ArrowDropDown></ArrowDropDown>}
                    onClick={handleLoginClick}>
                    {meta.current.uid ?
                        <Chip
                            className={classes.loginButtonChip}
                            size='small'
                            color='secondary'
                            clickable={true}
                            label={<Typography variant='body2'>{'Hello '.concat(meta.current.uid.substring(0, 2))}</Typography>}
                        ></Chip>
                        : 'Login'}
                </Button>
            )
        }
        return labels
    }

    return (
        <Toolbar>
            <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={handleDrawerOpen}
                edge="start"
                className={clsx(classes.menuButton, open && classes.hide)}>
                <MenuIcon />
            </IconButton>
            <Labels menuHead={meta.current.menuHead}></Labels>

            <Dialog
                classes={{
                    // for adjustment of dialog size as per viewport
                    paper: classes.dialogPaper
                }}
                open={meta.current.showDialog}
                onClose={() => {
                    closeDialog()
                }}>
                {meta.current.dialogConfig.dialogTitle}
                {meta.current.dialogConfig.dialogContent}
                {meta.current.dialogConfig.dialogActions}
            </Dialog>

            <Snackbar
                style={{ bottom: '0.6rem', right: '0.5rem' }}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                open={snackbar.current.open}
                autoHideDuration={snackbar.current.duration}
                onClose={handleClose}>
                <Alert onClose={handleClose} severity={snackbar.current.severity}>
                    {snackbar.current.message}
                </Alert>
            </Snackbar>
        </Toolbar>
    )
}
export { TraceHeader }

const useStyles: any = makeStyles((theme: Theme) =>
    createStyles({
        menuButton: {
            marginRight: theme.spacing(2),
        },
        hide: {
            display: 'none',
        },
        appBarButton: {
            border: '2px solid transparent'
            , "&:hover": { border: `2px solid ${theme.palette.background.default}` }
            , paddingLeft:theme.spacing(1.5)
            , paddingRight:theme.spacing(1.5)
            // , textTransform: 'capitalize' // First letter to be capital. By default material makes all button text as uppercase
        },
        loginButtonEndIcon: {
            // to bring the down icon closer
            marginLeft: '0px'
        },
        loginButtonChip: {
            textTransform: 'capitalize' // to undo default Full capitalization and capitalize only first letter
        },
        loginButton: { // to place loginButton to right side
            marginLeft: 'auto'
        },
        //As per documentation of material the "rule" paper can be overridden. This is actual the dialog box. The container of dialog box is backdrop
        dialogPaper: {
            width: ({ loginScreenSize }: any) => loginScreenSize
        }
    })
)

/*

*/