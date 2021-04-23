import { getArtifacts } from '../common/react-form-hook'
import { builtinValidators } from "../common/builtin-item-level-validators"

const store: any = {}
function manageFormsState() {
    function init(id: string) {
        if (id && (!store[id])) {
            store[id] = {}
            store[id].formData = {}
            store[id].bag = {} // this is a property bag
        }
    }


    function resetForm(id: string) {
        if (id && store[id]) {
            store[id].formData = {}
            resetFormErrors(id)
            store[id].bag = {}
            resetAllValidators(id)
        }
    }

    // function setDateFormat(id:string, dateFormat: string){
        
    // }

    function resetAllValidators(id: string) {
        if (id && store[id] && store[id]['allControls']) {
            const allControls: any = store[id]['allControls']
            for (let control in allControls) {
                // delete allControls[control].validators
                allControls[control].validators.length = 0
            }
        }
    }

    function releaseForm(id: string) {
        delete store[id]
    }

    function setInBag(id: string, propName: string, propValue: any) {
        store[id].bag[propName] = propValue
    }

    function getFromBag(id: string, propName: string) {
        return (store[id].bag[propName])
    }

    function setMetaData(id: string, meta: any) {
        store[id].metaData = meta
    }

    function getMetaData(id: string) {
        return store[id].metaData
    }

    function resetFormErrors(id: string) {
        //reset all errors
        const allControls: any = store[id]?.allControls
        if (allControls) {
            for (const ctrl in allControls) {
                allControls[ctrl] && (allControls[ctrl].errors = {})
            }
        }
    }

    function setCurrnetFormName(formName: string) {
        store['currentForm'] = formName
    }

    function getCurrentFormName() {
        return store['currentForm']
    }

    function setFormData(formId: string, dataObject: any) {
        store[formId] = store[formId] || {}
        store[formId]['formData'] = dataObject
    }

    function getValidationFabric() {
        function register(formId: string, controlId: string, item: any, getValue: any = null, validators: any[]) {
            const { validatorsRef } = init(formId, controlId)
            const validations: any[] = item.validations // from form json object

            for (let validation of validations) {
                if (validators[validation.name]) {
                    const validationMethod = validators[validation.name]
                    const wrapperFunc = () => validationMethod(validation, getValue(), putErrors) //getValue() gets value of the control at run time
                    validatorsRef.push(wrapperFunc) //wrapper func does not require any parameter
                }
            }

            function putErrors(key: string, value: string) {
                const { errorsRef } = init(formId, controlId)
                errorsRef[key] = value || undefined
            }
        }

        function registerItemValidators(entityName: string, formId: string, controlId: string, item: any, getValue: any = () => { }) {
            const itemLevelValidators = getArtifacts(entityName).itemLevelValidators
            const allItemValidators = { ...builtinValidators, ...itemLevelValidators }
            register(formId, controlId, item, getValue, allItemValidators)
        }

        function registerSetValidators(entityName: string, formId: string, controlId: string, item: any, getValue: any = () => { }) {
            const setValidators = getArtifacts(entityName).setLevelValidators
            register(formId, controlId, item, getValue, setValidators)
        }

        function registerFormValidators(entityName: string, formId: string, controlId: string, item: any, getValue: any = () => { }) {
            const formValidators = getArtifacts(entityName).formLevelValidators
            register(formId, controlId, item, getValue, formValidators)
        }

        function init(formId: string, controlId: string) {
            const allControlsRef = store[formId].allControls || (store[formId].allControls = {})
            const controlRef = allControlsRef[controlId] || (allControlsRef[controlId] = {}) // returns value if exists or {}
            const validatorsRef: any[] = controlRef.validators || (controlRef.validators = [])// returns value if exists or []
            const errorsRef = controlRef.errors || (controlRef.errors = {})
            return { controlRef, validatorsRef, errorsRef, allControlsRef }
        }

        async function doValidateControl(formId: string, controlId: string) {
            const { validatorsRef } = init(formId, controlId)
            for (let v of validatorsRef) {
                await v()
            }
        }

        async function doValidateForm(formId: string) {
            const allObjects: any[] = Object.values(store[formId].allControls)
            for (let item of allObjects) { // item can be undefined if a row is deleted from a range
                const isValidatorsExist = item && item.validators && Array.isArray(item.validators) && (item.validators.length > 0)
                if (isValidatorsExist) {
                    for (let v of item.validators) {
                        await v()
                    }
                }
            }
        }

        function isValidForm(formId: string) {
            let ret = false
            const allObjects: any[] = Object.values(store[formId].allControls)
            for (let item of allObjects) { // item can be undefined if a row is deleted from a range
                ret = item && item.errors && Object.values(item.errors).some(x => x !== undefined)
                if (ret) {
                    break
                }
            }
            return (!ret)
        }

        function getItemErrors(formId: string, controlId: string): any[] {
            const { errorsRef } = init(formId, controlId)
            return Object.values(errorsRef)
        }

        function resetItemErrors(formId: string, controlId: string) {
            let { controlRef } = init(formId, controlId)
            controlRef.errors = {}
        }

        return ({
            init, doValidateControl, getItemErrors, doValidateForm, isValidForm
            , registerItemValidators, registerSetValidators, registerFormValidators,
            resetItemErrors
        })
    }

    function resetControlsInSet(formId: string, setControlId: string) {
        const allControlsRef = store[formId].allControls
        for (let key in allControlsRef) {
            if (key.startsWith(setControlId)) {
                allControlsRef[key] = undefined
            }
        }
    }

    function releaseFormResources(id: string) {
        store[id] = undefined
    }

    function setFormRefresh(formId: string, f: any) {
        store[formId].doFormRefresh = f;
    }

    function doFormRefresh(id: string) {
        init(id);
        store[id].doFormRefresh();
    }

    function doFormReload(id: string) {
        store[id].doFormRefresh()
    }

    function getFormData(id: string) {
        return store[id].formData;
    }

    function getFormObject(id: string) {
        return store[id];
    }

    function setField(parent: any, fieldName: string, fieldValue: any) {
        parent[fieldName] = fieldValue;
    }

    // If field already there this does not change its value
    function initField(parent: any, fieldName: string, fieldValue: any) {
        if (!(fieldName in parent)) {
            parent[fieldName] = fieldValue;
        }
    }

    function getControlChildValidators(id: string, controlId: string) {
        const allValidators = Object.keys(store[id].validators)
        const validators: any = []
        allValidators.forEach(x => {
            if (x.startsWith(controlId)) {
                validators.push(store[id].validators[x])
            }
        })
        return validators
    }

    function showServerError(id: string, message: string) {
        store[id]['allControls'][id].errors['serverError'] = message
        doFormReload(id)
    }

    function clearServerError(id: string) {
        store[id]['allControls'][id].errors['serverError'] = undefined
    }

    function setUseIbuki(eb: any) {
        store['useIbuki'] = eb
    }

    function getUseIbuki() {
        return store['useIbuki']
    }


    return {
        init, getFormObject, getFormData, setFormRefresh, doFormRefresh, resetForm, getControlChildValidators
        , setField, initField, doFormReload, getUseIbuki, setUseIbuki, releaseFormResources, getValidationFabric
        , resetControlsInSet, showServerError, clearServerError, getCurrentFormName, setCurrnetFormName
        , setFormData, resetFormErrors, setInBag, getFromBag
        , getMetaData, setMetaData, releaseForm, resetAllValidators
    }
}
export { manageFormsState };

/*

    // function registerServerError(id: string, refreshMethod: (x: any) => {}) {
    //     store[id]['serverError'] = refreshMethod
    // }


    // function setSetsInRange(id: string, setsInRange: any[]) {
    //     store[id] || (store[id] = {})
    //     store[id].setsInRange = setsInRange
    // }
*/