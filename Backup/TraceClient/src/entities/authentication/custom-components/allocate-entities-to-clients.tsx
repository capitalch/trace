import React, { useState, useEffect, useRef } from "react";
// import styled from 'styled-components'
import { DataTable } from 'primereact/datatable'
import { Column } from "primereact/column"
import { Dialog } from 'primereact/dialog'
import { Checkbox } from "primereact/checkbox"
import 'react-widgets/dist/css/react-widgets.css'
import { Button } from 'primereact/button'
import _ from 'lodash'
import hash from 'object-hash'
import { componentStore } from '../../../react-form/component-store/html-core'
import { manageEntitiesState } from '../../../common-utils/esm'
import ReactForm from '../../../react-form/react-form'
import { graphqlService } from '../../../common-utils/graphql-service'
import { utilMethods } from '../../../common-utils/util-methods'
import queries from '../artifacts/graphql-queries-mutations'
import messages from '../../../messages.json'
import { useSharedCode } from '../../../common-utils/use-shared-code'

function AllocateEntitiesToClients() {
    const [, setRefresh] = useState({})
    const { getCurrentEntity } = manageEntitiesState()
    const { getSqlObjectString, execGenericView } = utilMethods()
    const { queryGraphql} = graphqlService()
    const meta: any = useRef({
        isMounted: true
        , isLoading: false
        , clients: []
        , entities: []
        , clientEntityXs: []
        , isDataChanged: false
        , origData: {}
        , showDialog: false
        , dialogConfig: {
            title: 'AllocateEntitiesToClients'
            , formId: 'allocateEntitiesToClients'
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
        const ret = await execGenericView({
            sqlKey:'getJson_clients_entities_clientEntityXs'
            , isMultipleRows:false
        })
        const pre = ret?.jsonResult
        const clients = pre?.clients || []
        const entities = pre?.entities || []
        meta.current.clients = clients.map((x: any) => {
            return {
                label: x.clientCode.concat(', ', x.clientName)
                , value: x.id
            }
        })
        meta.current.entities = entities.map((x: any) => {
            return {
                label: x.entityName
                , value: x.id
            }
        })

        clientEntityXJson.items[0].options = meta.current.clients
        clientEntityXJson.items[1].options = meta.current.entities
        meta.current.clientEntityXs = _.get(pre, 'clientEntityXs', []) || []

        meta.current.origDataHash = meta.current.clientEntityXs && hash(meta.current.clientEntityXs)
        meta.current.isLoading = false
        meta.current.isMounted && setRefresh({})
    }

    return (
        <>
            <DataTable style={{ width: '85%' }}
                value={meta.current.clientEntityXs}
                loading={meta.current.isLoading}
                header={
                    <TableHeaderDiv> Allocate entities to clients
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
                <Column style={{ width: '10rem' }} header={<ColumnHeaderLeftDiv>Client code</ColumnHeaderLeftDiv>}
                    field="clientCode" />
                <Column header={<ColumnHeaderLeftDiv>Client name</ColumnHeaderLeftDiv>} field="clientName"></Column>
                <Column style={{ width: '7rem' }} header={<ColumnHeaderLeftDiv>Entity name</ColumnHeaderLeftDiv>} field="entityName"></Column>
                <Column header={<ColumnHeaderLeftDiv>Database name</ColumnHeaderLeftDiv>} field="dbName"></Column>
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
                        submitDialog({
                            // tableName: 'ClientEntityX'
                            graphQlKey:'allocateEntitiesToClients'
                            , closeDialog:true
                        })
                    }}></Button>
                    <Button icon="pi pi-ban" label="Cancel" className="p-button-warning" onClick={
                        () => {
                            closeDialog()
                        }}></Button>
                </div>}>
                <Spinner showSpinner={meta.current.dialogConfig.showSpinner}></Spinner>
                {/* content of dialog */}
                <DialogContent formJson={clientEntityXJson}></DialogContent>
                {/* provide space for dropdown list */}
                <div style={{height:'7rem'}}></div>  
            </Dialog>
        </>
    )

}

export { AllocateEntitiesToClients }

const clientEntityXJson: any = {
    "class": "generic-dialog",
    "items": [
        {
            "type": "TypeSelect",
            "class": "type-select",
            "name": "clientId",
            "placeholder": "Clients",
            "label": "Select client",
            "options": [],
            "validations": [
                {
                    "name": "required",
                    "message": "Please select a client"
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

/*

*/
