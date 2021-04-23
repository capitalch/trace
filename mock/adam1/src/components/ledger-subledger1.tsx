// based on react-widgets
import React, { useState, useEffect, useRef } from 'react'
import { makeStyles, Theme, createStyles } from '@material-ui/core'
import { Combobox } from 'react-widgets'
import 'react-widgets/dist/css/react-widgets.css'

interface LedgerSubledgerOptions {
    ledgerAccounts: any[]
    allAccounts: any[]
    value?: any
}

function LedgerSubledger1({ledgerAccounts, allAccounts, value}: LedgerSubledgerOptions) {
    const [, setRefresh] = useState({})
    const classes = useStyles()

    useEffect(() => {
        meta.current.isMounted = true
        if(value){
            meta.current.value = value
            const item = getItemFromValue(value)
            if(item?.accLeaf === 'Y'){
                meta.current.ledgerValue = value 
                meta.current.subledgerValue = undefined
                meta.current.subledgerOptions = []
                setSubledgerDisabled(true)                               
            } else { //subledger account hence get also get its parent as ledger
                const parentItem = item && getItemFromValue(item.parentId)
                meta.current.ledgerValue = parentItem?.id
                meta.current.subledgerOptions = getSubledgerOptions({label:parentItem?.accName, value: parentItem?.id})
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
        <Combobox
            data={ledgerAccounts.sort((a: any, b: any) => {
                if (a.label > b.label)
                    return 1;
                if (a.label < b.label)
                    return -1;
                return 0;
            })}
            dropUp
            filter='contains'
            // itemComponent={listItem}
            onChange={handleLedgerChange}
            textField="label"
            value={meta.current.ledgerValue || undefined}
            // valueField="value"
        />
        <Combobox
            data={meta.current.subledgerOptions.sort((a: any, b: any) => {
                if (a.label > b.label)
                    return 1;
                if (a.label < b.label)
                    return -1;
                return 0;
            })}
            disabled={meta.current.isSubledgerDisabled}
            dropUp
            filter='contains'
            onChange={handleSubledgerChange}
            textField="label"
            value={meta.current.subledgerValue || undefined}
            // valueField="value"
        />
    </div>

    function getItemFromValue(val: string){
        let item
        if(allAccounts && (allAccounts.length) > 0) {
            item = allAccounts.find((x)=>x.id === val)
        } 
        return item
    }

    function getSubledgerOptions(item: any){
        return allAccounts.filter((x: any) => x.parentId === item.value)
        .map ((x:any)=>{
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
        meta.current.value = item.value
        meta.current.subledgerValue = item
        meta.current.isMounted && setRefresh({})
        console.log('out:', item.value)
    }

    function handleLedgerChange(item: any) {        
        meta.current.ledgerValue = item.value
        if (item.accLeaf === 'L') {
            meta.current.subledgerOptions = getSubledgerOptions(item)
            meta.current.value = null
            setSubledgerDisabled(false)
        } else {
            meta.current.subledgerOptions = []
            meta.current.value = item.value
            setSubledgerDisabled(true)
        }
        meta.current.subledgerValue = null 
        console.log('out:', meta.current.value)
        meta.current.isMounted && setRefresh({})
    }


    function listItem({ item }: any) {
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

export { LedgerSubledger1 }

const useStyles: any = makeStyles((theme: Theme) =>
    createStyles({

        content: {
            width: '25rem',
            padding: theme.spacing(2)
        },

    })
)