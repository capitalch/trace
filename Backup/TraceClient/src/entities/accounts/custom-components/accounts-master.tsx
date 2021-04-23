import React, { useState, useEffect, useRef } from 'react'
import {
    Toolbar, Typography, Backdrop
    , Button
    , Hidden
    , IconButton, Chip,
    Avatar, Box, Container, Paper
    , Dialog
    , DialogTitle
    , DialogActions, DialogContent, Theme, useTheme,
    createStyles, makeStyles
    , List, ListItem, ListItemAvatar, ListItemText, Grid
    , TextField, InputAdornment
} from '@material-ui/core'
import SyncIcon from '@material-ui/icons/SyncSharp'
import CircularProgress from '@material-ui/core/CircularProgress'
import RefreshIcon from '@material-ui/icons/Refresh'
import SearchIcon from '@material-ui/icons/Search'
import CloseIcon from '@material-ui/icons/Close'
import AddIcon from '@material-ui/icons/Add'
import EditIcon from '@material-ui/icons/Edit'
import DeleteIcon from '@material-ui/icons/Delete'
import { useTraceMaterialComponents } from '../../../common/trace-material-components'
import { useTraceGlobal } from '../../../common-utils/trace-global'
import styled from 'styled-components'
import { TreeTable } from 'primereact/treetable'
// import { Dialog } from 'primereact/dialog'
import { Column } from "primereact/column"
// import { Button } from 'primereact/button'
import { InputSwitch } from 'primereact/inputswitch'
import { InputText } from 'primereact/inputtext';
import { useIbuki } from '../../../common-utils/ibuki'
import { manageFormsState } from '../../../react-form/core/fsm'
import { graphqlService } from '../../../common-utils/graphql-service'
import queries from '../artifacts/graphql-queries-mutations'
import { manageEntitiesState } from '../../../common-utils/esm'
import ReactForm from '../../../react-form/react-form'
import { componentStore } from '../../../react-form/component-store/html-core'
import { utilMethods } from '../../../common-utils/util-methods'
// import messages from '../accounts-messages.json'
import messages from '../../../messages.json'
import customMethods from '../artifacts/custom-methods'
import { getArtifacts } from '../../../react-form/common/react-form-hook'

function AccountsMaster() {
    const [, setRefresh] = useState({})
    const formIdRef: any = useRef('accounts-master') // I am fixing formId for this form
    const { queryGraphql, mutateGraphql } = graphqlService()
    // const [dialog, showDialog] = useState(false)
    const { getCurrentEntity, getFromBag, setInBag } = manageEntitiesState()
    const { resetForm, resetFormErrors, getFormData, clearServerError, getFormObject,
        doFormRefresh, getValidationFabric, init } = manageFormsState()
    const { doValidateForm, isValidForm } = getValidationFabric()
    const { saveForm, genericUpdateMaster } = utilMethods()
    const [data, setData]: any[] = useState([])
    const { hotFilterOn, emit } = useIbuki()
    const accClassRef = useRef(JSON.parse(JSON.stringify(accClassAddition)))

    const meta: any = useRef({
        isMounted: false
        , isLoading: false
        , accClassMRef: []
        , groupsLedgersRef: []
        , showDialog: false
        , dialogConfig: {
            title: '',
            dialogActions: <></>,
            dialogContent: <></>,
            entryType: '',
            dialogWidth: ''
        }
        , isExpandAll: false
        , allKeys: []
        , globalFilter: ''
        , windowWidth: ''
        , headerConfig: {
            title: 'Accounts master',
            textVariant: 'subtitle1',
        }
        , tableConfig: {
            expanderColumn: '',
            buttonsColumn: ''
        }
    })

    function getFormId() {
        return formIdRef.current
    }

    useEffect(() => {
        meta.current.isMounted = true
        getData()
        const subs = hotFilterOn('DATACACHE-SUCCESSFULLY-LOADED').subscribe(d => {
            meta.current.accClassMRef = d.data.allClasses.map((x: any) => { return { value: x.id, label: x.accClass } })
        })
        return (() => {
            utilFunc().saveScrollPos()
            meta.current.isMounted = false
            subs.unsubscribe()
        })
    }, [])

    const { traceGlobalSearch, TraceFullWidthSubmitButton } = useTraceMaterialComponents()
    const tableConfig = meta.current.tableConfig
    const headerConfig = meta.current.headerConfig
    const dialogConfig = meta.current.dialogConfig
    const classes = useStyles({ meta: meta })
    const theme = useTheme()
    const { getCurrentMediaSize, isMediumSizeUp } = useTraceGlobal()

    if (isMediumSizeUp) {
        dialogConfig.dialogWidth = '360px'
    }
    else {
        dialogConfig.dialogWidth = '290px'
    }

    utilFunc().applyScrollPos()

    const mediaLogic: any = {
        xs: () => {
            meta.current.windowWidth = 'calc(100vw - 20px)'
            tableConfig.expanderColumn = '15rem'
            tableConfig.buttonsColumn = '12rem'
        },
        sm: () => {
            meta.current.windowWidth = 'calc(100vw - 20px)'
            tableConfig.expanderColumn = '22rem'
            tableConfig.buttonsColumn = '12rem'
        },
        md: () => {
            meta.current.windowWidth = 'calc(100vw - ( 260px + 65px ))' // 65px is used otherwise a horizontal scrollbar appears
            tableConfig.expanderColumn = '25rem'
            tableConfig.buttonsColumn = '20rem'
        },
        lg: () => {
            meta.current.windowWidth = 'calc(100vw - ( 260px + 65px ))' // 65px is used otherwise a horizontal scrollbar appears
            tableConfig.expanderColumn = '35rem'
            tableConfig.buttonsColumn = '20rem'
        },
        xl: () => mediaLogic['lg']()
    }

    const currentMediaSize = getCurrentMediaSize()
    currentMediaSize && mediaLogic[currentMediaSize]()

    return <div className={classes.content}>
        <Box className={classes.header}>
            {/* <Box className={classes.header} component='div'> */}
            <Typography
                color='primary'
                variant={meta.current.headerConfig.textVariant || 'h6'}
                component='span'
            >{headerConfig.title}</Typography>
            <Box component='span' className={classes.expandRefresh}>
                <Span style={{ marginTop: '-1px' }}>Expand</Span>
                <InputSwitch
                    checked={meta.current.isExpandAll}
                    style={{ float: 'right', marginRight: '0.5rem' }}
                    onChange={e => {
                        meta.current.isExpandAll = e.target.value
                        if (meta.current.isExpandAll) {
                            const expObject = meta.current.allKeys.reduce((prev: any, x: any) => {
                                prev[x] = true
                                return prev
                            }, {})
                            setInBag('accMasterExpandedKeys', expObject)
                        } else {
                            setInBag('accMasterExpandedKeys', {})
                        }
                        meta.current.isMounted && setRefresh({})
                    }}>
                </InputSwitch>
                <IconButton
                    className={classes.syncIconButton}
                    size='medium'
                    color='secondary'
                    onClick={(e: any) => getData()}>
                    <SyncIcon></SyncIcon>
                </IconButton>

            </Box>
            {/* </Box> */}
            {traceGlobalSearch({ meta: meta, isMediumSizeUp: isMediumSizeUp })}
        </Box>
        <TreeTable
            value={data}
            expandedKeys={getFromBag('accMasterExpandedKeys') || {}}
            globalFilter={meta.current.globalFilter}
            onToggle={e => {
                setInBag('accMasterExpandedKeys', e.value)
                utilFunc().saveScrollPos()
                meta.current.isMounted && setRefresh({})
            }}>

            <Column
                expander
                style={{ width: tableConfig.expanderColumn }}
                field="accName"
                header={
                    <div>
                        <label style={{ float: 'left', fontSize: '0.9rem' }}>Account name</label>
                    </div>
                }>
            </Column>

            <Column style={{ width: tableConfig.buttonsColumn }}  // Add / delete / edit buttons
                body={(node: any) => {
                    const isDeleteAllowed = (!node.children) && (!node.data.isPrimary) && (!node.data.accTranYear) && (!node.data.accOpBal)
                    const isAddAllowed = ((node.data.accLeaf === 'L') || (node.data.accLeaf === 'N'))
                    const isEditAllowed = (!(node.data.isPrimary))
                    return <div>
                        {isAddAllowed && <Button
                            className={classes.addButton}
                            variant='contained'
                            size='small'
                            startIcon={<AddIcon></AddIcon>}
                            onClick={() => {
                                utilFunc().saveScrollPos()
                                const accName = node.data.accName
                                dialogConfig.entryType = 'newChild'
                                dialogConfig.title = 'New child of '.concat(accName)
                                dialogConfig.parentId = node.data.id
                                dialogConfig.classId = node.data.classId
                                dialogConfig.accType = node.data.accType
                                dialogConfig.accLeaf = node.data.accLeaf
                                meta.current.showDialog = true
                                meta.current.isMounted && setRefresh({})
                            }} >{isMediumSizeUp ? 'Add child' : ''}</Button>}

                        {isEditAllowed && <Button
                            className={classes.editButton}
                            // style={{ fontSize: '0.7rem', textAlign: 'center' }}
                            size='small'
                            color='secondary'
                            variant='contained'
                            startIcon={<EditIcon></EditIcon>}
                            onClick={() => {
                                utilFunc().saveScrollPos()
                                const accName = node.data.accName
                                dialogConfig.entryType = 'editSelf'
                                dialogConfig.title = 'Edit '.concat(accName)
                                dialogConfig.id = node.data.id
                                dialogConfig.parentId = node.data.parentId
                                dialogConfig.accClass = node.data.accClass
                                dialogConfig.classId = node.data.classId
                                dialogConfig.accType = node.data.accType
                                dialogConfig.accLeaf = node.data.accLeaf
                                dialogConfig.accCode = node.data.accCode
                                dialogConfig.accName = node.data.accName
                                meta.current.showDialog = true
                                meta.current.isMounted && setRefresh({})
                            }}
                        >{isMediumSizeUp ? 'Edit self' : ''}</Button>}

                        {isDeleteAllowed && <Button
                            // classes = {{sizeSmall: classes.deleteButton}}
                            size='small'
                            style={{ width: theme.spacing(3) }}
                            className={classes.deleteButton}
                            startIcon={<CloseIcon></CloseIcon>}
                            variant='contained'
                            onClick={async () => {
                                const id = node.data.id
                                const toDelete = window.confirm(messages['deleteConfirm'])
                                if (toDelete) {
                                    const ret = await genericUpdateMaster({
                                        deletedIds: [id]
                                        , tableName: "AccM"
                                    })
                                    if (ret === true) {
                                        emit('SHOW-MESSAGE', {})
                                        emit('LOAD-MAIN-JUST-REFRESH', '')
                                    }
                                }
                            }}
                        ></Button>}
                    </div>
                }}
                header={<Button
                    variant="contained"
                    className={classes.addButton}
                    startIcon={<AddIcon></AddIcon>}
                    onClick={() => {
                        dialogConfig.entryType = 'newGroup'
                        dialogConfig.title = "New group account as root"
                        dialogConfig.parentId = null
                        dialogConfig.classId = null
                        dialogConfig.accType = null
                        dialogConfig.accLeaf = 'N'
                        meta.current.showDialog = true
                        meta.current.isMounted && setRefresh({})
                    }}>Add group</Button>}
            ></Column>

            {
                isMediumSizeUp && <Column
                    field="accCode"
                    style={{ width: '10rem', overflowX: 'hidden' }}
                    header={<div>
                        <label style={{ float: 'left', fontSize: '0.9rem' }}>Short account code</label>
                    </div>}>
                </Column>
            }

            <Column
                field="isPrimary"
                header={<div style={{ textAlign: 'left' }}>Primary</div>}
                body={(e: any) => {
                    // console.log(e)
                    return e.data.isPrimary ? 'Yes' : 'No'
                }}
                style={{ width: '4.5rem' }}
            ></Column>
            <Column
                field="accType"
                header={<div style={{ textAlign: 'left' }}>Type</div>}
                style={{ width: '5rem', color: 'blue', fontWeight: 'bold' }}
                body={(node: any) => {
                    const mType: any = { L: 'Liability', A: 'Asset', E: 'Expence', I: 'Income' }
                    const ret = mType[node.data.accType]
                    return ret
                }}
            ></Column>
            <Column
                field="accClass"
                header={<div style={{ textAlign: 'left' }}>Class</div>}
                style={{ width: '5rem' }}
            ></Column>
            <Column
                field="className"
                header={<div style={{ textAlign: 'left' }}>Level</div>}
                body={(e: any) => {
                    const trace: any = { Y: 'Leaf', N: 'Group', L: 'Ledger', S: 'Subledger' }
                    return trace[e.data.accLeaf]
                }}
                style={{ width: '8rem' }}
            ></Column>
        </TreeTable>

        <Dialog //material-ui dialog
            classes={{ paper: classes.dialogPaper }} // overriding to adjust dialog width as per device viewport
            open={meta.current.showDialog}
            onClose={closeDialog}>
            <DialogTitle disableTypography id="generic-dialog-title"
                className={classes.dialogTitle}>
                <h3>
                    {meta.current.dialogConfig.title}
                </h3>
                <IconButton size='small' color="default"
                    onClick={closeDialog} aria-label="close">
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent className={classes.dialogContent}>
                <Comp></Comp>
                {/* {meta.current.dialogConfig.dialogContent} */}
            </DialogContent>
            <DialogActions className={classes.dialogActions}>
                <TraceFullWidthSubmitButton onClick={submitAccountEntry}></TraceFullWidthSubmitButton>
            </DialogActions>
        </Dialog>

        <Backdrop
            className={classes.backdrop}
            open={meta.current.isLoading}>
            <CircularProgress color="inherit" />
        </Backdrop>
    </div>

    async function getData() {
        meta.current.isLoading = true
        meta.current.isMounted && setRefresh({})
        const q = queries['genericQueryBuilder']({ // in shared artifacts
            queryName: 'accountsMasterGroupsLedgers'
            , queryType: 'query'
        })
        if (q) {
            meta.current.isLoading = true
            const results: any = await queryGraphql(q)
            const pre = results.data.accounts.accountsMasterGroupsLedgers
            meta.current.allKeys = pre.allKeys
            const dt1: any[] = pre.accountsMaster
            const logic: any = { 'N': 'Group', 'L': 'Ledger' }
            const dt2: any[] = pre.groupsLedgers.map((x: any) => {
                return {
                    value: x.id
                    , label: logic[x.accLeaf].concat(': ', x.accClass, ': ', x.accName)
                    , accLeaf: x.accLeaf
                    , accType: x.accType
                    , accClass: x.accClass
                }
            })
            meta.current.groupsLedgersRef = dt2
            meta.current.isLoading = false
            meta.current.isMounted && setData(dt1)
        }
        utilFunc().applyScrollPos()
    }

    async function submitAccountEntry() {
        utilFunc().saveScrollPos()

        const formId = getFormId()
        clearServerError(formId)
        await doValidateForm(formId)
        if (isValidForm(formId)) {
            let data: any = getFormData(formId)
            data.parentId || (data.parentId = meta.current.dialogConfig.parentId)
            data.isPrimary = false
            data.accLeaf || (data.accLeaf = meta.current.dialogConfig.accLeaf)
            data.classId || (data.classId = meta.current.dialogConfig.classId)
            data.accType || (data.accType = meta.current.dialogConfig.accType)
            data.id || (data.id = meta.current.dialogConfig.id)
            if (data.id) { // edit is done, remove unwanted columns
                data.accLeaf = undefined
                data.accType = undefined
                data.isPrimary = undefined
            }
            data = JSON.parse(JSON.stringify(data))
            const finalData: any = {}
            finalData.tableName = 'AccM'
            finalData.updateCodeBlock = 'updateBlock_editAccount'
            finalData.data = { ...data }
            saveForm({
                data: finalData
                , formId: formId
                , queryId: 'genericUpdateMaster'
                , afterMethod: closeDialog
            })
        } else {
            doFormRefresh(getFormId())
        }
    }

    function closeDialog() {
        meta.current.showDialog = false
        meta.current.isMounted && setRefresh({})
        meta.current.isMounted && resetForm(getFormId())
        meta.current.isMounted && resetFormErrors(getFormId())
    }

    function Comp() {
        if (!meta.current.dialogConfig.entryType) {
            return <></>
        }

        function getParentOptions(allOptions: any[], accClass: string, accType: string, accLeaf: string) {
            let options: any[] = []
            const specialClasses: string[] = ['cash', 'bank', 'sale', 'purchase', 'ecash', 'card']
            const assetsLiabs: string[] = ['L', 'A']
            const expIncomes: string[] = ['E', 'I']
            if (specialClasses.includes(accClass)) {
                options = allOptions.filter((x: any) => x.accClass === accClass)
            } else if (assetsLiabs.includes(accType)) {
                options = allOptions.filter((x: any) => {
                    return (assetsLiabs.includes(x.accType))
                        && (!specialClasses.includes(x.accClass)
                            && !((x.accClass === accClass) && (x.accLeaf === accLeaf))
                        )
                })
            } else if (expIncomes.includes(accType)) {
                options = allOptions.filter((x: any) => (
                    expIncomes.includes(x.accType))
                    && (!specialClasses.includes(x.accClass))
                    && (!((x.accClass === accClass) && (x.accLeaf === accLeaf)))
                )
            }
            return (options)
        }

        function onAccTypeChange(value: string) {
            const sw: any = { A: () => assetOptions, L: () => liabOptions, E: () => expOptions, I: () => incomeOptions }
            const assetClassNames = ['branch', 'other', 'loan', 'creditor', 'debtor', 'bank', 'cash', 'card', 'ecash']
            const liabClassNames = ['branch', 'capital', 'other', 'loan', 'creditor', 'debtor', 'bank', 'card', 'ecash']
            const expClassNames = ['other', 'iexp', 'purchase', 'dexp']
            const incomeClassNames = ['other', 'iincome', 'sale', 'dincome']
            const assetOptions = meta.current.accClassMRef.filter((x: any) => assetClassNames.includes(x.label))
            const liabOptions = meta.current.accClassMRef.filter((x: any) => liabClassNames.includes(x.label))
            const expOptions = meta.current.accClassMRef.filter((x: any) => expClassNames.includes(x.label))
            const incomeOptions = meta.current.accClassMRef.filter((x: any) => incomeClassNames.includes(x.label))
            const selectOption = [{ "label": "---select---", "value": "" }]
            const tempArray = selectOption.concat(sw[value] ? sw[value]() : [])
            accClassRef.current.options = [...tempArray]

            meta.current.isMounted && setRefresh({})
        }

        function onParentChange(value: string) { }

        const cusMethods = getArtifacts('accounts').customMethods
        cusMethods['onAccTypeChange'] = onAccTypeChange
        cusMethods['onParentChange'] = onParentChange

        const accClassTemp: any = JSON.parse(JSON.stringify(accClassAddition)) // meta.current.accClassRef
        accClassTemp.options = accClassRef.current.options
        const accTypeTemp: any = JSON.parse(JSON.stringify(accTypeAddition))
        const accLeafTemp: any = JSON.parse(JSON.stringify(accLeafAddition))
        const accParentTemp: any = JSON.parse(JSON.stringify(accParentAddition))
        accParentTemp.options = accParentTemp.options.concat(getParentOptions(meta.current.groupsLedgersRef, meta.current.dialogConfig.accClass, meta.current.dialogConfig.accType, meta.current.dialogConfig.accLeaf))
        const workingJson: any = {
            newGroup: () => {
                const accEntryTemp: any = JSON.parse(JSON.stringify(accountsEntry))
                accEntryTemp.items.push(accTypeTemp)
                accEntryTemp.items.push(accClassTemp)
                return accEntryTemp
            }
            , newChild: () => {
                const accEntryTemp: any = JSON.parse(JSON.stringify(accountsEntry))
                // restrict cash / bank / sale / purchase being Ledger type of account
                const restrictedClasses = ['purchase', 'sale', 'cash', 'bank', 'ecash', 'card']
                if (meta.current.dialogConfig.accLeaf === 'N') {
                    if (restrictedClasses.includes(meta.current.dialogConfig.accClass)) {
                        accLeafTemp.options = accLeafTemp.options.concat(accLeafOptionsGroupWithoutLedger)
                    } else {
                        accLeafTemp.options = accLeafTemp.options.concat(accLeafOptionsGroupWithLedger)
                    }

                } else if (meta.current.dialogConfig.accLeaf === 'L') {
                    meta.current.dialogConfig.accLeaf = 'S'
                    const formObject = getFormObject(getFormId())
                    formObject && formObject.formData && (formObject.formData.accLeaf = 'S')
                    accLeafTemp.options = accLeafTemp.options.concat(accLeafOptionsLedger)
                }
                accEntryTemp.items.push(accLeafTemp)
                return accEntryTemp
            }
            , editSelf: () => {
                const accEntryTemp: any = JSON.parse(JSON.stringify(accountsEntry))
                init(getFormId()) // necessary. Otherwise text boxes are not populated for first time
                const formObject: any = getFormObject(getFormId())
                if (formObject && formObject.formData) {
                    formObject.formData.accCode = meta.current.dialogConfig.accCode
                    formObject.formData.accName = meta.current.dialogConfig.accName
                    formObject.formData.id = meta.current.dialogConfig.id
                    formObject.formData.parentId = meta.current.dialogConfig.parentId
                }
                accEntryTemp.items.push(accParentTemp)
                return accEntryTemp
            }
        }
        const entryType = meta.current.dialogConfig.entryType
        const jsonObject = workingJson[entryType]()
        return <ReactForm
            formId={getFormId()}
            jsonText={JSON.stringify(jsonObject)}
            name={getCurrentEntity()}
            componentStore={componentStore}
        ></ReactForm>
    }

    function utilFunc() {
        function saveScrollPos() {
            const scrollPos = window.pageYOffset
            setInBag('accMasterScrollPos', scrollPos)
        }

        function applyScrollPos() {
            const scrollPos = getFromBag('accMasterScrollPos')
            window.scrollTo(0, scrollPos || 0)
        }
        return { saveScrollPos, applyScrollPos }
    }
}

export { AccountsMaster }

const useStyles: any = makeStyles((theme: Theme) =>
    createStyles({
        backdrop: {
            zIndex: theme.zIndex.drawer + 1,
            color: theme.palette.primary.dark,
        },

        content: {
            marginBottom: theme.spacing(1),
            width: (props: any) => props.meta.current.windowWidth,            
            overflowX: 'auto',
        },

        header: {
            display: 'flex',
            flexWrap: 'wrap',            
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: theme.spacing(1),
        },

        expandRefresh: {
            display: 'flex',
            alignItems: 'center',
            float: 'right',
        },

        typography: {
            verticalAlign: 'middle',
        },

        addButton: {
            float: 'left',
            backgroundColor: theme.palette.lightBlue.main,
            color: theme.palette.common.white,
            '&:hover': {
                backgroundColor: theme.palette.lightBlue.dark,
                color: theme.palette.grey[200],
            }
        },

        editButton: {
            float: 'left',
            marginLeft: theme.spacing(1),
        },

        deleteButton: {
            float: 'left',
            marginLeft: theme.spacing(1),
            backgroundColor: theme.palette.error.light,
            color: theme.palette.common.white,
            '&:hover': {
                backgroundColor: theme.palette.error.dark,
                color: theme.palette.grey[200],
            }
        },

        syncIconButton: {
            paddingRight: theme.spacing(2)
        },

        dialogPaper: {
            width: (props: any) => props.meta.current.dialogConfig.dialogWidth
        },

        dialogTitle: {
            display: 'flex'
            , justifyContent: 'space-between'
            , alignItems: 'center'
            , paddingBottom: '0px'
        },
    })
)

// const AccountsHeader = styled.div`
//     text-align: left;
//     font-size: 1.1rem;
// `

const Span = styled.span`
    float: right;
    margin-right: 0.5rem;
    font-size: 0.9rem;
    margin-top: 0.2rem;
    font-weight:normal;
`


const accountsEntry: any = {
    "class": "payment-voucher1",
    "items": [
        {
            "type": "Text",
            "name": "accCode",
            "placeholder": "Account code",
            "label": "Account code",
            "validations": [{
                "name": "required",
                "message": "Account code is required"
            }]
        },
        {
            "type": "Text",
            "name": "accName",
            "placeholder": "Account name",
            "label": "Account name",
            "validations": [{
                "name": "required",
                "message": "Account name is required"
            }]
        }
    ]
}

const accTypeAddition = {
    "type": "Select",
    "name": "accType",
    "label": "Account type",
    "onChange": "onAccTypeChange",
    "validations": [{ "name": "required", "message": "Account type is required" }],
    "options": [{ "label": "---select---", "value": "" }, { "label": "Asset", "value": "A" }, { "label": "Expence", "value": "E" }, { "label": "Income", "value": "I" }, { "label": "Liability", "value": "L" }]
}

const accClassAddition = {
    "type": "Select",
    "name": "classId",
    "label": "Account class",
    "validations": [{ "name": "required", "message": "Account class is required" }],
    "options": [{ "value": "", "label": "---select---" }]
}

const accParentAddition = {
    "type": "Select",
    "name": "parentId",
    "label": "Parent account",
    "onChange": "onParentChange",
    "validations": [{ "name": "required", "message": "Parent of account is required" }],
    "options": [{ "value": "", "label": "---select---" }]
}

const accLeafAddition = {
    "type": "Select",
    "name": "accLeaf",
    "label": "Account level",
    "validations": [{ "name": "required", "message": "Account level is required" }],
    "options": [
        {
            "label": "---select---", "value": ""
        }
    ]
}

const accLeafOptionsGroupWithoutLedger = [
    {
        "label": "Group", "value": "N"
    }, {
        "label": "Leaf", "value": "Y"
    }
]

const accLeafOptionsGroupWithLedger = [
    {
        "label": "Group", "value": "N"
    }, {
        "label": "Leaf", "value": "Y"
    },
    {
        "label": "Ledger", "value": "L"
    }

]

const accLeafOptionsLedger = [
    {
        "label": "Subledger", "value": "S"
    }
]

// header={
//     <StyledTableHeader>Accounts master
//         <StyledGlobalSearch>
//             <i className="pi pi-search" ></i>
// <InputText
//     type="search"
//     placeholder="Global search"
//     size={50}
//     onInput={(e: any) => {
//         meta.current.globalFilter = e.target.value
//         meta.current.isMounted && setRefresh({})
//     }}
// ></InputText>
//         </StyledGlobalSearch>
// <InputSwitch
//     checked={meta.current.isExpandAll}
//     style={{ float: 'right', marginRight: '0.5rem' }}
//     onChange={e => {
//         meta.current.isExpandAll = e.target.value
//         if (meta.current.isExpandAll) {
//             const expObject = meta.current.allKeys.reduce((prev: any, x: any) => {
//                 prev[x] = true
//                 return prev
//             }, {})
//             setInBag('accMasterExpandedKeys', expObject)
//         } else {
//             setInBag('accMasterExpandedKeys', {})
//         }
//         meta.current.isMounted && setRefresh({})
//     }}>
// </InputSwitch>
// <Span>Expand</Span>
//         {/* refresh */}
// <Button icon="pi pi-refresh"
//     style={{
//         float: 'right',
//         margin: '0px',
//         padding: '0px',
//         marginTop: '-0.2rem',
//         marginRight: '0.5rem'
//     }}
//     label="Refresh"
//     onClick={(e: any) => getData()}
// ></Button>
//     </StyledTableHeader>}