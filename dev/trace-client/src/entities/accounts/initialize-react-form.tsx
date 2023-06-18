import customControls from './artifacts/custom-controls'
import graphqlQueries from './artifacts/graphql-queries-mutations'
import { initialize } from '../../react-form/common/react-form-hook'
import itemLevelValidators from './artifacts/item-level-validators'
import formLevelValidators from './artifacts/form-level-validators'
import setLevelValidators from './artifacts/set-level-validators'
import { manageEntitiesState } from '../../global-utils/esm'
import { usingIbuki } from '../../global-utils/ibuki'
import { sharedArtifacts } from '../../shared-artifacts/shared-artifacts-map'
// import { customComponents } from './components/common/custom-components-map'
import { initCode } from './init-code'

const { getCurrentEntity } = manageEntitiesState()
const { filterOn } = usingIbuki()
const { setLastBuCodeFinYearIdBranchId } = initCode()

initialize({
    entityName: getCurrentEntity()
    , usingIbuki: usingIbuki
    , sharedArtifacts: sharedArtifacts
    , customControls: customControls
    , setLevelValidators: setLevelValidators
    , formLevelValidators: formLevelValidators
    , itemLevelValidators: itemLevelValidators
    , graphqlQueries: graphqlQueries
})

filterOn(getCurrentEntity().concat('-', 'EXECUTE-INIT-CODE')).subscribe((d: any) => {
    setLastBuCodeFinYearIdBranchId()
})