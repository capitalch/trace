import { XXGrid } from '../../../global-utils/xx-grid'
import { Box, Typography } from '../../../imports/gui-imports'
import { useEffect, useRef, useState } from '../../../imports/regular-imports'
import { useSharedElements } from './shared-elements-hook'
import { ReactForm } from '../../../imports/trace-imports'
import { useCommonArtifacts } from './common-artifacts-hook'

function useSuperAdminClientsEntitiesHook({ meta }: any) {
    const [, setRefresh] = useState({})
    const { TraceDialog } = useSharedElements()
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
                // handleDelete(id1, pre.tableName)
            }
        )

        const subs4 = filterOn(gridActionMessages.addIbukiMessage).subscribe(
            (d: any) => {
                //Add
                // handleAdd()
            }
        )

        return () => {
            subs2.unsubscribe()
            subs3.unsubscribe()
            subs4.unsubscribe()
        }
    }, [])

    const queryId = 'get_clients'
    const queryArgs = {}
    const specialColumns = {
        isEdit: true,
        isDelete: true,
    }
    const summaryColNames: string[] = []

    function handleAdd() {
        resetForm(pre.formId)
        pre.isEditMode = false
        meta.current.showDialog = true
        // pre.title = meta.current.addTitle
        const addJsonString = JSON.stringify(meta.current.addJson)
        setDialogContentAction(addJsonString)
        setRefresh({})
    }

    function handleCloseDialog() {
        meta.current.showDialog = false
        setRefresh({})
    }

    function handleEdit(node: any) {
        // resetForm(pre.formId)
        // pre.isEditMode = true
        // pre.title = 'Edit client'
        // const jsonObject = JSON.parse(JSON.stringify(addJson))
        // setDialogContentAction(JSON.stringify(jsonObject))
        // pre.id = node.id1
        meta.current.showDialog = true
        // setRefresh({})
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
                tableName: 'ClientEntityBu',
                handleCloseDialog: handleCloseDialog,
            })
        }
    }

    function Comp() {
        return (
            <Box sx={{ height: 'calc(100vh - 180px)' }}>
                <Typography variant="subtitle1" component="div" color="cyan">
                    {meta.current.title}
                </Typography>
                <XXGrid
                    gridActionMessages={gridActionMessages}
                    autoFetchData={true}
                    columns={meta.currentcolumns}
                    jsonFieldPath=""
                    sharedData={meta.current.sharedData} // to get entities from original fetched data
                    sqlQueryId={meta.current.queryId}
                    sqlQueryArgs={meta.current.queryArgs}
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

    return Comp
}
export { useSuperAdminClientsEntitiesHook }
