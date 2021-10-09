import { useState } from '../../../imports/regular-imports'
import { useSharedElements } from './shared-elements-hook'

function useManageRoles(meta: any) {
    const [, setRefresh] = useState({})
    const {
        _,
        CloseIcon,
        closeDialog,
        Column,
        EditIcon,
        getFormData,
        getLoginData,
        emit,
        execGenericView,
        genericUpdateMasterNoForm,
        IconButton,
        resetForm,
        deleteRow,
        Settings,
        submitDialog,
        useStyles,
    } = useSharedElements(meta)
    const classes = useStyles({ meta: meta })

    const manageRoles = {
        dataTableColumns: manageRolesColumns,
        read: async () => {
            meta.current.minWidth = '650px'
            meta.current.dialogConfig.formId = 'manageRoles'
            meta.current.headerConfig.title = 'Manage roles'
            meta.current.dialogConfig.tableName = 'ClientEntityRole'
            meta.current.dialogConfig.permissionConfig.isPermission = false
            meta.current.dialogConfig.isEditMode = false

            emit('SHOW-LOADING-INDICATOR', true)
            const ret = await execGenericView({
                sqlKey: 'getJson_roles_clienEntityId_entityName',
                isMultipleRows: false,
                args: {
                    userId: getLoginData().id,
                },
            })
            const pre = ret?.jsonResult
            const roles = pre?.roles || []
            meta.current.dialogConfig.id = pre.clientEntityId
            meta.current.dialogConfig.entityName = pre?.entityName
            meta.current.data = roles
            emit('SHOW-LOADING-INDICATOR', false)
            meta.current.isMounted && setRefresh({})
        },
        update: (node: any) => {
            resetForm(meta.current.dialogConfig.formId)
            const jsonObject = JSON.parse(JSON.stringify(newRoleJson))
            meta.current.dialogConfig.title = 'Edit role'
            meta.current.dialogConfig.node = node
            meta.current.dialogConfig.isEditMode = true
            jsonObject.items[0].value = node.role
            jsonObject.items[1].value = node.roleDescr

            meta.current.dialogConfig.jsonObject = jsonObject
            meta.current.showDialog = true
            meta.current.isMounted && setRefresh({})
        },
        create: () => {
            meta.current.dialogConfig.title = 'New role'
            meta.current.dialogConfig.isEditMode = false
            meta.current.dialogConfig.jsonObject = JSON.parse(
                JSON.stringify(newRoleJson)
            )
            resetForm(meta.current.dialogConfig.formId)
            meta.current.showDialog = true
            meta.current.isMounted && setRefresh({})
        },
        submit: async () => {
            const formData = getFormData(meta.current.dialogConfig.formId)
            formData.clientEntityId = meta.current.dialogConfig.id
            if (meta.current.dialogConfig.permissionConfig.isPermission) {
                const ret = await genericUpdateMasterNoForm({
                    tableName: 'ClientEntityRole',
                    data: {
                        id: meta.current.dialogConfig.permissionConfig.id,
                        permissions: JSON.stringify(
                            meta.current.dialogConfig.permissionConfig.data.map(
                                (item: any) => {
                                    item.tableData = undefined
                                    return item
                                }
                            )
                        ),
                    },
                })
                if (ret) {
                    resetPermission()
                    closeDialog()
                    manageRoles.read()
                }
            } else {
                submitDialog({
                    tableName: 'ClientEntityRole',
                    graphQlKey: 'genericUpdateMaster',
                    afterMethod: manageRoles.read,
                })
            }
        },
    }

    function manageRolesColumns() {
        let numb = 0
        function incr() {
            return ++numb
        }
        return [
            <Column
                key={incr()}
                style={{ width: '4rem' }}
                field="id"
                header={<div className={classes.columnHeaderLeft}>Id</div>}
            />,
            <Column
                key={incr()}
                style={{ width: '9rem' }}
                field="dbName"
                header={
                    <div className={classes.columnHeaderLeft}>Database</div>
                }
            />,
            <Column
                key={incr()}
                style={{ width: '6rem' }}
                field="role"
                header={<div className={classes.columnHeaderLeft}>Role</div>}
            />,
            <Column
                key={incr()}
                style={{ minWidth: '4rem' }}
                field="roleDescr"
                header={
                    <div className={classes.columnHeaderLeft}>Role descr</div>
                }
            />,
            <Column
                key={incr()}
                style={{ width: '8rem', textAlign: 'center' }}
                header={<div>Permission</div>}
                body={(node: any) => (
                    <IconButton
                        size="medium"
                        color="secondary"
                        onClick={async (e) => {
                            resetPermission()
                            meta.current.dialogConfig.permissionConfig.isPermission = true
                            meta.current.dialogConfig.isEditMode = true
                            const permissionEntityName =
                                meta.current.dialogConfig.entityName
                            // dynamically obtain permission controls from respective entity
                            const permissionControls = await import(
                                `../../${permissionEntityName}/json/permission-templates.json`
                            )
                            const origPermissions = JSON.parse(
                                JSON.stringify(permissionControls.default)
                            )
                            const pre =
                                meta.current.dialogConfig.permissionConfig
                            pre.base = origPermissions.base
                            pre.operator = specialMerge(
                                origPermissions.base,
                                origPermissions.operator
                            )
                            pre.accountant = specialMerge(
                                origPermissions.base,
                                origPermissions.accountant
                            )
                            pre.manager = negate(origPermissions.base)

                            if (_.isEmpty(node.permissions)) {
                                meta.current.dialogConfig.permissionConfig.data =
                                    pre.base
                            } else {
                                meta.current.dialogConfig.permissionConfig.data = specialMerge(
                                    pre.base,
                                    node.permissions
                                )
                            }
                            meta.current.dialogConfig.permissionConfig.id =
                                node.id
                            meta.current.showDialog = true
                            meta.current.dialogConfig.title = 'Role permissions'
                            meta.current.isMounted && setRefresh({})
                        }}>
                        <Settings></Settings>
                    </IconButton>
                )}></Column>,
            <Column
                key={incr()}
                header={<div>Edit</div>}
                body={(node: any) => (
                    <IconButton
                        size="medium"
                        color="secondary"
                        onClick={() => manageRoles.update(node)}>
                        <EditIcon></EditIcon>
                    </IconButton>
                )}
                style={{ width: '4rem', textAlign: 'center' }}></Column>,
            <Column
                key={incr()}
                style={{ width: '4rem' }}
                header={<div>Del</div>}
                body={(node: any) => (
                    <IconButton
                        size="medium"
                        color="secondary"
                        onClick={(e) => deleteRow(node, manageRoles.read)}>
                        <CloseIcon></CloseIcon>
                    </IconButton>
                )}></Column>,
        ]
    }
    // creates an object with properties as controlName
    function arrayToObject(arr: any[]) {
        const ret: any = {}
        for (let item of arr) {
            ret[item.controlName] = item.isActive
        }
        return ret
    }

    function specialMerge(origArray: any[], array2: any[]) {
        const obj = arrayToObject(array2)
        const cloneOrigArray = JSON.parse(JSON.stringify(origArray))

        for (let item of cloneOrigArray) {
            item.isActive =
                obj[item.controlName] !== undefined
                    ? obj[item.controlName]
                    : item.isActive //|| false
        }
        return cloneOrigArray
    }

    function negate(templateObject: any) {
        const clone: any = JSON.parse(JSON.stringify(templateObject))
        for (let item in clone) {
            clone[item].isActive = !clone[item].isActive
        }
        return clone
    }

    function resetPermission() {
        const pre = meta.current.dialogConfig.permissionConfig
        pre.base = []
        pre.operator = []
        pre.accountant = []
        pre.manager = []
        pre.id = ''
        pre.data = []
        pre.isPermission = false
        meta.current.dialogConfig.isEditMode = false
    }

    return { manageRoles }
}

export { useManageRoles }

const newRoleJson: any = {
    class: 'generic-dialog',
    validations: [
        // {
        //     "name": "roleExists"
        //     , "message": "This user role already exists. Duplicate roles are not allowed"
        // }
    ],
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
