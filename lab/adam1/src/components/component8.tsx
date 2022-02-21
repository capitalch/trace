// import { useIbuki } from '../utils/ibuki'
import { useEffect, useRef, useState, } from 'react'
import { Child1 } from './sub-components/child1'

function Component8() {

    const [, setRefresh] = useState({})
    const meta = useRef({
        prop1: ''
    })
    useEffect(() => {
        console.log('Comp8 useEffect first time')
    }, [])

    useEffect(() => {
        console.log('Comp8 useEffect all time')
    })

    return (
        <div>
            <div>comp8</div>
            <Child1 prop1={meta.current.prop1} />
            <button
                onClick={() => {
                    meta.current.prop1 = 'xyz'
                    setRefresh({})
                }}
            >Click of Comp8</button>
        </div>
    )
}
export { Component8 }
