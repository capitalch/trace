import React, { useState } from 'react'
// import Select from 'react-select'
import styled from 'styled-components'
// import { Combobox, DropdownList } from 'react-widgets'
import 'react-widgets/dist/css/react-widgets.css'
import './component2.scss'


const Component2 = (props: any) => {
    let [xClass, setXClass]: any = useState('d4-normal')
    const comp = <div className='c1'>
        <button onClick={(e:any)=>{
            setXClass('d4-transformed')
            setTimeout(()=>{setXClass('d4-normal')}, 1000)


            // if(xClass === 'd4-normal'){
            //     setXClass('d4-transformed')
            // } else {
            //     setXClass('d4-normal')
            // }
            
        }}>Click</button>
        <div className='d1'>Div1</div>
        <div className='d2'>Div2</div>
        <div className='d3'>Div3</div>
        <div className={xClass}><label>Data saved</label></div>
        <div className='d5'>Div5</div>
        <div className='d6'>Div6</div>
        <div className='d7'>Div7</div>
        <div className='d8'>Div8</div>
    </div>
    return comp
}


export { Component2 }


const DropDownList = (props: any) => {
    const { options } = props
    let [selected, setSelected]: any = useState({})
    let [textValue, setTextValue] = useState('')
    let [editMode, setEditMode] = useState(false)

    function getSelectedLabel() {
        const selectedObject = options.find((x: any) => x.value.toString() === selected)
        let ret
        if (editMode) {
            ret = textValue
        } else {
            ret = selectedObject ? selectedObject.label : ''
        }
        return (ret)
    }


    return <Div>
        <Select
            onChange={(e: any) => { setSelected(e.target.value); setEditMode(false) }}>
            {/* onFocus = {
                (e: any) => console.log('select id:', e.currentTarget.id)
            } */}
            {options.map((item: any, index: any) => {
                return <option key={index} value={item.value}>{item.label}</option>
            })}
        </Select>
        <Input type="text" value={getSelectedLabel()}
            onChange={(e) => { setTextValue(e.target.value) }}
            onFocus={(e) => {
                setEditMode(true);
                console.log('id:', e.currentTarget.id)
            }}
        ></Input>
    </Div>


}
const Div = styled.div`
        position: relative;
        width: 200px;
        height:25px;
        border:0;
        margin:0;
        padding:0;`

const Select = styled.select`
        position: absolute;
        top: 0px;
        left: 0px;
        width: 200px;
        height:25px;
        line-height:20px;
        margin:0;
        padding:0
    `

const Input = styled.input`
        position:absolute;
        top: 0px;
        left:0px;
        width:180px;
        height:21px;
        border: 1px solid #A9A9A9;
    `

const Component2Old = (props: any) => {
    const selectOptions = [
        { label: 'one', value: 1 },
        { label: 'two', value: 2 },
        { label: 'three', value: 3 },
        { label: 'four', value: 4 },
    ]
    return <DropDownList options={selectOptions}></DropDownList>
}




//working one    
// <div style={{position:"relative",width:"200px",height:"25px",border:0, */}
// padding:0,margin:0}}>
// <select style={{position:"absolute",top:"0px",left:"0px",
//         width:"200px",height:"25px",lineHeight:"20px",
//         margin:0,padding:0}} 
//         //   onChange={this.onMenuSelect}
//         >
//         <option></option>
//         <option value="starttime">Filter by Start Time</option>
//         <option value="user"     >Filter by User</option>
//         <option value="buildid"  >Filter by Build Id</option>
//         <option value="invoker"  >Filter by Invoker</option>
// </select>
// <input name="displayValue" id="displayValue" 
//     style={{position:"absolute",top:"0px",left:"0px",width:"180px",
//         height:"21px",border:"1px solid #A9A9A9"}}
//             // onfocus={this.select} type="text" 
//             // onChange={this.onIdFilterChange}
//             // onMouseDown={this.onMouseDown} 
//             // onMouseUp={this.onMouseUp} 
//     placeholder="Filter by Build ID"/>
//</div>

//datalist way


/*
const selectedValue:any = props.selectedValue
    const [value, setValue]:any = useState(selectedValue)
    const value1:any = {label:'2013', value:'2013'}
    const sel:any = useRef()
    return <Select ref = {sel}
    options={props.selectOptions}
    value={value}
    onChange={(val:any) =>{
        console.log('1.',val)
        setValue(val)
    }}
    />
<div> <input type="text" name="city" list="cityname" />
        <datalist id="cityname">
            <option label="Boston" value="B"></option>
            <option label="Cambridge" value="C"></option>
        </datalist></div >


    // <div>
    //     <select style={{position:"absolute"}}>
    //         {selectOptions.map((x: any, index: number) => (
    //         <option key={index} value={x["value"]}>
    //             {x["label"]}
    //         </option>
    //         ))}
    //     </select>
    //     <input  type = 'text'></input>
    // </div>
*/