import { clsx, useEffect } from '../imports/regular-imports'
import {
    Alert,
    makeStyles,
    createStyles,
    Snackbar,
    Toolbar,
    Typography,
    Avatar,
    Button,
    IconButton,
    Chip,
    Dialog,
    Theme,
} from '../imports/gui-imports'

import { ArrowDropDownSharp, Menu } from '../imports/icons-import'
import { manageEntitiesState, useIbuki, useTraceGlobal } from '../imports/trace-imports'
import menu from '../data/data-menu.json'
import '../entities/authentication/initialize-react-form'
import { useTraceHeader } from './trace-header-hook'
import { MaterialDialogASignals } from '../entities/accounts/components/common/material-dialogA-signals'

function TraceHeader({ open, handleDrawerOpen }: any) {
    const { filterOn, emit } = useIbuki()
    const { getLoginData, setCurrentEntity, resetBag }: any =
        manageEntitiesState() //login data is independent of any entity
    const { isMediumSizeUp } = useTraceGlobal()

    const {
        closeDialog,
        doLogin,
        handleClose,
        handleEntityClicked,
        isUserLoggedIn,
        meta,
        setRefresh,
        shortCircuit,
        showDialogMenu,
        snackbar,
        // submitButtonRef,
        submitDialog,
    } = useTraceHeader()

    const classes = useStyles({
        loginScreenSize: meta.current.dialogConfig.loginScreenSize,
    })
    //Inactivity timeout auto log out
    // const generalSettings = getFromBag('generalSettings')
    // const autoLogoutTime = generalSettings?.['autoLogoutTimeInMins']

    // useIdleTimer({
    //     timeout: 1000 * 60 * autoLogoutTime || 1000 * 50 * 20,
    //     onIdle: () => {
    //         autoLogoutTime && (autoLogoutTime > 0) && logout()
    //     },
    //     debounce: 500
    // })
    //For increasing width of dialog window when medium size i.e 960 px and up is achieved


    if (isMediumSizeUp) {
        meta.current.dialogConfig.loginScreenSize = '360px'
    } else {
        meta.current.dialogConfig.loginScreenSize = '290px'
    }

    useEffect(() => {
        const curr = meta.current
        curr.isMounted = true
        curr.menuHead = menu
        const subs: any = filterOn('TRACE-HEADER-LOAD-MENU').subscribe(() => {
            curr.menuHead = menu
            shortCircuit() // This line is for doing autologin for demo mode
            curr.isMounted && setRefresh({})
        })

        const subs1: any = filterOn('LOGIN-SUCCESSFUL').subscribe((d: any) => {
            curr.uid = d.data
            curr.isMounted && setRefresh({})
        })
        const subs2: any = filterOn('SHOW-MESSAGE').subscribe((d: any) => {
            snackbar.current.open = true
            snackbar.current.severity = d.data.severity || 'success'
            snackbar.current.message =
                d.data.message || 'Operation was successful'
            snackbar.current.duration =
                d.data.duration !== undefined ? d.data.duration : 4000
            curr.isMounted && setRefresh({})
        })

        const subs3: any = filterOn('DATACACHE-SUCCESSFULLY-LOADED').subscribe(
            () => {
                // Only doing refresh, because by now the datacache is already loaded. This code is for autoLogout execution. The autoLogoutTimeInMins is tal=ken from generalSettings of global bag which is populated in initcode datacache
                curr.isMounted && setRefresh({})
            }
        )

        return () => {
            curr.isMounted = false
            subs.unsubscribe()
            subs1.unsubscribe()
            subs2.unsubscribe()
            subs3.unsubscribe()
        }
    }, [])

    function handleLoginClick(e: any) {
        const item = { name: 'authentication' }
        setCurrentEntity('authentication')
        resetBag()

        emit('TRACE-MAIN:JUST-REFRESH', 'reset')
        emit('LOAD-LEFT-JUST-REFRESH', '')
        emit('TOP-MENU-ITEM-CLICKED', item)
        meta.current.showDialog = true
        if (isUserLoggedIn()) {
            showDialogMenu()
        } else {
            doLogin()
        }
    }

    // getLoginData() has entityNames array, which determines which entity is assigned to current logged in user.
    // Labels array has markup for all those entities which are present in entityNames array
    const Labels = (props: any) => {
        const { menuHead }: any = props || {}
        let labels: any = []
        if (menuHead && menuHead.menu && menuHead.menu.length > 0) {
            const entityNames = getLoginData().entityNames
            entityNames &&
                Array.isArray(entityNames) &&
                entityNames.length > 0 &&
                (labels = menuHead.menu.map((item: any, index: number) => {
                    let ret: any = undefined
                    if (entityNames.includes(item.name)) {
                        ret = (
                            // Accounts button 
                            <Button
                                color="inherit"
                                variant="outlined"
                                size="large"
                                className={classes.appBarButton}
                                key={index}
                                onClick={(e: any) => {
                                    handleEntityClicked(item)
                                }}>
                                {item.label}
                            </Button>
                        )
                    } else {
                        ret = null
                    }
                    return ret
                }))
            //login button
            labels.push(
                <Button
                    key="1"
                    className={clsx(classes.appBarButton, classes.loginButton)}
                    size="large"
                    component="span"
                    variant="outlined"
                    color="inherit"
                    classes={{ endIcon: classes.loginButtonEndIcon }} //this is over riding. endIcon name is taken from material api documentation of Button
                    endIcon={<ArrowDropDownSharp></ArrowDropDownSharp>}
                    onClick={handleLoginClick}>
                    {
                        meta.current.uid ?
                            (
                                <Chip
                                    className={classes.loginButtonChip}
                                    size="small"
                                    color="secondary"
                                    clickable={true}
                                    label={
                                        <Typography variant="body2">
                                            {'Hello '}
                                        </Typography>
                                    }
                                    avatar={
                                        <Avatar>
                                            {meta.current.uid.substring(0, 2)}
                                        </Avatar>
                                    }></Chip>
                            ) : (
                                'Login'
                            )
                    }
                </Button>
            )
        }
        return labels
    }
    
    const DialogTitle = () => meta.current.dialogConfig.dialogTitle
    const DialogContent = () => meta.current.dialogConfig.dialogContent
    const DialogActions = () => meta.current.dialogConfig.dialogActions
    return (
        <Toolbar>
            <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={handleDrawerOpen}
                edge="start"
                className={clsx(classes.menuButton, open && classes.hide)}>
                <Menu />
            </IconButton>
            <Labels menuHead={meta.current.menuHead}></Labels>
            <Dialog
                classes={{
                    // for adjustment of dialog size as per viewport
                    paper: classes.dialogPaper,
                }}
                onKeyDown={(e: any) => {
                    if (e.key === 'Escape') {
                        closeDialog()
                    } else if (e.key === 'Enter') {
                        submitDialog() // Its not working, giving error                      
                    }
                }}
                open={meta.current.showDialog}
                onClose={(event, reason) => {
                    if (reason !== 'backdropClick') {
                        closeDialog()
                    }
                }}>
                <DialogTitle />
                <DialogContent />
                <DialogActions />
                {/* {meta.current.dialogConfig.dialogTitle} */}
                {/* {meta.current.dialogConfig.dialogContent} */}
                {/* {meta.current.dialogConfig.dialogActions} */}
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
                <Alert variant='filled'
                    onClose={handleClose}
                    severity={snackbar.current.severity}>
                    {snackbar.current.message}
                </Alert>
            </Snackbar>
            <MaterialDialogASignals />
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
            border: '2px solid transparent',
            '&:hover': {
                border: `2px solid ${theme.palette.background.default}`,
            },
            paddingLeft: theme.spacing(1.5),
            paddingRight: theme.spacing(1.5),
        },
        loginButtonEndIcon: {
            // to bring the down icon closer
            marginLeft: '0px',
        },
        loginButtonChip: {
            textTransform: 'capitalize', // to undo default Full capitalization and capitalize only first letter
        },
        loginButton: {
            // to place loginButton to right side
            marginLeft: 'auto',
        },
        //As per documentation of material the "rule" paper can be overridden. This is actually the dialog box.
        dialogPaper: {
            width: ({ loginScreenSize }: any) => loginScreenSize,
        },
    })
)

