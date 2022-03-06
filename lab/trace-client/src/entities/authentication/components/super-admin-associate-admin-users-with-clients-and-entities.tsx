import { XXGrid } from '../../../global-utils/xx-grid'
import { Box, Typography } from '../../../imports/gui-imports'
import { useEffect, useRef, useState } from '../../../imports/regular-imports'
import { useSharedElements } from './shared-elements-hook'
import { ReactForm } from '../../../imports/trace-imports'
import { useCommonArtifacts } from './common-artifacts-hook'

function SuperAdminAssociateAdminUsersWithClientsAndEntities() {
    const [, setRefresh] = useState({})
    const { TraceDialog } = useSharedElements()
    const meta: any = useRef({
        title: 'Associate admin users with clients and entities',
        showDialog: false,
        sharedData: undefined,
        dialogConfig: {
            isEditMode: false,
            title: '',
            tableName: 'ClientEntityX',
            formId: 'super-admin-associate-admin-users-with-clients-and-entities',
            actions: () => {},
            content: () => <></>,
        },
    })
    const {
        emit,
        filterOn,
        getCurrentEntity,
        getFormData,
        resetForm,
        TraceFullWidthSubmitButton,
    } = useSharedElements()
    const pre = meta.current.dialogConfig
    const { doSubmit, handleDelete, gridActionMessages } = useCommonArtifacts()
    useEffect(() => {
        // const subs2 = filterOn(gridActionMessages.editIbukiMessage).subscribe(
        //     (d: any) => {
        //         //edit
        //         handleEdit(d.data?.row)
        //     }
        // )

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
            // To populate the Entities drop down
            (d: any) => {
                const j = d.data.jsonResult
                const clients = j?.clients || []
                const entities = j?.entities || []
                const users = j?.users || []

                pre.clients = clients.map((x: any) => ({
                    label: ''.concat(
                        'Client code: ',
                        x.clientCode,
                        ', Client name: ',
                        x.clientName
                    ),
                    value: x.id,
                }))
                pre.clients.unshift({
                    label: '--- select ---',
                    value: '',
                })

                pre.entities = entities.map((x: any) => {
                    return {
                        label: x.entityName,
                        value: x.id,
                    }
                })
                pre.entities.unshift({
                    label: '--- select ---',
                    value: '',
                })

                pre.users = users.map((x: any) => {
                    return {
                        label: ''.concat(
                            'Uid: ',
                            x.uid,
                            ', Email: ',
                            x.userEmail,
                            ', User name: ',
                            x.userName
                        ),
                        value: x.id,
                    }
                })
                pre.users.unshift({
                    label: '--- select ---',
                    value: '',
                })
            }
        )

        return () => {
            // subs2.unsubscribe()
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
            headerName: 'Uid',
            description: 'Uid',
            field: 'uid',
            width: 100,
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
            width: 220,
            flex: 1,
        },
        {
            headerName: 'Client code',
            description: 'Client code',
            field: 'clientCode',
            width: 110,
        },
        {
            headerName: 'Client name',
            description: 'Client name',
            field: 'clientName',
            width: 190,
        },
        {
            headerName: 'Entity name',
            description: 'Entity name',
            field: 'entityName',
            width: 110,
        },
        {
            headerName: 'Db name',
            description: 'Database name',
            field: 'dbName',
            width: 160,
        },
    ]

    function handleAdd() {
        resetForm(pre.formId)
        pre.isEditMode = false
        meta.current.showDialog = true
        pre.title = 'Add new association of admin user, client and entity'
        const jsonObject = JSON.parse(JSON.stringify(addJson))
        jsonObject.items[0].options = pre.users
        jsonObject.items[1].options = pre.clients
        jsonObject.items[2].options = pre.entities
        setDialogContentAction(JSON.stringify(jsonObject))
        setRefresh({})
    }

    function handleCloseDialog() {
        meta.current.showDialog = false
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
            const graphQlKey =  'allocateEntitiesToClients'
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
                jsonFieldPath="jsonResult.clientEntityXs"
                sharedData={meta.current.sharedData} // to get entities from original fetched data
                sqlQueryId="getJson_clients_entities_adminUsers_clientEntityXs"
                sqlQueryArgs={{}}
                sx={{ mt: 2 }}
                specialColumns={{
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
export { SuperAdminAssociateAdminUsersWithClientsAndEntities }

const addJson: any = {
    class: 'generic-dialog',
    items: [
        {
            type: 'Select',
            class: 'type-select',
            name: 'userId',
            placeholder: 'Users',
            label: 'Select user',
            options: [],
            validations: [
                // {
                //     name: 'required',
                //     message: 'Please select a user',
                // },
            ],
        },
        {
            type: 'Select',
            class: 'type-select',
            name: 'clientId',
            placeholder: 'Clients',
            label: 'Select client',
            options: [],
            validations: [
                // {
                //     name: 'required',
                //     message: 'Please select a client',
                // },
            ],
        },
        {
            type: 'Select',
            class: 'type-select',
            name: 'entityId',
            placeholder: 'Entities',
            label: 'Select entity',
            options: [],
            validations: [
                // {
                //     name: 'required',
                //     message: 'Please select an entity',
                // },
            ],
        },
    ],
}
