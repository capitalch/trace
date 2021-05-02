import React, { useState, useMemo } from 'react'
import { useTable, usePagination } from 'react-table'

function Table2({ columns, data }: any) {
    // Use the state and functions returned from useTable to build your UI
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        prepareRow,
        // page, // Instead of using 'rows', we'll use page,
       
        // canPreviousPage,
        // canNextPage,
        // pageOptions,
        // pageCount,
        // gotoPage,
        // nextPage,
        // previousPage,
        // setPageSize//,
        // state: { pageIndex, pageSize },
    } = useTable(
        {
            columns,
            data//,
            // initialState: { pageIndex: 2 },
        },
        usePagination
    )

    
}
