import { useEffect, useState } from 'react'
import { IconButton } from '@material-ui/core'
import Add from '@material-ui/icons/AddCircle'
import RemoveCircleOutline from '@material-ui/icons/Cancel'
import { ErrorDisplay } from './error-display'
import { manageFormsState } from './fsm'

const Set = (props: any) => {
    const {
        arbitraryData,
        isTable,
        parent,
        item,
        idx,
        parentId,
        formId,
        isRangeElement,
        componentStore,
        index,
        removeItem,
        addItem,
    } = props
    const {
        initField,
        getValidationFabric,
        resetControlsInSet,
    } = manageFormsState()
    const idx1 = idx || '' // to convert undefined to ''. Otherwise undefined word is appended to item.name while calling setValidators()
    const controlId = parentId.concat('.', item.name, idx1)
    const [, setRefresh] = useState({})
    const { registerSetValidators } = getValidationFabric()
    let dataObject: any = {}
    const items: any[] = item.items
    const validations = item.validations
    const doValidationsExist =
        validations && Array.isArray(validations) && validations.length > 0
    if (isRangeElement) {
        dataObject = parent
    } else {
        initField(parent, item.name, {})
        dataObject = parent[item.name]
    }

    function showLabel() {
        let ret = true
        if (isRangeElement) {
            if (index > 0 && isTable) {
                ret = false
            }
        }
        return ret
    }

    useEffect(() => {
        if (doValidationsExist) {
            registerSetValidators(
                props.name,
                formId,
                controlId,
                item,
                () => dataObject
            )
        }
    })

    function getMinusButton() {
        const button = (
            <IconButton
                className="x-minus"
                onClick={(e:any) => {
                    const ret = removeItem && removeItem(index)
                    // all the controls whose names start with this set controlId are made undefined
                    ret && resetControlsInSet(formId, controlId)
                }}>
                <RemoveCircleOutline className="x-minus-icon" color="error"></RemoveCircleOutline>
            </IconButton>
        )
        return button
    }

    function getAddButton() {
        const button = (
            <IconButton
                className="x-add"
                onClick={(e:any) => {
                    addItem && addItem(index + 1)
                }}>
                <Add className="x-add-icon" color="secondary"></Add>
            </IconButton>
        )
        return button
    }

    function getAddMinusButtons() {
        return (
            <div className="x-add-minus">
                {getMinusButton()}
                {getAddButton()}
            </div>
        )
    }

    return (
        <div
            style={{
                margin: '0px',
                padding: '0px',
                display:
                    props.show === undefined || props.show ? 'block' : 'none',
            }}>
            {item.label && (
                <label className={item.titleClass || 'x-set-title'}>
                    {item.label}
                    {index || index === 0 ? '(' + (index + 1) + ') ' : ''}
                </label>
            )}
            <div className={item.class || 'x-set'}>
                {items.map((it: any, ind: number) => {
                    const Tag = componentStore[it.type]
                    return (
                        <div key={ind} className={it.class}>
                            <Tag
                                arbitraryData={arbitraryData}
                                name={props.name} // entity name
                                item={it}
                                formId={formId}
                                parent={dataObject}
                                componentStore={componentStore}
                                idx={idx}
                                showLabel={showLabel()}
                                index={index}
                                parentId={controlId}
                                parentRefresh={() => setRefresh({})}></Tag>
                        </div>
                    )
                })}
                <div className="x-add-minus-container">
                    {props.isRangeElement ? getAddMinusButtons() : null}
                </div>
            </div>
            <ErrorDisplay formId={formId} controlId={controlId}></ErrorDisplay>
        </div>
    )
}

export { Set }

/*
 */
