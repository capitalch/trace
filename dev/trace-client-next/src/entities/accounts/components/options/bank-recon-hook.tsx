import {
    _,
    hash,
    moment,
    NumberFormat,
    useEffect,
    useRef,
    useState,
} from '../../../../imports/regular-imports'
import { CloseSharp } from '../../../../imports/icons-import'
import {
    Box,
    Button,
    IconButton,
    Input,
    List,
    ListItem,
    ListItemText,
    makeStyles,
    NativeSelect,
    Theme,
    Typography,
    createStyles,
    useTheme,
} from '../../../../imports/gui-imports'
import { useSharedElements } from '../common/shared-elements-hook'
import { ThemeConsumer } from 'styled-components'

function useBankRecon() {
    const [, setRefresh] = useState({})
    const {
        accountsMessages,
        confirm,
        emit,
        execGenericView,
        filterOn,
        genericUpdateMaster,
        getCurrentEntity,
        getFromBag,
        isGoodToDelete,
        manageFormsState,
        messages,
        toDecimalFormat,
        genericUpdateMasterNoForm,
    } = useSharedElements()

    const { resetForm, resetAllFormErrors } = manageFormsState()

    const isoDateFormat = 'YYYY-MM-DD'
    const dateFormat = getFromBag('dateFormat')
    const classes = useStyles()
    const meta: any = useRef({
        isMounted: false,
        selectedBank: 'Select a bank account',
        allBanks: [],
        selectedBankId: '',
        selectedBankName: 'Select a bank',
        initialDataHash: '',
        initialData: [],
        sharedData: {},
        showDialog: false,
        dialogConfig: {
            title: '',
            formId: '',
            bankOpBalId: '',
            actions: () => { },
            content: () => <></>,
        },
    })
    const pre = meta.current
    const dialogConfig = meta.current.dialogConfig

    useEffect(() => {
        const curr = meta.current
        curr.isMounted = true
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
            curr.isMounted = false
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
                })
                .catch(() => { }) // important to have otherwise eror
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
                width: 120,
            },
            {
                headerName: 'Clear date',
                width: 180,
                field: 'clearDate',
                editable: true,
                description: 'Double click to edit clear date',
                cellClassName: (params: any) =>
                    params.row.isDataChanged
                        ? 'data-changed'
                        : 'editable-column',
                renderEditCell: (params: any) => <ClearDate params={params} />,
                valueFormatter: (params: any) => {
                    return params.value
                        ? moment(params.value).format(dateFormat) || ''
                        : ''
                },
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
                valueFormatter: (params: any) => {
                    let ret
                    if (params.value) {
                        ret = toDecimalFormat(
                            String(Math.abs(params.value))
                        ).concat(' ', params.value < 0 ? 'Cr' : 'Dr')
                    } else {
                        ret = ''
                    }
                    return ret
                },
            },
            {
                headerName: 'Clear Remarks',
                description: 'Double click to edit clear remarks',
                field: 'clearRemarks',
                type: 'string',
                cellClassName: (params: any) =>
                    params.row.isDataChanged
                        ? 'data-changed'
                        : 'editable-column',
                width: 170,
                editable: true,

                renderEditCell: (params: any) => {
                    return (
                        <Input
                            value={params.row.clearRemarks}
                            style={{ paddingLeft: '0.5rem' }}
                            onFocus={(e: any) => e.target.select()}
                            onChange={(e: any) => {
                                const value = e.target.value
                                const filteredRows: any[] =
                                    meta.current.sharedData.filteredRows
                                const row = params.row
                                const idx = filteredRows.findIndex(
                                    (x: any) => x.id === row.id
                                )
                                if (filteredRows[idx].clearRemarks !== value) {
                                    filteredRows[idx].clearRemarks = value
                                    params.row.isDataChanged = true
                                }
                                row.clearRemarks = value
                                const apiRef = pre.sharedData.apiRef
                                apiRef.current.setEditCellValue({
                                    id: params.row.id,
                                    field: 'clearRemarks',
                                    value: value,
                                })
                            }}
                        />
                    )
                },
            },
            {
                headerName: 'Accounts',
                description: 'Accounts',
                field: 'accNames',
                type: 'string',
                width: 150,
            },
            {
                headerName: 'Remarks',
                description: 'Remarks',
                field: 'remarks',
                type: 'string',
                width: 150,
            },
            {
                headerName: 'Line ref',
                description: 'Line Ref no',
                field: 'lineRefNo',
                type: 'string',
                width: 150,
            },
            {
                headerName: 'Line remarks',
                description: 'Line remarks',
                field: 'lineRemarks',
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

    function ClearDate({ params }: any) {
        const [, setRefresh] = useState({})
        const theme = useTheme()
        return (<Input
            type='date'
            sx={{ fontSize: theme.spacing(1.8) }}
            value={params.row.clearDate || ''}
            onKeyDown={(e: any) => {
                e.preventDefault() // disable edit from keyboard, it introduces error
            }}
            onChange={setValue}
            startAdornment={
                <IconButton
                    size="small"
                    onClick={(e: any) => {
                        // meta.current.crossClicked = true
                        setValue(null, '')
                    }}>
                    {<CloseSharp></CloseSharp>}
                </IconButton>
            }
        />)

        function setValue(e: any, val: any = null) {
            let value
            e ? (value = e.target.value) : (value = val)
            const id1 = params.row.id1
            params.row.isDataChanged = true
            const changedRow = pre.sharedData.filteredRows.find((x: any) => (x.id1 === id1))
            changedRow.clearDate = value || null
            changedRow.isDataChanged = true
            // params.row.clearDate = value ||''
            const apiRef = pre.sharedData.apiRef
            apiRef.current.setEditCellValue({
                id: params.row.id,
                field: 'clearDate',
                value: value,
            })
            setRefresh({})
        }
    }

    function handleCellClicked(params: any) {
        if (['clearDate', 'clearRemarks'].includes(params.field) && (params.cellMode === 'view')) {
            const apiRef: any = pre.sharedData.apiRef
            apiRef.current.startCellEditMode({ id: params.id, field: params.field })
        }
    }

    async function handleOnSelectBankClick() {
        await getAllBanks()
        meta.current.dialogConfig.title = 'Select a bank'
        meta.current.dialogConfig.content = BanksListItems
        meta.current.dialogConfig.actions = () => { }
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
                        button>
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
        dialogConfig.content = OpeningBalanceContent
        dialogConfig.actions = () => { }
        meta.current.showDialog = true
        pre.isMounted && setRefresh({})

        function OpeningBalanceContent() {
            const [opBalance, setOpBalance] = useState(0.0)
            const [drCr, setDrCr] = useState('C')
            const [opBalId, setOpBalId] = useState(undefined)

            useEffect(() => {
                doFetch()
            }, [])

            return (
                <div className={classes.dialogContent}>
                    <div className="items">
                        <NumberFormat
                            allowNegative={false}
                            className="numeric"
                            customInput={Input}
                            decimalScale={2}
                            fixedDecimalScale={true}
                            onFocus={(e: any) => {
                                e.target.select()
                            }}
                            onValueChange={(values: any) => {
                                const { floatValue } = values
                                setOpBalance(floatValue)
                            }}
                            thousandSeparator={true}
                            value={opBalance || 0.0}
                        />
                        <NativeSelect
                            onChange={(e: any) => setDrCr(e.target.value)}
                            style={{ width: '5rem' }}
                            value={drCr || 'C'}>
                            <option value="C">Credit</option>
                            <option value="D">Debit</option>
                        </NativeSelect>
                    </div>
                    <Button
                        variant="contained"
                        color="secondary"
                        size="small"
                        onClick={doSubmit}
                        className="submit">
                        Submit
                    </Button>
                </div>
            )

            async function doFetch() {
                emit('SHOW-LOADING-INDICATOR', true)
                let ret: any = await execGenericView({
                    isMultipleRows: false,
                    sqlKey: 'get_bank_op_balance',
                    args: {
                        accId: pre.selectedBankId,
                        finYearId: getFromBag('finYearObject')?.finYearId,
                    },
                    entityName: getCurrentEntity(),
                })
                emit('SHOW-LOADING-INDICATOR', false)
                if (ret && !_.isEmpty(ret)) {
                    setOpBalance(ret.amount)
                    setDrCr(ret.dc)
                    setOpBalId(ret.id)
                }
            }

            async function doSubmit() {
                try {
                    await genericUpdateMasterNoForm({
                        tableName: 'BankOpBal',
                        data: {
                            id: opBalId,
                            accId: pre.selectedBankId,
                            finYearId: getFromBag('finYearObject')?.finYearId,
                            amount: opBalance,
                            dc: drCr,
                        },
                    })
                    emit(
                        getXXGridParams().gridActionMessages.fetchIbukiMessage,
                        null
                    )
                    handleCloseDialog()
                } catch (e: any) {
                    console.log(e.message)
                    emit('SHOW-MESSAGE', {
                        message: messages['errorInOperation'],
                        severity: 'error',
                        duration: null,
                    })
                }
            }
        }
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

    async function submitBankRecon() {
        const diffs = getDiff()
        if (diffs && (diffs.length > 0)) {
            emit('SHOW-LOADING-INDICATOR', true)
            const sqlObject = {
                tableName: 'ExtBankReconTranD',
                data: diffs,
            }
            const ret = await genericUpdateMasterNoForm(sqlObject)
            if (ret) {
                emit(
                    getXXGridParams().gridActionMessages.fetchIbukiMessage,
                    null
                )
            } else {
                emit('SHOW-MESSAGE', {
                    severity: 'error',
                    message: messages['errorInOperation'],
                    duration: null,
                })
            }
            emit('SHOW-LOADING-INDICATOR', false)
        }

        function getDiff() {
            const changedData: any[] =
                meta.current.sharedData.filteredRows.filter(
                    (item: any) => item.isDataChanged
                )
            const diffObjs: any[] = changedData.map((item: any) => {
                const it = {
                    clearDate: item.clearDate || null,
                    clearRemarks: item.clearRemarks,
                    tranDetailsId: item.tranDetailsId,
                    id: item.bankReconId,
                }
                if (!it.id) {
                    delete it.id
                }
                return it
            })
            return diffObjs
        }
    }

    return {
        doSortOnClearDateTranDateAndId,
        getXXGridParams,
        handleCellClicked,
        handleCloseDialog,
        handleOnSelectBankClick,
        handleOpBalanceButtonClick,
        // getChangedData,
        isDataNotChanged,
        meta,
        setRefresh,
        submitBankRecon,
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
                '& .data-changed': {
                    backgroundColor: theme.palette.orange.main,
                    color: theme.palette.orange.contrastText,
                },
            },
        },
        dialogContent: {
            display: 'flex',
            flexDirection: 'column',
            rowGap: theme.spacing(1),
            '& .items': {
                display: 'flex',
                columnGap: theme.spacing(1),
                justifyContent: 'space-between',
                '& .numeric': {
                    width: '10rem',
                    '& input': {
                        textAlign: 'end',
                    },
                },
            },
            '& .submit': {
                width: '5rem',
                marginLeft: 'auto',
                marginRight: 'auto',
            },
        },
    })
)

export { useStyles }

// (params: any) => {
//     // if (!params.row.clearDate) {
//     //     if (meta.current.crossClicked) {
//     //         meta.current.crossClicked = false
//     //     } else {
//     //         if (!params.row.isDataChanged) {
//     //             setValue(null, params.row.tranDate)
//     //         }
//     //     }
//     // }
//     if(!params.row.clearDate){
//         if(!params.row.isDataChanged){
//             setValue(null, params.row.tranDate)
//         }
//     }
//     return (
//         <Input
//             type="date"
//             style={{ fontSize: '0.8rem' }}
//             value={params.row.clearDate  || ''}
            // onKeyDown={(e: any) => {
            //     e.preventDefault() // disable edit from keyboard, it introduces error
            // }}
//             onChange={setValue}
            // startAdornment={
            //     <IconButton
            //         size="small"
            //         onClick={(e: any) => {
            //             // meta.current.crossClicked = true
            //             setValue(null, '')
            //         }}>
            //         {<CloseSharp></CloseSharp>}
            //     </IconButton>
            // }
//         />
//     )
    // function setValue(e: any, val: any = null) {
    //     let value
    //     e ? (value = e.target.value) : (value = val)
    //     const id1 = params.row.id1
    //     params.row.isDataChanged = true
    //     const changedRow = pre.sharedData.filteredRows.find((x: any) => (x.id1 === id1))
    //     changedRow.clearDate = value || null
    //     changedRow.isDataChanged = true
    //     // params.row.clearDate = value ||''
    //     const apiRef = pre.sharedData.apiRef
    //     apiRef.current.setEditCellValue({
    //         id: params.row.id,
    //         field: 'clearDate',
    //         value: value,
    //     })
    //     setRefresh({})
    // }
// }