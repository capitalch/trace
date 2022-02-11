import {_, useState } from '../../../imports/regular-imports'
import { useSharedElements } from './shared-elements-hook'

function useManageClientsEntities(meta:any){
    const [, setRefresh] = useState({})
    const {
        Checkbox,
        CloseSharp,
        Column,
        Edit,
        emit,
        execGenericView,
        IconButton,
        resetForm,
        deleteRow,
        submitDialog,
        useStyles,
    } = useSharedElements(meta)
    const classes = useStyles({ meta: meta })

    const manageClients = {
        dataTableColumns: manageClientsColumns,
        read: async () => {
            meta.current.minWidth = '600px'
            meta.current.dialogConfig.formId = 'manageClients'
            meta.current.headerConfig.title = "Manage clients"
            meta.current.dialogConfig.jsonObject = clientJson
            meta.current.dialogConfig.tableName = 'TraceClient'
            emit('SHOW-LOADING-INDICATOR', true)
            const ret = await execGenericView({
                sqlKey: 'get_clients'
                , isMultipleRows: true
                , args: {}
            })
            meta.current.data = ret || []
            emit('SHOW-LOADING-INDICATOR', false)
            meta.current.isMounted && setRefresh({})
        },
        create:
            () => {
                meta.current.dialogConfig.title = 'Create client'
                meta.current.dialogConfig.isEditMode = false
                meta.current.dialogConfig.jsonObject = JSON.parse(JSON.stringify(clientJson))
                resetForm(meta.current.dialogConfig.formId)
                meta.current.showDialog = true
                meta.current.isMounted && setRefresh({})
            },
        update: //edit
            (node: any) => {
                resetForm(meta.current.dialogConfig.formId)
                const jsonObject = JSON.parse(JSON.stringify(clientJson))
                meta.current.dialogConfig.title = 'Edit client'
                meta.current.dialogConfig.node = node
                meta.current.dialogConfig.isEditMode = true
                jsonObject.items[0].value = node.clientCode
                jsonObject.items[1].value = node.clientName
                jsonObject.items[2].value = node.isActive

                meta.current.dialogConfig.jsonObject = jsonObject
                meta.current.showDialog = true
                meta.current.isMounted && setRefresh({})
            },
        submit:
            () => {
                submitDialog({
                    tableName: 'TraceClient',                    
                    graphQlKey: 'genericUpdateMaster',
                    afterMethod: manageClients.read
                })
            }
    }

    const manageEntities = {
        dataTableColumns: manageEntitiesColumns,
        read: async () => {
            meta.current.minWidth = '350px'
            meta.current.dialogConfig.formId = 'manageEntities'
            meta.current.headerConfig.title = "Manage entities"
            meta.current.dialogConfig.jsonObject = entityJson
            meta.current.dialogConfig.tableName = 'TraceEntity'
            emit('SHOW-LOADING-INDICATOR', true)
            meta.current.data = await execGenericView({
                sqlKey: 'get_entities'
                , isMultipleRows: true
                , args: {}
            })

            emit('SHOW-LOADING-INDICATOR', false)
            meta.current.isMounted && setRefresh({})
        },
        create:
            () => {
                meta.current.dialogConfig.title = 'Create entity'
                meta.current.dialogConfig.isEditMode = false
                meta.current.dialogConfig.jsonObject = JSON.parse(JSON.stringify(entityJson))
                resetForm(meta.current.dialogConfig.formId)
                meta.current.showDialog = true
                meta.current.isMounted && setRefresh({})
            },
        update: //edit
            (node: any) => {
                resetForm(meta.current.dialogConfig.formId)
                const jsonObject = JSON.parse(JSON.stringify(entityJson))
                meta.current.dialogConfig.title = 'Edit entity'
                meta.current.dialogConfig.node = node
                meta.current.dialogConfig.isEditMode = true


                jsonObject.items[0].value = node.id
                jsonObject.items[0].htmlProps = { disabled: true }
                jsonObject.items[1].value = node.entityName

                meta.current.dialogConfig.jsonObject = jsonObject
                meta.current.showDialog = true
                meta.current.isMounted && setRefresh({})
            },
        submit:
            () => {
                submitDialog({
                    tableName: 'TraceEntity'
                    , graphQlKey: 'genericUpdateMaster'
                    , idInsert: meta.current.dialogConfig.isEditMode ? false : true
                    , afterMethod: manageEntities.read
                })
            }
    }

    function manageClientsColumns() {
        let numb = 0
        function incr() {
            return ++numb
        }
        return [
            <Column
                key={incr()}
                style={{ width: '4rem' }}
                field="id"
                header={<div className={classes.columnHeaderLeft}>Id</div>} />,
            <Column
                key={incr()}
                style={{ minWidth: '6rem' }}
                className={classes.bodyBreak}
                header={<div className={classes.columnHeaderLeft}>Client code</div>}
                field="clientCode" />,
            <Column
                key={incr()}
                header={<div className={classes.columnHeaderLeft}>Client name</div>}
                field="clientName"
                style={{ minWidth: '8rem' }}
                className={classes.bodyBreak}>
            </Column>,
            <Column
                key={incr()}
                header={<div>Active</div>}
                field="isActive" style={{ width: '5rem' }}
                body={(node: any) => <Checkbox checked={node.isActive} disabled={true} color='secondary'></Checkbox>}
            ></Column>,
            <Column
                key={incr()}
                header={<div>Edit</div>}
                body={(node: any) =>
                    <IconButton
                        size='medium'
                        color='secondary'                        
                        onClick = {()=>manageClients.update(node)}
                    >
                        <Edit></Edit>
                    </IconButton>
                }
                style={{ 'width': '4rem', 'textAlign': 'center' }}
            ></Column>,
            <Column
                key={incr()}
                style={{ width: '4rem' }}
                header={<div>Del</div>}
                body={(node: any) =>
                    <IconButton
                        size='medium'
                        color='secondary'
                        onClick={e => deleteRow(node, manageClients.read)}>
                        <CloseSharp></CloseSharp>
                    </IconButton>
                }
            ></Column>
        ]
    }

    function manageEntitiesColumns() {
        return [
            <Column
                key={1}
                style={{ width: '4rem' }}
                field="id"
                header={<div className={classes.columnHeaderLeft}>Id</div>} />,
            <Column
                key={2}
                className={classes.bodyBreak}
                header={<div className={classes.columnHeaderLeft}>Entity name</div>}
                field="entityName"
            />,
            <Column
                key={3}
                header={<div>Edit</div>}
                body={(node: any) =>
                    <IconButton
                        size='medium'
                        color='secondary'                        
                        onClick={()=> manageEntities.update(node)}>
                        <Edit></Edit>
                    </IconButton>
                }
                style={{ 'width': '4rem', 'textAlign': 'center' }}
            ></Column>,
            <Column
                key={4}
                style={{ width: '4rem' }}
                header={<div>Del</div>}
                body={(node: any) =>
                    <IconButton
                        size='medium'
                        color='secondary'
                        onClick={e => deleteRow(node, manageEntities.read)}>
                        <CloseSharp></CloseSharp>
                    </IconButton>
                }
            ></Column>
        ]
    }

    return {manageClients, manageEntities}
}

export {useManageClientsEntities}

const clientJson: any = {
    "class": "generic-dialog",
    "items": [
        {
            "type": "Text",
            "name": "clientCode",
            "placeholder": "Client code",
            "label": "Client code",
            "validations": [{
                "name": "required",
                "message": "Client code is required"
            }, {
                "name": "noWhiteSpaceOrSpecialChar",
                "message": "White space or special characters are not allowed"
            },
            {
                "name": "maxLength"
                , "message": "Maximum length of Client code can be 10 characters"
                , "args": [10]
            }
            ]
        },
        {
            "type": "Text",
            "name": "clientName",
            "placeholder": "Client name",
            "label": "Client name",
            "validations": [{
                "name": "required",
                "message": "Client name is required"
            }, {
                "name": "noSpecialChar",
                "message": "Special characters and space at end are not allowed in client name"
            }]
        },
        {
            "type": "Checkbox"
            , "name": "isActive"
            , "placeholder": "Is active"
            , "label": "Is active"
            , "validations": [
            ]
        }
    ]
}

const entityJson: any = {
    "class": "generic-dialog",
    "items": [
        {
            "type": "Text",
            "name": "id",
            "placeholder": "Id",
            "label": "Id",
            "validations": [{
                "name": "required",
                "message": "Id field is required"
            }, {
                "name": "numbersOnly",
                "message": "Only numbers are allowed as Id"
            }]
        },
        {
            "type": "Text",
            "name": "entityName",
            "placeholder": "Entity name",
            "label": "Entity name",
            "validations": [{
                "name": "required",
                "message": "Entity name is required"
            }, {
                "name": "noWhiteSpaceOrSpecialChar",
                "message": "White space or special characters are not allowed inside entity name"
            }]
        }
    ]
}