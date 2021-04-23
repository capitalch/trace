import React, { useState, useEffect } from "react"
import {
  Toolbar, Typography, Backdrop
  // , Button
  , Hidden
  , IconButton, Chip,
  Avatar, Box, Container, Paper
  , Dialog
  , DialogTitle
  , DialogActions, DialogContent, Theme, useTheme,
  createStyles, makeStyles
  , List, ListItem, ListItemAvatar, ListItemText, Grid
  , TextField, InputAdornment
} from '@material-ui/core'
import { Button } from 'primereact/button'
import { useGeneric } from "../core/generic-item"
import { useSubmit } from "../core/submit"
import NumberFormat from 'react-number-format'
import Combobox from 'react-widgets/lib/Combobox'
// import { InputMask } from 'primereact/inputmask'
import InputMask from 'react-input-mask'
import moment from 'moment'
import 'react-widgets/dist/css/react-widgets.css'
import { getArtifacts } from '../common/react-form-hook'
// import { Select } from "@material-ui/core"


const componentStore: any = {
  Button:
    (props: any) => {
      const { item } = props;
      let [, setRefresh] = useState({})
      const customMethods = getArtifacts('accounts').customMethods
      const className = item.className || "x-button";
      return (

        <button className={className} onClick={e => {
          customMethods[item.methodName](props);
          setRefresh({})
        }
        }>{item.label}
        </button>

      );
    },

  ButtonPrime:
    (props: any) => {
      const { item } = props;
      let [, setRefresh] = useState({})
      const customMethods = getArtifacts('accounts').customMethods
      const className = item.className || "x-button";
      return (
        <Button className={className} label={item.label} onClick={e => {
          customMethods[item.methodName](props);
          setRefresh({})
        }}>
        </Button>
      );
    },

  Checkbox:
    (props: any) => {
      const { xName
        , xValue
        , XLabel
        , XErrorDisplay
        , onChangeEvent
        , xClassName
        , xStyle } = useGeneric(props);

      return (
        <>
          <div><XLabel /></div>
          <input
            type="checkbox"
            name={xName}
            value={xValue}
            checked={(!xValue ? false : true) || false}
            onChange={e => onChangeEvent(e.target.checked)}
            className={xClassName}
            style={xStyle}
          />
          <XErrorDisplay />
        </>
      );
    },

  Datepicker:
    (props: any) => {
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
      const [, setRefresh] = useState({})

      useEffect(() => {
        const dt = (new Date()).toISOString().split('T')[0]
        parent[item.name] || (parent[item.name] = dt)
        setRefresh({})
      }, [])
      return (
        <>
          <div><XLabel></XLabel></div>
          <input
            type="date"
            value={xValue || ''}
            placeholder={xPlaceholder}
            name={xName}
            onChange={e => onChangeEvent(e.target.value)}
            onBlur={e => onBlurEvent(e.target.value)}
            className={xClassName}
            style={xStyle}
          />
          <XErrorDisplay></XErrorDisplay>
        </>
      )
    },

  Div: (props: any) => {
    const { item } = props
    return <div {...item.htmlProps} className={item.class}>{item.label}</div>
  },

  Hidden: (props: any) => {
    const { xName
      , xValue
    } = useGeneric(props);
    return (null
    )
  },

  Input: (props: any) => {
    const { item } = props
    const { htmlProps, XLabel, XErrorDisplay, xName, xValue, onChangeEvent, onBlurEvent } = useGeneric(props)
    Object.assign(htmlProps
      , {
        onChange: (e: any) => onChangeEvent(e.target.value)
        , onBlur: (e: any) => onBlurEvent(e.target.value)
      })
    return <>
      <div><XLabel></XLabel></div>
      <input
        type="text"
        className={item.class || htmlProps.class}
        value={xValue || ''}
        {...htmlProps}
        name={xName}>
      </input>
      <XErrorDisplay />
    </>
  },

  Label: (props: any) => {
    const { item } = props
    return <label >{item.label}</label>
  },

  Money: (props: any) => {
    const { showLabel, item } = props
    const { xName
      , xValue
      , xPlaceholder
      , XLabel
      , XErrorDisplay
      , onChangeEvent
      , onBlurEvent
      , xClassName
      , xStyle
    } = useGeneric(props)

    const rightAligned = { textAlign: 'right' }

    return (
      <>
        {(showLabel || item.showLabel) && <div><XLabel></XLabel></div>}
        <NumberFormat
          thousandSeparator={true}
          // thousandsGroupStyle="lakh"
          // prefix={'₹ '}
          fixedDecimalScale={true}
          decimalScale={2}
          onFocus={e => e.target.select()}
          allowNegative={false}
          disabled={item.disabled}
          value={xValue || 0.00}
          placeholder={item.placeholder}
          name={xName}
          onChange={e => onChangeEvent(e.target.value)}
          onBlur={e => onBlurEvent(e.target.value)}
          className={xClassName}
          style={{ ...rightAligned, ...xStyle }}
        ></NumberFormat>
        <XErrorDisplay />
      </>
    )
  },

  Password:
    (props: any) => {
      // const { item } = props;
      const { xName
        , xValue
        , xPlaceholder
        , XLabel
        , XErrorDisplay
        , onChangeEvent
        , onBlurEvent
        , xClassName
        , xStyle
      } = useGeneric(props);

      return (
        <>
          <div><XLabel></XLabel></div>
          <input
            type="password"
            value={xValue || ""}
            placeholder={xPlaceholder}
            name={xName}
            onChange={e => onChangeEvent(e.target.value)}
            onBlur={e => onBlurEvent(e.target.value)}
            className={xClassName}
            style={xStyle}
          ></input>
          <XErrorDisplay />
        </>
      )
    },

  Radio:
    (props: any) => {
      const { item
        , xName
        , xValue
        , XLabel
        , XErrorDisplay
        , onChangeEvent
        , xClassName
        , xStyle } = useGeneric(props);

      const comp = (
        <>
          <div><XLabel /></div>
          {item.options.map((option: any, index: number) => {
            return (
              <div key={index}>
                <label>
                  <input
                    type="radio"
                    checked={xValue === option.value}
                    value={option.value}
                    name={xName}
                    onChange={e => onChangeEvent(e.target.value)}
                    className={xClassName}
                    style={xStyle}
                  />
                  {option.label}
                </label>
              </div>
            );
          })}
          <XErrorDisplay />
        </>
      )
      return comp
    },

  Select:
    (props: any) => {
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
        selectOptions
      } = useGeneric(props)

      if (showLabel === undefined) {
        showLabel = true
      }

      useEffect(() => {
        let subs: any = {}
        doInitForSelect(subs)
        return (() => {
          subs.sub1 && (Object.keys(subs.sub1).length > 0) && subs.sub1.unsubscribe()
        })
      }, [])

      const comp = (
        <>
          {showLabel && <div><XLabel></XLabel></div>}
          <select
            onChange={e => onChangeEvent(e.target.value)}
            name={xName}
            value={xValue}
            className={xClassName}
            style={xStyle}> {selectOptions.map((x: any, index: number) => (
              <option key={index} value={x["value"]}>
                {x["label"]}
              </option>
            ))}</select>
          <XErrorDisplay />
        </>
      );
      return comp
    },

  Submit:
    (props: any) => {
      const { item, xClassName,
        xStyle } = props;
      const { submitOnClick } = useSubmit(props);
      const className = xClassName || "x-submit";
      return (
        // <div className={className}>
        <button
          className={className}
          style={xStyle}
          onClick={e => {
            submitOnClick(e);
          }}>
          {item.label}
        </button>
      )
    },

  SubmitPrime:
    (props: any) => {
      const { item, xClassName,
        xStyle } = props;
      const { submitOnClick } = useSubmit(props);
      const className = xClassName || "x-submit";
      return (
        // <div className={className}>
        <Button
          className="p-button-success"
          icon="pi pi-check"
          style={xStyle}
          label={item.label}
          onClick={e => {
            submitOnClick(e);
          }}>

        </Button>
      )
    },

  Text:
    (props: any) => {
      const { showLabel } = props
      const { xName
        , xValue
        , xPlaceholder
        , XLabel
        , XErrorDisplay
        , onChangeEvent
        , onBlurEvent
        , xClassName
        , xStyle
        , htmlProps
      } = useGeneric(props)
      const [,setRefresh] = useState({})
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
          {(showLabel || showLabel === undefined) && <div><XLabel></XLabel></div>}
          <input
            type="text"
            value={xValue || ""}
            placeholder={xPlaceholder}
            name={xName}
            onChange={e => {
              let val = e.target.value
              setRefresh({})
              onChangeEvent(val)
            }}
            {...htmlProps}
            onBlur={e => onBlurEvent(e.target.value)}
            className={xClassName}
            disabled={getDisabled()}
            style={xStyle}
          ></input>
          <XErrorDisplay />
        </>
      )
    },

    TextMaterial:
    (props: any) => {
      const { showLabel } = props
      const { xName
        , xValue
        , xPlaceholder
        , XLabel
        , XErrorDisplay
        , onChangeEvent
        , onBlurEvent
        , xClassName
        , xStyle
        , htmlProps
      } = useGeneric(props)
      const [,setRefresh] = useState({})
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
          {(showLabel || showLabel === undefined) && <div><XLabel></XLabel></div>}
          <TextField
            type="text"
            value={xValue || ""}
            placeholder={xPlaceholder}
            name={xName}
            onChange={e => {
              let val = e.target.value
              setRefresh({})
              onChangeEvent(val)
            }}
            {...htmlProps}
            onBlur={e => onBlurEvent(e.target.value)}
            className={xClassName}
            disabled={getDisabled()}
            style={xStyle}
          ></TextField>
          <XErrorDisplay />
        </>
      )
    },

  Textarea:
    (props: any) => {
      const { showLabel } = props
      const { xName,
        xValue,
        xPlaceholder,
        XLabel,
        XErrorDisplay,
        onChangeEvent,
        onBlurEvent,
        xStyle } = useGeneric(props);
        const [,setRefresh] = useState({})
      return (
        <>
          {showLabel && <div><XLabel /></div>}
          <textarea
            value={xValue || ""}
            placeholder={xPlaceholder}
            name={xName}
            onChange={e => {
              setRefresh({})
              onChangeEvent(e.target.value)
            } }
            onBlur={e => onBlurEvent(e.target.value)}
            style={xStyle}
          />
          <XErrorDisplay />
        </>
      );
    },

  TypeSelect: (props: any) => {
    let { showLabel } = props
    const {
      xValue, item,
      XLabel,
      XErrorDisplay,
      onChangeEvent,
      onBlurEvent,
      onBlur,
      doInitForSelect,
      selectOptions
    } = useGeneric(props)

    if (showLabel === undefined) {
      showLabel = true
    }

    useEffect(() => {
      let subs: any = {}
      doInitForSelect(subs)
      return (() => {
        subs.sub1 && (Object.keys(subs.sub1).length > 0) && subs.sub1.unsubscribe()
      })
    }, [])

    const disabled = props?.item?.disabled || false
    const Comp = (
      <>
        {showLabel && <div><XLabel></XLabel></div>}
        <Combobox
          data={selectOptions}
          value={xValue}
          placeholder={item.placeholder}
          onChange={e => onChangeEvent(e.value)}
          // inputProps={disable:true}
          disabled={disabled}
          textField="label"
          valueField="value"
          filter='contains'
        >
        </Combobox>
        <XErrorDisplay />
      </>
    )
    return Comp
  },


  //Not working correctly with react-select library
  // TypeSelect1: (props: any) => {
  //   const {
  //     xName,
  //     XLabel,
  //     XErrorDisplay,
  //     xClassName,
  //     doInitForSelect,
  //     selectOptions,
  //     xSelectedObject
  //   } = useGeneric(props);
  //   const ctrl: any = useRef()
  //   useEffect(() => {
  //     let subs: any = {}
  //     doInitForSelect(subs)

  //     return (() => {
  //       subs.sub1 && (Object.keys(subs.sub1).length > 0) && subs.sub1.unsubscribe()
  //     })
  //   }, []);

  //   const options = selectOptions.map((x: any, index: number) => {
  //     const opt = { value: x["value"].toString(), label: x["label"] }
  //     return opt
  //   })

  //   const comp = (
  //     <>
  //       <div><XLabel /></div>
  //       <Select ref={ctrl}
  //         // onChange={(selectedItem: any, stateAndHelpers: object) => {
  //         //   // setLocalValue(selectedItem)
  //         //   onChangeEvent(selectedItem.value)
  //         // }}
  //         name={xName}
  //         // defaultValue={xSelectedObject}
  //         value={xSelectedObject}
  //         className={xClassName}
  //         options={options}>
  //         ))}</Select>
  //       <XErrorDisplay />
  //     </>
  //   );
  //   return comp;
  // }
}

export { componentStore }

/*

*/
