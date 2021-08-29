import React, { useState} from 'react'
import { useGlobal } from '../utils/global-hook'
import {Component9} from './component9'

function Component8() {
    const { registerEntry, getValue, setValue } = useGlobal()

    registerEntry('count', 100)
    return <div>
       <div> Component 8</div>
        <Component9 />
        
    </div>
}
export {Component8 }