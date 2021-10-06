import { createContext } from 'react'

const userProfileContext = createContext({})

const UserProfileProvider = userProfileContext.Provider
export { UserProfileProvider, userProfileContext }
