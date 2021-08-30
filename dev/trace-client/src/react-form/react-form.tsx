import { useState, useEffect, useRef } from "react";
import clsx from 'clsx'
import { Set } from "./core/set";
import { Range } from "./core/range";
import { Wizard } from "./core/wizard";
import { Tabs } from "./core/tabs"
import { TabsMaterial } from "./core/tabs-material"
import { manageFormsState } from "./core/fsm";
import { ErrorDisplay } from './core/error-display';
import { validateJsonStructure } from './common/validate-json-structure'
import { componentStore as cmpStore } from './component-store/html-core'

interface ReactFormParams {
    arbitraryData?: any
    componentStore?: any
    dateFormat?: string
    formId: string
    initialValues?: any
    jsonText: string
    localMethods?: any
    localStore?: any
    name: string
    className? : string
}

function ReactForm(props: ReactFormParams) {
    
    const { arbitraryData, jsonText, formId, name, dateFormat, localMethods, initialValues, className } = props
    const componentStore = props.componentStore || cmpStore
    const { localStore } = props // localStore object has local controls provided. Thse are additionally search after html-core
    const [, doRefresh] = useState({})
    const { init, getFormData, setFormRefresh, setLocalMethods, getValidationFabric, setMetaData } = manageFormsState()
    const { registerFormValidators } = getValidationFabric()
    const isMounted = useRef(true)
    let formJson: any;
    Object.assign(componentStore, localStore)
    useEffect(() => {
        isMounted.current = true
        const doValidationsExist = formJson['validations'] && Array.isArray(formJson.validations) && (formJson.validations.length > 0)
        doValidationsExist && registerFormValidators(name, formId, formId, formJson, () => getFormData(formId))

        setFormRefresh(formId, () => {
            isMounted.current && doRefresh({});
        })

        return (() => {
            isMounted.current = false
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
            form = <div className={clsx(formJson.class, className)}>
                {/* show form tile only when title is present in json*/}                
                {formJson.items && formJson.items.map((item: any, index: number) => {
                    const Tag = componentStore[item.type]

                    if (initialValues /* && (Object.keys(initialValues).length > 0) */) {
                        item.value = initialValues[item.name]  // || item.value
                    }
                    let Comp =
                        <div key={index}>
                            <Tag key={index}
                                arbitraryData={arbitraryData}
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
        } catch (e:any) {
            form = <div style={{ color: 'red' }}>{e.message}</div>
        }
        return form
    }

    init(formId)
    if(localMethods){ // Do this only when form has come into existence
        setLocalMethods(formId, localMethods)
    }
    componentStore["Set"] = Set
    componentStore["Range"] = Range
    componentStore["Wizard"] = Wizard
    componentStore["Tabs"] = Tabs
    componentStore["TabsMaterial"] = TabsMaterial
    return getForm()
}

export default ReactForm;
/*

*/