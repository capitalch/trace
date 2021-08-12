import React, { useState, useEffect, useRef } from 'react'
import { makeStyles, Theme, createStyles } from '@material-ui/core'
import { useSharedElements } from '../../common/shared-elements-hook'
import { classNames } from 'react-select/src/utils'
import { LedgerSubledger } from '../../common/ledger-subledger'

function useJournalMain(arbitraryData: any) {
    const [, setRefresh] = useState({})

    const {
        _,
        accountsMessages,
        AddCircle,
        AddIcon,
        Avatar,
        Big,
        Box,
        Button,
        Card,
        Checkbox,
        CheckIcon,
        Chip,
        CloseIcon,
        confirm,
        DataTable,
        DeleteIcon,
        Dialog,
        DialogTitle,
        DialogContent,
        DialogActions,
        Divider,
        doValidateForm,
        EditIcon,
        emit,
        ErrorIcon,
        execGenericView,
        filterOn,
        genericUpdateMaster,
        getCurrentEntity,
        getFormData,
        getFormObject,
        getFromBag,
        getMappedAccounts,
        globalMessages,
        FormControlLabel,
        Icon,
        IconButton,
        Input,
        InputAdornment,
        isInvalidGstin,
        isValidForm,
        List,
        ListItem,
        ListItemAvatar,
        ListItemText,
        MaterialTable,
        messages,
        moment,
        MTableBody,
        MTableToolbar,
        NativeSelect,
        NumberFormat,
        Paper,
        PrimeColumn,
        queries,
        queryGraphql,
        Radio,
        ReactForm,
        releaseForm,
        resetAllFormErrors,
        resetForm,
        saveForm,
        SearchIcon,
        setFormError,
        SyncIcon,
        tableIcons,
        TextField,
        toDecimalFormat,
        TraceDialog,
        TraceFullWidthSubmitButton,
        traceGlobalSearch,
        TraceSearchBox,
        Typography,
        useGeneric,
    } = useSharedElements()

    useEffect(() => {
        meta.current.isMounted = true
        const subs1 = filterOn('JOURNAL-MAIN-REFRESH').subscribe(() =>
            setRefresh({})
        )
        return () => {
            meta.current.isMounted = false
            subs1.unsubscribe()
        }
    }, [])

    const meta: any = useRef({
        isMounted: false,
    })

    function Header({ arbitraryData }: any) {
        const classes = useStyles()
        return (
            <div className={classes.contentHeader}>
                <Typography
                    className="header-label"
                    variant="subtitle2"
                    color="secondary">
                    Header
                </Typography>
                <div className="header-block">
                    <TextField
                        className="auto-ref-no"
                        disabled={true}
                        label="Ref no"
                        value={arbitraryData.autoRefNo || ''}
                    />
                    {/* date */}
                    <div className="date-block">
                        <label className="date-label">Date</label>
                        <TextField
                            // error={getDateError()}
                            // helperText={
                            //     getDateError()
                            //         ? 'Date range / Audit lock error'
                            //         : undefined
                            // }
                            type="date"
                            onChange={(e: any) => {
                                arbitraryData.tranDate = e.target.value
                                setRefresh({})
                            }}
                            onFocus={(e) => e.target.select()}
                            value={arbitraryData.tranDate || ''}
                        />
                    </div>
                    {/* user ref no  */}
                    <TextField
                        label="Use ref"
                        className="user-ref"
                        // error={getInvoiceError()}
                        onChange={(e: any) => {
                            arbitraryData.userRefNo = e.target.value
                            setRefresh({})
                        }}
                        value={arbitraryData.userRefNo || ''}
                    />
                    {/* remarks */}
                    <TextField
                        label="Common remarks"
                        className="common-remarks"
                        onChange={(e: any) => {
                            arbitraryData.commonRemarks = e.target.value
                            setRefresh({})
                        }}
                        value={arbitraryData.commonRemarks || ''}
                    />

                    <SubmitButton />
                </div>
            </div>
        )

        function SubmitButton() {
            const [, setRefresh] = useState({})
            useEffect(() => {
                const subs1 = filterOn(
                    'PURCHASE-BODY-SUBMIT-REFRESH'
                ).subscribe(() => {
                    setRefresh({})
                })

                return () => {
                    subs1.unsubscribe()
                }
            }, [])

            return (
                <Button
                    className="submit-button"
                    variant="contained"
                    size="small"
                    color="secondary"
                    onClick={handleSubmit}
                    startIcon={
                        getError() ? (
                            <ErrorIcon color="error" />
                        ) : (
                            <CheckIcon style={{ color: 'white' }} />
                        )
                    }
                    disabled={getError()}>
                    Submit
                </Button>
            )
        }

        function getError() {
            return true
        }

        function handleSubmit() {}
    }

    function ActionDebit({ arbitraryData }: any) {
        const classes = useStyles()
        return (
            <div className={classes.contentActionDebit}>
                <Typography
                    className="debits-label"
                    variant="subtitle2"
                    component="div"
                    color="secondary">
                    Debits
                </Typography>
                <ul className="debits-block">{ActionList()}</ul>
            </div>
        )

        function ActionList() {
            const [, setRefresh] = useState({})
            let ind = 0
            const debits: any[] = arbitraryData.debits
            const matProps = {label:'Debit amount'}
            const list: any[] = debits.map((item: any) => {
                const ret = (
                    <li key={incr()} className='debits-row'>
                        <LedgerSubledger
                            allAccounts={arbitraryData.accounts.all}
                            // emitMessageOnChange="SALES-CROWN-REFRESH"
                            ledgerAccounts={getMappedAccounts(
                                arbitraryData.accounts.journal
                            )}
                            // onChange={onChangeLedgerSubledger}
                            rowData={item}
                        />
                        <NumberFormat
                            allowNegative={false}
                            {...matProps}
                            className="right-aligned-numeric"
                            customInput={TextField}
                            decimalScale={2}
                            error={item.amount ? false : true}
                            fixedDecimalScale={true}
                            onFocus={(e) => {
                                e.target.select()
                            }}
                            onValueChange={(values: any) => {
                                const { floatValue } = values
                                item.amount = floatValue || 0.0
                                // computeSummary()
                                setRefresh({})
                            }}
                            thousandSeparator={true}
                            value={item.amount || 0.0}
                        />
                    </li>
                )
                return ret
            })

            return list

            function incr() {
                return ind++
            }
        }
    }

    return { ActionDebit, Header, meta, setRefresh }
}

export { useJournalMain }

const useStyles: any = makeStyles((theme: Theme) =>
    createStyles({
        contentHeader: {
            '& .header-label': {
                marginTop: theme.spacing(2),
                // padding: theme.spacing(2),
                // paddingBottom:0,
            },
            '& .header-block': {
                display: 'flex',
                columnGap: theme.spacing(4),
                // marginTop: theme.spacing(2),
                flexWrap: 'wrap',
                rowGap: theme.spacing(3),
                alignItems: 'center',
                // border: '1px solid lightgrey',
                padding: theme.spacing(2),
                paddingTop: 0,
                '& .auto-ref-no': {
                    maxWidth: theme.spacing(19),
                },

                '& .date-block': {
                    display: 'flex',
                    flexDirection: 'column',
                    '& .date-label': {
                        fontSize: '0.7rem',
                    },
                },

                '& .user-ref': {
                    maxWidth: '10rem',
                },
                '& .common-remarks': {
                    maxWidth: '20rem',
                    flexGrow: 2,
                },
                '& .submit-button': {
                    marginLeft: 'auto',
                },
            },
        },

        contentActionDebit: {
            '& .right-aligned-numeric': {
                '& input': {
                    textAlign: 'end',
                },
            },

            '& .debits-label': {
                marginTop: theme.spacing(2),
            },
            '& .debits-block': {
                listStyle: 'none',
                marginLeft: 0,
                paddingLeft: 0,
                '& .debits-row': {
                    display: 'flex',
                    columnGap: theme.spacing(4),
                    flexWrap: 'wrap',
                    rowGap: theme.spacing(3),
                    alignItems: 'center',
                },
            },
        },
    })
)

export { useStyles }
