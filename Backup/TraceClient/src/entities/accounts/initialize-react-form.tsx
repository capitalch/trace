import moment from 'moment'
import payments from './json-form-templates/payments.json'
import receipts from './json-form-templates/receipts.json'
import contra from './json-form-templates/contra.json'
import journals from './json-form-templates/journals.json'
import customMethods from './artifacts/custom-methods'
import customControls from './artifacts/custom-controls'
import graphqlQueries from './artifacts/graphql-queries-mutations'
import { initialize } from '../../react-form/common/react-form-hook'
import itemLevelValidators from './artifacts/item-level-validators'
import formLevelValidators from './artifacts/form-level-validators'
import setLevelValidators from './artifacts/set-level-validators'
import { manageEntitiesState } from '../../common-utils/esm'
import { useIbuki } from '../../common-utils/ibuki'
import { sharedArtifacts } from '../../shared-artifacts/shared-artifacts-map'
import { customComponents } from './custom-components/custom-components-map'
import {initCode} from './init-code'
// import { graphqlService } from '../../common-utils/graphql-service'
// import  messages from './accounts-messages.json'
const { getCurrentEntity, getFromBag } = manageEntitiesState()
// const {queryGraphql} = graphqlService()
const {filterOn} = useIbuki()
const {setLastBuCodeFinYearIdBranchId} = initCode()
initialize({
    entityName: getCurrentEntity()
    , allFormTemplates: {
        payments: JSON.stringify(payments)
        , receipts: JSON.stringify(receipts)
        , contra: JSON.stringify(contra)
        , journals: JSON.stringify(journals)
    }
    , useIbuki: useIbuki
    , sharedArtifacts: sharedArtifacts
    , customMethods: customMethods
    , customComponents: customComponents
    , customControls: customControls
    , setLevelValidators: setLevelValidators
    , formLevelValidators: formLevelValidators
    , itemLevelValidators: itemLevelValidators
    , graphqlQueries: graphqlQueries
    // , dateFormat: getFromBag('dateFormat')
    // , stylesheetFileName: 'voucher-format.scss'
})

filterOn(getCurrentEntity().concat('-', 'EXECUTE-INIT-CODE')).subscribe((d:any)=>{
    setLastBuCodeFinYearIdBranchId()
})

/*

*/