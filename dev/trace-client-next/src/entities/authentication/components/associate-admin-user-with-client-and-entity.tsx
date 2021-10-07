import { useState } from 'react'
import { useSharedElements } from './shared-elements-hook'
import _ from 'lodash'

function useAssociateAdminUserWithClientAndEntity(meta: any) {
    const [, setRefresh] = useState({})
    const {
        CloseIcon,
        Column,
        emit,
        execGenericView,
        IconButton,
        resetForm,
        deleteRow,
        submitDialog,
        useStyles,
    } = useSharedElements(meta)
    const classes = useStyles({ meta: meta })

    const associateAdminUserWithClientAndEntity = {
        dataTableColumns: associateAdminUserWithClientAndEntityColumns,
        read: async () => {
            meta.current.minWidth = '600px'
            meta.current.dialogConfig.formId =
                'associateAdminUserWithClientAndEntity'
            meta.current.headerConfig.title = 'Associate admin user'
            meta.current.dialogConfig.jsonObject = clientEntityXJson
            meta.current.dialogConfig.tableName = 'ClientEntityX'
            emit('SHOW-LOADING-INDICATOR', true)
            const ret = await execGenericView({
                sqlKey: 'getJson_clients_entities_adminUsers_clientEntityXs',
                isMultipleRows: false,
            })

            const pre = ret?.jsonResult
            const clients = pre?.clients || []
            const entities = pre?.entities || []
            const users = pre?.users || []

            meta.current.clients = clients.map((x: any) => {
                return {
                    label: x.clientCode.concat(', ', x.clientName),
                    value: x.id,
                }
            })
            meta.current.clients.unshift({ label: '--- select ---', value: '' })
            meta.current.entities = entities.map((x: any) => {
                return {
                    label: x.entityName,
                    value: x.id,
                }
            })
            meta.current.entities.unshift({
                label: '--- select ---',
                value: '',
            })
            meta.current.users = users.map((x: any) => {
                return {
                    label: x.uid.concat(', ', x.userEmail, ', ', x.userName),
                    value: x.id,
                }
            })
            meta.current.users.unshift({ label: '--- select ---', value: '' })

            clientEntityXJson.items[0].options = meta.current.users
            clientEntityXJson.items[1].options = meta.current.clients
            clientEntityXJson.items[2].options = meta.current.entities
            meta.current.data = _.get(pre, 'clientEntityXs', []) || []
            emit('SHOW-LOADING-INDICATOR', false)
            meta.current.isMounted && setRefresh({})
        },

        create: () => {
            meta.current.dialogConfig.title =
                'Associate admin user with client and entity'
            meta.current.dialogConfig.isEditMode = false
            meta.current.dialogConfig.jsonObject = JSON.parse(
                JSON.stringify(clientEntityXJson)
            )
            resetForm(meta.current.dialogConfig.formId)
            meta.current.showDialog = true
            meta.current.isMounted && setRefresh({})
        },

        submit: () => {
            submitDialog({
                graphQlKey: 'allocateEntitiesToClients',
                afterMethod: associateAdminUserWithClientAndEntity.read,
            })
        },
    }

    function associateAdminUserWithClientAndEntityColumns() {
        let numb = 0
        function incr() {
            return ++numb
        }
        return [
            <Column
                key={incr()}
                style={{ width: '4rem' }}
                field="id"
                header={<div className={classes.columnHeaderLeft}>Id</div>}
            />,
            <Column
                key={incr()}
                style={{ width: '5rem' }}
                field="uid"
                header={
                    <div className={classes.columnHeaderLeft}>Uid</div>
                }></Column>,
            <Column
                key={incr()}
                style={{ maxWidth: '10rem' }}
                field="userName"
                header={
                    <div className={classes.columnHeaderLeft}>User name</div>
                }></Column>,
            <Column
                key={incr()}
                style={{ minWidth: '8rem' }}
                field="userEmail"
                header={
                    <div className={classes.columnHeaderLeft}>User email</div>
                }></Column>,
            <Column
                key={incr()}
                style={{ minWidth: '6rem' }}
                header={
                    <div className={classes.columnHeaderLeft}>Client code</div>
                }
                field="clientCode"
            />,
            <Column
                key={incr()}
                style={{ minWidth: '8rem' }}
                header={
                    <div className={classes.columnHeaderLeft}>Client name</div>
                }
                field="clientName"></Column>,
            <Column
                key={incr()}
                style={{ width: '6rem' }}
                header={
                    <div className={classes.columnHeaderLeft}>Entity name</div>
                }
                field="entityName"></Column>,
            <Column
                key={incr()}
                style={{ minWidth: '6rem' }}
                header={
                    <div className={classes.columnHeaderLeft}>
                        Database name
                    </div>
                }
                field="dbName"></Column>,
            <Column
                key={incr()}
                style={{ width: '4rem' }}
                header={<div>Del</div>}
                body={(node: any) => (
                    <IconButton
                        size="medium"
                        color="secondary"
                        onClick={(e) =>
                            deleteRow(
                                node,
                                associateAdminUserWithClientAndEntity.read
                            )
                        }>
                        <CloseIcon></CloseIcon>
                    </IconButton>
                )}></Column>,
        ]
    }
    return { associateAdminUserWithClientAndEntity }
}

export { useAssociateAdminUserWithClientAndEntity }

const clientEntityXJson: any = {
    class: 'generic-dialog',
    items: [
        {
            type: 'Select',
            class: 'type-select',
            name: 'userId',
            placeholder: 'Users',
            label: 'Select user',
            options: [],
            validations: [
                {
                    name: 'required',
                    message: 'Please select a user',
                },
            ],
        },
        {
            type: 'Select',
            class: 'type-select',
            name: 'clientId',
            placeholder: 'Clients',
            label: 'Select client',
            options: [],
            validations: [
                {
                    name: 'required',
                    message: 'Please select a client',
                },
            ],
        },
        {
            type: 'Select',
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
    ],
}
