import { TopMenu } from './components/top-menu'
import { makeStyles, Theme, createStyles } from '@material-ui/core'
import { useSharedElements } from './shared-elements-hook'
import { MainBody } from './components/main-body'
import { ShowMessage } from './utils/show-message'
import { traceGlobal } from './utils/trace-global'
import { utilMethods } from './utils/util-methods'

function AppMain() {
    const classes = useStyles()
    const { getConfig } = utilMethods()
    const { LoadingIndicator, Paper } = useSharedElements()
    traceGlobal.config = getConfig() // Application wide config.json
    
    return (
        <Paper className={classes.content}>
            <TopMenu />
            <MainBody />
            <LoadingIndicator />
            <ShowMessage />
        </Paper>
    )
}

export { AppMain }

const useStyles: any = makeStyles((theme: Theme) =>
    createStyles({
        content: {
            padding: theme.spacing(1),
        },
    })
)
export { useStyles }
