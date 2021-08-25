import { useState, useEffect, useRef } from 'react'
import clsx from 'clsx'
import {
    Typography,
    Button,
    IconButton,
    Chip,
    Avatar,
    Box,
    Dialog,
    DialogTitle,
    DialogActions,
    DialogContent,
    Theme,
    createStyles,
    makeStyles,
    List,
    ListItem,
    ListItemText,
} from '@material-ui/core'
import { Close } from '@material-ui/icons'
import RefreshIcon from '@material-ui/icons/Cached'
import RearrangeIcon from '@material-ui/icons/FlipToFront'
import SubmitIcon from '@material-ui/icons/Save'
import OpeningBalanceIcon from '@material-ui/icons/AccountBalance'
import _ from 'lodash'
import moment from 'moment'
import { DataTable } from 'primereact/datatable'
import { InputText } from 'primereact/inputtext'
import InputMask from 'react-input-mask'
import hash from 'object-hash'
import { Column } from 'primereact/column'
import { usingIbuki } from '../../../../common-utils/ibuki'
import ReactForm from '../../../../react-form/react-form'
import { componentStore } from '../../../../react-form/component-store/html-core'
import { manageEntitiesState } from '../../../../common-utils/esm'
import { manageFormsState } from '../../../../react-form/core/fsm'
import { utilMethods } from '../../../../common-utils/util-methods'
import { useTraceGlobal } from '../../../../common-utils/trace-global'
import { useTraceMaterialComponents } from '../../../../common/trace-material-components'
import messages from '../../../../messages.json'

function BankRecon() {
    const [selectedItems, setSelectedItems] = useState(null)
    const { emit } = usingIbuki()
    const { getCurrentEntity, getFromBag } = manageEntitiesState()
    const {
        resetForm,
        resetAllFormErrors,
        getValidationFabric,
        getFormData,
        clearServerError,
    } = manageFormsState()
    const { doValidateForm, isValidForm } = getValidationFabric()
    const {
        toDecimalFormat,
        extractAmount,
        saveForm,
        execGenericView,
        genericUpdateMasterNoForm,
        getDateMaskMap,
        isControlDisabled,
    } = utilMethods()
    const [, setRefresh] = useState({})
    const { TraceFullWidthSubmitButton } = useTraceMaterialComponents()
    const isoDateFormat = 'YYYY-MM-DD'
    const dateFormat = getFromBag('dateFormat')

    const meta: any = useRef({
        isMounted: false,
        selectedBank: 'Select a bank account',
        allBanks: [],
        reconData: [],
        selectedBankId: '',
        selectedBankName: 'Select a bank',
        balances: {},
        initialDataHash: '',
        initialData: [],
        headerConfig: {
            flexDirection: '',
            alignItems: '',
            chipSize: '',
            buttonSize: '',
            buttonTopMargin: '',
            buttonRightMargin: '',
            textVariant: '',
            isBbuttonsIcon: false,
            windowWidth: '',
        },
        showDialog: false,
        dialogConfig: {
            title: '',
            formId: 'bankOpClosBal',
            bankOpBalId: '',
            dialogActions: <></>,
            dialogContent: <></>,
        },
    })
    const headerConfig = meta.current.headerConfig
    const classes = useStyles({ headerConfig: headerConfig })
    const { getCurrentMediaSize, getCurrentWindowSize } = useTraceGlobal()

    useEffect(() => {
        meta.current.isMounted = true
        utilFunc().getAllBanks()
        return () => {
            meta.current.isMounted = false
        }
    }, [])

    const mediaLogic: any = {
        xs: () => {
            headerConfig.flexDirection = 'column'
            headerConfig.alignItems = 'flex-start'
            headerConfig.chipSize = 'medium'
            headerConfig.buttonSize = 'medium'
            headerConfig.buttonTopMargin = '0.5rem'
            headerConfig.buttonRightMargin = '0px'
            headerConfig.textVariant = 'subtitle1'
            headerConfig.isButtonsIcon = false
            headerConfig.windowWidth = '100vw'
        },
        sm: () => {
            headerConfig.flexDirection = 'row'
            headerConfig.alignItems = 'center'
            headerConfig.flexWrap = 'wrap'
            headerConfig.chipSize = 'medium'
            headerConfig.buttonSize = 'medium'
            headerConfig.buttonTopMargin = '0px'
            headerConfig.buttonRightMargin = '0px'
            headerConfig.textVariant = 'subtitle1'
            headerConfig.isButtonsIcon = false
            headerConfig.windowWidth = '100vw'
        },
        md: () => {
            headerConfig.flexDirection = 'row'
            headerConfig.alignItems = 'center'
            headerConfig.chipSize = 'medium'
            headerConfig.buttonSize = 'medium'
            headerConfig.buttonTopMargin = '0px'
            headerConfig.buttonRightMargin = '0.2rem'
            headerConfig.textVariant = 'h6'
            headerConfig.isButtonsIcon = false
            headerConfig.windowWidth = 'calc(100vw - ( 260px + 55px ))' // 55px is used otherwise a horizontal scrollbar appears
        },
        lg: () => {
            headerConfig.flexDirection = 'row'
            headerConfig.alignItems = 'center'
            headerConfig.chipSize = 'medium'
            headerConfig.buttonSize = 'large'
            headerConfig.buttonTopMargin = '0px'
            headerConfig.buttonRightMargin = '1rem'
            headerConfig.textVariant = 'h6'
            headerConfig.isButtonsIcon = true
            headerConfig.windowWidth = 'calc(100vw - ( 260px + 55px ))' // 55px is used otherwise a horizontal scrollbar appears
        },
        xl: () => mediaLogic['lg'](),
    }

    const currentMediaSize = getCurrentMediaSize()
    currentMediaSize && mediaLogic[currentMediaSize]()

    function handleDisabled() {
        let ret = false
        if (isControlDisabled('doBankRecon')) {
            ret = true
        } else {
            ret = utilFunc().getDataNotChanged()
        }
        return ret
    }

    return (
        <div
            className={classes.content}
            style={{ width: getCurrentWindowSize() }}>
            <Box className={classes.header}>
                <Box className={classes.bank}>
                    <Typography
                        color="primary"
                        variant={headerConfig.textVariant}
                        component="span">
                        Reconcillation for
                    </Typography>
                    <Chip
                        avatar={<Avatar>B</Avatar>}
                        label={meta.current.selectedBankName}
                        className={classes.selectedBank}
                        color="secondary"
                        onClick={utilFunc().selectBankClick}
                        size={meta.current.headerConfig.chipSize}></Chip>
                </Box>
                <Box component="div" className={classes.buttons}>
                    {/* Opening */}
                    <Button
                        className={classes.buttons}
                        size={meta.current.headerConfig.buttonSize}
                        variant="contained"
                        color="primary"
                        startIcon={
                            headerConfig.isButtonsIcon && (
                                <OpeningBalanceIcon></OpeningBalanceIcon>
                            )
                        }
                        disabled={!meta.current.selectedBankId}
                        onClick={utilFunc().opBalanceButtonClick}>
                        Opening
                    </Button>

                    {/* rearrange */}
                    <Button
                        className={classes.buttons}
                        size={meta.current.headerConfig.buttonSize}
                        startIcon={
                            headerConfig.isButtonsIcon && (
                                <RearrangeIcon></RearrangeIcon>
                            )
                        }
                        onClick={async (e: any) => {
                            meta.current.reconData = utilFunc().computeBalance()
                            meta.current.isMounted && setRefresh({})
                        }}
                        variant="contained"
                        color="secondary">
                        Rearrange
                    </Button>

                    {/* refresh */}
                    <Button
                        size={meta.current.headerConfig.buttonSize}
                        className={clsx(classes.buttons, classes.refresh)}
                        startIcon={
                            headerConfig.isButtonsIcon && (
                                <RefreshIcon></RefreshIcon>
                            )
                        }
                        onClick={(e: any) => utilFunc().fetchBankRecon()}
                        variant="contained">
                        Refresh
                    </Button>

                    {/* submit */}
                    <Button
                        disabled={handleDisabled()}
                        size={meta.current.headerConfig.buttonSize}
                        className={clsx(classes.buttons, classes.submit)}
                        startIcon={
                            headerConfig.isButtonsIcon && (
                                <SubmitIcon></SubmitIcon>
                            )
                        }
                        onClick={utilFunc().submitBankRecon}
                        variant="contained">
                        Submit
                    </Button>
                </Box>
            </Box>
            <DataTable
                style={{ marginTop: '1rem', fontSize: '0.8rem' }}
                value={meta.current.reconData}
                scrollable={true}
                selectionMode="multiple"
                selection={selectedItems}
                onSelectionChange={(e) => setSelectedItems(e.value)}
                scrollHeight="calc(100vh - 20rem)">
                <Column
                    selectionMode="multiple"
                    style={{ width: '3rem', textAlign: 'center' }}
                />
                {/* id */}
                <Column
                    style={{ width: '4rem', textAlign: 'left' }}
                    field="id"
                    header="Id"></Column>

                {/* tran Date */}
                <Column
                    header="Tran date"
                    style={{ width: '7rem', textAlign: 'left' }}
                    field={'tranDate'}></Column>

                {/* instr no  */}
                <Column
                    style={{
                        width: '7rem',
                        textAlign: 'left',
                        wordWrap: 'break-word',
                    }}
                    field="instrNo"
                    header="Instr no"></Column>

                {/* clear date ------------------------------------  */}
                <Column
                    editor={utilFunc().clearDateEditor}
                    style={{
                        height: '2rem',
                        fontSize: '0.8rem',
                        width: '7.0rem',
                        textAlign: 'left',
                        backgroundColor: 'dodgerblue',
                    }}
                    field="clearDate"
                    header="Clear date"></Column>

                {/* debit */}
                <Column
                    style={{ width: '8rem', textAlign: 'right' }}
                    body={(node: any) => toDecimalFormat(node.debit)}
                    header="Debit"></Column>

                {/* credit */}
                <Column
                    style={{ width: '8rem', textAlign: 'right' }}
                    body={(node: any) => toDecimalFormat(node.credit)}
                    header="Credit"></Column>

                {/* balance  */}
                <Column
                    style={{ width: '8rem', textAlign: 'right' }}
                    body={(node: any) => toDecimalFormat(node.balance)}
                    header="Balance"></Column>

                {/* autoRefNo */}
                <Column
                    style={{
                        overflow: 'hidden',
                        textAlign: 'left',
                        width: '10rem',
                    }}
                    field="autoRefNo"
                    header="Auto ref no"></Column>

                {/* clear remarks ----------------------------------------*/}
                <Column
                    editor={utilFunc().clearRemarksEditor}
                    style={{
                        textAlign: 'left',
                        backgroundColor: 'yellow',
                        width: '15rem',
                    }}
                    field="clearRemarks"
                    header="Clear remarks"></Column>

                {/* Account name */}
                <Column
                    style={{ width: '8rem', textAlign: 'left' }}
                    field="accNames"
                    header="Accounts"></Column>

                {/* line ref no */}
                <Column
                    style={{ textAlign: 'left', width: '10rem' }}
                    field="lineRefNo"
                    header="Line ref no"></Column>

                {/* line remarks */}
                <Column
                    style={{ textAlign: 'left', width: '15rem' }}
                    field="lineRemarks"
                    header="Line remarks"></Column>
            </DataTable>

            <Dialog //material-ui dialog
                open={meta.current.showDialog}
                onClose={utilFunc().closeDialog}>
                <DialogTitle
                    disableTypography
                    id="generic-dialog-title"
                    className={classes.dialogTitle}>
                    <h3>{meta.current.dialogConfig.title}</h3>
                    <IconButton
                        size="small"
                        color="default"
                        onClick={utilFunc().closeDialog}
                        aria-label="close">
                        <Close />
                    </IconButton>
                </DialogTitle>
                <DialogContent className={classes.dialogContent}>
                    {meta.current.dialogConfig.dialogContent}
                </DialogContent>
                <DialogActions className={classes.dialogActions}>
                    {meta.current.dialogConfig.dialogActions}
                </DialogActions>
            </Dialog>
        </div>
    )

    function utilFunc() {
        function bankSelected(item: any) {
            meta.current.selectedBankName = item.accName
            meta.current.selectedBankId = item.id
            fetchBankRecon()
            closeDialog()
        }

        function clearDateEditor(props: any) {
            const field = 'clearDate'
            const maskMap: any = getDateMaskMap()
            return (
                <InputMask
                    style={{
                        height: '1.2rem',
                        fontSize: '0.8rem',
                        width: '6rem',
                    }}
                    mask={maskMap[dateFormat]}
                    placeholder={dateFormat}
                    value={props.rowData[field] || props.rowData['tranDate']}
                    onFocus={(e: any) => {
                        props.rowData[field] =
                            props.rowData[field] || props.rowData['tranDate']
                        meta.current.isMounted && setRefresh({})
                    }}
                    onKeyDown={(e) => {
                        if (e.key === 'Escape') {
                            props.rowData[field] = null
                            meta.current.isMounted && setRefresh({})
                        }
                    }}
                    onChange={(e) => {
                        props.rowData[field] = e.target.value
                        meta.current.isMounted && setRefresh({})
                    }}></InputMask>
            )
        }

        function clearRemarksEditor(props: any) {
            const field = 'clearRemarks'
            return (
                <InputText
                    style={{ height: '1.2rem', fontSize: '0.8rem' }}
                    value={props.rowData[field] || ''}
                    onChange={(e: any) => {
                        props.rowData[field] = e.target.value || null
                        meta.current.isMounted && setRefresh({})
                    }}></InputText>
            )
        }

        function closeDialog() {
            meta.current.showDialog = false
            meta.current.isMounted && resetForm(utilFunc().getFormId())
            meta.current.isMounted && resetAllFormErrors(utilFunc().getFormId())
            meta.current.isMounted && setRefresh({})
        }

        function computeBalance(itemArray: any[] = meta.current.reconData) {
            const orderedItemArray = _.orderBy(itemArray, [
                (item) =>
                    moment(
                        item.clearDate ? item.clearDate : '30/12/9999',
                        dateFormat
                    ),
                (item) => moment(item.tranDate, dateFormat),
                (item) => item.id,
            ])
            orderedItemArray?.reduce(
                (prev: any, item: any, index: number) => {
                    item.clearDate = item.clearDate || null
                    const bal = prev.opBal + item.debit - item.credit
                    item.balance = toDecimalFormat(
                        String(Math.abs(bal))
                    ).concat(' ', bal < 0 ? 'Cr' : 'Dr')
                    return { opBal: bal }
                },
                { opBal: 0 }
            )

            return orderedItemArray?.reverse()
        }

        async function fetchBankRecon() {
            const finYearObject = getFromBag('finYearObject')
            const nextFinYearId = finYearObject.finYearId + 1
            emit('SHOW-LOADING-INDICATOR', true)
            const ret = await execGenericView({
                sqlKey: 'getJson_bankRecon',
                isMultipleRows: false,
                args: {
                    accId: meta.current.selectedBankId,
                    nextFinYearId: nextFinYearId,
                },
            })
            if (ret) {
                meta.current.balances['opBal'] = ret.jsonResult.opBal || {
                    amount: 0,
                    dc: 'D',
                }
                meta.current.dialogConfig.bankOpBalId =
                    ret.jsonResult?.opBal?.id
                // set the values for opening balance update dialog
                opClosJson.items[0].value =
                    meta.current.balances['opBal'].amount
                opClosJson.items[1].value = meta.current.balances['opBal'].dc
                meta.current.balances['closBal'] = ret.jsonResult.closBpBal || {
                    amount: 0,
                    dc: 'D',
                }
                const bankRec: any[] = ret.jsonResult.bankRecon || []
                const bankRecon = bankRec.map((item) => {
                    //date format change
                    item.tranDate = moment(item.tranDate).format(dateFormat)
                    item.clearDate = item.clearDate
                        ? moment(item.clearDate).format(dateFormat)
                        : ''
                    return item
                })
                let opDebit = 0,
                    opCredit = 0
                if (meta.current.balances['opBal']?.amount > 0) {
                    if (meta.current.balances['opBal']?.dc === 'D') {
                        opDebit = meta.current.balances['opBal']?.amount
                    } else {
                        opCredit = meta.current.balances['opBal']?.amount
                    }
                }

                bankRecon.unshift({
                    //add at begining
                    lineRemarks: 'Opening balance',
                    autoRefNo: 'Opening balance',
                    tranDate: finYearObject.startDate,
                    clearDate: finYearObject.startDate,
                    debit: opDebit,
                    credit: opCredit,
                })
                meta.current.reconData =
                    bankRecon && utilFunc().computeBalance(bankRecon)
                meta.current.initialData = JSON.parse(
                    JSON.stringify(meta.current.reconData)
                )
                meta.current.initialDataHash = hash(meta.current.reconData)
            }
            emit('SHOW-LOADING-INDICATOR', false)
            meta.current.isMounted && setRefresh({})
        }

        async function getAllBanks() {
            emit('SHOW-LOADING-INDICATOR', true)
            const ret: any = await execGenericView({
                sqlKey: 'get_allBanks',
                isMultipleRows: true,
            })
            ret && (meta.current.allBanks = ret)
            emit('SHOW-LOADING-INDICATOR', false)
            meta.current.isMounted && setRefresh({})
        }

        function getAllBanksListItems() {
            const listItems = meta.current.allBanks.map((item: any) => {
                return (
                    <ListItem
                        key={item.id}
                        onClick={() => bankSelected(item)}
                        selected
                        button
                        className={classes.listItem}>
                        <ListItemText primary={item.accName}></ListItemText>
                    </ListItem>
                )
            })
            return (
                <List component="nav" dense>
                    {listItems}
                </List>
            )
        }

        function getDataDiff() {
            const data1 = _.orderBy(meta.current.initialData, [
                (item) => item.id,
            ])
            let data2 = JSON.parse(JSON.stringify(meta.current.reconData))
            data2 = _.orderBy(data2, [(item) => item.id])
            const diffObj: any[] = []
            const len = data1.length
            for (let i: number = 0; i < len; i++) {
                if (hash(data1[i]) !== hash(data2[i])) {
                    const item = {
                        clearDate: data2[i].clearDate || null, // for no data provide null instead of '' because '' is not valid date value
                        clearRemarks: data2[i].clearRemarks,
                        tranDetailsId: data2[i].id,
                        id: data2[i].bankReconId,
                    }
                    if (!item.id) {
                        delete item.id
                    }
                    diffObj.push(item)
                }
            }
            return diffObj
        }

        function getDataNotChanged() {
            const hash1 =
                meta.current.reconData?.length > 0
                    ? hash(meta.current.reconData)
                    : ''
            const ret = meta.current.initialDataHash === hash1 ? true : false
            return ret
        }

        function getFormId() {
            return meta.current.dialogConfig.formId
        }

        function opBalanceButtonClick() {
            meta.current.dialogConfig.title = 'Opening balance'
            meta.current.dialogConfig.dialogContent = OpBalanceDialogContent()
            meta.current.dialogConfig.dialogActions = (
                <TraceFullWidthSubmitButton
                    onClick={() => submitOpBal()}></TraceFullWidthSubmitButton>
            )
            meta.current.showDialog = true
            meta.current.isMounted && setRefresh({})
        }

        function OpBalanceDialogContent() {
            return (
                <ReactForm
                    formId={utilFunc().getFormId()}
                    jsonText={JSON.stringify(opClosJson)}
                    name={getCurrentEntity()}
                    componentStore={componentStore}></ReactForm>
            )
        }

        function selectBankClick() {
            meta.current.dialogConfig.title = 'Select a bank'
            meta.current.dialogConfig.dialogContent = getAllBanksListItems()
            meta.current.dialogConfig.dialogActions = <></>
            meta.current.showDialog = true
            meta.current.isMounted && setRefresh({})
        }

        async function submitBankRecon() {
            emit('SHOW-LOADING-INDICATOR', true)
            const diffObj: any[] = utilFunc().getDataDiff()
            // correct the clearDate format to iso date
            const diff: any[] = diffObj.map((x) => {
                x.clearDate = x.clearDate
                    ? moment(x.clearDate, dateFormat).format(isoDateFormat)
                    : null
                return x
            })
            const sqlObject = {
                tableName: 'ExtBankReconTranD',
                data: diff,
            }
            const ret = await genericUpdateMasterNoForm(sqlObject)
            if (ret) {
                meta.current.reconData = utilFunc().computeBalance()
                meta.current.initialData = JSON.parse(
                    JSON.stringify(meta.current.reconData)
                )
                meta.current.initialDataHash = hash(meta.current.initialData)
                fetchBankRecon()
            } else {
                emit('SHOW-MESSAGE', {
                    severity: 'error',
                    message: messages['errorInOperation'],
                    duration: null,
                })
            }
            emit('SHOW-LOADING-INDICATOR', false)
            meta.current.isMounted && setRefresh({})
        }

        async function submitOpBal() {
            const formId = utilFunc().getFormId()
            clearServerError(formId)
            await doValidateForm(formId)
            if (isValidForm(formId)) {
                let data = getFormData(formId)
                data.amount = extractAmount(data.amount)
                data.accId = meta.current.selectedBankId
                data.finYearId = getFromBag('finYearObject')?.finYearId
                data.id = meta.current.dialogConfig.bankOpBalId || undefined
                const finalData: any = {}
                finalData.tableName = 'BankOpBal'
                finalData.data = { ...data }

                saveForm({
                    data: finalData,
                    formId: formId,
                    queryId: 'genericUpdateMaster',
                    afterMethod: () => {
                        utilFunc().closeDialog()
                        fetchBankRecon()
                    },
                    formRefresh: false,
                })
            }
        }

        return {
            getFormId,
            getAllBanks,
            computeBalance,
            getDataNotChanged,
            getDataDiff,
            closeDialog,
            submitOpBal,
            selectBankClick,
            getAllBanksListItems,
            bankSelected,
            fetchBankRecon,
            submitBankRecon,
            clearDateEditor,
            clearRemarksEditor,
            opBalanceButtonClick,
        }
    }
}

export { BankRecon }

const useStyles: any = makeStyles((theme: Theme) =>
    createStyles({
        content: {
            marginTop: theme.spacing(1),
            marginBottom: theme.spacing(1),
            overflowX: 'auto',
        },
        selectedBank: {
            marginLeft: theme.spacing(1),
            maxWidth: '17rem',
        },
        dialogContent: {
            maxHeight: '12rem',
            minWidth: '20rem',
        },

        dialogTitle: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingBottom: '0px',
        },

        dialogActions: {
            minHeight: theme.spacing(4),
        },

        header: {
            display: 'flex',
            flexDirection: ({ headerConfig }): any =>
                headerConfig.flexDirection,
            alignItems: ({ headerConfig }): any => headerConfig.alignItems,
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
        },

        bank: {
            display: 'flex',
            alignItems: 'center',
        },

        buttons: {
            marginRight: ({ headerConfig }: any) =>
                headerConfig.buttonRightMargin,
            marginTop: ({ headerConfig }: any) => headerConfig.buttonTopMargin,
            borderRadius: '16px',
        },

        submit: {
            backgroundColor: theme.palette.success.main,
            color: theme.palette.primary.contrastText,
        },

        refresh: {
            backgroundColor: theme.palette.info.main,
            color: theme.palette.primary.contrastText,
        },
    })
)

const opClosJson: any = {
    class: 'generic-dialog',
    items: [
        {
            type: 'Money',
            name: 'amount',
            style: { width: '100%' },
            placeholder: 'Opening balance as per bank',
            label: 'Opening balance as per bank statement',
            showLabel: true,
            validations: [
                {
                    name: 'required',
                    message:
                        'Please provide opening balance as per bank statement',
                },
            ],
        },
        {
            type: 'Select',
            name: 'dc',
            style: { width: '100%', height: '2.0rem' },
            placeholder: 'Debit / Credit',
            label: 'Select debit / credit',
            options: [
                {
                    label: 'Debit',
                    value: 'D',
                },
                {
                    label: 'Credit',
                    value: 'C',
                },
            ],
            validations: [
                {
                    name: 'required',
                    message: 'Please select a financial year',
                },
            ],
        },
    ],
}

/*
   
*/
