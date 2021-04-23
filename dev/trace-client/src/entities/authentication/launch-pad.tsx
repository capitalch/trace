import { useState, useEffect, useRef } from 'react'
import { usingIbuki } from '../../common-utils/ibuki'
import { manageEntitiesState } from '../../common-utils/esm'
import { GenericCRUD } from './components/generic-crud'

function LaunchPad() {
    const meta: any = useRef({
        isMounted: false,
        output: () => null,
    })
    const [, setRefresh] = useState({})
    const { getFromBag, setInBag } = manageEntitiesState()
    const { filterOn, emit } = usingIbuki()

    useEffect(() => {
        meta.current.isMounted = true
        const subs = filterOn('LOAD-MAIN-COMPONENT-NEW').subscribe((d: any) => {
            if (d.data) {
                setInBag('currentComponent', d.data)
            }
            meta.current.isMounted && setRefresh({})
        })
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
