import React, { useState } from 'react'
import { VCR } from './vcr'
import { getArtifacts } from '../common/react-form-hook'
import { manageFormsState } from "./fsm"

const Wizard = (props: any) => {
    const { formId, item, parent, componentStore, parentId } = props;
    const { 
        // clearServerError, 
        // doValidate, 
        initField, getControlChildValidators, 
        // resetValidators, isValidForm 
    } = manageFormsState();
    const controlId = parentId.concat('.', item.name); //unique controlId. It will always be same for same control

    let [currentItemIndex, setCurrentItemIndex] = useState(0)
    const itemCount = item.items.length
    const currentItem = item.items[currentItemIndex]
    const isMethodNameExists = currentItem.methodName

    async function toProceed() {
        let toProceed = false
        const controlChildValidators = getControlChildValidators(formId, controlId);
        if (controlChildValidators.length > 0) {
            for (let v of controlChildValidators) {
                await v()
            }
            // if (isValidForm(formId)) {
            //     toProceed = true
            // }
        } else {
            toProceed = true
        }
        return toProceed
    }

    async function next() {
        const ok = await toProceed()
        if (ok) {
            currentItemIndex++
            // resetValidators(formId, controlId)
            setCurrentItemIndex(currentItemIndex)
        }
    }

    function prev() {
        if (currentItemIndex !== 0) {
            currentItemIndex = currentItemIndex -1
            // resetValidators(formId, controlId)
            setCurrentItemIndex(currentItemIndex)
        }
    }
    /* methodName is used for both save and submit operations. For each page the methodName exists at page level,
    which can be used for save operations. For submit the methodName exists at wizard level.
    */
    async function save() {
        const ok = await toProceed()
        if (ok) {
            const methodName = currentItem.methodName;
            const customMethods = getArtifacts(props.name)['customMethods']
            if (methodName && customMethods[methodName]) {
                await customMethods[methodName](formId)
            }
        }
    }

    async function submit() {
        // const ok = await toProceed()
        // if (ok) {
        // clearServerError(formId)
        // await doValidate(formId)
        // if (isValidForm(formId)) {
        //     const methodName = item.methodName // This methodName at wizard level
        //     const customMethods = getArtifacts(props.name)['customMethods']
        //     if (methodName && customMethods[methodName]) {
        //         const ret = await customMethods[methodName](formId)
        //         console.log(ret)
        //         if (!ret.error) {
        //             setCurrentItemIndex(0)
        //         }
        //     }
        // }
        // }
    }

    function getButtonStatus() {
        const status = { p: 0, s: 0, n: 0, u: 0 }
        if (itemCount === 1) {
            status['u'] = 1 //only submit
        } else if (currentItemIndex === 0) { // first page
            isMethodNameExists && (status['s'] = 1)
            status['n'] = 1
        } else if ((currentItemIndex > 0) && (currentItemIndex !== (itemCount - 1))) { // between first and last page
            status['p'] = 1
            status['s'] = isMethodNameExists
            status['n'] = 1
        } else { // last page
            status['p'] = 1
            status['u'] = 1
        }
        return status
    }

    initField(parent, item.name, [])
    if (parent[item.name].length === 0) {
        for (let i = 1; i <= itemCount; i++) {
            parent[item.name].push({})
        }
    }

    const Tag = componentStore[currentItem.type]
    const holder = parent[item.name][currentItemIndex]

    return <>
        <Tag
            name={props.name} //entity name
            item={currentItem}
            formId={formId}
            parent={holder}
            componentStore={componentStore}
            parentId={controlId}
        ></Tag>
        <VCR prev={prev} save={save} next={next} submit={submit} status={getButtonStatus()}></VCR>
    </>
}


export { Wizard }