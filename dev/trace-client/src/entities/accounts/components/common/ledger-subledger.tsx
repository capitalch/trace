import { clsx, useState, useEffect, useRef, } from '../../../../imports/regular-imports'
import Select, { components } from 'react-select'
import { makeStyles, createStyles, Theme } from '../../../../imports/gui-imports'
import { useSharedElements } from './shared-elements-hook'

interface LedgerSubledgerOptions {
    className?: string
    ledgerFilterMethodName?: string
    onChange?: any
    rowData: any // Object which has the final selected value as 'accId' and boolen error in 'isLedgerSubledgerError'
    showAutoSubledgerValues?: boolean
}
function LedgerSubledger({    
    className,
    ledgerFilterMethodName,
    onChange,
    rowData,
    showAutoSubledgerValues = true,
}: LedgerSubledgerOptions) {
    const [, setRefresh] = useState({})
    const { filterOn, getFromBag, getMappedAccounts, } = useSharedElements()
    const allAccounts = getFromBag('allAccounts') || []

    useEffect(() => {
        const curr = meta.current
        curr.isMounted = true
        const value = rowData?.accId
        if (value) {
            const item = getItemFromValue(value)
            if (['Y', 'L'].includes(item?.accLeaf)) {
                // Leaf or ledger as auto subledger
                curr.ledgerItem = {
                    label: item?.accName,
                    value: item?.id,
                }
                curr.subledgerItem = { label: null, value: undefined }
                curr.subledgerOptions = []
                setSubledgerDisabled(true)
            } else {
                //subledger account hence get also its parent as ledger
                const parentItem = item && getItemFromValue(item.parentId)
                curr.ledgerItem = {
                    label: parentItem?.accName,
                    value: parentItem?.id,
                }
                curr.subledgerOptions = getSubledgerOptions(
                    parentItem?.id
                )
                setSubledgerDisabled(false)
                curr.subledgerItem = {
                    label: item?.accName,
                    value: item?.id,
                }
            }
            computeError()
            setRefresh({})
        } else if (value === undefined) {
            curr.ledgerItem = {
                label: null,
                value: undefined,
            }
            curr.subledgerItem = { label: null, value: undefined }
            setRefresh({})
        }

        return () => {
            curr.isMounted = false
        }
    }, [rowData.accId])

    useEffect(() => {
        loadLedgerAccounts()
        const subs1 = filterOn('LEDGER-SUBLEDGER-DISABLE-AUTO-SUBLEDGER')
            .subscribe((d: any) => {
                setSubledgerDisabled(d.data || true)
            })
        const subs2 = filterOn('TRACE-SERVER-ACCOUNT-ADDED-OR-UPDATED').subscribe(() => {
            loadLedgerAccounts()
        })
        const subs3 = filterOn('LEDGER-SUBLEDGER-JUST-REFRESH').subscribe((d: any) => {
            if (d.data) {
                ledgerFilterMethodName = d.data
            }
            setRefresh({})
        })

        function loadLedgerAccounts() {
            ledgerFilterMethodName && (meta.current.ledgerAccounts = ledgerFilterMethods()[ledgerFilterMethodName]())
            setRefresh({})
        }
        return (() => {
            subs1.unsubscribe()
            subs2.unsubscribe()
            subs3.unsubscribe()
        })
    }, [])

    useEffect(() => {
        ledgerFilterMethodName && (meta.current.ledgerAccounts = ledgerFilterMethods()[ledgerFilterMethodName]())
        setRefresh({})
    }, [ledgerFilterMethodName])

    const meta: any = useRef({
        isMounted: false,
        isSubledgerDisabled: true,
        ledgerItem: { label: null, value: undefined },
        ledgerAccounts: [],
        rowData: rowData,
        subledgerItem: { label: null, value: undefined },
        subledgerOptions: [],
        getError: getError,
    })
    const classes = useStyles(meta)
    rowData.isLedgerSubledgerError = getError()
    const Option = (props: any) => {
        let ret = <></>
        if (props.data.accLeaf === 'L') {
            ret = (
                <components.Option {...props}>
                    <strong>{props.data.label + ' >>>'}</strong>
                </components.Option>
            )
        } else {
            ret = <components.Option {...props} />
        }
        return ret
    }

    // To reduce space between two items of drop down
    const styles = {
        option: (base: any) => ({
            ...base,
            padding: '.3rem',
            paddingLeft: '0.5rem',
        }),
    }

    return (
        <div className={clsx(classes.content, className)}>
            <Select
                maxMenuHeight={150}
                menuPlacement="auto"
                menuShouldScrollIntoView={false}
                onChange={handleLedgerChange}
                options={
                    meta.current.ledgerAccounts?.sort((a: any, b: any) => {
                        if (a.label > b.label) return 1
                        if (a.label < b.label) return -1
                        return 0
                    }) || []
                }
                placeholder="Select ledger account ..."
                styles={styles}
                components={{ Option }} // customizing individual items or option
                value={meta.current.ledgerItem}
            />
            <Select
                isDisabled={meta.current.isSubledgerDisabled}
                maxMenuHeight={110}
                onChange={handleSubledgerChange}
                options={meta.current.subledgerOptions}
                placeholder="Select subledger account ..."
                styles={styles}
                value={meta.current.subledgerItem}
            />
        </div>
    )

    function getError() {
        let isError: boolean = true

        if (meta.current?.isSubledgerDisabled) {
            if (meta.current?.ledgerItem.value) {
                isError = false
            }
        } else {
            if (meta.current?.subledgerItem.value) {
                isError = false
            }
        }
        return isError
    }

    function computeError() {
        rowData.isLedgerSubledgerError = getError()
    }

    function ledgerFilterMethods(): any {

        function all() {
            const a = allAccounts
                .filter((el: any) => el.accLeaf === 'Y' || el.accLeaf === 'L')
            return(getMappedAccounts(a) || [])
        }

        function cashBank() {
            const cb = allAccounts.filter(
                (el: any) =>
                    ['ecash', 'bank', 'card', 'cash'].includes(el.accClass) &&
                    (el.accLeaf === 'Y' || el.accLeaf === 'L')
            )
            return (getMappedAccounts(cb) || [])
        }

        function journal() {
            const jou = allAccounts.filter(
                (el: any) =>
                    [
                        'branch',
                        'capital',
                        'other',
                        'loan',
                        'iexp',
                        'dexp',
                        'dincome',
                        'iincome',
                        'creditor',
                        'debtor',
                        'sale',
                        'purchase'
                    ].includes(el.accClass) &&
                    (el.accLeaf === 'Y' || el.accLeaf === 'L'))
            return (getMappedAccounts(jou) || [])
        }

        function paymentOther() {
            const po = allAccounts.filter(
                (el: any) =>
                    [
                        'debtor',
                        'creditor',
                        'dexp',
                        'iexp',
                        'purchase',
                        'loan',
                        'capital',
                        'other',
                    ].includes(el.accClass) &&
                    (el.accLeaf === 'Y' || el.accLeaf === 'L')
            )
            return (getMappedAccounts(po) || [])
        }

        function receiptOther() {
            const ro = allAccounts.filter(
                (el: any) =>
                    [
                        'debtor',
                        'creditor',
                        'dexp',
                        'iexp',
                        'loan',
                        'other',
                        'capital',
                        'iincome',
                        'dincome',
                    ].includes(el.accClass) &&
                    (el.accLeaf === 'Y' || el.accLeaf === 'L')
            )
            return (getMappedAccounts(ro) || [])
        }

        function saleAccounts() {
            const so = allAccounts.filter(
                (el: any) =>
                    ['sale'].includes(el.accClass) &&
                    (el.accLeaf === 'Y' || el.accLeaf === 'L')
            )
            return (getMappedAccounts(so) || [])
        }

        function debtorsCreditors() {
            const dc = allAccounts
                .filter(
                    (el: any) =>
                        ['debtor', 'creditor'].includes(el.accClass) &&
                        (el.accLeaf === 'Y' || el.accLeaf === 'L') &&
                        !el.isAutoSubledger
                )
            return (getMappedAccounts(dc) || [])
        }

        function autoSubledgers() {
            const as = allAccounts.filter(
                (el: any) =>
                    ['debtor'].includes(el.accClass) &&
                    (el.accLeaf === 'Y' || el.accLeaf === 'L') &&
                    el.isAutoSubledger
            )
            return (getMappedAccounts(as) || [])
        }

        function purchaseAccounts() {
            const pa = allAccounts.filter(
                (el: any) =>
                    ['purchase'].includes(el.accClass) &&
                    (el.accLeaf === 'Y' || el.accLeaf === 'L')
            )
            return (getMappedAccounts(pa) || [])
        }

        return ({all, cashBank, journal, paymentOther, receiptOther, saleAccounts, debtorsCreditors, autoSubledgers, purchaseAccounts, })
    }

    function getItemFromValue(val: number) {
        let item
        if (allAccounts && allAccounts.length > 0) {
            item = allAccounts.find((x: any) => x.id === +val)
        }
        return item
    }

    function getSubledgerOptions(id: number) {
        return allAccounts
            .filter((x: any) => x.parentId === id)
            .map((x: any) => {
                return {
                    label: x.accName,
                    value: x.id,
                }
            })
            .sort((a: any, b: any) => {
                if (a.label > b.label) return 1
                if (a.label < b.label) return -1
                return 0
            })
    }

    function handleSubledgerChange(item: any) {
        rowData.accId = item.value
        meta.current.subledgerItem = item
        onChange && onChange()
        computeError()
        meta.current.isMounted && setRefresh({})
    }

    function handleLedgerChange(item: any) {
        meta.current.ledgerItem = item
        const accLeaf = item?.accLeaf
        const isAutoSubledger = item?.isAutoSubledger
        if (accLeaf === 'L') {
            if (isAutoSubledger) {
                if (showAutoSubledgerValues) {
                    loadSubledgers()
                } else {
                    rowData.accId = item.value
                    setSubledgerDisabled(true)
                }
            } else {
                loadSubledgers()
            }
        } else {
            meta.current.subledgerOptions = []
            rowData.accId = item.value
            setSubledgerDisabled(true)
        }
        onChange && onChange()
        meta.current.subledgerItem = { label: null, value: undefined }
        computeError()
        meta.current.isMounted && setRefresh({})

        function loadSubledgers() {
            meta.current.subledgerOptions = getSubledgerOptions(item.value)
            rowData.accId = null
            setSubledgerDisabled(false)
        }
    }

    function setSubledgerDisabled(isDisabled: boolean) {
        meta.current.isSubledgerDisabled = isDisabled
    }
}

export { LedgerSubledger }


const useStyles: any = makeStyles((theme: Theme) =>
    createStyles({
        content: {
            minWidth: theme.spacing(30),
            width: theme.spacing(35),
            maxWidth: theme.spacing(50),
            border: (meta: any) => {
                const isError = meta.current.getError()
                return isError ? '3px solid red' : ''
            },
        },
    })
)
