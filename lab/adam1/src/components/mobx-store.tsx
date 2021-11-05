import { action, observable } from 'mobx'
import {createContext} from 'react'

class MobxStore {
    @observable count: number = 0

    @action incr: any = () => {
        this.count++
    }
}

const mobxStoreInstance = new MobxStore()
const MobxStoreContext = createContext({})
// const MobXProvider = ()=><MobxStoreContext.Provider value = {mobxStoreInstance} />
export {MobxStoreContext, mobxStoreInstance}