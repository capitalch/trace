import React, { useEffect, useState, useRef, useContext } from 'react'
import { Component8 } from './component8'
import { useIbuki } from '../utils/ibuki'

function Component6() {
    const { filterOn } = useIbuki()
    return (
        <div>
            <button
                onClick={() => {
                 
                }}>
                Convert
            </button>
        </div>
    )
}

export { Component6 }
