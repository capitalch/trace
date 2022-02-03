import { useEffect, useRef, useState } from '../../../imports/regular-imports'
import { useSharedElements } from './shared-elements-hook'
import { ReactForm } from '../../../imports/trace-imports'
import { useCommonArtifacts } from './common-artifacts-hook'

function useAdminAssociateUsersRolesBu() {
    const [, setRefresh] = useState({})
    const meta: any = useRef({
        title: 'Associate users with roles and Bu',
        showDialog: false,
        sharedData: undefined,
        dialogConfig: {
            isEditMode: false,
            title: '',
            tableName: 'ClientEntityRoleBuUserX',
            formId: 'admin-associate-users-roles-bu',
            actions: () => {},
            content: () => <></>,
        },
    })
    const {
        emit,
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
                handleDelete(id1, pre.tableName)
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
        ).subscribe(
            // To populate the drop downs
            (d: any) => {
                const j = d.data.jsonResult
                pre.businessUsers = j.businessUsers.map((x: any) => {
                    return {
                        label: ''.concat(
                            'uid: ',
                            x.uid,
                            ', Email: ',
                            x.userEmail,
                            ', Name:',
                            x.userName
                        ),
                        value: x.id,
                    }
                })
                pre.businessUsers.unshift({
                    label: '--- select ---',
                    value: '',
                })

                pre.buList = j.clientEntityBu.map((x: any) => {
                    return {
                        label: ''.concat(
                            'Bu code: ',
                            x.buCode,
                            ', Bu name: ',
                            x.buName
                        ),
                        value: x.id,
                    }
                })
                pre.buList.unshift({ label: '--- select ---', value: '' })

                pre.roles = j.clientEntityRoles.map((x: any) => {
                    return {
                        label: ''.concat(
                            'Role: ',
                            x.role,
                            ', Descr:',
                            x.roleDescr
                        ),
                        value: x.id,
                    }
                })
                pre.roles.unshift({ label: '--- select ---', value: '' })
            }
        )

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
            disableCoumnMenu: true,
        },
        {
            headerName: 'Id',
            description: 'Id',
            field: 'id1',
            width: 90,
        },
        {
            headerName: 'Bu code',
            description: 'Bu code',
            field: 'buCode',
            width: 140,
        },
        {
            headerName: 'Bu name',
            description: 'Bu name',
            field: 'buName',
            width: 160,
        },
        {
            headerName: 'Role',
            description: 'Role',
            field: 'role',
            width: 120,
        },
        {
            headerName: 'Role description',
            description: 'Role description',
            field: 'roleDescr',
            width: 170,
        },
        {
            headerName: 'Uid',
            description: 'Uid',
            field: 'uid',
            width: 90,
        },
        {
            headerName: 'User name',
            description: 'User name',
            field: 'userName',
            width: 150,
        },
        {
            headerName: 'User email',
            description: 'User email',
            field: 'userEmail',
            width: 170,
            flex: 1,
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
        pre.title = 'Associate user with role and bu'
        const addJson = JSON.parse(JSON.stringify(manageUsersRolesBuJson))
        addJson.items[0].options = pre.businessUsers
        addJson.items[1].options = pre.buList
        addJson.items[2].options = pre.roles
        const addJsonString = JSON.stringify(addJson)
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
        pre.id = node.id1
        pre.title = 'Edit association of user, role and Bu'
        const jsonObject = JSON.parse(JSON.stringify(manageUsersRolesBuJson))
        jsonObject.items[0].options = pre.businessUsers
        jsonObject.items[1].options = pre.buList
        jsonObject.items[2].options = pre.roles
        jsonObject.items[0].value = node.businessUserId // user
        jsonObject.items[1].value = node.clientEntityBuId // Bu
        jsonObject.items[2].value = node.clientEntityRoleId // Role
        setDialogContentAction(JSON.stringify(jsonObject))
        meta.current.showDialog = true
        setRefresh({})
    }

    async function handleSubmit() {
        const formData = getFormData(pre.formId)
        pre.isEditMode && (formData.id = pre.id)
        doSubmit({
            data: formData,
            graphQlKey: 'genericUpdateMaster',
            tableName: pre.tableName,
            handleCloseDialog: handleCloseDialog,
        })
    }

    const queryId =
        'getJson_clientEntityRoleBuUserX_businessUsers_clientEntityRole_clientEntityBu'
    const queryArgs = {
        userId: getLoginData().id,
    }
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

export { useAdminAssociateUsersRolesBu }

const manageUsersRolesBuJson: any = {
    class: 'generic-dialog',
    validations: [
        {
            name: 'userBuRoleAssociationExists',
            message:
                'Association of this user account, business unit and role already exists',
        },
    ],
    items: [
        {
            type: 'Select',
            name: 'userId',
            placeholder: 'Users',
            label: 'Select user',
            options: [],
            validations: [
                {
                    name: 'required',
                    message: 'Please select a user',
                },
            ],
        },
        {
            type: 'Select',
            name: 'clientEntityBuId',
            placeholder: 'Bu',
            label: 'Select Bu',
            options: [],
            validations: [
                {
                    name: 'required',
                    message: 'Please select a business unit',
                },
            ],
        },
        {
            type: 'Select',
            name: 'clientEntityRoleId',
            placeholder: 'Roles',
            label: 'Select role',
            options: [],
            validations: [
                {
                    name: 'required',
                    message: 'Please select a role',
                },
            ],
        },
    ],
}
