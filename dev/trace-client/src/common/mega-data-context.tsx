import { createContext } from '../imports/regular-imports'
const MegaDataContext = createContext<any>({})
interface KeyWithMethod {
    (key: string, method: (params?:any) => void): void
}
interface KeyWithParams {
    (key: string, params?: any): void
}
interface IMegaData {
    accounts: any, keysWithMethods: any, registerKeyWithMethod: KeyWithMethod, executeMethodForKey: KeyWithParams
}
export { MegaDataContext, type IMegaData }