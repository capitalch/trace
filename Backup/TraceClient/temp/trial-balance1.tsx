import React, { useState, useEffect, useRef } from 'react'
import {Div} from './common/data-view-wrapper'
import { graphqlService } from '../../../common-utils/graphql-service'
import queries from '../artifacts/graphql-queries-mutations'
import { utilMethods } from '../../../common-utils/util-methods'
import Table from './common/table'
const TrialBalance = () => {
    let [data, setData] = useState([])
    let [footer, setFooter]: any = useState({})
    const { queryGraphql } = graphqlService()
    const { toDecimalFormat } = utilMethods()
    const isMounted = useRef(true)
    useEffect(() => {
        isMounted.current= true
        async function getTrialBalance() {
            const q = queries['trialBalanceSubledgers']
            const results = await queryGraphql(q)
            let formattedData
            if (results.data && results.data.accounts && results.data.accounts.trial_balance_subledgers) {
                if (results.data.accounts.trial_balance_subledgers.trial_balance) {
                    const dt = results.data.accounts.trial_balance_subledgers.trial_balance
                    formattedData = dt.map((x: any) => {
                        x.opening = toDecimalFormat(x.opening)
                        x.closing = toDecimalFormat(x.closing)
                        x.debits = toDecimalFormat(x.debits)
                        x.credits = toDecimalFormat(x.credits)
                        return x
                    })
                    const ft = formattedData.pop()
                    isMounted.current && setFooter(ft)
                }
                if (results.data.accounts.trial_balance_subledgers.subledgers) {
                    const subledgers: any[] = results.data.accounts.trial_balance_subledgers.subledgers
                    subledgers.pop() // remove last summary row from server
                    for (let item of subledgers) {
                        const found: any = formattedData.find((x: any) => x.id === item.parentId)
                        if (!found.subRows) {
                            found.subRows = []
                        }
                        item.opening = toDecimalFormat(item.opening)
                        item.closing = toDecimalFormat(item.closing)
                        item.debits = toDecimalFormat(item.debits)
                        item.credits = toDecimalFormat(item.credits)
                        found.subRows.push(item)
                    }
                }
                isMounted.current && setData(formattedData)
            }
        }
        getTrialBalance()
        return(()=>{isMounted.current=false})
    }, [])
    const cellCrColor = (value: string) => value === 'Cr' ? 'red' : ''
    const columns =
        // useMemo(() => 
        [
            {
                Header: 'Trial balance',
                Footer: 'Summary of trial balance',
                columns: [
                    {
                        // Build our expander column
                        Header: () => null, // No header, please
                        id: 'expander', // Make sure it has an ID
                        Cell: ({ row }: any) =>
                            // Use the row.canExpand and row.getExpandedToggleProps prop getter
                            // to build the toggle for expanding a row
                            row.canExpand ? (
                                <span
                                    {...row.getExpandedToggleProps({
                                        style: {
                                            // We can even use the row.depth property
                                            // and paddingLeft to indicate the depth
                                            // of the row
                                            paddingLeft: `${row.depth * 2}rem`,
                                            backGroundColor: 'red',
                                            height: '100px'
                                        },
                                    })}
                                >
                                    {row.isExpanded ? '👇' : '👉'}
                                </span>
                            ) : null,
                    },
                    {
                        Header: "Account code",
                        accessor: "accCode",
                        Footer: "Total"
                    },
                    {
                        Header: "Account name",
                        accessor: "accName"
                    },
                    {
                        Header: "Type",
                        accessor: "accType"
                    },
                    {
                        Header: "Opening balance",
                        accessor: "opening",
                        className: "numeric-right",
                        Footer: footer.opening || '0.00'
                    },
                    {
                        Header: "",
                        accessor: "opening_dc",
                        Footer: footer.opening_dc || ''
                    },
                    {
                        Header: "Debits",
                        accessor: "debits",
                        className: "numeric-right",
                        Footer: footer.debits || '0.00'
                    },
                    {
                        Header: "Credits",
                        accessor: "credits",
                        className: "numeric-right",
                        Footer: footer.credits || '0.00'
                    },
                    {
                        Header: "Closing balance",
                        accessor: "closing",
                        className: "numeric-right",
                        Footer: footer.closing || '0.00'
                    },
                    {
                        Header: "",
                        accessor: "closing_dc",
                        Footer: footer.closing_dc || ''
                    }
                ]
            }

        ]
    // , [])

    return (
        <Div>
            <Table
                columns={columns}
                data={data}
                cellCrColor={cellCrColor}
            ></Table>
        </Div>
    )
}

// const Div = styled.div`
//     margin: 1rem;
//     table {
//         border-collapse:collapse;
//         text-align:left;
//     }
//     td, tr,th{
//         border: 1px solid lightgray;        
//         padding: 0.2rem;
//         padding-left:.5rem;
//         font-size: 0.9rem;
//     }

//     td {
//         cursor: pointer;
//     }

//     .numeric-right {
//         text-align:right;
//     }
    
// `

export { TrialBalance }

/*

*/