// import { XXGrid } from '../../../global-utils/xx-grid'
// import { Box, Typography } from '../../../imports/gui-imports'
import { useEffect, useRef, useState } from '../../../imports/regular-imports'
// import { useSharedElements } from './shared-elements-hook'
// import { ReactForm } from '../../../imports/trace-imports'
// import { useCommonArtifacts } from './common-artifacts-hook'
import { useSuperAdminClientsEntitiesHook } from './super-admin-clients-entities-hook'

function SuperAdminManageClients() {
    const meta: any = useRef({
        title: 'Manage clients',
        showDialog: false,
        sharedData: undefined,
        addJson: undefined,
        queryId: 'get_clients',
        queryArgs: {},
        columns: [],
        dialogConfig: {
            isEditMode: false,
            addTitle: '',
            editTitle: '',            
            tableName: 'TraceClient',
            formId: 'super-admin-manage-clients',
            actions: () => {},
            content: () => <></>,
        },
    })
    meta.current.addJson = addJson
    meta.current.columns = [
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
            headerName: 'Client Code',
            description: 'Client code',
            field: 'clientCode',
            width: 190,
        },
        {
            headerName: 'Client name',
            description: 'Client name',
            field: 'clientName',
            width: 190,
            flex: 1,
        },
        {
            headerName: 'Active',
            description: 'Active',
            field: 'isActive',
            width: 80,
            type: 'boolean',
        },
    ]
    
    const Comp = useSuperAdminClientsEntitiesHook({meta})

    return (
        <Comp />
    )
}

export { SuperAdminManageClients }

const addJson: any = {
    class: 'generic-dialog',
    items: [
        {
            type: 'Text',
            name: 'clientCode',
            placeholder: 'Client code',
            label: 'Client code',
            validations: [
                {
                    name: 'required',
                    message: 'Client code is required',
                },
                {
                    name: 'noWhiteSpaceOrSpecialChar',
                    message:
                        'White space or special characters are not allowed',
                },
                {
                    name: 'maxLength',
                    message:
                        'Maximum length of Client code can be 10 characters',
                    args: [10],
                },
            ],
        },
        {
            type: 'Text',
            name: 'clientName',
            placeholder: 'Client name',
            label: 'Client name',
            validations: [
                {
                    name: 'required',
                    message: 'Client name is required',
                },
                {
                    name: 'noSpecialChar',
                    message:
                        'Special characters and space at end are not allowed in client name',
                },
            ],
        },
        {
            type: 'Checkbox',
            name: 'isActive',
            placeholder: 'Is active',
            label: 'Is active',
            validations: [],
        },
    ],
}
