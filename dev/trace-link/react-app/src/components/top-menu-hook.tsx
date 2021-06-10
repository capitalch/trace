import { useEffect, useRef, useState } from 'react'
import { makeStyles, Theme, createStyles } from '@material-ui/core'
import { useSharedElements } from '../shared-elements-hook'
// import { socket } from '../utils/socket'

function useTopMenu() {
    const [, setRefresh] = useState({})
    const { useIbuki } = useSharedElements()
    const { emit } = useIbuki()
    const meta = useRef({
        isMounted: false,
    })

    useEffect(() => {
        meta.current.isMounted = true
        // socket.on('connect', () => {
        //     console.log('Socket connected')
        // })
        return () => {
            meta.current.isMounted = false
        }
    }, [])

    function handleButtonClick(actionName: string) {
        emit('TOPMENU-MAINBODY-LOAD-COMPONENT', actionName)
    }

    return { handleButtonClick, meta, setRefresh }
}

export { useTopMenu }

const useStyles: any = makeStyles((theme: Theme) =>
    createStyles({
        content: {
            // padding: theme.spacing(1),
            display: 'flex',
            columnGap: theme.spacing(2),
            marginTop: theme.spacing(0.5),
            '& .menu-button': {
                textTransform: 'none',
                // backgroundColor: 'dodgerBlue',
                color: 'dodgerBlue',
                height: theme.spacing(4),
                fontSize: theme.spacing(2),
                fontWeight: 'bolder',
                '&:hover': {
                    backgroundColor: theme.palette.lime.light,
                    borderColor: '#0062cc',
                    boxShadow: 'none',
                },
                // padding: theme.spacing(1),
            },
        },

        dialog: {},
    })
)
export { useStyles }
