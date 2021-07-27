import _ from 'lodash'
import Paper from '@material-ui/core/Paper'
import React, { useState, useEffect } from 'react'
import { Grid, Table, TableHeaderRow,  TableSummaryRow } from '@devexpress/dx-react-grid-material-ui'
// import { List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core'
// import { Send } from '@material-ui/icons'
// import mock from '../data/mockData.json'

import './component4.scss'

import { Button } from '@material-ui/core'
import {  IntegratedSummary, SummaryState } from '@devexpress/dx-react-grid'

const Component4 = () => {
    const [, setRefresh] = useState({})
    useEffect(() => {
    }, [])

    const columns = [
        { name: 'id', title: 'Id' },
        { name: 'full_name', title: 'Full name' },
        { name: 'email', title: 'Email' },
        { name: 'debits', title: 'Debits' },
        { name: 'credits', title: 'Credits' }
    ]
    // const rows = mock

    const columnExtensions: any = [{ columnName: 'id', width: 20, align: 'center' },
    { columnName: 'full_name', width: '10rem', wordWrapEnabled: true },
    { columnName: 'debits', width: '50rem', align: 'right' },
    { columnName: 'credits', width: '50rem', align: 'right' },
    ]

    return (
        <Paper>
            {/* <Grid rows={rows} columns={columns} >
                <SummaryState totalItems={[
                    {
                        columnName: 'debits',
                        type: 'sum'
                    },
                    {
                        columnName: 'credits',
                        type: 'sum'
                    }
                ]} />
                <IntegratedSummary />
                <Table columnExtensions={columnExtensions} />
                <TableHeaderRow />

                <TableSummaryRow />
            </Grid> */}
        </Paper>
    )
}

export { Component4 }
