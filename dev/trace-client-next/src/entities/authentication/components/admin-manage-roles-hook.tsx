import { useEffect, useRef, useState } from '../../../imports/regular-imports'
import { useSharedElements } from './shared-elements-hook'
import { ReactForm, useIbuki } from '../../../imports/trace-imports'
import { IconButton } from '../../../imports/gui-imports'
import {
    CloseSharp,
    DeleteForever,
    Search,
    SyncSharp,
    Edit,
    Settings,
} from '../../../imports/icons-import'
import { useCommonArtifacts } from './common-artifacts-hook'

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
        clearServerError,
        doValidateForm,
        emit,
        filterOn,
        isValidForm,
        getCurrentEntity,
        getFormData,
        getLoginData,
        getSqlObjectString,
        messages,
        mutateGraphql,
        queries,
        resetForm,
        TraceFullWidthSubmitButton,
    } = useSharedElements()

    const pre = meta.current.dialogConfig
    const { handleDelete, gridActionMessages } = useCommonArtifacts()

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
            // console.log(d)
            pre.clientEntityId = d.data.jsonResult.clientEntityId
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
                        onClick={handlePermission}
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

    function handleAdd(){
        resetForm(pre.formId)
        pre.isEditMode = false
        meta.current.showDialog = true
        pre.title = 'Add new role'
        const addJsonString = JSON.stringify(manageRole)
        setDialogContentAction(addJsonString)
        const formData: any = getFormData(pre.formId)
        formData.clientEntityId = pre.clientEntityId
        setRefresh({})
    }

    function handleCloseDialog() {
        meta.current.showDialog = false
        setRefresh({})
    }

    function handleEdit(node:any){
        resetForm(pre.formId)
        pre.isEditMode = true
        const formData: any = getFormData(pre.formId)
        pre.title = 'Edit role'
        const jsonObject = JSON.parse(JSON.stringify(manageRole))
        jsonObject.items[0].value = node.role
        jsonObject.items[1].value = node.roleDescr

        setDialogContentAction(JSON.stringify(jsonObject))
        pre.id = node.id1
        meta.current.showDialog = true
        setRefresh({})
    }

    function handlePermission() {
        alert('test')
    }

    function handleSubmit(){

    }

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
