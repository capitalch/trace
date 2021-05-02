import React, { useEffect, useState } from 'react'
import accData from '../data/acc-data.json'
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Growl } from 'primereact/growl';


// editable={true}

function Component2() {
    const data1: any[] = accData
    const [data, setData]:any[] = useState([])

    useEffect(()=>{
        setData(accData)
    }, [])

    function onEditorValueChange(props: any, value: any) {
        const updatedData = [...props.value];
        updatedData[props.rowIndex][props.field] = value;
        setData(updatedData);
    }

    function inputTextEditor(props: any, field: string) {
        return <InputText type="text" value={props.rowData[field]} 
        onChange={(e: any) => onEditorValueChange(props, e.target.value)} />;
    }
    function accCodeEditor(props:any){
        return inputTextEditor(props, 'accCode')
    }

    function requiredValidator(props:any){
        let value = props.rowData[props.field]
        return value && value.length > 3
    }

    return <DataTable value={data} editMode="cell">
        <Column field="accCode" editor={accCodeEditor} editorValidator={requiredValidator} header="Acc code" />
        <Column field="accName" header="Acc Name" />
        <Column field="accType" header="Type" />
        <Column field="accLeaf" header="Leaf" />
    </DataTable>
}

export { Component2 }