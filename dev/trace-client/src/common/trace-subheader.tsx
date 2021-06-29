import { useEffect, useState, useRef } from 'react'
import { AccountsSubHeader } from '../entities/accounts/components/common/accounts-sub-header'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import { Toolbar } from '@material-ui/core'

import { usingIbuki } from '../common-utils/ibuki'

// Subheader displays controls based on entity. For accounts entity it will be different than payroll entity
function TraceSubHeader() {
    const meta: any = useRef({        
        isMounted: false,
        topMenuItem: {},
    })
    const { filterOn } = usingIbuki()
    const [, setRefresh] = useState({})
    const classes = useStyles()

    useEffect(() => {
        meta.current.isMounted = true
        const subs1 = filterOn('TOP-MENU-ITEM-CLICKED').subscribe((d: any) => {
            meta.current.topMenuItem = d.data
            meta.current.isMounted && setRefresh({})
        })
        const subs2 = filterOn('LOAD-SUBHEADER-JUST-REFRESH').subscribe((d) => {
            meta.current.isMounted && setRefresh({})
        })
        // subs1.add(subs2)
        return () => {
            subs1.unsubscribe()
            subs2.unsubscribe()
            meta.current.isMounted = false
        }
    }, [])

    const displayLogic: any = {
        accounts: () => {
            return <AccountsSubHeader />
        },
    }

    function Comp() {
        let ret = <></>
        const pre = displayLogic[meta.current.topMenuItem.name]
        if (pre) {
            ret = pre()
        }
        return ret
    }

    return (
        <Toolbar className={classes.toolbarSubHeader}>
            <Comp></Comp>
        </Toolbar>
    )
}
export { TraceSubHeader }

const useStyles: any = makeStyles((theme: Theme) =>
    createStyles({
        toolbarSubHeader: {
            backgroundColor: theme.palette.secondary.light,
            minHeight: '35px',
            flexWrap: 'wrap',
        },
    })
)
