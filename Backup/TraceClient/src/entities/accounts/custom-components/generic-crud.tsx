import React, { useState, useEffect, useRef } from "react"
import moment from 'moment'
import {
    Toolbar, Typography, Backdrop
    // , Button
    , IconButton, Chip,
    Avatar, Box, Container, Paper
    , Dialog
    , DialogTitle
    , DialogActions, DialogContent, Theme, useTheme, createStyles, makeStyles
    , List, ListItem, ListItemAvatar, ListItemText, Grid
} from '@material-ui/core'
import SyncIcon from '@material-ui/icons/SyncSharp'
import AddIcon from '@material-ui/icons/Add'
import EditIcon from '@material-ui/icons/Edit'
import CloseIcon from '@material-ui/icons/Close'
import CircularProgress from '@material-ui/core/CircularProgress'
import { useTraceMaterialComponents } from '../../../common/trace-material-components'
import { useTraceGlobal } from '../../../common-utils/trace-global'
// import styled from 'styled-components'
import { DataTable } from 'primereact/datatable'
import { Column } from "primereact/column"
// import { Dialog } from 'primereact/dialog'
import 'react-widgets/dist/css/react-widgets.css'
// import { Button } from 'primereact/button'
import { manageEntitiesState } from '../../../common-utils/esm'
import { manageFormsState } from '../../../react-form/core/fsm'
import { utilMethods } from '../../../common-utils/util-methods'
import messages from '../../../messages.json'
import { useSharedCode } from '../../../common-utils/use-shared-code'
import { useIbuki } from '../../../common-utils/ibuki'
// import { graphqlService } from '../../../common-utils/graphql-service'
// import queries from '../artifacts/graphql-queries-mutations'

function GenericCRUD({ loadComponent }: any) {
    const [, setRefresh] = useState({})
    const { getCurrentEntity, getFromBag } = manageEntitiesState()
    const { resetForm, getFormData } = manageFormsState()
    const { execGenericView, genericUpdateMaster } = utilMethods()
    const { emit } = useIbuki()
    const entityName = getCurrentEntity()
    const meta: any = useRef({
        isMounted: true
        , isLoading: false
        , data: []
        , isDataChanged: false
        , title: '' // this is main table title
        , showDialog: false
        , dialogConfig: {
            title: '' // this title of dialog for update and create
            , formId: ''
            // , showSpinner: 'none'
            , isEditMode: false
            , node: {}
            , jsonObject: {}
            , textVariant: 'subtitle1'
            , dialogWidth: ''
        }
        , headerConfig: {
            textVariant: 'subtitle1'
        }
    })
    const { ColumnHeaderLeftDiv, Spinner, TableHeaderDiv, closeDialog } = useSharedCode(meta)
    const SharedDialogContent = useSharedCode(meta).DialogContent
    const dateFormat = getFromBag('dateFormat')
    const isoDateFormat = 'YYYY-MM-DD'
    useEffect(() => {
        meta.current.isMounted = true
        meta.current.isDataChanged = false
        selectLogic()[loadComponent].read()
        return (() => {
            meta.current.isMounted = false
        })
    }, [meta.current.isDataChanged])

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

    function selectLogic() {
        const dateFormat: string = getFromBag('dateFormat') //'YYYY-MM-DD'
        const logic: any = {
            branchMaster:
            {
                dataTableColumns: branchMasterColumns
                , read:
                    () => {
                        doRead({
                            formId: 'branchMaster'
                            , title: 'Branch master'
                            , meta: meta
                            , tableName: 'BranchM'
                            , sqlKey: 'get_branches'
                            , jsonObject: JSON.parse(JSON.stringify(branchMasterJson))
                        })
                    }
                , create:
                    () => {
                        doCreate({
                            title: 'New branch'
                            , isEditMode: false
                            , jsonObject: JSON.parse(JSON.stringify(branchMasterJson))
                            , meta: meta
                        })
                    }
                , submit:
                    () => {
                        doSubmit({
                            meta: meta
                            , entityName: entityName
                            , loadComponent: loadComponent
                            , customCodeBlock: meta.current.dialogConfig.isEditMode ? undefined : 'create_branch'
                        })
                    }
                , update: //edit
                    (node: any) => {
                        resetForm(meta.current.dialogConfig.formId)
                        const jsonObject = JSON.parse(JSON.stringify(branchMasterJson))
                        meta.current.dialogConfig.jsonObject = jsonObject
                        jsonObject.items[0].value = node['branchCode']
                        jsonObject.items[1].value = node['branchName']
                        doUpdate({
                            formId: 'branchMaster'
                            , isEditMode: true
                            , title: 'Edit branch'
                            , jsonObject: jsonObject
                            , meta: meta
                            , node: node
                        })
                    }
            }
            , finYearMaster:
            {
                dataTableColumns: finYearMasterColumns
                , read:
                    async () => {
                        await doRead({
                            formId: 'finYearMaster'
                            , title: 'Financial year master'
                            , meta: meta
                            , tableName: 'FinYearM'
                            , sqlKey: 'get_finYears'
                            , jsonObject: JSON.parse(JSON.stringify(branchMasterJson))
                        })
                        meta.current.data = meta.current.data?.map((x: any) => {
                            return {
                                id: x.id
                                , startDate: moment(x.startDate).format(dateFormat)
                                , endDate: moment(x.endDate).format(dateFormat)
                            }
                        })
                        meta.current.isMounted && setRefresh({})
                    }

                , create:
                    () => {
                        doCreate({
                            title: 'New financial year'
                            , isEditMode: false
                            , jsonObject: JSON.parse(JSON.stringify(finYearMasterJson))
                            , meta: meta
                        })
                    }

                , submit:
                    () => {
                        const ext: any = {}
                        const isEditMode = meta.current.dialogConfig.isEditMode
                        const formData = getFormData(meta.current.dialogConfig.formId)
                        ext.startDate = moment(formData['startDate'], dateFormat).format(isoDateFormat)
                        ext.endDate = moment(formData['endDate'], dateFormat).format(isoDateFormat)
                        doSubmit({
                            meta: meta
                            , entityName: entityName
                            , loadComponent: loadComponent
                            , idInsert: isEditMode ? undefined : true
                            , ext
                        })
                    }
                , update: //edit
                    (node: any) => {
                        resetForm(meta.current.dialogConfig.formId)
                        const jsonObject = JSON.parse(JSON.stringify(finYearMasterJson))
                        meta.current.dialogConfig.jsonObject = jsonObject
                        jsonObject.items[0].value = node['id']
                        jsonObject.items[1].value = node['startDate']
                        jsonObject.items[2].value = node['endDate']

                        doUpdate({
                            formId: 'finYearMaster'
                            , isEditMode: true
                            , title: 'Edit financial year'
                            , jsonObject: jsonObject
                            , meta: meta
                            , node: node
                        })
                    }
            }
        }
        return logic
    }

    function branchMasterColumns() {
        let numb = 0
        function incr() {
            return ++numb
        }
        return [<Column key={incr()} header={<ColumnHeaderLeftDiv>Id</ColumnHeaderLeftDiv>}
            field="id"
            style={{ width: '4rem' }}
        ></Column>,
        isMediumSizeUp ? <Column key={incr()} header={<ColumnHeaderLeftDiv>Branch code</ColumnHeaderLeftDiv>}
            field="branchCode"
            style={{ width: '10rem' }}
        ></Column> : null,
        <Column key={incr()} header={<ColumnHeaderLeftDiv>Branch name</ColumnHeaderLeftDiv>}
            field="branchName"
        ></Column>,
        <Column key={incr()} header={<div>Edit</div>}
            body={(node: any) =>
                <IconButton
                    // className={classes.syncIconButton}
                    size='medium'
                    color='secondary'
                    onClick={() => selectLogic()[meta.current.dialogConfig.formId].update(node)}>
                    <EditIcon></EditIcon>
                </IconButton>
            }
            style={{ 'width': '6rem', 'textAlign': 'center' }}
        ></Column>,
        <Column key={incr()} style={{ width: '4.5rem' }}
            header={<ColumnHeaderLeftDiv>Delete</ColumnHeaderLeftDiv>}
            body={(node: any) =>
                <IconButton
                    // className={classes.syncIconButton}
                    size='medium'
                    color='secondary'
                    onClick={e => deleteRow(node)}>
                    <CloseIcon></CloseIcon>
                </IconButton>
            }
        ></Column>].map((x, index) => {
            return x
        })
    }

    function finYearMasterColumns() {
        let numb = 0
        function incr() {
            return ++numb
        }
        return [<Column key={incr()} header={<ColumnHeaderLeftDiv>Financial year</ColumnHeaderLeftDiv>}
            field="id"
            style={{ width: '5rem' }}
        ></Column>,
        <Column key={incr()} header={<ColumnHeaderLeftDiv>Start date</ColumnHeaderLeftDiv>}
            field="startDate"
        style={{ width: '6rem' }}
        ></Column>,
        <Column key={incr()} header={<ColumnHeaderLeftDiv>End date</ColumnHeaderLeftDiv>}
            field="endDate"
            style={{ width: '6rem' }}
        ></Column>,
        <Column key={incr()} header={<div>Edit</div>}
            body={(node: any) =>
                <IconButton
                    // className={classes.syncIconButton}
                    size='medium'
                    color='secondary'
                    onClick={() => selectLogic()[meta.current.dialogConfig.formId].update(node)}>
                    <EditIcon></EditIcon>
                </IconButton> 
        }
            style={{ 'width': '6rem', 'textAlign': 'center' }}
        ></Column>,
        <Column key={incr()} style={{ width: '4.5rem' }}
            header={<ColumnHeaderLeftDiv>Delete</ColumnHeaderLeftDiv>}
            body={(node: any) => 
                <IconButton
                    className={classes.syncIconButton}
                    size='medium'
                    color='secondary'
                    onClick={e => deleteRow(node)}>
                    <CloseIcon></CloseIcon>
                </IconButton>
        }
        ></Column>].map((x, index) => {
            return x
        })
    }

    return <div className={classes.content}>
        <Box className={classes.header}>
            {/* <Box className={classes.header} component='div'> */}
            <Typography
                color='primary'
                variant={meta.current.headerConfig.textVariant || 'h6'}
                component='span'
            >{headerConfig.title}</Typography>
            <Box component='span' className={classes.RefreshAdd}>
                <IconButton
                    className={classes.syncIconButton}
                    size='medium'
                    color='secondary'
                    onClick={() => selectLogic()[loadComponent].read()}>
                    <SyncIcon></SyncIcon>
                </IconButton>
                <IconButton
                    className={classes.syncIconButton}
                    size='medium'
                    color='secondary'
                    onClick={() => selectLogic()[meta.current.dialogConfig.formId].create()}>
                    <AddIcon></AddIcon>
                </IconButton>

            </Box>
        </Box>
        <DataTable
            value={meta.current.data}>
            {
                selectLogic()[meta.current.dialogConfig.formId]?.dataTableColumns()
            }
        </DataTable>
        <Dialog //material-ui dialog
            classes={{ paper: classes.dialogPaper }} // Adjust dialog width as per device
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
                <SharedDialogContent formJson={meta.current.dialogConfig.jsonObject}></SharedDialogContent>
                {/* <Comp></Comp> */}
                {/* {meta.current.dialogConfig.dialogContent} */}
            </DialogContent>
            <DialogActions className={classes.dialogActions}>
                <TraceFullWidthSubmitButton onClick={()=>selectLogic()[meta.current.dialogConfig.formId].submit()}></TraceFullWidthSubmitButton>
            </DialogActions>
        </Dialog>
        <Backdrop
            className={classes.backdrop}
            open={meta.current.isLoading}>
            <CircularProgress color="inherit" />
        </Backdrop>
    </div>

    async function deleteRow(node: any) {
        const id = node.id
        const toDelete = window.confirm(messages['deleteConfirm'])
        if (toDelete) {
            const ret: any = await genericUpdateMaster({
                formId: meta.current.dialogConfig.formId
                , entityName: entityName
                , tableName: meta.current.dialogConfig.tableName
                , deletedIds: [id]
            })
            if (ret === true) {
                emit('SHOW-MESSAGE', {})
                selectLogic()[loadComponent].read()
            } else if (ret && ret.message) {
                emit('SHOW-MESSAGE', { severity: 'error', message: ret.message, duration: null })
            } else {
                emit('SHOW-MESSAGE', { severity: 'error', message: messages['errorInOperation'], duration: null })
            }
        }
    }

    interface ReadOptions {
        formId: string
        title: string
        meta: any
        tableName: string
        sqlKey: string
        jsonObject: any
    }
    async function doRead(options: ReadOptions) {
        const entityName = getCurrentEntity()
        const met = options.meta
        met.current.dialogConfig.formId = options.formId
        met.current.headerConfig.title = options.title
        met.current.dialogConfig.tableName = options.tableName
        met.current.dialogConfig.jsonObject = options.jsonObject
        met.current.isLoading = true
        met.current.isMounted && setRefresh({})
        const ret = await execGenericView({
            isMultipleRows: true
            , sqlKey: options.sqlKey
            , args: {}
            , entityName: entityName
        })
        met.current.data = ret
        met.current.isLoading = false
        met.current.isMounted && setRefresh({})
    }

    interface CreateOptions {
        // formId: string
        title: string
        meta: any
        isEditMode: boolean
        jsonObject: {}
    }
    async function doCreate(options: CreateOptions) {
        const met = options.meta
        met.current.dialogConfig.title = options.title
        met.current.dialogConfig.isEditMode = options.isEditMode
        met.current.dialogConfig.jsonObject = options.jsonObject
        resetForm(met.current.dialogConfig.formId)
        met.current.showDialog = true
        met.current.isMounted && setRefresh({})
    }

    interface UpdateOptions {
        formId: string
        title: string
        meta: any
        isEditMode: boolean
        jsonObject: {}
        node: any
    }
    async function doUpdate(options: UpdateOptions) {
        const met = options.meta
        met.current.dialogConfig.formId = options.formId
        met.current.dialogConfig.title = options.title
        met.current.dialogConfig.isEditMode = options.isEditMode
        met.current.showDialog = true
        met.current.dialogConfig.node = options.node
        met.current.isMounted && setRefresh({})
    }

    interface SubmitOptions {
        meta: any
        entityName: string
        customCodeBlock?: string
        loadComponent: string
        idInsert?: boolean
        ext?: any
    }

    async function doSubmit(options: SubmitOptions) {
        const met: any = options.meta
        const isEditMode: boolean = met.current.dialogConfig.isEditMode
        let formData = JSON.parse(JSON.stringify(getFormData(met.current.dialogConfig.formId))) // buffering
        formData = { ...formData, ...options.ext }
        isEditMode && (formData.id = met.current.dialogConfig?.node.id) // for edit mode id should be there in formData
        met.current.dialogConfig.showSpinner = 'block'
        setRefresh({})
        const ret: any = await genericUpdateMaster({
            formId: meta.current.dialogConfig.formId
            , entityName: options.entityName
            , tableName: meta.current.dialogConfig.tableName
            , customCodeBlock: options.customCodeBlock
            , data: formData
            , idInsert: options.idInsert
        })
        met.current.dialogConfig.showSpinner = 'none'
        if (ret === true) {
            met.current.dialogConfig.isEditMode = false

            resetForm(met.current.dialogConfig.formId)
            emit('SHOW-MESSAGE', {})
            selectLogic()[options.loadComponent].read()
            closeDialog()
        } else if (ret && ret.message) {
            emit('SHOW-MESSAGE', { severity: 'error', message: ret.message, duration: null })
        } else {
            emit('SHOW-MESSAGE', { severity: 'error', message: messages['errorInOperation'], duration: null })
        }
    }
}

export { GenericCRUD }

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

        refreshAdd: {
            display: 'flex',
            alignItems: 'center',
            float: 'right',
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

const branchMasterJson: any = {
    "class": "generic-dialog",
    "items": [
        {
            "type": "Text",
            "name": "branchCode",
            "placeholder": "Branch code",
            "label": "Branch code",
            "validations": [{
                "name": "required",
                "message": "Branch code is required"
            }, {
                "name": "noWhiteSpaceOrSpecialChar",
                "message": "White space or special characters are not allowed inside branch code"
            }]
        },
        {
            "type": "Text",
            "name": "branchName",
            "placeholder": "Branch name",
            "label": "Branch name",
            "validations": [{
                "name": "required",
                "message": "Branch name is required"
            }]
        }
    ]
}

const finYearMasterJson: any = {
    "class": "generic-dialog",
    "items": [
        {
            "type": "Text",
            "name": "id",
            "placeholder": "Financial year",
            "label": "Financial year",
            "validations": [{
                "name": "required",
                "message": "Financial year is required"
            }, {
                "name": "noWhiteSpaceOrSpecialChar",
                "message": "White space or special characters are not allowed inside entity name"
            }
                , {
                "name": "yearOnly",
                "message": "Only valid numeric years are allowed"
            }
            ]
        },
        {
            "type": "DateMask",
            "name": "startDate",
            "placeholder": "Start date",
            "label": "Start date",
            "validations": [{
                "name": "required",
                "message": "Start date is required"
            }]
        },
        {
            "type": "DateMask",
            "name": "endDate",
            "placeholder": "End date",
            "label": "End date",
            "validations": [{
                "name": "required",
                "message": "End date is required"
            }]
        }
    ]
}

// <Dialog visible={meta.current.showDialog}
//     header={meta.current.dialogConfig.title}
//     modal={true}
//     style={{ width: '31rem' }}
//     closable={true}
//     focusOnShow={true}
//     onHide={() => {
//         closeDialog()
//     }}
//     footer={<div>
//         <Button icon="pi pi-check" className="p-button-success" label="Submit" onClick={() => {
//             selectLogic()[meta.current.dialogConfig.formId].submit()
//         }}></Button>
//         <Button icon="pi pi-ban" label="Cancel" className="p-button-warning" onClick={
//             () => {
//                 closeDialog()
//             }}></Button>
//     </div>}
//     >
//     <Spinner showSpinner={meta.current.dialogConfig.showSpinner}></Spinner>
//     <DialogContent formJson={meta.current.dialogConfig.jsonObject}></DialogContent>
// </Dialog>