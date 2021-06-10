import { env } from 'process'
import _ from 'lodash'
import React, { useRef, useState, useEffect, useLayoutEffect } from 'react'
import { List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core'
import { Send } from '@material-ui/icons'
import './component4.scss'
import moment from 'moment'
import { Button } from '@material-ui/core'

const Component4 = () => {
    const [, setRefresh] = useState({})
    useEffect(() => {
        
        return () => {
        }
    }, [])

    function createRcId(rcId: number){
        const rndArr = 'XWSGH29TRP'.split('')
        const rndAdd = 134567
        const temp = String(rcId + rndAdd)
        const out = []
        for(let char of temp){
            out.push(rndArr[+char])
        }
        alert(out.join(''))
    }

    return (
        <div>
            <Button onClick = {()=>createRcId(100002)}>Test</Button>
            <button onClick={()=>{
                console.log((
                    Math.random().toString(36).substring(2, 5) + '-' + Math.random().toString(36).substring(2, 5)).toUpperCase())
            }}>Test1</button>
            <button onClick={()=>{
                console.log((Math.random().toString(36).substring(2, 5)).toUpperCase())
            }}>Test2</button>
        </div>
    )
}

export { Component4 }
