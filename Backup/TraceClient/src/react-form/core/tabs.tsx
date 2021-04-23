import React, { useState } from 'react'
import { getArtifacts } from '../common/react-form-hook'
import { manageFormsState } from "./fsm"

const Tabs = (props: any): any => {
    const { formId, item, parent, componentStore, parentId } = props;
    const {
        // registerServerError, clearServerError, 
        // doValidate, 
        initField
        // getControlChildValidators, resetValidators, 
        // isValidForm 
    } = manageFormsState();
    const controlId = parentId.concat('.', item.name); //unique controlId. It will always be same for same control

    let [activeItemIndex, setActiveItemIndex] = useState(0)
    const itemCount = item.items.length
    // const activeItem = item.items[activeItemIndex]

    //HTML button is used for implementation of tabs
    const TabButtons: any = () => <div className=''>
        {
            (itemCount > 0) && (item.items.map((it: any, index: number) => {
                const isActive = index === activeItemIndex                
                return <button 
                    className= {'x-tab-button ' + (isActive ? 'x-tab-button-active' : '')}
                    key={index} onClick={e => { setActiveItemIndex(index) }}>{it.label}</button>
            }))

        }
    </div>

    async function submit() {
        // clearServerError(formId)
        // await doValidate(formId)
        // if (isValidForm(formId)) {
            const methodName = item.methodName // This methodName at wizard level
            const customMethods = getArtifacts(props.name)['customMethods']
            if (methodName && customMethods[methodName]) {
                const ret = await customMethods[methodName](formId)
                // console.log(ret)
                if (!ret.error) {
                    setActiveItemIndex(0)
                }
            }
        // } else {
            // registerServerError(formId,item.errorMessage)
        // }
        // }
    }

    function init() {
        initField(parent, item.name, [])
        if (parent[item.name].length === 0) {
            for (let i = 1; i <= itemCount; i++) {
                parent[item.name].push({})
            }
        }
        // const Tag = componentStore[activeItem.type]
        // const holder = parent[item.name][activeItemIndex]
        // return {Tag, holder}
    }
    // const res = 
    init()

    return <div>
        <TabButtons></TabButtons>
        {
            item.items.map((it: any, index: number) => {
                const holder = parent[item.name][index]
                const Tag = componentStore[it.type]
                return <Tag key={index}
                    name={props.name} //entity name
                    item={it}
                    formId={formId}
                    parent={holder}
                    componentStore={componentStore}
                    parentId={controlId}
                    show={index === activeItemIndex}
                ></Tag>
            })
        }
        {/* <res.Tag
            name={props.name} //entity name
            item={activeItem}
            formId={formId}
            parent={res.holder}
            componentStore={componentStore}
            parentId={controlId}
        ></res.Tag> */}
        <button className="x-submit" onClick={e => { submit() }}>Submit</button>
    </div>
}

export { Tabs }