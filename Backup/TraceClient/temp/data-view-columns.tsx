import React from 'react'
import { useIbuki } from '../../../../common-utils/ibuki'
import customMethods from '../../artifacts/custom-methods'
import messages from '../../../../messages.json'
const { emit } = useIbuki()


function usingDataViewColumns() {
    
    const paymentColumns: any[] = [
        {
            Header: "Id",
            accessor: "tranHeaderId"
        },
        {
            Header: "Date",
            accessor: "tranDate"
        },
        {
            Header: "Auto ref no",
            accessor: "autoRefNo"
        },
        {
            Header: "Header remarks",
            accessor: "headerRemarks"
        },
        {
            Header: "User ref no",
            accessor: "userRefNo"
        },
        {
            Header: "Account name",
            accessor: "accName"
        },
        {
            Header: "Debit",
            accessor: "debit",
            className: "numeric-right",
        },
        {
            Header: "Credit",
            accessor: "credit",
            className: "numeric-right",
        },
        {
            Header: "Line ref no",
            accessor: "lineRefNo"
        },
        {
            Header: "Line remarks",
            accessor: "lineRemarks"
        }, 
        {
            Header: () => null,
            id: 'edit',
            Cell: (data:any) => <button onClick={(e) => {
                const tranHeaderId =  data.row.values['tranHeaderId']
                emit('LOAD-MAIN-COMPONENT-EDIT', {headerId:tranHeaderId}) 
            }}>Edit</button>
        },
        {
            Header: () => null,
            id: 'delete',
            Cell: (data:any) => <button onClick = {(e)=>{
                const tranHeaderId =  data.row.values['tranHeaderId']
                const toDelete = window.confirm(messages['deleteConfirm'])
                if(toDelete){
                    customMethods['deleteTranH']({id: tranHeaderId})
                }
                
            }}>Delete</button>
        }
    ]
    return { paymentColumns }
}

export { usingDataViewColumns }