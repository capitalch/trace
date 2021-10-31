import React, { useEffect, useState, useRef } from "react";
import { ThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import { LicenseInfo } from '@mui/x-data-grid-pro'
import { ConfirmProvider } from "material-ui-confirm";
import { useIdleTimer } from "react-idle-timer";
import {
  RecoilRoot,
  atom,
  selector,
  useRecoilState,
  useRecoilValue,
} from "recoil";
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
} from "@material-ui/core/colors";
import "primeicons/primeicons.css";
import "primereact/resources/themes/nova/theme.css";
import "primereact/resources/primereact.css";
import "primeflex/primeflex.css";
import "fontsource-roboto";
import _ from "lodash";

import { useIbuki } from "./utils/ibuki";
// import { Breakpoint, BreakpointProvider } from 'react-socks'
// import _ from 'lodash'
import { Header } from "./components/header";
import { Loader } from "./components/loader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import clsx from "clsx";
// import {
//   makeStyles,
//   useTheme,
//   Theme,
//   createStyles,
// } from "@material-ui/core/styles";
import { PersistentDrawerLeft } from "./drawyer";
import { useTraceGlobal } from "./utils/trace-global";
import { Component1 } from "./components/component1";
import { Component3 } from "./components/component3";
import { Component4 } from "./components/component4";
import { Component5 } from "./components/component5";
import { Component7 } from "./components/component7";

declare module "@material-ui/core/styles/createPalette" {
  interface Palette {
    neutral: Palette["primary"];
    purple: Palette["primary"];
    deepPurple: Palette["primary"];
    teal: Palette["primary"];
    lime: Palette["primary"];
    yellow: Palette["primary"];
    amber: Palette["primary"];
    orange: Palette["primary"];
    indigo: Palette["primary"];
    blueGrey: Palette["primary"];
  }
  interface PaletteOptions {
    neutral: PaletteOptions["primary"];
    purple: PaletteOptions["primary"];
    deepPurple: PaletteOptions["primary"];
    teal: PaletteOptions["primary"];
    lime: PaletteOptions["primary"];
    yellow: PaletteOptions["primary"];
    amber: PaletteOptions["primary"];
    orange: PaletteOptions["primary"];
    indigo: PaletteOptions["primary"];
    blueGrey: PaletteOptions["primary"];
  }
}

const App: React.FC = () => {
  const [, setRefresh] = useState({});
  const { emit } = useIbuki();
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
      purple: { main: purple["A700"], dark: purple[900], light: purple[400] },
      deepPurple: {
        main: deepPurple[900],
        dark: deepPurple[900],
        light: deepPurple[400],
      },
      teal: { main: teal[500], dark: teal[900], light: teal[400] },
      lime: { main: lime[500], dark: lime[900], light: lime[400] },
      yellow: { main: yellow[500], dark: yellow[900], light: yellow[100] },
      amber: { main: amber[500], dark: amber[900], light: amber[300] },
      orange: { main: orange[500], dark: orange[900], light: orange[400] },
      indigo: { main: indigo[500], dark: indigo[900], light: indigo[400] },
      // custom1: { main: pink[900] }
    },
  });

  const handleOnIdle = (event: any) => {
    console.log("user is idle", event);
    console.log("last active", getLastActiveTime());
  };

  const { getRemainingTime, getLastActiveTime } = useIdleTimer({
    // timeout: 1000 * 60 * 15,
    timeout: 10000,
    onIdle: handleOnIdle,
    // onActive: handleOnActive,
    // onAction: handleOnAction,
    debounce: 500,
  });

  return (
    <ThemeProvider theme={theme}>
      <Component7 />
    </ThemeProvider>
  );
};
export default App;
