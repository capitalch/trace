import gql from 'graphql-tag'

const graphqlQueries: any = {
  basicQueryForSelect: (arg: string) => gql`
    query q {
            ${arg} {
                label
                value
            }
        }`

  , dataCache: gql`
        query {
        sampleForms{
          cities{
            label
            value
          }
          states{
            label
            value
          }
        }
  }`
}


export default graphqlQueries