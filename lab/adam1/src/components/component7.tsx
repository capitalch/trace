import React, { useEffect, useState, useRef } from 'react'
// import Button from '@material-ui/core/Button'
import Snackbar from '@material-ui/core/Snackbar'
import MuiAlert from '@material-ui/lab/Alert'
import makeStyles from '@material-ui/styles/makeStyles'
import { useIbuki } from '../utils/ibuki'
import { Component8 } from './component8'
import { MyContext } from './my-context'
import { Box, Button, Paper, Theme, useTheme, Typography, Table, TableContainer, TableFooter, TableBody, TableRow, TableCell, TableHead } from '@material-ui/core'
import { border } from '@material-ui/system'
// import { red } from '@material-ui/core/colors'
// import { TableFooter } from 'material-ui'

function Component7() {
    const [counter, setCounter] = useState(0)
    const theme = useTheme()
    return (
        // <Box sx={style}>

        <TableContainer sx={style}   >
            <Table className='table' size='medium'>
                <TableHead>
                    <TableRow className='header-row' >
                        <TableCell >
                            <Typography >Index</Typography>
                        </TableCell>
                        <TableCell><Typography >Label</Typography>
                        </TableCell>
                        <TableCell><Typography >Arguments</Typography>
                        </TableCell>
                        <TableCell><Typography >Exports</Typography></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {[1, 2, 3].map((item: any, index: number) => {
                        const obj: any = <TableRow key={index}>
                            <TableCell>
                                {index + 1}
                            </TableCell>
                            <TableCell>
                                <Button>Test</Button>
                            </TableCell>
                        </TableRow>
                        return (obj)
                    })}
                </TableBody>
                {/* <TableFooter>
                    <TableRow>
                        <TableCell>Count:</TableCell>
                    </TableRow>
                </TableFooter> */}
            </Table>
        </TableContainer>
        // </Box>
    )
}


const style = {
    width: '100%',
    padding: 2,
    '& .table': {
        margin: 4,
        border:'1px solid grey'
    },
    '& .header-row': {
        height:2,
        border:'1px solid grey'
    },
    '& .MuiTableCell-root':{
        border:'1px solid grey'
    }
}

export { Component7 }
