import { useEffect, useRef, useState } from '../../../imports/regular-imports'
import { useSharedElements } from './shared-elements-hook'
import { ReactForm, useIbuki } from '../../../imports/trace-imports'
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
                // handleEdit(d.data?.row)
            }
        )

        const subs3 = filterOn(gridActionMessages.deleteIbukiMessage).subscribe(
            (d: any) => {
                //delete
                // const { id1 } = d.data?.row
                // handleDelete(id1, 'ClientEntityBu')
            }
        )

        const subs4 = filterOn(gridActionMessages.addIbukiMessage).subscribe(
            (d: any) => {
                //Add
                // handleAdd()
            }
        )

        const subs5 = filterOn(
            gridActionMessages.onDataFetchedIbukiMessage
        ).subscribe((d: any) => {
            console.log(d)
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
            width: 150,
            flex: 1,
        },
    ]
    const queryId = 'getJson_roles_clienEntityId_entityName'
    const queryArgs = { userId: getLoginData().id }
    const specialColumns = {
        isEdit: true,
        isDelete: true,
    }
    const summaryColNames: string[] = []

    function handleCloseDialog() {
        meta.current.showDialog = false
        setRefresh({})
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
