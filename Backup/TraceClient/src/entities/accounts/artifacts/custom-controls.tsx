import React, { useState, useEffect, useRef } from 'react'
import { map } from 'rxjs/operators'
import moment from 'moment'
import InputMask from 'react-input-mask'
// import { forkJoin } from 'rxjs'
import { useGeneric } from "../../../react-form/core/generic-item";
import { manageFormsState } from '../../../react-form/core/fsm'
import { manageEntitiesState } from '../../../common-utils/esm'
import { useIbuki } from '../../../common-utils/ibuki'
// import { useMounted } from '../../../utils/use-mounted-hook'
import { utilMethods } from '../../../common-utils/util-methods'
import { utils } from '../utils'
import NumberFormat from 'react-number-format'
import { componentStore } from '../../../react-form/component-store/html-core'
import { Combobox } from 'react-widgets'

const customControls = {
    MyControl: (props: any) => {
        const { xName, xValue } = useGeneric(props)
        return <input type="text" value={xValue} name={xName}></input>
    }

    , DateMask:
        (props: any) => {
            const { getFromBag } = manageEntitiesState()
            const { parent, item } = props
            const {
                xName,
                xValue,
                xPlaceholder,
                XLabel,
                XErrorDisplay,
                onChangeEvent,
                onBlurEvent,
                xClassName,
                xStyle
            } = useGeneric(props)
            // const [, setRefresh] = useState({})
            const isoDateFormat = 'YYYY-MM-DD'
            const dateFormat: any = getFromBag('dateFormat') || isoDateFormat
            useEffect(() => {
                const val = moment().format(dateFormat)
                parent[item.name] || (parent[item.name] = val)
            }, [])
            const maskMap: any = {
                'DD/MM/YYYY': '99/99/9999'
                , 'MM/DD/YYYY': '99/99/9999'
                , 'YYYY-MM-DD': '9999-99-99'
            }
            return <>
                <div><XLabel></XLabel></div>
                <InputMask
                    style={{ height: '1.65rem', fontSize: '0.8rem' }}
                    mask={maskMap[dateFormat]}
                    value={xValue || moment().format(dateFormat)}
                    placeholder={dateFormat}
                    onFocus={e => { e.target.select() }}
                    onChange={(e) => {
                        const val = e.target.value //moment(e.target.value).format(dateFormat)
                        // setRefresh({})
                        onChangeEvent(val)
                    }}>
                </InputMask>
                <XErrorDisplay></XErrorDisplay>
            </>
        }

    , TextInstrNo: (props: any) => {
        const { parent, item } = props
        const { getAccountClass } = utils()
        const { filterOn } = useIbuki()
        let [isDisabled, setIsDisabled] = useState(true)
        useEffect(() => {
            const subs = filterOn(item.customIbukiFilterOnMessage).subscribe((d) => {
                // console.log(d.data)
                const accClass: string = getAccountClass(d.data)
                if (accClass && accClass === 'cash') {
                    parent[item.name] = ''
                    setIsDisabled(true)
                } else {
                    setIsDisabled(false)
                }
            })
            return (() => subs.unsubscribe())
        })

        return <componentStore.Text {...props} disabled={isDisabled}></componentStore.Text>
    }

    , MoneyView: (props: any) => {
        const [, setRefresh] = useState({})
        const { item, parent, formId } = props
        const { getDebitCreditTotals } = utils()
        const { filterOn, emit } = useIbuki()
        const meta: any = useRef({
            label: 'Debit amount'
            , isMounted: true
        })

        if (item.ibukiFilterOnMessage === 'DEBIT-CHANGED') {
            (meta.current.label = 'Credit amount')
        }
        useEffect(() => {
            meta.current.isMounted = true
            const subs = filterOn(item.ibukiFilterOnMessage).subscribe((d) => {
                const dbcr = (item.ibukiFilterOnMessage === 'DEBIT-CHANGED') ? 'debits' : 'credits'
                const debitCreditTotals: any = getDebitCreditTotals(formId)
                parent[item.name] = debitCreditTotals[dbcr]
                emit(item.ibukiFilterOnMessage.concat('-FORWARDED'), '') // for voucher totals refresh
                meta.current.isMounted && setRefresh({})
            })

            return (() => {
                meta.current.isMounted = false
                subs.unsubscribe()
            })
        }, [])
        // parent[item.name] = getTotalDebits(formId)
        return <>
            <div><label style={{ textAlign: 'right' }}>{meta.current.label}</label></div>
            <NumberFormat
                thousandSeparator={true}
                // thousandsGroupStyle="lakh"
                prefix={'₹ '}
                fixedDecimalScale={true}
                decimalScale={2}
                allowNegative={false}
                disabled={true}
                value={parent[item.name] || ""}
                placeholder='Amount'
                name={item.name}
            ></NumberFormat>
        </>
    }

    , VoucherTotals: (props: any) => {
        const { toDecimalFormat } = utilMethods()
        const { filterOn } = useIbuki()
        const [, setRefresh] = useState({})
        const { getDebitCreditTotals } = utils()
        const item = props.item
        const dc = item.dc || 'D'
        const formId = props.formId
        useEffect(() => {
            const subs = filterOn(item.ibukiFilterOnMessage.concat('-FORWARDED')).subscribe((d) => {
                setRefresh({})
            })
            return (() => { subs.unsubscribe() })
        }, [])
        const logic: any = { D: { prefix: 'Dr: ', sumTarget: 'debits' }, C: { prefix: 'Cr: ', sumTarget: 'credits' } }
        const debitCreditTotals = getDebitCreditTotals(formId)
        // const totalDebits = debitCreditTotals.debits // debits and credits are equal, so anything will work
        const amount = toDecimalFormat(String(debitCreditTotals[logic[dc].sumTarget]))
        const prefix = logic[dc].prefix
        return <label className={item.class}> {prefix}{amount}</label>
        // return <label className={item.class}> {item.prefix ? item.prefix : ''}{toDecimalFormat(totalDebits.toString())}</label>
    }

    , LedgerSubledger: (props: any) => {
        const { showLabel, formId, item } = props
        const { getValidationFabric } = manageFormsState()
        const { resetItemErrors } = getValidationFabric()
        const { hotFilterOn } = useIbuki()
        const { registerAccounts } = utils()
        const [ledgerOptions, setLedgerOptions] = useState([])
        const [subledgerOptions, setSubledgerOptions] = useState([])
        const [allAccounts, setAllAccounts]: any[] = useState([])
        const [subledgerDisabled, setSubledgerDisabled] = useState(true)
        const initialSubledgerValue = { label: '', value: null }
        const initialLedgerValue = { label: '', value: null }
        const [subledgerValue, setSubledgerValue]: any = useState(initialSubledgerValue)
        let [ledgerValue, setLedgerValue]: any = useState(initialLedgerValue)

        let { xValue } = useGeneric(props)

        const {
            XLabel,
            XErrorDisplay, onChangeEvent,
            parent, controlId } = useGeneric(props)

        const args: string[] = item.options.args
        useEffect(() => {
            const subs: any = hotFilterOn('DATACACHE-SUCCESSFULLY-LOADED')
                .pipe(
                    map((d: any) => d.data.allAccounts.filter((el: any) =>
                        args.includes(el.accClass) && ((el.accLeaf === 'Y') || (el.accLeaf === 'L'))))
                ).subscribe((d: any) => {
                    const selectOptions = d.map((el: any) => {
                        return { "label": el.accName, "value": el.id, "accLeaf": el.accLeaf }
                    })
                    setLedgerOptions(selectOptions)
                })
            const sub1: any = hotFilterOn('DATACACHE-SUCCESSFULLY-LOADED').subscribe((d: any) => {
                const allAccounts = d.data.allAccounts
                // Register with utils
                registerAccounts(allAccounts)
                if (xValue) {
                    // populate ledgerOptions
                    const tempLedgerOptions = allAccounts.filter((el: any) =>
                        args.includes(el.accClass) && ((el.accLeaf === 'Y') || (el.accLeaf === 'L'))
                    ).map((el: any) => { return { "label": el.accName, "value": el.id, "accLeaf": el.accLeaf } })
                    setLedgerOptions(tempLedgerOptions)

                    const it = allAccounts.find((x: any) => x.id === xValue)
                    if (it && it.accLeaf === 'S') {
                        // ledgerId.current = item.parentId
                        setLedgerValue({ value: it.parentId })
                        const tempSubledgers = allAccounts.filter((x: any) => it.parentId === x.parentId)
                        const temp = tempSubledgers.map((el: any) => {
                            return { "label": el.accName, "value": el.id, "accLeaf": el.accLeaf }
                        })
                        setSubledgerOptions(temp)
                        setSubledgerDisabled(false)
                        setSubledgerValue({ value: xValue })
                        // subledgerId.current =  xValue//item.id
                        // setRefresh({})
                    } else {
                        setLedgerValue({ value: xValue })
                        setSubledgerDisabled(true)
                        setSubledgerValue({ value: '' })
                    }
                }
                setAllAccounts(allAccounts)
            })
            subs.add(sub1)
            return (() => {
                subs.unsubscribe()
            })
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
        return <>
            {showLabel && <div><XLabel></XLabel></div>}
            <Combobox
                placeholder="Ledger a/c"
                data={ledgerOptions}
                textField="label"
                valueField="value"
                filter='contains'
                itemComponent={listItem}
                dropUp
                value={ledgerValue.value ? { value: ledgerValue.value } : null} // this is necessary of null otherwise [object object error happens]
                onChange={(v: any) => {
                    resetItemErrors(formId, controlId)
                    setLedgerValue({ value: v.value })
                    setSubledgerValue(initialSubledgerValue)
                    const it: any = ledgerOptions.find((x: any) => x.value === v.value)
                    if (it && it.accLeaf === 'L') {
                        const subledgers = allAccounts.filter((x: any) => it.value === x.parentId)
                        const temp = subledgers.map((el: any) => {
                            return { "label": el.accName, "value": el.id, "accLeaf": el.accLeaf }
                        })

                        setSubledgerOptions(temp)
                        // xValue = undefined // value of the control is subledger value
                        // onChangeEvent(xValue)
                        setSubledgerDisabled(false)
                    } else {
                        // xValue = v.value // value of control is ledger value
                        parent[item.name] = v.value
                        onChangeEvent(v.value)
                        setSubledgerDisabled(true)
                        setSubledgerOptions([])
                    }
                }}
            ></Combobox>
            <Combobox
                placeholder="Subledger a/c"
                disabled={subledgerDisabled}
                data={subledgerOptions}
                textField="label"
                valueField="value"
                filter='contains'
                value={subledgerValue.value ? { value: subledgerValue.value } : null} // this is necessary otherwise [object objec] is shown in combo
                // defaultValue={subledgerId ? { value: subledgerId } : null}
                onChange={(v) => {
                    setSubledgerValue(v)
                    parent[item.name] = v.value
                    onChangeEvent(v.value)
                }}
            ></Combobox>
            <XErrorDisplay></XErrorDisplay>
        </>
    }

    , GstControl: (props: any) => {
        const { showLabel, formId } = props
        const { getValidationFabric } = manageFormsState()
        const { resetItemErrors } = getValidationFabric()
        const { extractAmount } = utilMethods()
        const [, setRefresh] = useState({})
        const {
            XLabel,
            XErrorDisplay, onChangeEvent, onBlurEvent,
            parent, controlId } = useGeneric(props)
        const initialGst = {
            gstin: ''
            , hsn: undefined
            , rate: ''
            , cgst: ''
            , sgst: ''
            , igst: ''
        }
        useEffect(() => {
            parent.gst = { ...initialGst }
        }, [])

        function calculateGst(targetName: string) {
            const amt = +extractAmount(parent.amount)
            let sgst = 0.00, cgst = 0.00, igst = 0.00
            const rate = +parent.gst.rate
            if ((amt && amt > 0) && (rate && rate > 0)) {
                igst = amt * rate / (rate + 100)
                cgst = igst / 2
                sgst = cgst
            }
            if ((targetName === 'cgst') || (targetName === 'sgst')) {
                parent.gst['cgst'] = cgst
                parent.gst['sgst'] = sgst
                parent.gst['igst'] = 0.00
            } else {
                parent.gst['cgst'] = 0.00
                parent.gst['sgst'] = 0.00
                parent.gst['igst'] = igst
            }
            setRefresh({})
        }

        let [gstDisplay, setGstDisplay] = useState('none')
        const Gst = <>
            {showLabel && <div><XLabel></XLabel></div>}
            <div className="x-gst-container">
                <input type='checkbox' checked={gstDisplay === 'inline'} onChange={(e: any) => {
                    resetItemErrors(formId, controlId)
                    parent.gst = { ...initialGst }
                    if (e.target.checked) {
                        setGstDisplay('inline')
                        parent.gst.isGst = true
                    } else {
                        setGstDisplay('none')
                        parent.gst.isGst = undefined //isgst false tries to insert data in non-existing column isGst at server
                    }
                }} style={{ display: 'inline' }}></input>
                <div className="x-gst-details" style={{ display: gstDisplay }}>
                    <input className="x-gstin" type="text"
                        autoComplete="off"
                        placeholder="Gstin no"
                        name="gstin"
                        value={parent.gst ? parent.gst['gstin'] : ''}
                        onChange={async (e: any) => {
                            parent.gst['gstin'] = e.target.value
                            await onChangeEvent(parent.gst)
                            // parent.gst['isUpdated'] = true
                        }}
                        onBlur={async (e) => {
                            await onBlurEvent(parent.gst)
                        }}
                    ></input>
                    <NumberFormat
                        autoComplete="off"
                        className='x-hsn'
                        placeholder='Hsn'
                        onFocus={(e) => { e.target.select() }}
                        value={parent.gst ? parent.gst['hsn'] : ''}
                        onChange={async (e: any) => {
                            parent.gst['hsn'] = e.target.value
                            await onChangeEvent(parent.gst)
                            // parent.gst['isUpdated'] = true
                        }}
                        name="rate"
                        // format="##.##"
                        allowNegative={false}></NumberFormat>
                    <NumberFormat thousandSeparator={true}
                        autoComplete="off"
                        thousandsGroupStyle="lakh"
                        fixedDecimalScale={true}
                        decimalScale={2}
                        className='x-rate'
                        placeholder='Rate'
                        onFocus={(e) => { e.target.select() }}
                        value={parent.gst ? parent.gst['rate'] : ''}
                        onChange={async (e: any) => {
                            parent.gst['rate'] = e.target.value
                            await onChangeEvent(parent.gst)
                            // parent.gst['isUpdated'] = true
                        }}
                        onBlur={async (e) => {
                            await onBlurEvent(parent.gst)
                        }}
                        name="rate"
                        // format="##.##"
                        allowNegative={false}></NumberFormat>
                    <NumberFormat thousandSeparator={true}
                        thousandsGroupStyle="lakh"
                        autoComplete="off"
                        fixedDecimalScale={true}
                        decimalScale={2}
                        prefix={'₹ '}
                        onFocus={(e) => { e.target.select() }}
                        name="cgst"
                        value={parent.gst ? parent.gst['cgst'] : ''}
                        onClick={async (e) => {
                            calculateGst(e.currentTarget.name)
                            await onChangeEvent(parent.gst)
                        }}
                        onChange={async (e: any) => {
                            parent.gst['cgst'] = e.target.value
                            parent.gst['sgst'] = e.target.value
                            await onChangeEvent(parent.gst)
                            // parent.gst['isUpdated'] = true
                        }}
                        onBlur={async (e) => {
                            await onBlurEvent(parent.gst)
                        }}
                        placeholder='Cgst'
                        allowNegative={false}></NumberFormat>
                    <NumberFormat thousandSeparator={true}
                        autoComplete="off"
                        thousandsGroupStyle="lakh"
                        fixedDecimalScale={true}
                        onFocus={(e) => { e.target.select() }}
                        decimalScale={2}
                        prefix={'₹ '}
                        name="sgst"
                        onClick={async (e) => {
                            calculateGst(e.currentTarget.name)
                            await onChangeEvent(parent.gst)
                        }}
                        value={parent.gst ? parent.gst['sgst'] : ''}
                        onChange={async (e: any) => {
                            parent.gst['sgst'] = e.target.value
                            parent.gst['cgst'] = e.target.value
                            await onChangeEvent(parent.gst)
                            // parent.gst['isUpdated'] = true
                        }}
                        onBlur={async (e) => {
                            await onBlurEvent(parent.gst)
                        }}
                        placeholder='Sgst'
                        allowNegative={false}></NumberFormat>
                    <NumberFormat thousandSeparator={true}
                        autoComplete="off"
                        thousandsGroupStyle="lakh"
                        fixedDecimalScale={true}
                        onFocus={(e) => { e.target.select() }}
                        decimalScale={2}
                        prefix={'₹ '}
                        name="igst"
                        onClick={async (e) => {
                            calculateGst(e.currentTarget.name)
                            await onChangeEvent(parent.gst)
                        }}
                        value={parent.gst ? parent.gst['igst'] : ''}
                        onChange={async (e: any) => {
                            parent.gst['igst'] = e.target.value
                            await onChangeEvent(parent.gst)
                            // parent.gst['isUpdated'] = true
                        }}
                        onBlur={async (e) => {
                            await onBlurEvent(parent.gst)
                        }}
                        placeholder='Igst'
                        allowNegative={false}></NumberFormat>
                </div>
            </div>
            <XErrorDisplay />
        </>
        return Gst
    }
}

export default customControls
/*

*/