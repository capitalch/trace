import { _, PrimeColumn, useState } from '../../../imports/regular-imports'
import { IconButton } from '../../../imports/gui-imports'
import { CloseSharp, Settings } from '../../../imports/icons-import'
import { useSharedElements } from './shared-elements-hook'

function useAllocateUsersToEntities(meta: any) {
    const [, setRefresh] = useState({})
    const {
        emit,
        execGenericView,
        genericUpdateMasterNoForm,
        resetForm,
        closeDialog,
        deleteRow,
        submitDialog,
        useStyles,
    } = useSharedElements(meta)
    const classes = useStyles({ meta: meta })

    const allocateUsersToEntities = {
        dataTableColumns: allocateUsersToEntitiesColumns,
        read: async () => {
            meta.current.minWidth = '600px'
            meta.current.dialogConfig.formId = 'allocateUsersToEntities'
            meta.current.headerConfig.title = 'Allocate users'
            meta.current.dialogConfig.jsonObject = clientEntityUserXJson
            meta.current.dialogConfig.tableName = 'ClientEntityUserX'
            emit('SHOW-LOADING-INDICATOR', true)
            const ret: any = await execGenericView({
                sqlKey: 'getJson_entities_users_clientEntityUserXs',
                isMultipleRows: false,
            })

            const pre = ret?.jsonResult
            const users = pre?.users || []
            const entities = pre?.entities || []
            meta.current.users = users.map((x: any) => {
                return {
                    label: x.uid.concat(', ', x.userEmail),
                    value: x.id,
                }
            })
            meta.current.entities = entities.map((x: any) => {
                return {
                    label: x.entityName,
                    value: x.id,
                }
            })
            clientEntityUserXJson.items[0].options = meta.current.users
            clientEntityUserXJson.items[1].options = meta.current.entities
            meta.current.data = _.get(pre, 'clientEntityUserXs', []) || []
            emit('SHOW-LOADING-INDICATOR', false)
            meta.current.isMounted && setRefresh({})
        },

        create: () => {
            meta.current.dialogConfig.title = 'Allocate users'
            meta.current.dialogConfig.isEditMode = false
            meta.current.dialogConfig.jsonObject = JSON.parse(
                JSON.stringify(clientEntityUserXJson)
            )
            resetForm(meta.current.dialogConfig.formId)
            meta.current.showDialog = true
            resetPermission()
            meta.current.isMounted && setRefresh({})
        },

        submit: async () => {
            if (meta.current.dialogConfig.isEditMode) {
                const ret = await genericUpdateMasterNoForm({
                    tableName: 'ClientEntityUserX',
                    data: {
                        id: meta.current.dialogConfig.permissionConfig.id,
                        permissions: JSON.stringify(
                            meta.current.dialogConfig.permissionConfig.data.map(
                                (item: any) => {
                                    item.tableData = undefined
                                    return item
                                }
                            )
                        ),
                    },
                })
                if (ret) {
                    resetPermission()
                    closeDialog()
                }
            } else {
                submitDialog({
                    tableName: 'ClientEntityUserX',
                    graphQlKey: 'allocateUsersToEntities',
                    afterMethod: allocateUsersToEntities.read,
                })
            }
        },
    }

    function allocateUsersToEntitiesColumns() {
        let numb = 0
        function incr() {
            return ++numb
        }
        return [
            <PrimeColumn
                key={incr()}
                style={{ width: '4rem' }}
                field="id"
                header={<div className={classes.columnHeaderLeft}>Id</div>}
            />,
            <PrimeColumn
                key={incr()}
                style={{ minWidth: '4rem' }}
                className={classes.bodyBreak}
                header={<div className={classes.columnHeaderLeft}>Uid</div>}
                field="uid"
            />,
            <PrimeColumn
                key={incr()}
                className={classes.bodyBreak}
                style={{ minWidth: '10rem' }}
                header={
                    <div className={classes.columnHeaderLeft}>User email</div>
                }
                field="userEmail"></PrimeColumn>,
            <PrimeColumn
                key={incr()}
                style={{ width: '8rem', textAlign: 'center' }}
                header={<div>Permission</div>}
                body={(node: any) => (
                    <IconButton
                        size="medium"
                        color="secondary"
                        onClick={(e:any) => {
                            meta.current.dialogConfig.permissionConfig.isPermission = true
                            meta.current.dialogConfig.isEditMode = true
                            if (_.isEmpty(node.permissions)) {
                                meta.current.dialogConfig.permissionConfig.data = JSON.parse(
                                    JSON.stringify(accountsPermissionControls)
                                )
                            } else {
                                meta.current.dialogConfig.permissionConfig.data =
                                    node.permissions
                            }
                            meta.current.dialogConfig.permissionConfig.id =
                                node.id
                            meta.current.showDialog = true
                            meta.current.dialogConfig.title = 'User permissions'
                            meta.current.isMounted && setRefresh({})
                        }}>
                        <Settings></Settings>
                    </IconButton>
                )}></PrimeColumn>,
            <PrimeColumn
                key={incr()}
                style={{ minWidth: '6rem' }}
                className={classes.bodyBreak}
                header={
                    <div className={classes.columnHeaderLeft}>Entity name</div>
                }
                field="entityName"></PrimeColumn>,
            <PrimeColumn
                key={incr()}
                className={classes.bodyBreak}
                header={
                    <div className={classes.columnHeaderLeft}>
                        Database name
                    </div>
                }
                field="dbName"></PrimeColumn>,
            <PrimeColumn
                key={incr()}
                style={{ width: '4rem' }}
                header={<div>Delete</div>}
                body={(node: any) => (
                    <IconButton
                        size="medium"
                        color="secondary"
                        onClick={(e:any) =>
                            deleteRow(node, allocateUsersToEntities.read)
                        }>
                        <CloseSharp></CloseSharp>
                    </IconButton>
                )}></PrimeColumn>,
        ]
    }

    function resetPermission() {
        meta.current.dialogConfig.permissionConfig.id = ''
        meta.current.dialogConfig.permissionConfig.data = []
        meta.current.dialogConfig.permissionConfig.isPermission = false
        meta.current.dialogConfig.isEditMode = false
    }
    return { allocateUsersToEntities }
}

export { useAllocateUsersToEntities }

const clientEntityUserXJson: any = {
    class: 'generic-dialog',
    validations: [
        {
            name: 'userAlreadyAllocated',
            message: 'This user is already allocated to selected entity',
        },
    ],
    items: [
        {
            type: 'TypeSelect',
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
    ],
}

const accountsPermissionControls: any = [
    {
        controlId: 1,
        controlName: 'vouchersMenu',
        descr: 'Vouchers main menu',
        isActive: true,
    },
    {
        controlId: 2,
        controlName: 'paymentsSubMenu',
        descr: 'Payments sub menu',
        isActive: true,
    },
    {
        controlId: 3,
        controlName: 'receiptsSubMenu',
        descr: 'Receipts sub menu',
        isActive: true,
    },
    {
        controlId: 4,
        controlName: 'contraSubMenu',
        descr: 'Contra sub menu',
        isActive: true,
    },
    {
        controlId: 5,
        controlName: 'journalsSubMenu',
        descr: 'Journals sub menu',
        isActive: false,
    },
    {
        controlId: 6,
        controlName: 'salesSubMenu',
        descr: 'Sales sub menu',
        isActive: false,
    },
    {
        controlId: 7,
        controlName: 'purchasesSubMenu',
        descr: 'Purchases sub menu',
        isActive: false,
    },
    {
        controlId: 8,
        controlName: 'mastersMenu',
        descr: 'Masters main menu',
        isActive: false,
    },
    {
        controlId: 9,
        controlName: 'unitInfoSubMenu',
        descr: 'Unit info sub menu',
        isActive: false,
    },
    {
        controlId: 10,
        controlName: 'generalSettingsSubMenu',
        descr: 'General settings sub menu',
        isActive: false,
    },
    {
        controlId: 11,
        controlName: 'accountsSubMenu',
        descr: 'Accounts sub menu',
        isActive: false,
    },
    {
        controlId: 12,
        controlName: 'openingBalancesSubMenu',
        descr: 'Opening balances sub menu',
        isActive: false,
    },
    {
        controlId: 13,
        controlName: 'branchesSubMenu',
        descr: 'Branches sub menu',
        isActive: false,
    },
    {
        controlId: 14,
        controlName: 'financialYearsSubMenu',
        descr: 'Financial years sub menu',
        isActive: false,
    },
    {
        controlId: 15,
        controlName: 'finalAccountsMenu',
        descr: 'Final accounts main menu',
        isActive: false,
    },
    {
        controlId: 16,
        controlName: 'trialBalanceSubMenu',
        descr: 'Trial balance sub menu',
        isActive: false,
    },
    {
        controlId: 17,
        controlName: 'balanceSheetSubMenu',
        descr: 'Balance sheet sub menu',
        isActive: false,
    },
    {
        controlId: 18,
        controlName: 'profitLossSubMenu',
        descr: 'Profit and loss sub menu',
        isActive: false,
    },
    {
        controlId: 19,
        controlName: 'optionsMenu',
        descr: 'Options main menu',
        isActive: false,
    },
    {
        controlId: 20,
        controlName: 'bankReconSubMenu',
        descr: 'Bank reconcillation sub menu',
        isActive: false,
    },
    {
        controlId: 21,
        controlName: 'commonUtilitiesSubMenu',
        descr: 'Common utilities sub menu',
        isActive: false,
    },
    {
        controlId: 22,
        controlName: 'genericExportsSubMenu',
        descr: 'Exports sub menu',
        isActive: false,
    },
    {
        controlId: 23,
        controlName: 'reportsMenu',
        descr: 'Reports main menu',
        isActive: false,
    },
    {
        controlId: 24,
        controlName: 'alltransactionsSubMenu',
        descr: 'All transactions sub menu',
        isActive: false,
    },
]
