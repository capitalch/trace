import React, { useState, useEffect, useRef } from "react";
import {
  makeStyles,
  Theme,
  createStyles,
  Button,
  Tabs,
  Tab,
  Paper,
} from "@material-ui/core";

import { Child1 } from "./sub-components/child1";
import { Child2 } from "./sub-components/child2";
import { Child3 } from "./sub-components/child3";
import { atom, selector } from "recoil";

function Component10() {
  const [, setRefresh] = useState({});
  const classes = useStyles();
  const meta: any = useRef({
    isMounted: false,
    value: 0,
  });

  useEffect(() => {
    meta.current.isMounted = true;
    return () => {
      meta.current.isMounted = false;
    };
  }, []);


  return (
    <Paper className={classes.content}>
      <Child1 />
      <Child2 />
      <Child3 />
    </Paper>
  );
}

const myAtom = atom({
  key: "counter",
  default: 0,
});

const myAtomObj = atom({
  key: "counterObj",
  default: {
    count: 0,
  },
});

const myCheckCounter = selector({
  key: "checkCounter",
  get: ({ get }) => {
    const cntr = get(myAtom);
    console.log(cntr);
  },
});

export { Component10, myAtom, myAtomObj, myCheckCounter };

const useStyles: any = makeStyles((theme: Theme) =>
  createStyles({
    content: {
      flexGrow: 1,
      // width: '100%',
      "& .view": {
        marginLeft: "auto",
      },
    },
  })
);

{
  /* <Parent arbitraryData={meta.current} /> */
}
