import React, { useEffect, useState, useMemo, useLayoutEffect, useRef } from 'react'
import {
  AppBar,
  Modal,
  Tabs, Tab,
  Toolbar, Typography, Backdrop
  , Button
  , Hidden
  , IconButton, Chip,
  Avatar, Box, Container, Paper
  , Dialog
  , DialogTitle
  , DialogActions, DialogContent, Theme, useTheme,
  createStyles, makeStyles
  , List, ListItem, ListItemAvatar, ListItemText, Grid
  , TextField, InputAdornment, Checkbox
} from '@material-ui/core'
import { useConfirm } from 'material-ui-confirm'
import moment, { isMoment } from 'moment'
import { Message } from '@material-ui/icons';

interface TabPanelProps {
  children?: React.ReactNode;
  index: any;
  value: any;
}
function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {(
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}


function Component3() {
  const classes = useStyles();
  const [, setRefresh] = useState({})
  const [value, setValue] = React.useState(0);
  const meta = useRef({
    open: false
  })

  const  confirm  = useConfirm()

  return (
    <div className={classes.root} hidden={false} >
      <TextField
        type = "date"
        value={moment().format('YYYY-MM-DD')}
      ></TextField>
    </div>
  )
}

export { Component3 }

function a11yProps(index: any) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const useStyles: any = makeStyles((theme: Theme) => ({

  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },

  paper: {
    position: 'absolute',
    width: 400,
    height: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },

  container: {
    display: 'flex',
    flexDirection: 'column'
  },
  header: {
    display: 'grid',
    // gridTemplateColumns: ({ meta }: any) => `repeat(${meta.current.noOfColumns}, 1fr)`,
    gridGap: theme.spacing(2),
    padding: theme.spacing(3),

    '& .x-date': {
      // gridColumn: ({ meta }: any) => `1 / ${meta.current.noOfColumns + 1}`,
      width: '9rem'
    },
  }
}))


// return <div className={classes.container}>
  //   <div className={classes.header}>
  //     {/* <span> <Checkbox
  //       onChange={(e: any) => {
  //         console.log(e)
  //       }}
  //       color="primary"
  //     ></Checkbox></span>
  //     <Button      
  //       onClick={handleClick}
  //     >Check</Button> */}
  //   </div>
  // </div>

// function specialMerge(obj1: any, obj2: any) {
//   const ret: any = {}
//   for (let prop in obj1) {
//     ret[prop] = obj2[prop] || obj1[prop] || false
//   }
//   return (ret)
// }

// function handleClick(e: any) {
//   const obj1 = {
//     control1: false,
//     control2: false,
//     control3: false,
//     control4: false
//   }

//   const obj2 = {
//     control1: true,
//     control5: true,
//     control3: true
//   }
//   const merged = specialMerge(obj1, obj2)
//   console.log(merged)
// }