import { useEffect, useRef, useState } from '../../../imports/regular-imports'
import { useSharedElements } from './shared-elements-hook'
import { ReactForm, } from '../../../imports/trace-imports'
import { useCommonArtifacts } from './common-artifacts-hook'

function useAdminManageBu() {
    const [, setRefresh] = useState({})
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
    const {doSubmit, handleDelete, gridActionMessages } = useCommonArtifacts()
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
                handleDelete(id1, 'ClientEntityBu')
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
                const entities = d.data?.jsonResult?.entities || []
                pre.entities = entities.map((x: any) => ({
                    label: x.entityName,
                    value: x.id,
                }))
                manageBuJson.items[0].options = pre.entities
            }
        )

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
            headerName: 'Entity name',
            description: 'Entity name',
            field: 'entityName',
            width: 200,
        },
        {
            headerName: 'Business unit short name',
            description: 'Business unit short name',
            field: 'buCode',
            width: 250,
        },
        {
            headerName: 'Business unit name',
            description: 'Business unit name',
            field: 'buName',
            width: 300,
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
        meta.current.showDialog = true
        pre.title = 'Add new business unit (Bu)'
        pre.isEditMode = false
        const addJsonString = JSON.stringify(manageBuJson)
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
        pre.title = 'Edit business unit(Bu)'
        const jsonObject = JSON.parse(JSON.stringify(manageBuJson))
        jsonObject.validations.pop() // remove validation from the form
        jsonObject.items.shift()
        jsonObject.items[0].htmlProps = { disabled: true }
        jsonObject.items[0].value = node.buCode
        jsonObject.items[1].value = node.buName
        setDialogContentAction(JSON.stringify(jsonObject))
        pre.id = node.id1
        meta.current.showDialog = true
        setRefresh({})
    }

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
            handleCloseDialog: handleCloseDialog
        })
    }

    const queryId = 'getJson_entities_bu'
    const queryArgs = {}
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

export { useAdminManageBu }

const manageBuJson: any = {
    class: 'generic-dialog',
    validations: [
        {
            name: 'buCodeExists',
            message:
                'This business unit for your client and entity already exists. Duplicate business units are not allowed',
        },
    ],
    items: [
        {
            type: 'TypeSelect',
            class: 'type-select',
            name: 'entityId',
            placeholder: 'Entities',
            label: 'Select entity',
            options: [],
            validations: [
                {
                    name: 'required',
                    message: 'Please select an entity',
                },
            ],
        },
        {
            type: 'Text',
            name: 'buCode',
            placeholder: 'Business unit',
            label: 'Business unit short name',
            validations: [
                {
                    name: 'noWhiteSpaceOrSpecialChar',
                    message:
                        'White space or special characters are not allowed',
                },
            ],
        },
        {
            type: 'Text',
            name: 'buName',
            placeholder: 'Business unit name',
            label: 'Business unit name',
            validations: [
                {
                    name: 'required',
                    message: 'Business unit name is required',
                },
            ],
        },
    ],
}
