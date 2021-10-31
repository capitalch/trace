import React, { useEffect, useState, useRef, useContext } from 'react'
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
// import { red } from '@material-ui/core/colors'
// import { TableFooter } from 'material-ui'

function Component7() {
    const [, setRefresh] = useState({})

    const { emit, debounceEmit, debounceFilterOn } = useIbuki()
    const testArr = [
        {
            name: 'aaa',
            clearDate: undefined
        },
        {
            name: 'bbb',
            clearDate: '2021-04-01'
        },
        {
            name: 'ccc',
            clearDate: '2021-03-31'
        },
        {
            name: 'ddd',
            clearDate: '2021-05-21'
        }
    ]
    return (
        <div>
            <Button color='primary' variant='contained' onClick={sortArray}>Test array sort</Button>
        </div>
    )

    function sortArray(){
        testArr.sort((a:any,b:any)=>{
            let ret = 0
            if(a.clearDate > b.clearDate){
                ret = 1
            }
            if(a.clearDate < b.clearDate){
                ret =-1
            }
            return(ret)
        })
        console.log(testArr)
    }
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
