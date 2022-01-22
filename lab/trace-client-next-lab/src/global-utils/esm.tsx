const store: any = {}
function manageEntitiesState() {
    
    function setCurrentEntity(entityName:string){
        store.currentEntity = entityName
        if(!store[entityName]){
            store[entityName] = {}
        } 
        store[entityName]['bag'] = store[entityName]['bag'] || {} // prevents resetting of the bag
        store['loginData'] = store['loginData'] || {}
    }

    function resetCurrentEntity(){
        store.currentEntity= undefined
    }

    function getLoginData(){
        return store['loginData'] || {}
    }

    function setLoginData(loginData:any){
        store['loginData'] = loginData
    }

    function getCurrentEntity() {
        return store.currentEntity
    }

    function getCurrentComponent(){
        const ent = getCurrentEntity()
        let currentComponent:any = undefined
        ent && (currentComponent = store[ent].component)
        return currentComponent
    }

    function setCurrentComponent(component:any){
        store[getCurrentEntity()] && (store[getCurrentEntity()].component = component)
    }

    function setCurrentFormId(id:string){
        store['currentFormId'] = id
    }

    function getCurrentFormId(){
        return store['currentFormId']
    }

    function getFromBag(propName:string){
        const cEntity = getCurrentEntity()
        let ret = undefined
        cEntity && (ret = store[cEntity]['bag'][propName])
        return ret
    }

    function setInBag(propName:string, propValue:any){
        store[getCurrentEntity()]['bag'][propName] = propValue
    }

    function resetBag(){
        store[getCurrentEntity()]['bag'] = {}
    }
    
    return { setCurrentEntity, getCurrentEntity, 
        getCurrentComponent, setCurrentComponent
        , getCurrentFormId, setCurrentFormId, getFromBag, setInBag
        , getLoginData, setLoginData, resetCurrentEntity
        , resetBag
    }
}

export { manageEntitiesState }