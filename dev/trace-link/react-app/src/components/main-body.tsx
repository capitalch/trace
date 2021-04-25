import { useSharedElements } from '../shared-elements-hook'
import { useMainBody, useStyles } from './main-body-hook'

function MainBody() {
    const { meta, setRefresh } = useMainBody()
    const { Paper } = useSharedElements()
    const classes = useStyles()
    return (
        <div className={classes.content}>{meta.current.selectedComponent}</div>
    )
}

export { MainBody }

//
