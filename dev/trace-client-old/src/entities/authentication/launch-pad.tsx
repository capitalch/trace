import { useState, useEffect, useRef } from 'react'
import { usingIbuki } from '../../global-utils/ibuki'
import { manageEntitiesState } from '../../global-utils/esm'
import { GenericCRUD } from './components/generic-crud'

function LaunchPad() {
    const meta: any = useRef({
        isMounted: false,
        output: () => null,
    })
    const [, setRefresh] = useState({})
    const { getCurrentComponent, getFromBag, setInBag } = manageEntitiesState()
    const { filterOn, emit } = usingIbuki()

    useEffect(() => {
        meta.current.isMounted = true
        const subs = filterOn('LAUNCH-PAD:LOAD-COMPONENT').subscribe(
            (d: any) => {
                if (d.data) {
                    setInBag('currentComponent', d.data)
                }
                meta.current.isMounted && setRefresh({})
            }
        )
        return () => {
            subs.unsubscribe()
            meta.current.isMounted = false
        }
    }, [])

    function Comp() {
        let ret = null
        const currentComponent = getFromBag('currentComponent')
        const loadComponent = currentComponent?.args?.loadComponent
        loadComponent &&
            (ret = (
                <GenericCRUD
                    loadComponent={
                        currentComponent.args.loadComponent
                    }></GenericCRUD>
            ))
        return ret
    }

    return <Comp></Comp>
}

export { LaunchPad }