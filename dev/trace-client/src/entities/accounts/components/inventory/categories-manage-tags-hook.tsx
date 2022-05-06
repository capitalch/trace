import {
    Add, Box, Button, DeleteForever, Edit, Grid, GridCellParams, IconButton, Link, PrimeColumn,
    Switch, SyncSharp, TextField, TreeTable, Typography, useRef, useState, useTheme, useEffect, useSharedElements, utils, utilMethods, useIbuki,
} from './redirect'

function useManageTags() {
    const [, setRefresh] = useState({})
    const { emit } = useIbuki()
    const theme = useTheme()
    const { execGenericView, genericUpdateMasterNoForm } = utilMethods()
    const meta = useRef({
        id: undefined,
        allRows: [],
        filteredRows: [],
        showDialog: false,
        tagName: undefined,
        dialogConfig: {
            title: '',
            content: () => <></>,
            maxWidth: 'xs'
        }
    })
    const pre = meta.current

    useEffect(() => {
        fetchData()
    }, [])

    async function fetchData() {
        emit('SHOW-LOADING-INDICATOR', true)
        const rows = await execGenericView({
            isMultipleRows: true,
            sqlKey: 'get_tags',
        }) || []
        setId(rows)
        pre.allRows = rows
        pre.filteredRows = rows.map((x: any) => ({ ...x })) //its faster
        emit('SHOW-LOADING-INDICATOR', false)
        setRefresh({})

        function setId(rows: any[]) {
            let count = 1
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
                width: 65,
            },
            {
                headerName: 'E',
                description: 'Edit',
                disableColumnMenu: true,
                disableExport: true,
                disablePrint: true,
                disableReorder: true,
                filterable: false,
                hideSortIcons: true,
                resizable: false,
                width: 20,
                field: '1',
                renderCell: (params: GridCellParams) => <IconButton
                    size="small"
                    color="secondary"
                    // disabled={options.isEditDisabled}
                    onClick={() => {
                        pre.id = params.row.id1
                        pre.tagName = params.row.tagName
                        pre.showDialog = true
                        pre.dialogConfig.content = ContentAddEditTag
                        pre.dialogConfig.title = 'Add tag'
                        setRefresh({})
                        // gridActionMessages.editIbukiMessage &&
                        //     emit(
                        //         gridActionMessages.editIbukiMessage,
                        //         params
                        //     )
                    }}
                    aria-label="Edit">
                    <Edit />
                </IconButton>
            },
            {
                headerName: 'D',
                description: 'Delete',
                disableColumnMenu: true,
                disableExport: true,
                disablePrint: true,
                disableReorder: true,
                filterable: false,
                hideSortIcons: true,
                resizable: false,
                width: 20,
                field: '2',
                renderCell: (params: GridCellParams) => <IconButton
                    size="small"
                    color="error"
                    // disabled={options.isEditDisabled}
                    onClick={() => {
                        
                        // gridActionMessages.editIbukiMessage &&
                        //     emit(
                        //         gridActionMessages.editIbukiMessage,
                        //         params
                        //     )
                    }}
                    aria-label="Edit">
                    <DeleteForever />
                </IconButton>
            },
            {
                headerName: 'Tag name',
                headerClassName: 'header-class',
                description: 'Tag name',
                field: 'tagName',
                width: 150,
            },
        ])
    }

    function getGridSx() {
        return (
            {
                p: 1,
                width: '100%',
                fontSize: theme.spacing(1.7),
                minHeight: theme.spacing(70),
                // height: 'calc(100vh - 230px)',
                // fontFamily: 'sans-serif',
                // '& .footer-row-class': {
                //     backgroundColor: theme.palette.grey[300]
                // },
                '& .header-class': {
                    fontWeight: 'bold',
                    color: 'green',
                    fontSize: theme.spacing(1.8),
                },
                // '& .grid-toolbar': {
                //     width: '100%',
                //     paddingBottom: theme.spacing(0.5),
                //     borderBottom: '1px solid lightgrey',
                //     display: 'flex',
                //     flexDirection: 'column',
                //     alignItems: 'start'
                // },
                // '& .row-sales-return': {
                //     color: theme.palette.error.light
                // },
                // '& .row-loss': {
                //     color: theme.palette.error.main
                // },
                // '& .row-jakar': {
                //     color: 'dodgerBlue'
                // }
            }
        )
    }

    function handleAddEditTag() {
        pre.showDialog = true
        pre.dialogConfig.content = ContentAddEditTag
        pre.dialogConfig.title = 'Add tag'
        setRefresh({})

        function ContentAddEditTag() {
            const [, setRefresh] = useState({})
            return (<Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <TextField
                    onChange={(e: any) => {
                        pre.tagName = e.target.value
                        setRefresh({})
                    }}
                    autoComplete='off'
                    error={!!!pre.tagName}
                    label='Tag name'
                    variant='standard'
                    value={pre.tagName || ''}
                />
                <Box sx={{ display: 'flex', columnGap: 1, ml: 'auto', mt: 2 }}>
                    <Button size='small' variant='contained' color='primary' onClick={handleCancel}>Cancel</Button>
                    <Button disabled={!!!pre.tagName} size='small' variant='contained' color='secondary' onClick={handleSubmit}>Submit</Button>
                </Box>
            </Box>)
        }

        function handleCancel() {
            pre.tagName = undefined
            doClose()
        }

        function doClose() {
            pre.showDialog = false
            setRefresh({})
        }

        async function handleSubmit() {
            try {
                emit('SHOW-LOADING-INDICATOR', true)
                const ret = await genericUpdateMasterNoForm({
                    tableName: 'TagsM',
                    data: {
                        id: pre.id || undefined,
                        tagName: pre.tagName || undefined
                    }
                })
                ret && doClose()
                emit('SHOW-LOADING-INDICATOR', false)
                fetchData()
            } catch (e: any) {
                emit('SHOW-LOADING-INDICATOR', false)
                console.log(e.message)
            }
        }

    }

    return ({ getColumns, getGridSx, handleAddEditTag, meta })
}
export { useManageTags }