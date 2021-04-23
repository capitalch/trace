const store: any = {}

function useGlobal() {


    function subscribe(sourceName: string, keyName: string, func: Function) {
        const sub = store[keyName]['subscriptions']
        sub[sourceName] = func
        // store[keyName]['subscriptions'] = {
        //     [sourceName]: func
        // }
    }

    function unsubscribe(sourceName: string, ) {

    }

    function registerEntry(keyName: string, keyValue: any) {
        store[keyName] = { value: keyValue, subscriptions: {} }
    }

    function setValue(keyName: string, keyValue: any) {
        store[keyName].value = keyValue
        const obj = store[keyName].subscriptions
        const entries: any[] = Object.values(obj)
        for (let func of entries) {
            func()
        }
    }

    function getValue(keyName:string){
        return store[keyName].value
    }

    return {getValue, setValue, subscribe, unsubscribe, registerEntry }
}

export { useGlobal }