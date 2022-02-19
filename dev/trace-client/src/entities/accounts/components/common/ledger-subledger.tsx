import { clsx, useState, useEffect, useRef, } from '../../../../imports/regular-imports'
import Select, { components } from 'react-select'
import { useIbuki } from '../../../../imports/trace-imports'
import { makeStyles, createStyles, Theme } from '../../../../imports/gui-imports'

interface LedgerSubledgerOptions {
    allAccounts: any[]
    className?: string
    ledgerAccounts: any[]
    onChange?: any
    rowData: any // Object which has the final selected value as 'accId' and boolen error in 'isLedgerSubledgerError'
    showAutoSubledgerValues?: boolean
}
function LedgerSubledger({
    allAccounts,
    className,
    ledgerAccounts,
    onChange,
    rowData,
    showAutoSubledgerValues,
}: LedgerSubledgerOptions) {
    const [, setRefresh] = useState({})
    const { filterOn } = useIbuki()
    useEffect(() => {
        const curr = meta.current
        curr.isMounted = true
        const value = rowData?.accId
        if (value) {
            const item = getItemFromValue(value)
            if (['Y', 'L'].includes(item?.accLeaf)) {
                // Leaf or ledger as auto subledger
                curr.ledgerItem = {
                    // label: ''.concat(item?.accName, ` ${item.balanceDrCr || ''}`),
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
        const subs1 = filterOn('LEDGER-SUBLEDGER-DISABLE-AUTO-SUBLEDGER')
            .subscribe((d: any) => {
                setSubledgerDisabled(d.data || true)
            })
        return (() => {
            subs1.unsubscribe()
        })
    }, [])

    // useEffect(() => {
    //     const subs1 = filterOn('LEDGER-SUBLEDGER-JUST-REFRESH').subscribe(() => {
    //         setRefresh({})
    //     })
    //     return (() => { subs1.unsubscribe() })
    // })

    const meta: any = useRef({
        isMounted: false,
        isSubledgerDisabled: true,
        ledgerItem: { label: null, value: undefined },
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
            padding: '.1rem',
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
                    ledgerAccounts?.sort((a: any, b: any) => {
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

    function getItemFromValue(val: number) {
        let item
        if (allAccounts && allAccounts.length > 0) {
            item = allAccounts.find((x) => x.id === +val)
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
