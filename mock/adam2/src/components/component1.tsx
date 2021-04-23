import React, { useEffect, useState } from 'react'
import { TreeTable } from 'primereact/treetable'
import { Column } from "primereact/column"
import data1 from '../data/treeData.json'
import testData from '../data/test-data1.json'
import bs from '../data/balance-sheet-profit-loss.json'


function Component1() {
    const [nodes, setNodes]: any[] = useState([])
    const [selectedNodeKey1, setSelectedNodeKey1]: any = useState(null)

    useEffect(() => {
        // setNodes(data1)
    }, [])


    function getTreeData(tData: any[]) {
        function processChildren(obj: any) {
            if (obj.children) {
                obj.children = obj.children.map((x: any) => {
                    processChildren(nodeDict[x])
                    return nodeDict[x]
                })
            }
        }

        function getNodeDict(tData: any) {
            const nodeDict: any = {}
            for (let item of tData) {
                nodeDict[item.id] = {
                    key: item.id,
                    data: {
                        accCode: item.accCode,
                        amount: item.amount
                    },
                    children: item.children
                }
            }
            return nodeDict
        }
        const nodeDict = getNodeDict(tData)
        const tempRoots: any[] = tData.filter(x => x.parentId === null)
        const roots: any = tempRoots.map(x => nodeDict[x['id']])
        for (const root of roots) {
            processChildren(root)
        }

        return (roots)
    }
    const tData: any[] = testData
    const bsFormatted: any[] = bs.data.accounts.balance_sheet_profit_loss.balance_sheet_profit_loss
    return <div>
        <TreeTable className="myClass"
            // value={getTreeData(tData)}
            value={bsFormatted}
            header="A tree balance sheet"
            tableClassName="myClass"
            autoLayout={true}
            selectionMode="multiple"
            selectionKeys={selectedNodeKey1}
            onSelectionChange={e => {
                setSelectedNodeKey1(e.value)
                console.log(e.value)
            }}
        >
            {/* <Column field="name" header="Name" expander></Column>
            <Column field="size" header="Size"></Column>
            <Column field="type" header="Type"></Column> */}
            <Column field="accName" header="Account" expander></Column>
            <Column field="amount" header="Amount"></Column>
        </TreeTable>
    </div>
}

export { Component1 }