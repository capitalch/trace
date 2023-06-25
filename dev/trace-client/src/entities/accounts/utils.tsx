import _ from 'lodash'
import { utilMethods } from '../../global-utils/misc-utils'
import { graphqlQueries } from '../../shared-artifacts/graphql-queries-mutations'
import { graphqlService } from '../../global-utils/graphql-service'
import { manageEntitiesState } from '../../global-utils/esm'
import { usingIbuki } from '../../global-utils/ibuki'
import moment from 'moment'
import accountsMessages from '../accounts/json/accounts-messages.json'
import messages from '../../messages.json'
// import { itemLevelValidators } from '../../shared-artifacts/item-level-validators'
const accStore: any = {}

function utils() {
    const { extractAmount } = utilMethods()
    const { mutateGraphql, queryGraphql } = graphqlService()
    const { getFromBag, getCurrentEntity } = manageEntitiesState()
    const { emit } = usingIbuki()

    async function execSaleInvoiceView(options: {
        sqlKey?: string
        isMultipleRows: boolean
        args?: {}
    }) {
        let ret: any = undefined
        const sqlQueryObject: any = escape(
            JSON.stringify({
                sqlKey: options.sqlKey,
                args: options.args || {},
                isMultipleRows: options.isMultipleRows,
            })
        )
        const queries: any = await import(
            './artifacts/graphql-queries-mutations'
        )
        const q = queries.default['saleInvoiceView'](sqlQueryObject, 'accounts')
        try {
            if (q) {
                const result: any = await queryGraphql(q)
                ret = result.data['accounts'].saleInvoiceView
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

    function extractGst(x: any) {
        const clone: any = { ...x }
        clone.rate = clone.rate || '0.00'
        clone.rate = parseFloat(extractAmount(clone.rate))

        clone.sgst = clone.sgst || '0.00'
        clone.sgst = parseFloat(extractAmount(clone.sgst))

        clone.cgst = clone.cgst || '0.00'
        clone.cgst = parseFloat(extractAmount(clone.cgst))

        clone.igst = clone.igst || '0.00'
        clone.igst = parseFloat(extractAmount(clone.igst))
        return clone
    }

    function getAccountClass(accId: number) {
        let ret = undefined
        const allAccounts: any[] = getFromBag('allAccounts')
        const account = allAccounts.find((x) => x.id === accId)
        account && (ret = account.accClass)
        return ret
    }

    function getAccountName(accId: number) {
        let ret = undefined
        const allAccounts: any[] = getFromBag('allAccounts') // accStore['allAccounts']
        const account = allAccounts.find((x) => x.id === accId)
        account && (ret = account.accName)
        return ret
    }

    function getAccountClassWithAutoSubledger(accId: number) {
        let ret = undefined
        const allAccounts: any[] = getFromBag('allAccounts')
        const account = allAccounts.find((x) => x.id === accId)
        if (!_.isEmpty(account)) {
            ret = {
                accClass: account.accClass,
                isAutoSubledger: isParentAutoSubledger(account.parentId)
            }
        }
        return ret

        function isParentAutoSubledger(accId: number) {
            const acc = allAccounts.find((x: any) => x.id === accId)
            return (acc?.isAutoSubledger || false)
        }
    }

    function getAccountBalanceFormatted(accId: number) {
        const { toDecimalFormat } = utilMethods()
        const allAccounts = getFromBag('allAccounts')
        const account = allAccounts.find((item: any) => item.id === accId)
        const balance = account?.balance || 0
        const fBalance = toDecimalFormat(Math.abs(balance))
        const suffix = (balance >= 0) ? ' Dr' : ' Cr'
        const ret = ''.concat(fBalance, suffix)
        return (ret)
    }

    function getCashBankAccountsWithSubledgers() {
        const allAccounts = getFromBag('allAccounts') || []
        const cashBankArray = ['cash', 'bank', 'card', 'ecash']
        const cashBankAccountsWithSubledgers = allAccounts.filter(
            (el: any) =>
                cashBankArray.includes(el.accClass) &&
                (el.accLeaf === 'Y' || el.accLeaf === 'S')
        )
        return (cashBankAccountsWithSubledgers)
    }

    function getdebtorCreditorAccountsWithSubledgers() {
        const allAccounts = getFromBag('allAccounts') || []
        const debtorCreditorAccountsWithSubledgers = allAccounts
            .filter(
                (el: any) =>
                    ['debtor', 'creditor'].includes(el.accClass) &&
                    (el.accLeaf === 'Y' || el.accLeaf === 'S') &&
                    !(isParentAutoSubledger(el))
            )
            .sort((a: any, b: any) => {
                if (a.accName > b.accName) return 1
                if (a.accName < b.accName) return -1
                return 0
            })
        function isParentAutoSubledger(acc: any) {
            let ret = false
            const parentId = acc.parentId
            const account = allAccounts.find((x: any) => x.id === parentId)
            ret = account.isAutoSubledger || false
            return (ret)
        }
        return (debtorCreditorAccountsWithSubledgers)
    }

    function getAutoSubledgers() {
        const allAccounts = getFromBag('allAccounts') || []
        const autoSubledgerAccounts = allAccounts.filter(
            (el: any) =>
                ['debtor'].includes(el.accClass) &&
                (el.accLeaf === 'Y' || el.accLeaf === 'L') &&
                el.isAutoSubledger
        )
        return (autoSubledgerAccounts)
    }

    function getMappedAccounts(accounts: any[]) {
        return accounts.map((x: any) => ({
            label: x.accName,
            value: x.id,
            accLeaf: x.accLeaf,
            isAutoSubledger: x.isAutoSubledger
        })).sort((a: any, b: any) => {
            if (a.label > b.label) return 1
            if (a.label < b.label) return -1
            return 0
        })
    }

    function getGridReportSubTitle() {
        const finObject = getFromBag('finYearObject')
        const unitInfo = getFromBag('unitInfo')
        const ret = ''.concat(unitInfo?.unitName || '', ' (report from ', finObject.startDate, ' to ', finObject.endDate, ")")
        return (ret)
    }

    function getTranType(tranTypeId: number) {
        const tranObj: any = {
            1: 'journal',
            2: 'payment',
            3: 'receipt',
            4: 'sales',
            5: 'purchase',
            6: 'contra',
            7: 'debitNote',
            8: 'creditNote',
            9: 'saleReturn',
            10: 'assignmentReturned',
        }
        return tranObj[tranTypeId]
    }

    function getUnitHeading() {
        const entityName = _.upperFirst(getCurrentEntity())
        const allSettings = getFromBag('allSettings')
        let unitInfo: any
        if (allSettings) {
            const item = allSettings.find(
                (item: any) => item.key === 'unitInfo'
            )
            item && (unitInfo = item?.jData)
        }
        const unitName = unitInfo?.unitName || ''
        const unitHeading = unitName ? entityName.concat(': ', unitName) : ''
        return unitHeading
    }

    function isDateNotAuditLocked(tranDate: any) {
        let ret = true
        const auditLockDate: any = getFromBag('auditLockDate')
        if (auditLockDate) {
            const momentAuditLockDate = moment(auditLockDate)
            const momentTrandate = moment(tranDate)
            ret = momentTrandate.isAfter(momentAuditLockDate)
        }
        return ret
    }

    function isDateAuditLocked(tranDate: any) {
        let ret = false
        const auditLockDate: any = getFromBag('auditLockDate')
        if (auditLockDate) {
            const momentAuditLockDate = moment(auditLockDate) // iso date format
            const momentTrandate = moment(tranDate) // iso date format
            ret = momentTrandate.isSameOrBefore(momentAuditLockDate)
        }
        return ret
    }

    function isGoodToDelete(params: any) {
        const row = params.row
        let ret = true
        if (isDateAuditLocked(row.tranDate)) {
            emit('SHOW-MESSAGE', {
                severity: 'error',
                message: accountsMessages.auditLockError,
                duration: null,
            })
            ret = false
        } else if (row?.clearDate) {
            // already reconciled so edit /delete not possible
            emit('SHOW-MESSAGE', {
                severity: 'error',
                message: accountsMessages.reconcillationDone,
                duration: null,
            })
            ret = false
        }
        return ret
    }

    function isAllowedUpdate({ tranDate, clearDate }: any) {
        let ret = false
        if (isDateAuditLocked(tranDate)) {
            emit('SHOW-MESSAGE', {
                severity: 'error',
                message: accountsMessages.auditLockError,
                duration: null,
            })
        } else if (clearDate) {
            // already reconciled so edit /delete not possible
            emit('SHOW-MESSAGE', {
                severity: 'error',
                message: accountsMessages.reconcillationDone,
                duration: null,
            })
        } else {
            ret = true
        }
        return ret
    }

    function isImproperDate(mDate: string) {
        const momDate = moment(mDate)
        const momYear = momDate.year()
        let isProperDate = false
        if (momDate.isSame(moment('1900-01-01'))) {
            isProperDate = true
        } else if (momDate.isBefore(moment()) && momYear > 1920) {
            isProperDate = true
        }
        return !isProperDate
    }

    function isInvalidDate(mDate: string | undefined) {
        // mDate is isoFormat
        // Invalid date: less than start date || greater than end date || in between start date and audit lock date
        try {
            const finObject = getFromBag('finYearObject')
            const dateFormat = getFromBag('dateFormat')
            const startDate = moment(finObject.startDate, dateFormat)
            const endDate = moment(finObject.endDate, dateFormat)
            let lockDate = getFromBag('auditLockDate')
            if (!lockDate) {
                lockDate = startDate.subtract(1, 'days')
            }
            lockDate = moment(lockDate)
            let tranDate: any = undefined
            if(mDate){
                tranDate = moment(mDate)
            }
            // const tranDate: any =
            //     mDate === (undefined || '') ? undefined : moment(mDate)
            const isInValidDate =
                tranDate === undefined ||
                tranDate.isBefore(startDate) ||
                tranDate.isAfter(endDate) ||
                tranDate.isBetween(startDate, lockDate, undefined, '[]') // inclusive
            return isInValidDate
        } catch (e: any) {
            console.log(e.message)
        }
    }

    function isInvalidEmail(email: any) {
        // allowed blank
        let ret = true
        if (email) {
            ret = /^.+@[^\.].*\.[a-z]{2,}$/.test(email)
        }
        return !ret
    }

    function isInvalidGstin(gstin: string) {
        return !(
            gstin === '' ||
            gstin === undefined ||
            gstin === null ||
            /^([0][1-9]|[1-2][0-9]|[3][0-7])([A-Z]{5})([0-9]{4})([A-Z]{1}[1-9A-Z]{1})([Z]{1})([0-9A-Z]{1})+$/.test(
                gstin
            )
        )
    }

    function isInvalidIndiaMobile(mobile: any) {
        // blank mobile number is valid
        let ret = true
        mobile = String(mobile || '')
        if (mobile) {
            ret =
                (mobile.length === 10 && !isNaN(mobile)) || mobile.length === 0
        }
        return !ret
    }

    function isInvalidIndiaPin(pin: any) {
        //Empty value not allowed
        let ret = false
        pin = String(pin || '')
        if (pin) {
            ret = pin.length === 6 && !isNaN(pin)
        }
        return !ret
    }

    function isInvalidStateCode(stateCode: any) {
        let validCode = false

        if (_.isNumber(parseInt(stateCode))) {
            if (_.inRange(stateCode, 1, 38)) {
                validCode = true
            }
        }
        return !validCode
    }

    function registerAccounts(allAccounts: any[]) {
        accStore.allAccounts = allAccounts
    }

    function toCurrentDateFormat(date: string) {
        const dateFormat = getFromBag('dateFormat')
        const ret = date ? moment(date).format(dateFormat) : ''
        return (ret)
    }

    async function transferClosingBalances() {
        const q = graphqlQueries['genericQueryBuilder']({
            // in shared artifacts
            queryName: 'transferClosingBalances',
            queryType: 'mutation',
        })
        if (q) {
            const ret: any = await mutateGraphql(q)
            return ret
        }
    }

    return {
        extractGst,
        getAccountClass,
        getAccountName,
        getAccountBalanceFormatted,
        getAccountClassWithAutoSubledger,
        getAutoSubledgers,
        getCashBankAccountsWithSubledgers,
        getdebtorCreditorAccountsWithSubledgers,
        getMappedAccounts,
        getGridReportSubTitle,
        getTranType,
        getUnitHeading,
        isAllowedUpdate,
        isDateAuditLocked,
        isDateNotAuditLocked,
        isGoodToDelete,
        isImproperDate,
        isInvalidDate,
        isInvalidEmail,
        isInvalidGstin,
        isInvalidIndiaMobile,
        isInvalidIndiaPin,
        isInvalidStateCode,
        registerAccounts,
        execSaleInvoiceView,
        toCurrentDateFormat,
        transferClosingBalances,
    }
}

export { utils }
