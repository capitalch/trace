import { useTable, useExpanded } from 'react-table'
import React, { useState } from 'react'

export default function Table(
    {
        columns,
        data,
        cellCrColor
    }: any) {
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        footerGroups,
        rows,
        prepareRow
    } = useTable({ columns, data }, useExpanded)

    let [clickedRow, setClickedRow] = useState(-1)

    function getRowColor(rowIndex: number, clickedIndex: number) {
        let ret = 'white'
        if (rowIndex === clickedIndex) {
            ret = 'lightGrey'
        }
        return ret
    }

    return <table {...getTableProps()}>
        <thead>
            {
                headerGroups.map(headerGroup => (
                    <tr {...headerGroup.getHeaderGroupProps()} >
                        {headerGroup.headers.map((column: any) => (
                            <th {...column.getHeaderProps([
                                {
                                    className: column.className
                                }
                            ])}>
                                {column.render("Header")}
                            </th>
                        ))}
                    </tr>
                ))
            }
        </thead>
        <tbody {...getTableBodyProps()} >
            {rows.map((row, i) => {
                prepareRow(row)
                return (
                    <tr {...row.getRowProps()} style={{ "backgroundColor": getRowColor(i, clickedRow) }} onClick={e => {
                        setClickedRow(i)
                    }}>
                        {
                            row.cells.map((cell: any) => {
                                return <td {...cell.getCellProps([
                                    {
                                        className: cell.column.className,
                                        style: {
                                            color: cellCrColor && cellCrColor(cell.value)
                                        }
                                    }
                                ])}>{
                                        cell.render("Cell")
                                    }</td>
                            })
                        }
                    </tr>
                )
            })}
        </tbody>
        <tfoot>
            {
                footerGroups.map(footerGroup => (
                    <tr {...footerGroup.getFooterGroupProps()} >
                        {footerGroup.headers.map((column: any) => (
                            <th {...column.getFooterProps([
                                {
                                    className: column.className
                                }
                            ])}>
                                {column.render("Footer")}
                            </th>
                        ))}
                    </tr>
                ))
            }
        </tfoot>
    </table>
}

/*

*/