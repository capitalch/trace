import { useEffect, useState } from 'react'
import { TopMenu } from './components/top-menu'
import { makeStyles, Theme, createStyles } from '@material-ui/core'
import { useSharedElements } from './shared-elements-hook'
import { MainBody } from './components/main-body'

function AppMain() {
    const classes = useStyles()
    const {LoadingIndicator, Paper } = useSharedElements()
    return (
        <Paper className={classes.content}>
            <TopMenu />
            <MainBody />
            <LoadingIndicator />
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
