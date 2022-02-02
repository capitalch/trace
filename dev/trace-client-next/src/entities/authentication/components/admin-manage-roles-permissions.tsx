import {
    _,
    useCallback,
    useEffect,
    useRef,
    useState,
} from '../../../imports/regular-imports'
import { useSharedElements } from './shared-elements-hook'
import {
    Box,
    Button,
    Checkbox,
    DataGridPro,
    GridToolbarContainer,
    IconButton,
    Input,
    useGridApiRef,
} from '../../../imports/gui-imports'
import {
    CheckBoxOutlined,
    CheckBoxOutlineBlankSharp,
    CloseSharp,
    Search,
    SyncSharp,
} from '../../../imports/icons-import'
import { useCommonArtifacts } from './common-artifacts-hook'

function AdminManageRolesPermissions({
    node,
    getPermissionsAsJson,
    handleCloseDialog,
}: {
    node: any
    getPermissionsAsJson: any
    handleCloseDialog: any
}) {
    const [, setRefresh] = useState({})
    let count: number = 0
    const meta = useRef({
        textSearchValue: '',
        permissionsConfig: {
            allRows: [],
            rows: [],
            isSubmitDisabled: true,
        },
    })
    const apiRef: any = useGridApiRef()
    const perm: any = meta.current.permissionsConfig
    const {
        debounceEmit,
        debounceFilterOn,
        emit,
        getLoginData,
    } = useSharedElements()
    const { doSubmit, gridActionMessages } = useCommonArtifacts()
    useEffect(() => {
        const subs1 = debounceFilterOn(
            'MANAGE-ROLES-HOOK-DEBOUNCE-PERMISSIONS-GLOBAL-SEARCH'
        ).subscribe((d: any) => {
            requestSearch(d.data)
        })
        doRefresh()
        return () => {
            subs1.unsubscribe()
        }
    }, [])

    const columns = [
        {
            headerName: '#',
            field: 'id',
            width: 60,
        },
        {
            headerName: 'Control name',
            width: 200,
            field: 'controlName',
        },
        {
            headerName: 'Active',
            width: 80,
            field: 'isActive',
            type: 'boolean',
            editable: true,
            cellClassName: 'active-cell',
            headerClassName: 'active-cell',
            renderEditCell: (params: any) => {
                return (
                    <Checkbox
                        checked={params.value}
                        onChange={(e: any) => {
                            perm.isSubmitDisabled = false
                            params.row.isActive = e.target.checked
                            const temp = perm.allRows.find(
                                (x: any) => x.id === params.row.id
                            )
                            temp && (temp.isActive = e.target.checked)
                            apiRef.current.setEditCellValue({
                                id: params.row.id,
                                field: 'isActive',
                                value: e.target.checked,
                            })
                            setRefresh({})
                        }}
                    />
                )
            },
        },
        {
            headerName: 'Description',
            width: 140,
            field: 'descr',
            flex: 1,
            description: 'Description',
        },
    ]

    const handleCellClick = useCallback((params) => {
        apiRef.current.setCellMode(params.row.id, 'isActive', 'edit')
    }, [])

    const handleCellFocusOut = useCallback((params, event) => {
        if (params.cellMode === 'edit' && event) {
            event.defaultMuiPrevented = true
        }
    }, [])

    const handleCellKeyDown = useCallback((params, event) => {
        if (['Escape', 'Delete', 'Backspace', 'Enter'].includes(event.key)) {
            event.defaultMuiPrevented = true
        }
    }, [])

    const handleDoubleCellClick = useCallback((params, event) => {
        event.defaultMuiPrevented = true
    }, [])

    return (
        <Box>
            <DataGridPro
                apiRef={apiRef}
                columns={columns}
                components={{
                    Toolbar: CustomGridToolbar,
                    BooleanCellFalseIcon: CheckBoxOutlineBlankSharp,
                    BooleanCellTrueIcon: CheckBoxOutlined,
                }}
                onCellClick={handleCellClick}
                onCellDoubleClick={handleDoubleCellClick}
                onCellFocusOut={handleCellFocusOut}
                onCellKeyDown={handleCellKeyDown}
                rows={perm.rows}
                showColumnRightBorder={true}
                showCellRightBorder={true}
                sx={{
                    height: '60vh',
                }}
            />
            <Button
                disabled={perm.isSubmitDisabled}
                sx={{ mt: 2, width: '100%' }}
                color="secondary"
                variant="contained"
                onClick={handleSubmit}>
                Submit
            </Button>
        </Box>
    )

    function CustomGridToolbar() {
        return (
            <GridToolbarContainer
                style={{
                    width: '100%',
                    display: 'flex',
                    columnGap: '0.25rem',
                    flexWrap: 'wrap',
                }}>
                <Button
                    size="small"
                    color="warning"
                    variant="contained"
                    onClick={() => handleToolbarButtonClick('base')}>
                    Base
                </Button>
                <Button
                    size="small"
                    color="primary"
                    variant="contained"
                    onClick={() => handleToolbarButtonClick('operator')}>
                    Operator
                </Button>
                <Button
                    size="small"
                    color="secondary"
                    variant="contained"
                    onClick={() => handleToolbarButtonClick('accountant')}>
                    Accountant
                </Button>
                <Button
                    size="small"
                    color="success"
                    variant="contained"
                    onClick={() => handleToolbarButtonClick('manager')}>
                    Manager
                </Button>
                <Input
                    autoFocus
                    sx={{
                        width: '100%',
                        minWidth: 150,
                        mt: 2,
                        ml: 1,
                        fontSize: 12,
                    }}
                    value={meta.current.textSearchValue}
                    onChange={handleTextSearchValueChange}
                    placeholder="Search …"
                    startAdornment={<Search fontSize="small" />}
                    endAdornment={
                        <IconButton
                            title="Clear"
                            aria-label="Clear"
                            size="small"
                            onClick={handleTextSearchClear}>
                            <CloseSharp fontSize="small" />
                        </IconButton>
                    }
                />
                <IconButton
                    size="small"
                    title="Refresh"
                    color="secondary"
                    onClick={handleParentRefresh}>
                    <SyncSharp />
                </IconButton>
            </GridToolbarContainer>
        )
    }

    function counter() {
        return ++count
    }

    function doRefresh() {
        resetCounter()
        if (_.isEmpty(node.permissions)) {
            perm.rows = []
        } else {
            perm.rows = node.permissions.map((item: any) => ({
                id: counter(),
                ...item,
            }))
            perm.allRows = perm.rows.map((item: any) => ({
                ...item,
            }))
        }
        setRefresh({})
    }

    function handleParentRefresh() {
        emit('ADMIN-MANAGE-ROLES-HOOK-JUST-REFRESH', '')
    }

    async function handleSubmit() {
        //remove id field from permissions
        const temp = perm.rows.map((item: any) => ({
            ...item,
            id: undefined,
        }))
        const data = {
            id: node.id1,
            permissions: JSON.stringify(temp),
        }
        await doSubmit({
            data: data,
            graphQlKey: 'genericUpdateMaster',
            tableName: 'ClientEntityRole',
            handleCloseDialog: handleCloseDialog,
        })
        // refresh the parent grid of roles
        emit(gridActionMessages.fetchIbukiMessage, {
            userId: getLoginData().id,
        })
    }

    function handleTextSearchClear() {
        meta.current.textSearchValue = ''
        requestSearch('')
    }

    function handleTextSearchValueChange(e: any) {
        meta.current.textSearchValue = e.target.value
        debounceEmit(
            'MANAGE-ROLES-HOOK-DEBOUNCE-PERMISSIONS-GLOBAL-SEARCH',
            meta.current.textSearchValue
        )
        setRefresh({})
    }

    async function handleToolbarButtonClick(btnType: string) {
        resetCounter()
        perm.isSubmitDisabled = false
        const temp = await getPermissionsAsJson(btnType)
        perm.rows = temp.map((item: any) => ({
            ...item,
            id: counter(),
        }))
        perm.allRows = perm.rows.map((item: any) => ({
            ...item,
        }))
        setRefresh({})
    }

    function resetCounter() {
        count = 0
    }

    function requestSearch(text: string) {
        if (text) {
            perm.rows = perm.allRows.filter((row: any) => {
                return Object.keys(row).some((field) => {
                    const temp: string = row[field] ? row[field].toString() : ''
                    return temp.toLowerCase().includes(text.toLowerCase())
                })
            })
        } else {
            perm.rows = perm.allRows.map((item: any) => ({ ...item }))
        }
        setRefresh({})
    }
}

export { AdminManageRolesPermissions }
