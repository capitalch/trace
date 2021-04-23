import React, { useState, useEffect, useRef } from "react";
// import styled from 'styled-components'
import { DataTable } from 'primereact/datatable'
import { Column } from "primereact/column"
import { Dialog } from 'primereact/dialog'
import { Checkbox } from "primereact/checkbox"
import { ProgressSpinner } from 'primereact/progressspinner'
// import Combobox from 'react-widgets/lib/Combobox'
import 'react-widgets/dist/css/react-widgets.css'
// import { InputText } from 'primereact/inputtext'
import { Button } from 'primereact/button'
import _ from 'lodash'
import hash from 'object-hash'
import { componentStore } from '../../../react-form/component-store/html-core'
import { manageEntitiesState } from '../../../common-utils/esm'
// import { manageFormsState } from '../../../react-form/core/fsm'
import ReactForm from '../../../react-form/react-form'
import { graphqlService } from '../../../common-utils/graphql-service'
import { utilMethods } from '../../../common-utils/util-methods'
import queries from '../artifacts/graphql-queries-mutations'
import messages from '../../../messages.json'
// import { useIbuki } from '../../../common-utils/ibuki'
// import { sharedUtils } from './shared-utils'
import { useSharedCode } from '../../../common-utils/use-shared-code'

function AllocateUsersToEntities() {
    const [, setRefresh] = useState({})
    const { getCurrentEntity } = manageEntitiesState()
    const { getSqlObjectString, execGenericView } = utilMethods()
    const { queryGraphql } = graphqlService()
    const meta: any = useRef({
        isMounted: true
        , isLoading: false
        , users: []
        , entities: []
        , clientEntityUserXs: []
        , isDataChanged: false
        , origData: {}
        , showDialog: false
        , dialogConfig: {
            title: 'Allocate users to entities'
            , formId: 'allocateUsersToEntities'
            , showSpinner: 'none'
        }
    })

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
        const ret:any = await execGenericView({
            sqlKey: 'getJson_entities_users_clientEntityUserXs'
            , isMultipleRows: false
        })
        const pre = ret?.jsonResult
        const users = pre?.users || []
        const entities = pre?.entities || []
        meta.current.users = users.map((x: any) => {
            return {
                label: x.uid.concat(', ', x.userEmail)
                , value: x.id
            }
        })
        meta.current.entities = entities.map((x: any) => {
            return {
                label: x.entityName
                , value: x.id
            }
        })
        clientEntityUserXJson.items[0].options = meta.current.users
        clientEntityUserXJson.items[1].options = meta.current.entities
        meta.current.clientEntityUserXs = _.get(pre, 'clientEntityUserXs', []) || []

        meta.current.origDataHash = meta.current.clientEntityXs && hash(meta.current.clientEntityXs)
        meta.current.isLoading = false
        meta.current.isMounted && setRefresh({})

    }

    function deleteRow(node: any) {
        const id = node.id
        const toDelete = window.confirm(messages['deleteConfirm'])
        const sqlObjectString = getSqlObjectString({
            tableName: 'ClientEntityUserX'
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

    return (
        <>
            <DataTable style={{ width: '85%' }}
                value={meta.current.clientEntityUserXs}
                responsive={true}
                header={
                    <TableHeaderDiv>{meta.current.dialogConfig.title}
                        <Button icon="pi pi-refresh" style={{ marginLeft: 'auto' }}
                            label="Refresh" className="p-button-warning"
                            onClick={() => getData()}
                        ></Button>
                        <Button icon="pi pi-plus" style={{ marginLeft: '.5rem', marginRight: '-0.3rem' }}
                            label="New"
                            onClick={e => {
                                meta.current.showDialog = true
                                // meta.current.dialogConfig.isEditMode = false
                                meta.current.isMounted && setRefresh({})
                            }}
                        ></Button>
                    </TableHeaderDiv>}
            >
                <Column style={{ width: '4rem' }} field="id" header={<ColumnHeaderLeftDiv>Id</ColumnHeaderLeftDiv>} />
                <Column style={{ width: '10rem' }} header={<ColumnHeaderLeftDiv>Uid</ColumnHeaderLeftDiv>}
                    field="uid" />
                <Column header={<ColumnHeaderLeftDiv>User email</ColumnHeaderLeftDiv>} field="userEmail"></Column>
                <Column style={{ width: '7rem' }} header={<ColumnHeaderLeftDiv>Entity name</ColumnHeaderLeftDiv>} field="entityName"></Column>
                <Column header={<ColumnHeaderLeftDiv>Database name</ColumnHeaderLeftDiv>} field="dbName"></Column>
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
                            tableName: 'ClientEntityUserX'
                            , graphQlKey: 'allocateUsersToEntities'
                            , closeDialog: true
                        })
                    }}></Button>
                    <Button icon="pi pi-ban" label="Cancel" className="p-button-warning" onClick={
                        () => {
                            closeDialog()
                        }}></Button>
                </div>}>
                <Spinner showSpinner={meta.current.dialogConfig.showSpinner}></Spinner>
                {/* content of dialog */}
                <DialogContent formJson={clientEntityUserXJson}></DialogContent>
                <div style={{ 'height': '5rem' }}></div>
            </Dialog>
        </>
    )
}

export { AllocateUsersToEntities }

const clientEntityUserXJson: any = {
    "class": "generic-dialog",
    "validations": [
        {
            "name": "userAlreadyAllocated"
            , "message": "This user is already allocated to selected entity"
        }
    ]
    , "items": [
        {
            "type": "TypeSelect",
            "class": "type-select",
            "name": "userId",
            "placeholder": "Users",
            "label": "Select user",
            "options": [],
            "validations": [
                {
                    "name": "required",
                    "message": "Please select a user"
                }
            ]
        },
        {
            "type": "TypeSelect",
            "class": "type-select",
            "name": "entityId",
            "placeholder": "Entities",
            "label": "Select entity",
            "options": [],
            "validations": [
                {
                    "name": "required",
                    "message": "Please select an entity"
                }
            ]
        }
    ]
}