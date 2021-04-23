import React, { useEffect, useState, useRef } from 'react'
const store: any = {}
function Component6() {
    const textInput: any = useRef()
    const control = store['test1'] || (store['test1'] = { id: 0 })

    function checkNumeric() {
        const x: any = NaN
        console.log(isNaN(x))
    }

    function extractNumeric(obj:any) {
        const clone = {...obj}
        for (let prop in clone){
            const a:any = isNaN(parseFloat(clone[prop]))
            if(!isNaN(a)){
                clone[prop] = a
            } else {
                clone[prop] = 0.00
            }
        }
        return(clone)
    }
    return <div>
        <input type='text' ref={textInput}></input>
        <button onClick={e => {
            store.error = "Test error"
            store['errorRef']({})
        }}>Error validation</button>
        <button onClick={(e) => {
            const myObj = {
                a:1.00,
                b:'23.23',
                c:'11,220.11'
            }
            const numObj = extractNumeric(myObj)
            console.log(numObj)
        }}>Check numeric</button>
        <ErrorDisplay></ErrorDisplay>

    </div>
}

export { Component6 }

function ErrorDisplay() {
    const [, setRefresh] = useState({})
    useEffect(() => {
        store['errorRef'] = setRefresh
    }, [])
    const comp = store.error ? <small style={{ color: 'red' }}>
        <ul>
            <li>{store.error}</li>
        </ul> </small> : <></>
    return comp
}