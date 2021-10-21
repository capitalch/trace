import {customControls} from './custom-controls'
// import {customMethods} from './custom-methods'
import {formLevelValidators} from './form-level-validators'
import {graphqlQueries} from './graphql-queries-mutations'
import {itemLevelValidators} from './item-level-validators'
import {setLevelValidators} from './set-level-validators'

const sharedArtifacts = {
    customControls: customControls
    // , customMethods: customMethods
    , formLevelValidators: formLevelValidators
    , graphqlQueries: graphqlQueries
    , itemLevelValidators: itemLevelValidators
    , setLevelValidators: setLevelValidators
}

export {sharedArtifacts}