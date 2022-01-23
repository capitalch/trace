import { useState, useRef, useEffect } from 'react'
import { manageFormsState } from './fsm'
import clsx from 'clsx'

import {
    Tabs,
    Tab,
    Card,
} from '@mui/material'

function TabsMaterial({
    arbitraryData,
    formId,
    item,
    parent,
    componentStore,
    parentId,
    name,
}: any) {
    const meta = useRef({
        isMounted: false,
        value: 0,
    })

    const [, setRefresh] = useState({})
    const { initField } = manageFormsState()

    useEffect(() => {
        const curr = meta.current
        curr.isMounted = true
        return () => {
            curr.isMounted = false
        }
    }, [])

    const controlId = parentId.concat('.', item.name) //unique controlId. It will always be same for same control

    const itemCount = item.items.length
    initField(parent, item.name, [])
    if (parent[item.name].length === 0) {
        for (let i = 0; i < itemCount; i++) {
            parent[item.name].push({})
        }
    }

    function TabsHeader() {
        return (
            <Tabs
                indicatorColor="primary"
                value={meta.current.value}
                className={clsx('x-tabs', item.class)}
                onChange={(e: any, newValue: any) => {
                    meta.current.value = newValue
                    arbitraryData.selectedTab = newValue
                    meta.current.isMounted && setRefresh({})
                }}>
                {itemCount > 0 &&
                    item.items.map((it: any, index: number) => {
                        // const isError: boolean =
                        //     arbitraryData[it?.tabName || '']?.isError ||
                        //     arbitraryData[it?.tabName || '']?.summary?.isError
                        return (
                            <Tab
                                label={it.tabLabel || it.label}
                                key={index}
                                style={{ ...it.style }}
                            />
                        )
                    })}
            </Tabs>
        )
    }

    function TabPages() {
        return (
            <>
                {itemCount > 0 &&
                    item.items.map((it: any, index: number) => {
                        const holder = parent[item.name][index]
                        const Tag = componentStore[it.type]
                        return (
                            <Card
                                key={index}
                                className="x-tab-page"
                                hidden={meta.current.value !== index}>
                                <Tag
                                    arbitraryData={arbitraryData}
                                    // name is entityName
                                    name={name}
                                    item={it}
                                    formId={formId}
                                    parent={holder}
                                    componentStore={componentStore}
                                    parentId={controlId}
                                />
                            </Card>
                        )
                    })}
            </>
        )
    }

    return (
        <div>
            <TabsHeader></TabsHeader>
            <TabPages></TabPages>
        </div>
    )
}

export { TabsMaterial }
