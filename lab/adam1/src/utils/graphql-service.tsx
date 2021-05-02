import { ApolloClient, InMemoryCache, HttpLink } from 'apollo-boost'
// import urlJoin from 'url-join'

// import config from '../config.json'

const clientStore: any = {}
const graphqlService = () => {

    const getUrl = () => {
        // const env: string = process.env.NODE_ENV
        // const graphql: any = config.graphql
        const url = 'http://localhost:5000/graphql' //urlJoin(graphql[env], graphql.endPoint)
        return url
    }

    const getClient = () => {
        if (!clientStore['client']) {
            const url = getUrl()
            const link = new HttpLink({
                uri: url
            })
            clientStore['client'] = new ApolloClient({
                cache: new InMemoryCache(), link: link, defaultOptions: {
                    query: {
                        fetchPolicy: 'network-only'
                    }
                }
            })
        }
        return clientStore['client']
    }

    const queryGraphql = async (q: string) => {
        const client = getClient()
        // client.stop()
        const ret = await client.query({
            query: q
        })

        return ret
    }

    const queryGraphqlPromise = (q: string) => {
        const client = getClient()
        return client.query({
            query: q
        })
    }

    const mutateGraphql = async (m: string) => {
        const client = getClient()
        const ret = await client.mutate({
            mutation: m
        })
        return ret
    }

    return { queryGraphql, mutateGraphql, queryGraphqlPromise }
}


export { graphqlService }
/*

        // if (!clients[entityName]) {
            // clients[entityName] =
*/