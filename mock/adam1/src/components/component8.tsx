import React, { useState} from 'react'
import { useGlobal } from '../utils/global-hook'
function Component8() {
    const { registerEntry, getValue, setValue } = useGlobal()

    registerEntry('count', 100)
    return <div>
        <Counter id={1}></Counter>
        <Counter id={2}></Counter>
        <Counter id={3}></Counter>
        <button onClick={e => {
            let cnt: number = +getValue('count') + 1
            setValue('count', cnt)
        }}>Increase</button>
    </div>
}

export default Component8 

function Counter(props: any) {
    const { subscribe, getValue } = useGlobal()
    const [, setRefresh] = useState({})
    useState(() => {
        subscribe(props.id, 'count', () => setRefresh({}))
    })

    return <div>{getValue('count')}</div>
}