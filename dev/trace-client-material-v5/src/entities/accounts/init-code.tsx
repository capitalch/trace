import moment from 'moment'
import { usingIbuki } from '../../common-utils/ibuki'
import { manageEntitiesState } from '../../common-utils/esm'
import { utilMethods } from '../../common-utils/util-methods'
import accountsMessages from './json/accounts-messages.json'
import datacache from '../../data/datacache.json'
import queries from './artifacts/graphql-queries-mutations'
import { graphqlService } from '../../common-utils/graphql-service'
// import { test } from '../accounts/test/functions'
import { usingLinkClient } from '../../common-utils/link-client'
const { emit, hotEmit } = usingIbuki()

function initCode() {
    const { getFromBag, getLoginData, setInBag } = manageEntitiesState()
    const { execGenericView } = utilMethods()
    const { connectToLinkServer, joinRoom, onReceiveData } = usingLinkClient()
    const { queryGraphql } = graphqlService()
    const isoDateFormat = 'YYYY-MM-DD'

    // these following two lines is for testing functions in application. Must remove from production build
    // const { testIsInvalidDate, testIsInvalidDate1 } = test()
    // testIsInvalidStateCode()

    async function setLastBuCodeFinYearIdBranchId(brId: any = undefined) {
        const userId = getLoginData().id
        const buCode = getLoginData().lastUsedBuCode
        //Uncomment following lines
        emit('SHOW-LOADING-INDICATOR', true)
        if (buCode) {
            setInBag('buCode', buCode)
            const branchId = brId || getLoginData().lastUsedBranchId
            await setNowFinYearIdDatesFinYearsBranches(branchId)
        } else {
            emit('LOAD-MAIN-JUST-REFRESH', '')
            emit('SHOW-MESSAGE', {
                message: accountsMessages['selectBusinessUnit'],
                severity: 'error',
                duration: null,
            })
        }

        emit('SHOW-LOADING-INDICATOR', false)

        // remove following lines
        // dummy()
    }

    function dummy() {
        const dateFormat = 'DD/MM/YYYY'
        setInBag('buCode', 'demounit1')
        const finYearObject: any = {
            finYearId: 2020,
            startDate: moment('2020-04-01').format(dateFormat),
            endDate: moment('2021-03-31').format(dateFormat),
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
        emit('LOAD-SUBHEADER-JUST-REFRESH', '')
        hotEmit('DATACACHE-SUCCESSFULLY-LOADED', datacache)
        emit('LOAD-MAIN-JUST-REFRESH', '')
        emit('LOAD-LEFT-MENU', '')
    }

    async function setNowFinYearIdDatesFinYearsBranches(branchId: number) {
        const nowDate = moment().format(isoDateFormat)

        // get configuration from server
        // const q = queries['genericQueryBuilder']({
        //     queryName: 'configuration',
        // })
        // const ret1 = await queryGraphql(q)
        // setInBag('configuration', ret1?.data?.accounts?.configuration)

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
            emit('LOAD-SUBHEADER-JUST-REFRESH', '')
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
        connectToLinkServer(linkServerUrl, undefined, linkServerKey).subscribe(
            (d: any) => {
                if (d.connected) {
                    const room = getRoom()
                    joinRoom(room)
                    onReceiveData().subscribe((d: any) => {
                        if (
                            d.message ===
                            'TRACE-SERVER-MASTER-DETAILS-UPDATE-DONE'
                        ) {
                            emit('VOUCHER-UPDATED-REFRESH-REPORTS', null)
                        }
                    })
                }
            }
        )

        setInBag('allSettings', allSettings)
        setInBag('generalSettings', generalSettings)
        setInBag('auditLockDate', generalSettings?.auditLockDate || '')
        setInBag('allAccounts', allAccounts)
        hotEmit('DATACACHE-SUCCESSFULLY-LOADED', dataCache)
        emit('DATACACHE-SUCCESSFULLY-LOADED', dataCache)
        emit('LOAD-MAIN-JUST-REFRESH', '')
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
