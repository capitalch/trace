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
  },
  saleInvoiceView: (value: GenericViewValues, entityName: string ) => gql`
    query saleInvoiceView {
      ${entityName} {
        saleInvoiceView(value:"${value}")
  }}`

}

interface GenericViewValues {
  sqlKey: string
  isMultipleRows: boolean
  args: any[]
}

export default graphqlQueries

/*

*/