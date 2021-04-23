// based on react-delect
import Select, { components } from "react-select"
import React, { useState, useEffect, useRef } from 'react'
import { makeStyles, Theme, createStyles } from '@material-ui/core'

interface LedgerSubledgerOptions {
    ledgerAccounts: any[]
    allAccounts: any[]
    value?: any
}
function LedgerSubledger2({ ledgerAccounts, allAccounts, value }: LedgerSubledgerOptions) {
    const [, setRefresh] = useState({})
    const classes = useStyles()

    useEffect(() => {
        meta.current.isMounted = true
        if (value) {
            meta.current.value = value
            const item = getItemFromValue(value)
            if (item?.accLeaf === 'Y') {
                meta.current.ledgerItem = item
                meta.current.subledgerItem = { label: null, value: undefined }
                meta.current.subledgerOptions = []
                setSubledgerDisabled(true)
            } else { //subledger account hence get also its parent as ledger
                const parentItem = item && getItemFromValue(item.parentId)
                meta.current.ledgerItem = { label: parentItem?.accName, value: parentItem?.id }
                meta.current.subledgerOptions = getSubledgerOptions(parentItem?.id)
                setSubledgerDisabled(false)
                meta.current.subledgerItem = { label: item?.accName, value: item?.id }
            }
            setRefresh({})
        }
        return (() => {
            meta.current.isMounted = false
        })
    }, [value, ledgerAccounts, allAccounts])

    const meta: any = useRef({
        isMounted: false,
        isSubledgerDisabled: true,
        ledgerItem: { label: null, value: undefined },
        subledgerItem: { label: null, value: undefined },
        subledgerOptions: [],
        value: value,
    })

    const Option = (props: any) => {
        let ret = <></>
        if (props.data.accLeaf === 'L') {
            ret = <components.Option {...props}><strong>{props.data.label + ' >>>'}</strong></components.Option>
        } else {
            ret = <components.Option {...props} />
        }
        return ret
    }


    return <div className={classes.content}>
        <Select
        menuShouldScrollIntoView={true}
            onChange={handleLedgerChange}
            options={ledgerAccounts.sort((a: any, b: any) => {
                if (a.label > b.label)
                    return 1;
                if (a.label < b.label)
                    return -1;
                return 0;
            })}
            placeholder="Select ledger account ..."
            components={{ Option }} // customizing individual items or option
            value={meta.current.ledgerItem}
        />
        <Select
            isDisabled={meta.current.isSubledgerDisabled}
            onChange={handleSubledgerChange}
            options={meta.current.subledgerOptions}
            placeholder="Select subledger account ..."
            value={meta.current.subledgerItem}
        />
    </div>

    function getItemFromValue(val: number) {
        let item
        if (allAccounts && (allAccounts.length) > 0) {
            item = allAccounts.find((x) => x.id === val)
        }
        return item
    }

    function getSubledgerOptions(id: number) {
        return allAccounts.filter((x: any) => x.parentId === id)
            .map((x: any) => {
                return {
                    label: x.accName,
                    value: x.id
                }
            })
            .sort((a: any, b: any) => {
                if (a.label > b.label)
                    return 1;
                if (a.label < b.label)
                    return -1;
                return 0;
            })
    }

    function handleSubledgerChange(item: any) {
        const value = item.value
        meta.current.value = value
        meta.current.subledgerItem = item
        meta.current.isMounted && setRefresh({})
        console.log('out:', value)
    }

    function handleLedgerChange(item: any) {
        const value = item.value
        meta.current.ledgerItem = item
        const accLeaf = item?.accLeaf
        if (accLeaf === 'L') {
            meta.current.subledgerOptions = getSubledgerOptions(value)
            meta.current.value = null
            setSubledgerDisabled(false)
        } else {
            meta.current.subledgerOptions = []
            meta.current.value = value
            setSubledgerDisabled(true)
        }
        meta.current.subledgerItem = { label: null, value: undefined }
        console.log('out:', meta.current.value)
        meta.current.isMounted && setRefresh({})
    }

    function setSubledgerDisabled(isDisabled: boolean) {
        meta.current.isSubledgerDisabled = isDisabled
    }
}

export { LedgerSubledger2 }

const useStyles: any = makeStyles((theme: Theme) =>
    createStyles({
        content: {
            width: '25rem',
            padding: theme.spacing(2),
            display: 'flex',
            flexDirection: 'column',
        },

    })
)

{/* <Dropdown
            autoFocus={true}
            disabled={meta.current.isSubledgerDisabled}
            filter={true}
            filterInputAutoFocus={true}
            filterPlaceholder="Select an account"
            onChange={handleSubledgerChange}
            options={meta.current.subledgerOptions}
            optionLabel="label"
            optionValue="value"
            resetFilterOnHide={true}
            itemTemplate={listItem}
            value={meta.current.subledgerValue || undefined}
        /> */}