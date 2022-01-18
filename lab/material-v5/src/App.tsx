import './App.scss'
import { createTheme, ThemeProvider, Theme } from '@mui/material/styles'
import { red, green, yellow, indigo, pink, cyan } from '@mui/material/colors'
import { Comp1 } from './components/comp1'

// declare module '@mui/material/styles' {
//     interface Theme {
//         status: {
//             danger: string;
//         };
//     }
//     interface ThemeOptions {
//         status?: {
//             danger?: string;
//         };
//     }
// }

declare module '@mui/material/styles'{
    interface PaletteOptions {
        neutral1?: any;
    }
}

function App() {
    const theme: Theme = createTheme({
        // status: {
        //     danger: green[500],
        // },
        palette: {
            primary: {
                main: green[500],
            },
            secondary: {
                main: '#edf2ff',
            },
            neutral1: {
                main: yellow.A400
            }
        }
    })
    return (
        <ThemeProvider theme={theme}>
            <Comp1 />
        </ThemeProvider>
    )
}

export default App


