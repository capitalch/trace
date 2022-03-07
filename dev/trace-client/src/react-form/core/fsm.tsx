import { getArtifacts } from '../common/react-form-hook'
import { builtinValidators } from "../common/builtin-item-level-validators"

const store: any = {}
function manageFormsState() {

    function clearServerError(id: string) {
        store[id]['allControls'][id].errors['serverError'] = undefined
        resetFormError(id)
    }

    // This only refreshes the form to show validation errors without refreshing the parent or entire window
    function doFormRefresh(id: string) {
        init(id);
        store[id].doFormRefresh();
    }

    function doFormReload(id: string) {
        store[id].doFormRefresh()
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

    function getCurrentFormName() {
        return store['currentForm']
    }

    function getDateValidatorFormat(id: string, controlId: string) {
        const pre = store?.[id]?.allControls?.[controlId]
        return pre ? store[id]['allControls'][controlId].dateValidatorFormat : undefined
    }

    function getField(parent: any, fieldName: string) {
        return parent[fieldName]
    }

    function getFromBag(id: string, propName: string) {
        return (store[id].bag[propName])
    }

    function getFormData(id: string) {
        const ret = store[id] ? store[id].formData : {}
        return ret
    }

    function getFormObject(id: string) {
        return store[id];
    }

    function getLocalMethods(id: string){
        return (store[id]['localMethods'])
    }

    function getMetaData(id: string) {
        return store[id].metaData
    }

    function getUseIbuki() {
        return store['usingIbuki']
    }

    function getValidationFabric() {
        function register(formId: string, controlId: string, item: any, getValue: any = null, validators: any[]) {
            const { validatorsRef } = init(formId, controlId)
            const validations: any[] = item.validations // from form json object

            for (let validation of validations) {
                validation.formId = formId
                validation.controlId = controlId
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
            const allControlsRef = store[formId]?.allControls || (store[formId].allControls = {})
            const controlRef = allControlsRef[controlId] || (allControlsRef[controlId] = {}) // returns value if exists or {}
            const validatorsRef: any[] = controlRef.validators || (controlRef.validators = [])// returns value if exists or []
            const errorsRef = controlRef?.errors || (controlRef.errors = {})
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

    function init(id: string) {
        if (id && (!store[id])) {
            store[id] = {}
            store[id].formData = {}
            store[id].bag = {} // this is a property bag
        }
    }

    // If field already there this does not change its value
    function initField(parent: any, fieldName: string, fieldValue: any) {
        if (!(fieldName in parent)) {
            parent[fieldName] = fieldValue;
        }
    }

    function resetAllFormErrors(id: string) {
        //reset all errors
        const allControls: any = store[id]?.allControls
        if (allControls) {
            for (const ctrl in allControls) {
                allControls[ctrl] && (allControls[ctrl].errors = {})
            }
        }
    }

    function releaseForm(id: string) {
        delete store[id]
    }

    function releaseFormResources(id: string) {
        store[id] = undefined
    }

    function resetAllValidators(id: string) {
        if (id && store[id] && store[id]['allControls']) {
            const allControls: any = store[id]['allControls']
            for (let control in allControls) {
                allControls[control].validators.length = 0
            }
        }
    }

    function resetControlsInSet(formId: string, setControlId: string) {
        const allControlsRef = store[formId].allControls
        for (let key in allControlsRef) {
            if (key.startsWith(setControlId)) {
                delete allControlsRef[key]
            }
        }
    }

    function resetForm(id: string) {
        if (id && store[id]) {
            store[id].formData = {}
            resetAllFormErrors(id)
            store[id].bag = {}
            resetAllValidators(id)
        }
    }

    function resetFormError(id: string) {
        store[id]['allControls'][id].errors['formError'] = undefined
    }

    function setCurrnetFormName(formName: string) {
        store['currentForm'] = formName
    }

    function setLocalMethods(id: string, localMethods: any){
        store[id]['localMethods'] = localMethods
    }

    function setDateValidatorFormat(id: string, controlId: string, dateValidatorFormat: string) {
        const pre = store?.[id]?.allControls?.[controlId]
        pre && (pre.dateValidatorFormat = dateValidatorFormat)
    }

    function setField(parent: any, fieldName: string, fieldValue: any) {
        parent[fieldName] = fieldValue;
    }

    function setFormRefresh(formId: string, f: any) {
        store[formId].doFormRefresh = f;
    }

    function setFormData(formId: string, dataObject: any) {
        store[formId] = store[formId] || {}
        store[formId]['formData'] = dataObject
    }

    function setFormError(id: string, message: string) {
        store[id]['allControls'][id].errors['formError'] = message
    }

    function setInBag(id: string, propName: string, propValue: any) {
        store[id].bag[propName] = propValue
    }

    function setMetaData(id: string, meta: any) {
        store[id].metaData = meta
    }

    function setUseIbuki(eb: any) {
        store['usingIbuki'] = eb
    }

    function showServerError(id: string, message: string) {
        store[id]['allControls'][id].errors['serverError'] = message
        doFormReload(id)
    }


    return {
        clearServerError, 
        doFormRefresh,
        doFormReload,
        getControlChildValidators, 
        getCurrentFormName, 
        getDateValidatorFormat,
        getField,
        getFormData,
        getFormObject, 
        getFromBag,
        getLocalMethods,
        getMetaData,
        getUseIbuki, 
        getValidationFabric,
        init, 
        initField,
        releaseForm,
        releaseFormResources,
        resetAllFormErrors, 
        resetAllValidators,
        resetControlsInSet,
        resetForm,
        resetFormError,
        setCurrnetFormName,  
        setDateValidatorFormat,
        setField, 
        setFormData,
        setFormError,
        setFormRefresh,
        setInBag, 
        setLocalMethods,
        setMetaData,
        setUseIbuki,
        showServerError,
    }
}
export { manageFormsState }

/*

*/