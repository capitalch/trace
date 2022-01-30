import React, { lazy, Suspense } from 'react'
import { Component6 } from './component6'

import { Nothing } from './nothing'
// const Component8: any = React.lazy(() => import('./component8'))
// import  Component8 from './component8'


const componentsMap = (mname: string) => {
    // const Component8: any = React.lazy(() => {return import('./component8')})
    const map: any = {
        component6: Component6,
        nothing: Nothing
    }
    return map[mname]
}

export { componentsMap }
/*
<Suspense fallback={"Loading..."}>
        <Component8></Component8>
        </Suspense>
*/
