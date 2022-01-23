import {customControls} from './custom-controls'
import {formLevelValidators} from './form-level-validators'
import {graphqlQueries} from './graphql-queries-mutations'
import {itemLevelValidators} from './item-level-validators'
import {setLevelValidators} from './set-level-validators'

const sharedArtifacts = {
    customControls: customControls
    , formLevelValidators: formLevelValidators
    , graphqlQueries: graphqlQueries
    , itemLevelValidators: itemLevelValidators
    , setLevelValidators: setLevelValidators
}

export {sharedArtifacts}