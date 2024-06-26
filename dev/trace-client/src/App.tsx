import React from 'react'
import { LicenseInfo } from '@mui/x-data-grid-pro'
import { registerLicense } from '@syncfusion/ej2-base'
import { ThemeProvider, createTheme, StyledEngineProvider } from '@mui/material/styles'
import { ConfirmProvider } from 'material-ui-confirm'
import {
    purple,
    teal,
    blueGrey,
    brown,
    indigo,
    cyan,
    deepPurple,
    lime,
    yellow,
    amber,
    orange,
    blue,
    lightBlue,
} from '@mui/material/colors'
import './App.scss'
import 'primereact/resources/themes/nova/theme.css'
import 'primereact/resources/primereact.min.css'
import 'primeicons/primeicons.css'
import { AppMain } from './app-main'
import "../node_modules/@syncfusion/ej2-react-grids/styles/fabric.css";

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

const App: React.FC = () => {

    const theme = createTheme({
        components: {

        },
        palette: {
            primary: { main: brown[800] },
            secondary: { main: teal[500] },

            blueGrey: {
                main: blueGrey[500],
                dark: blueGrey[900],
                light: blueGrey[100],
            },
            neutral: { main: cyan[500], dark: cyan[900], light: cyan[50] },
            purple: {
                main: purple['A700'],
                dark: purple[900],
                light: purple[100],
            },
            deepPurple: {
                main: deepPurple[900],
                dark: deepPurple[900],
                light: deepPurple[400],
            },
            teal: { main: teal[500], dark: teal[900], light: teal[400] },
            lime: { main: lime[500], dark: lime[900], light: lime[100] },
            yellow: {
                main: yellow[500],
                dark: yellow[900],
                light: yellow[100],
            },
            amber: { main: amber[500], dark: amber[900], light: amber[100] },
            orange: {
                main: orange[500],
                dark: orange[900],
                light: orange[100],
            },
            indigo: {
                main: indigo[500],
                dark: indigo[900],
                light: indigo[100],
            },
            blue: { main: blue[500], dark: blue[900], light: blue[400] },
            cyan: { main: cyan[800], dark: cyan[900], light: cyan[600] },
            lightBlue: {
                main: lightBlue[600],
                dark: lightBlue[900],
                light: lightBlue[200],
            },
        },
    })

    // Material grid
    LicenseInfo.setLicenseKey(
        '094c13fcff99f49fe015161354d1d052T1JERVI6MjkzMjgsRVhQSVJZPTE2NjMxMjQ0NjcwMDAsS0VZVkVSU0lPTj0x'
    )
    // syncfusion grid
    registerLicense('Ngo9BigBOggjHTQxAR8/V1NGaF5cXmdCf1FpRmJGdld5fUVHYVZUTXxaS00DNHVRdkdgWXhedHVVR2RZU0J+XEA=')

    // To disable mobile browser back
    window.history.pushState(null, 'null', window.location.href)
    window.onpopstate = function () {
        window.history.go(1)
    }

    return (
        <StyledEngineProvider injectFirst>
            <ThemeProvider theme={theme}>
                <ConfirmProvider>
                    {' '}
                    {/* confirm dialog box all over the application */}
                    <AppMain></AppMain>
                </ConfirmProvider>
            </ThemeProvider>
        </StyledEngineProvider>
    )
}

export default App