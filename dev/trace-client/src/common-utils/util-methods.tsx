import { manageFormsState } from '../react-form/core/fsm'
import { getArtifacts } from '../react-form/common/react-form-hook'
import { graphqlService } from './graphql-service'
import { manageEntitiesState } from './esm'
import { usingIbuki as getIbuki } from './ibuki'
import messages from '../messages.json'

const { emit } = getIbuki()

function utilMethods() {

  const { getCurrentEntity, getCurrentComponent, getLoginData, getFromBag } = manageEntitiesState()
  const artifacts = getArtifacts(getCurrentEntity())
  const { mutateGraphql, queryGraphql }: any = graphqlService()
  const { clearServerError, getValidationFabric, resetForm, showServerError
  } = manageFormsState()
  const { doValidateForm, isValidForm, } = getValidationFabric()

  interface GenericViewOptions {
    sqlKey?: string
    isMultipleRows: boolean
    entityName?: string
    args?: {}
  }
  async function execGenericView(options: GenericViewOptions) {
    let ret: any = undefined
    const currentEntityName = getCurrentEntity()
    const sqlQueryObject: any = escape(JSON.stringify({
      sqlKey: options.sqlKey
      , args: options.args || {}
      , isMultipleRows: options.isMultipleRows
    }))
    const entityNameDashed = getDashedEntityName(currentEntityName)
    const queries = await import(`../entities/${entityNameDashed}/artifacts/graphql-queries-mutations`)
    const q = queries.default['genericView'](sqlQueryObject, options.entityName || getCurrentEntity())
    try {
      if (q) {
        const result: any = await queryGraphql(q)
        ret = result.data[options.entityName || currentEntityName].genericView
      }
    } catch (error) {
      emit('SHOW-MESSAGE', { message: messages['errorInOperation'], severity: 'error', duration: null })
    }
    return ret
  }

  function extractAmount(s: string) {
    if (typeof (s) === 'string') {
      s = s.replace(/[^0-9.]/g, '') //remove any not digit but allow dot
    }
    return s
  }

  function getDashedEntityName(entityName: string) {
    return entityName.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()
  }

  function getDateMaskMap() {
    return {
      'DD/MM/YYYY': '99/99/9999'
      , 'MM/DD/YYYY': '99/99/9999'
      , 'YYYY-MM-DD': '9999-99-99'
    }
  }

  // By default if id is present in data, an insert sql is created at server otherwise an update sql is crested.
  // If you want to you updateCodeBlock and you don't have an id field in data then put a dummy id value in data. This will mimic the server not to generate an insert statement
  //idInsert property is used to allow value for id field to be inserted in table. In absence of this property in case value for id is present then it is considered as edit. idinsert forces to treat it as insert operation if id value is present
  // data: any, tableName: string, idInsert: boolean = false, deletedIds: any = undefined, updateCodeBlock: any = undefined
  /*
  options: {
    data: any[]!,
    updatCodeBlock: string?
    customCodeBlock: string?
    tableName: string!
    deletedIds: number[]?
    idInsert: boolean?
  , }
  */
  function getSqlObjectString(options: any) {
    const sqlObject: any = {}
    const dataClone = options.data ? JSON.parse(JSON.stringify(options.data)) : undefined
    dataClone && dataClone.__typename && (delete dataClone.__typename)
    options.updateCodeBlock && (sqlObject.updateCodeBlock = options.updateCodeBlock)
    options.customCodeBlock && (sqlObject.customCodeBlock = options.customCodeBlock)

    sqlObject.tableName = options.tableName
    options.deletedIds && (sqlObject.deletedIds = options.deletedIds)
    options.idInsert && (sqlObject.idInsert = true)
    sqlObject.data = dataClone
    return escape(JSON.stringify(sqlObject))
  }

  interface GenericUpdateMasterOptions {
    formId?: any
    , data?: {}
    , customCodeBlock?: string
    , updateCodeBlock?: string
    , entityName?: string
    , tableName?: string
    , setRefresh?: any
    , deletedIds?: number[]
    , idInsert?: boolean
  }
  async function genericUpdateMaster(options: GenericUpdateMasterOptions) {
    let ret: any = false
    const isDeleteMode = (options.deletedIds && Array.isArray(options.deletedIds) && (options.deletedIds.length > 0))
    const notIsDeleteMode = !isDeleteMode
    const currentEntityName = getCurrentEntity()
    try {
      const entityNameDashed = getDashedEntityName(currentEntityName)
      const queries = await import(`../entities/${entityNameDashed}/artifacts/graphql-queries-mutations`)
      notIsDeleteMode && clearServerError(options.formId)
      notIsDeleteMode && await doValidateForm(options.formId)
      if (isDeleteMode || isValidForm(options.formId)) {
        const sqlObjectString = getSqlObjectString(
          {
            data: options.data
            , customCodeBlock: options.customCodeBlock
            , updateCodeBlock: options.updateCodeBlock
            , tableName: options.tableName
            , deletedIds: options.deletedIds
            , idInsert: options.idInsert
          })
        const q = queries.default['genericUpdateMaster'](sqlObjectString, options.entityName || currentEntityName)
        const result = await mutateGraphql(q)
        ret = result.data[options.entityName || currentEntityName].genericUpdateMaster
        notIsDeleteMode && resetForm(options.formId)
      }
    } catch (error) {
      emit('SHOW-MESSAGE', { message: error.message || messages['errorInOperation'], severity: 'error', duration: null })
      ret = { message: error.message }
    }
    return ret
  }

  async function genericUpdateMasterNoForm(options: GenericUpdateMasterOptions) {
    let ret = false
    const currentEntityName = getCurrentEntity()
    try {
      const entityNameDashed = getDashedEntityName(currentEntityName)
      const queries = await import(`../entities/${entityNameDashed}/artifacts/graphql-queries-mutations`)
      const sqlObjectString = getSqlObjectString(
        {
          data: options.data
          , customCodeBlock: options.customCodeBlock
          , updateCodeBlock: options.updateCodeBlock
          , tableName: options.tableName
          , deletedIds: options.deletedIds
          , idInsert: options.idInsert
        })
      const q = queries.default['genericUpdateMaster'](sqlObjectString, options.entityName || currentEntityName)
      const result = await mutateGraphql(q)
      ret = result.data[options.entityName || currentEntityName].genericUpdateMaster
      if (ret) {
        emit('SHOW-MESSAGE', {})
      } else {
        throw new Error('')
      }
    } catch (error) {
      emit('SHOW-MESSAGE', { message: error.message || messages['errorInOperation'], severity: 'error', duration: null })
    }
    return ret
  }

  // If control is not found in permissions array then returns false, that means enabled
  function isControlDisabled(controlName: string) {
    const logindata = getLoginData()
    const permissions: any[] = logindata.permissions || []
    const control = permissions.find((item) => item.controlName === controlName)
    //For admin users all controls are visible
    let ret = logindata.userType === 'a' ? true : false
    if (control) {
      ret = control.isActive
    } else {
      ret = true // Controls which are not considered are active
    }
    return !ret
  }

  function objectPropsToDecimalFormat(obj: any) {
    for (const prop in obj) {
      obj[prop] = toDecimalFormat(obj[prop])
    }
  }

  function removeProp(obj: any, prop: string) {
    if (prop in obj) {
      delete obj[prop]
    }
  }

  interface SaveFormDataOptions {
    tableName?: string
    updateCodeBlock?: string
    customCodeBlock?: string
    deletedIds?: any[]
    idInsert?: boolean
    data?: any[]
  }

  interface SaveFormOptions {
    data: SaveFormDataOptions
    formId?: any
    queryId?: string
    afterMethod?: any
    formRefresh?: boolean
  }

  const saveForm = async (options: SaveFormOptions) => {
    emit('SHOW-LOADING-INDICATOR', true)
    options.queryId || (options.queryId = 'genericUpdateMasterDetails')
    options.afterMethod || (options.afterMethod = () => { })
    const json: any = escape(JSON.stringify(options.data))
    const currentEntityName = getCurrentEntity()
    let ret: any = {}
    try {
      const q = artifacts.graphqlQueries[options.queryId](json, currentEntityName)
      ret = await mutateGraphql(q)
      if (ret.error) {
        throw new Error(ret.error)
      }
      emit('SHOW-MESSAGE', {})
      options.formId && resetForm(options.formId)
      const mode = getCurrentComponent().mode
      if ((mode === 'new') && (options.formRefresh === undefined)) {
        emit('LOAD-MAIN-COMPONENT-NEW', getCurrentComponent()) // To reload the form for resetting all controls
      } else if (mode === 'edit') {
        emit('LOAD-MAIN-COMPONENT-VIEW', getCurrentComponent())
      }
      options.afterMethod()
    } catch (e) {
      options.formId && showServerError(options.formId, e.message)
      ret.error = e.message
      emit('SHOW-MESSAGE', { message: messages['errorInOperation'], severity: 'error', duration: null })
    }
    emit('SHOW-LOADING-INDICATOR', false)
    return ret
  }

  function toDecimalFormat(s: any) {
    s ?? (s = '')
    if (s === '') {
      return s
    }
    if (typeof s !== 'string') {
      s = String(s)
    }
    let ret: string = s
    const v = Number(s)
    if (!isNaN(v)) {
      ret = v.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')
    }
    return ret;
  }

  

  return {
    execGenericView,
    extractAmount,
    getDashedEntityName,
    getDateMaskMap,
    getSqlObjectString,
    genericUpdateMaster,
    genericUpdateMasterNoForm,
    isControlDisabled,
    objectPropsToDecimalFormat,
    removeProp,
    saveForm,
    toDecimalFormat,
  }
}
export { utilMethods }
/*

*/