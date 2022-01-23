import { useState, useEffect } from 'react'
import { manageFormsState } from './fsm'

const Range = (props: any) => {
    const { formId, item, parent, componentStore, parentId } = props
    const controlId = parentId.concat('.', item.name) //unique controlId. It will always be same for same control
    const patternObj = JSON.parse(JSON.stringify(item.pattern))
    const [setsInRange, setSetsInRange]: any = useState([])
    const [, setRefresh] = useState({})
    const { initField, getUseIbuki } = manageFormsState()
    const usingIbuki = getUseIbuki()
    const { emit } = usingIbuki()

    useEffect(() => {
        initField(parent, item.name, [])
        if (parent[item.name].length === 0) {
            setSetsInRange([])
            add()
            window.scrollTo(0, 0)
        } else {
            if (setsInRange.length === 0) {
                for (let it of parent[item.name]) {
                    setsInRange.splice(0, 0, patternObj)
                }
                setSetsInRange([...setsInRange])
            }
        }
        //Go to end of page if a new item is added
        if (setsInRange.length > 1) {
            window.scrollTo(0, 9999)
        }
    }, [item.name])

    function add(index: number = setsInRange.length) {
        parent[item.name].splice(index, 0, {})
        const temp = setsInRange.splice(index, 0, patternObj)
        setSetsInRange([...temp])
        item.ibukiEmitMessage && emit(item.ibukiEmitMessage, '')
    }

    function minus(index: number) {
        let ret = false
        if (setsInRange.length === 1) {
            alert('Cannot delete the only element')
        } else if (setsInRange.length > 1) {
            setsInRange.splice(index, 1)
            // To delete a row from server in edit mode
            const deletedId = parent[item.name][index].id // In edit mode id value is not null
            if (deletedId) {
                parent['deletedIds'] || (parent['deletedIds'] = [])
                parent['deletedIds'].push(deletedId)
            }
            parent[item.name].splice(index, 1)
            setSetsInRange([...setsInRange])
            item.ibukiEmitMessage && emit(item.ibukiEmitMessage, '') // a trigger to denote that minus button is clicked
            ret = true
        }
        return ret
    }

    // fieldset
    return (
        <div className="x-range">
            {parent[item.name] &&
                parent[item.name].length > 0 &&
                setsInRange &&
                setsInRange.length > 0 &&
                setsInRange.map((ele: any, index: number) => {
                    const holder = parent[item.name][index]
                    ele.isRangeElement = true
                    const Tag = componentStore[ele.type]

                    return (
                        <div key={index}>
                            <Tag
                                name={props.name}
                                item={ele}
                                formId={formId}
                                parent={holder}
                                isRangeElement={true}
                                componentStore={componentStore}
                                parentId={controlId}
                                index={index}
                                idx={String(index)}
                                removeItem={minus}
                                isTable={item.layout === 'table'}
                                parentRefresh={() => setRefresh({})}
                                addItem={add}></Tag>
                        </div>
                    )
                })}
        </div>
    )
}
export { Range }
