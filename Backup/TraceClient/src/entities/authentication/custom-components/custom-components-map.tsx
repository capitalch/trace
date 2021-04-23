import { ManageClients } from './manage-clients'
import { ManageEntities } from './manage-entities'
import { ManageUsers } from './manage-users'
import { AllocateEntitiesToClients } from './allocate-entities-to-clients'
import { AllocateUsersToEntities } from './allocate-users-to-entities'
import { ManageBu } from './manage-bu'

const customComponents = {
    manageClients: ManageClients
    , manageEntities: ManageEntities
    , manageUsers: ManageUsers
    , allocateEntitiesToClients: AllocateEntitiesToClients
    , manageBu: ManageBu
    , allocateUsersToEntities: AllocateUsersToEntities
}

export { customComponents }