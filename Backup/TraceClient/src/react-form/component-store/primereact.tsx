import React, { useEffect } from 'react';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { RadioButton } from 'primereact/radiobutton';
import { Button } from 'primereact/button';
import { Checkbox } from 'primereact/checkbox';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import {Password} from 'primereact/password';
import { useGeneric } from "../core/generic-item";
import { useSubmit } from "../core/submit";

import 'primereact/resources/themes/nova-light/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

const componentStore: any = {
    Radio:  (props: any) => {
        const { item, xName, xValue, XLabel,
            XErrorDisplay, onChangeEvent, xClassName,
            xStyle } = useGeneric(props);
        const comp = <>
            <XLabel></XLabel>
            {item.options.map((option: any, index: number) => {
                return <div key={index} className="p-radio">
                    <label className="p-radiobutton-label">
                        <RadioButton
                            inputId={String(index)}
                            key={index}
                            checked={xValue === option.value}
                            value={option.value}
                            name={xName}
                            className={xClassName}
                            style={xStyle}
                            onChange={(e: any) => onChangeEvent(e.target.value)} />
                        {/* <label htmlFor={String(index)} className="p-radiobutton-label" >{option.label}</label> */}
                        {option.label}</label>
                    {/* <div className="p-radiobutton-label"><label >{option.label}</label></div> */}
                </div>
            })
            }
            <XErrorDisplay></XErrorDisplay>
        </>
        return comp;
    },

    Select:  (props: any) => {
        const {
            // item,
            xValue,
            // xName,
            XLabel,
            XErrorDisplay,
            onChangeEvent, xClassName, xStyle, doInitForSelect, selectOptions
        } = useGeneric(props);
        // let [options, setOptions]: any = useState([]);

        // async function doInit() {
        //     const itemOptions = item.options;
        //     if (!itemOptions) { return; }
        //     if (Array.isArray(itemOptions)) {
        //         (itemOptions.length > 0) && (options = itemOptions);
        //     } else if (itemOptions.methodName) {
        //         const args = itemOptions.args;
        //         options = await customMethods[itemOptions.methodName](args); //the customMethod returns array of type {label:'', value:''}
        //     } else if (itemOptions.url) {
        //         const labelName = itemOptions.labelName;
        //         const valueName = itemOptions.valueName;
        //         const tempOptions: any = await ibuki.httpPost(itemOptions.url, {});
        //         options = tempOptions.data.map((x: any) => {
        //             const ret = {
        //                 label: labelName ? x[labelName] : x.label,
        //                 value: valueName ? x[valueName] : x.value
        //             }
        //             return ret;
        //         });
        //         itemOptions.addDefault && (options.unshift({ label: "---select---", value: "" }))
        //     }
        //     setOptions([...options]); //cloning options for refresh
        // }

        useEffect(() => {
            doInitForSelect();
        }, [xValue])

        const comp = <>
            <div><XLabel></XLabel></div>
            <Dropdown
                options={selectOptions}
                value={xValue}
                className={xClassName}
                style={xStyle}
                onChange={
                    (e: any) => {
                        onChangeEvent(e.value);
                    }
                }
            />
            <XErrorDisplay></XErrorDisplay>
        </>
        return comp;
    },

    Text:  (props: any) => {
        const { xName, xValue, xPlaceholder, XLabel, XErrorDisplay, onChangeEvent, onBlurEvent, xClassName, xStyle } = useGeneric(props);
        return <>
            <div><XLabel></XLabel></div>
            <InputText
                value={xValue || ''}
                placeholder={xPlaceholder}
                name={xName}
                className={xClassName}
                style={xStyle}
                onChange={(e: any) => onChangeEvent(e.target.value)}
                onBlur={(e) => onBlurEvent(e.target.value)} />
            <XErrorDisplay></XErrorDisplay>
        </>
    },

    Password:  (props: any) => {
        const { xName, xValue, xPlaceholder, XLabel, XErrorDisplay, onChangeEvent, onBlurEvent, xClassName, xStyle } = useGeneric(props);
        return <>
            <div><XLabel></XLabel></div>
            <Password
                value={xValue || ''}
                placeholder={xPlaceholder}
                name={xName}
                className={xClassName}
                style={xStyle}
                onChange={(e: any) => onChangeEvent(e.target.value)}
                onBlur={(e: any) => onBlurEvent(e.target.value)} />
            <XErrorDisplay></XErrorDisplay>
        </>
    },

    Checkbox:  (props: any) => {
        const { xName, XLabel, XErrorDisplay, onChangeEvent, xClassName, xStyle } = useGeneric(props);
        return <div>
            <XLabel></XLabel>
            <Checkbox
                name={xName}
                // checked={xValue || false}
                className={xClassName}
                style={xStyle}
                onChange={(e: any) => onChangeEvent(e.target.checked)}
            ></Checkbox>
            <XErrorDisplay></XErrorDisplay>
        </div>
    },

    Textarea:  (props: any) => {
        const { xName, xValue, XLabel, XErrorDisplay, onChangeEvent, onBlurEvent, xClassName, xStyle } = useGeneric(props);
        return <div className="x-container">
            <div>
                <XLabel></XLabel>
            </div>
            <InputTextarea rows={5} cols={30}
                value={xValue || ''}
                name={xName}
                className={xClassName}
                style={xStyle}
                onChange={(e: any) => onChangeEvent(e.target.value)}
                onBlur={(e) => onBlurEvent(e.target.value)} />
            <XErrorDisplay></XErrorDisplay>
        </div>
    },

    Button:  (props: any) => {
        return <button disabled={props.disabled} onClick={props.onClick}>{props.label}</button>
    },

    Datepicker:  (props: any) => {
        const { xName, XLabel, XErrorDisplay, onChangeEvent, xClassName, xStyle } = useGeneric(props);
        return <div className="x-container">
            <div><XLabel></XLabel></div>
            <Calendar
                // value={xValue || ''}
                name={xName}
                className={xClassName}
                style={xStyle}
                onChange={(e: any) => onChangeEvent(e.target.value)} />
            <XErrorDisplay></XErrorDisplay>
        </div>
    },

    Submit:  (props: any) => {
        const { item,  xClassName } = props;
        const { submitOnClick } = useSubmit(props);
        // const className = item.className || "x-submit";
        const className = (xClassName || '').concat(' ', 'p-button-raised');
        return (
            // <div>
            <Button
                label={item.label}
                className={className}
                onClick={e => {
                    submitOnClick(e);
                }}>

            </Button>
            // {/* <div>{isBusy ? 'True' : 'False'}</div> */}
            // </div>
        );
    }
}

export { componentStore };

/*
radio: (props: any) => {
const {item, xName, XLabel, XErrorDisplay, onChangeEvent } = useGeneric(props);
const comp = <div className="x-container">
    <div className="x-label">
        <XLabel></XLabel>
    </div>
    {
        item.options.map((option: any, index: number) => {
            return <div key={index} className="p-radio">
                <RadioButton value={option.value}
                    name={xName} key={index}
                    onChange={(e: any) => onChangeEvent(e, e.target.value)} />
                <div className="p-radiobutton-label"><label >{option.label}</label></div>
            </div>
        })
    }
    <XErrorDisplay></XErrorDisplay>
</div>
return comp;
}
*/