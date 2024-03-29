import {
    accountsMessages, Add, Box, Button, DeleteForever, Edit, Grid, GridCellParams, IconButton, IMegaData, Link, MegaDataContext, PrimeColumn,
    Switch, SyncSharp, TextField, TreeTable, Typography, useConfirm, useContext, useRef, useState, useTheme, useEffect, useSharedElements, utils, utilMethods, useIbuki,
} from './redirect'

function useManageTags() {
    const [, setRefresh] = useState({})
    const { emit } = useIbuki()
    const theme = useTheme()
    const confirm = useConfirm()
    const megaData: IMegaData = useContext(MegaDataContext)
    const { execGenericView, genericUpdateMaster, genericUpdateMasterNoForm } = utilMethods()
    const meta = useRef({
        id: undefined,
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
        megaData.registerKeyWithMethod('render:manageTags', setRefresh)
        fetchData()
    }, [])

    async function fetchData() {
        await megaData.executeMethodForKey('fetchAllTags:categoriesMaster')
    }

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

        function doClose() {
            pre.showDialog = false
            megaData.executeMethodForKey('render:manageTags', {})
            setRefresh({})
        }

        function handleCancel() {
            pre.tagName = undefined
            doClose()
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

                emit('SHOW-LOADING-INDICATOR', false)
                await fetchData()
                ret && doClose()
            } catch (e: any) {
                emit('SHOW-LOADING-INDICATOR', false)
                console.log(e.message)
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
                    onClick={() => {
                        pre.id = params.row.id1
                        pre.tagName = params.row.tagName
                        pre.showDialog = true
                        pre.dialogConfig.content = ContentAddEditTag
                        pre.dialogConfig.title = 'Edit tag'
                        setRefresh({})
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
                    onClick={() => handleDeleteTag(params)}>
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
                '& .header-class': {
                    fontWeight: 'bold',
                    color: 'green',
                    fontSize: theme.spacing(1.8),
                },
            }
        )
    }

    function handleAddTag() {
        pre.showDialog = true
        pre.id = undefined
        pre.tagName = undefined
        pre.dialogConfig.content = ContentAddEditTag
        pre.dialogConfig.title = 'Add tag'
        setRefresh({})
    }

    async function handleDeleteTag(params: any) {
        const id = params.row.id1
        const options: any = {
            description: accountsMessages.deleteEntry,
            confirmationText: 'Yes',
            cancellationText: 'No',
        }
        confirm(options)
            .then(async () => {
                emit('SHOW-LOADING-INDICATOR', true)
                await genericUpdateMaster({
                    deletedIds: [id],
                    tableName: 'TagsM',
                })
                await fetchData()
                setRefresh({})
                emit('SHOW-LOADING-INDICATOR', false)
                emit('SHOW-MESSAGE', {})
            })
            .catch(() => {
                emit('SHOW-LOADING-INDICATOR', false)
            })
    }

    return ({ getColumns, getGridSx, handleAddTag, meta })
}
export { useManageTags }