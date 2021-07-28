import { useState, useEffect, useRef } from 'react'
import clsx from 'clsx'
import {
// makeStyles,
Theme
} from '@material-ui/core/styles';
import createStyles from '@material-ui/styles/createStyles';
import { makeStyles } from '@material-ui/styles'
import {
    Container,
} from '@material-ui/core'
import { usingIbuki } from '../common-utils/ibuki'
import { manageEntitiesState } from '../common-utils/esm'
import { LaunchPad as LaunchPadAccounts } from '../entities/accounts/launch-pad'
import { LaunchPad as LaunchPadAuthentication } from '../entities/authentication/launch-pad'
import { useTraceGlobal } from '../common-utils/trace-global'

function TraceMain({ open }: any) {
    const {
        setCurrentComponent,
        getCurrentEntity,
    } = manageEntitiesState()
    const { filterOn} = usingIbuki()
    const [, setRefresh] = useState({})
    const meta = useRef({
        isMounted: false,
        marginTop: 0,
        launchPad: null,
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

    useEffect(() => {
        meta.current.isMounted = true
        const launchMap: any = {
            accounts: <LaunchPadAccounts></LaunchPadAccounts>,
            authentication: <LaunchPadAuthentication></LaunchPadAuthentication>,
        }
        const subs = filterOn('LOAD-MAIN-JUST-REFRESH').subscribe((d) => {
            const currentEntity = getCurrentEntity()
            if (d.data === 'reset') {
                setCurrentComponent({})
            }
            meta.current.launchPad = currentEntity
                ? launchMap[currentEntity]
                : null
            meta.current.isMounted && setRefresh({})
        })
        return () => {
            subs.unsubscribe()
            meta.current.isMounted = false
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
            <LaunchPad></LaunchPad>
        </Container>
    )
}

export { TraceMain }

const drawerWidth = 260
const useStyles: any = makeStyles((theme: Theme) =>
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

/*

*/
