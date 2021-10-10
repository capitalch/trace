import {  Paper,} from '../../../../imports/gui-imports'
import { AddCircle,DeleteIcon, EditIcon, SyncIcon,} from '../../../../imports/icons-import'
import { useState,MaterialTable, useEffect, } from '../../../../imports/regular-imports'
import { useSharedElements } from '../shared/shared-elements-hook'
import { useBrandsMaster, useStyles } from './brands-master-hook'

function BrandsMaster() {
    const [, setRefresh] = useState({})
    const { meta } = useBrandsMaster()
    const classes = useStyles()

    useEffect(() => {
        meta.current.isMounted = true
        getData()
        return (() => {
            meta.current.isMounted = false
        })
    }, [])

    const {
        confirm,
        doValidateForm,
        emit,
        execGenericView,
        getCurrentEntity,
        getFormData,
        isValidForm,
        messages,
        ReactForm,
        resetForm,
        saveForm,
        tableIcons,
        TraceDialog,
        TraceFullWidthSubmitButton,
    }: any = useSharedElements()

    return <Paper className={classes.content}>
        <MaterialTable
            actions={getActionsList()}
            columns={getColumns()}
            data={meta.current.data}
            icons={tableIcons}
            options={{
                actionsColumnIndex: 1,
                paging: true,
                pageSize: 12,
                pageSizeOptions: [12, 20, 30, 50, 100],
                search: true,
            }}
            title={meta.current.title}

        ></MaterialTable>
        <TraceDialog meta={meta} />
    </Paper>

    function getActionsList() {
        return ([
            {
                icon: () => <EditIcon color='primary' />,
                toolTip: 'Edit',
                name: 'edit',
                onClick: handleEdit
            },
            {
                icon: () => <DeleteIcon color='error' />,
                toolTip: 'Delete',
                name: 'delete',
                onClick: handleDelete
            },
            {
                icon: () => <SyncIcon className="refresh-icon" />,
                toolTip: 'Refresh',
                name: 'refresh',
                isFreeAction: true,
                onClick: getData
            },
            {
                icon: () => <AddCircle className="add-icon" />,
                toolTip: 'Add',
                name: 'add',
                isFreeAction: true,
                onClick: handleAdd
            }
        ])
    }

    function getColumns() {
        return (
            [
                { title: "Index", field: "index", width: 10 },
                { title: "Brand name", field: "brandName" },
                { title: "Remarks", field: "remarks" },
            ]
        )
    }

    async function getData() {
        emit('SHOW-LOADING-INDICATOR', true)
        const result: any = await execGenericView({
            isMultipleRows: true,
            sqlKey: 'get_brands'
        })
        emit('SHOW-LOADING-INDICATOR', false)
        meta.current.data = result
        meta.current.isMounted && setRefresh({})
    }

    function handleAdd(e: any, rowData: any) {
        const pre = meta.current.dialogConfig
        pre.title = "Add brand"
        pre.formId = 'traceAddBrand'
        resetForm(pre.formId)
        pre.content = add
        pre.actions = () => <TraceFullWidthSubmitButton onClick={submit} />
        meta.current.showDialog = true
        meta.current.isMounted && setRefresh({})

        function add() {
            if (!meta.current.showDialog) { // to avoid un-necessary execution of code while closing the dialog box
                return <></>
            }
            const json: any = getjson()
            const ret = <ReactForm
                formId={meta.current.dialogConfig.formId}
                jsonText={JSON.stringify(json)}
                name={getCurrentEntity()}
            />
            return (ret)
        }

        async function submit() {
            const formData = JSON.parse(JSON.stringify(getFormData(meta.current.dialogConfig.formId)))
            const formId = meta.current.dialogConfig.formId
            formData.brandName = formData.brandName.toUpperCase()
            await doValidateForm(formId)
            const options: any = {
                data: {
                    data: formData,
                    tableName: 'BrandM',
                },
                afterMethod: handleOnCloseDialog,
                queryId: 'genericUpdateMaster',
            }
            if (isValidForm(formId)) {
                saveForm(options)
            } else {
                meta.current.isMounted && setRefresh({})
            }
        }
    }

    function handleDelete(e: any, rowData: any) {
        try {
            const id = rowData.id
            const deletedIds = [id]
            const options: any = {
                data: {
                    tableName: 'BrandM',
                    deletedIds: deletedIds
                },
                queryId: 'genericUpdateMaster'
            }
            const confirmOptions = {
                description: messages.deleteConfirm,
                title: messages.deleteMessage,
                cancellationText: 'Cancel'
            }
            confirm(confirmOptions).then(async () => {
                await saveForm(options)
            }).catch(() => { })
        } catch (e) {
            console.log(e)
        }
    }

    function handleEdit(e: any, rowData: any) {
        const pre = meta.current.dialogConfig
        pre.title = `Edit brand &{rowData.brandName}`
        pre.formId = 'traceEditBrand'
        resetForm(pre.formId)
        pre.content = edit
        pre.actions = () => <TraceFullWidthSubmitButton onClick={submit} />
        meta.current.showDialog = true
        meta.current.isMounted && setRefresh({})

        function edit() {
            if (!meta.current.showDialog) { // to avoid un-necessary execution of code while closing the dialog box
                return
            }
            const json: any = getjson()
            json.items[0].value = rowData.brandName
            json.items[1].value = rowData.remarks
            const ret = <ReactForm
                formId={meta.current.dialogConfig.formId}
                jsonText={JSON.stringify(json)}
                name={getCurrentEntity()}
            />
            return (ret)
        }

        async function submit() {
            const formData = JSON.parse(JSON.stringify(getFormData(meta.current.dialogConfig.formId)))
            formData.id = rowData.id
            formData.brandName = formData.brandName.toUpperCase()
            const formId = meta.current.dialogConfig.formId
            await doValidateForm(formId)
            const options: any = {
                data: {
                    data: formData,
                    tableName: 'BrandM',
                },
                afterMethod: handleOnCloseDialog,
                queryId: 'genericUpdateMaster',
            }
            if (isValidForm(formId)) {
                saveForm(options)
            } else {
                meta.current.isMounted && setRefresh({})
            }
        }        
    }

    function getjson() {
        return {
            "class": "generic-dialog",
            "style": { width: '100%' },
            "items": [
                {
                    "type": "Text",
                    "name": "brandName",
                    "label": "Brand name",
                    "validations": [{
                        "name": "required",
                        "message": "Brand name is required"
                    }]
                },
                {
                    "type": "Text",
                    "name": "remarks",
                    "label": "Remarks",
                },
            ]
        }
    }

    function handleOnCloseDialog() {
        meta.current.showDialog = false
        meta.current.isMounted && setRefresh({})
    }
}


export { BrandsMaster }