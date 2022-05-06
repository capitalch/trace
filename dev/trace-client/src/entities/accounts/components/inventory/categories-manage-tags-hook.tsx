import {
    Add, Box, Button, DeleteForever, Edit, Grid, IconButton, Link, PrimeColumn,
    Switch, SyncSharp, TextField, TreeTable, Typography, useRef, useState, useTheme, useEffect, useSharedElements, utils, utilMethods, useIbuki,
} from './redirect'

function useManageTags() {
    const [, setRefresh] = useState({})
    const { emit } = useIbuki()
    const theme = useTheme()
    const { execGenericView } = utilMethods()
    const meta = useRef({
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
            // args: {},
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

    function handleAddTag() {
        pre.showDialog = true
        pre.dialogConfig.content = ContentAddTag
        pre.dialogConfig.title = 'Add tag'
        setRefresh({})

        function ContentAddTag() {
            const [, setRefresh] = useState({})
            return (<Box sx={{ display: 'flex', flexDirection: 'vertical' }}>
                <TextField
                    onChange={(e: any) => {
                        pre.tagName = e.target.value
                        setRefresh({})
                    }}
                    autoComplete='off'
                    label='Tag name'
                    variant='standard'
                    value={pre.tagName || ''}
                />
                <Box sx={{ display: 'flex', columnGap: 1, ml:1 }}>
                    <Button size='small' variant='contained' color='primary'>Cancel</Button>
                    <Button size='small' variant='contained' color='secondary'>Save</Button>
                </Box>

            </Box>)
        }
    }

    return ({ getColumns, getGridSx, handleAddTag, meta })
}
export { useManageTags }