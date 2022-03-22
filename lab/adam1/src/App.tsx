import React, { useEffect, useState, useRef } from 'react'
import { LicenseInfo } from '@mui/x-data-grid-pro'
import { ThemeProvider, createTheme, StyledEngineProvider } from '@mui/material/styles'
import {
    purple,
    green,
    red,
    teal,
    blueGrey,
    brown,
    grey,
    pink,
    indigo,
    cyan,
    deepPurple,
    lime,
    yellow,
    amber,
    orange,
} from '@mui/material/colors'
import 'primeicons/primeicons.css'
import 'primereact/resources/themes/nova/theme.css'
import 'primereact/resources/primereact.css'
import 'primeflex/primeflex.css'
import 'fontsource-roboto'
import _ from 'lodash'

import { useIbuki } from './utils/ibuki'

import { Component8 } from './components/component8'
import { Component1 } from './components/component1'

declare module '@mui/material/styles/' {
    interface Palette {
        blueGrey?: any
        neutral?: any
        purple: any
        deepPurple: any
        teal: any
        lime: any
        yellow: any
        amber: any
        orange: any
        indigo: any
        blue: any
        cyan: any
        lightBlue: any
    }
    interface PaletteOptions {
        blueGrey?: any
        neutral?: any
        purple?: any
        deepPurple?: any
        teal?: any
        lime?: any
        yellow?: any
        amber?: any
        orange?: any
        indigo?: any
        blue?: any
        cyan?: any
        lightBlue?: any
    }
}

LicenseInfo.setLicenseKey(
    '094c13fcff99f49fe015161354d1d052T1JERVI6MjkzMjgsRVhQSVJZPTE2NjMxMjQ0NjcwMDAsS0VZVkVSU0lPTj0x'
)

const App: React.FC = () => {
    const [, setRefresh] = useState({})
    const { emit } = useIbuki()
    const theme = createTheme({
        palette: {
            primary: { main: brown[800] },
            secondary: { main: teal[500] },
            blueGrey: {
                main: blueGrey[500],
                dark: blueGrey[900],
                light: blueGrey[100],
            },
            // secondary: { main: blueGrey[500] },
            neutral: { main: cyan[500], dark: cyan[900], light: cyan[400] },
            purple: {
                main: purple['A700'],
                dark: purple[900],
                light: purple[400],
            },
            deepPurple: {
                main: deepPurple[900],
                dark: deepPurple[900],
                light: deepPurple[400],
            },
            teal: { main: teal[500], dark: teal[900], light: teal[400] },
            lime: { main: lime[500], dark: lime[900], light: lime[400] },
            yellow: {
                main: yellow[500],
                dark: yellow[900],
                light: yellow[100],
            },
            amber: { main: amber[500], dark: amber[900], light: amber[300] },
            orange: {
                main: orange[500],
                dark: orange[900],
                light: orange[400],
            },
            indigo: {
                main: indigo[500],
                dark: indigo[900],
                light: indigo[400],
            },
        },
    })

    // const handleOnIdle = (event: any) => {
    //     console.log('user is idle', event)
    //     console.log('last active', getLastActiveTime())
    // }

    // const { getRemainingTime, getLastActiveTime } = useIdleTimer({
    //     timeout: 10000,
    //     onIdle: handleOnIdle,
    //     debounce: 500,
    // })

    return (
        <StyledEngineProvider injectFirst>
            <ThemeProvider theme={theme}>
                <Component1 />
            </ThemeProvider>
        </StyledEngineProvider>
    )
}
export default App
