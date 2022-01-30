import React, { useEffect, useState, useRef, useContext } from 'react'
import { Component8 } from './component8'
import { useIbuki } from '../utils/ibuki'
import { DataGridPro, useGridApiRef } from '@mui/x-data-grid-pro'
import { Checkbox } from '@mui/material'
import { SpaceBarRounded } from '@mui/icons-material'
import {CropDinSharp, CheckBoxOutlineBlankSharp, CheckBoxSharp} from '@mui/icons-material';
import NotificationPersonalVideo from 'material-ui/svg-icons/notification/personal-video'

function Component6() {
    const [, setRefresh] = useState({})
    const meta = useRef({
        isChecked: false,
        lastId: undefined
    })
    const apiRef: any = useGridApiRef()
    let count = 0
    const rows: any[] = [
        { id: 1, controlName: 'control1', isActive: true },
        { id: 2, controlName: 'control2', isActive: false },
        { id: 3, controlName: 'control3', isActive: true },
        { id: 4, controlName: 'control4', isActive: false },
        { id: 5, controlName: 'control5', isActive: true },
        { id: 6, controlName: 'control6', isActive: false },
    ]
    const columns = [{
        headerName: '#',
        field: 'id',
        width: 80
    },
    {
        headerName: 'Control Name',
        field: 'controlName',
        type: 'string',
        editable: true
    },
    {
        headerName: 'Active',
        field: 'isActive',
        type: 'boolean',
        // renderEditCell: (params: any) => {
        //     return (<Checkbox
        //         checked={params.value}
        //     // value={params.isActive}
        //     // onChange={(e: any) => {
        //     //     // params.row.isActive = !params.row.isActive
        //     //     params.value = e.target.checked
        //     //     setRefresh({})
        //     // }}
        //     />)
        // },
        editable: true
    }]
    
    useEffect(() => {
        // for (let item of rows) {
        //     apiRef.current.setCellMode(item.id, 'isActive', 'edit')
        // }
        // apiRef.current.forceUpdate()
    }, )
    return (
        <DataGridPro
            apiRef={apiRef}

            columns={columns}
            components={{
                BooleanCellFalseIcon: CheckBoxOutlineBlankSharp,
                BooleanCellTrueIcon: CheckBoxSharp
            }}
            rows={rows}
            sx={{
                width: '80vw',
                height: '80vh',
                mt: 5,
                ml: 5
            }}
           
            onCellClick={(params, event) => {
                if (params.field === 'isActive') {
                    if(meta.current.lastId){
                        const lastId = meta.current.lastId
                        if(lastId !== params.row.id){
                            apiRef.current.setCellMode(lastId, 'isActive', 'view')
                            apiRef.current.setEditCellValue(params)
                            // apiRef.current.commitCellChange(lastId)
                        }
                        
                    }
                    meta.current.lastId = params.row.id
                    apiRef.current.setCellMode(params.row.id, 'isActive', 'edit')
                   
                }
            }}
            // onCellFocusOut={(params)=>{
            //     apiRef.current.setCellMode(params.row.id, 'isActive', 'view')
            //     apiRef.current.forceUpdate()
            // }}
        />
    )

    function incr() {
        return (++count)
    }


}

export { Component6 }
