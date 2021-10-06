/** @jsxImportSource @emotion/react */
import './App.scss'
import { createTheme, ThemeProvider } from '@mui/material'
import { CompA } from './components/compA'
import { UserProfileProvider } from './components/common/user-profile-provider'

declare module '@mui/material/styles' {
    interface Theme {
        neutral: {}
        status: {
            danger: string
            neutral: string
        }
    }
    // allow configuration using `createTheme`
    interface PaletteOptions {
        neutral: PaletteOptions['primary']
        purple: PaletteOptions['primary']
        status?: {
            danger?: string
            neutral?: string
        }
    }
    interface Palette {
        neutral: Palette['primary']
        purple: Palette['primary']
    }
}

function App() {
    const userProfile = {
        name: 'Sushant',
        address: '12 JL',
    }

    const theme = createTheme({
        palette: {
            primary: {
                main: '#00685b',
            },
            secondary: {
                main: '#f44336',
            },
            neutral: {
                main: '#5e5e25',
            },
            purple: {

            }
        },
    })

    return (
        <div className="App">
            <ThemeProvider theme={theme}>
                <UserProfileProvider value={userProfile}>
                    <CompA />
                </UserProfileProvider>
            </ThemeProvider>
        </div>
    )
}

export default App
