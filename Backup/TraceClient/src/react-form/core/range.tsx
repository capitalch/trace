import React, { useState, useEffect } from 'react';
import { manageFormsState } from "./fsm";

const Range =
    (props: any) => {
        const { formId, item, parent, componentStore, parentId } = props;
        const controlId = parentId.concat('.', item.name); //unique controlId. It will always be same for same control
        const patternObj = JSON.parse(JSON.stringify(item.pattern));
        const [setsInRange, setSetsInRange]: any = useState([])
        const [, setRefresh] = useState({})
        const { initField, getUseIbuki } = manageFormsState()
        const  useIbuki  = getUseIbuki()
        const { emit } = useIbuki()

        useEffect(() => {
            initField(parent, item.name, []);
            if (parent[item.name].length === 0) {
                setSetsInRange([])
                add()
            } else {
                if (setsInRange.length === 0) {
                    for (let it of parent[item.name]) {
                        setsInRange.splice(0, 0, patternObj)
                    }
                    setSetsInRange([...setsInRange])
                }
            }
        })

        function add(index: number = (setsInRange.length)) {
            parent[item.name].splice(index, 0, {})
            const temp = setsInRange.splice(index, 0, patternObj)
            // setSetsInRange([...setsInRange])
            setSetsInRange([...temp])
        }

        function minus(index: number) {
            if (setsInRange.length === 1) {
                alert('Cannot delete the only element');
                return;
            }
            if (setsInRange.length > 1) {
                setsInRange.splice(index, 1)
                // To delete a row from server in edit mode
                const deletedId = parent[item.name][index].id   // In edit mode id value is not null              
                if(deletedId){
                    parent['deletedIds'] || (parent['deletedIds'] = [])
                    parent['deletedIds'].push(deletedId)
                } 
                parent[item.name].splice(index, 1)
                setSetsInRange([...setsInRange])
                item.ibukiEmitMessage && emit(item.ibukiEmitMessage, '') // a trigger to denote that minus button is clicked
            }
        }

        // fieldset
        return <div className='x-range' >
            {/* <legend style={{ textAlign: 'right' }}>{item.label}&nbsp;&nbsp;&nbsp;<button onClick={
                e => {
                    e.preventDefault();
                    add();
                }}>+</button>
            </legend> */}
            {
                parent[item.name] && (parent[item.name].length > 0)
                && setsInRange && (setsInRange.length > 0) && setsInRange.map((ele: any, index: number) => {

                    const holder = parent[item.name][index];
                    ele.isRangeElement = true;
                    const Tag = componentStore[ele.type];

                    return <div key={index}>
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
                            addItem={add}>
                        </Tag>
                    </div>
                })
            }
        </div>
    }
export { Range };
/*

*/