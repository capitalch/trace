import { useState } from '../../../imports/regular-imports'
import { useSharedElements } from './shared-elements-hook'

function useAssociateBusinessUsersWithRolesAndBu(meta: any) {
    const [, setRefresh] = useState({})
    const {
        CloseSharp,
        Column,
        Edit,
        emit,
        execGenericView,
        getLoginData,
        IconButton,
        resetForm,
        deleteRow,
        submitDialog,
        useStyles,
    } = useSharedElements(meta)
    const classes = useStyles({ meta: meta })
    const dialogConfig = meta.current.dialogConfig
    const associateBusinessUsersWithRolesAndBu = {
        dataTableColumns: associateBusinessUsersWithRolesAndBuColumns,
        read: async () => {
            meta.current.minWidth = '600px'
            dialogConfig.formId = 'associateBusinessUsersWithRolesAndBu'
            meta.current.headerConfig.title = "Associate business users"
            dialogConfig.jsonObjectOrig = clientEntityRoleBuUserXJson
            dialogConfig.tableName = 'ClientEntityRoleBuUserX'
            dialogConfig.isEditMode = false
            emit('SHOW-LOADING-INDICATOR', true)
            const ret = await execGenericView({
                sqlKey: 'getJson_clientEntityRoleBuUserX_businessUsers_clientEntityRole_clientEntityBu'
                , isMultipleRows: false
                , args: {
                    userId: getLoginData().id
                }
            })

            const res = ret?.jsonResult
            const businessUsers =res?.businessUsers || []
            const clientEntityBuList = res?.clientEntityBu || []
            const clientEntityRoles = res?.clientEntityRoles || []

            meta.current.businessUsers = businessUsers.map((x: any) => {
                return {
                    label: x.uid.concat(', ', x.userEmail, ', ', x.userName)
                    , value: x.id
                }
            })
            meta.current.businessUsers.unshift({ label: '--- select ---', value: '' })

            meta.current.clientEntityBuList = clientEntityBuList.map((x: any) => {
                return {
                    label: x.buCode.concat(', ', x.buName),
                    value: x.id
                }
            })
            meta.current.clientEntityBuList.unshift({ label: '--- select ---', value: '' })

            meta.current.clientEntityRoles = clientEntityRoles.map((x: any) => {
                return {
                    label: x.role.concat(', ', x.roleDescr),
                    value: x.id
                }
            })
            meta.current.clientEntityRoles.unshift({ label: '--- select ---', value: '' })

            dialogConfig.jsonObjectOrig.items[0].options = meta.current.businessUsers
            dialogConfig.jsonObjectOrig.items[1].options = meta.current.clientEntityBuList
            dialogConfig.jsonObjectOrig.items[2].options = meta.current.clientEntityRoles
            meta.current.data = res?.clientEntityRoleBuUserXs || [] 
            emit('SHOW-LOADING-INDICATOR', false)
            meta.current.isMounted && setRefresh({})
        },

        create: () => {
            dialogConfig.title = 'Associate business user with bu and role'
            dialogConfig.isEditMode = false
            dialogConfig.jsonObject =  JSON.parse(JSON.stringify(dialogConfig.jsonObjectOrig))            
            resetForm(dialogConfig.formId)
            meta.current.showDialog = true
            meta.current.isMounted && setRefresh({})
        },

        update: (node: any) => {
            resetForm(dialogConfig.formId)
            const jsonObject = JSON.parse(JSON.stringify(dialogConfig.jsonObjectOrig))
            dialogConfig.title = 'Edit association'
            dialogConfig.node = node
            dialogConfig.isEditMode = true

            jsonObject.items[0].value = node.businessUserId // user
            jsonObject.items[1].value = node.clientEntityBuId // Bu
            jsonObject.items[2].value = node.clientEntityRoleId // Role

            dialogConfig.jsonObject = jsonObject
            meta.current.showDialog = true
            meta.current.isMounted && setRefresh({})
        },

        submit: () => {
            submitDialog({
                tableName: dialogConfig.tableName,
                graphQlKey: 'genericUpdateMaster',
                afterMethod: associateBusinessUsersWithRolesAndBu.read
            })
        }
    }

    function associateBusinessUsersWithRolesAndBuColumns() {
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
                header={<div className={classes.columnHeaderLeft}>Bu code</div>}
                field="buCode" />,
            <Column
                key={incr()}
                header={<div className={classes.columnHeaderLeft}>Bu name</div>}
                field="buName"
                style={{ minWidth: '8rem' }}
                className={classes.bodyBreak}>
            </Column>,
            <Column
                key={incr()}
                style={{ minWidth: '6rem' }}
                className={classes.bodyBreak}
                header={<div className={classes.columnHeaderLeft}>Role</div>}
                field="role" />,
            <Column
                key={incr()}
                header={<div className={classes.columnHeaderLeft}>Role descr</div>}
                field="roleDescr"
                style={{ minWidth: '8rem' }}
                className={classes.bodyBreak}>
            </Column>,
            <Column
                key={incr()}
                style={{ minWidth: '5rem' }}
                className={classes.bodyBreak}
                header={<div className={classes.columnHeaderLeft}>Uid</div>}
                field="uid" />,
            <Column
                key={incr()}
                header={<div className={classes.columnHeaderLeft}>User name</div>}
                field="userName"
                style={{ minWidth: '8rem' }}
                className={classes.bodyBreak}>
            </Column>,
            <Column
                key={incr()}
                header={<div className={classes.columnHeaderLeft}>User email</div>}
                field="userEmail"
                style={{ minWidth: '8rem' }}
                className={classes.bodyBreak}>
            </Column>,
            <Column
                key={incr()}
                header={<div>Edit</div>}
                body={(node: any) =>
                    <IconButton
                        size='medium'
                        color='secondary'
                        onClick={() => associateBusinessUsersWithRolesAndBu.update(node)}>
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
                        onClick={(e:any) => deleteRow(node, associateBusinessUsersWithRolesAndBu.read)}>
                        <CloseSharp></CloseSharp>
                    </IconButton>
                }
            ></Column>
        ]
    }

    return { associateBusinessUsersWithRolesAndBu }
}

export { useAssociateBusinessUsersWithRolesAndBu }

const clientEntityRoleBuUserXJson: any = {
    "class": "generic-dialog",
    "validations":[
        {
            "name": "userBuRoleAssociationExists",
            "message":"Association of this user account, business unit and role already exists"
        }
    ],
    "items": [
        {
            "type": "Select",
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
            "type": "Select",
            "name": "clientEntityBuId",
            "placeholder": "Bu",
            "label": "Select Bu",
            "options": [],
            "validations": [
                {
                    "name": "required",
                    "message": "Please select a business unit"
                }
            ]
        },
        {
            "type": "Select",
            "name": "clientEntityRoleId",
            "placeholder": "Roles",
            "label": "Select role",
            "options": [],
            "validations": [
                {
                    "name": "required",
                    "message": "Please select a role"
                }
            ]
        }
    ]
}
