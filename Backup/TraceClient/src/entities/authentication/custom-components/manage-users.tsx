import React, { useState, useEffect, useRef } from "react";
// import styled from 'styled-components'
import { DataTable } from 'primereact/datatable'
import { Column } from "primereact/column"
import { Checkbox } from "primereact/checkbox"
import { Dialog } from 'primereact/dialog'
import { InputText } from 'primereact/inputtext'
import { ProgressSpinner } from 'primereact/progressspinner'
import { Button } from 'primereact/button'
// import _ from 'lodash'
import hash from 'object-hash'
import { componentStore } from '../../../react-form/component-store/html-core'
import { manageEntitiesState } from '../../../common-utils/esm'
import { manageFormsState } from '../../../react-form/core/fsm'
import ReactForm from '../../../react-form/react-form'
import { graphqlService } from '../../../common-utils/graphql-service'
import { utilMethods } from '../../../common-utils/util-methods'
import queries from '../artifacts/graphql-queries-mutations'
import messages from '../../../messages.json'
import { useSharedCode } from '../../../common-utils/use-shared-code'

// This code is used for both Super admin and admin users. For super admin users in getData() method all users with parentId=null is used.
// For admin users getData() uses query for parentId = id. In befor submitDialog() method is called in button click event of Submit button in dialog, form's parentId property is set to null or id for Super admin and admin respectively
function ManageUsers() {
    const [, setRefresh] = useState({})
    const { getCurrentEntity, getLoginData } = manageEntitiesState()
    const { getFormData, resetForm} = manageFormsState()
    const { getSqlObjectString } = utilMethods()
    const meta: any = useRef({
        isMounted: true
        , isLoading: false
        , users: []
        , isDataChanged: false
        , origData: {}
        , origDataHash: ''
        , showDialog: false
        , dialogConfig: {
            title: 'New user'
            , formId: 'manageUsers'
            , showSpinner: 'none'
        }
    })
    
    const { queryGraphql } = graphqlService()
    const {execGenericView} = utilMethods()
    const { Spinner, TableHeaderDiv, ColumnHeaderLeftDiv, submitDialog
        , saveData, closeDialog, onRowEditInit, onRowEditorValidator, DialogContent
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
        const id = getLoginData().id
        const dt = escape(JSON.stringify({ parentId: id }))
        const q = queries['getUsers'](dt)
        if (q) {
            meta.current.isLoading = true
            meta.current.isMounted && setRefresh({})
            const results: any = await queryGraphql(q)
            meta.current.users = results.data.authentication.getUsers
            meta.current.origDataHash = hash(meta.current.users)
            meta.current.isLoading = false
            meta.current.isMounted && setRefresh({})
        }
    }

    async function onRowEditSave(e: any) {
        const calculatedHash = hash(meta.current.users)
        if (calculatedHash !== meta.current.origDataHash) {
            const sqlObjectString = getSqlObjectString({
                data: e.data,
                tableName: 'TraceUser'
            })
            saveData({ sqlObjectString: sqlObjectString, graphQlKey: 'genericUpdateMaster', closeDialog: false })
        }
    }

    function onRowEditCancel(e: any) {
        const id = e.data['id']
        const origRow = meta.current.origData[id]
        delete meta.current.origData[id]
        meta.current.users[e.index] = { ...origRow }
        meta.current.isMounted && setRefresh({})
    }

    function editorForRowEditing(props: any, field: string) {
        let ret = <></>
        if (field === 'isActive') {
            ret = <Checkbox
                style={{ width: '1.3rem', marginLeft: '0.7rem' }}
                checked={props.rowData[field]}
                onChange={(e: any) => {
                    props.rowData[field] = e.target.checked
                    meta.current.isMounted && setRefresh({})
                }}
            ></Checkbox>
        } else {
            ret = <InputText type="text" value={props.rowData[field]}
                onChange={(e: any) => {
                    props.rowData[field] = e.target.value
                    meta.current.isMounted && setRefresh({})
                }}></InputText>
        }
        return ret
    }

    function deleteRow(node: any) {
        const id = node.id
        const toDelete = window.confirm(messages['deleteConfirm'])
        const sqlObjectString = getSqlObjectString(
            {
                tableName: 'TraceUser'
                , deletedIds: [id]
            })
        if (toDelete) {            
            saveData({ sqlObjectString: sqlObjectString, graphQlKey: 'genericUpdateMaster', closeDialog: false })
        }
    }

    return <>
        <DataTable style={{ width: '85%' }}
            value={meta.current.users}
            editMode="row"
            rowEditorValidator={onRowEditorValidator}
            onRowEditInit={onRowEditInit}
            onRowEditSave={onRowEditSave}
            onRowEditCancel={onRowEditCancel}
            loading={meta.current.isLoading}
            responsive={true}
            header={
                <TableHeaderDiv> Admin users
                    <Button icon="pi pi-refresh" style={{ marginLeft: 'auto' }}
                        label="Refresh" className="p-button-warning"
                        onClick={() => getData()}
                    ></Button>
                    <Button icon="pi pi-plus" style={{ marginLeft: '.5rem', marginRight: '-0.3rem' }}
                        label="New"
                        onClick={e => {
                            meta.current.showDialog = true
                            meta.current.isMounted && setRefresh({})
                        }}
                    ></Button>
                </TableHeaderDiv>}
        >
            <Column style={{ width: '4rem' }} field="id" header={<ColumnHeaderLeftDiv>Id</ColumnHeaderLeftDiv>} />
            <Column header={<ColumnHeaderLeftDiv>Uid</ColumnHeaderLeftDiv>}
                field="uid"
                style={{ width: '10rem' }}
            ></Column>
            <Column header={<ColumnHeaderLeftDiv>Email</ColumnHeaderLeftDiv>}
                field="userEmail"
                style={{ width: '20rem' }}
            ></Column>
            <Column header={<ColumnHeaderLeftDiv>Description</ColumnHeaderLeftDiv>}
                field="descr"
                editor={(props) => editorForRowEditing(props, 'descr')}
            ></Column>
            <Column header={<div>Active</div>}
                field="isActive" style={{ width: '4rem' }}
                body={(node: any) => <Checkbox style={{ marginLeft: '0.7rem' }}
                    checked={node.isActive} disabled={true}></Checkbox>}
                editor={(props) => editorForRowEditing(props, 'isActive')}
            ></Column>
            <Column header={<div>Edit</div>} rowEditor={true} style={{ 'width': '6rem', 'textAlign': 'center' }}
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
                    // set parentId in form which determines whether the user is business user or admin. For admin users parentId is null
                    getFormData(meta.current.dialogConfig.formId)['parentId'] = getLoginData().id
                    submitDialog(
                        { 
                            closeDialog: true                            
                            , graphQlKey: 'createUser' 
                            , tableName:'TraceUser'
                        })
                }}></Button>
                <Button icon="pi pi-ban" label="Cancel" className="p-button-warning" onClick={
                    () => {
                        closeDialog()
                    }}></Button>
            </div>}>
            {/* Progress spinner at center of dialog box */}
            <Spinner showSpinner={meta.current.dialogConfig.showSpinner}></Spinner>
            <DialogContent formJson={newUserJson}></DialogContent>
            {/* <Comp></Comp> */}

        </Dialog>
    </>
}

export { ManageUsers }

const newUserJson: any = {
    "class": "generic-dialog",
    "validations": [
        {
            "name": "userEmailExists"
            , "message": "This email already exists. Please try out another email"
        }
    ],
    "items": [
        {
            "type": "Text",
            "name": "userEmail",
            "placeholder": "Email",
            "label": "User email",
            "validations": [{
                "name": "required",
                "message": "Email field is required"
            }, {
                "name": "email",
                "message": "Invalid email"
            }]
        }
        , {
            "type": "Text",
            "name": "descr",
            "placeholder": "Description",
            "label": "Description",
            "validations": []
        }
    ]
}

/*

*/