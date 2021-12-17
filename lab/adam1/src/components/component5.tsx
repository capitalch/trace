import React, {
    useEffect,
    useState,
    useMemo,
    useLayoutEffect,
    useRef,
} from 'react'
import _ from 'lodash'
// import { DataGrid } from '@material-ui/data-grid'
import { interval } from 'rxjs'
import { Checkbox } from '@material-ui/core'
import {
    XGrid,
    useGridApiRef,
    GridToolbar,
    GridCellParams,
} from '@material-ui/x-grid'
// import { DataGrid, useGridApiRef, GridToolbar } from '@material-ui/data-grid'
import mock from '../data/mock-data.json'
// import { randomInt, randomUserName } from '@material-ui/x-grid-data-generator'
let rows: any[] = []
function Component5() {
    const [, setRefresh] = useState({})
    const apiRef: any = useGridApiRef()
    const myRef: any = useRef(null)
    
    React.useEffect(() => {
        rows = mock
        setRefresh({})
        return () => {
            // subscription.unsubscribe()
        }
    }, [])

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
    addColumn()


    return (
        <div style={{ height: '90vh', width: '100%' }}>
            <XGrid
                apiRef={apiRef}
                rows={rows}
                columns={columns}
                checkboxSelection={true}
                onRowClick={(e: any, other: any) => {
                }}
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

    function removeRow(params: any) {
        // const idx = params['row']['index']
        const id = params.id
        const temp = [...rows]
        _.remove(temp,(x:any)=>x.id === id)
        // const temp = _.remove([...rows],(x:any)=>x.id === id)
        rows = temp
        setRefresh({})
    }

    function addColumn() {
        const removeColumn = {
            headerName: 'R',
            disableColumnMenu: true,
            disableExport: true,
            disableReorder: true,
            filterable: false,
            hideSortIcons: true,
            // resizable: false,
            width: 20,
            field: '0',
            renderCell: (params: GridCellParams) => {
                return (
                    <button
                        onClick={() => removeRow(params)}
                        aria-label="close">Rem</button>
                )
            },
        }
        columns.unshift(removeColumn)
    }
}

export { Component5 }

function MyCheckbox() {
    return <Checkbox color="secondary" />
}

function MyToolbar() {
    return (
        <div style={{ display: 'flex' }}>
            <button onClick={accum}>Test</button>
            <GridToolbar />
            <label>Last:</label>
            <select></select>
        </div>
    )

    function accum(){
        const cols = ['debit', 'credit']
        const props: any = {selectedSummary:{
            count:0,
            debit: 1000,
            credit: 2000
        }, filteredSummary:{
            count:10,
            debit: 100,
            credit: 20000
        }, allSummary:{
            count:44,
            debit: 10000,
            credit: 20000
        }}
        const markupArray =  cols.map((item:any)=>{
            return(
                <div>
                    {item}{' '}
                    <b>{props.selectedSummary[item]}</b>&nbsp;&nbsp;
                </div>
            )
        })
        const markup = markupArray.join('')
        console.log(markup)
    }
}
