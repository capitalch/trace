import {
    _,
    hash,
    InputMask,
    InputText,
    moment,
    NumberFormat,
    PrimeInputMask,
    useEffect,
    useRef,
    useState,
} from '../../../../imports/regular-imports'
import { componentStore } from '../../../../imports/trace-imports'
import { utilMethods } from '../../../../global-utils/misc-utils'
import {
    Box,
    Button,
    Input,
    List,
    ListItem,
    ListItemText,
    makeStyles,
    NativeSelect,
    Select,
    TextField,
    Theme,
    createStyles,
} from '../../../../imports/gui-imports'
import { useSharedElements } from '../common/shared-elements-hook'
import { classNames } from 'react-select/dist/declarations/src/utils'

function useBankRecon() {
    const [, setRefresh] = useState({})
    const {
        accountsMessages,
        confirm,
        emit,
        extractAmount,
        execGenericView,
        filterOn,
        genericUpdateMaster,
        getCurrentEntity,
        getFromBag,
        isGoodToDelete,
        manageFormsState,
        messages,
        ReactForm,
        toDecimalFormat,
        TraceDialog,
        TraceFullWidthSubmitButton,
        useTraceGlobal,
        XXGrid,
    } = useSharedElements()

    const {
        resetForm,
        resetAllFormErrors,
        getValidationFabric,
        getFormData,
        clearServerError,
    } = manageFormsState()
    const { doValidateForm, isValidForm } = getValidationFabric()
    const {
        saveForm,
        genericUpdateMasterNoForm,
        getDateMaskMap,
        isControlDisabled,
    } = utilMethods()

    const isoDateFormat = 'YYYY-MM-DD'
    const dateFormat = getFromBag('dateFormat')

    const meta: any = useRef({
        isMounted: false,
        selectedBank: 'Select a bank account',
        allBanks: [],
        // reconData: [],
        selectedBankId: '',
        selectedBankName: 'Select a bank',
        // balances: {},
        initialDataHash: '',
        initialData: [],
        // headerConfig: {
        //     flexDirection: '',
        //     alignItems: '',
        //     chipSize: '',
        //     buttonSize: '',
        //     buttonTopMargin: '',
        //     buttonRightMargin: '',
        //     textVariant: '',
        //     isBbuttonsIcon: false,
        //     windowWidth: '',
        // },
        showDialog: false,
        dialogConfig: {
            title: '',
            formId: '',
            bankOpBalId: '',
            // dialogActions: <></>,
            actions: () => {},
            content: () => <></>,
            // dialogContent: <></>,
        },
    })
    const pre = meta.current
    // const headerConfig = meta.current.headerConfig
    const dialogConfig = meta.current.dialogConfig
    // const classes = useStyles({ headerConfig: headerConfig })
    const { getCurrentMediaSize, getCurrentWindowSize } = useTraceGlobal()

    useEffect(() => {
        meta.current.isMounted = true
        const subs1 = filterOn('ROOT-WINDOW-REFRESH').subscribe(() => {
            emit(
                getXXGridParams().gridActionMessages.fetchIbukiMessage,
                getXXGridParams().queryArgs
            )
        })
        const subs2 = filterOn(
            getXXGridParams().gridActionMessages.deleteIbukiMessage
        ).subscribe((d: any) => {
            doDelete(d.data)
        })
        return () => {
            subs1.unsubscribe()
            subs2.unsubscribe()
            meta.current.isMounted = false
        }
    }, [])

    async function doDelete(params: any) {
        const row = params.row
        const tranHeaderId = row['id1']
        const options = {
            description: accountsMessages.transactionDelete,
            confirmationText: 'Yes',
            cancellationText: 'No',
        }
        if (isGoodToDelete(params)) {
            confirm(options)
                .then(async () => {
                    await genericUpdateMaster({
                        deletedIds: [tranHeaderId],
                        tableName: 'TranH',
                    })
                    emit('SHOW-MESSAGE', {})
                    emit(
                        getXXGridParams().gridActionMessages.fetchIbukiMessage,
                        null
                    )
                    // setRefresh({})
                })
                .catch(() => {}) // important to have otherwise eror
        }
    }

    function handleCloseDialog() {
        const dialogConfig = pre.dialogConfig
        pre.showDialog = false
        pre.isMounted && resetForm(dialogConfig.formId)
        meta.current.isMounted && resetAllFormErrors(dialogConfig.formId)
        meta.current.isMounted && setRefresh({})
    }

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
                headerName: 'Tr date',
                description: 'Date',
                field: 'tranDate',
                width: 120,
                type: 'date',
                valueFormatter: (params: any) =>
                    moment(params.value, isoDateFormat).format(dateFormat),
            },
            {
                headerName: 'Auto ref no',
                description: 'Auto ref no',
                field: 'autoRefNo',
                type: 'string',
                width: 150,
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
                cellClassName: 'editable-column',
                // renderEditCell: utilFunc().dateEditor,
                valueGetter: (params: any) =>
                    params.value
                        ? moment(params.value).format(isoDateFormat)
                        : '',
                valueSetter: (params: any) =>
                    params.value
                        ? moment(params.value).format(isoDateFormat)
                        : '',
                valueFormatter: (params: any) =>
                    params.value ? moment(params.value).format(dateFormat) : '',
                // valueGetter: (params: any) => params.value ? moment(params.value).format(isoDateFormat) : '',
                // valueSetter: (params: any) => params.value ? moment(params.value).format(isoDateFormat) : '',
                // valueFormatter: (params: any) =>
                //     params.value ? moment(params.value).format(dateFormat) : '',
            },
            {
                headerName: 'Debit',
                description: 'Debit',
                field: 'debit',
                type: 'number',
                width: 150,
                valueFormatter: (params: any) =>
                    toDecimalFormat(String(Math.abs(params.value))),
            },
            {
                headerName: 'Credit',
                description: 'Credit',
                field: 'credit',
                type: 'number',
                width: 150,
                valueFormatter: (params: any) =>
                    toDecimalFormat(String(Math.abs(params.value))),
            },
            {
                headerName: 'Balance',
                description: 'Balance',
                field: 'balance',
                type: 'number',
                width: 170,
                valueFormatter: (params: any) =>
                    toDecimalFormat(String(Math.abs(params.value))).concat(
                        ' ',
                        params.value < 0 ? 'Cr' : 'Dr'
                    ),
            },
            {
                headerName: 'Clear Remarks',
                description: 'remarks',
                field: 'remarks',
                type: 'string',
                cellClassName: 'editable-column',
                width: 170,
                editable: true,
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
            // editIbukiMessage: 'BANK-RECON-XX-GRID-EDIT-CLICKED',
            editIbukiMessage: 'ACCOUNTS-LEDGER-DIALOG-XX-GRID-EDIT-CLICKED',
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

    async function handleOnSelectBankClick() {
        await getAllBanks()
        meta.current.dialogConfig.title = 'Select a bank'
        meta.current.dialogConfig.content = BanksListItems
        meta.current.dialogConfig.actions = () => {}
        meta.current.showDialog = true
        meta.current.isMounted && setRefresh({})

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

        function BanksListItems() {
            const listItems = meta.current.allBanks.map((item: any) => {
                return (
                    <ListItem
                        key={item.id}
                        onClick={() => bankSelected(item)}
                        selected
                        button
                        // className={classes.listItem}
                    >
                        <ListItemText primary={item.accName}></ListItemText>
                    </ListItem>
                )
            })
            return (
                <List component="nav" dense>
                    {listItems}
                </List>
            )

            function bankSelected(item: any) {
                meta.current.selectedBankName = item.accName
                meta.current.selectedBankId = item.id
                emit(
                    getXXGridParams().gridActionMessages.fetchIbukiMessage,
                    getXXGridParams().queryArgs
                )
                handleCloseDialog()
            }
        }
    }

    function handleOpBalanceButtonClick() {
        dialogConfig.title = `Opening balance for ${pre.selectedBankName}`
        dialogConfig.content = OpeningBalanceContent //OpBalanceDialogContent()
        dialogConfig.actions = () => {} //  submitOpBal

        function OpeningBalanceContent() {
            const [opBalance, setOpBalance] = useState(0)
            const [drCr, setDrCr] = useState('C')
            return (
                <div
                    style={{
                        display: 'flex',
                        // flexDirection: 'column',
                        rowGap: '1rem',
                        flexWrap: 'wrap',
                    }}>
                    <NumberFormat
                        allowNegative={false}
                        label="Opening balance"
                        style={{width: '10rem'}}
                        // inputProps={{
                        //     label:'hjhjhj',
                        //     placeholder:'Opening balance',
                        //     width:'6rem'
                        // }}
                        // {...{ label: 'Opening balance' }}
                        customInput={Input}
                        decimalScale={2}
                        fixedDecimalScale={true}
                        onFocus={(e: any) => {
                            e.target.select()
                        }}
                        thousandSeparator={true}
                        value={opBalance || 0.0}
                    />
                    {/* <Input
                        placeholder="Opening balance"
                        style={{ maxWidth: '16ch', width: '12ch' }}
                        type="number"
                    /> */}

                    <NativeSelect
                        onChange={(e: any) => setDrCr(e.target.value)}
                        style={{ width: '5rem', marginLeft: '1rem' }}
                        value={drCr || 'C'}>
                        <option value="C">Credit</option>
                        <option value="D">Debit</option>
                    </NativeSelect>
                    
                    {/* </div> */}

                    <Button
                        variant="contained"
                        color="secondary"
                        size="small"
                        style={{ marginLeft: '1rem' }}>
                        Submit
                    </Button>
                </div>
            )
        }

        //  (
        //     <TraceFullWidthSubmitButton
        //         onClick={() => submitOpBal()}></TraceFullWidthSubmitButton>
        // )
        meta.current.showDialog = true
        meta.current.isMounted && setRefresh({})

        function OpBalanceDialogContent() {
            return (
                <ReactForm
                    formId={dialogConfig.formId}
                    jsonText={JSON.stringify(bankOpeningBalanceJson)}
                    name={getCurrentEntity()}
                    componentStore={componentStore}
                />
            )
        }

        async function submitOpBal() {
            // const formId = dialogConfig.formId
            // clearServerError(formId)
            // await doValidateForm(formId)
            // if (isValidForm(formId)) {
            //     let data = getFormData(formId)
            //     data.amount = extractAmount(data.amount)
            //     data.accId = meta.current.selectedBankId
            //     data.finYearId = getFromBag('finYearObject')?.finYearId
            //     data.id = meta.current.dialogConfig.bankOpBalId || undefined
            //     const finalData: any = {}
            //     finalData.tableName = 'BankOpBal'
            //     finalData.data = { ...data }
            //     saveForm({
            //         data: finalData,
            //         formId: formId,
            //         queryId: 'genericUpdateMaster',
            //         afterMethod: () => {
            //             utilFunc().closeDialog()
            //             // fetchBankRecon()
            //         },
            //         formRefresh: false,
            //     })
            // }
        }
    }

    function getChangedData() {
        const data1 = _.orderBy(meta.current.initialData, [(item) => item.id])
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

    function isDataNotChanged() {
        const hash1 =
            meta.current.reconData?.length > 0
                ? hash(meta.current.reconData)
                : ''
        const ret = meta.current.initialDataHash === hash1 ? true : false
        return ret
    }

    function doSortOnClearDateTranDateAndId(pre: any) {
        let rows: any[] = [...pre.filteredRows]
        rows = _.orderBy(rows, [
            (item: any) =>
                item.clearDate ? moment(item.clearDate) : moment('9999-01-01'),
            (item: any) =>
                item.tranDate ? moment(item.tranDate) : moment('9999-01-01'),
            'id',
        ])
        pre.isReverseOrder && rows.reverse()
        pre.filteredRows = rows
    }

    function utilFunc() {
        // function clearDateEditor(props: any) {
        //     const field = 'clearDate'
        //     const maskMap: any = getDateMaskMap()
        //     return (
        //         <InputMask
        //             style={{
        //                 height: '1.2rem',
        //                 fontSize: '0.8rem',
        //                 width: '6rem',
        //             }}
        //             mask={maskMap[dateFormat]}
        //             placeholder={dateFormat}
        //             value={props.rowData[field] || props.rowData['tranDate']}
        //             onFocus={(e: any) => {
        //                 props.rowData[field] =
        //                     props.rowData[field] || props.rowData['tranDate']
        //                 meta.current.isMounted && setRefresh({})
        //             }}
        //             onKeyDown={(e) => {
        //                 if (e.key === 'Escape') {
        //                     props.rowData[field] = null
        //                     meta.current.isMounted && setRefresh({})
        //                 }
        //             }}
        //             onChange={(e) => {
        //                 props.rowData[field] = e.target.value
        //                 meta.current.isMounted && setRefresh({})
        //             }}></InputMask>
        //     )
        // }

        // function clearRemarksEditor(props: any) {
        //     const field = 'clearRemarks'
        //     return (
        //         <InputText
        //             style={{ height: '1.2rem', fontSize: '0.8rem' }}
        //             value={props.rowData[field] || ''}
        //             onChange={(e: any) => {
        //                 props.rowData[field] = e.target.value || null
        //                 meta.current.isMounted && setRefresh({})
        //             }}></InputText>
        //     )
        // }

        // function closeDialog() {
        //     meta.current.showDialog = false
        //     meta.current.isMounted && resetForm(dialogConfig.formId)
        //     meta.current.isMounted && resetAllFormErrors(dialogConfig.formId)
        //     meta.current.isMounted && setRefresh({})
        // }

        // function computeBalance(itemArray: any[] = meta.current.reconData) {
        //     const orderedItemArray = _.orderBy(itemArray, [
        //         (item) =>
        //             moment(
        //                 item.clearDate ? item.clearDate : '30/12/9999',
        //                 dateFormat
        //             ),
        //         (item) => moment(item.tranDate, dateFormat),
        //         (item) => item.id,
        //     ])
        //     orderedItemArray?.reduce(
        //         (prev: any, item: any, index: number) => {
        //             item.clearDate = item.clearDate || null
        //             const bal = prev.opBal + item.debit - item.credit
        //             item.balance = toDecimalFormat(
        //                 String(Math.abs(bal))
        //             ).concat(' ', bal < 0 ? 'Cr' : 'Dr')
        //             return { opBal: bal }
        //         },
        //         { opBal: 0 }
        //     )

        //     return orderedItemArray?.reverse()
        // }

        // async function submitBankRecon() {
        //     emit('SHOW-LOADING-INDICATOR', true)
        //     const diffObj: any[] = utilFunc().getDataDiff()
        //     // correct the clearDate format to iso date
        //     const diff: any[] = diffObj.map((x) => {
        //         x.clearDate = x.clearDate
        //             ? moment(x.clearDate, dateFormat).format(isoDateFormat)
        //             : null
        //         return x
        //     })
        //     const sqlObject = {
        //         tableName: 'ExtBankReconTranD',
        //         data: diff,
        //     }
        //     const ret = await genericUpdateMasterNoForm(sqlObject)
        //     if (ret) {
        //         // meta.current.reconData = utilFunc().computeBalance()
        //         meta.current.initialData = JSON.parse(
        //             JSON.stringify(meta.current.reconData)
        //         )
        //         meta.current.initialDataHash = hash(meta.current.initialData)
        //         // fetchBankRecon()
        //     } else {
        //         emit('SHOW-MESSAGE', {
        //             severity: 'error',
        //             message: messages['errorInOperation'],
        //             duration: null,
        //         })
        //     }
        //     emit('SHOW-LOADING-INDICATOR', false)
        //     meta.current.isMounted && setRefresh({})
        // }

        return {
            // computeBalance,
            // getDataNotChanged,
            // isDataChanged,
            // closeDialog,
            // doSortOnClearDateTranDateAndId,
            // submitBankRecon,
            // clearDateEditor,
            // clearRemarksEditor,
            // handleOpBalanceButtonClick,
        }
    }

    return {
        doSortOnClearDateTranDateAndId,
        getXXGridParams,
        handleCloseDialog,
        handleOnSelectBankClick,
        handleOpBalanceButtonClick,
        getChangedData,
        isDataNotChanged,
        meta,
        setRefresh,
        utilFunc,
    }
}

export { useBankRecon }

const useStyles: any = makeStyles((theme: Theme) =>
    createStyles({
        content: {
            width: '100%',
            height: '100%',
            marginTop: theme.spacing(1),
            '& .header': {
                display: 'flex',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                rowGap: theme.spacing(1),
                '& .bank': {
                    display: 'flex',
                    alignItems: 'center',
                    columnGap: theme.spacing(1),
                },
                '& .all-buttons': {
                    display: 'flex',
                    columnGap: theme.spacing(1),
                    rowGap: theme.spacing(1),
                    flexWrap: 'wrap',
                    '& .refresh': {
                        backgroundColor: 'dodgerBlue',
                        color: theme.palette.primary.contrastText,
                    },
                },
            },

            '& .xx-grid': {
                marginTop: theme.spacing(2),
                height: 'calc(100vh - 265px)',
                '& .editable-column': {
                    backgroundColor: theme.palette.yellow.light,
                    color: theme.palette.yellow.contrastText,
                },
            },
        },
        // dialogContent: {
        //     maxHeight: '12rem',
        //     minWidth: '20rem',
        // },

        // dialogTitle: {
        //     display: 'flex',
        //     justifyContent: 'space-between',
        //     alignItems: 'center',
        //     paddingBottom: '0px',
        // },

        // dialogActions: {
        //     minHeight: theme.spacing(4),
        // },
    })
)

export { useStyles }

const bankOpeningBalanceJson: any = {
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
                    message: 'Please select',
                },
            ],
        },
    ],
}
