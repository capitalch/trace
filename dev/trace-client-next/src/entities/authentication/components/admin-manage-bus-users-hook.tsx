import { useEffect, useRef, useState } from '../../../imports/regular-imports'
import { useSharedElements } from './shared-elements-hook'
import { useIbuki } from '../../../imports/trace-imports'

function useAdminManageBusUsers() {
    const [, setRefresh] = useState({})
    const meta: any = useRef({
        title: 'Admin manage business users',
        showDialog: false,
        dialogConfig: {
            title: '',
            tableName: 'TraceUser',
            // formId: 'trace-brand-master',
            // ibukiFetchDataMessage:FETCH_DATA_MESSAGE,
            actions: () => { },
            content: () => <></>,
        },
    })
    const { confirm, genericUpdateMaster, getLoginData, messages } = useSharedElements()
    const id = getLoginData().id
    const { emit, filterOn } = useIbuki()
    const pre = meta.current.dialogConfig
    useEffect(() => {
        const subs1 = filterOn('FETCH-DATA-MESSAGE').subscribe(() => {
            emit(gridActionMessages.fetchIbukiMessage, null)
        })

        const subs2 = filterOn(
            gridActionMessages.editIbukiMessage
        ).subscribe((d: any) => {
            //edit
            // handleEdit(d.data)
        })

        const subs3 = filterOn(
            gridActionMessages.deleteIbukiMessage
        ).subscribe((d: any) => {
            //delete
            const { id1 } = d.data?.row
            handleDelete(id1)
        })

        const subs4 = filterOn(
            gridActionMessages.addIbukiMessage
        ).subscribe((d: any) => {
            //Add
            handleAdd()
        })

        return (() => {
            subs1.unsubscribe()
            subs3.unsubscribe()
            subs4.unsubscribe()
        })
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
            description: 'Id',
            field: 'userEmail',
            width: 250,
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
            width: 90,
        },
    ]

    function handleAdd() {
        meta.current.showDialog = true
        pre.title = 'Add new user'
        const addJson = JSON.parse(
            JSON.stringify(manageUsersJson)
        )
        setRefresh({})
    }

    function handleCloseDialog() {
        meta.current.showDialog = false
        setRefresh({})
    }

    function handleDelete(id1: any) {
        const options = {
            description: messages.deleteConfirm,
            confirmationText: 'Yes',
            cancellationText: 'No',
        }
        confirm(options)
            .then(async () => {
                const id = +id1 // to make it numeric from string
                emit('SHOW-LOADING-INDICATOR', true)
                await genericUpdateMaster({
                    deletedIds: [id],
                    tableName: 'TraceUser',
                })
                emit('SHOW-LOADING-INDICATOR', false)
                emit('SHOW-MESSAGE', {})
                emit(gridActionMessages.fetchIbukiMessage, null)
            })
            .catch(() => { }) // important to have otherwise eror
    }
    const gridActionMessages = {
        fetchIbukiMessage: 'XX-GRID-HOOK-FETCH-USERS',
        editIbukiMessage: 'ADMIN-MANAGE-BUS-USERS-HOOK-XX-GRID-EDIT-CLICKED',
        deleteIbukiMessage: 'ADMIN-MANAGE-BUS-USERS-HOOK-XX-GRID-DELETE-CLICKED',
        addIbukiMessage: 'ADMIN-MANAGE-BUS-USERS-HOOK-XX-GRID-ADD-CLICKED',
    }
    const queryId = 'get_businessUsers'
    const queryArgs = { parentId: id }
    const specialColumns = {
        isEdit: true,
        isDelete: true,
    }
    const summaryColNames: string[] = []

    return { columns, gridActionMessages, handleCloseDialog, meta, queryArgs, queryId, specialColumns, summaryColNames }
}

export { useAdminManageBusUsers }

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
