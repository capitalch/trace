import React, { useEffect, useState, useRef, useContext, useCallback } from 'react'
import { DataGridPro, useGridApiRef } from '@mui/x-data-grid-pro'
// import Button from '@material-ui/core/Button'
import Snackbar from '@material-ui/core/Snackbar'
import MuiAlert from '@material-ui/lab/Alert'
import makeStyles from '@material-ui/styles/makeStyles'
import { useIbuki, Subject, debounceTime } from '../utils/ibuki'
import { Component8 } from './component8'
import { MyContext } from './my-context'
import { Box, Button, Paper, Theme, useTheme, Typography, Table, TableContainer, TableFooter, TableBody, TableRow, TableCell, TableHead } from '@material-ui/core'
import { border } from '@material-ui/system'
import { UserProfileProvider, UserProfileContext, CounterContext } from './user-profile-provider'
import { Subscription } from 'rxjs'
import {
    randomCreatedDate,
    randomTraderName,
    randomUpdatedDate,
} from '@mui/x-data-grid-generator'
// import { red } from '@material-ui/core/colors'
// import { TableFooter } from 'material-ui'

function Component7() {
    const [, setRefresh] = useState({})
    const apiRef = useGridApiRef()
    const { emit, debounceEmit, debounceFilterOn } = useIbuki()

    const meta: any = useRef({
        data: rows
    })

    // const handleEditRowsModelChange = useCallback((newModel:any)=>{
    //     const updatedModel = {...newModel}
    //     Object.keys(updatedModel).forEach((key:any)=>{
            // if(updatedModel[key].name.value){
            //     meta.current.data[key - 1].name = updatedModel[key].name.value
            // }
    //     })
    //     // setRefresh({})
    //     // console.log(meta)
    // }, [])

    function handleEditRowsModelChange(newModel:any){
        const updatedModel = {...newModel}
        Object.keys(updatedModel).forEach((key:any)=>{
            if(updatedModel[key]?.name?.value){
                meta.current.data[key - 1].name = updatedModel[key].name.value
            }
            if(updatedModel[key]?.dateCreated?.value){
                meta.current.data[key - 1].dateCreated = updatedModel[key].dateCreated.value
            }
        })
    }

    return (
        <div style={{ height: 400, width: '100%' }}>
            <DataGridPro rows={meta.current.data} columns={columns}
                onEditRowsModelChange={handleEditRowsModelChange}
                onCellClick={(item:any)=>{
                    // console.log(item)
                    apiRef.current.setCellMode(item.id, 'name', 'edit')
                    apiRef.current.setCellMode(item.id, 'dateCreated', 'edit')
                }}
                apiRef={apiRef}
            />
            <Button
                onClick={() => {
                    setRefresh({})
                }}
            >Test</Button>
        </div>
    )

    

    // function sortArray(){
    //     testArr.sort((a:any,b:any)=>{
    //         let ret = 0
    //         if(a.clearDate > b.clearDate){
    //             ret = 1
    //         }
    //         if(a.clearDate < b.clearDate){
    //             ret =-1
    //         }
    //         return(ret)
    //     })
    //     console.log(testArr)
    // }
}


const style = {
    width: '100%',
    padding: 2,
    '& .table': {
        margin: 4,
        border: '1px solid grey'
    },
    '& .header-row': {
        height: 2,
        border: '1px solid grey'
    },
    '& .MuiTableCell-root': {
        border: '1px solid grey'
    }
}

export { Component7 }

const columns = [
    { field: 'name', headerName: 'Name', width: 180, editable: true },
    { field: 'age', headerName: 'Age', type: 'number', editable: true },
    {
        field: 'dateCreated',
        headerName: 'Date Created',
        type: 'date',
        width: 180,
        editable: true,
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
