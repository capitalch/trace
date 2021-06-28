import { useState, useEffect, useRef } from 'react'
import {
    Checkbox,
    Input,
    InputAdornment,
    NativeSelect,
    useTheme,
    makeStyles,
    TextField,
    IconButton,
} from '@material-ui/core'
import { Clear } from '@material-ui/icons'
import { Button } from 'primereact/button'
import { useGeneric } from '../core/generic-item'
import { useSubmit } from '../core/submit'
import NumberFormat from 'react-number-format'
import Combobox from 'react-widgets/lib/Combobox'
import Select from 'react-select'
import moment from 'moment'
import 'react-widgets/dist/css/react-widgets.css'
// import 'react-widgets/styles.css'
import { getArtifacts } from '../common/react-form-hook'
import { manageFormsState } from '../core/fsm'

const componentStore: any = {
    Button: (props: any) => {
        const { item } = props
        let [, setRefresh] = useState({})
        const customMethods = getArtifacts('accounts').customMethods
        const className = item.className || 'x-button'
        return (
            <button
                className={className}
                onClick={(e) => {
                    customMethods[item.methodName](props)
                    setRefresh({})
                }}>
                {item.label}
            </button>
        )
    },

    ButtonPrime: (props: any) => {
        const { item } = props
        let [, setRefresh] = useState({})
        const customMethods = getArtifacts('accounts').customMethods
        const className = item.className || 'x-button'
        return (
            <Button
                className={className}
                label={item.label}
                onClick={(e) => {
                    customMethods[item.methodName](props)
                    setRefresh({})
                }}></Button>
        )
    },

    Checkbox: (props: any) => {
        const {
            htmlProps,
            xName,
            xValue,
            XLabel,
            XErrorDisplay,
            onChangeEvent,
            xClassName,
            xStyle,
        } = useGeneric(props)

        return (
            <>
                <div>
                    <XLabel />
                </div>
                <input
                    type="checkbox"
                    name={xName}
                    value={xValue}
                    checked={(!xValue ? false : true) || false}
                    onChange={(e) => onChangeEvent(e.target.checked)}
                    className={xClassName}
                    style={xStyle}
                    {...htmlProps}
                />
                <XErrorDisplay />
            </>
        )
    },

    //maybe not working correctly
    CheckboxMaterial: (props: any) => {
        const {
            xName,
            parent,
            item,
            xValue,
            XLabel,
            XErrorDisplay,
            xClassName,
            xStyle,
        } = useGeneric(props)

        const [, setRefresh] = useState({})

        function handleChange(e: any) {
            parent[item.name] = !parent[item.name]
            setRefresh({})
        }
        return (
            <>
                <div>
                    <XLabel />
                </div>
                <Checkbox
                    color="primary"
                    name={xName}
                    value={xValue || false}
                    onChange={(e: any) => {
                        console.log(e)
                    }}
                    className={xClassName}
                    style={xStyle}></Checkbox>
                <XErrorDisplay />
            </>
        )
    },

    Datepicker: (props: any) => {
        const { parent, item } = props
        const { XErrorDisplay, formId, controlId } = useGeneric(props)
        const isoDateFormat = 'YYYY-MM-DD'
        const classes = useStyles()
        const [, setRefresh] = useState({})

        const {
            getValidationFabric,
            setField,
            getField,
        } = manageFormsState()
        const { doValidateControl } = getValidationFabric()
        const theme = useTheme()
        // date validation format for <input type='date> is always iso date Format
        useEffect(() => {
            const curr = moment().format(isoDateFormat)
            const dt = getField(parent, item.name)
            dt || setField(parent, item.name, curr)
            setRefresh({})
        }, [])

        return (
            <>
                <TextField
                    InputLabelProps={{ shrink: true }} // the label is now fixed; not moving
                    className={classes.textField}
                    label={item.label}
                    inputProps={{
                        style: {
                            color: theme.palette.secondary.main,
                            width: '10rem',
                        },
                    }}
                    type="date"
                    // using onChangeEvent(e.target.value) has some editing problems with date control
                    onChange={(e: any) => {
                        setField(parent, item.name, e.target.value)
                        setRefresh({})
                    }}
                    onBlur={async (e: any) => {
                        await doValidateControl(formId, controlId)
                        setRefresh({})
                    }}
                    onFocus={(e) => {
                        e.target.select()
                    }}
                    value={getField(parent, item.name) || ''}></TextField>
                <XErrorDisplay></XErrorDisplay>
            </>
        )
    },

    DatepickerWithReset: (props: any) => {
        const { parent, item } = props
        const { XErrorDisplay, formId, controlId } = useGeneric(props)
        const isoDateFormat = 'YYYY-MM-DD'
        const classes = useStyles()
        const [, setRefresh] = useState({})

        const {
            getValidationFabric,
            setField,
            getField,
        } = manageFormsState()
        const { doValidateControl } = getValidationFabric()
        const theme = useTheme()
        // date validation format for <input type='date> is always iso date Format
        useEffect(() => {
            const curr = moment().format(isoDateFormat)
            const dt = getField(parent, item.name)
            // dt || setField(parent, item.name, curr)
            setRefresh({})
        }, [])

        return (
            <>
                <TextField
                    InputLabelProps={{ shrink: true }} // the label is now fixed; not moving
                    className={classes.textField}
                    label={item.label}
                    inputProps={{
                        style: {
                            color: theme.palette.secondary.main,
                            width: '10rem',
                        },
                    }}
                    type="date"
                    // using onChangeEvent(e.target.value) has some editing problems with date control
                    onChange={(e: any) => {
                        setField(parent, item.name, e.target.value)
                        setRefresh({})
                    }}
                    onBlur={async (e: any) => {
                        await doValidateControl(formId, controlId)
                        setRefresh({})
                    }}
                    onFocus={(e) => {
                        e.target.select()
                    }}
                    value={getField(parent, item.name) || ''}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton 
                                onClick= {()=>{
                                    setField(parent, item.name, '')
                                    setRefresh({})
                                }}
                                size='small' style={{ marginTop: '.5rem' }} >
                                    <Clear />
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />
                <XErrorDisplay></XErrorDisplay>
            </>
        )
    },

    Div: (props: any) => {
        const { item } = props
        return (
            <div {...item.htmlProps} className={item.class}>
                {item.label}
            </div>
        )
    },

    Hidden: (props: any) => {
        return null
    },

    Input: (props: any) => {
        const { item } = props
        const {
            htmlProps,
            XLabel,
            XErrorDisplay,
            xName,
            xValue,
            onChangeEvent,
            onBlurEvent,
        } = useGeneric(props)
        Object.assign(htmlProps, {
            onChange: (e: any) => onChangeEvent(e.target.value),
            onBlur: (e: any) => onBlurEvent(e.target.value),
        })

        return (
            <>
                <div>
                    <XLabel></XLabel>
                </div>
                <input
                    type="text"
                    className={item.class || htmlProps.class}
                    value={xValue || ''}
                    {...htmlProps}
                    name={xName}></input>
                <XErrorDisplay />
            </>
        )
    },

    InputMaterial: (props: any) => {
        const {
            controlId,
            formId,
            xName,
            xValue,
            xPlaceholder,
            XLabel,
            onChangeEvent,
            onBlurEvent,
            xClassName,
            xStyle,
            htmlProps,
            materialProps,
        } = useGeneric(props)
        const [, setRefresh] = useState({})
        const meta: any = useRef({
            isError: false,
            errorNode: null,
        })

        const { getValidationFabric }: any = manageFormsState()
        const { getItemErrors } = getValidationFabric()

        function getDisabled() {
            let ret = false
            if (htmlProps && htmlProps.disabled) {
                ret = true
            } else {
                props.disabled && (ret = props.disabled)
            }
            return ret
        }

        ; (function resolveError() {
            meta.current.isError = false
            meta.current.errorNode = null

            const errors: string[] = getItemErrors(formId, controlId).filter(
                Boolean
            )

            if (errors && errors.length > 0) {
                meta.current.errorNode = (
                    <>
                        {errors.map((err: any, index: number) => (
                            <li key={index}>{err}</li>
                        ))}
                    </>
                )
                meta.current.isError = true
            }
        })()

        return (
            <>
                <Input
                    size="small"
                    type="text"
                    label={<XLabel></XLabel> || ''}
                    value={xValue || ''}
                    placeholder={xPlaceholder}
                    name={xName}
                    onChange={(e) => {
                        let val = e.target.value
                        setRefresh({})
                        onChangeEvent(val)
                    }}
                    {...htmlProps}
                    {...materialProps}
                    onBlur={(e) => onBlurEvent(e.target.value)}
                    className={xClassName}
                    disabled={getDisabled()}
                    style={xStyle}></Input>
            </>
        )
    },

    Label: (props: any) => {
        const { item } = props
        return <label>{item.label}</label>
    },

    Money: (props: any) => {
        const { showLabel, item } = props
        const {
            xName,
            xValue,
            XLabel,
            XErrorDisplay,
            onChangeEvent,
            onBlurEvent,
            xClassName,
            xStyle,
            materialProps,
        } = useGeneric(props)

        const rightAligned = { textAlign: 'right', marginTop: '0.2rem' }

        return (
            <>
                <NumberFormat
                    thousandSeparator={true}
                    customInput={item.isNormal ? null : TextField}
                    fixedDecimalScale={true}
                    decimalScale={2}
                    onFocus={(e) => e.target.select()}
                    allowNegative={false}
                    disabled={item.disabled}
                    value={xValue || 0.0}
                    name={xName}
                    onChange={(e) => onChangeEvent(e.target.value)}
                    onBlur={(e) => onBlurEvent(e.target.value)}
                    className={xClassName}
                    style={{ ...rightAligned, ...xStyle }}
                    label={<XLabel></XLabel>}
                    {...materialProps}></NumberFormat>
                <XErrorDisplay />
            </>
        )
    },

    Numeric: (props: any) => {
        const { item } = props
        const {
            xName,
            xValue,
            XLabel,
            XErrorDisplay,
            onChangeEvent,
            onBlurEvent,
            xClassName,
            xStyle,
            materialProps,
        } = useGeneric(props)

        const rightAligned = { textAlign: 'right', marginTop: '0.2rem' }

        return (
            <>
                <NumberFormat
                    customInput={item.isNormal ? null : TextField}
                    onFocus={(e) => e.target.select()}
                    allowNegative={false}
                    disabled={item.disabled}
                    value={xValue || 0.0}
                    placeholder={item.placeholder}
                    name={xName}
                    onChange={(e) => onChangeEvent(e.target.value)}
                    onBlur={(e) => onBlurEvent(e.target.value)}
                    className={xClassName}
                    style={{ ...rightAligned, ...xStyle }}
                    label={<XLabel></XLabel>}
                    {...materialProps}></NumberFormat>
                <XErrorDisplay />
            </>
        )
    },

    Password: (props: any) => {
        const {
            xName,
            xValue,
            xPlaceholder,
            XLabel,
            XErrorDisplay,
            onChangeEvent,
            onBlurEvent,
            xClassName,
            xStyle,
        } = useGeneric(props)

        return (
            <>
                <div>
                    <XLabel></XLabel>
                </div>
                <input
                    type="password"
                    value={xValue || ''}
                    placeholder={xPlaceholder}
                    name={xName}
                    onChange={(e) => onChangeEvent(e.target.value)}
                    onBlur={(e) => onBlurEvent(e.target.value)}
                    className={xClassName}
                    style={xStyle}></input>
                <XErrorDisplay />
            </>
        )
    },

    Radio: (props: any) => {
        const {
            item,
            xName,
            xValue,
            XLabel,
            XErrorDisplay,
            onChangeEvent,
            xClassName,
            xStyle,
        } = useGeneric(props)

        const comp = (
            <>
                <div>
                    <XLabel />
                </div>
                {item.options.map((option: any, index: number) => {
                    return (
                        <div key={index}>
                            <label>
                                <input
                                    type="radio"
                                    checked={xValue === option.value}
                                    value={option.value}
                                    name={xName}
                                    onChange={(e) =>
                                        onChangeEvent(e.target.value)
                                    }
                                    className={xClassName}
                                    style={xStyle}
                                />
                                {option.label}
                            </label>
                        </div>
                    )
                })}
                <XErrorDisplay />
            </>
        )
        return comp
    },

    Select: (props: any) => {
        let { showLabel } = props
        const {
            xValue,
            xName,
            XLabel,
            XErrorDisplay,
            onChangeEvent,
            xClassName,
            xStyle,
            doInitForSelect,
            selectOptions,
        } = useGeneric(props)

        if (showLabel === undefined) {
            showLabel = true
        }

        useEffect(() => {
            let subs: any = {}
            doInitForSelect(subs)
            return () => {
                subs.sub1 &&
                    Object.keys(subs.sub1).length > 0 &&
                    subs.sub1.unsubscribe()
            }
        }, [])

        const comp = (
            <>
                {showLabel && (
                    <div>
                        <XLabel></XLabel>
                    </div>
                )}
                <select
                    onChange={(e) => onChangeEvent(e.target.value)}
                    name={xName}
                    value={xValue}
                    className={xClassName}
                    style={xStyle}>
                    {selectOptions.map((x: any, index: number) => (
                        <option key={index} value={x['value']}>
                            {x['label']}
                        </option>
                    ))}
                </select>
                <XErrorDisplay />
            </>
        )
        return comp
    },

    SelectMaterial: (props: any) => {
        let { showLabel } = props
        const {
            xValue,
            xName,
            XLabel,
            XErrorDisplay,
            onChangeEvent,
            xClassName,
            xStyle,
            doInitForSelect,
            selectOptions,
            materialProps,
        } = useGeneric(props)

        if (showLabel === undefined) {
            showLabel = true
        }

        useEffect(() => {
            let subs: any = {}
            doInitForSelect(subs)
            return () => {
                subs.sub1 &&
                    Object.keys(subs.sub1).length > 0 &&
                    subs.sub1.unsubscribe()
            }
        }, [])

        const comp = (
            <>
                {showLabel && (
                    <div>
                        <XLabel></XLabel>
                    </div>
                )}
                <NativeSelect
                    onChange={(e: any) => {
                        onChangeEvent(e.target.value)
                    }}
                    name={xName}
                    value={xValue || ''}
                    {...materialProps}
                    className={xClassName}
                    style={xStyle}>
                    {selectOptions.length > 0 &&
                        selectOptions.map((x: any, index: number) => (
                            <option key={index} value={x['value']}>
                                {x['label']}
                            </option>
                        ))}
                </NativeSelect>
                <XErrorDisplay />
            </>
        )
        return comp
    },

    Submit: (props: any) => {
        const { item, xClassName, xStyle } = props
        const { submitOnClick } = useSubmit(props)
        const className = xClassName || 'x-submit'
        return (
            <button
                className={className}
                style={xStyle}
                onClick={(e) => {
                    submitOnClick(e)
                }}>
                {item.label}
            </button>
        )
    },

    SubmitPrime: (props: any) => {
        const { item, xClassName, xStyle } = props
        const { submitOnClick } = useSubmit(props)
        const className = xClassName || 'x-submit'
        return (
            <Button
                className="p-button-success"
                icon="pi pi-check"
                style={xStyle}
                label={item.label}
                onClick={(e) => {
                    submitOnClick(e)
                }}></Button>
        )
    },

    Text: (props: any) => {
        const { showLabel } = props
        const {
            xName,
            xValue,
            xPlaceholder,
            XLabel,
            XErrorDisplay,
            onChangeEvent,
            onBlurEvent,
            xClassName,
            xStyle,
            htmlProps,
        } = useGeneric(props)
        const [, setRefresh] = useState({})
        function getDisabled() {
            let ret = false
            if (htmlProps && htmlProps.disabled) {
                ret = true
            } else {
                props.disabled && (ret = props.disabled)
            }
            return ret
        }

        return (
            <>
                {(showLabel || showLabel === undefined) && (
                    <div>
                        <XLabel></XLabel>
                    </div>
                )}
                <input
                    type="text"
                    value={xValue || ''}
                    placeholder={xPlaceholder}
                    name={xName}
                    onChange={(e) => {
                        let val = e.target.value
                        setRefresh({})
                        onChangeEvent(val)
                    }}
                    {...htmlProps}
                    onBlur={(e) => onBlurEvent(e.target.value)}
                    className={xClassName}
                    disabled={getDisabled()}
                    style={xStyle}></input>
                <XErrorDisplay />
            </>
        )
    },

    TextMaterial: (props: any) => {
        const {
            controlId,
            formId,
            xName,
            xValue,
            xPlaceholder,
            XLabel,
            onChangeEvent,
            onBlurEvent,
            xClassName,
            xStyle,
            htmlProps,
            materialProps,
        } = useGeneric(props)
        const [, setRefresh] = useState({})
        const meta: any = useRef({
            isError: false,
            errorNode: null,
        })

        const { getValidationFabric }: any = manageFormsState()
        const { getItemErrors } = getValidationFabric()

        function getDisabled() {
            let ret = false
            if (htmlProps && htmlProps.disabled) {
                ret = true
            } else {
                props.disabled && (ret = props.disabled)
            }
            return ret
        }

        ; (function resolveError() {
            meta.current.isError = false
            meta.current.errorNode = null

            const errors: string[] = getItemErrors(formId, controlId).filter(
                Boolean
            )

            if (errors && errors.length > 0) {
                meta.current.errorNode = (
                    <>
                        {errors.map((err: any, index: number) => (
                            <li key={index}>{err}</li>
                        ))}
                    </>
                )
                meta.current.isError = true
            }
        })()

        return (
            <>
                <TextField
                    error={meta.current.isError}
                    size="small"
                    helperText={meta.current.errorNode}
                    type="text"
                    label={<XLabel></XLabel> || ''}
                    value={xValue || ''}
                    placeholder={xPlaceholder}
                    name={xName}
                    onChange={(e) => {
                        let val = e.target.value
                        setRefresh({})
                        onChangeEvent(val)
                    }}
                    {...htmlProps}
                    {...materialProps}
                    onBlur={(e) => onBlurEvent(e.target.value)}
                    className={xClassName}
                    disabled={getDisabled()}
                    style={xStyle}></TextField>
            </>
        )
    },

    Textarea: (props: any) => {
        const { showLabel } = props
        const {
            xName,
            xValue,
            xPlaceholder,
            XLabel,
            XErrorDisplay,
            onChangeEvent,
            onBlurEvent,
            xStyle,
        } = useGeneric(props)
        const [, setRefresh] = useState({})

        return (
            <>
                {showLabel && (
                    <div>
                        <XLabel />
                    </div>
                )}
                <textarea
                    value={xValue || ''}
                    placeholder={xPlaceholder}
                    name={xName}
                    onChange={(e) => {
                        setRefresh({})
                        onChangeEvent(e.target.value)
                    }}
                    onBlur={(e) => onBlurEvent(e.target.value)}
                    style={xStyle}
                />
                <XErrorDisplay />
            </>
        )
    },

    //react-select library
    TypeSelect1: (props: any) => {
        let { showLabel } = props
        const {
            xValue,
            item,
            XLabel,
            XErrorDisplay,
            onChangeEvent,
            doInitForSelect,
            selectOptions,
        } = useGeneric(props)

        if (showLabel === undefined) {
            showLabel = true
        }

        useEffect(() => {
            let subs: any = {}
            doInitForSelect(subs)
            return () => {
                subs.sub1 &&
                    Object.keys(subs.sub1).length > 0 &&
                    subs.sub1.unsubscribe()
            }
        }, [])

        const valueObject = selectOptions.find((x: any) => x.value === xValue)

        const disabled = props?.item?.disabled || false
        const Comp = (
            <>
                {showLabel && (
                    <div>
                        <XLabel></XLabel>
                    </div>
                )}
                <Select
                    options={selectOptions}
                    value={valueObject}
                    placeholder={item.placeholder}
                    onChange={(e: any) => onChangeEvent(e.value)}
                    isDisabled={disabled}></Select>
                <XErrorDisplay />
            </>
        )
        return Comp
    },

    // using rwWidgets dropdown control
    TypeSelect: (props: any) => {
        let { showLabel } = props
        const {
            xValue,
            item,
            XLabel,
            XErrorDisplay,
            onChangeEvent,
            doInitForSelect,
            selectOptions,
        } = useGeneric(props)

        if (showLabel === undefined) {
            showLabel = true
        }

        useEffect(() => {
            let subs: any = {}
            doInitForSelect(subs)
            return () => {
                subs.sub1 &&
                    Object.keys(subs.sub1).length > 0 &&
                    subs.sub1.unsubscribe()
            }
        }, [])

        const disabled = props?.item?.disabled || false
        const valueObject = selectOptions.find((x: any) => x.value === xValue)
        const Comp = (
            <>
                {showLabel && (
                    <div>
                        <XLabel></XLabel>
                    </div>
                )}
                <Combobox
                    data={selectOptions}
                    value={valueObject}
                    placeholder={item.placeholder}
                    onChange={(e: any) => onChangeEvent(e.value)}
                    disabled={disabled}
                    textField="label"
                    valueField="value"
                    filter="contains"></Combobox>
                <XErrorDisplay />
            </>
        )
        return Comp
    },
}

export { componentStore }

const useStyles = makeStyles((theme) => ({
    container: {
        zIndex: 999999,
    },

    textField: {},
}))

/*

*/
