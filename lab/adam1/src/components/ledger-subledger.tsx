//based on primereact
import React, { useState, useEffect, useRef } from 'react'
import {Theme, createStyles } from '@material-ui/core'
import makeStyles from "@material-ui/styles/makeStyles";
import { Dropdown } from 'primereact/dropdown'

interface LedgerSubledgerOptions {
    ledgerAccounts: any[]
    allAccounts: any[]
    value?: any
}

function LedgerSubledger({ ledgerAccounts, allAccounts, value }: LedgerSubledgerOptions) {
    const [, setRefresh] = useState({})
    const classes = useStyles()

    useEffect(() => {
        meta.current.isMounted = true
        if (value) {
            meta.current.value = value
            const item = getItemFromValue(value)
            if (item?.accLeaf === 'Y') {
                meta.current.ledgerValue = value
                meta.current.subledgerValue = undefined
                meta.current.subledgerOptions = []
                setSubledgerDisabled(true)
            } else { //subledger account hence get also its parent as ledger
                const parentItem = item && getItemFromValue(item.parentId)
                meta.current.ledgerValue = parentItem?.id
                meta.current.subledgerOptions = getSubledgerOptions(parentItem?.id)
                setSubledgerDisabled(false)
                meta.current.subledgerValue = value
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
        ledgerValue: undefined,
        subledgerOptions: [],
        subledgerValue: undefined,
        value: value,
    })

    return <div className={classes.content}>
        <Dropdown
            autoFocus={true}
            filter={true}
            filterInputAutoFocus={true}
            filterPlaceholder="Select an account"
            onChange={handleLedgerChange}
            options={ledgerAccounts.sort((a: any, b: any) => {
                if (a.label > b.label)
                    return 1;
                if (a.label < b.label)
                    return -1;
                return 0;
            })}
            optionLabel="label"
            optionValue="value"
            required={true}
            resetFilterOnHide={true}
            itemTemplate={listItem}
            value={meta.current.ledgerValue || undefined}
        />
        <Dropdown
            autoFocus={true}
            disabled={meta.current.isSubledgerDisabled}
            filter={true}
            filterInputAutoFocus={true}
            filterPlaceholder="Select an account"
            onChange={handleSubledgerChange}
            options={meta.current.subledgerOptions}
            optionLabel="label"
            optionValue="value"
            // required={true}
            resetFilterOnHide={true}
            itemTemplate={listItem}
            value={meta.current.subledgerValue || undefined}
        />
        {/* <Combobox
            data={meta.current.subledgerOptions}
            disabled={meta.current.isSubledgerDisabled}
            filter='contains'
            onChange={handleSubledgerChange}
            textField="label"
            value={meta.current.subledgerValue || undefined}
            valueField="value"
        /> */}
    </div>

    function getItemFromValue(val: string) {
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

    function handleSubledgerChange(event: any) {
        const value = event.target.value
        meta.current.value = value
        meta.current.subledgerValue = value
        meta.current.isMounted && setRefresh({})
        console.log('out:', value)
    }

    function handleLedgerChange(event: any) {
        const value = event.target.value
        meta.current.ledgerValue = value
        const item = allAccounts.find((x: any) => x.id === value)
        const accLeaf = item?.accLeaf
        if(accLeaf === 'L'){
            meta.current.subledgerOptions = getSubledgerOptions(value)
            meta.current.value = null
            setSubledgerDisabled(false)
        } else {
            meta.current.subledgerOptions = []
            meta.current.value = value
            setSubledgerDisabled(true)
        }
        meta.current.subledgerValue = null
        console.log('out:', meta.current.value)
        meta.current.isMounted && setRefresh({})
    }


    function listItem(item: any) {
        let ret = <></>
        if (item.accLeaf === 'L') {
            ret = <strong>{item.label + ' >>>'}</strong>
        } else {
            ret = <span>{item.label}</span>
        }
        return ret
    }

    function setSubledgerDisabled(isDisabled: boolean) {
        meta.current.isSubledgerDisabled = isDisabled
    }
}

export { LedgerSubledger }

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