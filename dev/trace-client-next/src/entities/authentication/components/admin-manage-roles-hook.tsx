import {
    _,
    useEffect,
    useRef,
    useState,
} from '../../../imports/regular-imports'
import { useSharedElements } from './shared-elements-hook'
import { ReactForm } from '../../../imports/trace-imports'
import {
    IconButton,
} from '../../../imports/gui-imports'
import {
    Settings,
} from '../../../imports/icons-import'
import { useCommonArtifacts } from './common-artifacts-hook'
import { AdminManageRolesPermissions } from './admin-manage-roles-permissions'

function useAdminManageRoles() {
    const [, setRefresh] = useState({})
    const meta: any = useRef({
        title: 'Admin manage roles',
        showDialog: false,
        dialogConfig: {
            isEditMode: false,
            title: '',
            tableName: '',
            formId: 'admin-manage-roles',
            actions: () => {},
            content: () => <></>,
        },
    })
    const {
        authMessages,
        filterOn,
        getCurrentEntity,
        getFormData,
        getLoginData,
        resetForm,
        TraceFullWidthSubmitButton,
    } = useSharedElements()

    const pre = meta.current.dialogConfig
    const { doSubmit, handleDelete, gridActionMessages } = useCommonArtifacts()

    useEffect(() => {
        const subs1 = filterOn(
            'ADMIN-MANAGE-ROLES-HOOK-JUST-REFRESH'
        ).subscribe(() => {
            setRefresh({})
        })

        const subs2 = filterOn(gridActionMessages.editIbukiMessage).subscribe(
            (d: any) => {
                //edit
                handleEdit(d.data?.row)
            }
        )

        const subs3 = filterOn(gridActionMessages.deleteIbukiMessage).subscribe(
            (d: any) => {
                //delete
                const { id1 } = d.data?.row
                handleDelete(id1, 'ClientEntityRole')
            }
        )

        const subs4 = filterOn(gridActionMessages.addIbukiMessage).subscribe(
            (d: any) => {
                //Add
                handleAdd()
            }
        )

        const subs5 = filterOn(
            gridActionMessages.onDataFetchedIbukiMessage
        ).subscribe((d: any) => {
            pre.clientEntityId = d.data.jsonResult.clientEntityId
            pre.permissionEntityName = d.data.jsonResult.entityName
            pre.roles = d.data.jsonResult.roles
        })

        return () => {
            subs1.unsubscribe()
            subs2.unsubscribe()
            subs3.unsubscribe()
            subs4.unsubscribe()
            subs5.unsubscribe()
        }
    }, [])

    const columns: any[] = [
        {
            headerName: '#',
            description: 'Index',
            field: 'id',
            width: 80,
            disableColumnMenu: true,
        },
        {
            headerName: 'Id',
            description: 'Id',
            field: 'id1',
            width: 90,
        },
        {
            headerName: 'Database',
            description: 'Database',
            field: 'dbName',
            width: 200,
        },
        {
            headerName: 'Role',
            description: 'Role',
            field: 'role',
            width: 190,
        },
        {
            headerName: 'Role description',
            description: 'Role description',
            field: 'roleDescr',
            minWidth: 150,
            flex: 1,
        },
    ]

    const queryId = 'getJson_roles_clienEntityId_entityName'
    const queryArgs = { userId: getLoginData().id }
    const specialColumns = {
        isEdit: true,
        isDelete: true,
        customColumn1: {
            headerName: 'Permission',
            width: 110,
            field: '5',
            renderCell: (params: any) => {
                return (
                    <IconButton
                        size="large"
                        color="primary"
                        onClick={() => handlePermissions(params.row)}
                        aria-label="close">
                        <Settings color="secondary" fontSize="medium" />
                    </IconButton>
                )
            },
        },
    }
    const summaryColNames: string[] = []

    function setDialogContentAction(jsonString: any) {
        pre.content = () => (
            <ReactForm
                jsonText={jsonString}
                name={getCurrentEntity()}
                formId={pre.formId}
            />
        )
        pre.actions = () => (
            <TraceFullWidthSubmitButton onClick={handleSubmit} />
        )
    }

    async function getPermissionsAsJson(permissionName: string) {
        const permissionEntityName = pre.permissionEntityName || 'accounts'
        const permissionsTemplate: any = await import(
            `../../${permissionEntityName}/json/permission-templates.json`
        )
        const logic: any = {
            base: permissionsTemplate.base,
            operator: mergeWithBasePermissions('operator'),
            accountant: mergeWithBasePermissions('accountant'),
            manager: getOppositePermissions('base'),
        }
        return logic[permissionName]

        function getOppositePermissions(name: string) {
            const temp: any[] = permissionsTemplate[name].map((item: any) => ({
                ...item,
                isActive: !item.isActive,
            }))
            return temp
        }
        function mergeWithBasePermissions(name: string): any[] {
            const permissions = permissionsTemplate[name]
            const basePermissions = permissionsTemplate.base
            const basePermissionsClone = basePermissions.map((x: any) => ({
                ...x,
            }))
            const permissionsObject: any = arrayToObject(permissions)
            const ret: any[] = basePermissionsClone.map((item: any) => {
                const controlName: string = item.controlName
                if (permissionsObject[controlName] !== undefined) {
                    item.isActive = permissionsObject[controlName]
                }
                return item
            })
            return ret

            function arrayToObject(arr: any[]) {
                const obj: any = {}
                for (const item of arr) {
                    obj[item.controlName] = item.isActive
                }
                return obj
            }
        }
    }

    async function handleAdd() {
        resetForm(pre.formId)
        pre.isEditMode = false
        meta.current.showDialog = true
        pre.title = 'Add new role'
        const addJsonString = JSON.stringify(manageRole)
        setDialogContentAction(addJsonString)
        setRefresh({})
    }

    function handleCloseDialog() {
        meta.current.showDialog = false
        setRefresh({})
    }

    function handleEdit(node: any) {
        resetForm(pre.formId)
        pre.isEditMode = true
        const formData: any = getFormData(pre.formId)
        pre.title = 'Edit role'
        const jsonObject = JSON.parse(JSON.stringify(manageRole))
        jsonObject.items[0].value = node.role
        jsonObject.items[1].value = node.roleDescr

        setDialogContentAction(JSON.stringify(jsonObject))
        pre.id = node.id1 // for edit
        meta.current.showDialog = true
        setRefresh({})
    }

    function handlePermissions(node: any) {
        pre.isEditMode = true
        meta.current.showDialog = true
        pre.title = authMessages.setPermissionsForRole
        pre.subTitle = authMessages.clickToEdit
        
        pre.content = () => (
            <AdminManageRolesPermissions
                node={node}
                getPermissionsAsJson={getPermissionsAsJson}
                handleCloseDialog={handleCloseDialog}
            />
        )
        setRefresh({})
    }

    async function handleSubmit() {
        const formData: any = getFormData(pre.formId)
        if (pre.isEditMode) {
            formData.id = pre.id
        } else {
            const permissions = await getPermissionsAsJson('base')
            formData.permissions = JSON.stringify(permissions)
        }
        formData.clientEntityId = pre.clientEntityId
        await doSubmit({
            formId: pre.formId,
            graphQlKey: 'genericUpdateMaster',
            tableName: 'ClientEntityRole',
            handleCloseDialog: handleCloseDialog,
        })
    }

    return {
        columns,
        getPermissionsAsJson,
        gridActionMessages,
        handleCloseDialog,
        meta,
        queryArgs,
        queryId,
        specialColumns,
        summaryColNames,
    }
}
export { useAdminManageRoles }

const manageRole: any = {
    class: 'generic-dialog',
    validations: [],
    items: [
        {
            type: 'Text',
            name: 'role',
            placeholder: 'User role',
            label: 'User role',
            validations: [
                {
                    name: 'noWhiteSpaceOrSpecialChar',
                    message:
                        'White space or special characters are not allowed',
                },
                {
                    name: 'required',
                    message: 'Role is required',
                },
            ],
        },
        {
            type: 'Text',
            name: 'roleDescr',
            placeholder: 'User role description',
            label: 'User role description',
            validations: [],
        },
    ],
}

 // pre.content = () => <PermissionsDialogContentWithActions />
        // function PermissionsDialogContentWithActions() {
        //     const [, setRefresh] = useState({})
        //     const meta = useRef({
        //         textSearchValue: '',
        //         permissionsConfig: {
        //             allRows: [],
        //             rows: [],
        //             isSubmitDisabled: true,
        //         },
        //     })
        //     const apiRef: any = useGridApiRef()
        //     const perm: any = meta.current.permissionsConfig

        //     useEffect(() => {
        //         const subs1 = debounceFilterOn(
        //             'MANAGE-ROLES-HOOK-DEBOUNCE-PERMISSIONS-GLOBAL-SEARCH'
        //         ).subscribe((d: any) => {
        //             requestSearch(d.data)
        //         })
        //         doRefresh()
        //         return () => {
        //             subs1.unsubscribe()
        //         }
        //     }, [])

        //     function requestSearch(text: string) {
        //         if (text) {
        //             perm.rows = perm.allRows.filter((row: any) => {
        //                 return Object.keys(row).some((field) => {
        //                     const temp: string = row[field]
        //                         ? row[field].toString()
        //                         : ''
        //                     return temp
        //                         .toLowerCase()
        //                         .includes(text.toLowerCase())
        //                 })
        //             })
        //         } else {
        //             perm.rows = perm.allRows.map((item: any) => ({ ...item }))
        //         }
        //         setRefresh({})
        //     }

        //     const columns = [
        //         {
        //             headerName: '#',
        //             field: 'id',
        //             width: 60,
        //         },
        //         {
        //             headerName: 'Control name',
        //             width: 200,
        //             field: 'controlName',
        //         },
        //         {
        //             headerName: 'Active',
        //             width: 80,
        //             field: 'isActive',
        //             type: 'boolean',
        //             editable: true,
        //             cellClassName: 'active-cell',
        //             headerClassName: 'active-cell',
        //             renderEditCell: (params: any) => {
        //                 return (
        //                     <Checkbox
        //                         checked={params.value}
        //                         onChange={(e: any) => {
        //                             perm.isSubmitDisabled = false
        //                             params.row.isActive = e.target.checked
        //                             const temp = perm.allRows.find(
        //                                 (x: any) => x.id === params.row.id
        //                             )
        //                             temp && (temp.isActive = e.target.checked)
        //                             apiRef.current.setEditCellValue({
        //                                 id: params.row.id,
        //                                 field: 'isActive',
        //                                 value: e.target.checked,
        //                             })
        //                             setRefresh({})
        //                         }}
        //                     />
        //                 )
        //             },
        //         },
        //         {
        //             headerName: 'Description',
        //             width: 140,
        //             field: 'descr',
        //             flex: 1,
        //             description: 'Description',
        //         },
        //     ]

        //     const handleCellClick = useCallback((params) => {
        //         apiRef.current.setCellMode(params.row.id, 'isActive', 'edit')
        //     }, [])

        //     const handleCellFocusOut = useCallback((params, event) => {
        //         if (params.cellMode === 'edit' && event) {
        //             event.defaultMuiPrevented = true
        //         }
        //     }, [])

        //     const handleCellKeyDown = useCallback((params, event) => {
        //         if (
        //             ['Escape', 'Delete', 'Backspace', 'Enter'].includes(
        //                 event.key
        //             )
        //         ) {
        //             event.defaultMuiPrevented = true
        //         }
        //     }, [])

        //     const handleDoubleCellClick = useCallback((params, event) => {
        //         event.defaultMuiPrevented = true
        //     }, [])

        //     return (
        //         <Box>
        //             <DataGridPro
        //                 apiRef={apiRef}
        //                 columns={columns}
        //                 components={{
        //                     Toolbar: CustomGridToolbar,
        //                     BooleanCellFalseIcon: CheckBoxOutlineBlankSharp,
        //                     BooleanCellTrueIcon: CheckBoxOutlined,
        //                 }}
        //                 onCellClick={handleCellClick}
        //                 onCellDoubleClick={handleDoubleCellClick}
        //                 onCellFocusOut={handleCellFocusOut}
        //                 onCellKeyDown={handleCellKeyDown}
        //                 rows={perm.rows}
        //                 showColumnRightBorder={true}
        //                 showCellRightBorder={true}
        //                 sx={{
        //                     height: '60vh',
        //                 }}
        //             />
        //             <Button
        //                 disabled={perm.isSubmitDisabled}
        //                 sx={{ mt: 2, width: '100%' }}
        //                 color="secondary"
        //                 variant="contained"
        //                 onClick={handleSubmit}>
        //                 Submit
        //             </Button>
        //         </Box>
        //     )

        //     function CustomGridToolbar() {
        //         return (
        //             <GridToolbarContainer
        //                 style={{
        //                     width: '100%',
        //                     display: 'flex',
        //                     columnGap: '0.25rem',
        //                     flexWrap: 'wrap',
        //                 }}>
        //                 <Button
        //                     size="small"
        //                     color="warning"
        //                     variant="contained"
        //                     onClick={() => handleToolbarButtonClick('base')}>
        //                     Base
        //                 </Button>
        //                 <Button
        //                     size="small"
        //                     color="primary"
        //                     variant="contained"
        //                     onClick={() =>
        //                         handleToolbarButtonClick('operator')
        //                     }>
        //                     Operator
        //                 </Button>
        //                 <Button
        //                     size="small"
        //                     color="secondary"
        //                     variant="contained"
        //                     onClick={() =>
        //                         handleToolbarButtonClick('accountant')
        //                     }>
        //                     Accountant
        //                 </Button>
        //                 <Button
        //                     size="small"
        //                     color="success"
        //                     variant="contained"
        //                     onClick={() => handleToolbarButtonClick('manager')}>
        //                     Manager
        //                 </Button>
        //                 <Input
        //                     autoFocus
        //                     sx={{
        //                         width: '100%',
        //                         minWidth: 150,
        //                         mt: 2,
        //                         ml: 1,
        //                         fontSize: 12,
        //                     }}
        //                     value={meta.current.textSearchValue}
        //                     onChange={handleTextSearchValueChange}
        //                     placeholder="Search …"
        //                     startAdornment={<Search fontSize="small" />}
        //                     endAdornment={
        //                         <IconButton
        //                             title="Clear"
        //                             aria-label="Clear"
        //                             size="small"
        //                             onClick={handleTextSearchClear}>
        //                             <CloseSharp fontSize="small" />
        //                         </IconButton>
        //                     }
        //                 />
        //                 <IconButton
        //                     size="small"
        //                     title="Refresh"
        //                     color="secondary"
        //                     onClick={handleParentRefresh}>
        //                     <SyncSharp />
        //                 </IconButton>
        //             </GridToolbarContainer>
        //         )
        //     }

        //     function handleParentRefresh() {
        //         emit('ADMIN-MANAGE-ROLES-HOOK-JUST-REFRESH', '')
        //     }

        //     function doRefresh() {
        //         resetCounter()
        //         if (_.isEmpty(node.permissions)) {
        //             perm.rows = []
        //         } else {
        //             perm.rows = node.permissions.map((item: any) => ({
        //                 id: counter(),
        //                 ...item,
        //             }))
        //             perm.allRows = perm.rows.map((item: any) => ({
        //                 ...item,
        //             }))
        //         }
        //         setRefresh({})
        //     }

        //     function handleTextSearchValueChange(e: any) {
        //         meta.current.textSearchValue = e.target.value
        //         debounceEmit(
        //             'MANAGE-ROLES-HOOK-DEBOUNCE-PERMISSIONS-GLOBAL-SEARCH',
        //             meta.current.textSearchValue
        //         )
        //         setRefresh({})
        //     }

        //     function handleTextSearchClear() {
        //         meta.current.textSearchValue = ''
        //         requestSearch('')
        //     }

        //     async function handleToolbarButtonClick(btnType: string) {
        //         resetCounter()
        //         const temp = await getPermissionsAsJson(btnType)
        //         perm.rows = temp.map((item: any) => ({
        //             ...item,
        //             id: counter(),
        //         }))
        //         perm.allRows = perm.rows.map((item: any) => ({
        //             ...item,
        //         }))
        //         setRefresh({})
        //     }

        //     async function handleSubmit() {
        //         //remove id field from permissions
        //         const temp = perm.rows.map((item: any) => ({
        //             ...item,
        //             id: undefined,
        //         }))
        //         const data = {
        //             id: node.id1,
        //             permissions: JSON.stringify(temp),
        //         }
        //         await doSubmit({
        //             data: data,
        //             graphQlKey: 'genericUpdateMaster',
        //             tableName: 'ClientEntityRole',
        //             handleCloseDialog: handleCloseDialog,
        //         })
        //         // refresh the parent grid of roles
        //         emit(gridActionMessages.fetchIbukiMessage, {
        //             userId: getLoginData().id,
        //         })
        //     }
        // }