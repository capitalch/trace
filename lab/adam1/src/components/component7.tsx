import React, { useEffect, useState, useRef } from 'react'
import Button from '@material-ui/core/Button'
import Snackbar from '@material-ui/core/Snackbar'
import MuiAlert from '@material-ui/lab/Alert'
import makeStyles from '@material-ui/styles/makeStyles'
import { useIbuki } from '../utils/ibuki'
import { Component8 } from './component8'
import { MyContext } from './my-context'

function Component7() {
    const [counter, setCounter] = useState(0)
    return (
        <div>
            <div>Component 7</div>
            <span>Counter value: {counter}</span>
            <div>
                <button onClick={doIncr}>Incr</button>
            </div>
        </div>
    )

    function doIncr() {
        setCounter(
            (cnt1)=>cnt1+ 1)
    }
}

export { Component7 }
