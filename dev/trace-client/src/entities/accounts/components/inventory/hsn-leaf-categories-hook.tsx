import { Input, NumberFormat, TextField, useTheme, useEffect, useGridApiRef, useIbuki, useRef, useState, utilMethods } from './redirect'
function useHsnLeafCategories({ apiRef }: any) {
    const [, setRefresh] = useState({})
    const meta: any = useRef({
        allRows: [],
        isDataChanged: false,
    })

    const pre = meta.current
    const { emit } = useIbuki()
    const { execGenericView, genericUpdateMasterNoForm } = utilMethods()
    const theme = useTheme()

    useEffect(() => {
        fetchData()
    }, [])

    async function fetchData() {
        let count = 1
        emit('SHOW-LOADING-INDICATOR', true)
        const rows = await execGenericView({
            isMultipleRows: true,
            sqlKey: 'get_leaf_categories',
            args: {},
        }) || []
        setId(rows)
        pre.allRows = rows
        emit('SHOW-LOADING-INDICATOR', false)
        setRefresh({})

        function setId(rows: any[]) {
            for (const row of rows) {
                row.id1 = row.id
                row.id = incr()
            }
            function incr() {
                return (count++)
            }
        }
    }

    function getColumns() {
        return ([
            {
                headerName: '#',
                headerClassName: 'header-class',
                description: 'Index',
                field: 'id',
                width: 60,
            },
            {
                headerName: 'Leaf Category',
                headerClassName: 'header-class',
                description: 'Category',
                field: 'catName',
                width: 120,
            },
            {
                headerName: 'Hsn',
                headerClassName: 'header-class',
                description: 'Hsn',
                editable: true,
                field: 'hsn',
                width: 110,
                cellClassName: 'editable-column',
                // renderEditCell: (params: any) => {
                //     return (
                //         <TextField
                //             sx={{p:0, m:0,  width:'100%', height:'100%' }}
                //             // allowNegative={false}
                //             // customInput={TextField}
                //             onChange={setHsn}
                //             // onFocus={(e: any) => e.target.select()}
                //             value={params.row.hsn || null}
                //         />
                //         // <Input

                //         //     sx={{ fontSize: '0.8rem', width: '100%', }}
                //         //     value={params.row.clearDate}
                //         //     onKeyDown={(e: any) => {
                //         //         e.preventDefault() // disable edit from keyboard, it introduces error
                //         //     }}
                //         //     onChange={(e: any) => {
                //         //         setHsn(e)
                //         //     }}
                //         // />
                //     )
                //     function setHsn(e: any) {
                //         const value = e.target.value
                //         params.row.hsn = value
                //         pre.isDataChanged = true
                //         const id1 = params.row.id1
                //         const changedRow = pre.allRows.find((x: any) => x.id1 === id1)
                //         changedRow.hsn = value
                //         changedRow.isDataChanged = true
                //         const apiRef = pre.sharedData.apiRef
                //         apiRef.current.setEditCellValue({
                //             id: params.row.id,
                //             field: 'hsn',
                //             value: e.target.value || null,
                //         })
                //         setRefresh({})
                //     }
                // }
            },
            {
                headerName: 'Descr',
                headerClassName: 'header-class',
                description: 'Description',
                field: 'descr',
                width: 200,
                flex: 1,
            },
        ])
    }

    function getGridSx() {
        return (
            {
                minHeight: theme.spacing(40),
                '& .header-class': {
                    fontWeight: 'bold',
                    color: 'dodgerBlue',
                    backgroundColor: theme.palette.grey[100],
                    fontSize: theme.spacing(1.9),
                },
            }
        )
    }

    function handleCellClick(params: any) {
        // console.log(params)
        // const mode = apiRef.current.getCellMode({id: params.id, field: params.field})
        // if (params.field === 'hsn') {
        //     apiRef.current.startCellEditMode({ id: params.id, field: params.field })

        //     const nowMode = apiRef.current.getCellMode({id: params.id, field: params.field})
        //     console.log(nowMode)
        // }
    }

    function handleCellFocusOut(params: any) {
        // apiRef.current.stopCellEditMode({
        //     id: params.id,
        //     field: params.field,

        // })
    }

    async function handleSubmit() {
        const changedData = pre.allRows.filter((x: any) => x.isDataChanged).map((y: any) => ({
            id: y.id1,
            hsn: y.hsn
        }))
        const ret = await genericUpdateMasterNoForm({
            data: changedData,
            tableName: 'CategoryM',
        })
        if (ret) {
            pre.isDataChanged = false
            setRefresh({})
        }
    }

    async function processRowUpdate(newRow: any, oldRow: any) {
        if (oldRow.hsn !== newRow.hsn) {
            const changedRow = pre.allRows.find((x: any) => x.id1 === newRow.id1)
            changedRow.hsn = newRow.hsn
            changedRow.isDataChanged = true
            pre.isDataChanged = true
            setRefresh({})
        }
    }

    return ({ fetchData, getColumns, getGridSx, handleCellClick, handleCellFocusOut, handleSubmit, meta, processRowUpdate })

}
export { useHsnLeafCategories }