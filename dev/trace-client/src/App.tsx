import React from 'react'
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles'
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
} from '@material-ui/core/colors'
import './App.scss'
import 'primereact/resources/themes/nova/theme.css'
import 'primereact/resources/primereact.min.css'
import 'primeicons/primeicons.css'
import { AppMain } from './app-main'
import 'rsuite/dist/styles/rsuite-default.css'
declare module '@material-ui/core/styles/createPalette' {
    interface Palette {
        neutral: Palette['primary']
        purple: Palette['primary']
        deepPurple: Palette['primary']
        teal: Palette['primary']
        lime: Palette['primary']
        yellow: Palette['primary']
        amber: Palette['primary']
        orange: Palette['primary']
        indigo: Palette['primary']
        blueGrey: Palette['primary']
        blue: Palette['primary']
        cyan: Palette['primary']
        lightBlue: Palette['primary']
    }
    interface PaletteOptions {
        neutral: PaletteOptions['primary']
        purple: PaletteOptions['primary']
        deepPurple: PaletteOptions['primary']
        teal: PaletteOptions['primary']
        lime: PaletteOptions['primary']
        yellow: PaletteOptions['primary']
        amber: PaletteOptions['primary']
        orange: PaletteOptions['primary']
        indigo: PaletteOptions['primary']
        blueGrey: PaletteOptions['primary']
        blue: PaletteOptions['primary']
        cyan: PaletteOptions['primary']
        lightBlue: PaletteOptions['primary']
    }
}

const App: React.FC = () => {
    const theme = createMuiTheme({
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
            blue: { main: blue[500], dark: blue[900], light: blue[400] },
            cyan: { main: cyan[800], dark: cyan[900], light: cyan[600] },
            lightBlue: {
                main: lightBlue[600],
                dark: lightBlue[900],
                light: lightBlue[500],
            },
        },
    })

    // To disable mobile browser back
    window.history.pushState(null, 'null', window.location.href)
    window.onpopstate = function () {
        window.history.go(1)
    }

    return (
        <ThemeProvider theme={theme}>
            <ConfirmProvider>
                {' '}
                {/* confirm dialog box all over the application */}
                <AppMain></AppMain>
            </ConfirmProvider>
        </ThemeProvider>
    )
}

export default App
