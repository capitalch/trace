import React, { useState, useEffect, useRef } from "react";
// import styled from 'styled-components'
import { DataTable } from 'primereact/datatable'
import { Column } from "primereact/column"
import { Dialog } from 'primereact/dialog'
import { Checkbox } from "primereact/checkbox"
// import Combobox from 'react-widgets/lib/Combobox'
import 'react-widgets/dist/css/react-widgets.css'
import { InputText } from 'primereact/inputtext'
import { Button } from 'primereact/button'
import _ from 'lodash'
import hash from 'object-hash'
import { componentStore } from '../../../react-form/component-store/html-core'
import { manageEntitiesState } from '../../../common-utils/esm'
import { manageFormsState } from '../../../react-form/core/fsm'
import ReactForm from '../../../react-form/react-form'
import { graphqlService } from '../../../common-utils/graphql-service'
import { utilMethods } from '../../../common-utils/util-methods'
import queries from '../artifacts/graphql-queries-mutations'
import messages from '../../../messages.json'
import { useIbuki } from '../../../common-utils/ibuki'
// import { sharedUtils } from './shared-utils'
import { useSharedCode } from '../../../common-utils/use-shared-code'

function ManageClients() {
    const [, setRefresh] = useState({})
    const { emit } = useIbuki()
    const { getCurrentEntity } = manageEntitiesState()
    const { getValidationFabric, resetForm, getFormData,
        resetFormErrors, clearServerError, doFormRefresh, resetAllValidators } = manageFormsState()
    const { isValidForm, doValidateForm } = getValidationFabric()
    const { getSqlObjectString, execGenericView } = utilMethods()
    const { queryGraphql, mutateGraphql } = graphqlService()
    const meta: any = useRef({
        isMounted: true
        , isLoading: false
        , clients: []
        , users: []
        , isDataChanged: false
        , origData: {}
        , origDataHash: ''
        , showDialog: false
        , dialogConfig: {
            title: 'New client'
            , formId: 'manageClients'
            , isEditMode: false
            , node: {}
        }
    })
    // const { saveData, closeDialog, TableHeaderDiv, ColumnHeaderLeftDiv } = sharedUtils(meta, setRefresh)
    const { TableHeaderDiv, ColumnHeaderLeftDiv
        , saveData
        , closeDialog
    } = useSharedCode(meta)
    useEffect(() => {
        meta.current.isMounted = true
        meta.current.isDataChanged = false
        getData()
        return (() => {
            meta.current.isMounted = false
        })
    }, [meta.current.isDataChanged])

    async function getData() {
        meta.current.isLoading = true
        meta.current.isMounted && setRefresh({})
        const ret = await execGenericView({
            sqlKey: 'getJson_clients_users'
            , isMultipleRows: false
            , args: {}
        })
        const pre =  ret['jsonResult']
        meta.current.clients = pre.clients || []
        const users: any[] = pre.users || []
        meta.current.users = users.map((x: any) => {
            return {
                label: x.userEmail.concat(', ', x.uid)
                , value: x.id
            }
        })
        clientJson.items[2].options = meta.current.users
        meta.current.origDataHash = meta.current.clients && hash(meta.current.clients)
        meta.current.isLoading = false
        meta.current.isMounted && setRefresh({})
    }

    function deleteRow(node: any) {
        const id = node.id
        const toDelete = window.confirm(messages['deleteConfirm'])
        const sqlObjectString = getSqlObjectString({
            tableName: 'TraceClient'
            , deletedIds: [id]
        })
        if (toDelete) {
            saveData({
                sqlObjectString: sqlObjectString
                , graphQlKey: 'genericUpdateMaster'
                , closeDialog: false
            })
        }
    }

    function handleEdit(node: any) {
        meta.current.showDialog = true;
        meta.current.dialogConfig.title = 'Edit client'
        meta.current.dialogConfig.node = node
        meta.current.dialogConfig.isEditMode = true
        meta.current.isMounted && setRefresh({})
    }

    // generic subminDialog is not used  because there is some custom code
    async function submitDialog() {
        const formId = meta.current.dialogConfig.formId
        clearServerError(formId)
        await doValidateForm(formId)
        if (isValidForm(formId)) {
            const data = getFormData(formId)
            if (data.isActive === '') {
                data.isActive = false
            }
            if (meta.current.dialogConfig.isEditMode) {
                data.id = meta.current.dialogConfig.node.id // in edit mode id is used to update table
            } else {
                delete data.id
            }
            data.clientCode = data.clientCode.toLowerCase()
            const sqlObjectString = getSqlObjectString({
                data: data,
                tableName: 'TraceClient',
            })
            const graphQlKey: string = meta.current.dialogConfig.isEditMode ? 'genericUpdateMaster' : 'createClient'
            saveData({
                sqlObjectString: sqlObjectString
                , graphQlKey: graphQlKey
                , closeDialog: true
            })
        } else {
            doFormRefresh(formId)
        }
        meta.current.dialogConfig.isEditMode = false
    }

    function Comp() {
        // resetForm(meta.current.dialogConfig.formId)
        resetAllValidators(meta.current.dialogConfig.formId)
        const node = meta.current.dialogConfig.node
        if (meta.current.dialogConfig.isEditMode) {
            clientJson.items[0].value = node.clientCode
            clientJson.items[1].value = node.clientName
            clientJson.items[2].value = node.userId
            clientJson.items[3].value = node.isActive
        } else {
            clientJson.items[0].value = null
            clientJson.items[1].value = null
            clientJson.items[2].value = ''
            clientJson.items[3].value = false
        }
        return <ReactForm
            formId={meta.current.dialogConfig.formId}
            jsonText={JSON.stringify(clientJson)}
            name={getCurrentEntity()}
            componentStore={componentStore}
        ></ReactForm>
    }

    return (
        <>
            <DataTable style={{ width: '80%' }}
                value={meta.current.clients}
                loading={meta.current.isLoading}
                header={
                    <TableHeaderDiv> Clients
                    <Button icon="pi pi-refresh" style={{ marginLeft: 'auto' }}
                            label="Refresh" className="p-button-warning"
                            onClick={() => getData()}
                        ></Button>
                        <Button icon="pi pi-plus" style={{ marginLeft: '.5rem', marginRight: '-0.3rem' }}
                            label="New"
                            onClick={e => {
                                meta.current.showDialog = true
                                meta.current.dialogConfig.isEditMode = false
                                meta.current.isMounted && setRefresh({})
                            }}
                        ></Button>
                    </TableHeaderDiv>}
            >
                <Column style={{ width: '4rem' }} field="id" header={<ColumnHeaderLeftDiv>Id</ColumnHeaderLeftDiv>} />
                <Column style={{ width: '10rem' }} header={<ColumnHeaderLeftDiv>Client code</ColumnHeaderLeftDiv>}
                    field="clientCode" />
                <Column header={<ColumnHeaderLeftDiv>Client name</ColumnHeaderLeftDiv>} field="clientName"></Column>
                <Column style={{ width: '7rem' }} header={<ColumnHeaderLeftDiv>Uid</ColumnHeaderLeftDiv>} field="uid"></Column>
                <Column header={<ColumnHeaderLeftDiv>Admin user email</ColumnHeaderLeftDiv>} field="userEmail"></Column>
                <Column header={<div>Active</div>}
                    field="isActive" style={{ width: '4rem' }}
                    body={(node: any) => <Checkbox style={{ marginLeft: '0.7rem' }}
                        checked={node.isActive} disabled={true}></Checkbox>}
                // editor={(props) => editorForRowEditing(props, 'isActive')}
                ></Column>
                <Column header={<div>Edit</div>}
                    body={(node: any) => <Button className='p-button-warning'
                        icon="pi pi-pencil"
                        onClick={(e: any) => { handleEdit(node) }}
                    ></Button>}
                    style={{ 'width': '6rem', 'textAlign': 'center' }}
                ></Column>
                <Column style={{ width: '4.5rem' }}
                    header={<ColumnHeaderLeftDiv>Delete</ColumnHeaderLeftDiv>}
                    body={(node: any) => <Button className="p-button-danger"
                        icon="pi pi-times"
                        onClick={e => deleteRow(node)}
                    ></Button>}
                ></Column>
            </DataTable>
            <Dialog visible={meta.current.showDialog}
                header={meta.current.dialogConfig.title}
                modal={true}
                style={{ width: '31rem' }}
                closable={true}
                focusOnShow={true}
                onHide={() => {
                    closeDialog()
                }}
                footer={<div>
                    <Button icon="pi pi-check" className="p-button-success" label="Submit" onClick={() => {
                        submitDialog()
                    }}></Button>
                    <Button icon="pi pi-ban" label="Cancel" className="p-button-warning" onClick={
                        () => {
                            closeDialog()
                        }}></Button>
                </div>}>
                {/* content of dialog */}
                <Comp></Comp>
            </Dialog>
        </>
    )
}
export { ManageClients }

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
            "type": "TypeSelect",
            "class": "type-select",
            "name": "userId",
            "placeholder": "User",
            "label": "Select Admin user",
            "options": [],
            "validations": [
                {
                    "name": "required",
                    "message": "Please select an admin user"
                }
            ]
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