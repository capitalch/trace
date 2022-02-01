import React, { useEffect, useState, useRef, useContext } from 'react'
import { Component8 } from './component8'
import { useIbuki } from '../utils/ibuki'
import { DataGridPro, GridToolbarContainer, useGridApiRef } from '@mui/x-data-grid-pro'
import { Box, Button } from '@mui/material'
import { Checkbox, IconButton, TextField} from '@mui/material'
import { SpaceBarRounded } from '@mui/icons-material'
import {
    CropDinSharp,
    CheckBoxOutlineBlankSharp,
    CheckBoxSharp,
    CloseSharp,
    Search,
} from '@mui/icons-material'
// import { Row } from 'react-data-grid'

function Component6() {
    const [, setRefresh] = useState({})
    const meta: any = useRef({
        isChecked: false,
        lastId: undefined,
        rows: [],
    })
    const apiRef: any = useGridApiRef()
    let count = 0

    const columns: any[] = [
        {
            headerName: '#',
            field: 'id',
            width: 80,
        },
        {
            headerName: 'Control Name',
            field: 'controlName',
            type: 'string',
            editable: true,
        },
        {
            headerName: 'Active',
            field: 'isActive',
            type: 'boolean',
            editable: true,
            // valueSetter:(params: any)=>{
            //     params.value = params.row.isActive
            // },
            renderEditCell: (params: any) => {
                return (
                    <Checkbox
                        checked={params.value}
                        onChange={(e: any) => {
                            params.row.isActive = e.target.checked
                            apiRef.current.setEditCellValue({
                                id: params.row.id,
                                field: 'isActive',
                                value: e.target.checked,
                            })
                        }}
                    />
                )
            },
        },
    ]

    useEffect(() => {
        meta.current.rows = [
            { id: 1, controlName: 'control1', isActive: false },
            { id: 2, controlName: 'control2', isActive: false },
            { id: 3, controlName: 'control3', isActive: false },
            { id: 4, controlName: 'control4', isActive: false },
            { id: 5, controlName: 'control5', isActive: false },
            { id: 6, controlName: 'control6', isActive: false },
        ]
        // for (let item of meta.current.rows) {
        // apiRef.current.setCellMode(1, 'isActive', 'edit')            
        // }
        setRefresh({})
    }, [])

    function handleClick() {
        console.log(meta.current.rows)
    }

    const handleCellFocusOut = React.useCallback((params, event) => {
        if (params.cellMode === 'edit' && event) {
            event.defaultMuiPrevented = true;
        }
    }, [])

    // Prevent from rolling back on escape
    const handleCellKeyDown = React.useCallback((params, event) => {
        if (['Escape', 'Delete', 'Backspace', 'Enter'].includes(event.key)) {
            event.defaultMuiPrevented = true;
        }
    }, [])

    const handleCellClick = React.useCallback((params) => {
        apiRef.current.setCellMode(
            params.row.id,
            'isActive',
            'edit'
        )
    }, [])

    const handleDoubleCellClick = React.useCallback((params, event) => {
        event.defaultMuiPrevented = true;
    }, [])


    return (
        <Box sx={{ mt: 5, ml: 5 }}>
            <Button
                color="secondary"
                variant="contained"
                onClick={handleClick}
                sx={{ mb: 5 }}>
                Submit
            </Button>
            <DataGridPro
                apiRef={apiRef}
                columns={columns}
                components={{
                    Toolbar: CustomGridToolbar,
                    BooleanCellFalseIcon: CheckBoxOutlineBlankSharp,
                    BooleanCellTrueIcon: CheckBoxSharp,
                }}

                rows={meta.current.rows}
                sx={{
                    width: '80vw',
                    height: '80vh',
                }}

                onCellFocusOut={handleCellFocusOut}
                onCellKeyDown={handleCellKeyDown}
                onCellClick={handleCellClick}
                onCellDoubleClick={handleDoubleCellClick}
            />
        </Box>
    )

    function CustomGridToolbar() {
        return (<GridToolbarContainer>
            <Box sx={{ m: 1, display: 'flex', 'columnGap': 1, justifyContent:'flex-end', width:'100%' }}>
                <Button size='small' sx={{width: 20}} color='warning' variant='contained' onClick={handleButtonClick}>Base</Button>
                <Button color='primary' variant='contained'>Operator</Button>
                <Button color='secondary' variant='contained'>Accountant</Button>
                <Button color='success' variant='contained'>Manager</Button>
                <TextField
                            variant="standard"
                            size='small'
                            sx={{width: 250}}
                            value={meta.current.textSearchValue}
                            // onChange={handleTextSearchValueChange}
                            placeholder="Search…"
                            InputProps={{
                                startAdornment: <Search fontSize="small" />,
                                endAdornment: (
                                    <IconButton
                                        title="Clear"
                                        aria-label="Clear"
                                        size="small"
                                        // onClick={handleTextSearchClear}
                                        >
                                        <CloseSharp fontSize="small" />
                                    </IconButton>
                                ),
                            }}
                        />
            </Box>
        </GridToolbarContainer>)
    }

    function handleButtonClick(e: any){
        console.log(e)
    }



    function incr() {
        return ++count
    }
}

export { Component6 }

// onCellFocusOut={(params:any, event:any)=>{
//     apiRef.current.setCellMode(params.row.id, 'isActive', 'view')

// }}
// onCellClick={(params, event) => {
// apiRef.current.setCellMode(
//     params.row.id,
//     'isActive',
//     'edit'
// )
// }}
// isCellEditable={(params) => true}
//    onCellClick={(params, event) => {
//     if (params.field === 'isActive') {
//         if(meta.current.lastId){
//             const lastId = meta.current.lastId
//             if(lastId !== params.row.id){
//                 apiRef.current.setCellMode(lastId, 'isActive', 'view')
//                 apiRef.current.setEditCellValue(params)
//                 // apiRef.current.commitCellChange(lastId)
//             }

//         } else {
//             apiRef.current.setCellMode(params.row.id, 'isActive', 'edit')
//         }
//         meta.current.lastId = params.row.id
//     }
// }}