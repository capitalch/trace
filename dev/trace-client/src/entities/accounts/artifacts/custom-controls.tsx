import { useState, useEffect, useRef } from 'react'
import { map } from 'rxjs/operators'
import {
    Box,
    useTheme,
    Theme,
    createStyles,
    makeStyles,
    TextField,
    Checkbox,
    Card,
} from '@material-ui/core'
import moment from 'moment'
import InputMask from 'react-input-mask'
import { useGeneric } from '../../../react-form/core/generic-item'
import { manageFormsState } from '../../../react-form/core/fsm'
import { manageEntitiesState } from '../../../common-utils/esm'
import { usingIbuki } from '../../../common-utils/ibuki'
import { utilMethods } from '../../../common-utils/util-methods'
import { utils } from '../utils'
import NumberFormat from 'react-number-format'
import { componentStore } from '../../../react-form/component-store/html-core'
import { Combobox } from 'react-widgets'

const customControls = {
    DateMask: (props: any) => {
        const { getFromBag } = manageEntitiesState()
        const {
            getValidationFabric,
            setField,
            setDateValidatorFormat,
        } = manageFormsState()
        const { doValidateControl } = getValidationFabric()

        const { parent, item } = props
        const {
            xValue,
            XLabel,
            XErrorDisplay,
            formId,
            controlId,
        } = useGeneric(props)
        const [, setRefresh] = useState({})

        const isoDateFormat = 'YYYY-MM-DD'
        const dateFormat: any = getFromBag('dateFormat') || isoDateFormat
        // In DateMask during validation of the date it is considered as in dateFormat. If date is sent from Datepicker it is in isoFormat
        setDateValidatorFormat(formId, controlId, dateFormat)
        useEffect(() => {
            const val = moment().format(dateFormat)
            parent[item.name] || (parent[item.name] = val)
        }, [])
        const maskMap: any = {
            'DD/MM/YYYY': '99/99/9999',
            'MM/DD/YYYY': '99/99/9999',
            'YYYY-MM-DD': '9999-99-99',
        }

        return (
            <>
                <div>
                    <XLabel></XLabel>
                </div>
                <InputMask
                    style={{ width: 200 }}
                    mask={maskMap[dateFormat]}
                    value={xValue || ''}
                    onFocus={(e: any) => {
                        e.target.select()
                    }}
                    onChange={async (e: any) => {
                        setField(parent, item.name, e.target.value)
                        await doValidateControl(formId, controlId)
                        setRefresh({})
                    }}
                    onBlur={async (e: any) => {
                        await doValidateControl(formId, controlId)
                        setRefresh({})
                    }}
                />
                <XErrorDisplay></XErrorDisplay>
            </>
        )
    },

    DebitCreditRowsCount: (props: any) => {
        const item = props.item
        const formId = props.formId
        const { filterOn } = usingIbuki()
        const { getDebitCreditRowsCount } = utils()
        const [, setRefresh] = useState({})
        useEffect(() => {
            const subs = filterOn(item.ibukiFilterOnMessage).subscribe((d) => {
                setRefresh({})
            })
            return () => {
                subs.unsubscribe()
            }
        }, [])
        const rowsCount = getDebitCreditRowsCount(formId)
        return (
            <label className={item.class}>
                {'Debit count: '}
                {rowsCount.debitRowsCount}
                {', Credit count: '}
                {rowsCount.creditRowsCount}
            </label>
        )
    },

    GstControl: (props: any) => {
        const meta = useRef({
            isMounted: false,
            autoCalculate: true,
        })
        const classes = useStyles()
        const { formId } = props
        const { getValidationFabric } = manageFormsState()
        const { resetItemErrors } = getValidationFabric()
        const { extractAmount } = utilMethods()
        const [, setRefresh] = useState({})
        const theme = useTheme()
        const {
            XLabel,
            XErrorDisplay,
            item,
            parent,
            controlId,
            onChangeEvent,
            onBlurEvent,
        } = useGeneric(props)
        parent.gst = parent.gst || { isGst: false } // if gst object not exists in parent create it
        parent.gst.amount = +extractAmount(parent.amount)
        const gstDisplay = parent?.gst?.isGst ? 'inline' : 'none'
        const materialProps = {
            gstin: {
                label: 'Gstin',
            },
            hsn: {
                label: 'Hsn',
            },
            rate: {
                label: 'Rate',
            },
            cgst: {
                label: 'Cgst',
            },
            sgst: {
                label: 'Sgst',
            },
            igst: {
                label: 'Igst',
            },
        }

        useEffect(() => {
            meta.current.isMounted = true

            return () => {
                meta.current.isMounted = false
            }
        }, [])

        const Gst = (
            <div className={classes.gst}>
                <div>
                    {' '}
                    <XLabel></XLabel>
                </div>
                <Card className="x-gst-container">
                    <Box className="x-gst-header">
                        <Checkbox
                            color="primary"
                            checked={parent?.gst?.isGst || false}
                            onChange={(e: any) => {
                                resetItemErrors(formId, controlId)
                                if (e.target.checked) {
                                    parent.gst.isGst = true
                                } else {
                                    parent.gst.isGst = undefined //isgst false tries to insert data in non-existing column isGst at server
                                }
                                meta.current.isMounted && setRefresh({})
                            }}></Checkbox>
                        <span>
                            <label>Auto calc</label>
                            <Checkbox
                                color="secondary"
                                checked={meta.current.autoCalculate}
                                onChange={(e) => {
                                    if (e.target.checked) {
                                        calculateGst('cgst')
                                    }
                                    meta.current.autoCalculate = !meta.current
                                        .autoCalculate
                                    meta.current.isMounted && setRefresh({})
                                }}></Checkbox>
                        </span>
                    </Box>
                    <Box
                        className="x-gst-details"
                        style={{ display: gstDisplay }}>
                        <TextField
                            className="x-gstin" // gstin
                            type="text"
                            label={'Gstin'}
                            autoComplete="off"
                            placeholder="Gstin no"
                            name="gstin"
                            value={parent?.gst?.gstin || ''} // if blank '' initial value is not assigned then uncontrolled component error occurs
                            onChange={async (e: any) => {
                                parent.gst['gstin'] = e.target.value
                                await onChangeEvent(parent.gst)
                                meta.current.isMounted && setRefresh({})
                            }}
                            onBlur={async (e) => {
                                await onBlurEvent(parent.gst)
                            }}></TextField>
                        <NumberFormat // hsn
                            autoComplete="off"
                            customInput={TextField}
                            className="x-hsn"
                            placeholder="Hsn"
                            onFocus={(e) => {
                                e.target.select()
                            }}
                            value={parent?.gst?.hsn || ''}
                            onChange={async (e: any) => {
                                parent.gst['hsn'] = e.target.value
                                meta.current.isMounted && setRefresh({})
                                await onChangeEvent(parent.gst)
                            }}
                            name="rate"
                            {...materialProps.hsn}
                            allowNegative={false}></NumberFormat>
                        <NumberFormat
                            thousandSeparator={true} // rate
                            autoComplete="off"
                            customInput={TextField}
                            thousandsGroupStyle="lakh"
                            fixedDecimalScale={true}
                            decimalScale={2}
                            className="x-rate"
                            style={{ textAlign: 'end' }}
                            placeholder="Rate"
                            onFocus={(e) => {
                                e.target.select()
                            }}
                            value={parent.gst?.rate || ''}
                            onClick={async (e) => {
                                meta.current.autoCalculate &&
                                    calculateGst('rate')
                                await onChangeEvent(parent.gst)
                            }}
                            onChange={async (e: any) => {
                                parent.gst['rate'] = e.target.value
                                meta.current.autoCalculate &&
                                    calculateGst('rate')
                                await onChangeEvent(parent.gst)
                            }}
                            onBlur={async (e) => {
                                await onBlurEvent(parent.gst)
                            }}
                            name="rate"
                            {...materialProps.rate}
                            allowNegative={false}></NumberFormat>
                        <NumberFormat
                            thousandSeparator={true} // cgst
                            style={{
                                backgroundColor: meta.current.autoCalculate
                                    ? theme.palette.grey[100]
                                    : 'white',
                            }}
                            readOnly={meta.current.autoCalculate}
                            autoComplete="off"
                            className="x-cgst"
                            customInput={TextField}
                            fixedDecimalScale={true}
                            decimalScale={2}
                            onFocus={(e) => {
                                e.target.select()
                            }}
                            name="cgst"
                            value={parent?.gst?.cgst || ''}
                            onClick={async (e) => {
                                meta.current.autoCalculate &&
                                    calculateGst('cgst')
                                await onChangeEvent(parent.gst)
                            }}
                            onChange={async (e: any) => {
                                parent.gst['cgst'] = e.target.value
                                parent.gst['sgst'] = e.target.value
                                meta.current.autoCalculate &&
                                    calculateGst('cgst')
                                await onChangeEvent(parent.gst)
                            }}
                            onBlur={async (e) => {
                                await onBlurEvent(parent.gst)
                            }}
                            placeholder="Cgst"
                            {...materialProps.cgst}
                            allowNegative={false}></NumberFormat>
                        <NumberFormat
                            thousandSeparator={true} // sgst
                            style={{
                                backgroundColor: meta.current.autoCalculate
                                    ? theme.palette.grey[100]
                                    : 'white',
                            }}
                            readOnly={meta.current.autoCalculate}
                            autoComplete="off"
                            customInput={TextField}
                            className="x-sgst"
                            fixedDecimalScale={true}
                            onFocus={(e) => {
                                e.target.select()
                            }}
                            decimalScale={2}
                            name="sgst"
                            onClick={async (e) => {
                                meta.current.autoCalculate &&
                                    calculateGst('sgst')
                                await onChangeEvent(parent.gst)
                            }}
                            value={parent?.gst?.sgst || ''}
                            onChange={async (e: any) => {
                                parent.gst['sgst'] = e.target.value
                                parent.gst['cgst'] = e.target.value
                                meta.current.autoCalculate &&
                                    calculateGst('cgst')
                                await onChangeEvent(parent.gst)
                            }}
                            onBlur={async (e) => {
                                await onBlurEvent(parent.gst)
                            }}
                            placeholder="Sgst"
                            {...materialProps.sgst}
                            allowNegative={false}></NumberFormat>
                        <NumberFormat
                            thousandSeparator={true} // igst
                            style={{
                                backgroundColor: meta.current.autoCalculate
                                    ? theme.palette.grey[100]
                                    : 'white',
                            }}
                            readOnly={meta.current.autoCalculate}
                            autoComplete="off"
                            customInput={TextField}
                            className="x-igst"
                            fixedDecimalScale={true}
                            onFocus={(e) => {
                                e.target.select()
                            }}
                            decimalScale={2}
                            name="igst"
                            onClick={async (e) => {
                                meta.current.autoCalculate &&
                                    calculateGst('igst')
                                await onChangeEvent(parent.gst)
                            }}
                            value={parent?.gst?.igst || ''}
                            onChange={async (e: any) => {
                                parent.gst['igst'] = e.target.value
                                meta.current.autoCalculate &&
                                    calculateGst('cgst')
                                await onChangeEvent(parent.gst)
                            }}
                            onBlur={async (e) => {
                                await onBlurEvent(parent.gst)
                            }}
                            placeholder="Igst"
                            {...materialProps.igst}
                            allowNegative={false}></NumberFormat>
                    </Box>
                </Card>
                <XErrorDisplay />
            </div>
        )
        return Gst

        function calculateGst(targetName: string) {
            const amt = +extractAmount(parent.amount)
            let sgst = 0.0,
                cgst = 0.0,
                igst = 0.0
            const rate = +parent.gst.rate
            if (amt && amt > 0 && rate && rate > 0) {
                igst = (amt * rate) / (rate + 100)
                cgst = igst / 2
                sgst = cgst
            }
            if (
                targetName === 'cgst' ||
                targetName === 'sgst' ||
                targetName === 'rate'
            ) {
                parent.gst['cgst'] = cgst
                parent.gst['sgst'] = sgst
                parent.gst['igst'] = 0.0
            } else {
                parent.gst['cgst'] = 0.0
                parent.gst['sgst'] = 0.0
                parent.gst['igst'] = igst
            }
            meta.current.isMounted && setRefresh({})
        }

        function resetGstControl() {
            parent.gst = {}
            setRefresh({})
        }
    },

    LedgerSubledger: (props: any) => {
        const { showLabel, formId, item } = props
        const { getValidationFabric } = manageFormsState()
        const { resetItemErrors } = getValidationFabric()
        const { hotFilterOn, emit } = usingIbuki()
        const { registerAccounts } = utils()
        const [ledgerOptions, setLedgerOptions] = useState([])
        const [subledgerOptions, setSubledgerOptions] = useState([])
        const [allAccounts, setAllAccounts]: any[] = useState([])
        const [subledgerDisabled, setSubledgerDisabled] = useState(true)

        const initialSubledgerValue = { label: '', value: null }
        const initialLedgerValue = { label: '', value: null }
        const [subledgerValue, setSubledgerValue]: any = useState(
            initialSubledgerValue
        )
        let [ledgerValue, setLedgerValue]: any = useState(initialLedgerValue)

        let { xValue } = useGeneric(props)

        const {
            XLabel,
            XErrorDisplay,
            onChangeEvent,
            parent,
            controlId,
            // selectOptions,
        } = useGeneric(props)

        const args: string[] = item.options.args
        useEffect(() => {
            const subs: any = hotFilterOn('DATACACHE-SUCCESSFULLY-LOADED')
                .pipe(
                    map((d: any) =>
                        d.data.allAccounts.filter(
                            (el: any) =>
                                args.includes(el.accClass) &&
                                (el.accLeaf === 'Y' || el.accLeaf === 'L')
                        )
                    )
                )
                .subscribe((d: any) => {
                    const selectOptions = d.map((el: any) => {
                        return {
                            label: el.accName,
                            value: el.id,
                            accLeaf: el.accLeaf,
                        }
                    })
                    setLedgerOptions(selectOptions)
                })
            const sub1: any = hotFilterOn(
                'DATACACHE-SUCCESSFULLY-LOADED'
            ).subscribe((d: any) => {
                const allAccounts = d.data.allAccounts
                // Register with utils
                registerAccounts(allAccounts)
                if (xValue) {
                    // populate ledgerOptions
                    const tempLedgerOptions = allAccounts
                        .filter(
                            (el: any) =>
                                args.includes(el.accClass) &&
                                (el.accLeaf === 'Y' || el.accLeaf === 'L')
                        )
                        .map((el: any) => {
                            return {
                                label: el.accName,
                                value: el.id,
                                accLeaf: el.accLeaf,
                            }
                        })
                    setLedgerOptions(tempLedgerOptions)

                    const it = allAccounts.find((x: any) => x.id === xValue)
                    if (it && it.accLeaf === 'S') {
                        setLedgerValue({
                            value: it.parentId,
                            label: 'parent-label',
                        })
                        const tempSubledgers = allAccounts.filter(
                            (x: any) => it.parentId === x.parentId
                        )
                        const temp = tempSubledgers.map((el: any) => {
                            return {
                                label: el.accName,
                                value: el.id,
                                accLeaf: el.accLeaf,
                            }
                        })
                        setSubledgerOptions(temp)
                        setSubledgerDisabled(false)
                        setSubledgerValue({ value: xValue, label: it.accName }) // ch1
                    } else {
                        setLedgerValue({ value: xValue, label: it.accName }) // ch2
                        setSubledgerDisabled(true)
                        setSubledgerValue({ value: '', label: '' })
                    }
                }
                setAllAccounts(allAccounts)
            })
            subs.add(sub1)
            return () => {
                subs.unsubscribe()
            }
        }, [xValue])

        function listItem({ item }: any) {
            let ret = <></>
            if (item.accLeaf === 'L') {
                ret = <strong>{item.label + ' >>>'}</strong>
            } else {
                ret = <span>{item.label}</span>
            }
            return ret
        }
        return (
            <>
                {showLabel && (
                    <div>
                        <XLabel></XLabel>
                    </div>
                )}
                <Combobox
                    placeholder="Ledger a/c"
                    data={ledgerOptions}
                    textField="label"
                    valueField="value"
                    filter="contains"
                    itemComponent={listItem}
                    // ch3
                    value={
                        ledgerValue.value
                            ? { value: ledgerValue.value }
                            : undefined
                    } // this is necessary of null otherwise [object object error happens]
                    onChange={(v: any) => {
                        resetItemErrors(formId, controlId)
                        setLedgerValue({ value: v.value, label: v.label }) // 4
                        setSubledgerValue(initialSubledgerValue)
                        const it: any = ledgerOptions.find(
                            (x: any) => x.value === v.value
                        )
                        if (it && it.accLeaf === 'L') {
                            const subledgers = allAccounts.filter(
                                (x: any) => it.value === x.parentId
                            )
                            const temp = subledgers.map((el: any) => {
                                return {
                                    label: el.accName,
                                    value: el.id,
                                    accLeaf: el.accLeaf,
                                }
                            })
                            setSubledgerOptions(temp)
                            setSubledgerDisabled(false)
                        } else {
                            parent[item.name] = v.value
                            onChangeEvent(v.value)
                            setSubledgerDisabled(true)
                            setSubledgerOptions([])
                        }
                    }}></Combobox>
                <Combobox
                    placeholder="Subledger a/c"
                    disabled={subledgerDisabled}
                    data={subledgerOptions}
                    textField="label"
                    valueField="value"
                    filter="contains"
                    value={
                        subledgerValue.value
                            ? { value: subledgerValue.value }
                            : undefined
                    } // this is necessary otherwise [object objec] is shown in combo
                    onChange={(v: any) => {
                        setSubledgerValue(v)
                        parent[item.name] = v.value
                        onChangeEvent(v.value)
                    }}></Combobox>
                <XErrorDisplay></XErrorDisplay>
            </>
        )
    },

    MoneyView: (props: any) => {
        const [, setRefresh] = useState({})
        const { item, parent, formId } = props
        const { getDebitCreditTotals } = utils()
        const { filterOn, emit } = usingIbuki()
        const classes = useStyles()
        const meta: any = useRef({
            label: 'Debit amount',
            isMounted: true,
        })
        const dc = item.dc
        const dcObject: any = {
            D: {
                label: 'Debit amount',
                name: 'debits',
            },
            C: {
                label: 'Credit amount',
                name: 'credits',
            },
        }
        const notVisible = item.notVisible
        if (item.ibukiFilterOnMessage === 'DEBIT-CHANGED') {
            meta.current.label = 'Credit amount'
        }

        function doForward() {
            const debitCreditTotals: any = getDebitCreditTotals(formId)
            parent[item.name] = debitCreditTotals[dcObject[dc].name]
            emit(item.ibukiFilterOnMessage.concat('-FORWARDED'), '') // for voucher totals refresh
            meta.current.isMounted && setRefresh({})
        }

        useEffect(() => {
            meta.current.isMounted = true
            const subs = filterOn(item.ibukiFilterOnMessage).subscribe((d) => {
                doForward()
            })
            const subs1 = filterOn('ROW-COUNT-CHANGED').subscribe((d) => {
                doForward()
            })
            subs.add(subs1)
            return () => {
                meta.current.isMounted = false
                subs.unsubscribe()
            }
        }, [])

        const materialProps = {
            style: {
                textAlign: 'end',
            },
        }

        return notVisible ? null : (
            <>
                <NumberFormat
                    customInput={TextField}
                    thousandSeparator={true}
                    className={classes.xAmount}
                    fixedDecimalScale={true}
                    decimalScale={2}
                    allowNegative={false}
                    disabled={true}
                    value={parent[item.name] || ''}
                    name={item.name}
                    label={item.label}
                    {...materialProps}
                    style={{ textAlign: 'end' }}></NumberFormat>
            </>
        )
    },

    TextInstrNo: (props: any) => {
        const { parent, item, formId } = props
        const { getAccountClass } = utils()
        const { filterOn } = usingIbuki()
        let [isDisabled, setIsDisabled] = useState(true)
        useEffect(() => {
            let isDisabled = getDisabled(parent['accId'])
            setIsDisabled(isDisabled)
            const subs = filterOn(item.customIbukiFilterOnMessage).subscribe(
                (d) => {
                    isDisabled = getDisabled(parent['accId'])
                    setIsDisabled(isDisabled)
                }
            )
            return () => subs.unsubscribe()
        }, [])

        function getDisabled(accId: any) {
            let ret = true
            if (accId) {
                const accClass: string = getAccountClass(accId)
                if (accClass) {
                    if (accClass === 'cash') {
                        parent[item.name] = ''
                    } else if (accClass === 'bank' || accClass === 'eCash') {
                        ret = false
                    }
                }
            }
            return ret
        }

        return (
            <componentStore.TextMaterial
                {...props}
                disabled={isDisabled}></componentStore.TextMaterial>
        )
    },

    VoucherTotals: (props: any) => {
        const { toDecimalFormat } = utilMethods()
        const { filterOn } = usingIbuki()
        const [, setRefresh] = useState({})
        const { getDebitCreditTotals } = utils()
        const item = props.item
        const formId = props.formId
        let ibukiMessages = item.ibukiFilterOnMessage
        if (ibukiMessages) {
            if (!Array.isArray(ibukiMessages)) {
                ibukiMessages = [ibukiMessages]
            }
        }
        useEffect(() => {
            const subs = filterOn(
                item.ibukiFilterOnMessage.concat('-FORWARDED')
            ).subscribe((d) => {
                setRefresh({})
            })
            return () => {
                subs.unsubscribe()
            }
        }, [])
        const logic: any = {
            D: { suffix: ' Dr', sumTarget: 'debits' },
            C: { suffix: ' Cr', sumTarget: 'credits' },
        }
        const debitCreditTotals = getDebitCreditTotals(formId)
        const totalDebits = toDecimalFormat(
            String(debitCreditTotals[logic['D'].sumTarget])
        )
        const totalCredits = toDecimalFormat(
            String(debitCreditTotals[logic['C'].sumTarget])
        )
        const debitSuffix = logic['D'].suffix
        const creditSuffix = logic['C'].suffix
        return (
            <label className={item.class}>
                {'Debits:'}
                {totalDebits}
                {debitSuffix}
                {', '}
                {'Credits:'}
                {totalCredits}
                {creditSuffix}
            </label>
        )
    },
}

export default customControls

const useStyles: any = makeStyles((theme: Theme) =>
    createStyles({
        xAmount: {
            marginTop: '-0.2rem',
            '& input': {
                color: 'red',
                textAlign: 'end',
            },
        },

        gst: {
            '& .x-gst-container': {
                border: '1px solid lightGrey',
                padding: theme.spacing(2),
                maxWidth: '12rem',
                '& .x-gst-details': {
                    '& .x-gstin, .x-hsn, .x-cgst, .x-sgst, .x-igst, .x-rate': {
                        color: theme.palette.primary.main,

                        '& input': {
                            textAlign: 'end',
                            color: theme.palette.primary.main,
                        },
                    },
                },
            },

            '& .x-gst-header': {
                display: 'flex',
                fontSize: '0.8rem',
                fontColor: theme.palette.blue.main,
                justifyContent: 'space-between',
                '& label': {
                    marginRight: theme.spacing(0.5),
                },
            },
        },
    })
)

/*
,
*/
