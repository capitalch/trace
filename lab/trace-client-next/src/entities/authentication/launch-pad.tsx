import { useState, useEffect, useRef } from 'react'
import { usingIbuki } from '../../global-utils/ibuki'
import { manageEntitiesState } from '../../global-utils/esm'
import { GenericCRUD } from './components/generic-crud'
import { AdminManageBusUsers } from './components/admin-manage-bus-users'
import { AdminManageBu } from './components/admin-manage-bu'
import { AdminManageRoles } from './components/admin-manage-roles'
import { AdminAssociateUsersRolesBu } from './components/admin-associate-users-roles-bu'

function LaunchPad() {
    const meta: any = useRef({
        currentComponentName: '*',
        isMounted: false,
        output: () => null,
    })
    const [, setRefresh] = useState({})
    const { getFromBag, setInBag } = manageEntitiesState()
    const { filterOn } = usingIbuki()
    const components: any = {
        adminManageBusUsers: AdminManageBusUsers,
        adminManageBu: AdminManageBu,
        adminManageRoles: AdminManageRoles,
        adminAssociateUsersRolesBu: AdminAssociateUsersRolesBu,
    }

    useEffect(() => {
        const curr = meta.current
        curr.isMounted = true
        const subs = filterOn('LAUNCH-PAD:LOAD-COMPONENT').subscribe(
            (d: any) => {
                if (d.data) {
                    setInBag('currentComponent', d.data)
                }
                meta.current.currentComponentName = d.data?.componentName
                curr.isMounted && setRefresh({})
            }
        )
        return () => {
            subs.unsubscribe()
            curr.isMounted = false
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

    // return <Comp></Comp>
    const CurrentComponent =
        components[meta.current.currentComponentName] || (() => <></>)
    return <CurrentComponent />
}

export { LaunchPad }
