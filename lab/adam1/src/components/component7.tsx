import React, { useEffect, useState, useRef } from 'react'
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import makeStyles from "@material-ui/styles/makeStyles";
import { useIbuki } from '../utils/ibuki';
import { Component8 } from './component8'
import { MyContext } from './my-context'

function Component7() {

    let user:any = {
        name: 'Sush',
        address: '12 J.L'
    }

    return (
        <MyContext.Provider value={user}>
            <div>
                <div>Component 7</div>
                <button onClick={() => {
                    user = {
                        name: 'PPP',
                        address: 'P / 161'
                    }
                }}>Change address</button>
                <Component8 />
            </div>
        </MyContext.Provider>
    );
}

export { Component7 }