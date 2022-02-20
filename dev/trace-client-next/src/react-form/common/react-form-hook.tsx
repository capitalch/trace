import ReactForm from '../react-form'
import getNextId from '../core/form-id-generator'
import { manageFormsState } from '../core/fsm'
const artifacts: any = {}
/*
options:
    entityName: required,
    allFormTemplates: required :{

    },
    // following are optional parameters
    sharedArtifacts :{
        customControls: {}
        customMethods,
        formLevelValidators,
        itemLevelValidators,
        setLevelValidators,
        graphqlQueries
    },
    customComponents:{},
    customControls: {},
    componentStoreName:'',
    customMethods:{},
    formLevelValidators:{}
    itemLevelValidators:{}
    setLevelValidators:{}
    graphqlQueries:{}
    stylesheetFileName:''
*/
async function initialize(options: any = {}) {
    const { setUseIbuki } = manageFormsState()
    options.usingIbuki && setUseIbuki(options.usingIbuki) // passing the usingIbuki function to fsm (forms state manager)
    const entityName = options.entityName //required
    artifacts[entityName] || (artifacts[entityName] = {})

    const componentStoreName = options.componentStoreName || 'html-core'
    const componentStore = (
        await import(`../component-store/${componentStoreName}`)
    ).componentStore
    Object.assign(componentStore, options.customControls)
    options.sharedArtifacts &&
        Object.assign(componentStore, options.sharedArtifacts.customControls)
    let allForms = getAllForms(
        options.entityName,
        options.allFormTemplates,
        componentStore
    )

    artifacts[entityName].allForms = allForms
    artifacts[entityName].customMethods = {
        ...(artifacts[entityName].customMethods || {}),
        ...(options.customMethods || {}),
    }

    artifacts[entityName].formLevelValidators =
        options.formLevelValidators || {}
    artifacts[entityName].itemLevelValidators =
        options.itemLevelValidators || {}
    artifacts[entityName].setLevelValidators = options.setLevelValidators || {}
    artifacts[entityName].graphqlQueries = options.graphqlQueries || {}
    artifacts[entityName].customComponents = options.customComponents || {}
    if (options.sharedArtifacts) {
        Object.assign(
            artifacts[entityName].customMethods,
            options.sharedArtifacts.customMethods
        )
        Object.assign(
            artifacts[entityName].formLevelValidators,
            options.sharedArtifacts.formLevelValidators
        )
        Object.assign(
            artifacts[entityName].itemLevelValidators,
            options.sharedArtifacts.itemLevelValidators
        )
        Object.assign(
            artifacts[entityName].setLevelValidators,
            options.sharedArtifacts.setLevelValidators
        )
        Object.assign(
            artifacts[entityName].graphqlQueries,
            options.sharedArtifacts.graphqlQueries
        )
    }
    const entityName1 = entityName
        .replace(/([a-z])([A-Z])/g, '$1-$2')
        .toLowerCase()
    if (options.stylesheetFileName) {
        await import(
            `../../entities/${entityName1}/${options.stylesheetFileName}`
        )
    }
}

// async function registerCustomMethod(options: any) {}
function getAllForms(
    entityName: string,
    allFormTemplates: any,
    componentStore: any
) {
    const allForms: any = {} //eventually it contains all form components after processing
    function processFormObjects() {
        Object.keys(allFormTemplates).forEach((x) => {
            const formId = getNextId()
            allForms[x] = () => (
                <ReactForm
                    formId={formId}
                    jsonText={allFormTemplates[x]}
                    name={entityName}
                    componentStore={componentStore}></ReactForm>
            )
        })
    }
    allFormTemplates && processFormObjects()
    return allForms
}

function getArtifacts(entityName: string) {
    return artifacts[entityName]
}

export { getArtifacts, initialize }
