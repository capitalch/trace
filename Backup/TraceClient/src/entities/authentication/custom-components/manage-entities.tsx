import React, { useState, useEffect, useRef } from "react";
// import styled from 'styled-components'
import { DataTable } from 'primereact/datatable'
import { ProgressSpinner } from 'primereact/progressspinner'
import { Column } from "primereact/column"
import { Dialog } from 'primereact/dialog'
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
// import { sharedUtils } from './shared-utils'
import { useSharedCode } from '../../../common-utils/use-shared-code'

function ManageEntities() {
    const [, setRefresh] = useState({})
    const { getCurrentEntity } = manageEntitiesState()
    const { getValidationFabric, resetForm, getFormData,
        resetFormErrors, clearServerError } = manageFormsState()
    const { isValidForm, doValidateForm } = getValidationFabric()
    const { getSqlObjectString, execGenericView , genericUpdateMaster} = utilMethods()
    const meta: any = useRef({
        isMounted: true
        , isLoading: false
        , entities: []
        , isDataChanged: false
        , origData: {}
        , origDataHash: ''
        , showDialog: false
        , dialogConfig: {
            title: 'New entity'
            , formId: 'manageEntities'
            , showSpinner: 'none'
        }
    })
    const { queryGraphql } = graphqlService()
    // const { submitDialog, saveData, closeDialog, TableHeaderDiv, ColumnHeaderLeftDiv } = sharedUtils(meta, setRefresh)
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
        meta.current.isLoading = true
        meta.current.isMounted && setRefresh({})
        meta.current.entities = await execGenericView({
            sqlKey: 'get_entities'
            , isMultipleRows: true
            , args: {}
        })
        meta.current.origDataHash = hash(meta.current.entities)
        meta.current.isLoading = false
        meta.current.isMounted && setRefresh({})
    }

    async function onRowEditSave(e: any) {
        const calculatedHash = hash(meta.current.entities)
        if (calculatedHash !== meta.current.origDataHash) {
            const sqlObjectString = getSqlObjectString(
                {
                    data: e.data,
                    tableName: 'TraceEntity'
                }
            )
            saveData({
                sqlObjectString: sqlObjectString
                , graphQlKey: 'genericUpdateMaster'
                , closeDialog: false
            })
        }
    }

    function onRowEditCancel(e: any) {
        const id = e.data['id']
        const origRow = meta.current.origData[id]
        delete meta.current.origData[id]
        meta.current.entities[e.index] = { ...origRow }
        meta.current.isMounted && setRefresh({})
    }

    function editorForRowEditing(props: any, field: string) {
        return <InputText type="text" value={props.rowData[field]}
            onChange={(e: any) => {
                props.rowData[field] = e.target.value
                setRefresh({})
            }}></InputText>
    }

    function deleteRow(node: any) {
        const id = node.id
        const toDelete = window.confirm(messages['deleteConfirm'])        
        const sqlObjectString = getSqlObjectString(
            {
                tableName: 'TraceEntity'
                , deletedIds: [id]
            }
        )
        if (toDelete) {
            saveData({
                sqlObjectString: sqlObjectString
                , graphQlKey: 'genericUpdateMaster'
                , closeDialog: false
            })
        }
    }

    return (
        <>
            <DataTable style={{ width: '80%' }}
                value={meta.current.entities}
                editMode="row"
                rowEditorValidator={onRowEditorValidator}
                onRowEditInit={onRowEditInit}
                onRowEditSave={onRowEditSave}
                onRowEditCancel={onRowEditCancel}
                loading={meta.current.isLoading}
                header={
                    <TableHeaderDiv> Entities
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
                <Column header={<ColumnHeaderLeftDiv>Entity name</ColumnHeaderLeftDiv>}
                    field="entityName" editor={(props) => editorForRowEditing(props, 'entityName')} />
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
                        // submitDialog()
                        submitDialog({
                            closeDialog: true
                            , graphQlKey: 'genericUpdateMaster'
                            , idInsert: true
                            , tableName: 'TraceEntity'
                        })
                    }}></Button>
                    <Button icon="pi pi-ban" label="Cancel" className="p-button-warning" onClick={
                        () => {
                            closeDialog()
                        }}></Button>
                </div>}>

                <DialogContent formJson={newEntityJson}></DialogContent>
            </Dialog>
        </>
    )
}

export { ManageEntities }

const newEntityJson: any = {
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
/*


*/