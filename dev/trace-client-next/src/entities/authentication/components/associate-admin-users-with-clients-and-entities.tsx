import { XXGrid } from '../../../global-utils/xx-grid'
import { Box, Typography } from '../../../imports/gui-imports'
import { useEffect, useRef, useState } from '../../../imports/regular-imports'
import { useSharedElements } from './shared-elements-hook'
import { ReactForm } from '../../../imports/trace-imports'
import { useCommonArtifacts } from './common-artifacts-hook'

function AssociateAdminUsersWithClientsAndEntities() {
    const [, setRefresh] = useState({})
    const { TraceDialog } = useSharedElements()
    const meta: any = useRef({
        title: 'Admin manage business unit(Bu)',
        showDialog: false,
        sharedData: undefined,
        dialogConfig: {
            isEditMode: false,
            title: '',
            tableName: 'TraceUser',
            formId: 'admin-manage-bu',
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
        // const subs1 = filterOn('FETCH-DATA-MESSAGE').subscribe(() => {
        //     emit(gridActionMessages.fetchIbukiMessage, null)
        // })

        const subs2 = filterOn(gridActionMessages.editIbukiMessage).subscribe(
            (d: any) => {
                //edit
                // handleEdit(d.data?.row)
            }
        )

        const subs3 = filterOn(gridActionMessages.deleteIbukiMessage).subscribe(
            (d: any) => {
                //delete
                const { id1 } = d.data?.row
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
        ).subscribe(
            // To populate the Entities drop down
            (d: any) => {
                const entities = d.data?.jsonResult?.entities || []
                pre.entities = entities.map((x: any) => ({
                    label: x.entityName,
                    value: x.id,
                }))
                // manageBuJson.items[0].options = pre.entities
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
    ]

    const queryId = 'getJson_entities_bu'
    const queryArgs = {}
    const specialColumns = {
        isEdit: true,
        isDelete: true,
    }
    const summaryColNames: string[] = []

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
            let graphQlKey
            pre.isEditMode
                ? (graphQlKey = 'genericUpdateMaster')
                : (graphQlKey = 'createBuInEntity')
            doSubmit({
                data: formData,
                graphQlKey: graphQlKey,
                tableName: 'ClientEntityBu',
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
                jsonFieldPath="jsonResult.entitiesBu"
                sharedData={meta.current.sharedData} // to get entities from original fetched data
                sqlQueryId={queryId}
                sqlQueryArgs={queryArgs}
                sx={{ mt: 2 }}
                specialColumns={specialColumns}
                summaryColNames={summaryColNames}
                toShowAddButton={true}
                viewLimit="100"
            />
            <TraceDialog meta={meta} onClose={handleCloseDialog} />
        </Box>
    )
}
export { AssociateAdminUsersWithClientsAndEntities }
