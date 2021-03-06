import { useState, useEffect, useRef } from 'react'
import hash from 'object-hash'
import {
    Chip,
    Typography,
    Checkbox,
    IconButton,
    Box,
    Dialog,
    DialogTitle,
    DialogActions,
    DialogContent,
} from '@material-ui/core'
import MaterialTable, { MTableToolbar, MTableFilterRow } from 'material-table'
import SyncIcon from '@material-ui/icons/SyncSharp'
import AddIcon from '@material-ui/icons/Add'
import CloseIcon from '@material-ui/icons/Close'
import _ from 'lodash'
import { useTraceMaterialComponents } from '../../../common/trace-material-components'
import { DataTable } from 'primereact/datatable'
// import 'react-widgets/dist/css/react-widgets.css'
import { manageEntitiesState } from '../../../common-utils/esm'
import { manageFormsState } from '../../../react-form/core/fsm'
import ReactForm from '../../../react-form/react-form'
import { useTraceGlobal } from '../../../common-utils/trace-global'
import { useSharedElements } from './shared-elements-hook'
import { useManageUsers } from './manage-users'
import { useAssociateAdminUserWithClientAndEntity } from './associate-admin-user-with-client-and-entity'
import { useManageClientsEntities } from './manage-clients-entities'
import { useManageBu } from './manage-bu'
import { useManageRoles } from './manage-roles'
import { useAssociateBusinessUsersWithRolesAndBu } from './associate-business-users-with-bu-and-roles'

function GenericCRUD({ loadComponent }: any) {
    const meta: any = useRef({
        isMounted: true,
        origDataHash: {},
        data: [],
        title: '', // this is main table title
        showDialog: false,
        minWidth: '600px',
        dialogConfig: {
            title: '', // this title of dialog for update and create
            formId: '',
            isEditMode: false,
            node: {},
            jsonObject: {},
            jsonObjectOrig: {},
            textVariant: 'subtitle1',
            dialogWidth: '',
            id: '',
            permissionConfig: {
                data: [],
                isPermission: false,
                id: '',
                base: [],
                operator: [],
                accountant: [],
                manager: [],
            },
        },
        headerConfig: {
            textVariant: 'subtitle1',
        },
    })

    const [, setRefresh] = useState({})
    const { getCurrentEntity } = manageEntitiesState()
    const { getFormData, resetAllValidators } = manageFormsState()
    const { TraceFullWidthSubmitButton } = useTraceMaterialComponents()
    const headerConfig = meta.current.headerConfig
    const dialogConfig = meta.current.dialogConfig
    const { isMediumSizeUp } = useTraceGlobal()

    const { useStyles, closeDialog, theme } = useSharedElements(meta)
    const classes = useStyles({ meta: meta })
    const { manageUsers } = useManageUsers(meta)
    const {
        associateAdminUserWithClientAndEntity,
    } = useAssociateAdminUserWithClientAndEntity(meta)
    const { manageClients, manageEntities } = useManageClientsEntities(meta)
    const { manageBu } = useManageBu(meta)
    const { manageRoles } = useManageRoles(meta)
    const {
        associateBusinessUsersWithRolesAndBu,
    } = useAssociateBusinessUsersWithRolesAndBu(meta)

    if (isMediumSizeUp) {
        dialogConfig.dialogWidth = '350px'
        meta.current.dialogConfig.permissionConfig.isPermission &&
            (dialogConfig.dialogWidth = '80%')
    } else {
        dialogConfig.dialogWidth = '290px'
    }

    useEffect(() => {
        meta.current.isMounted = true
        selectLogic()[loadComponent].read()
        return () => {
            meta.current.isMounted = false
        }
    }, [])

    function selectLogic() {
        const logic: any = {
            manageUsers: manageUsers,
            manageBu: manageBu,
            manageClients: manageClients,
            manageEntities: manageEntities,
            associateAdminUserWithClientAndEntity: associateAdminUserWithClientAndEntity,
            manageRoles: manageRoles,
            associateBusinessUsersWithRolesAndBu: associateBusinessUsersWithRolesAndBu,
        }
        return logic
    }

    return (
        <div className={classes.content}>
            <Box className={classes.header}>
                <Typography
                    color="primary"
                    variant={meta.current.headerConfig.textVariant || 'h6'}
                    component="span">
                    {headerConfig.title}
                </Typography>
                <Box component="span" className={classes.RefreshAdd}>
                    <IconButton
                        className={classes.syncIconButton}
                        size="medium"
                        color="secondary"
                        onClick={() => selectLogic()[loadComponent].read()}>
                        <SyncIcon></SyncIcon>
                    </IconButton>
                    <IconButton
                        className={classes.syncIconButton}
                        size="medium"
                        color="secondary"
                        onClick={() =>
                            selectLogic()[
                                meta.current.dialogConfig.formId
                            ].create()
                        }>
                        <AddIcon></AddIcon>
                    </IconButton>
                </Box>
            </Box>
            <DataTable
                className={classes.bodyBreak}
                style={{ minWidth: meta.current.minWidth }}
                value={meta.current.data}>
                {selectLogic()[
                    meta.current.dialogConfig.formId
                ]?.dataTableColumns()}
            </DataTable>

            <Dialog //material-ui dialog
                classes={{ paper: classes.dialogPaper }} // Adjust dialog width as per device
                open={meta.current.showDialog}
                onClose={closeDialog}>
                <DialogTitle
                    disableTypography
                    id="generic-dialog-title"
                    className={classes.dialogTitle}>
                    <h3>{meta.current.dialogConfig.title}</h3>
                    <IconButton
                        size="small"
                        color="default"
                        onClick={closeDialog}
                        aria-label="close">
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent className={classes.dialogContent}>
                    <DlgContent></DlgContent>
                </DialogContent>
                <DialogActions>
                    <TraceFullWidthSubmitButton
                        style={{ marginRight: theme.spacing(4) }}
                        onClick={() =>
                            selectLogic()[
                                meta.current.dialogConfig.formId
                            ].submit()
                        }></TraceFullWidthSubmitButton>
                </DialogActions>
            </Dialog>
        </div>
    )

    function PermissionControl() {
        const [, setRefresh] = useState({})
        return (
            <MaterialTable
                style={{ marginBottom: '2rem' }}
                columns={[
                    {
                        title: 'Id',
                        field: 'controlId',
                        headerStyle: { fontWeight: 'bold' },
                    },
                    {
                        title: 'Control name',
                        field: 'controlName',
                        headerStyle: { fontWeight: 'bold' },
                    },
                    {
                        title: 'Active',
                        field: 'isActive',
                        headerStyle: { fontWeight: 'bold' },
                        render: (rowData: any) => {
                            return (
                                <Checkbox
                                    checked={
                                        meta.current.dialogConfig.permissionConfig.data.find(
                                            (item: any) =>
                                                item.controlId ===
                                                rowData.controlId
                                        ).isActive
                                    }
                                    onClick={() => {
                                        const item = meta.current.dialogConfig.permissionConfig.data.find(
                                            (item: any) =>
                                                item.controlId ===
                                                rowData.controlId
                                        )
                                        item.isActive = !item.isActive
                                        setRefresh({}) // local setRefresh
                                    }}></Checkbox>
                            )
                        },
                    },
                    {
                        title: 'Descr',
                        field: 'descr',
                        headerStyle: { fontWeight: 'bold' },
                    },
                ]}
                data={meta.current.dialogConfig.permissionConfig.data}
                options={{
                    paging: false,
                    showTitle: false,
                }}
                components={{
                    Toolbar: (props) => (
                        <div className={classes.permissionTemplate}>
                            <div className="template">
                                <Typography className="title">
                                    Start with a new template
                                </Typography>
                                <Chip
                                    onClick={() => {
                                        handleChipClick('base')
                                    }}
                                    clickable={true}
                                    className="chip"
                                    label="Base"
                                    color="secondary"
                                />
                                <Chip
                                    onClick={() => {
                                        handleChipClick('operator')
                                    }}
                                    clickable={true}
                                    className="chip"
                                    label="Operator"
                                    color="secondary"
                                    style={{ marginRight: 5 }}
                                />
                                <Chip
                                    onClick={() => {
                                        handleChipClick('accountant')
                                    }}
                                    clickable={true}
                                    className="chip"
                                    label="Accountant"
                                    color="secondary"
                                    style={{ marginRight: 5 }}
                                />
                                <Chip
                                    onClick={() => {
                                        handleChipClick('manager')
                                    }}
                                    clickable={true}
                                    className="chip"
                                    label="Manager"
                                    color="secondary"
                                    style={{ marginRight: 5 }}
                                />
                            </div>
                            <MTableToolbar {...props}></MTableToolbar>
                        </div>
                    ),
                }}></MaterialTable>
        )
    }

    function handleChipClick(templateName: string) {
        const pre = meta.current.dialogConfig.permissionConfig
        pre.data = pre[templateName]
        meta.current.isMounted && setRefresh({})
    }

    function DlgContent() {
        let ret
        resetAllValidators(meta.current.dialogConfig.formId)
        useEffect(() => {
            const dataObject = getFormData(meta.current.dialogConfig.formId)
            meta.current.origDataHash = hash(dataObject)
        })

        if (meta.current.dialogConfig.permissionConfig.isPermission) {
            ret = <PermissionControl></PermissionControl>
        } else {
            ret = (
                <ReactForm
                    className="common-text-select"
                    formId={meta.current.dialogConfig.formId}
                    jsonText={JSON.stringify(
                        meta.current.dialogConfig.jsonObject
                    )}
                    name={getCurrentEntity()}></ReactForm>
            )
        }
        return ret
    }
}

export { GenericCRUD }
