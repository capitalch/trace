import React from 'react'
import { LicenseInfo } from '@mui/x-data-grid-pro'
import './App.scss'
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
import { createTheme, ThemeProvider } from '@mui/material'
import { AppMain } from './app-main'
// import { createTheme , ThemeProvider} from '@mui/material/styles'

declare module '@mui/material/styles' {
    interface Palette {
        neutral?: Palette['primary']
        purple?: Palette['primary']
        deepPurple?: Palette['primary']
        teal?: Palette['primary']
        lime?: Palette['primary']
        yellow?: Palette['primary']
        amber?: Palette['primary']
        orange?: Palette['primary']
        indigo?: Palette['primary']
        blueGrey?: Palette['primary']
        blue?: Palette['primary']
        cyan?: Palette['primary']
        lightBlue?: Palette['primary']
    }
    interface PaletteOptions {
        neutral?: PaletteOptions['primary']
        purple?: PaletteOptions['primary']
        deepPurple?: PaletteOptions['primary']
        teal?: PaletteOptions['primary']
        lime?: PaletteOptions['primary']
        yellow?: PaletteOptions['primary']
        amber?: PaletteOptions['primary']
        orange?: PaletteOptions['primary']
        indigo?: PaletteOptions['primary']
        blueGrey?: PaletteOptions['primary']
        blue?: PaletteOptions['primary']
        cyan?: PaletteOptions['primary']
        lightBlue?: PaletteOptions['primary']
    }
}

function App() {
    // LicenseInfo.setLicenseKey(
    //     '094c13fcff99f49fe015161354d1d052T1JERVI6MjkzMjgsRVhQSVJZPTE2NjMxMjQ0NjcwMDAsS0VZVkVSU0lPTj0x'
    // )
    const theme = createTheme({
        palette: {
            primary: { main: brown[500] },
            secondary: { main: teal[500] },
            blueGrey: {
                main: blueGrey[500],
                // dark: blueGrey[900],
                // light: blueGrey[100],
            },
            neutral: { main: cyan[500], dark: cyan[900], light: cyan[400] },
            purple: {
                main: purple['A700'],
                // dark: purple[900],
                // light: purple[400],
            },
            deepPurple: {
                main: deepPurple[500],
                // dark: deepPurple[900],
                // light: deepPurple[400],
            },
            teal: {
                main: teal[500],
                // dark: teal[900], light: teal[400] 
            },
            lime: {
                main: lime[500],
                // dark: lime[900], light: lime[400] 
            },
            yellow: {
                main: yellow[500],
                // dark: yellow[900],
                // light: yellow[100],
            },
            amber: {
                main: amber[500],
                //  dark: amber[900], light: amber[300]
            },
            orange: {
                main: orange[500],
                // dark: orange[900],
                // light: orange[400],
            },
            indigo: {
                main: indigo[500],
                // dark: indigo[900],
                // light: indigo[400],
            },
            blue: {
                main: blue[500],
                // dark: blue[900], light: blue[400] 
            },
            cyan: {
                main: cyan[800],
                // dark: cyan[900], light: cyan[600] 
            },
            lightBlue: {
                main: lightBlue[600],
                // dark: lightBlue[900],
                // light: lightBlue[500],
            },
        },
    })
    // const theme = createTheme({
    //     palette: {
    //         primary: { main: brown[800] },
    //         secondary: { main: teal[500] },
    //         blueGrey: {
    //             main: blueGrey[500],
    //             dark: blueGrey[900],
    //             light: blueGrey[100],
    //         },
    //         neutral: { main: cyan[500], dark: cyan[900], light: cyan[400] },
    //         purple: {
    //             main: purple['A700'],
    //             dark: purple[900],
    //             light: purple[400],
    //         },
    //         deepPurple: {
    //             main: deepPurple[900],
    //             dark: deepPurple[900],
    //             light: deepPurple[400],
    //         },
    //         teal: { main: teal[500], dark: teal[900], light: teal[400] },
    //         lime: { main: lime[500], dark: lime[900], light: lime[400] },
    //         yellow: {
    //             main: yellow[500],
    //             dark: yellow[900],
    //             light: yellow[100],
    //         },
    //         amber: { main: amber[500], dark: amber[900], light: amber[300] },
    //         orange: {
    //             main: orange[500],
    //             dark: orange[900],
    //             light: orange[400],
    //         },
    //         indigo: {
    //             main: indigo[500],
    //             dark: indigo[900],
    //             light: indigo[400],
    //         },
    //         blue: { main: blue[500], dark: blue[900], light: blue[400] },
    //         cyan: { main: cyan[800], dark: cyan[900], light: cyan[600] },
    //         lightBlue: {
    //             main: lightBlue[600],
    //             dark: lightBlue[900],
    //             light: lightBlue[500],
    //         },
    //     },
    // })
    return (
        <ThemeProvider theme={theme}>
            <ConfirmProvider>
                <AppMain />
            </ConfirmProvider>
        </ThemeProvider>
    )
}

export default App;
