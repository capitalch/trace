import React, { useEffect, useRef, useState, useCallback } from 'react'
import moment from 'moment'
import { Button, TextField } from '@material-ui/core'
import {InputMask} from 'primereact/inputmask'
// import InputMask from 'react-input-mask'
import { useGlobal } from '../utils/global-hook'
import { Component9 } from './component9'
import { DataGridPro, useGridApiRef, GridApi } from '@mui/x-data-grid-pro'
import { DataGrid } from '@mui/x-data-grid'
import {
    randomCreatedDate,
    randomTraderName,
    randomUpdatedDate,
  } from '@mui/x-data-grid-generator'
  const dateFormat = 'DD/MM/YYYY'
  const isoDateFormat = 'YYYY-MM-DD'
function Component8() {
    const { registerEntry, getValue, setValue } = useGlobal()
    const [editRowsModel, setEditRowsModel] = useState({})
    const [, setRefresh] = useState({})
    
    const apiRef: any = useGridApiRef()
    const meta: any = useRef({
        allRows: [],
    })

    useEffect(() => {
        meta.current.allRows = data
        setRefresh({})
    }, [])

    const handleEditRowsModelChange = useCallback((newModel: any) => {
        const allRows: any[] = meta.current.allRows
        Object.keys(newModel).forEach((key: any) => {
            if (newModel[key]?.clearDate?.value) {
                const foundRow = allRows.find((x: any) => x.id === +key)
                const clearDate = newModel[key].clearDate.value
                foundRow.clearDate = moment(clearDate).format(isoDateFormat)
                foundRow.isDataChanged = true
            }
        })
        setEditRowsModel(newModel)
    }, [])

    return (
        <div style={{ height: '300px', padding: '1rem' }}>
            <Button
                variant="contained"
                size="small"
                onClick={() => {
                    console.log(meta.current.allRows)
                }}>
                Submit
            </Button>
            <DataGrid
                style={{ height: '100%' }}
                // apiRef={apiRef}
                columns={getColumns()}
                rows={meta.current.allRows}
                // editRowsModel={editRowsModel}
                // onEditRowsModelChange={handleEditRowsModelChange}
            />
        </div>
    )

    
    function getColumns() {
        return [
            {
                headerName: 'Name',
                field: 'name',
                width: 150,
            },
            {
                headerName: 'Remarks',
                field: 'remarks',
                width: 150,
                editable: true,
            },
            {
                headerName: 'Tran date',
                field: 'tranDate',
                width: 160,
                type: 'date',
                valueFormatter: (params: any) =>
                    params.value ? moment(params.value).format(dateFormat) : '',
            },
            {
                headerName: 'Clear date',
                field: 'clearDate',
                width: 160,
                // type: 'date',
                editable: true,
                renderEditCell: (params: any) => {
                    return (
                        // <InputMask
                        // mask='99/99/9999'
                        // value = {params.row.clearDate}
                        // onChange = {
                        //     (e:any)=>{
                        //         const allRows: any[] = meta.current.allRows
                        //         const row = params.row
                        //         const idx = allRows.findIndex(
                        //             (x: any) => x.id === row.id
                        //         )
                        //         allRows[idx].clearDate = e.value
                        //         const api: any = params.api
                        //         api.setEditCellValue(
                        //             {
                        //                 id: params.row.id,
                        //                 field: 'clearDate',
                        //                 value: e.value,
                        //             },
                        //             e
                        //         )
                        //         setRefresh({})
                        //     }
                        // }
                        // />
                        <TextField                            
                            type="date"
                            variant="standard"
                            size="small"
                            value={params.row.clearDate}
                            onFocus={(e) => e.target.select()}
                            onChange={(e: any) => {
                                const allRows: any[] = meta.current.allRows
                                const row = params.row
                                const idx = allRows.findIndex(
                                    (x: any) => x.id === row.id
                                )
                                allRows[idx].clearDate = e.target.value
                                row.clearDate = e.target.value
                                const api: any = params.api
                                api.setEditCellValue(
                                    {
                                        id: params.row.id,
                                        field: 'clearDate',
                                        value: e.target.value,
                                    },
                                    e
                                )

                                setRefresh({})
                            }}
                        />
                    )
                },

                valueFormatter: (params: any) =>
                    params.value ? moment(params.value).format(dateFormat) : '',
                valueGetter: (params: any) => {
                    return params.value
                        ? (moment(params.value).format(isoDateFormat)) || params.value
                        : ''
                },
                valueSetter: (params: any) => {
                    params.row.clearDate = params.value
                    return { ...params.row }
                },
            },
        ]
    }
}
export { Component8 }

const data = [
    {
        id: 1,
        name: 'aaa1',
        remarks: 'remarks1',
        tranDate: '2021-04-01',
        clearDate: randomCreatedDate(),
    },
    {
        id: 2,
        name: 'aaa2',
        remarks: 'remarks2',
        tranDate: '2021-04-02',
        clearDate: randomCreatedDate(),
    },
    {
        id: 3,
        name: 'aaa3',
        remarks: 'remarks3',
        tranDate: '2021-04-03',
        clearDate: randomCreatedDate(),
    },
    {
        id: 4,
        name: 'aaa4',
        remarks: 'remarks4',
        tranDate: '2021-04-04',
        clearDate: '',
    },
]

const columns = [
    { field: 'name', headerName: 'Name', width: 180, editable: true },
    { field: 'age', headerName: 'Age', type: 'number', editable: true },
    {
      field: 'dateCreated',
      headerName: 'Date Created',
      type: 'date',
      width: 180,
      editable: true,
      valueFormatter: (params: any) =>
                    params.value ? moment(params.value, isoDateFormat).format(dateFormat) : '',
    },
    {
      field: 'lastLogin',
      headerName: 'Last Login',
      type: 'dateTime',
      width: 220,
      editable: true,
    },
  ];
  
  const rows = [
    {
      id: 1,
      name: randomTraderName(),
      age: 25,
      dateCreated: randomCreatedDate(),
      lastLogin: randomUpdatedDate(),
    },
    {
      id: 2,
      name: randomTraderName(),
      age: 36,
      dateCreated: randomCreatedDate(),
      lastLogin: randomUpdatedDate(),
    },
    {
      id: 3,
      name: randomTraderName(),
      age: 19,
      dateCreated: randomCreatedDate(),
      lastLogin: randomUpdatedDate(),
    },
    {
      id: 4,
      name: randomTraderName(),
      age: 28,
      dateCreated: randomCreatedDate(),
      lastLogin: randomUpdatedDate(),
    },
    {
      id: 5,
      name: randomTraderName(),
      age: 23,
      dateCreated: randomCreatedDate(),
      lastLogin: randomUpdatedDate(),
    },
  ];

