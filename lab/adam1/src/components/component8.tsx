// import { useIbuki } from '../utils/ibuki'
import { useRef, useState, useMemo, useCallback } from 'react'
import { Child1 } from './sub-components/child1'
import { Child11 } from './sub-components/child11'
import { Child2 } from './sub-components/child2'

function Component8() {

    const [, setRefresh] = useState({})
    const meta = useRef({
        counter: 0,
        childKey: 0,
        prop1: 0,
        prop2: 0,
        comp: 'comp1'
    })

    const mapChild: any = {
        comp1: <Child1 />,
        comp2: <Child2 />
    }

    return (
        <div>
            Comp8
            <button
                onClick={() => {
                    meta.current.counter = meta.current.counter + 1
                    setRefresh({})
                }}
            >comp8 increment counter and refresh</button>
            <button onClick={() => {
                // meta.current.childKey++ // = !meta.current.childKey 
                setRefresh({})
            }}>
                refresh only
            </button>
            <button onClick={() => {
                meta.current.prop1++ // = !meta.current.childKey 
                setRefresh({})
            }}>
                Change prop1 of child1 and refresh
            </button>
            <button onClick={() => {
                if(meta.current.comp === 'comp1'){
                    meta.current.comp = 'comp2'
                } else {
                    meta.current.comp = 'comp1'
                }                
                setRefresh({})
            }}>
                Swap child
            </button>
            <button
                onClick={() => {
                    console.log('counter comp8:', meta.current.counter)
                }}
            >comp8 log counter</button>
            {/* {mapChild[meta.current.comp]} */}
            {/* {useMemo(() => <Child1 prop1={meta.current.prop1} />, [])} */}
            {useCallback(()=>()=><Child1 />,[])}
        </div>
    )
}
export { Component8 }
