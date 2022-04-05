import { useState, useEffect, useRef } from 'react'
import { usingIbuki } from '../../global-utils/ibuki'
import { manageEntitiesState } from '../../global-utils/esm'
// import { GenericCRUD } from './components/generic-crud'
import { ManageUsers } from './components/manage-users'
import { AdminManageBu } from './components/admin-manage-bu'
import { AdminManageRoles } from './components/admin-manage-roles'
import { AdminAssociateUsersRolesBu } from './components/admin-associate-users-roles-bu'
import { SuperAdminManageClients } from './components/super-admin-manage-clients'
import { SuperAdminManageEntities } from './components/super-admin-manage-entities'
import { SuperAdminAssociateAdminUsersWithClientsAndEntities } from './components/super-admin-associate-admin-users-with-clients-and-entities'
function LaunchPad() {
    const meta: any = useRef({
        currentComponentName: '*',
        isMounted: false,
        output: () => null,
    })

    const [, setRefresh] = useState({})
    const { setInBag } = manageEntitiesState()
    const { filterOn } = usingIbuki()
    const components: any = {
        manageUsers: ManageUsers,
        adminManageBu: AdminManageBu,
        adminManageRoles: AdminManageRoles,
        adminAssociateUsersRolesBu: AdminAssociateUsersRolesBu,
        superAdminManageClients: SuperAdminManageClients,
        superAdminManageEntities: SuperAdminManageEntities,
        superAdminAssociateAdminUsersWithClientsAndEntities:
            SuperAdminAssociateAdminUsersWithClientsAndEntities,
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

    const CurrentComponent =
        components[meta.current.currentComponentName] || (() => <></>)
    return <CurrentComponent />
}

export { LaunchPad }
