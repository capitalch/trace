import { useState } from '../../../imports/regular-imports'
import { useSharedElements } from './shared-elements-hook'

function useManageUsers(meta: any) {
    const [, setRefresh] = useState({})
    const {
        Checkbox,
        CloseSharp,
        Column,
        Edit,
        emit,
        getFormData,
        getLoginData,
        hash,
        IconButton,
        resetForm,
        closeDialog,
        deleteRow,
        submitDialog,
        useStyles,
        queries,
        queryGraphql,
    } = useSharedElements(meta)
    const classes = useStyles({ meta: meta })
    const manageUsers = {
        dataTableColumns: manageUsersColumns,
        read: async () => {
            meta.current.minWidth = '600px'
            meta.current.dialogConfig.formId = 'manageUsers'
            meta.current.headerConfig.title = 'Manage users'
            meta.current.dialogConfig.jsonObject = manageUsersJson
            meta.current.dialogConfig.tableName = 'TraceUser'
            const id = getLoginData().id
            const dt = escape(JSON.stringify({ parentId: id }))
            const q = queries['getUsers'](dt)
            if (q) {
                emit('SHOW-LOADING-INDICATOR', true)
                const results: any = await queryGraphql(q)
                meta.current.data = results.data.authentication.getUsers
                emit('SHOW-LOADING-INDICATOR', false)
                meta.current.isMounted && setRefresh({})
            }
        },
        create: () => {
            meta.current.dialogConfig.title = 'New user'
            meta.current.dialogConfig.isEditMode = false
            meta.current.dialogConfig.jsonObject = JSON.parse(
                JSON.stringify(manageUsersJson)
            )
            resetForm(meta.current.dialogConfig.formId)
            meta.current.showDialog = true
            meta.current.isMounted && setRefresh({})
        },
        submit: () => {
            const dataObject = getFormData(meta.current.dialogConfig.formId)
            const calculatedDataHash = hash(dataObject)
            if (meta.current.origDataHash === calculatedDataHash) {
                alert('No change in data. Cannot submit')
                closeDialog()
            } else {
                // set parentId in form which determines whether the user is business user or admin. For admin users parentId is null
                getFormData(meta.current.dialogConfig.formId)[
                    'parentId'
                ] = getLoginData().id
                getFormData(meta.current.dialogConfig.formId)['id'] =
                    meta.current.dialogConfig.node.id
                submitDialog({
                    graphQlKey: 'createUser',
                    tableName: 'TraceUser',
                    afterMethod: manageUsers.read,
                })
            }
        },
        //edit
        update: (node: any) => {
            resetForm(meta.current.dialogConfig.formId)
            const jsonObject = JSON.parse(JSON.stringify(manageUsersJson))
            jsonObject.items[0].value = node['userEmail']
            jsonObject.items[1].value = node['userName']
            jsonObject.items[2].value = node['descr']
            jsonObject.items[3].value = node['isActive']
            jsonObject.validations.pop()
            jsonObject.validations.push({
                name: 'userEmailExistsUpdate',
                message:
                    'This email already exists. Please try out another email',
            })
            meta.current.dialogConfig.jsonObject = jsonObject
            meta.current.dialogConfig.title = 'Edit user'
            meta.current.dialogConfig.isEditMode = true
            meta.current.showDialog = true
            meta.current.dialogConfig.node = node
            meta.current.isMounted && setRefresh({})
        },
    }

    function manageUsersColumns() {
        let numb = 0
        function incr() {
            return ++numb
        }
        return [
            <Column
                key={incr()}
                header={<div className={classes.columnHeaderLeft}>Id</div>}
                field="id"
                style={{ width: '4rem' }}></Column>,
            <Column
                key={incr()}
                className={classes.bodyBreak}
                header={<div className={classes.columnHeaderLeft}>Uid</div>}
                style={{ minWidth: '6rem' }}
                field="uid"></Column>,
            <Column
                key={incr()}
                className={classes.bodyBreak}
                header={
                    <div className={classes.columnHeaderLeft}>User name</div>
                }
                style={{ minWidth: '10rem' }}
                field="userName"></Column>,
            <Column
                key={incr()}
                header={<div className={classes.columnHeaderLeft}>Email</div>}
                field="userEmail"
                className={classes.bodyBreak}
                style={{ minWidth: '10rem' }}></Column>,
            <Column
                key={incr()}
                header={
                    <div className={classes.columnHeaderLeft}>Description</div>
                }
                field="descr"
                className={classes.bodyBreak}></Column>,
            <Column
                key={incr()}
                header={<div>Active</div>}
                field="isActive"
                style={{ width: '4.5rem' }}
                body={(node: any) => (
                    <Checkbox
                        checked={node.isActive}
                        disabled={true}
                        color="secondary"></Checkbox>
                )}></Column>,
            <Column
                key={incr()}
                header={<div>Edit</div>}
                body={(node: any) => (
                    <IconButton
                        size="medium"
                        color="secondary"
                        onClick={() => manageUsers.update(node)}>
                        <Edit></Edit>
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
                        onClick={(e) => deleteRow(node, manageUsers.read)}>
                        <CloseSharp></CloseSharp>
                    </IconButton>
                )}></Column>,
        ]
    }

    return { manageUsers }
}

export { useManageUsers }

const manageUsersJson: any = {
    class: 'generic-dialog',
    validations: [
        {
            name: 'userEmailExists',
            message: 'This email already exists. Please try out another email',
        },
    ],
    items: [
        {
            type: 'Text',
            name: 'userEmail',
            placeholder: 'Email',
            label: 'User email',
            validations: [
                {
                    name: 'required',
                    message: 'Email field is required',
                },
                {
                    name: 'email',
                    message: 'Invalid email',
                },
            ],
        },
        {
            type: 'Text',
            name: 'userName',
            placeholder: 'User name',
            label: 'User name',
            validations: [],
        },
        {
            type: 'Text',
            name: 'descr',
            placeholder: 'Description',
            label: 'Description',
            validations: [],
        },
        {
            type: 'Checkbox',
            name: 'isActive',
            placeholder: 'Active',
            label: 'Active',
            validations: [],
        },
    ],
}
