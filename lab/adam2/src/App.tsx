import './App.scss';
import { LicenseInfo } from '@mui/x-data-grid-pro'
import { ThemeProvider, createTheme, StyledEngineProvider } from '@mui/material/styles'
import { megaData } from './mega-data-init'
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
import { MegaDataContext } from './components/mega-data-context';
import { AccSales } from './components/acc-sales'
import { Comp1 } from './components/comp1';

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

  interface FontSizes {
    medium: 14,
  }
}


function App() {
  const theme = createTheme({
    typography: {
      // h6: {
      //     fontWeight: 'bold',
      //     fontSize:'1rem'
      // },
    },
    // FontSizes:{},
    palette: {
      primary: { main: brown[800] },
      secondary: { main: teal[500] },
      blueGrey: {
        main: blueGrey[500],
        dark: blueGrey[900],
        light: blueGrey[100],
      },
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
  LicenseInfo.setLicenseKey(
    '094c13fcff99f49fe015161354d1d052T1JERVI6MjkzMjgsRVhQSVJZPTE2NjMxMjQ0NjcwMDAsS0VZVkVSU0lPTj0x'
  )
  // const megaData = Object.assign({}, salesMegaData)
  // { accounts: { common: {}, sales: {}, settings: {} } }
  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <MegaDataContext.Provider value={megaData}>
          {/* <AccSales /> */}
          <Comp1 />
        </MegaDataContext.Provider>
      </ThemeProvider>
    </StyledEngineProvider>
  );
}

export default App;
