import { useState, useEffect, useRef } from '../imports/regular-imports'
import {
    Drawer,
    Box,
    Typography,
    Divider,
    IconButton,
    makeStyles,
    useTheme,
    createStyles,
    Theme,
} from '../imports/gui-imports'
import {globalMessages, useIbuki} from '../imports/trace-imports'
import {ChevronLeft, ChevronRight} from '../imports/icons-import'
import { utilMethods } from '../global-utils/misc-utils'
import { TraceLeftMenu } from './trace-left-menu'

function TraceLeft({ open, matches, handleDrawerClose }: any) {
    const meta: any = useRef({
        data: {},
        data1: {},
    })
    const [, setRefresh] = useState({})
    const { filterOn, emit } = useIbuki()
    const { getDashedEntityName } = utilMethods()
    const classes = useStyles()

    const theme:Theme = useTheme()
    async function loadEntity(entityName: string) {
        try {
            // camel case to dashed case
            const entityNameDashed = getDashedEntityName(entityName)
            await import(
                `../entities/${entityNameDashed}/initialize-react-form`
            ) // to enroll the artifacts of this entity and record them in react-form
            emit(entityName.concat('-', 'EXECUTE-INIT-CODE'), '')
        } catch (error) {
            console.log(error)
            emit('SHOW-MESSAGE', {
                message: globalMessages['initError'],
                severity: 'error',
                duration: null,
            })
        }
    }

    useEffect(() => {
        let subs: any = {}
        subs = filterOn('TOP-MENU-ITEM-CLICKED').subscribe((d: any) => {
            const entityName: string = d.data.name
            meta.current.data = {}
            loadEntity(entityName)
            meta.current.data1 = d.data
            if (entityName !== 'accounts') {
                meta.current.data = d.data
            }
            setRefresh({})
        })
        const subs1: any = filterOn('LOAD-LEFT-JUST-REFRESH').subscribe(
            (d: any) => {
                if (d.data === 'reset') {
                    meta.current.data = {}
                }
                setRefresh({})
            }
        )
        const subs2: any = filterOn('LOAD-LEFT-MENU').subscribe((d: any) => {
            meta.current.data = meta.current.data1
            setRefresh({})
        })
        return () => {
            subs.unsubscribe()
            subs1.unsubscribe()
            subs2.unsubscribe()
        }
    }, [filterOn, loadEntity])

    return (
        <Drawer
            className={classes.drawer}
            variant="persistent"
            anchor="left"
            open={open}
            classes={{
                paper: classes.drawerPaper,
            }}>
            <div className={classes.drawerHeader}>
                <span></span>
                <Typography
                    component="div"
                    color="inherit"
                    align="left"
                    variant="h4">
                    <Box fontWeight="bold" fontStyle="italic">
                        TRACE
                    </Box>
                </Typography>
                <IconButton onClick={handleDrawerClose} color="inherit">
                    {theme.direction === 'ltr' ? (
                        <ChevronLeft />
                    ) : (
                        <ChevronRight />
                    )}
                </IconButton>
            </div>
            <Divider />
            <TraceLeftMenu
                open={open}
                value={meta.current.data}
                close={handleDrawerClose}
                matches={matches}></TraceLeftMenu>
        </Drawer>
    )
}

export { TraceLeft }

const drawerWidth = 260
const useStyles: any = makeStyles((theme: any) =>
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
        appbarButton: {
            border: 'none',
            minHeight: 'inherit',
        },

        toolbarIcon: {
            color: theme.palette.success.light,
        },

        toolbarSubHeader: {
            backgroundColor: theme.palette.secondary.light,
            minHeight: '35px',
            flexWrap: 'wrap',
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
            backgroundColor: theme.palette.primary.dark,
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
            marginTop: '91px',
        },

        appbarFooter: {
            marginTop: 'calc(100vh - 64px + 42px)',
        },

        toolbarFooter: {
            backgroundColor: theme.palette.neutral.light,
            minHeight: '14px',
            color: 'white',
        },

        contentShift: {
            transition: theme.transitions.create('margin', {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen,
            }),
            marginLeft: 0,
        },
    })
)
