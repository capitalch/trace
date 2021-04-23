import React, { useState, useEffect } from "react"
import { ErrorDisplay } from "./error-display"
import { manageFormsState } from "./fsm"
import {useAjax} from '../common/ajax'
import { getArtifacts } from '../common/react-form-hook'

const useGeneric = (props: any) => {

  const { httpPost, httpGet } = useAjax()
  const { parent, item, idx, parentId, formId, onBlur } = props
  const { initField, setField, getUseIbuki, getValidationFabric } = manageFormsState()
  const { doValidateControl } = getValidationFabric()
  const useIbuki = getUseIbuki() // ibuki is obtained from the main application. There is no ibuki for the react-form
  const { emit, filterOn, hotFilterOn } = useIbuki()
  // At topmost control idx is undefined because it's not present in props.
  // idx is meaningful when you use Range, otherwise it is always undefined
  const idx1 = idx || ''; // to convert undefined to ''. Otherwise undefined word is appended to item.name while calling setValidators()
  const controlId = parentId.concat('.', item.name, idx1); //unique controlId. It will always be same for same control
  let customMethods = getArtifacts(props.name)['customMethods']

  const [, setRefresh] = useState({})
  const { registerItemValidators } = getValidationFabric()

  const [selectedObject, setSelectedObject]: any = useState({})
  const validations = item.validations
  const doValidationsExist: boolean = validations && Array.isArray(validations) && validations.length > 0
  let [selectOptions, setSelectOptions]: any = useState([]) // for select controls

  const XLabel = () => {
    const isRequired: Boolean = Array.isArray(item.validations) && (item.validations.length > 0) && (item.validations.find((ele: any) => ele.name === 'required'))
    const MySpan = () => isRequired ? <span style={{ color: 'red' }} >{'* '}</span> : null
    const ret = item.label && <label><MySpan></MySpan>{item.label}</label>
    return ret
  }
  const XErrorDisplay = () => <ErrorDisplay controlId={controlId} formId={formId} />

  useEffect(() => {
    let subs: any = {}
    if (item.ibukiFilterOnMessage) {
      const message = item.ibukiFilterOnMessage
      subs = filterOn(message).subscribe((d: any) => {
        setField(parent, item.name, d.data)
        setRefresh({})
      })
    }
    return (() => {
      subs && (Object.keys(subs).length > 0) && subs.unsubscribe()
    })
  }, [])

  useEffect(() => {
    let value = ''
    if (item.value) {
      value = item.value
    } else if (item.default) {
      value = item.default
    }
    //initField does not overwrite old value, but setField overwrite old value.
    // Requirement is if you specifically mention 'value' property in json object, it should overwrite old value, otherwise old value should be retained
    // Following code is written because in javascript item.value gives falsy if value is undefined / not there / '' / false
    if ('value' in item) {
      setField(parent, item.name, value)
    } else {
      initField(parent, item.name, value)
    }
    // last param of register function is anonymous function which obtains the value of control at execution time.
    // This is important for keeping all the validations in single array. This entire array of all validations can be executed 
    // during submit and automatically the latest value of all controls is found and validated.
    doValidationsExist && registerItemValidators(props.name, formId, controlId, item, () => parent[item.name])
    setRefresh({})
  }, [formId])


  // const onChangeValidations = validations && Array.isArray(validations) && (validations.length > 0)
  //   && validations.filter((x: any) =>
  //     (x['onChange'] === true) || ((x['onChange'] === undefined) && (x['onBlur'] === undefined)));
  // const onBlurValidations = validations && Array.isArray(validations) && (validations.length > 0)
  //   && validations.filter((x: any) =>
  //     (x['onBlur'] === true) || ((x['onChange'] === undefined) && (x['onBlur'] === undefined)));



  async function onChangeEvent(value: any) {
    setField(parent, item.name, value)
    await doValidateControl(formId, controlId)
    customMethods = getArtifacts(props.name)['customMethods'] // new added on 07-05-2020
    item.onChange && customMethods[item.onChange](value)
    setRefresh(({}))
    // if (onChangeValidations && (onChangeValidations.length > 0)) {
    //   for (let a of onChangeValidations) {
    //     // await doValidate(a, value);
    //   }
    // }
    if (item.ibukiEmitMessage) {
      emit(item.ibukiEmitMessage, value)
    }
  }

  async function onBlurEvent(value: any) {
    await doValidateControl(formId, controlId)
    setRefresh(({}))
    // item.onBlur && customMethods[item.onBlur](value)
    // if (onBlurValidations && (onBlurValidations.length > 0)) {
    //   for (let a of onBlurValidations) {
    //     // await doValidate(a, value);
    //   }
    // }
  }

  async function doInitForSelect(subs: any = undefined) {
    const itemOptions = item.options;

    let tempOptions: any[] = [];
    if (!itemOptions) { return; }
    if (Array.isArray(itemOptions)) {
      // (itemOptions.length > 0) && (setSelectOptions([...itemOptions]));
      (itemOptions.length > 0) && (tempOptions = itemOptions)
    } else if (itemOptions.methodName) {
      const args = itemOptions.args || []
      tempOptions = await customMethods[itemOptions.methodName](args) //the customMethod returns array of type {label:'', value:''}
      // setSelectOptions([...tempOptions])
    } else if (itemOptions.subscriptionName) {
      const args = itemOptions.args || []
      subs.sub1 = await customMethods[itemOptions.subscriptionName]({ item, setSelectOptions, setSelectedObject }) // custom method calls the setSelectOptions method after receiveing the data maybe later asyncronously
    } else if (itemOptions.url) {
      const labelName = itemOptions.labelName;
      const valueName = itemOptions.valueName;
      let method = itemOptions.httpmethod;
      method = method || 'httpPost';
      let temp
      if (method === 'httpPost') {
        temp = await httpPost(itemOptions.url, {})
      } else {
        temp = await httpGet(itemOptions.url);
      }
      tempOptions = temp.data.map((x: any) => {
        return {
          label: labelName ? x[labelName] : x.label,
          value: valueName ? x[valueName] : x.value
        }
      })
      itemOptions.addDefault && (tempOptions.unshift({ label: "---select---", value: "" }))
    } else if (itemOptions.ibukiFilterOnMessage) {
      const message = itemOptions.ibukiFilterOnMessage
      subs.sub1 = filterOn(message).subscribe((d: any) => {
        setSelectOptions([...d.data])
        // tempOptions = d.data
      })
    } else if (itemOptions.ibukiHotFilterOnMessage) {
      const message = itemOptions.ibukiHotFilterOnMessage
      subs.sub1 = hotFilterOn(message).subscribe((d: any) => {
        setSelectOptions([...d.data])
        // tempOptions = d.data
      })
    }

    // setting the default value of select box parent[item.name] is value of select box
    if (!parent[item.name]) {
      if (selectOptions.length > 0) {
        parent[item.name] = selectOptions[0].value
      } else {
        parent[item.name] = ''
      }
    }
    if (tempOptions && (Object.keys(tempOptions).length > 0)) {
      setSelectOptions([...tempOptions])
    }
  }

  return {
    item: item,
    parent: parent,
    xName: item.name,
    xValue: parent[item.name],
    xPlaceholder: item.placeholder,
    XLabel: XLabel,
    XErrorDisplay: XErrorDisplay,
    onChangeEvent: onChangeEvent,
    onBlurEvent: onBlurEvent,
    xClassName: item.class,
    xStyle: item.style,
    doInitForSelect: doInitForSelect,
    selectOptions: selectOptions,
    htmlProps: item.htmlProps,
    entityName: props.name,
    formId: formId,
    controlId: controlId,
    getUseIbuki,
    xSelectedObject: selectedObject,
    onBlur: onBlur
  }
}

export { useGeneric }
/*


*/