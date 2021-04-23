import React, { useState, useEffect, useRef } from "react"
import { DataTable } from 'primereact/datatable'
import { Column } from "primereact/column"
import { Checkbox } from "primereact/checkbox"
import { Dialog } from 'primereact/dialog'
// import { InputText } from 'primereact/inputtext'
// import { ProgressSpinner } from 'primereact/progressspinner'
import { Button } from 'primereact/button'
// import _ from 'lodash'
import hash from 'object-hash'
// import { componentStore } from '../../../react-form/component-store/html-core'
import { manageEntitiesState } from '../../../common-utils/esm'
import { manageFormsState } from '../../../react-form/core/fsm'
// import ReactForm from '../../../react-form/react-form'
import { graphqlService } from '../../../common-utils/graphql-service'
import { utilMethods } from '../../../common-utils/util-methods'
import queries from '../artifacts/graphql-queries-mutations'
// import messages from '../../../messages.json'
import { useSharedCode } from '../../../common-utils/use-shared-code'

function ManageBu() {
    const [, setRefresh] = useState({})
    // const { getSqlObjectString } = utilMethods()
    // const { getCurrentEntity } = manageEntitiesState()
    // const { getFormData, resetForm, releaseForm } = manageFormsState()
    const meta: any = useRef({
        isMounted: true
        , isLoading: false
        , entities: []
        , entitiesBu: []
        , isDataChanged: false
        , origData: {}
        , origDataHash: ''
        , showDialog: false
        , dialogConfig: {
            title: 'Create business unit'
            , formId: 'manageBu'
            , showSpinner: 'none'
        }
    })

    // const { queryGraphql } = graphqlService()
    const { execGenericView } = utilMethods()
    const { Spinner, TableHeaderDiv, ColumnHeaderLeftDiv, submitDialog
        , closeDialog, DialogContent
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
            sqlKey: 'getJson_entities_bu'
            , isMultipleRows: false
        })
        const pre = ret?.jsonResult
        const entities = pre.entities || []
        meta.current.entities = entities.map((x: any) => {
            return {
                label: x.entityName
                , value: x.id
            }
        })
        newBuJson.items[0].options = meta.current.entities
        meta.current.entitiesBu = pre.entitiesBu || []
        meta.current.origDataHash = hash(meta.current.entitiesBu)
        meta.current.isLoading = false
        meta.current.isMounted && setRefresh({})

    }

    return <>
        <DataTable style={{ width: '85%' }}
            value={meta.current.entitiesBu}
            loading={meta.current.isLoading}
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
                            meta.current.isMounted && setRefresh({})
                        }}
                    ></Button>
                </TableHeaderDiv>}
        >
            <Column style={{ width: '4rem' }} field="id" header={<ColumnHeaderLeftDiv>Id</ColumnHeaderLeftDiv>} />
            <Column header={<ColumnHeaderLeftDiv>Entity name</ColumnHeaderLeftDiv>}
                field="entityName"
                style={{ width: '10rem' }}
            ></Column>
            <Column header={<ColumnHeaderLeftDiv>Business unit short name</ColumnHeaderLeftDiv>}
                field="buCode"
                style={{ width: '20rem' }}
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
                    submitDialog({ closeDialog: true, graphQlKey: 'createBuInEntity' })
                }}></Button>
                <Button icon="pi pi-ban" label="Cancel" className="p-button-warning" onClick={
                    () => {
                        closeDialog()
                    }}></Button>
            </div>}>
            <Spinner showSpinner={meta.current.dialogConfig.showSpinner}></Spinner>
            <DialogContent formJson={newBuJson}></DialogContent>
        </Dialog>
    </>

}

export { ManageBu }

const newBuJson: any = {
    "class": "generic-dialog",
    "validations": [
        {
            "name": "buCodeExists"
            , "message": "This business unit for your client and entity already exists. Duplicate business units are not allowed"
        }
    ],
    "items": [
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
        , {
            "type": "Text",
            "name": "buCode",
            "placeholder": "Business unit",
            "label": "Business unit short name",
            "validations": [
                {
                    "name": "noWhiteSpaceOrSpecialChar"
                    , "message": "White space or special characters are not allowed"
                }
            ]
        }
    ]
}

/*

*/