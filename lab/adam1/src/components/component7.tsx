import React, { useEffect, useState, useRef } from 'react'
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import makeStyles from "@material-ui/styles/makeStyles";
import { useIbuki } from '../utils/ibuki';

function Component7() {

    const useStyles = makeStyles(theme => ({
        root: {
            width: '100%',
            '& > * + *': {
                // marginTop: theme.spacing(2),
            },
        },
    }));

    const { filterOn, emit } = useIbuki()
    const classes = useStyles();
    console.log('container body')
    useComp2()
    return (
        <div className={classes.root}>
            {<Comp1 />}
            <Comp2 />
        </div>
    );

    function Comp1() {
        const [, setRefresh] = useState({})
        useEffect(() => {

        }, [])
        
        console.log('comp1 body')
        return (<div>
            <span>comp1</span>
            <button
                onClick={() => {
                    setRefresh({})
                }}
            >Refresh comp1</button>
            <button onClick={() => {
                emit('USE-COMP2-REFRESH',null)
            }}>Comp2 hook activated</button>
        </div>)
    }

    function Comp2() {
        // const x = useComp2()
        console.log('comp2 body')
        return (<div>Comp 2</div>)
    }

    function useComp2() {
        const [, setRefresh] = useState({})
        console.log('comp2 hook body')
        useEffect(() => {
            filterOn('USE-COMP2-REFRESH').subscribe((d: any) => {
                setRefresh({})
            })
        }, [])
        return (1)
    }

}

export { Component7 }