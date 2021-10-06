import gql from 'graphql-tag'

const graphqlQueries: any = {
    allocateEntitiesToClients: (value: any) => gql`
    mutation allocateEntitiesToClients {
        authentication {
            allocateEntitiesToClients(value:"${value}")
    }}`,

    allocateUsersToEntities: (value: any) => gql`
    mutation allocateUsersToEntities {
        authentication {
            allocateUsersToEntities(value:"${value}")
        }
    }`,

    changePwd: (credentials: string) => gql`
    mutation changePwd {
        authentication {
            changePwd(credentials:"${credentials}")
    }}`,

    createBuInEntity: (value: any) => gql`
    mutation createBuInEntity {
        authentication {
            createBuInEntity(value:"${value}")
    }}`,

    createClient: (value: any) => gql`
    mutation createClient {
        authentication {
            createClient(value:"${value}")
    }}`,

    createUser: (value: string) => gql`
    mutation createUser {
        authentication {
            createUser(value:"${value}")
    }}`,

    doLogin: (credentials: any) => gql`
    query login {
        authentication {
        doLogin(credentials:"${credentials}")
    }}`,

    forgotPwd: (value: any) => gql`
    query forgotPwd {
        authentication {
            forgotPwd(value:"${value}")
    }}`,

    getUsers: (value: any) => gql`
    query getUsers {
        authentication {
            getUsers(value:"${value}"){
                id
                uid
                userEmail
                userName
                isActive
                parentId
                descr
    }}}`,
}
export default graphqlQueries
