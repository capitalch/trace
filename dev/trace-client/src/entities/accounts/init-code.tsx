import moment from 'moment'
import { usingIbuki } from '../../global-utils/ibuki'
import { manageEntitiesState } from '../../global-utils/esm'
import { utilMethods } from '../../global-utils/misc-utils'
import accountsMessages from './json/accounts-messages.json'
import queries from './artifacts/graphql-queries-mutations'
import { graphqlService } from '../../global-utils/graphql-service'
// import { MegaContext } from './components/common/mega-context' 
// import { usingLinkClient } from '../../global-utils/link-client'
// import { useAdminManageRoles } from '../authentication/components/admin-manage-roles-hook' // to be removed
const { emit, hotEmit } = usingIbuki()

function initCode() {
    const { getFromBag, getLoginData, setInBag } = manageEntitiesState()
    const { execGenericView } = utilMethods()
    // const { connectToLinkServer, joinRoom, onReceiveData } = usingLinkClient()
    const { queryGraphql } = graphqlService()
    const isoDateFormat = 'YYYY-MM-DD'

    // these following two lines is for testing functions in application. Must remove from production build
    // const { testIsInvalidDate, testIsInvalidDate1 } = test()
    // testIsInvalidStateCode()
    // const { getPermissionsAsJson } = useAdminManageRoles()

    // const base = await getPermissionsAsJson('base')
    // const operator = await getPermissionsAsJson('operator')
    // const accountant = await getPermissionsAsJson('accountant')
    // const manager = await getPermissionsAsJson('manager')

    async function setLastBuCodeFinYearIdBranchId(brId: any = undefined) {
        // const userId = getLoginData().id
        const buCode = getLoginData().lastUsedBuCode

        //Uncomment following lines
        emit('SHOW-LOADING-INDICATOR', true)
        if (buCode) {
            setInBag('buCode', buCode)
            const branchId = brId || getLoginData().lastUsedBranchId
            await setNowFinYearIdDatesFinYearsBranches(branchId)
        } else {
            emit('TRACE-MAIN:JUST-REFRESH', '')
            emit('SHOW-MESSAGE', {
                message: accountsMessages['selectBusinessUnit'],
                severity: 'error',
                duration: null,
            })
        }
        emit('SHOW-LOADING-INDICATOR', false)

        // comment following line
        // await dummy()
    }

    async function dummy() {
        const dateFormat = 'DD/MM/YYYY'
        setInBag('buCode', 'demounit1')
        const finYearObject: any = {
            finYearId: 2021,
            startDate: moment('2021-04-01').format(dateFormat),
            endDate: moment('2022-03-31').format(dateFormat),
        }
        setInBag('finYearObject', finYearObject)
        setInBag('dateFormat', dateFormat)
        // set brancObject and branches
        const branchId = 1
        setInBag('branchObject', {
            branchId: branchId,
            branchName: 'main',
            branchCode: 'main',
        })

        emit('LOAD-LEFT-MENU', '')
        // Remove following line. This loads the journals by default
        emit('TRACE-SUBHEADER:JUST-REFRESH', '')
        emit('TRACE-MAIN:JUST-REFRESH', '')
        await execDataCache()
    }

    async function setNowFinYearIdDatesFinYearsBranches(branchId: number) {
        const nowDate = moment().format(isoDateFormat)

        const ret = await execGenericView({
            sqlKey: 'getJson_finYears_branches_nowFinYearIdDates_generalSettings',
            isMultipleRows: false,
            args: {
                nowDate: nowDate,
            },
            entityName: 'accounts',
        })
        if (ret) {
            // set finYearObject and finYears
            const pre = ret?.jsonResult
            const generalSettings = pre?.generalSettings
            const dateFormat = generalSettings?.dateFormat || isoDateFormat
            const fObject = pre?.nowFinYearIdDates
            const finYearId = fObject.finYearId
            if (!finYearId) {
                emit('SHOW-MESSAGE', {
                    message: accountsMessages['finYearNotPresent'],
                    severity: 'error',
                    duration: null,
                })
                return
            }
            const finYearObject: any = {
                finYearId: finYearId,
                startDate: moment(fObject.startDate).format(dateFormat),
                endDate: moment(fObject.endDate).format(dateFormat),
                isoStartDate: fObject.startDate,
                isoEndDate: fObject.endDate,
            }
            setInBag('finYearObject', finYearObject)
            setInBag('finYears', pre.finYears)
            setInBag('dateFormat', dateFormat)

            // set brancObject and branches
            if (!pre.branches || pre.branches.length === 0) {
                emit('SHOW-MESSAGE', {
                    message: accountsMessages['branchesNotDefined'],
                    severity: 'error',
                    duration: null,
                })
                return
            }
            const branches: any[] = pre.branches
            setInBag('branches', pre.branches)

            branchId = branchId || branches[0].branchId
            const branch = pre.branches.find(
                (x: any) => x.branchId === branchId
            )
            const branchName = branch?.branchName
            const branchCode = branch?.branchCode
            setInBag('branchObject', {
                branchId: branchId,
                branchName: branchName,
                branchCode: branchCode,
            })
            emit('TRACE-SUBHEADER:JUST-REFRESH', '')
            await execDataCache()
        } else {
            emit('SHOW-MESSAGE', {
                message: accountsMessages['errorFinYearsBranches'],
                severity: 'error',
                duration: null,
            })
        }
    }

    async function execDataCache() {
        const ret: any = await execGenericView({
            sqlKey: 'getJson_datacache',
            isMultipleRows: false,
            entityName: 'accounts',
        })
        const dataCache = ret?.jsonResult
        const allSettings: any[] = dataCache?.allSettings

        let generalSettings: any
        const item = allSettings.find((item) => item.key === 'generalSettings')
        item && (generalSettings = item?.jData)
        const allAccounts = dataCache?.allAccounts

        const q = queries['genericQueryBuilder']({
            queryName: 'configuration',
        })
        const ret1 = await queryGraphql(q)
        setInBag('configuration', ret1?.data?.accounts?.configuration)

        // connect to link-server
        const configuration = getFromBag('configuration')
        const { linkServerUrl, linkServerKey } = configuration
        console.log('linkServerUrl:', linkServerUrl)

        setInBag('allSettings', allSettings)
        const info = allSettings.find((item) => item.key === 'unitInfo')
        const unitInfo = info?.jData
        setInBag('unitInfo', unitInfo)
        
        setInBag('generalSettings', generalSettings)
        setInBag('auditLockDate', generalSettings?.auditLockDate || '')
        setInBag('allAccounts', allAccounts)
        hotEmit('DATACACHE-SUCCESSFULLY-LOADED', dataCache)
        emit('DATACACHE-SUCCESSFULLY-LOADED', dataCache)
        emit('TRACE-MAIN:JUST-REFRESH', '')
        emit('LOAD-LEFT-MENU', '')
        function getRoom() {
            const clientId = getLoginData()?.clientId
            const buCode = getFromBag('buCode')
            const { finYearId } = getFromBag('finYearObject') || ''
            const { branchId } = getFromBag('branchObject') || ''
            const room = `${String(
                clientId
            )}:${buCode}:${finYearId}:${branchId}`
            return room
        }
    }

    return { setLastBuCodeFinYearIdBranchId, execDataCache }
}

export { initCode }
