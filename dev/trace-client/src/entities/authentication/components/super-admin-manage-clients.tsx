import { XXGrid } from '../../../global-utils/xx-grid'
import { Box, Typography } from '../../../imports/gui-imports'
import { useEffect, useRef, useState } from '../../../imports/regular-imports'
import { useSharedElements } from './shared-elements-hook'
import { ReactForm } from '../../../imports/trace-imports'
import { useCommonArtifacts } from './common-artifacts-hook'

function SuperAdminManageClients() {
    const [, setRefresh] = useState({})
    const { TraceDialog } = useSharedElements()
    const meta: any = useRef({
        title: 'Manage clients',
        showDialog: false,
        sharedData: undefined,
        dialogConfig: {
            isEditMode: false,
            title: '',
            tableName: 'TraceClient',
            formId: 'super-admin-manage-clients',
            actions: () => {},
            content: () => <></>,
        },
    })
    const {
        filterOn,
        getCurrentEntity,
        getFormData,
        resetForm,
        TraceFullWidthSubmitButton,
    } = useSharedElements()

    const pre = meta.current.dialogConfig
    const { doSubmit, handleDelete, gridActionMessages } = useCommonArtifacts()

    useEffect(() => {
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

        return () => {
            subs2.unsubscribe()
            subs3.unsubscribe()
            subs4.unsubscribe()
        }
    }, [])

    const columns = [
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
            headerName: 'Client Code',
            description: 'Client code',
            field: 'clientCode',
            width: 190,
        },
        {
            headerName: 'Client name',
            description: 'Client name',
            field: 'clientName',
            width: 190,
            flex: 1,
        },
        {
            headerName: 'Active',
            description: 'Active',
            field: 'isActive',
            width: 80,
            type: 'boolean',
        },
    ]

    function handleAdd() {
        resetForm(pre.formId)
        pre.isEditMode = false
        meta.current.showDialog = true
        pre.title = 'Add client'
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
        pre.title = 'Edit client'
        const jsonObject = JSON.parse(JSON.stringify(addJson))
        jsonObject.items[0].value = node.clientCode
        jsonObject.items[1].value = node.clientName
        jsonObject.items[2].value = node.isActive
        setDialogContentAction(JSON.stringify(jsonObject))
        pre.id = node.id1
        meta.current.showDialog = true
        setRefresh({})
    }

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

        async function handleSubmit() {
            const formData = getFormData(pre.formId)
            pre.isEditMode && (formData.id = pre.id)
            const graphQlKey = 'genericUpdateMaster'
            doSubmit({
                data: formData,
                graphQlKey: graphQlKey,
                tableName: pre.tableName,
                handleCloseDialog: handleCloseDialog,
            })
        }
    }
    
    return (
        <Box sx={{ height: 'calc(100vh - 180px)' }}>
            <Typography variant="subtitle1" component="div" color="cyan">
                {meta.current.title}
            </Typography>
            <XXGrid
                gridActionMessages={gridActionMessages}
                autoFetchData={true}
                columns={columns}
                jsonFieldPath=""
                sharedData={meta.current.sharedData} // to get entities from original fetched data
                sqlQueryId="get_clients"
                sqlQueryArgs={{}}
                sx={{ mt: 2 }}
                specialColumns={{
                    isEdit: true,
                    isDelete: true,
                }}
                summaryColNames={[]}
                toShowAddButton={true}
                viewLimit="100"
            />
            <TraceDialog meta={meta} onClose={handleCloseDialog} />
        </Box>
    )
}

export { SuperAdminManageClients }

const addJson: any = {
    class: 'generic-dialog',
    items: [
        {
            type: 'Text',
            name: 'clientCode',
            placeholder: 'Client code',
            label: 'Client code',
            validations: [
                {
                    name: 'required',
                    message: 'Client code is required',
                },
                {
                    name: 'noWhiteSpaceOrSpecialChar',
                    message:
                        'White space or special characters are not allowed',
                },
                {
                    name: 'maxLength',
                    message:
                        'Maximum length of Client code can be 10 characters',
                    args: [10],
                },
            ],
        },
        {
            type: 'Text',
            name: 'clientName',
            placeholder: 'Client name',
            label: 'Client name',
            validations: [
                {
                    name: 'required',
                    message: 'Client name is required',
                },
                {
                    name: 'noSpecialChar',
                    message:
                        'Special characters and space at end are not allowed in client name',
                },
            ],
        },
        {
            type: 'Checkbox',
            name: 'isActive',
            placeholder: 'Is active',
            label: 'Is active',
            validations: [],
        },
    ],
}
