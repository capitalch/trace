import { useTable, useExpanded } from 'react-table'
import styled from 'styled-components'
import React, { useEffect, useState, useMemo } from 'react'
import { FixedSizeList } from 'react-window'
// import "react-table/react-table.css"

export default function Table(
    { columns, data }: any) {
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
        totalColumnsWidth
        // state: { expanded }
    }: any = useTable({ columns, data }, useExpanded)


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
                headerGroups.map((headerGroup: any) => (
                    <tr {...headerGroup.getHeaderGroupProps()} >
                        {headerGroup.headers.map((column: any) => (
                            <th {...column.getHeaderProps()} >
                                {column.render("Header")}
                            </th>
                        ))}
                    </tr>
                ))
            }
        </thead>
        <tbody {...getTableBodyProps()} >

            {/* <FixedSizeList
                height={600}
                itemCount={rows.length}
                itemSize={30}
                width={totalColumnsWidth}> */}
                {
                    rows.map((row: any, i: number) => {
                        prepareRow(row)
                        return (
                            <tr {...row.getRowProps()}>
                                {
                                    row.cells.map((cell: any) => {
                                        return <td {...cell.getCellProps()}>{
                                            cell.render("Cell")
                                        }</td>
                                    })
                                }
                            </tr>
                        )
                    })
                }
            {/* </FixedSizeList> */}

        </tbody>
    </table>
}
/*
className={[cell.column.className].join(' ')}
className={cell.value === 'Cr' ? 'test' : ''}
const RenderRow = React.useCallback(
        ({ index, style }) => {
            const row = rows[index]
            prepareRow(row)
            return (
                <tr{...row.getRowProps()}>
                    {row.cells.map((cell: any) => {
                        return (
                            <td {...cell.getCellProps()}>
                                {cell.render('Cell')}
                            </td>
                        )
                    })}
                </tr>
            )
        },
        [prepareRow, rows]
    )
*/