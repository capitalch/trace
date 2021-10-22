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
    let userProfile = {
        name: 'Sushant',
        address: '92/2A Bidhannagar Road'
    }
    const { emit, debounceEmit, debounceFilterOn } = useIbuki()
    let myValue = 1
    return (
        <CounterContext.Provider value={myValue}>
            <Box sx={{ p: 2 }}>
                <Button variant='contained'
                    onClick={() => {
                        myValue = myValue + 1
                        // userProfile = {
                        //     name: 'Prashant',
                        //     address: 'VIP'
                        // }

                        // emit('REFRESH', null)
                    }}
                >Change name</Button>
                <SubComp7 />
            </Box>
        </CounterContext.Provider>
    )
}

function SubComp7() {
    const [, setRefresh] = useState({})
    const { emit, debounceEmit, debounceFilterOn } = useIbuki()

    useEffect(() => {
        const subs = debounceFilterOn('input').subscribe((d:any)=>{
            console.log(d.data)
        })
        return (() => {
            subs.unsubscribe()
        })
    }, [])
    return (<Box>
        <input onChange={(e: any) => {
            debounceEmit('input', e.target.value)
        }} />
    </Box>)
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
