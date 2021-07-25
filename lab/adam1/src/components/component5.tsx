import React, { useEffect, useState, useMemo, useLayoutEffect } from 'react'
import { DataGrid, GridToolbar } from '@material-ui/data-grid'
import mock from '../data/mockData.json'

function Component5() {
    const [, setRefresh] = useState({})

    useEffect(() => {
        // console.log('use effect component 5')
    })

    const columns = [
        { field: 'id', headerName: 'Id', width: 90 },
        { field: 'full_name', headerName: 'Full name', width: 150 },
        { field: 'email', headerName: 'Email' },
        { field: 'debits', headerName: 'Debits', type:'number'},
        { field: 'credits', headerName: 'Credits' , type:'number', editable: true}
    ]
    const rows = mock

    return <div style={{ height: '80vh', width: '100%' }}>
        <DataGrid
            rows={rows}
            columns={columns}
            checkboxSelection={true}
            components={{
                Toolbar: GridToolbar
            }}
            hideFooterRowCount={false}
            hideFooterSelectedRowCount={false}
            autoHeight={true}
        />
    </div>
}

export { Component5 }