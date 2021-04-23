import React, { useState, Suspense } from 'react';
import { useIbuki } from '../utils/ibuki'
import { componentsMap } from './components-map'

const Loader = () => {
    const [compName, setCompName]: any = useState('nothing')
    const { filterOn } = useIbuki()

    filterOn('LOAD-COMPONENT').subscribe(d => {
        setCompName(d.data)
    })
    const Comp = componentsMap(compName)
    return <div>
        <Suspense fallback={"Loading..."}>
            <Comp></Comp>
        </Suspense>
    </div>
}

export { Loader }