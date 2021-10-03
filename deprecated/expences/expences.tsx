import { useState } from 'react'
import { useSharedElements } from '../common/shared-elements-hook'
import { useExpences, useStyles } from './expences-hook'
import { ExpencesBody } from './expences-body'

function Expences() {
    const { arbitraryData, handleOnTabChange, meta, setRefresh } = useExpences()
    const { Tab, Tabs } = useSharedElements()
    const classes = useStyles()
    return (<div className={classes.content}>
        <Tabs
            className="tabs"
            indicatorColor="primary"
            onChange={handleOnTabChange}
            value={meta.current.tabValue}>
            <Tab label={meta.current.tabLabel} />
            <Tab label="View" />
        </Tabs>
        <div>
            <ExpencesBody arbitraryData={arbitraryData.current} />
        </div>
    </div>)
}

export { Expences }