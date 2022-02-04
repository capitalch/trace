import { XXGrid } from '../../../global-utils/xx-grid'
import { Box, Typography } from '../../../imports/gui-imports'
import { useEffect, useRef, useState } from '../../../imports/regular-imports'
import { useSharedElements } from './shared-elements-hook'
import { ReactForm } from '../../../imports/trace-imports'
import { useCommonArtifacts } from './common-artifacts-hook'

function SuperAdminManageEntities() {
    const [, setRefresh] = useState({})
    const { TraceDialog } = useSharedElements()
    const meta: any = useRef({
        title: 'Manage entities',
        showDialog: false,
        sharedData: undefined,
        dialogConfig: {
            isEditMode: false,
            title: '',
            tableName: 'TraceEntity',
            formId: 'super-admin-manage-entities',
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
            headerName: 'Entity name',
            description: 'Entity name',
            field: 'entityName',
            width: 200,
            flex: 1,
        },
    ]

    function handleAdd() {
        resetForm(pre.formId)
        meta.current.showDialog = true
        pre.title = 'Add new entity'
        pre.isEditMode = false
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
        pre.title = 'Edit entity'
        const jsonObject = JSON.parse(JSON.stringify(addJson))
        jsonObject.items[0].value = node.id
        jsonObject.items[0].htmlProps = { disabled: true }
        jsonObject.items[1].value = node.entityName

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
                sqlQueryId="get_entities"
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
export { SuperAdminManageEntities }

const addJson: any = {
    class: 'generic-dialog',
    items: [
        {
            type: 'Text',
            name: 'id',
            placeholder: 'Id',
            label: 'Id',
            validations: [
                {
                    name: 'required',
                    message: 'Id field is required',
                },
                {
                    name: 'numbersOnly',
                    message: 'Only numbers are allowed as Id',
                },
            ],
        },
        {
            type: 'Text',
            name: 'entityName',
            placeholder: 'Entity name',
            label: 'Entity name',
            validations: [
                {
                    name: 'required',
                    message: 'Entity name is required',
                },
                {
                    name: 'noWhiteSpaceOrSpecialChar',
                    message:
                        'White space or special characters are not allowed inside entity name',
                },
            ],
        },
    ],
}
