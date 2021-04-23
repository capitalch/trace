import { initialize } from '../../react-form/common/react-form-hook'
import { manageEntitiesState } from '../../common-utils/esm'
import { useIbuki } from '../../common-utils/ibuki'
import formLevelValidators from './artifacts/form-level-validators'
import {customComponents} from './custom-components/custom-components-map'
import customMethods from './artifacts/custom-methods'
import { sharedArtifacts } from '../../shared-artifacts/shared-artifacts-map'
import graphqlQueries from './artifacts/graphql-queries-mutations'

const { getCurrentEntity,setCurrentEntity } = manageEntitiesState()
setCurrentEntity('authentication') //important in case of authentication
initialize({
    entityName:getCurrentEntity()
    , useIbuki: useIbuki
    , sharedArtifacts: sharedArtifacts
    , customComponents: customComponents
    , formLevelValidators: formLevelValidators
    , customMethods: customMethods
    , graphqlQueries: graphqlQueries
    // , stylesheetFileName: 'trace-dialog.scss'
})