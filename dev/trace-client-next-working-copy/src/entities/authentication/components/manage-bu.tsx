import { useState } from '../../../imports/regular-imports'
import { useSharedElements } from './shared-elements-hook'

function useManageBu(meta: any) {
    const [, setRefresh] = useState({})
    const {
        CloseIcon,
        Column,
        emit,
        EditIcon,
        execGenericView,
        getFormData,
        IconButton,
        resetForm,
        deleteRow,
        submitDialog,
        useStyles,
    } = useSharedElements(meta)
    const classes = useStyles({ meta: meta })

    const manageBu = {
        dataTableColumns: manageBuColumns,
        read: async () => {
            meta.current.minWidth = '350px'
            meta.current.dialogConfig.formId = 'manageBu'
            meta.current.headerConfig.title = 'Create Bu'
            meta.current.dialogConfig.jsonObject = newBuJson
            meta.current.dialogConfig.tableName = 'ClientEntityBu'
            meta.current.dialogConfig.isEditMode = false
            emit('SHOW-LOADING-INDICATOR', true)
            const ret = await execGenericView({
                sqlKey: 'getJson_entities_bu',
                isMultipleRows: false,
            })

            const pre = ret?.jsonResult
            const entities = pre.entities || []
            meta.current.entities = entities.map((x: any) => {
                return {
                    label: x.entityName,
                    value: x.id,
                }
            })
            newBuJson.items[0].options = meta.current.entities
            meta.current.data = pre.entitiesBu || []
            emit('SHOW-LOADING-INDICATOR', false)
            meta.current.isMounted && setRefresh({})
        },

        update: (node: any) => {
            resetForm(meta.current.dialogConfig.formId)
            const jsonObject = JSON.parse(JSON.stringify(newBuJson))
            meta.current.dialogConfig.title = 'Edit bu'
            meta.current.dialogConfig.node = node
            meta.current.dialogConfig.isEditMode = true
            jsonObject.validations.pop() // remove validation from the form
            meta.current.dialogConfig.id = node.id
            jsonObject.items.shift()
            jsonObject.items[0].htmlProps = { disabled: true }
            jsonObject.items[0].value = node.buCode
            jsonObject.items[1].value = node.buName

            meta.current.dialogConfig.jsonObject = jsonObject
            meta.current.showDialog = true
            meta.current.isMounted && setRefresh({})
        },

        create: () => {
            meta.current.dialogConfig.title = 'New business unit'
            meta.current.dialogConfig.isEditMode = false
            meta.current.dialogConfig.jsonObject = JSON.parse(
                JSON.stringify(newBuJson)
            )
            resetForm(meta.current.dialogConfig.formId)
            meta.current.showDialog = true
            meta.current.isMounted && setRefresh({})
        },
        submit: () => {
            if (meta.current.dialogConfig.isEditMode) {
                const formData = getFormData(meta.current.dialogConfig.formId)
                formData.id = meta.current.dialogConfig.id
                submitDialog({
                    tableName: meta.current.dialogConfig.tableName,
                    graphQlKey: 'genericUpdateMaster',
                    afterMethod: manageBu.read,
                })
            } else {
                submitDialog({
                    graphQlKey: 'createBuInEntity',
                    afterMethod: manageBu.read,
                })
            }
        },
    }

    function manageBuColumns() {
        return [
            <Column
                key={1}
                style={{ width: '4rem' }}
                field="id"
                header={<div className={classes.columnHeaderLeft}>Id</div>}
            />,
            <Column
                key={2}
                header={
                    <div className={classes.columnHeaderLeft}>Entity name</div>
                }
                field="entityName"
                style={{ minWidth: '6rem' }}></Column>,
            <Column
                key={3}
                header={
                    <div className={classes.columnHeaderLeft}>
                        Business unit short name
                    </div>
                }
                field="buCode"
                style={{ minWidth: '10rem' }}></Column>,
            <Column
                key={3}
                header={
                    <div className={classes.columnHeaderLeft}>
                        Business unit name
                    </div>
                }
                field="buName"
                style={{ minWidth: '10rem' }}></Column>,
            <Column
                key={4}
                header={<div>Edit</div>}
                body={(node: any) => (
                    <IconButton
                        size="medium"
                        color="secondary"
                        onClick={() => manageBu.update(node)}>
                        <EditIcon></EditIcon>
                    </IconButton>
                )}
                style={{ width: '4rem', textAlign: 'center' }}></Column>,
            <Column
                key={5}
                style={{ width: '4rem' }}
                header={<div>Del</div>}
                body={(node: any) => (
                    <IconButton
                        size="medium"
                        color="secondary"
                        onClick={(e) => deleteRow(node, manageBu.read)}>
                        <CloseIcon></CloseIcon>
                    </IconButton>
                )}></Column>,
        ]
    }

    return { manageBu }
}

export { useManageBu }

const newBuJson: any = {
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
