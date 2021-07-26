import React, { useEffect, useState, useMemo, useLayoutEffect } from 'react'
import { DataGrid, GridToolbar,  } from '@material-ui/data-grid'
import { interval } from 'rxjs'
import { XGrid, useGridApiRef } from '@material-ui/x-grid'
import mock from '../data/mockData.json'
import { randomInt, randomUserName } from '@material-ui/x-grid-data-generator'

function Component5() {
    const [, setRefresh] = useState({})
    const apiRef: any = useGridApiRef()
    React.useEffect(() => {
        const subscription = interval(200).subscribe(() => {
            apiRef.current.updateRows([
                {
                    id: randomInt(1, 20),
                    full_name: randomUserName(),
                    debits: randomInt(10, 80),
                },
                {
                    id: randomInt(1, 4),
                    full_name: randomUserName(),
                    credits: randomInt(10, 80),
                },
            ])
        })

        return () => {
            subscription.unsubscribe()
        }
    }, [apiRef])

    const columns = [
        { field: 'id', headerName: 'Id', width: 90 },
        { field: 'full_name', headerName: 'Full name', width: 150 },
        { field: 'email', headerName: 'Email' },
        { field: 'debits', headerName: 'Debits', type: 'number' },
        {
            field: 'credits',
            headerName: 'Credits',
            type: 'number',
            editable: true,
        },
    ]
    const rows = mock

    return (
        <div style={{ height: '80vh', width: '100%' }}>
            <XGrid
                apiRef={apiRef}
                rows={rows}
                columns={columns}
                checkboxSelection={true}
                // components={{
                //     Toolbar: GridToolbar
                // }}
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
