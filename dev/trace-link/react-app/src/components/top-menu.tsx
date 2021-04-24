import react from 'react'
import { useSharedElements } from '../shared-elements-hook'
import { useTopMenu, useStyles } from './top-menu-hook'

function TopMenu() {
    const { meta, setRefresh } = useTopMenu()
    const { Button, ButtonGroup } = useSharedElements()
    const classes = useStyles()
    return (
        <ButtonGroup size='small' color='secondary' variant='contained' className={classes.content}>

            <Button >Sale SMS</Button>
            <Button>Service+ import</Button>
            <Button>Track sale import</Button>
        </ButtonGroup>

    )

}

export { TopMenu }