import { initialize } from '../../react-form/common/react-form-hook'
import { manageEntitiesState } from '../../global-utils/esm'
import { usingIbuki } from '../../global-utils/ibuki'
import formLevelValidators from './artifacts/form-level-validators'
import { sharedArtifacts } from '../../shared-artifacts/shared-artifacts-map'
import graphqlQueries from './artifacts/graphql-queries-mutations'

const { getCurrentEntity,setCurrentEntity } = manageEntitiesState()
setCurrentEntity('authentication') //important in case of authentication
initialize({
    entityName:getCurrentEntity()
    , usingIbuki: usingIbuki
    , sharedArtifacts: sharedArtifacts
    , formLevelValidators: formLevelValidators
    , graphqlQueries: graphqlQueries
})