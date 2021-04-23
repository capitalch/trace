import gql from 'graphql-tag'
import { manageEntitiesState } from '../common-utils/esm'

const { getCurrentEntity } = manageEntitiesState()
const graphqlQueries: any = {

  // downloadFile: (value: any, entityName: string = 'authentication') => gql`
  // query downloadFile {
  //   ${entityName} {
  //     downloadFile(value:"${value}")
  // }}`

  genericUpdateMaster: (arg: any, entityName: string) => {
    const str = `
    mutation genericUpdateMaster {
      ${entityName} {
        genericUpdateMaster(value:"${arg}")
      }
    }`
    return gql(str)
  }

  , genericUpdateMasterDetails: (arg: any, entityName: string) => {
    const str = `
    mutation genericUpdateMasterDetails {
     ${entityName} {
      genericUpdateMasterDetails(value:"${arg}")
     }
    }`
    return gql(str)
  }

  , genericView: (value: GenericViewValues, entityName: string = 'authentication') => gql`
    query genericView {
      ${entityName} {
          genericView(value:"${value}")
  }}`

  , genericQueryBuilder: (options: GenericQueryBuilderOptions) => {
    function logic() {
      let ret: any
      if (options.args && (Object.keys(options.args).length > 0)) {
        ret = `(value:"${options.args}")`
      } else {
        ret = ''
      }
      return ret
    }
    const str = `
    ${options.queryType || 'query'} ${options.queryName} {
      ${options.entityName || getCurrentEntity()} {
        ${options.queryName} ${logic()}
      }
    }`
    return gql(str)
  }
}

export { graphqlQueries }

interface GenericViewValues {
  sqlKey: string
  isMultipleRows: boolean
  args: any[]
}

interface GenericQueryBuilderOptions {
  queryName: string
  queryType?: string // query / mutation
  args?: any
  entityName?: string
}
