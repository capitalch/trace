import {
    _,
    clsx,
    DataTable,
    hash,
    InputMask,
    InputText,
    moment,
    PrimeColumn,
    useState,
    useEffect,
    useRef,
} from '../../../../imports/regular-imports'
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
    useTheme,
} from '../../../../imports/gui-imports'
import {
    CloseSharp,
    AccountBalance,
    FlipToFront,
    Cached,
    Save,
} from '../../../../imports/icons-import'
import { useSharedElements } from '../common/shared-elements-hook'
import {
    componentStore,
    manageEntitiesState,
    manageFormsState,
    ReactForm,
    useIbuki,
    useTraceGlobal,
    useTraceMaterialComponents,
} from '../../../../imports/trace-imports'
import { utilMethods } from '../../../../global-utils/misc-utils'
import messages from '../../../../messages.json'

function BankRecon() {
    // const [selectedItems, setSelectedItems] = useState(null)
    // const { emit } = useIbuki()
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
    const { emit, filterOn, XXGrid } = useSharedElements()
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
    const theme: Theme = useTheme()
    useEffect(() => {
        meta.current.isMounted = true
        // utilFunc().getAllBanks()
        // const subs1 = filterOn(getXXGridParams().gridActionMessages.fetchIbukiMessage).subscribe(()=>{

        // })
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

    const {
        allRows,
        columns,
        gridActionMessages,
        queryArgs,
        queryId,
        specialColumns,
        summaryColNames,
    } = getXXGridParams()

    return (
        <div
            className={classes.content}
            style={{ width: getCurrentWindowSize() }}>
            <Box className="header">
                <Box className="bank">
                    <Typography
                        color="primary"
                        variant={headerConfig.textVariant}
                        component="span">
                        Reconcillation for
                    </Typography>
                    <Chip
                        avatar={<Avatar>B</Avatar>}
                        label={meta.current.selectedBankName}
                        // className={classes.selectedBank}
                        color="secondary"
                        onClick={utilFunc().onSelectBankClick}
                        size={meta.current.headerConfig.chipSize}></Chip>
                </Box>
                <Box component="div" className="all-buttons">
                    {/* Opening */}
                    <Button
                        size="medium"
                        variant="contained"
                        color="default"
                        startIcon={<AccountBalance></AccountBalance>}
                        disabled={!meta.current.selectedBankId}
                        onClick={utilFunc().opBalanceButtonClick}>
                        Opening
                    </Button>

                    {/* rearrange */}
                    <Button
                        size="medium"
                        startIcon={
                            headerConfig.isButtonsIcon && (
                                <FlipToFront></FlipToFront>
                            )
                        }
                        onClick={async (e: any) => {
                            // meta.current.reconData = utilFunc().computeBalance()
                            meta.current.testParams = {
                                name: '',
                            }
                            emit(
                                getXXGridParams().gridActionMessages
                                    .calculateBalanceIbukiMessage,
                                    null
                                // {
                                //     testParams: meta,
                                //     testFunc: testCallback,
                                // }
                            )
                            meta.current.isMounted && setRefresh({})
                        }}
                        variant="contained"
                        color="primary">
                        Rearr..
                    </Button>

                    {/* refresh */}
                    <Button
                        size="medium"
                        startIcon={<Cached></Cached>}
                        className="refresh"
                        onClick={(e: any) => utilFunc().fetchBankRecon()}
                        variant="contained">
                        Refresh
                    </Button>

                    {/* submit */}
                    <Button
                        disabled={handleDisabled()}
                        color="secondary"
                        size="medium"
                        startIcon={headerConfig.isButtonsIcon && <Save></Save>}
                        onClick={utilFunc().submitBankRecon}
                        variant="contained">
                        Submit
                    </Button>
                </Box>
            </Box>
            {/* <Box className={classes.content}> */}
            <XXGrid
                className="xx-grid"
                // allRows={meta.current.reconData || []}
                gridActionMessages={gridActionMessages}
                columns={columns}
                isReverseOrderByDefault={true}
                isShowColBalanceByDefault={true}
                postFetchMethod={utilFunc().postFetchMethod}
                summaryColNames={summaryColNames}
                title={'Bank reconcillation'}
                sqlQueryId={queryId}
                sqlQueryArgs={queryArgs}
                jsonFieldPath="jsonResult.bankRecon"
                specialColumns={specialColumns}
                toShowOpeningBalance={true}
                toShowColumnBalanceCheckBox={true}
                toShowClosingBalance={true}
                toShowReverseCheckbox={true}
                // xGridProps={{ disableSelectionOnClick: true }}
                viewLimit="1000"
            />
            {/* </Box> */}

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
                        <CloseSharp />
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

    // function testCallback(params: any) {
    //     console.log(meta.current.testParams)
    //     console.log(params)
    // }

    function getXXGridParams() {
        const columns = [
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
                valueFormatter: (params: any) =>
                    params.value ? params.value : '',
            },
            {
                headerName: 'T. date',
                description: 'Date',
                field: 'tranDate',
                width: 120,
                type: 'date',
                valueFormatter: (params: any) =>
                    moment(params.value, isoDateFormat).format(dateFormat),
            },
            {
                headerName: 'Instr no',
                description: 'Instrument name',
                field: 'instrNo',
                editable: true,
                width: 120,
            },
            {
                headerName: 'Clear date',
                width: 170,
                field: 'clearDate',
                editable: true,
                type: 'date',
                valueFormatter: (params: any) =>
                    params.value ? moment(params.value).format(dateFormat) : '',
            },
            {
                headerName: 'Debit',
                description: 'Debit',
                field: 'debit',
                type: 'number',
                width: 120,
            },
            {
                headerName: 'Credit',
                description: 'Credit',
                field: 'credit',
                type: 'number',
                width: 120,
            },
            {
                headerName: 'Balance',
                description: 'Balance',
                field: 'balance',
                type: 'number',
                width: 120,
            },
            {
                headerName: 'Auto ref no',
                description: 'Auto ref no',
                field: 'autoRefNo',
                type: 'string',
                width: 150,
            },
        ]
        const queryId = 'getJson_bankRecon'
        const allRows = meta.current.reconData
        const finYearObject = getFromBag('finYearObject')
        const nextFinYearId = finYearObject.finYearId + 1
        const queryArgs = {
            accId: meta.current.selectedBankId,
            nextFinYearId: nextFinYearId,
            isoStartDate: finYearObject.isoStartDate,
            isoEndDate: finYearObject.isoEndDate,
        }
        const summaryColNames: string[] = ['debit', 'credit']
        const specialColumns = {
            isEdit: true,
            isDelete: true,
        }
        const gridActionMessages = {
            fetchIbukiMessage: 'XX-GRID-BANK-RECON-FETCH-DATA',
            calculateBalanceIbukiMessage:
                'XX-GRID-BANK-RECON-CALCULATE-BALANCE',
            editIbukiMessage: 'BANK-RECON-XX-GRID-EDIT-CLICKED',
            deleteIbukiMessage: 'BANK-RECON-XX-GRID-DELETE-CLICKED',
            justRefreshIbukiMessage: 'XX-GRID-BANK-RECON-JUST-REFRESH',
        }
        return {
            allRows,
            columns,
            gridActionMessages,
            queryId,
            queryArgs,
            summaryColNames,
            specialColumns,
        }
    }

    function utilFunc() {
        function bankSelected(item: any) {
            meta.current.selectedBankName = item.accName
            meta.current.selectedBankId = item.id
            // fetchBankRecon()

            emit(
                getXXGridParams().gridActionMessages.fetchIbukiMessage,
                getXXGridParams().queryArgs
            )
            closeDialog()
        }

        function postFetchMethod(ret: any) {
            if (ret) {
                meta.current.balances['opBal'] = ret?.jsonResult?.opBal || {
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
                const bankRecon: any[] = ret.jsonResult.bankRecon

                let opDebit = 0,
                    opCredit = 0
                if (meta.current.balances['opBal']?.amount > 0) {
                    if (meta.current.balances['opBal']?.dc === 'D') {
                        opDebit = meta.current.balances['opBal']?.amount
                    } else {
                        opCredit = meta.current.balances['opBal']?.amount
                    }
                }
                const finYearObject = getFromBag('finYearObject')
                bankRecon.unshift({
                    //add at begining
                    lineRemarks: 'Opening balance',
                    autoRefNo: 'Opening balance',
                    tranDate: finYearObject.isoStartDate,
                    clearDate: finYearObject.isoStartDate,
                    debit: opDebit,
                    credit: opCredit,
                })
                // meta.current.reconData =
                //     bankRecon && utilFunc().computeBalance(bankRecon)
                ret.jsonResult.bankRecon =
                    bankRecon && utilFunc().computeBalance(bankRecon)
                meta.current.initialData = JSON.parse(
                    JSON.stringify(meta.current.reconData)
                )
                meta.current.initialDataHash = hash(meta.current.reconData)
                // setUniqueIds()
                // emit(
                //     getXXGridParams().gridActionMessages
                //         .justRefreshIbukiMessage,
                //     null
                // )
            }
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
                    isoStartDate: finYearObject.isoStartDate,
                    isoEndDate: finYearObject.isoEndDate,
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
                const bankRecon: any[] = ret.jsonResult.bankRecon || []

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
                    tranDate: finYearObject.isoStartDate,
                    clearDate: finYearObject.isoStartDate,
                    debit: opDebit,
                    credit: opCredit,
                })
                meta.current.reconData =
                    bankRecon && utilFunc().computeBalance(bankRecon)
                meta.current.initialData = JSON.parse(
                    JSON.stringify(meta.current.reconData)
                )
                meta.current.initialDataHash = hash(meta.current.reconData)
                setUniqueIds()
                emit(
                    getXXGridParams().gridActionMessages
                        .justRefreshIbukiMessage,
                    null
                )
            }
            emit('SHOW-LOADING-INDICATOR', false)
            meta.current.isMounted && setRefresh({})

            function setUniqueIds() {
                let i = 1
                function incr() {
                    return i++
                }
                meta.current.reconData = meta.current.reconData.map(
                    (x: any) => {
                        // if (!x.isDailySummary) {
                        if (!x['id1']) {
                            x['id1'] = x.id
                        }
                        // }
                        x.id = incr()
                        return x
                    }
                )
            }
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

        async function onSelectBankClick() {
            await getAllBanks()
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
            postFetchMethod,
            submitOpBal,
            onSelectBankClick,
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
            // height: 'calc(100vh - 200px)',
            width: '100%',
            height: '100%',
            marginTop: theme.spacing(1),
            // display:'flex',
            '& .header': {
                display: 'flex',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                rowGap: theme.spacing(0.5),
                '& .bank': {
                    display: 'flex',
                    alignItems: 'center',
                    columnGap: theme.spacing(1),
                },
                '& .all-buttons': {
                    display: 'flex',
                    columnGap: theme.spacing(1),
                    rowGap: theme.spacing(0.5),
                    flexWrap: 'wrap',
                    '& .refresh': {
                        backgroundColor: 'dodgerBlue',
                        color: theme.palette.primary.contrastText,
                    },
                },
            },
            '& .xx-grid': {
                marginTop: theme.spacing(2),
                // minHeight:'80vh',
                height: 'calc(100vh - 265px)',
            },
        },
        // selectedBank: {
        //     marginLeft: theme.spacing(1),
        //     maxWidth: '17rem',
        // },
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

        // refresh: {
        //     backgroundColor: theme.palette.info.main,
        //     color: theme.palette.primary.contrastText,
        // },
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

// const bankRecon = bankRec.map((item) => {
//     //date format change
//     item.tranDate = moment(item.tranDate).format(dateFormat)
//     item.clearDate = item.clearDate
//         ? moment(item.clearDate).format(dateFormat)
//         : ''
//     return item
// })
// {/* <DataTable
//                 style={{ marginTop: '1rem', fontSize: '0.8rem' }}
//                 value={meta.current.reconData}
//                 scrollable={true}
//                 selectionMode="multiple"
//                 selection={selectedItems}
//                 onSelectionChange={(e) => setSelectedItems(e.value)}
//                 scrollHeight="calc(100vh - 20rem)">
//                 <PrimeColumn
//                     selectionMode="multiple"
//                     style={{ width: '3rem', textAlign: 'center' }}
//                 />
//                 {/* id */}
//                 <PrimeColumn
//                     style={{ width: '4rem', textAlign: 'left' }}
//                     field="id"
//                     header="Id"></PrimeColumn>

//                 {/* tran Date */}
//                 <PrimeColumn
//                     header="Tran date"
//                     style={{ width: '7rem', textAlign: 'left' }}
//                     field={'tranDate'}></PrimeColumn>

//                 {/* instr no  */}
//                 <PrimeColumn
//                     style={{
//                         width: '7rem',
//                         textAlign: 'left',
//                         wordWrap: 'break-word',
//                     }}
//                     field="instrNo"
//                     header="Instr no"></PrimeColumn>

//                 {/* clear date ------------------------------------  */}
//                 <PrimeColumn
//                     editor={utilFunc().clearDateEditor}
//                     style={{
//                         height: '2rem',
//                         fontSize: '0.8rem',
//                         width: '7.0rem',
//                         textAlign: 'left',
//                         backgroundColor: theme.palette.yellow.light,
//                         color: theme.palette.getContrastText(theme.palette.yellow.light),
//                     }}
//                     field="clearDate"
//                     header="Clear date"></PrimeColumn>

//                 {/* debit */}
//                 <PrimeColumn
//                     style={{ width: '8rem', textAlign: 'right' }}
//                     body={(node: any) => toDecimalFormat(node.debit)}
//                     header="Debit"></PrimeColumn>

//                 {/* credit */}
//                 <PrimeColumn
//                     style={{ width: '8rem', textAlign: 'right' }}
//                     body={(node: any) => toDecimalFormat(node.credit)}
//                     header="Credit"></PrimeColumn>

//                 {/* balance  */}
//                 <PrimeColumn
//                     style={{ width: '8rem', textAlign: 'right' }}
//                     body={(node: any) => toDecimalFormat(node.balance)}
//                     header="Balance"></PrimeColumn>

//                 {/* autoRefNo */}
//                 <PrimeColumn
//                     style={{
//                         overflow: 'hidden',
//                         textAlign: 'left',
//                         width: '10rem',
//                     }}
//                     field="autoRefNo"
//                     header="Auto ref no"></PrimeColumn>

//                 {/* clear remarks ----------------------------------------*/}
//                 <PrimeColumn
//                     editor={utilFunc().clearRemarksEditor}
//                     style={{
//                         textAlign: 'left',
//                         backgroundColor: theme.palette.yellow.light,
//                         color: theme.palette.getContrastText(theme.palette.yellow.light),
//                         width: '15rem',
//                     }}
//                     field="clearRemarks"
//                     header="Clear remarks"></PrimeColumn>

//                 {/* Account name */}
//                 <PrimeColumn
//                     style={{ width: '8rem', textAlign: 'left' }}
//                     field="accNames"
//                     header="Accounts"></PrimeColumn>

//                 {/* line ref no */}
//                 <PrimeColumn
//                     style={{ textAlign: 'left', width: '10rem' }}
//                     field="lineRefNo"
//                     header="Line ref no"></PrimeColumn>

//                 {/* line remarks */}
//                 <PrimeColumn
//                     style={{ textAlign: 'left', width: '15rem' }}
//                     field="lineRemarks"
//                     header="Line remarks"></PrimeColumn>
//             </DataTable> } */}
