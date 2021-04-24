import { useEffect, useRef, useState } from 'react'
import { makeStyles, Theme, createStyles } from '@material-ui/core'
import { useSharedElements } from '../shared-elements-hook'

function useTopMenu() {
    const [, setRefresh] = useState({})
    const meta = useRef({
        isMounted: false
    })

    useEffect(() => {
        meta.current.isMounted = true

        return (() => {
            meta.current.isMounted = false
        })
    }, [])

    return { meta, setRefresh }
}

export { useTopMenu }

const useStyles: any = makeStyles((theme: Theme) =>
    createStyles({

        content: {
            padding: theme.spacing(1),
            display: 'flex',
            columnGap: theme.spacing(1),
        },

        dialog: {

        },

    })
)
export { useStyles }