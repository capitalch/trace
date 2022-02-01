import {
    _,
    useEffect,
    useRef,
    useState,
} from '../../../imports/regular-imports'
import { useSharedElements } from './shared-elements-hook'
import { ReactForm, useIbuki } from '../../../imports/trace-imports'
import {
    Box,
    Button,
    Checkbox,
    DataGridPro,
    IconButton,
    Theme,
    useGridApiRef,
} from '../../../imports/gui-imports'
import {
    CheckBoxOutlined,
    CheckBoxOutlineBlankSharp,
    CloseSharp,
    DeleteForever,
    Search,
    SyncSharp,
    Edit,
    Settings,
} from '../../../imports/icons-import'
import { useCommonArtifacts } from './common-artifacts-hook'
import { itemLevelValidators } from '../../../shared-artifacts/item-level-validators'
import { palette } from '@mui/system'

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
        clearServerError,
        doValidateForm,
        emit,
        filterOn,
        isValidForm,
        getCurrentEntity,
        getFormData,
        getFormObject,
        getLoginData,
        getSqlObjectString,
        mutateGraphql,
        queries,
        resetForm,

        TraceFullWidthSubmitButton,
    } = useSharedElements()

    const pre = meta.current.dialogConfig
    const perm = meta.current.permissionsConfig
    const { doSubmit, handleDelete, gridActionMessages } = useCommonArtifacts()

    useEffect(() => {
        // const subs1 = filterOn('FETCH-DATA-MESSAGE').subscribe(() => {
        //     emit(gridActionMessages.fetchIbukiMessage, null)
        // })

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
            // subs1.unsubscribe()
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
        // const permissions = await getPermissionsAsJson('base') // default permission is base permision , which has no controls active. You need to modify the permissions after making a few controls active
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
        // formData.id = node.id1
        pre.id = node.id1 // for edit
        meta.current.showDialog = true
        setRefresh({})
    }

    async function handlePermissions(node: any) {
        let count: number = 0
        // const temp: any[] = await getPermissionsAsJson('base')
        pre.isEditMode = true
        meta.current.showDialog = true
        pre.title = authMessages.setPermissionsForRole
        pre.subTitle = authMessages.doubleClickToEdit
        pre.content = () => <PermissionsDialogContentWithActions />
        setRefresh({})

        function PermissionsDialogContentWithActions() {
            const meta = useRef({
                permissionsConfig: {
                    rows: [],
                },
            })
            const apiRef: any = useGridApiRef()
            const perm: any = meta.current.permissionsConfig
            if (_.isEmpty(node.permissions)) {
                perm.rows = []
            } else {
                perm.rows = node.permissions.map((item: any) => ({
                    id: counter(),
                    ...item,
                }))
            }
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
                {
                    headerName: 'Description',
                    width: 140,
                    field: 'descr',
                    flex: 1,
                    description: 'Description',
                },
            ]

            return (
                <Box>
                    <DataGridPro
                        apiRef={apiRef}
                        columns={columns}
                        components={{
                            BooleanCellFalseIcon: CheckBoxOutlineBlankSharp,
                            BooleanCellTrueIcon: CheckBoxOutlined,
                        }}
                        rows={perm.rows}
                        showColumnRightBorder={true}
                        showCellRightBorder={true}
                        sx={{
                            // backgroundColor: 'lightyellow',
                            height: '60vh',
                            '& .active-cell': {
                                // backgroundColor: 'whitesmoke',
                                // color: (theme: Theme) => theme.palette.blueGrey,
                            },
                        }}
                    />
                    <Button
                        sx={{ mt: 2, width: '100%' }}
                        color="secondary"
                        variant="contained"
                        onClick={handleSubmit}>
                        Submit
                    </Button>
                </Box>
            )

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
        }

        function counter() {
            return ++count
        }
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
