import { initialize } from '../../react-form/common/react-form-hook'
import { manageEntitiesState } from '../../common-utils/esm'
import { usingIbuki } from '../../common-utils/ibuki'
import formLevelValidators from './artifacts/form-level-validators'
// import customMethods from './artifacts/custom-methods'
import { sharedArtifacts } from '../../shared-artifacts/shared-artifacts-map'
import graphqlQueries from './artifacts/graphql-queries-mutations'

const { getCurrentEntity,setCurrentEntity } = manageEntitiesState()
setCurrentEntity('authentication') //important in case of authentication
initialize({
    entityName:getCurrentEntity()
    , usingIbuki: usingIbuki
    , sharedArtifacts: sharedArtifacts
    , formLevelValidators: formLevelValidators
    // , customMethods: customMethods
    , graphqlQueries: graphqlQueries
})