import React, { useState, useEffect } from 'react'
import { useIbuki } from '../utils/ibuki'
import { getArtifacts } from '../react-form/common/react-form-hook'
import {graphqlService} from '../utils/graphql-service'
// import {} from '../'
import { manageEntitiesState } from '../utils/esm'
const TraceLoader = () => {
    const { filterOn } = useIbuki()
    const { setCurrentComponent, getCurrentEntity, getCurrentComponent, setCurrentFormId, getCurrentFormId } = manageEntitiesState()
    let [traceComponent, setTraceComponent]: any = useState({ componentName: 'empty', args: [] })
    const { queryGraphql }: any = graphqlService()
    const entityName = getCurrentEntity()
    const artifacts = getArtifacts(entityName)

    useEffect(() => {
        const subs = filterOn('LOAD-MAIN-COMPONENT-NEW').subscribe((d: any) => {
            if (d.data) {
                d.data && setCurrentComponent(d.data)
                setTraceComponent({ ...d.data }) // for forcing component reload
            }
        })
        const subs1 = filterOn('LOAD-MAIN-COMPONENT-VIEW').subscribe((d: any) => {
            setTraceComponent({ componentName: 'dataView' })
        })
        const subs2 = filterOn('LOAD-DATA-EDIT').subscribe((d: any) => {
            // console.log('1. id:', d.data)
            const currentFormId = getCurrentFormId()
            const headerId = d.data.headerId
            const currentComponent: any = getCurrentComponent()
            const traceComponentName = currentComponent.componentName
            if(headerId){
                const doQuery = async ()=>{
                    const entityName = getCurrentEntity()
                    const artifacts = getArtifacts(entityName)
                    const q = artifacts['graphqlQueries'][traceComponentName + '_edit'](headerId)
                    if(q){
                        const results = await queryGraphql(q)
                        // here using currentFormId and fsm set formData from results. So that form is populated for edit
                        // console.log(results)
                    }
                }
                doQuery()
            }
           
            setTraceComponent({ ...currentComponent })
        })
        subs.add(subs1).add(subs2)
        return (() => {
            subs.unsubscribe()
        })
    }, [])

    const Comp = () => {
        let ret = <div></div>
        
        const traceComponentName = traceComponent.componentName
        if (traceComponentName && artifacts && artifacts['allForms']) {
            if (artifacts['allForms'][traceComponentName]) {
                ret = artifacts['allForms'][traceComponent.componentName]()
            }
        }
        const children = ret.props.children
        const currentFormId = children && children.formId
        setCurrentFormId(currentFormId)
        return ret
    }
    return <Comp></Comp>
}

export { TraceLoader }

/*

    // setMounted()
    // const { setMounted, isMounted, resetMounted } = useMounted('TraceSelectedComponent')
    // if (isMounted()) {

    
*/