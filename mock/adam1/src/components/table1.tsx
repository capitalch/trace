import React, { useState, useMemo } from 'react'
import { FixedSizeList } from 'react-window'
import { useTable, useBlockLayout } from 'react-table'

function Table1({ columns, data }: any) {

    const defaultColumn = React.useMemo(
        () => ({
            width: 160,
        }),
        []
    )

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        totalColumnsWidth,
        prepareRow,
    } = useTable(
        {
            columns,
            data,
            // defaultColumn,
        },
        useBlockLayout
    )

    const RenderRow = React.useCallback(
        ({ index, style }) => {
            const row = rows[index]
            prepareRow(row)
            return (
                <div
                    {...row.getRowProps({
                        style,
                    })}
                className="tr"
                >
                    {row.cells.map(cell => {
                        return (
                            <div {...cell.getCellProps()}
                            className="td"
                            >
                                {cell.render('Cell')}
                            </div>
                        )
                    })}
                </div>
            )
        },
        [prepareRow, rows]
    )

    // Render the UI for your table
    return (
        <div {...getTableProps()}
        className="table"
        >
            {/* <thead> */}
                <div>
                    {headerGroups.map(headerGroup => (
                        <div {...headerGroup.getHeaderGroupProps()}
                        className="tr"
                        >
                            {headerGroup.headers.map(column => (
                                <div {...column.getHeaderProps()}
                                className="th"
                                >
                                    {column.render('Header')}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            {/* </thead> */}
            {/* <tbody {...getTableBodyProps()}> */}
            {/* <tr > */}
                <FixedSizeList
                    height={400}
                    itemCount={rows.length}
                    itemSize={35}
                    width={totalColumnsWidth}
                >
                    {RenderRow}
                </FixedSizeList>
            {/* </tr> */}
            {/* </tbody> */}
        </div>
    )
}

export { Table1 }