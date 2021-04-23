import React, { useEffect, useState, useRef } from 'react'
import moment from 'moment'
import { useIbuki } from '../../common-utils/ibuki'
import { manageFormsState } from '../../react-form/core/fsm'
import { getArtifacts } from '../../react-form/common/react-form-hook'
import { manageEntitiesState } from '../../common-utils/esm'
import { graphqlService } from '../../common-utils/graphql-service'
import { utilMethods } from '../../common-utils/util-methods'
import globalMessages from '../../messages.json'
import accountsMessages from './accounts-messages.json'
import { utils } from './utils'
import queries from './artifacts/graphql-queries-mutations'

const { filterOn, emit, hotEmit } = useIbuki()

function initCode() {
    const { getLoginData, getCurrentEntity, setInBag, getFromBag} = manageEntitiesState()
    const { getUnitHeading } = utils()
    const { execGenericView } = utilMethods()
    // const { queryGraphql, mutateGraphql } = graphqlService()
    const { getDashedEntityName } = utilMethods()
    const { resetAllValidators, clearServerError, resetForm, getFormData, showServerError, getValidationFabric } = manageFormsState()
    const { isValidForm, doValidateForm } = getValidationFabric()
    const isoDateFormat = 'YYYY-MM-DD'
    
    async function setLastBuCodeFinYearIdBranchId(brId: any = undefined) {
        emit('SHOW-SUBHEADER-BUSY', true)
        const userId = getLoginData().id
        const authEntityName = 'authentication'

        const ret = await execGenericView({
            sqlKey: 'get_lastBuCode_finYearId_branchId'
            , isMultipleRows: false
            , args: {
                userId: userId
            }
            , entityName: authEntityName
        })
        if (ret) {
            const buCode = ret.lastUsedBuCode
            if (buCode) {
                setInBag('buCode', buCode)
                const branchId = brId || ret.lastUsedBranchId
                setNowFinYearIdDatesFinYearsBranches(branchId)
            } else {
                emit('SHOW-MESSAGE', { message: accountsMessages['selectBusinessUnit'], severity: 'error', duration: null })
            }
        } else {
            emit('SHOW-MESSAGE', { message: accountsMessages['selectBusinessUnit'], severity: 'error', duration: null })
        }
    }

    async function setNowFinYearIdDatesFinYearsBranches(branchId: number) {
        const nowDate = moment().format(isoDateFormat)
        const ret = await execGenericView({
            sqlKey: 'getJson_finYears_branches_nowFinYearIdDates_generalSettings'
            , isMultipleRows: false
            , args: {
                nowDate: nowDate
            }
            , entityName: 'accounts'
        })
        if (ret) {
            // set finYearObject and finYears
            const pre = ret?.jsonResult
            const generalSettings = pre?.generalSettings
            const dateFormat = generalSettings?.dateFormat || isoDateFormat
            const fObject = pre?.nowFinYearIdDates
            const finYearId = fObject.finYearId
            if (!finYearId) {
                emit('SHOW-MESSAGE', { message: accountsMessages['finYearNotPresent'], severity: 'error', duration: null })
                return
            }
            const finYearObject: any = {
                finYearId: finYearId
                , startDate: moment(fObject.startDate).format(dateFormat)
                , endDate: moment(fObject.endDate).format(dateFormat)
            }
            setInBag('finYearObject', finYearObject)
            setInBag('finYears', pre.finYears)
            setInBag('dateFormat', dateFormat)

            // set brancObject and branches
            if ((!pre.branches) || (pre.branches.length === 0)) {
                emit('SHOW-MESSAGE', { message: accountsMessages['branchesNotDefined'], severity: 'error', duration: null })
                return
            }
            const branches: any[] = pre.branches
            setInBag('branches', pre.branches)

            branchId = branchId || branches[0].branchId
            const branch = pre.branches.find((x: any) => x.branchId === branchId)
            const branchName = branch?.branchName
            const branchCode = branch?.branchCode
            // const branchName = pre.branches.find((x: any) => x.branchId === branchId)?.branchName
            setInBag('branchObject', { branchId: branchId, branchName: branchName, branchCode: branchCode })
            emit('LOAD-SUBHEADER-JUST-REFRESH', '')
            await execDataCache()
        } else {
            emit('SHOW-MESSAGE', { message: accountsMessages['errorFinYearsBranches'], severity: 'error', duration: null })
        }
    }

    async function execDataCache() {
        const ret: any = await execGenericView({
            sqlKey: 'getJson_datacache',
            isMultipleRows: false
            , entityName: 'accounts'
        })
        const dataCache = ret?.jsonResult
        const allSettings:any[] = dataCache?.allSettings
        let unitInfo:any
        if(allSettings){
            const item = allSettings.find((item)=>item.key==='unitInfo')
            item && (unitInfo = item?.jData)
        }
        // dataCache?.allSettings[1]?.jData
        setInBag('unitInfo', unitInfo)
        hotEmit('DATACACHE-SUCCESSFULLY-LOADED', dataCache)
        emit('SHOW-SUBHEADER-BUSY', false)
        emit('LOAD-MAIN-JUST-REFRESH', { mainHeading: getUnitHeading() })
        emit('LOAD-LEFT-MENU', '')
    }

    return { setLastBuCodeFinYearIdBranchId, execDataCache }
}

export { initCode }