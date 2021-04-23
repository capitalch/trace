import React, { lazy, Suspense } from 'react'
import { Component1 } from './component1'
import { Component2 } from './component2'
import { Component3 } from './component3'
import { Component4 } from './component4'
import { Component5 } from './component5'
import { Component6 } from './component6'
import { Component7 } from './component7'
import { Component9 } from './component9'
import { Component10 } from './component10'
import { Component11 } from './component11'
import { Component12 } from './component12'
import { Component13 } from './component13'
import { Nothing } from './nothing'
const Component8: any = React.lazy(() => import('./component8'))
// import  Component8 from './component8'


const componentsMap = (mname: string) => {
    // const Component8: any = React.lazy(() => {return import('./component8')})
    const map: any = {
        component1: Component1,
        component2: Component2,
        component3: Component3,
        component4: Component4,
        component5: Component5,
        component6: Component6,
        component7: Component7,
        component8: Component8,
        component9: Component9,
        component10: Component10,
        component11:Component11,
        component12:Component12,
        component13:Component13,
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
