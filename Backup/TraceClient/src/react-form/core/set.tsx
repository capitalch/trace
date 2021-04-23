import React, { useEffect, useState } from 'react';
import { ErrorDisplay } from './error-display';
import { manageFormsState } from "./fsm";

const Set =
    (props: any) => {
        const { isTable, parent, item, idx, parentId, formId, isRangeElement, componentStore, index, removeItem, addItem } = props
        const { initField, getValidationFabric, resetControlsInSet } = manageFormsState()
        const idx1 = idx || ''// to convert undefined to ''. Otherwise undefined word is appended to item.name while calling setValidators()
        const controlId = parentId.concat('.', item.name, idx1)
        const [,setRefresh] = useState({})
        const { registerSetValidators } = getValidationFabric()
        let dataObject: any = {}
        const items: any[] = item.items
        const validations = item.validations
        const doValidationsExist = validations && Array.isArray(validations) && (validations.length > 0)
        if (isRangeElement) {
            dataObject = parent
            //     dataObject = parent[index]
            // } else {
            //     dataObject = parent
            // }

        } else {
            initField(parent, item.name, {})
            dataObject = parent[item.name]
        }

        function showLabel() {
            let ret = true
            if (isRangeElement) {
                if ((index > 0) && isTable) {
                    ret = false
                }
            }
            return ret
        }

        useEffect(() => {
            if (doValidationsExist) {
                registerSetValidators(props.name, formId, controlId, item, () => dataObject)
            }
            // const formObj = getFormObject(formId)
        })

        function getMinusButton() {
            const button = <button className="x-minus" onClick={(e) => {
                // e.preventDefault()
                removeItem && removeItem(index)
                // all the controls whose names start with this set controlId are made undefined
                resetControlsInSet(formId,controlId) 
            }}>--</button>
            return button
        }

        function getAddButton() {
            const button = <button className="x-add" onClick={(e) => {
                // e.preventDefault();
                addItem && addItem(index + 1)
            }}>+</button>
            return button
        }

        function getAddMinusButtons() {
            return <div className="x-add-minus">
                {showLabel() && <div><label style={{ fontSize: '0.7em' }}>{'Add/Rem'}</label></div>}
                {getAddButton()}
                {getMinusButton()}
            </div>
        }

        // const fieldset = false

        return (
            <div style={{ margin: '0px', padding: '0px', display: (props.show === undefined) || (props.show) ? 'block' : 'none' }}>
                {item.label && <label>{item.label}</label>}
                <div className={item.class || 'x-set'} >
                    {
                        items.map((it: any, ind: number) => {

                            const Tag = componentStore[it.type]
                            return (
                                <div key={ind} className={it.class}>
                                    <Tag
                                        name={props.name} // entity name
                                        item={it}
                                        formId={formId}
                                        parent={dataObject}
                                        componentStore={componentStore}
                                        idx={idx}
                                        showLabel={showLabel()}
                                        index={index}
                                        parentId={controlId}
                                        parentRefresh = {()=>setRefresh({})}
                                        ></Tag>
                                </div>
                            )
                        })
                    }
                    <div>
                        {props.isRangeElement ? getAddMinusButtons() : null}
                    </div>
                </div>
                <ErrorDisplay formId={formId} controlId={controlId}></ErrorDisplay>
            </div>
        )
    }

export { Set };

/*

// const setLevelValidators = getArtifacts(props.name).setLevelValidators
// const [errors, setErrors]: any = useState({})
// setValidators(formId, controlId, validateAll)

// function putErrors(key: string, value: string) {
//     errors[key] = value || undefined; //undefined value will not be displayed by ErrorDisplay
//     const isAnyError = Object.values(errors).some(v => v !== undefined)
//     setControlErrors(formId, controlId, (isAnyError || undefined))
//     setErrors({ ...errors })
// }

// async function validateAll() {
//     if (validations && Array.isArray(validations) && (validations.length > 0)) {
//         for (let a of validations) {
//             await setLevelValidators[a.name].call(null, a, dataObject, putErrors)
//         }
//     }
// }

*/