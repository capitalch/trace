import { useEffect, useRef, useState } from '../../../imports/regular-imports'
import { useSharedElements } from './shared-elements-hook'
import { ReactForm, useIbuki } from '../../../imports/trace-imports'
import { useCommonArtifacts } from './common-artifacts-hook'

function useManageUsers() {
    const [, setRefresh] = useState({})
    const meta: any = useRef({
        title: 'Admin manage business users',
        showDialog: false,
        dialogConfig: {
            isEditMode: false,
            title: '',
            tableName: 'TraceUser',
            formId: 'admin-manage-users',
            actions: () => {},
            content: () => <></>,
        },
    })

    const {
        getCurrentEntity,
        getFormData,
        getLoginData,
        resetForm,
        TraceFullWidthSubmitButton,
    } = useSharedElements()

    const { doSubmit, gridActionMessages, handleDelete } = useCommonArtifacts()
    const id = getLoginData().id
    const userType = getLoginData().userType
    meta.current.title = (userType=== 'a') ? 'Manage business users': 'Manage admin users'
    const { emit, filterOn } = useIbuki()
    const pre = meta.current.dialogConfig
    
    useEffect(() => {
        const subs1 = filterOn('FETCH-DATA-MESSAGE').subscribe(() => {
            emit(gridActionMessages.fetchIbukiMessage, null)
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
                handleDelete(id1, 'TraceUser')
            }
        )

        const subs4 = filterOn(gridActionMessages.addIbukiMessage).subscribe(
            (d: any) => {
                //Add
                handleAdd()
            }
        )

        return () => {
            subs1.unsubscribe()
            subs2.unsubscribe()
            subs3.unsubscribe()
            subs4.unsubscribe()
        }
    }, [])

    const columns: any[] = [
        {
            headerName: 'Ind',
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
            headerName: 'Uid',
            description: 'Uid',
            field: 'uid',
            width: 150,
        },
        {
            headerName: 'User name',
            description: 'User name',
            field: 'userName',
            width: 250,
        },
        {
            headerName: 'Email',
            description: 'Email',
            field: 'userEmail',
            width: 250,
            flex: 1,
        },
        {
            headerName: 'Description',
            description: 'Description',
            field: 'descr',
            width: 250,
        },
        {
            headerName: 'Active',
            description: 'Active',
            field: 'isActive',
            type: 'boolean',
            width: 90,
        },
    ]

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

    function handleAdd() {
        resetForm(pre.formId)
        pre.isEditMode = false
        meta.current.showDialog = true
        pre.title = 'Add new user'
        const addJsonString = JSON.stringify(manageUsersJson)
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
        pre.id = node.id1 // for edit purpose
        const jsonObject = JSON.parse(JSON.stringify(manageUsersJson))
        jsonObject.items[0].value = node['userEmail']
        jsonObject.items[1].value = node['userName']
        jsonObject.items[2].value = node['descr']
        jsonObject.items[3].value = node['isActive']
        jsonObject.validations.pop()
        jsonObject.validations.push({
            name: 'userEmailExistsUpdate',
            message: 'This email already exists. Please try out another email',
        })
        pre.title = 'Edit user'
        setDialogContentAction(JSON.stringify(jsonObject))
        meta.current.showDialog = true
        setRefresh({})
    }

    async function handleSubmit() {
        const formData = getFormData(pre.formId)
        formData.parentId = getLoginData().id
        pre.isEditMode && (formData.id = pre.id)
        doSubmit({
            data: formData,
            graphQlKey: 'createOrUpdateUser',
            tableName: 'TraceUser',
            handleCloseDialog: handleCloseDialog,
        })
    }

    const queryId = (userType === 'a')? 'get_businessUsers': 'get_adminUsers'
    const queryArgs = { parentId: id }
    const specialColumns = {
        isEdit: true,
        isDelete: true,
    }
    const summaryColNames: string[] = []

    return {
        columns,
        gridActionMessages,
        handleCloseDialog,
        meta,
        queryArgs,
        queryId,
        specialColumns,
        summaryColNames,
    }
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
