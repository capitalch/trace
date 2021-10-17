import gql from 'graphql-tag'

const graphqlQueries: any = {

  accountsUpdateOpBal: (arg: any, entityName: string) => {
    const str = `
    mutation accountsUpdateOpBal {
      ${entityName} {
        accountsUpdateOpBal(value:"${arg}")
      }
    }`
    return gql(str)
  }

}

export default graphqlQueries

/*

*/