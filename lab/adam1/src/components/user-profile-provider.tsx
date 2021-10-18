import { createContext } from "react"
const UserProfileContext = createContext({})
const CounterContext = createContext(0)
const UserProfileProvider = UserProfileContext.Provider

export {UserProfileContext, UserProfileProvider, CounterContext}