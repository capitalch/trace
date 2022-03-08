import {
    getArtifacts,
    graphqlService,
    manageEntitiesState,
    manageFormsState,
    usingIbuki as getIbuki,
} from '../imports/trace-imports'
import { Typography } from '@mui/material'
import messages from '../messages.json'
const { emit } = getIbuki()

function utilMethods() {
    const { getCurrentEntity, getCurrentComponent, getLoginData, } =
        manageEntitiesState()
    const artifacts = getArtifacts(getCurrentEntity())
    const { mutateGraphql, queryGraphql }: any = graphqlService()
    const {
        clearServerError,
        getValidationFabric,
        resetForm,
        showServerError,
    } = manageFormsState()
    const { doValidateForm, isValidForm } = getValidationFabric()

    interface GenericViewOptions {
        sqlKey?: string
        isMultipleRows: boolean
        entityName?: string
        args?: {}
    }
    
    async function execGenericView(options: GenericViewOptions) {
        let ret: any = undefined
        const currentEntityName = getCurrentEntity()
        const sqlQueryObject: any = escape(
            JSON.stringify({
                sqlKey: options.sqlKey,
                args: options.args || {},
                isMultipleRows: options.isMultipleRows,
            })
        )
        const entityNameDashed = getDashedEntityName(currentEntityName)
        const queries = await import(
            `../entities/${entityNameDashed}/artifacts/graphql-queries-mutations`
        )
        const q = queries.default['genericView'](
            sqlQueryObject,
            options.entityName || getCurrentEntity()
        )
        try {
            if (q) {
                const result: any = await queryGraphql(q)
                ret =
                    result.data[options.entityName || currentEntityName]
                        .genericView
            }
        } catch (error) {
            emit('SHOW-MESSAGE', {
                message: messages['errorInOperation'],
                severity: 'error',
                duration: null,
            })
        }
        return ret
    }

    function extractAmount(s: string) {
        if (typeof s === 'string') {
            s = s.replace(/[^0-9.]/g, '') //remove any not digit but allow dot
        }
        return s
    }

    function getDashedEntityName(entityName: string) {
        return entityName.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()
    }

    function getDateMaskMap() {
        return {
            'DD/MM/YYYY': '99/99/9999',
            'MM/DD/YYYY': '99/99/9999',
            'YYYY-MM-DD': '9999-99-99',
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
        const dataClone = options.data
            ? JSON.parse(JSON.stringify(options.data))
            : undefined
        dataClone && dataClone.__typename && delete dataClone.__typename
        options.updateCodeBlock &&
            (sqlObject.updateCodeBlock = options.updateCodeBlock)
        options.customCodeBlock &&
            (sqlObject.customCodeBlock = options.customCodeBlock)
        options.insertCodeBlock &&
            (sqlObject.insertCodeBlock = options.insertCodeBlock)

        sqlObject.tableName = options.tableName
        options.deletedIds && (sqlObject.deletedIds = options.deletedIds)
        options.idInsert && (sqlObject.idInsert = true)
        sqlObject.data = dataClone
        return escape(JSON.stringify(sqlObject))
    }

    interface GenericUpdateMasterOptions {
        formId?: any
        data?: {}
        customCodeBlock?: string
        insertCodeBlock?: string
        updateCodeBlock?: string
        entityName?: string
        tableName?: string
        setRefresh?: any
        deletedIds?: number[]
        idInsert?: boolean
    }
    async function genericUpdateMaster(options: GenericUpdateMasterOptions) {
        let ret: any = false
        const isDeleteMode =
            options.deletedIds &&
            Array.isArray(options.deletedIds) &&
            options.deletedIds.length > 0
        const notIsDeleteMode = !isDeleteMode
        const currentEntityName = getCurrentEntity()
        try {
            const entityNameDashed = getDashedEntityName(currentEntityName)
            const queries = await import(
                `../entities/${entityNameDashed}/artifacts/graphql-queries-mutations`
            )
            notIsDeleteMode && clearServerError(options.formId)
            notIsDeleteMode && (await doValidateForm(options.formId))
            if (isDeleteMode || isValidForm(options.formId)) {
                const sqlObjectString = getSqlObjectString({
                    data: options.data,
                    customCodeBlock: options.customCodeBlock,
                    insertCodeBlock: options.insertCodeBlock,
                    updateCodeBlock: options.updateCodeBlock,
                    tableName: options.tableName,
                    deletedIds: options.deletedIds,
                    idInsert: options.idInsert,
                })
                const q = queries.default['genericUpdateMaster'](
                    sqlObjectString,
                    options.entityName || currentEntityName
                )
                const result = await mutateGraphql(q)
                ret =
                    result.data[options.entityName || currentEntityName]
                        .genericUpdateMaster
                notIsDeleteMode && resetForm(options.formId)
            }
        } catch (error: any) {
            console.log(error)
            emit('SHOW-MESSAGE', {
                message: messages['errorInOperation'],
                severity: 'error',
                duration: null,
            })
            ret = { message: error.message }
            throw(error)
        }
        return ret
    }

    interface DataOptions {
        tableName?: string
        updateCodeBlock?: string
        customCodeBlock?: string
        deletedIds?: any[]
    }

    interface DataDetailsOption {
        tableName: string
        fkeyName?: string
        data: DataOptions[]
        details?: DataDetailsOption[]
    }
    async function genericUpdateMasterDetails(options: DataDetailsOption[]) {
        emit('SHOW-LOADING-INDICATOR', true)
        const json: any = escape(JSON.stringify(options))
        // console.log(JSON.stringify(options))
        const currentEntityName = getCurrentEntity()
        let ret: any = {}
        try {
            const q = artifacts.graphqlQueries['genericUpdateMasterDetails'](
                json,
                currentEntityName
            )
            ret = await mutateGraphql(q)
            if (ret.error) {
                throw new Error(ret.error)
            }
            emit('SHOW-MESSAGE', {})
        } catch (e: any) {
            ret.error = e.message
            emit('SHOW-MESSAGE', {
                message: messages['errorInOperation'],
                severity: 'error',
                duration: null,
            })
        }
        emit('SHOW-LOADING-INDICATOR', false)
        return ret
    }

    async function genericUpdateMasterNoForm(
        options: GenericUpdateMasterOptions
    ) {
        let ret = false
        const currentEntityName = getCurrentEntity()
        try {
            const entityNameDashed = getDashedEntityName(currentEntityName)
            const queries = await import(
                `../entities/${entityNameDashed}/artifacts/graphql-queries-mutations`
            )
            const sqlObjectString = getSqlObjectString({
                data: options.data,
                customCodeBlock: options.customCodeBlock,
                insertCodeBlock: options.insertCodeBlock,
                updateCodeBlock: options.updateCodeBlock,
                tableName: options.tableName,
                deletedIds: options.deletedIds,
                idInsert: options.idInsert,
            })
            const q = queries.default['genericUpdateMaster'](
                sqlObjectString,
                options.entityName || currentEntityName
            )
            const result = await mutateGraphql(q)
            ret =
                result.data[options.entityName || currentEntityName]
                    .genericUpdateMaster
            if (ret) {
                emit('SHOW-MESSAGE', {})
            } else {
                throw new Error('')
            }
        } catch (error: any) {
            emit('SHOW-MESSAGE', {
                message: error.message || messages['errorInOperation'],
                severity: 'error',
                duration: null,
            })
        }
        return ret
    }

    // If control is not found in permissions array then returns false, that means enabled
    function isControlDisabled(hierarchy: string) {
        const logindata = getLoginData()
        const permissions: any[] = logindata.permissions || []
        const control = permissions.find(
            (item) => item.hierarchy === hierarchy
        )
        //For admin users all controls are visible
        let ret = logindata.userType === 'a' ? true : false
        if (control) {
            ret = control.isActive
        } else {
            ret = true // Controls which are not considered are active
        }
        return !ret
    }

    function Mandatory(){
        return <Typography variant='subtitle2' sx={{color:'red'}} component='span'> *</Typography>
    }

    function numberToWordsInRs(value: any) {
        var fraction = Math.round(frac(value) * 100)
        var f_text = ''

        if (fraction > 0) {
            f_text = 'AND ' + convert_number(fraction) + ' PAISE'
        }

        return convert_number(value) + ' RUPEE ' + f_text + ' ONLY'

        function frac(f: any) {
            return f % 1
        }

        function convert_number(number: any) {
            if (number < 0 || number > 999999999) {
                return 'NUMBER OUT OF RANGE!'
            }
            var Gn = Math.floor(number / 10000000) /* Crore */
            number -= Gn * 10000000
            var kn = Math.floor(number / 100000) /* lakhs */
            number -= kn * 100000
            var Hn = Math.floor(number / 1000) /* thousand */
            number -= Hn * 1000
            var Dn = Math.floor(number / 100) /* Tens (deca) */
            number = number % 100 /* Ones */
            var tn = Math.floor(number / 10)
            var one = Math.floor(number % 10)
            var res = ''

            if (Gn > 0) {
                res += convert_number(Gn) + ' CRORE'
            }
            if (kn > 0) {
                res += (res === '' ? '' : ' ') + convert_number(kn) + ' LAKH'
            }
            if (Hn > 0) {
                res += (res === '' ? '' : ' ') + convert_number(Hn) + ' THOUSAND'
            }

            if (Dn) {
                res += (res === '' ? '' : ' ') + convert_number(Dn) + ' HUNDRED'
            }

            let ones = [
                '',
                'ONE',
                'TWO',
                'THREE',
                'FOUR',
                'FIVE',
                'SIX',
                'SEVEN',
                'EIGHT',
                'NINE',
                'TEN',
                'ELEVEN',
                'TWELVE',
                'THIRTEEN',
                'FOURTEEN',
                'FIFTEEN',
                'SIXTEEN',
                'SEVENTEEN',
                'EIGHTEEN',
                'NINETEEN'
            ]
            let tens = [
                '',
                '',
                'TWENTY',
                'THIRTY',
                'FOURTY',
                'FIFTY',
                'SIXTY',
                'SEVENTY',
                'EIGHTY',
                'NINETY'
            ]

            if (tn > 0 || one > 0) {
                if (!(res === '')) {
                    res += ' AND '
                }
                if (tn < 2) {
                    res += ones[tn * 10 + one]
                } else {
                    res += tens[tn]
                    if (one > 0) {
                        res += '-' + ones[one]
                    }
                }
            }

            if (res === '') {
                res = 'zero'
            }
            return res
        }
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
        insertCodeBlock?: string
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
            const q = artifacts.graphqlQueries[options.queryId](
                json,
                currentEntityName
            )
            ret = await mutateGraphql(q)
            if (ret.error) {
                throw new Error(ret.error)
            }
            emit('SHOW-MESSAGE', {})
            options.formId && resetForm(options.formId)
            const mode = getCurrentComponent().mode
            if (mode === 'new' && options.formRefresh === undefined) {
                emit('LAUNCH-PAD:LOAD-COMPONENT', getCurrentComponent()) // To reload the form for resetting all controls
            }
            options.afterMethod()
        } catch (e: any) {
            options.formId && showServerError(options.formId, e.message)
            ret.error = e.message
            emit('SHOW-MESSAGE', {
                message: messages['errorInOperation'],
                severity: 'error',
                duration: null,
            })
        }
        emit('SHOW-LOADING-INDICATOR', false)
        return ret
    }

    async function sendEmail(value: any) {
        let ret = false
        const currentEntityName = getCurrentEntity()
        try {
            const queries = await import(
                `../entities/${currentEntityName}/artifacts/graphql-queries-mutations`
            )

            const q = queries.default['sendEmail'](value, currentEntityName)
            const result = await mutateGraphql(q)
            ret = result.data[currentEntityName].sendEmail
            if (ret) {
                emit('SHOW-MESSAGE', {})
            } else {
                throw new Error('')
            }
        } catch (error: any) {
            emit('SHOW-MESSAGE', {
                message: error.message || messages['errorInOperation'],
                severity: 'error',
                duration: null,
            })
        }
        return ret
    }

    async function sendSms(value: any) {
        let ret = false
        const currentEntityName = getCurrentEntity()
        try {
            const queries = await import(
                `../entities/${currentEntityName}/artifacts/graphql-queries-mutations`
            )

            const q = queries.default['sendSms'](value, currentEntityName)
            const result = await mutateGraphql(q)
            ret = result.data[currentEntityName].sendSms
            if (ret) {
                emit('SHOW-MESSAGE', {})
            } else {
                throw new Error('')
            }
        } catch (error: any) {
            emit('SHOW-MESSAGE', {
                message: error.message || messages['errorInOperation'],
                severity: 'error',
                duration: null,
            })
        }
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
        return ret
    }

    return {
        execGenericView,
        extractAmount,
        getDashedEntityName,
        getDateMaskMap,
        getSqlObjectString,
        genericUpdateMaster,
        genericUpdateMasterDetails,
        genericUpdateMasterNoForm,
        isControlDisabled,
        Mandatory,
        numberToWordsInRs,
        objectPropsToDecimalFormat,
        removeProp,
        saveForm,
        sendEmail,
        sendSms,
        toDecimalFormat,
    }
}

export { utilMethods }
