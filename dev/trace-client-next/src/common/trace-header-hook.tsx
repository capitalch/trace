import { useRef, useState } from '../imports/regular-imports'
import {
    Button,
    IconButton,
    Avatar,
    Box,
    DialogTitle,
    DialogActions,
    DialogContent,
    createStyles,
    makeStyles,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Theme,
} from '../imports/gui-imports'
import {
    VerifiedUserSharp,
    SecuritySharp,
    CloseSharp,
    ExitToAppSharp,
    AccountCircleSharp,
    SupervisorAccount,
} from '../imports/icons-import'
import {
    componentStore,
    globalMessages,
    manageEntitiesState,
    manageFormsState,
    graphqlService,
    queries,
    ReactForm,
    useIbuki,
    useTraceMaterialComponents,
    utilMethods
} from '../imports/trace-imports'
import '../entities/authentication/initialize-react-form'
import messages from '../entities/authentication/messages.json'

function useTraceHeader() {
    const [, setRefresh] = useState({})
    const meta: any = useRef({
        isMounted: true,
        menuHead: [],
        loginMenu: 'none',
        uid: undefined,
        showDialog: false,
        entityName: 'authentication',
        dialogConfig: {
            title: '',
            displayArray: [],
            formId: '',
            formJson: {},
            graphqlKey: '',
            customCodeBlock: undefined, //used for changeUid and changePwd
            loginScreenSize: '320px',
            dialogTitle: <></>,
            dialogContent: <></>,
            dialogActions: <></>,
        },
    })
    const { emit } = useIbuki()
    const { getSqlObjectString } = utilMethods()
    const {
        setLoginData,
        getLoginData,
        setCurrentEntity,
        resetBag,
        getCurrentComponent,
        setCurrentComponent,
    }: any = manageEntitiesState() //login data is independent of any entity
    const { mutateGraphql, queryGraphql } = graphqlService()
    const {
        resetForm,
        clearServerError,
        getValidationFabric,
        getFormData,
        showServerError,
        releaseForm,
    } = manageFormsState()
    const { doValidateForm, isValidForm } = getValidationFabric()
    const { TraceFullWidthSubmitButton }: any = useTraceMaterialComponents()
    const classes = useStyles()
    const snackbar:any = useRef({
        severity: 'success',
        open: false,
        message: globalMessages['operationSuccessful'],
        duration: 5000,
    })

    // for closing snackbar
    function handleClose() {
        snackbar.current.open = false
        setRefresh({})
    }

    function isUserLoggedIn() {
        let ret = false
        if (getLoginData().token) ret = true
        return ret
    }

    // When already logged in, based of admin, super admin and ordinary user show different list items in dialog
    function setDisplayArray() {
        let displayArray: string[] = []
        if (getLoginData().userType === 's') {
            // super admin
            displayArray = ['superAdmin', 'logout']
        } else if (getLoginData().userType === 'a') {
            // admin
            displayArray = ['admin', 'changeUid', 'changePwd', 'logout']
        } else {
            // business user
            displayArray = ['changeUid', 'changePwd', 'logout']
        }
        meta.current.dialogConfig.displayArray = displayArray
    }

    function closeDialog() {
        resetForm(meta.current.dialogConfig.formId)
        meta.current.isMounted && (meta.current.showDialog = false)
        meta.current.isMounted && setRefresh({})
    }

    function Comp() {
        resetForm(meta.current.dialogConfig.formId)
        return (
            <ReactForm
                className="common-text-select"
                formId={meta.current.dialogConfig.formId}
                jsonText={JSON.stringify(meta.current.dialogConfig.formJson)}
                name={meta.current.entityName}
                componentStore={componentStore}></ReactForm>
        )
    }

    function getDialogActions() {
        return (
            <DialogActions>
                <TraceFullWidthSubmitButton
                    onClick={() => {
                        submitDialog()
                    }}></TraceFullWidthSubmitButton>
            </DialogActions>
        )
    }

    function getDialogTitle() {
        return (
            <DialogTitle
                id="simple-dialog-title"
                className={classes.dialogTitle}>
                <div>{meta.current.dialogConfig.title}</div>
                <IconButton
                    size="small"
                    color="default"
                    onClick={closeDialog}
                    aria-label="close">
                    <CloseSharp />
                </IconButton>
            </DialogTitle>
        )
    }

    function getDialogContent() {
        return (
            <DialogContent>
                <Comp></Comp>
            </DialogContent>
        )
    }

    function getDisplayList() {
        const listItemObject: any = {
            superAdmin: (
                <ListItem
                    button
                    key={0}
                    onClick={(e:any) => {
                        meta.current.showDialog = false
                        emit('TOP-MENU-ITEM-CLICKED', superAdminMenuJson)
                        emit('LOAD-MAIN-COMPONENT', '')
                        meta.current.isMounted && setRefresh({})
                    }}>
                    <ListItemAvatar>
                        <Avatar>
                            <SupervisorAccount color="primary" />
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary="Super admin menu"></ListItemText>
                </ListItem>
            ),
            admin: (
                <ListItem
                    button
                    key={1}
                    onClick={(e:any) => {
                        meta.current.showDialog = false
                        emit('TOP-MENU-ITEM-CLICKED', adminMenuJson)
                        emit('LOAD-MAIN-COMPONENT', '')
                        meta.current.isMounted && setRefresh({})
                    }}>
                    <ListItemAvatar>
                        <Avatar>
                            <AccountCircleSharp color="action" />
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary="Admin menu"></ListItemText>
                </ListItem>
            ),
            changeUid: (
                <ListItem
                    button
                    key={2}
                    onClick={(e:any) => {
                        meta.current.dialogConfig.title = 'Uid change'
                        meta.current.dialogConfig.formId = 'changeUid'
                        changeUidJson.items[0].value = meta.current.uid
                        meta.current.dialogConfig.formJson = changeUidJson
                        meta.current.dialogConfig.dialogTitle = getDialogTitle()
                        meta.current.dialogConfig.dialogContent =
                            getDialogContent()
                        meta.current.dialogConfig.dialogActions =
                            getDialogActions()
                        meta.current.showDialog = true
                        meta.current.isMounted && setRefresh({})
                    }}>
                    <ListItemAvatar>
                        <Avatar>
                            <SecuritySharp color="secondary" />
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary="Change uid"></ListItemText>
                </ListItem>
            ),
            changePwd: (
                <ListItem
                    button
                    key={3}
                    onClick={(e:any) => {
                        meta.current.dialogConfig.title = 'Change password'
                        meta.current.dialogConfig.formId = 'changePwd'
                        changePwdJson.items[0].value = meta.current.uid
                        meta.current.dialogConfig.formJson = changePwdJson

                        meta.current.dialogConfig.dialogTitle = getDialogTitle()
                        meta.current.dialogConfig.dialogContent =
                            getDialogContent()
                        meta.current.dialogConfig.dialogActions =
                            getDialogActions()
                        meta.current.showDialog = true
                        meta.current.isMounted && setRefresh({})
                    }}>
                    <ListItemAvatar>
                        <Avatar>
                            <VerifiedUserSharp color="primary" />
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary="Change password"></ListItemText>
                </ListItem>
            ),
            logout: (
                <ListItem
                    button
                    key={4}
                    onClick={(e:any) => {
                        logout()
                        meta.current.showDialog = false
                        meta.current.isMounted && setRefresh({})
                    }}>
                    <ListItemAvatar>
                        <Avatar>
                            <ExitToAppSharp color="secondary" />
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary="Log out"></ListItemText>
                </ListItem>
            ),
        }
        const listItemArray: any[] = meta.current.dialogConfig.displayArray.map(
            (item: string) => listItemObject[item]
        )
        const displayList = <List>{listItemArray}</List>
        return displayList
    }

    function showDialogMenu() {
        setDisplayArray()
        meta.current.dialogConfig.title = 'Select item'
        meta.current.dialogConfig.dialogTitle = getDialogTitle()
        meta.current.dialogConfig.dialogContent = (
            <DialogContent>{getDisplayList()}</DialogContent>
        )
        meta.current.dialogConfig.dialogActions = null
        meta.current.isMounted && setRefresh({})
    }

    function doLogin() {
        meta.current.dialogConfig.title = 'Login'
        meta.current.dialogConfig.dialogTitle = getDialogTitle()
        meta.current.dialogConfig.formId = 'login'
        meta.current.dialogConfig.formJson = loginJson
        meta.current.graphqlKey = 'login' // used at time of querying to server in submitDialog method
        meta.current.dialogConfig.dialogContent = (
            <DialogContent>
                <Comp></Comp>
                <Box component="div" className={classes.forgotPwdBox}>
                    <Button
                        size="small"
                        variant="text"
                        className={classes.forgotPwdButton}
                        onClick={(e:any) => {
                            meta.current.dialogConfig.title = 'Forgot password'
                            meta.current.dialogConfig.formId = 'forgotPwd'
                            meta.current.dialogConfig.formJson = forgotPwdJson
                            meta.current.showDialog = true
                            meta.current.dialogConfig.dialogTitle =
                                getDialogTitle()
                            meta.current.dialogConfig.dialogContent = (
                                <DialogContent>
                                    <Comp></Comp>
                                </DialogContent>
                            )
                            meta.current.dialogConfig.dialogActions =
                                getDialogActions()
                            meta.current.isMounted && setRefresh({})
                        }}>
                        Forgot password
                    </Button>
                </Box>
            </DialogContent>
        )
        meta.current.dialogConfig.dialogActions = getDialogActions()
        meta.current.isMounted && setRefresh({})
    }

    async function submitDialog() {
        const formId = meta.current.dialogConfig.formId

        async function processLogin(data: any) {
            const base64UidPwd = window.btoa(
                data.uidOrEmail.concat(':', data.password)
            )
            const q = queries['doLogin'](base64UidPwd)
            const result: any = await queryGraphql(q)
            const login: any = result.data.authentication.doLogin
            const token: string = login && login.token ? login.token : undefined
            const uid: string = login && login.uid
            setLoginData({
                token: token,
                userType: login?.userType,
                uid: uid,
                id: login?.id,
                entityNames: login?.entityNames,
                permissions: login?.permissions,
                lastUsedbranchId: login?.lastUsedBranchId,
                lastUsedBuCode: login?.lastUsedBuCode,
                buCodes: login?.buCodes,
                clientId: login?.clientId,
            })
            if (token) {
                meta.current.uid = uid
                meta.current.showDialog = false
                resetForm(meta.current.dialogConfig.formId)
                releaseForm(meta.current.dialogConfig.formId)
                meta.current.isMounted && setRefresh({})
            } else {
                showServerError(
                    meta.current.dialogConfig?.formId,
                    messages['invalidUidOrPassword']
                )
            }
        }

        async function processChangeUid(data: any) {
            const sqlObjectString = getSqlObjectString({
                data: data,
                customCodeBlock: 'change_uid', // Sql at server against customCodeBlock is executed as it is. There is no consideration of id for customCodeBlock
            })
            const entityName = 'authentication'
            const q = queries['genericUpdateMaster'](
                sqlObjectString,
                entityName
            )
            if (q) {
                try {
                    const result = await mutateGraphql(q)
                    if (
                        result?.data?.authentication?.genericUpdateMaster ===
                        true
                    ) {
                        logout()
                        closeDialog()
                    }
                } catch (exception: any) {
                    showServerError(
                        meta.current.dialogConfig.formId,
                        exception.message
                    )
                    meta.current.isMounted && setRefresh({})
                }
            }
        }

        async function processChangePwd(data: any) {
            const base64UidPwd = window.btoa(data.uid.concat(':', data.newPwd))
            const q = queries['changePwd'](base64UidPwd)
            if (q) {
                try {
                    const result = await mutateGraphql(q)
                    if (result?.data?.authentication?.changePwd) {
                        logout()
                        closeDialog()
                    } else {
                        showServerError(
                            meta.current.dialogConfig.formId,
                            messages['changePwdFail']
                        )
                        meta.current.isMounted && setRefresh({})
                    }
                } catch (exception: any) {
                    showServerError(
                        meta.current.dialogConfig.formId,
                        exception.message
                    )
                    meta.current.isMounted && setRefresh({})
                }
            }
        }

        async function processForgotPwd(data: any) {
            const q = queries['forgotPwd'](escape(JSON.stringify(data)))
            if (q) {
                try {
                    const res = await queryGraphql(q)
                    if (res?.data?.authentication?.forgotPwd) {
                        logout()
                        closeDialog()
                    } else {
                        showServerError(
                            meta.current.dialogConfig.formId,
                            messages['changePwdFail']
                        )
                        meta.current.isMounted && setRefresh({})
                    }
                } catch (exception: any) {
                    showServerError(
                        meta.current.dialogConfig.formId,
                        exception.message
                    )
                    meta.current.isMounted && setRefresh({})
                }
            }
        }

        clearServerError(formId)
        await doValidateForm(formId)
        if (isValidForm(formId)) {
            const dt = getFormData(formId)
            const data = JSON.parse(JSON.stringify(dt))
            try {
                if (formId === 'login') {
                    await processLogin(data)
                } else if (formId === 'changeUid') {
                    await processChangeUid(data)
                } else if (formId === 'changePwd') {
                    await processChangePwd(data)
                } else if (formId === 'forgotPwd') {
                    await processForgotPwd(data)
                }
            } catch (error: any) {
                emit('SHOW-MESSAGE', {
                    severity: 'error',
                    message: error.message,
                    duration: null,
                })
            }
        } else {
            showServerError(
                meta.current.dialogConfig.formId,
                globalMessages['validationError']
            )
        }
    }

    function logout() {
        const item = { name: 'authentication' }
        setCurrentEntity('authentication')
        resetBag()

        emit('TRACE-MAIN:JUST-REFRESH', 'reset')
        emit('LOAD-LEFT-JUST-REFRESH', '')
        emit('TOP-MENU-ITEM-CLICKED', item)

        setLoginData({})
        meta.current.uid = undefined
        meta.current.dialogConfig.displayArray.length = 0
        setRefresh({})
    }

    function shortCircuit() {
        setLoginData({
            token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1aWQiOiJkIiwidXNlclR5cGUiOiJhIiwiaWQiOjIsImNsaWVudElkIjoyfQ.rZd0cUhxNqIHrl8Pp2pylYm0DLZA5kPRP6xx61xgkNw',
            userType: 'a',
            uid: 'd',
            id: 2,
            entityNames: ['accounts'],
            lastUsedBuCode: 'demoUnit1',
            lastUsedBranchId: 1,
            buCodes: ['demoUnit1'],
            clientId: 2,
        })
        handleEntityClicked(meta.current.menuHead.menu[0])
    }

    function handleEntityClicked(item: any) {
        setCurrentEntity(item.name)
        resetBag()
        emit('TOP-MENU-ITEM-CLICKED', item)
        // This line was added to remove genericDialog custom component. It is not desirable to show the dialog when button is clicked
        if (getCurrentComponent()?.isCustomComponent) {
            setCurrentComponent({})
        }
    }

    return {
        closeDialog,
        doLogin,
        handleClose,
        handleEntityClicked,
        isUserLoggedIn,
        logout,
        meta,
        setRefresh,
        shortCircuit,
        showDialogMenu,
        snackbar,
        submitDialog,
    }
}

export { useTraceHeader }

const useStyles: any = makeStyles((theme:Theme) =>
    createStyles({
        dialogContent: {
            paddingTop: '0px',
        },
        dialogTitle: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingBottom: '0px',
        },
        forgotPwdBox: {
            display: 'flex',
            justifyContent: 'flex-end',
            marginTop: -theme.spacing(3),
        },
        forgotPwdButton: {
            textTransform: 'capitalize', // to undo default Full capitalization and capitalize only first letter
        },
    })
)

const loginJson: any = {
    name: 'login',
    class: 'generic-dialog',
    items: [
        {
            type: 'Text',
            name: 'uidOrEmail',
            label: 'User id or email',
            validations: [
                {
                    name: 'required',
                    message: 'User id or email is required',
                },
                {
                    name: 'emailOrNoWhiteSpaceOrSpecialChar',
                    message:
                        'Value should be either a valid email or a user id with no special characters or whitespace',
                },
            ],
        },
        {
            type: 'Password',
            name: 'password',
            label: 'Password',
            validations: [
                {
                    name: 'required',
                    message: 'Password is required',
                },
            ],
        },
    ],
}

const superAdminMenuJson: any = {
    name: 'authentication',
    label: 'SuperAdmin',
    children: [
        {
            name: 'artifacts',
            label: 'Artifacts',
            children: [
                {
                    name: 'manageUsers',
                    label: 'Manage admin users',
                    componentName: 'manageUsers',
                    // args: {
                    //     loadComponent: 'manageUsers',
                    // },
                },
                {
                    name: 'manageClients',
                    label: 'Manage clients',
                    componentName: 'superAdminManageClients',
                    // args: {
                    //     loadComponent: 'manageClients',
                    // },
                },
                {
                    name: 'manageEntities',
                    label: 'Manage entities',
                    componentName: 'superAdminManageEntities',
                    // args: {
                    //     loadComponent: 'manageEntities',
                    // },
                },
                {
                    name: 'associateAdminUsersWithClientsAndEntities',
                    label: 'Associate admin users with clients and entities',
                    componentName: 'associateAdminUsersWithClientsAndEntities',
                    // args: {
                    //     loadComponent: 'associateAdminUserWithClientAndEntity',
                    // },
                },
            ],
        },
    ],
}

const adminMenuJson: any = {
    name: 'authentication',
    label: 'Admin',
    children: [
        {
            name: 'artifacts',
            label: 'Artifacts',
            children: [
                {
                    name: 'manageUsers',
                    label: 'Manage business users',
                    componentName: 'manageUsers',
                    // componentName: 'genericCRUD',
                    // args: {
                    //     loadComponent: 'manageUsers',
                    // },
                },
                {
                    name: 'manageRoles',
                    label: 'Manage roles',
                    componentName: 'adminManageRoles'
                    // componentName: 'genericCRUD',
                    // args: {
                    //     loadComponent: 'manageRoles',
                    // },
                },
                {
                    name: 'manageBu',
                    label: 'Manage business units (Bu)',
                    componentName: 'adminManageBu',
                    // componentName: 'genericCRUD',
                    // args: {
                    //     loadComponent: 'manageBu',
                    // },
                },
                {
                    name: 'adminAssociateUsersRolesBu',
                    label: 'Associate users with roles and Bu',
                    componentName: 'adminAssociateUsersRolesBu',
                    // args: {
                    //     loadComponent: 'associateBusinessUsersWithRolesAndBu',
                    // },
                },
            ],
        },
    ],
}

const changeUidJson: any = {
    class: 'generic-dialog',
    items: [
        {
            type: 'Text',
            name: 'oldUid',
            value: '',
            htmlProps: {
                disabled: true,
            },
            label: 'Old user id',
            validations: [],
        },
        {
            type: 'Text',
            name: 'newUid',
            label: 'New user id',
            validations: [
                {
                    name: 'required',
                    message: 'New user id is required',
                },
                {
                    name: 'noWhiteSpaceOrSpecialChar',
                    message:
                        'Special characters and white spaces are not allowed in uid',
                },
            ],
        },
    ],
}

const forgotPwdJson: any = {
    class: 'generic-dialog',
    items: [
        {
            type: 'Text',
            name: 'userEmail',
            label: "User's email address where verification link can be sent",
            validations: [
                {
                    name: 'required',
                    message: 'Email is required',
                },
                {
                    name: 'email',
                    message: 'Valid email address is required',
                },
            ],
        },
    ],
}

const changePwdJson: any = {
    class: 'generic-dialog',
    validations: [
        {
            name: 'passwordsShouldBeSame',
            message: 'The two passwords given by you must be same',
        },
    ],
    items: [
        {
            type: 'Text',
            name: 'uid',
            value: '',
            htmlProps: {
                disabled: true,
            },
            label: 'User id',
            validations: [],
        },
        {
            type: 'Password',
            name: 'newPwd',
            label: 'New password',
            validations: [
                {
                    name: 'required',
                    message: 'New password is required',
                },
            ],
        },
        {
            type: 'Password',
            name: 'repeatNewPwd',
            label: 'Repeat new password',
            validations: [
                {
                    name: 'required',
                    message: 'New password is required',
                },
            ],
        },
    ],
}
