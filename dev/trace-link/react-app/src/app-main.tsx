import { useEffect, useState } from 'react'
import { TopMenu } from './components/top-menu'
import { useSharedElements } from './shared-elements-hook'

function AppMain() {
    const { Paper } = useSharedElements()
    return (<Paper>
        <TopMenu />
    </Paper>)
}

export { AppMain }