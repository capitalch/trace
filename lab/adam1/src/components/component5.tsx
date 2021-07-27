import React, {
    useEffect,
    useState,
    useMemo,
    useLayoutEffect,
    useRef,
} from 'react'
// import { DataGrid } from '@material-ui/data-grid'
import { interval } from 'rxjs'
import {Checkbox} from '@material-ui/core'
import { XGrid, useGridApiRef, GridToolbar } from '@material-ui/x-grid'
// import { DataGrid, useGridApiRef, GridToolbar } from '@material-ui/data-grid'
import mock from '../data/mock-data.json'
import { randomInt, randomUserName } from '@material-ui/x-grid-data-generator'

function Component5() {
    const [, setRefresh] = useState({})
    const apiRef: any = useGridApiRef()
    const myRef: any = useRef(null)
    React.useEffect(() => {
        return () => {
            // subscription.unsubscribe()
        }
    }, [apiRef])

    const columns = [
        { field: 'id', headerName: 'Id', width: 90 },
        { field: 'full_name', headerName: 'Full name', width: 150 },
        { field: 'email', headerName: 'Email' },
        { field: 'debits', headerName: 'Debits', type: 'number', width: 150 },
        {
            field: 'credits',
            headerName: 'Credits',
            type: 'number',
            editable: true,
            width: 150,
        },
        {
            headerName: 'Edit / del',
            width: 100,
            field: '',
            renderCell: (params: any) => {
                // console.log(params)
                return (
                    <button
                        onClick={(e: any) => {
                            console.log(params)
                        }}>
                        Test
                    </button>
                )
            },
        },
    ]
    const rows = mock

    return (
        <div style={{ height: '90vh', width: '100%' }}>
            <XGrid
                apiRef={apiRef}
                rows={rows}
                columns={columns}
                checkboxSelection={true}
                onRowClick={(e: any, other: any) => {
                    // console.log(e)
                    // console.log(e.api.getSelectedRows())
                    // console.log(other.target.checked)
                }}
                // onSelectionChange = {(s:any)=>{
                //     console.log(s)
                // }}
                components={{
                    Toolbar: MyToolbar,
                    // Checkbox: MyCheckbox,
                    Footer: () => {
                        // console.log('a:', a, 'b:', b)
                        return <div>Working </div>
                    },
                }}
                onColumnResize={(e) => {
                    console.log('resized')
                }}
                hideFooterRowCount={false}
                hideFooterSelectedRowCount={false}
                // autoHeight={true}
                rowHeight={22}
            />
        </div>
    )
}

export { Component5 }

function MyCheckbox(){
    return <Checkbox color='secondary' />
}

function MyToolbar(){
    return <div style = {{display:'flex'}}>
        <button>Test</button>
        <GridToolbar />
        <label>Last:</label>
        <select></select>
    </div>
}
