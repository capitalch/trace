import React, { useEffect, useState, useMemo, useLayoutEffect } from 'react'
import { useTable, useExpanded } from 'react-table'
// import styled from 'styled-components'
import makeData from '../utils/makeData'
import {useTestHook} from './myTestHook'
import '../App.scss'

function Component5() {
    const [, setRefresh] = useState({})
    // const {func1InHook} = useTestHook()
    useLayoutEffect(() => {
        // console.log('layout effect component 5')
    })

    useEffect(() => {
        // console.log('use effect component 5')
    })

    // console.log('body component 5')

    return <div>
        component 5
        <button
        onClick = {()=>{
            setRefresh({})
        }}
        >Component 5 refresh</button>
        <button
            onClick={()=>{
                // func1InHook()
            }}
        >Call hook refresh</button>
    </div>

}

export { Component5 }