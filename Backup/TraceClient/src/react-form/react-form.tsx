import React, { useState, useEffect, useRef } from "react";
import { Set } from "./core/set";
import { Range } from "./core/range";
import { Wizard } from "./core/wizard";
import { Tabs } from "./core/tabs"
import { manageFormsState } from "./core/fsm";
import { ErrorDisplay } from './core/error-display';
import { validateJsonStructure } from './common/validate-json-structure';
import {componentStore as cmpStore} from './component-store/html-core'

function ReactForm(props: any) {
    const { jsonText, formId, name, dateFormat } = props
    const componentStore = props.componentStore || cmpStore
    const [, doRefresh] = useState({})
    const { init, getFormData, setFormRefresh, getValidationFabric, setMetaData } = manageFormsState()
    const { registerFormValidators } = getValidationFabric()
    const isMounted = useRef(true)
    let formJson: any;

    useEffect(() => {
        isMounted.current = true
        const doValidationsExist = formJson['validations'] && Array.isArray(formJson.validations) && (formJson.validations.length > 0)
        doValidationsExist && registerFormValidators(name, formId, formId, formJson, () => getFormData(formId))
        setFormRefresh(formId, () => {
            isMounted.current && doRefresh({});
        })

        return (() => {
            isMounted.current = false
            //release form resources
            // releaseFormResources(formId)
            // console.log('1. releasing resources')
        })
    }, [])

    function getForm() {       
        let form
        try {
            formJson = jsonText ? JSON.parse(jsonText) : {};
            const metaData = formJson.metaData
            if (metaData && Object.keys(metaData).length > 0) {
                setMetaData(formId, metaData)
            }
            const jsonError = validateJsonStructure(formId, formJson, componentStore, name);
            if (jsonError) { throw new Error(jsonError) }
            form = <div className={formJson.class}>
                <div className="x-form-title">{formJson.title}</div>
                {formJson.items && formJson.items.map((item: any, index: number) => {
                    const Tag = componentStore[item.type];
                    let Comp =
                        <div key={index}>
                            <Tag key={index}
                                name={name} //entityName
                                item={item}
                                formId={formId}
                                parent={getFormData(formId)}
                                componentStore={componentStore}
                                parentRefresh={() => isMounted.current && doRefresh({})}
                                parentId={formId}
                                dateFormat={dateFormat}
                            ></Tag>
                        </div>
                    return Comp;
                })}
                <ErrorDisplay
                    formId={formId}
                    controlId={formId}
                    isFormErrorDisplay={true}>
                </ErrorDisplay>
            </div>
        } catch (e) {
            form = <div style={{ color: 'red' }}>{e.message}</div>
        }
        return form
    }

    init(formId)
    componentStore["Set"] = Set;
    componentStore["Range"] = Range;
    componentStore["Wizard"] = Wizard;
    componentStore["Tabs"] = Tabs;
    return getForm()
}

export default ReactForm;
/*

*/