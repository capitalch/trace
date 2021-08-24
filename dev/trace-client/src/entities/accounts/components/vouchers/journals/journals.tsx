import React, { useState, useEffect, useRef } from 'react'
import { useSharedElements } from '../../common/shared-elements-hook'
import { useJournals, useStyles } from './journals-hook'
import { JournalMain } from './journal-main'
import { JournalView } from './journal-view'

function Journals() {
    const classes = useStyles()
    const { arbitraryData, handleOnTabChange, meta, setRefresh } = useJournals()

    const {        
        Tab,
        Tabs,
        Typography,
    } = useSharedElements()

    return (
        <div className={classes.content}>
            <Typography component="div" variant="subtitle1" color="secondary">
                {meta.current.title}
            </Typography>
            <Tabs
                className="tabs"
                indicatorColor="secondary"
                onChange={handleOnTabChange}
                value={meta.current.tabValue}>
                <Tab className="tab" label="New / Edit" />
                <Tab label="View" />
            </Tabs>
            <JournalMain
                arbitraryData={arbitraryData.current}
                hidden={meta.current.tabValue !== 0}
            />
            <JournalView hidden={meta.current.tabValue !== 1} />
        </div>
    )
}

export { Journals }
