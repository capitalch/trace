import { ApolloClient, ApolloLink, InMemoryCache, HttpLink } from 'apollo-boost'
import { urlJoin } from '../imports/regular-imports'
import { manageEntitiesState } from '../imports/trace-imports'
import { config } from '../config'

const clientStore: any = {}
const graphqlService = () => {
    const { getLoginData, getFromBag } = manageEntitiesState()

    const getUrl = () => {
        let ur
        const env: any = process.env.NODE_ENV
        if (env === 'development') {
            ur = config.graphql[env]
        } else {
            ur = window.location.href
        }
        const url = urlJoin(ur, 'graphql')
        return url
    }

    const getClient = () => {
        const url = getUrl()
        const link = new HttpLink({
            uri: url,
        })
        const authLink = new ApolloLink((operation, forward) => {
            // Retrieve the authorization token from local storage.
            const loginData = getLoginData()
            let token: any = undefined
            if (loginData) {
                token = loginData.token
            }
            const buCode = getFromBag('buCode') || ''
            const finYearId = getFromBag('finYearObject')?.finYearId || ''
            const branchId = getFromBag('branchObject')?.branchId || ''
            const selectionCriteria = buCode.concat(
                ':',
                finYearId,
                ':',
                branchId
            )
            // Use the setContext method to set the HTTP headers.
            operation.setContext({
                headers: {
                    authorization: token ? `Bearer ${token}` : '',
                    'SELECTION-CRITERIA': selectionCriteria,
                },
            })
            // Call the next link in the middleware chain.
            return forward(operation)
        })

        clientStore['client'] = new ApolloClient({
            cache: new InMemoryCache(),
            link: authLink.concat(link),
            defaultOptions: {
                query: {
                    fetchPolicy: 'network-only',
                },
            },
        })
        clientStore['client'].request = (operation: any) => {
            const token = 'abcd'
            operation.setContext({
                headers: {
                    authorization: token ? `Bearer ${token}` : '',
                },
            })
        }
        return clientStore['client']
    }
    const queryGraphql = async (q: string) => {
        const client = getClient()
        let ret: any
        try {
            ret = await client.query({
                query: q,
            })
        } catch (e:any) {
            console.log(e)
            let err = String(e)
            if(err.includes(':')){
                const arr = err.split(':')
                e.message = arr.pop()
            }
            throw(e)
        }
        return ret
    }

    const mutateGraphql = async (m: string,) => {
        const client = getClient()

        const ret = await client.mutate({
            mutation: m,
        })
        return ret
    }

    return { queryGraphql, mutateGraphql }
}

export { graphqlService }
