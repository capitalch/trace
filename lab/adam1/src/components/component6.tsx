import React, { useEffect, useState, useRef, useContext } from 'react'
import { Button } from '@mui/material'
// import { storeInstance } from './mobx-store'
import { MobxStoreContext } from './mobx-store'
import { useObserver, observer } from 'mobx-react'
// const store: any = {}
function Component6() {
    // const [, setRefresh] = useState({})
    const storeInstance: any = useContext(MobxStoreContext)
    return useObserver(()=>(
        <div>
            Component 6<div>Count:{storeInstance.count}</div>
            <Button
                variant="contained"
                onClick={
                    () => {
                        storeInstance.incr()
                        // setRefresh({})
                    }

                    // setRefresh({})
                }>
                Increase
            </Button>
        </div>
    ))
}

export { Component6 }
