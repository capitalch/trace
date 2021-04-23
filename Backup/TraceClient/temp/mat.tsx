import React, { useState, useEffect } from "react";
import { useGeneric } from "../core/generic-item";
import { useSubmit } from "../core/submit";
import TextField from '@material-ui/core/Textfield';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';

const componentStore: any = {
  Radiogroup: (props: any) => {
    const { item, xName, xValue, XLabel, XErrorDisplay, onChangeEvent, xClassName, xStyle } = useGeneric(props);
    const comp = <>
      {/* <fieldset>
                <legend><XLabel></XLabel></legend> */}
      <RadioGroup
        onChange={(e, v) => onChangeEvent(v)}
        className={xClassName}
        style={xStyle}
        name={xName}>
        {
          item.options.map((option: any, index: number) => {
            return <FormControlLabel key={index} value={option.value} control={<Radio checked={xValue === option.value} />}
              label={option.label} />
          })
        }
      </RadioGroup>
      {/* </fieldset> */}
      <XErrorDisplay></XErrorDisplay>
    </>
    return comp;
  },

  Radio: (props: any) => {
    const { item, xName, XLabel, xValue, XErrorDisplay, onChangeEvent, xClassName, xStyle } = useGeneric(
      props
    );
    const comp = (
      <>
        <XLabel />
        {item.options.map((option: any, index: number) => {
          return (
            <FormControlLabel key={index} control={
              <Radio
                checked={xValue === option.value}
                className={xClassName}
                style={xStyle}
                onChange={e => onChangeEvent(e.target.value)}
                value={option.value}
                name={xName}
              ></Radio>} label={option.label}>
            </FormControlLabel>
          );
        })}
        <XErrorDisplay />
      </>
    );
    return comp;
  },

  Select : (props: any) => {
    const { item, xValue, xName, XLabel, XErrorDisplay,
      onChangeEvent, xClassName, xStyle, doInitForSelect, selectOptions } = useGeneric(props);
    // let [options, setOptions]: any = useState([]);

    // async function doInit() {
    //   const itemOptions = item.options;
    //   if (!itemOptions) { return; }
    //   if (Array.isArray(itemOptions)) {
    //     (itemOptions.length > 0) && (options = itemOptions);
    //   } else if (itemOptions.methodName) {
    //     const args = itemOptions.args;
    //     options = await customMethods[itemOptions.methodName](args); //the customMethod returns array of type {label:'', value:''}
    //   } else if (itemOptions.url) {
    //     const labelName = itemOptions.labelName;
    //     const valueName = itemOptions.valueName;
    //     const tempOptions: any = await ibuki.httpPost(itemOptions.url, {});
    //     options = tempOptions.data.map((x: any) => {
    //       const ret = {
    //         label: labelName ? x[labelName] : x.label,
    //         value: valueName ? x[valueName] : x.value
    //       }
    //       return ret;
    //     });
    //     itemOptions.addDefault && (options.unshift({ label: "---select---", value: "" }))
    //   }
    //   setOptions([...options]); //cloning options for refresh
    // }

    useEffect(() => {
      doInitForSelect();
    }, [xValue])

    const comp = <>
      <XLabel></XLabel>
      <Select
        onChange={(e) => { onChangeEvent(e.target.value) }}
        name={xName}
        className={xClassName}
        style={xStyle}
        value={xValue || ''}
      >
        {
          selectOptions.map((x: any, index: number) =>
            <MenuItem key={index} value={String(x['value'])}>{x['label']}</MenuItem>
          )
        }
      </Select>
      <XErrorDisplay></XErrorDisplay>
    </>
    return comp;
  },

  Text: (props: any) => {
    const { xName, xValue, xPlaceholder, XLabel, XErrorDisplay, onChangeEvent, onBlurEvent, xClassName, xStyle } = useGeneric(props);
    return <>
      <XLabel></XLabel>
      <TextField 
      type='text'
        value={xValue || ''}
        placeholder={xPlaceholder}
        name={xName}
        className={xClassName}
        style={xStyle}
        onChange={(e) => onChangeEvent(e.target.value)}
        onBlur={(e) => onBlurEvent(e.target.value)}
      ></TextField>
      <XErrorDisplay></XErrorDisplay>
    </>
  },

  Password: (props: any) => {
    const { xName, xValue, xPlaceholder, XLabel, XErrorDisplay, onChangeEvent, onBlurEvent, xClassName, xStyle } = useGeneric(props);
    return <>
      <XLabel></XLabel>
      <TextField type='password'
        value={xValue || ''}
        placeholder={xPlaceholder}
        name={xName}
        className={xClassName}
        style={xStyle}
        onChange={(e) => onChangeEvent(e.target.value)}
        onBlur={(e) => onBlurEvent(e.target.value)}
      ></TextField>
      <XErrorDisplay></XErrorDisplay>
    </>
  },

  Checkbox: (props: any) => {
    const { xName, xValue, XLabel, XErrorDisplay, onChangeEvent, xClassName, xStyle } = useGeneric(props);
    return <>
      <XLabel></XLabel>
      <Checkbox
        name={xName}
        // checked={xValue || false}
        className={xClassName}
        style={xStyle}
        onChange={(e) => onChangeEvent(e.target.checked)}
      />
      <XErrorDisplay></XErrorDisplay>
    </>
  },

  Textarea: (props: any) => {
    const { xName, xValue, xPlaceholder, XLabel, XErrorDisplay, onChangeEvent, onBlurEvent, xClassName, xStyle } = useGeneric(props);
    return <>
      <XLabel></XLabel>
      <TextField
        multiline
        placeholder={xPlaceholder}
        name={xName}
        value={xValue || ''}
        onChange={(e) => onChangeEvent(e.target.value)}
        onBlur={(e) => onBlurEvent(e.target.value)}
        margin="normal"
        className={xClassName}
        style={xStyle}
        variant="filled" />
      <XErrorDisplay></XErrorDisplay>
    </>
  },

  Datepicker: (props: any) => {
    const { xName, xValue, xPlaceholder, XLabel, XErrorDisplay, onChangeEvent, onBlurEvent, xClassName, xStyle } = useGeneric(props);
    const className = 'mat-input-date'; //(xClassName || '').concat(' ', 'mat-input-date' )
    return <div className="x-container">
      <XLabel></XLabel>
      <TextField type='date'
        value={xValue || ''}
        placeholder={xPlaceholder}
        name={xName}
        className="mat-input-date"
        style={xStyle}
        onChange={(e) => onChangeEvent(e.target.value)}
        onBlur={(e) => onBlurEvent(e.target.value)}
      ></TextField>
      <div className="x-error">
        <XErrorDisplay></XErrorDisplay>
      </div>
    </div>
  },

  Submit: (props: any) => {
    const { item, callbacks, dataHolder, xClassName, xStyle } = props;
    const { submitOnClick, isBusy } = useSubmit(props);
    const className = item.className || "x-submit";
    return (
      <div className={className}>

        <Button
          variant="contained"
          color="primary"
          className={xClassName}
          style={xStyle}
          onClick={e => {
            submitOnClick(e);
          }}>
          {item.label}
        </Button>
        {/* <div>{isBusy ? 'True' : 'False'}</div> */}
      </div>
    );
  }
};
export { componentStore };

