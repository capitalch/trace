import {
    Typography,
    Button,
    Chip,
    Avatar,
    Box,
} from '../../../../imports/gui-imports'
import {
    AccountBalance,
    FlipToFront,
    Cached,
    Save,
} from '../../../../imports/icons-import'
import { useSharedElements } from '../common/shared-elements-hook'
import { useBankRecon, useStyles } from './bank-recon-hook'

function BankRecon() {
    const { doSortOnClearDateTranDateAndId, getXXGridParams, handleCloseDialog,
        handleOnSelectBankClick, isDataNotChanged,
        handleOpBalanceButtonClick, meta, setRefresh } = useBankRecon()
    const {
        emit,
        isControlDisabled,
        TraceDialog,
        useTraceGlobal,
        XXGrid,
    } = useSharedElements()

    const classes = useStyles()
    const { getCurrentWindowSize } = useTraceGlobal()

    function handleDisabled() {
        let ret = false
        if (isControlDisabled('doBankRecon')) {
            ret = true
        } else {
            ret = isDataNotChanged()
        }
        return(ret)
    }

    const {
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
                        variant='subtitle1'
                        component="span">
                        Reconcillation for
                    </Typography>
                    <Chip
                        avatar={<Avatar>B</Avatar>}
                        label={meta.current.selectedBankName}
                        color="secondary"
                        onClick={handleOnSelectBankClick}
                        size='medium'></Chip>                        
                </Box>
                <Box component="div" className="all-buttons">
                    {/* Opening */}
                    <Button
                        size="medium"
                        variant="contained"
                        color="default"
                        startIcon={<AccountBalance></AccountBalance>}
                        disabled={!meta.current.selectedBankId}
                        onClick={handleOpBalanceButtonClick}>
                        Opening
                    </Button>

                    {/* rearrange */}
                    <Button
                        size="medium"
                        startIcon={<FlipToFront />}
                        onClick={async (e: any) => {
                            meta.current.testParams = {
                                name: '',
                            }
                            emit(
                                getXXGridParams().gridActionMessages
                                    .calculateBalanceIbukiMessage,
                                doSortOnClearDateTranDateAndId // passed in the sorting function
                            )
                            meta.current.isMounted && setRefresh({})
                        }}
                        variant="contained"
                        color="primary">
                        Rearrange
                    </Button>

                    {/* refresh */}
                    <Button
                        size="medium"
                        startIcon={<Cached></Cached>}
                        className="refresh"
                        onClick={(e: any) =>
                            emit(
                                getXXGridParams().gridActionMessages
                                    .fetchIbukiMessage,
                                getXXGridParams().queryArgs
                            )
                        }
                        variant="contained">
                        Refresh
                    </Button>

                    {/* submit */}
                    <Button
                        disabled={handleDisabled()}
                        color="secondary"
                        size="medium"
                        startIcon={<Save></Save>}
                        // onClick={utilFunc().submitBankRecon}
                        variant="contained">
                        Submit
                    </Button>
                </Box>
            </Box>
            <XXGrid
                className="xx-grid"
                gridActionMessages={gridActionMessages}
                columns={columns}
                editableFields={['clearDate', 'remarks']}
                hideViewLimit={true}
                isReverseOrderByDefault={true}
                isShowColBalanceByDefault={true}
                summaryColNames={summaryColNames}
                title={'Bank reconcillation'}
                sqlQueryId={queryId}
                sqlQueryArgs={queryArgs}
                jsonFieldPath="jsonResult.bankRecon"
                specialColumns={specialColumns}
                toShowOpeningBalance={true}
                toShowColumnBalanceCheckBox={false}
                toShowClosingBalance={true}
                toShowReverseCheckbox={false}
                viewLimit="1000"
            />
            <TraceDialog
                meta={meta}
                onClose={handleCloseDialog}
            />
        </div>
    )

}

export { BankRecon }




{/* <Dialog //material-ui dialog
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
            </Dialog> */}
// const mediaLogic: any = {
    //     xs: () => {
    //         headerConfig.flexDirection = 'column'
    //         headerConfig.alignItems = 'flex-start'
    //         headerConfig.chipSize = 'medium'
    //         headerConfig.buttonSize = 'medium'
    //         headerConfig.buttonTopMargin = '0.5rem'
    //         headerConfig.buttonRightMargin = '0px'
    //         headerConfig.textVariant = 'subtitle1'
    //         headerConfig.isButtonsIcon = false
    //         headerConfig.windowWidth = '100vw'
    //     },
    //     sm: () => {
    //         headerConfig.flexDirection = 'row'
    //         headerConfig.alignItems = 'center'
    //         headerConfig.flexWrap = 'wrap'
    //         headerConfig.chipSize = 'medium'
    //         headerConfig.buttonSize = 'medium'
    //         headerConfig.buttonTopMargin = '0px'
    //         headerConfig.buttonRightMargin = '0px'
    //         headerConfig.textVariant = 'subtitle1'
    //         headerConfig.isButtonsIcon = false
    //         headerConfig.windowWidth = '100vw'
    //     },
    //     md: () => {
    //         headerConfig.flexDirection = 'row'
    //         headerConfig.alignItems = 'center'
    //         headerConfig.chipSize = 'medium'
    //         headerConfig.buttonSize = 'medium'
    //         headerConfig.buttonTopMargin = '0px'
    //         headerConfig.buttonRightMargin = '0.2rem'
    //         headerConfig.textVariant = 'h6'
    //         headerConfig.isButtonsIcon = false
    //         headerConfig.windowWidth = 'calc(100vw - ( 260px + 55px ))' // 55px is used otherwise a horizontal scrollbar appears
    //     },
    //     lg: () => {
    //         headerConfig.flexDirection = 'row'
    //         headerConfig.alignItems = 'center'
    //         headerConfig.chipSize = 'medium'
    //         headerConfig.buttonSize = 'large'
    //         headerConfig.buttonTopMargin = '0px'
    //         headerConfig.buttonRightMargin = '1rem'
    //         headerConfig.textVariant = 'h6'
    //         headerConfig.isButtonsIcon = true
    //         headerConfig.windowWidth = 'calc(100vw - ( 260px + 55px ))' // 55px is used otherwise a horizontal scrollbar appears
    //     },
    //     xl: () => mediaLogic['lg'](),
    // }

    // const currentMediaSize = getCurrentMediaSize()
    // currentMediaSize && mediaLogic[currentMediaSize]()

        // function postFetchMethod(ret: any) {
        //     if (ret) {
        //         meta.current.balances['opBal'] = ret?.jsonResult?.opBal || {
        //             amount: 0,
        //             dc: 'D',
        //         }
        //         meta.current.dialogConfig.bankOpBalId =
        //             ret.jsonResult?.opBal?.id
        //         // set the values for opening balance update dialog
        //         bankOpeningBalanceJson.items[0].value =
        //             meta.current.balances['opBal'].amount
        //         bankOpeningBalanceJson.items[1].value = meta.current.balances['opBal'].dc
        //         meta.current.balances['closBal'] = ret.jsonResult.closBpBal || {
        //             amount: 0,
        //             dc: 'D',
        //         }
        //         const bankRecon: any[] = ret.jsonResult.bankRecon

        //         let opDebit = 0,
        //             opCredit = 0
        //         if (meta.current.balances['opBal']?.amount > 0) {
        //             if (meta.current.balances['opBal']?.dc === 'D') {
        //                 opDebit = meta.current.balances['opBal']?.amount
        //             } else {
        //                 opCredit = meta.current.balances['opBal']?.amount
        //             }
        //         }
        //         const finYearObject = getFromBag('finYearObject')
        //         bankRecon.unshift({
        //             //add at begining
        //             lineRemarks: 'Opening balance',
        //             autoRefNo: 'Opening balance',
        //             tranDate: finYearObject.isoStartDate,
        //             clearDate: finYearObject.isoStartDate,
        //             debit: opDebit,
        //             credit: opCredit,
        //         })
        //         ret.jsonResult.bankRecon =
        //             bankRecon && utilFunc().computeBalance(bankRecon)
        //         meta.current.initialData = JSON.parse(
        //             JSON.stringify(meta.current.reconData)
        //         )
        //         meta.current.initialDataHash = hash(meta.current.reconData)
        //     }
        // }

        // function dateEditor(props: any) {
        //     console.log(props)
        //     return (
        //         <TextField
        //             // error={isInvalidDate(arbitraryData.header.tranDate)}
        //             variant="standard"
        //             // helperText={
        //             //     isInvalidDate(arbitraryData.header.tranDate)
        //             //         ? accountsMessages.dateRangeAuditLockMessage
        //             //         : undefined
        //             // }
        //             type="date"
        //             onChange={(e: any) => {
        //                 props.row.clearDate = e.target.value
        //                 // arbitraryData.header.tranDate = e.target.value
        //                 // emit('CROWN-REFRESH', '')
        //                 setRefresh({})
        //             }}
        //             onFocus={(e) => e.target.select()}
        //             // value={arbitraryData.header.tranDate || ''}
        //             value={props.row.clearDate || ''}
        //         />
        //     )
        // }

        // async function fetchBankRecon() {
            //     const finYearObject = getFromBag('finYearObject')
            //     const nextFinYearId = finYearObject.finYearId + 1
            //     emit('SHOW-LOADING-INDICATOR', true)
            //     const ret = await execGenericView({
            //         sqlKey: 'getJson_bankRecon',
            //         isMultipleRows: false,
            //         args: {
            //             accId: meta.current.selectedBankId,
            //             nextFinYearId: nextFinYearId,
            //             isoStartDate: finYearObject.isoStartDate,
            //             isoEndDate: finYearObject.isoEndDate,
            //         },
            //     })
            //     if (ret) {
            //         meta.current.balances['opBal'] = ret.jsonResult.opBal || {
            //             amount: 0,
            //             dc: 'D',
            //         }
            //         meta.current.dialogConfig.bankOpBalId =
            //             ret.jsonResult?.opBal?.id
            //         // set the values for opening balance update dialog
            //         bankOpeningBalanceJson.items[0].value =
            //             meta.current.balances['opBal'].amount
            //         bankOpeningBalanceJson.items[1].value = meta.current.balances['opBal'].dc
            //         meta.current.balances['closBal'] = ret.jsonResult.closBpBal || {
            //             amount: 0,
            //             dc: 'D',
            //         }
            //         const bankRecon: any[] = ret.jsonResult.bankRecon || []

            //         let opDebit = 0,
            //             opCredit = 0
            //         if (meta.current.balances['opBal']?.amount > 0) {
            //             if (meta.current.balances['opBal']?.dc === 'D') {
            //                 opDebit = meta.current.balances['opBal']?.amount
            //             } else {
            //                 opCredit = meta.current.balances['opBal']?.amount
            //             }
            //         }

            //         bankRecon.unshift({
            //             //add at begining
            //             lineRemarks: 'Opening balance',
            //             autoRefNo: 'Opening balance',
            //             tranDate: finYearObject.isoStartDate,
            //             clearDate: finYearObject.isoStartDate,
            //             debit: opDebit,
            //             credit: opCredit,
            //         })
            //         meta.current.reconData =
            //             bankRecon && utilFunc().computeBalance(bankRecon)
            //         meta.current.initialData = JSON.parse(
            //             JSON.stringify(meta.current.reconData)
            //         )
            //         meta.current.initialDataHash = hash(meta.current.reconData)
            //         setUniqueIds()
            //         emit(
            //             getXXGridParams().gridActionMessages
            //                 .justRefreshIbukiMessage,
            //             null
            //         )
            //     }
            //     emit('SHOW-LOADING-INDICATOR', false)
            //     meta.current.isMounted && setRefresh({})

            //     function setUniqueIds() {
            //         let i = 1
            //         function incr() {
            //             return i++
            //         }
            //         meta.current.reconData = meta.current.reconData.map(
            //             (x: any) => {
            //                 // if (!x.isDailySummary) {
            //                 if (!x['id1']) {
            //                     x['id1'] = x.id
            //                 }
            //                 // }
            //                 x.id = incr()
            //                 return x
            //             }
            //         )
            //     }
            // }