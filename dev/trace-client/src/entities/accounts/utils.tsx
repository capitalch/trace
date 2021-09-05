import _ from 'lodash'
import { useState } from 'react'
// import { makeStyles, Theme, createStyles } from '@material-ui/core'
import { utilMethods } from '../../common-utils/util-methods'
import { manageFormsState } from '../../react-form/core/fsm'
import { graphqlQueries } from '../../shared-artifacts/graphql-queries-mutations'
import { graphqlService } from '../../common-utils/graphql-service'
import { manageEntitiesState } from '../../common-utils/esm'
import { usingIbuki } from '../../common-utils/ibuki'
import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import { IconButton } from '@material-ui/core'
import SearchIcon from '@material-ui/icons/Search'
import moment from 'moment'
import accountsMessages from '../accounts/json/accounts-messages.json'
import { useConfirm } from 'material-ui-confirm'

import { useSharedElements } from '../accounts/components/common/shared-elements-hook'

const accStore: any = {}

function utils() {
    const { execGenericView, extractAmount, genericUpdateMaster, toDecimalFormat } = utilMethods()
    const { mutateGraphql } = graphqlService()
    const { getFromBag, getCurrentEntity } = manageEntitiesState()
    const { emit } = usingIbuki()
    // const {confirm, getFromBag, getCurrentEntity, execGenericView, extractAmount,genericUpdateMaster, toDecimalFormat} = useSharedElements()


    // function deleteRow(params: any){
    //     const confirm = useConfirm()
    //     const row = params.row
    //     const tranHeaderId = row['id1']
    //     const options:any = {
    //         description: accountsMessages.transactionDelete,
    //         confirmationText: 'Yes',
    //         cancellationText: 'No',
    //     }
    //     if (isDateAuditLocked(row.tranDate)) {
    //         emit('SHOW-MESSAGE', {
    //             severity: 'error',
    //             message: accountsMessages.auditLockError,
    //             duration: null,
    //         })
    //     } else if (row?.clearDate) {
    //         // already reconciled so edit /delete not possible
    //         emit('SHOW-MESSAGE', {
    //             severity: 'error',
    //             message: accountsMessages.reconcillationDone,
    //             duration: null,
    //         })
    //     } else {
    //         confirm(options)
    //             .then(async () => {
    //                 await genericUpdateMaster({
    //                     deletedIds: [tranHeaderId],
    //                     tableName: 'TranH',
    //                 })
    //                 emit('SHOW-MESSAGE', {})
    //                 emit('VOUCHER-VIEW-REFRESH', '')
    //             })
    //             .catch(() => {}) // important to have otherwise eror
    //     }
    // }

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
        const allAccounts: any[] = accStore['allAccounts']
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
        account &&
            (ret = {
                accClass: account.accClass,
                isSubledger: account.isAutoSubledger,
            })
        return ret
    }

    function getDebitCreditRowsCount(formId: string): any {
        const { getFormData } = manageFormsState()
        const formData = getFormData(formId)

        let debits = formData.debits
        let credits = formData.credits
        if (!Array.isArray(debits)) {
            debits = [debits]
        }
        if (!Array.isArray(credits)) {
            credits = [credits]
        }

        return {
            debitRowsCount: debits.length,
            creditRowsCount: credits.length,
        }
    }

    function getDebitCreditTotals(formId: string): any {
        const { getFormData } = manageFormsState()
        const formData = getFormData(formId)
        let debits = formData.debits
        let credits = formData.credits

        function process(drcr: any) {
            let total = 0.0
            if (drcr) {
                if (!Array.isArray(drcr)) {
                    drcr = [drcr]
                }
                if (drcr.length > 0) {
                    for (let el of drcr) {
                        const amount = String(el['amount'] || '')
                        const amt = Number(amount.replace(/[^\d.-]/g, '')) // replaces rs symbol and comma from the debitAmount
                        if (!isNaN(amt)) {
                            total = total + amt
                        }
                    }
                }
            }
            return total
        }
        const ret = { debits: process(debits), credits: process(credits) }
        return ret
    }

    function getGeneralLedger(meta: any) {
        async function fetchData() {
            emit('SHOW-LOADING-INDICATOR', true)
            const ret: any = await execGenericView({
                sqlKey: 'get_accountsLedger',
                isMultipleRows: false,
                args: {
                    id: meta.current.accId,
                },
            })

            const pre = ret?.jsonResult
            meta.current.accName = pre.accName
            pre.sum[0].debit || (pre.sum[0].debit = 0)
            pre.sum[0].credit || (pre.sum[0].credit = 0)
            meta.current.sum = pre.sum
            meta.current.opBalance = pre.opBalance || { debit: 0, credit: 0 }
            pre.transactions || (pre.transactions = [{ debit: 0, credit: 0 }])

            if (meta.current.isDailySummary) {
                const summaryRows = getSummaryRows(pre.transactions, meta)
                // merge transactions with summaryRows and sort
                meta.current.transactions = pre.transactions.concat(summaryRows)
                meta.current.transactions = _.sortBy(
                    meta.current.transactions,
                    ['tranDate']
                ) // Used lodash because JavaScript sort did not work out
                meta.current.transactions.shift(1) // remove first row which is having blank date value
                // cleanup
                meta.current.transactions = meta.current.transactions.map(
                    (item: any) => {
                        return {
                            ...item,
                            tranType:
                                item.tranType === 'Summary'
                                    ? ''
                                    : item.tranType,
                        }
                    }
                )
            } else {
                meta.current.transactions = pre.transactions
            }

            // Add opening balance at the begining
            meta.current.transactions.unshift({
                otherAccounts: 'Opening balance',
                debit: toDecimalFormat(meta.current.opBalance.debit),
                credit: toDecimalFormat(meta.current.opBalance.credit),
            })
            meta.current.isReverseOrder && meta.current.transactions.reverse()
            const preSum = meta.current.sum[0]
            const debit = preSum.debit || 0
            const credit = preSum.credit || 0
            const balance = debit - credit || 0
            const balanceType = balance >= 0 ? ' Dr' : ' Cr'
            meta.current.finalBalance = toDecimalFormat(Math.abs(balance))
            meta.current.finalBalanceType = balanceType
            emit('SHOW-LOADING-INDICATOR', false)
        }

        function getLedgerColumns() {
            let numb = 0
            function incr() {
                return numb++
            }
            return [
                <Column
                    selectionMode="multiple"
                    key={incr()}
                    style={{ width: '3rem', textAlign: 'center' }}
                />,
                <Column
                    header="D"
                    key={incr()}
                    style={{ width: '2.1rem', textAlign: 'left' }}
                    body={actionTemplate}
                />,
                <Column
                    style={{ width: '5.2rem', textAlign: 'left' }}
                    field="tranDate"
                    body={(node: any) =>
                        node.tranDate
                            ? moment(node.tranDate).format(
                                meta.current.dateFormat
                            )
                            : ''
                    }
                    key={incr()}
                    header="Date"
                    footerStyle={{ textAlign: 'left', paddingLeft: '4px' }}
                    footer="Rows:"></Column>,
                <Column
                    style={{ width: '12rem' }}
                    field="otherAccounts"
                    header="Account name"
                    footerStyle={{ textAlign: 'left', paddingLeft: '4px' }}
                    footer={
                        meta.current.transactions.length
                            ? meta.current.transactions.length - 1
                            : 0
                    }
                    key={incr()}></Column>,
                <Column
                    style={{ width: '8rem', textAlign: 'right' }}
                    field="debit"
                    body={(node: any) => toDecimalFormat(node.debit)}
                    key={incr()}
                    header="Debits"
                    footerStyle={{ textAlign: 'right', paddingRight: '8px' }}
                    footer={toDecimalFormat(
                        meta.current.sum ? meta.current?.sum[0]?.debit : 0.0
                    )}></Column>,
                <Column
                    style={{ width: '8rem', textAlign: 'right' }}
                    field="credit"
                    body={(node: any) => toDecimalFormat(node.credit)}
                    key={incr()}
                    header="Credits"
                    footerStyle={{ textAlign: 'right', paddingRight: '8px' }}
                    footer={toDecimalFormat(
                        meta.current.sum ? meta.current?.sum[0]?.credit : 0.0
                    )}></Column>,
                <Column
                    style={{ width: '4rem', textAlign: 'left' }}
                    field="tranType"
                    footerStyle={{ textAlign: 'left', paddingLeft: '4px' }}
                    footer="Clos:"
                    key={incr()}
                    header="Type"></Column>,
                <Column
                    style={{ width: '11rem', textAlign: 'left' }}
                    field="autoRefNo"
                    key={incr()}
                    footerStyle={{ textAlign: 'left', paddingLeft: '4px' }}
                    footer={
                        <div>
                            <span>
                                {String(meta.current?.finalBalance || 0.0)}
                            </span>
                            <span
                                style={{
                                    color: `${meta.current.finalBalanceType === ' Dr'
                                        ? 'dodgerBlue'
                                        : 'red'
                                        }`,
                                }}>
                                {meta.current.finalBalanceType}
                            </span>
                        </div>
                    }
                    header="Auto ref no"></Column>,
                <Column
                    style={{ width: '8rem', textAlign: 'left' }}
                    field="instrNo"
                    key={incr()}
                    header="Instrument"></Column>,

                <Column
                    style={{ width: '9rem', textAlign: 'left' }}
                    field="userRefNo"
                    key={incr()}
                    header="User ref no"></Column>,
                <Column
                    style={{ width: '10rem', textAlign: 'left' }}
                    field="remarks"
                    key={incr()}
                    header="Remarks"></Column>,
                <Column
                    style={{ width: '10rem', textAlign: 'left' }}
                    field="lineRefNo"
                    key={incr()}
                    header="Line ref no"></Column>,
                <Column
                    style={{ width: '10rem', textAlign: 'left' }}
                    field="lineRemarks"
                    key={incr()}
                    header="Line remarks"></Column>,
            ]

            function actionTemplate(node: any) {
                return (
                    <IconButton
                        color="secondary"
                        onClick={(e: any) => {
                            // emit('LOAD-MAIN-COMPONENT-EDIT', {
                            //     headerId: node.headerId,
                            // })
                            // closeDialog()
                        }}>
                        {node.headerId && (
                            <SearchIcon
                                style={{
                                    fontSize: '1rem',
                                    marginLeft: '-0.5rem',
                                }}></SearchIcon>
                        )}
                    </IconButton>
                )
            }
        }

        function LedgerDataTable({ isScrollable, className }: any) {
            const [selectedItems, setSelectedItems] = useState(null)
            return (
                <DataTable
                    className={className}
                    rowClassName={(node: any) => ({
                        'ledger-summary': !node.tranType,
                    })}
                    selection={selectedItems}
                    onSelectionChange={(e) => setSelectedItems(e.value)}
                    selectionMode='multiple'
                    rowHover={true}
                    scrollable={isScrollable}
                    scrollHeight="calc(100vh - 24rem)"
                    value={meta.current.transactions}>
                    {getLedgerColumns()}
                </DataTable>
            )
        }

        function getSummaryRows(arr: any[], meta: any) {
            const summary: any[] = []
            let opBalance = 0
            if (meta.current.opBalance?.debit) {
                opBalance = meta.current.opBalance.debit
            } else {
                opBalance = -meta.current.opBalance.credit
            }
            opBalance = opBalance || 0
            const acc: any = {
                tranDate: '',
                op: opBalance,
                otherAccounts: toOpeningDrCr(opBalance),
                debit: 0,
                credit: 0,
                clos: 0,
                autoRefNo: toClosingDrCr(opBalance), // to show closing balance
                tranType: 'Summary',
            }

            for (let item of arr) {
                if (item.tranDate !== acc.tranDate) {
                    //push
                    acc.clos = acc.op + acc.debit - acc.credit
                    acc.otherAccounts = toOpeningDrCr(acc.op)
                    acc.autoRefNo = toClosingDrCr(acc.clos)
                    summary.push({ ...acc })
                    acc.tranDate = item.tranDate
                    acc.op = acc.clos
                    acc.otherAccounts = toOpeningDrCr(acc.op)
                    acc.debit = item.debit
                    acc.credit = item.credit
                    acc.clos = 0
                    acc.autoRefNo = toClosingDrCr(acc.clos)
                } else {
                    acc.debit = acc.debit + (item.debit || 0)
                    acc.credit = acc.credit + (item.credit || 0)
                }
            }

            acc.clos = acc.op + acc.debit - acc.credit

            acc.autoRefNo = toClosingDrCr(acc.clos)
            summary.push({ ...acc })

            return summary

            function toOpeningDrCr(value: number) {
                return 'Opening: '.concat(
                    String(toDecimalFormat(Math.abs(value))) +
                    (value >= 0 ? ' Dr' : ' Cr')
                )
            }

            function toClosingDrCr(value: number) {
                return 'Closing: '.concat(
                    String(toDecimalFormat(Math.abs(value))) +
                    (value >= 0 ? ' Dr' : ' Cr')
                )
            }
        }

        return { fetchData, getLedgerColumns, LedgerDataTable }
    }

    function getGloballyFilteredData(
        data: any[],
        columns: any[],
        filterText: string
    ) {
        const filteredData = data.filter((item: any) => {
            const ret = columns.reduce((prev: any, curr: any) => {
                const expr = String(item[curr.selector])
                    .toLowerCase()
                    .includes(filterText.toLowerCase())
                return prev || expr
            }, false)
            return ret
        })
        return filteredData
    }

    function getMappedAccounts(accounts: any[]) {
        return accounts.map((x: any) => ({
            label: x.accName,
            value: x.id,
            accLeaf: x.accLeaf,
        }))
    }

    function getTotalCredits(formId: string): number {
        const { getFormData } = manageFormsState()
        const formData = getFormData(formId)
        let sum = 0
        let credits = formData.credits

        if (credits) {
            if (!Array.isArray(credits)) {
                credits = [credits]
            }
            if (credits.length > 0) {
                for (let el of credits) {
                    let amt: any = el['amount'] || ''
                    if (typeof amt === 'string') {
                        amt = Number(amt.replace(/[^\d.-]/g, '')) // replaces rs symbol and comma from the debitAmount
                    }
                    if (!isNaN(amt)) {
                        sum = sum + amt
                    }
                }
            }
        }
        return sum
    }

    function getTotalDebits(formId: string): number {
        const { getFormData } = manageFormsState()
        const formData = getFormData(formId)
        let sum = 0
        let debits = formData.debits

        if (debits) {
            if (!Array.isArray(debits)) {
                debits = [debits]
            }
            if (debits.length > 0) {
                for (let el of debits) {
                    const debitAmount = String(el['amount'] || '')
                    const amt = Number(debitAmount.replace(/[^\d.-]/g, '')) // replaces rs symbol and comma from the debitAmount
                    if (!isNaN(amt)) {
                        sum = sum + amt
                    }
                }
            }
        }
        return sum
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
            10: 'purchaseReturn'
        }
        return (tranObj[tranTypeId])
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
        return(ret)
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

    function isInvalidDate(mDate: string) {
        //mDate is isoFormat
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
            // const tranDate = moment(mDate)
            const tranDate: any = mDate === undefined ? undefined : moment(mDate)
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
        if (_.isNumber(stateCode)) {
            if (_.inRange(stateCode, 1, 38)) {
                validCode = true
            }
        }
        return !validCode
    }

    function registerAccounts(allAccounts: any[]) {
        accStore.allAccounts = allAccounts
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
        // deleteRow,
        extractGst,
        getAccountClass,
        getAccountName,
        getAccountClassWithAutoSubledger,
        getDebitCreditRowsCount,
        getDebitCreditTotals,
        getGeneralLedger,
        getGloballyFilteredData,
        getMappedAccounts,
        getTotalCredits,
        getTotalDebits,
        getTranType,
        getUnitHeading,
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
        transferClosingBalances,
    }
}

export { utils }

// const useStyles: any = makeStyles((theme: Theme) =>
//     createStyles({
//         dataTable: {
//             // '& .data-table': {
//             '& .p-datatable-tfoot': {
//                 '& tr': {
//                     '& td': {
//                         fontSize: '0.8rem',
//                         color: 'dodgerBlue !important',
//                     }
//                 }
//             },
//             // },
//         },
//     })
// )
