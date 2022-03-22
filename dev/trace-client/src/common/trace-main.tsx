import { clsx, useContext, useState, useEffect, useRef } from '../imports/regular-imports'
import {
    Container,
    makeStyles,
    createStyles,
} from '../imports/gui-imports'
import { manageEntitiesState, MegaContext, useIbuki, useTraceGlobal } from '../imports/trace-imports'
import { LaunchPad as LaunchPadAccounts } from '../entities/accounts/launch-pad'
import { LaunchPad as LaunchPadAuthentication } from '../entities/authentication/launch-pad'

function TraceMain({ open }: any) {
    const {
        setCurrentComponent,
        getCurrentEntity,
    } = manageEntitiesState()
    const { filterOn } = useIbuki()
    const [, setRefresh] = useState({})

    const meta: any = useRef({
        isMounted: false,
        marginTop: 0,
        launchPad: null,
        mega: { accounts: {} }
    })
    const { getCurrentMediaSize } = useTraceGlobal()

    // xs is 600px. If viewport is less than xs then material-ui automatically reduces the header (AppBar) height to 48 pix or theme.spacing(6) otherwise it is 64 pix or theme.spacing(8).
    // submenu bar has a fixed height of 48 pix or theme.spacing(6). theme.spacing(1) = 8px.
    // So header and subheader together changes height between 112 px and 96 px which is theme.spacing(14) and theme.spacing(12)
    // accordingly marginTop is to be adjusted. Little approximation is done below
    if (getCurrentMediaSize() === 'xs') {
        meta.current.marginTop = 12.5
    } else {
        meta.current.marginTop = 14.5
    }

    const classes = useStyles({ meta: meta })
    // const mega:any = useContext(MegaContext)
    useEffect(() => {
        const curr = meta.current
        curr.isMounted = true
        const launchMap: any = {
            accounts: <LaunchPadAccounts />,
            authentication: <LaunchPadAuthentication />,
        }
        const subs = filterOn('TRACE-MAIN:JUST-REFRESH').subscribe((d) => {
            const currentEntity = getCurrentEntity()
            if (d.data === 'reset') {
                setCurrentComponent({})
            }
            curr.launchPad = currentEntity
                ? launchMap[currentEntity]
                : null
            curr.isMounted && setRefresh({})
        })

        return () => {
            subs.unsubscribe()
            curr.isMounted = false
        }
    }, [])

    // For every entity there is separate launch-pad file. Its exported object is mapped in launchMap
    function LaunchPad() {
        return meta.current.launchPad
    }

    return (
        <Container
            className={clsx(classes.content, {
                [classes.contentShift]: open,
            })}>
            {/* initialize accounts entity for all global data  */}
            <MegaContext.Provider value={meta.current.mega}>
                <LaunchPad></LaunchPad>
                {/* <meta.current.launchPad /> */}
            </MegaContext.Provider>
        </Container>
    )
}

export { TraceMain }

const drawerWidth = 260
const useStyles: any = makeStyles((theme: any) =>
    createStyles({
        content: {
            transition: theme.transitions.create('margin', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
            }),
            marginLeft: -drawerWidth,
            marginTop: ({ meta }: any) => theme.spacing(meta.current.marginTop),
            maxWidth: '100%',
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
