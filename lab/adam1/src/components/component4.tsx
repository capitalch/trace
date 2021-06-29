import { env } from 'process'
import _ from 'lodash'
import React, { useRef, useState, useEffect, useLayoutEffect } from 'react'
import { List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core'
import { Send } from '@material-ui/icons'
import './component4.scss'
import {useIbuki} from '../utils/ibuki'
import { Button } from '@material-ui/core'

const Component4 = () => {
    const [, setRefresh] = useState({})
    const {filterOn}  = useIbuki()
    useEffect(() => {
        const subs1 = filterOn('ABCD').subscribe(()=>{
            console.log('ABCD')
        })
        // const subs2 = filterOn('EFGH').subscribe(()=>{
        //     console.log('EFGH')
        // })
        // const subs3 = filterOn('EFGH').subscribe(()=>{
        //     console.log('EFGH')
        // })
        // subs1.add(subs2).add(subs3)
        return () => {
            subs1.unsubscribe()
        }
    }, [])

    return (
        <div>
           <Button>Test</Button>
        </div>
    )
}

export { Component4 }
