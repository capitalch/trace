import React, { useState, useMemo } from 'react'
import styled from 'styled-components'
import { useTable, useBlockLayout } from 'react-table'
import { FixedSizeList } from 'react-window'
import makeData from './makeData'
// import { Table1 } from './table1'

function Component9() {
    const data = makeData(1000)
    return (
        <Styles>
            {/* <Table1 columns={columns} data={data} /> */}
        </Styles>
    )
}

export { Component9 }

const columns: any[] =
    [
        {
            Header: 'Row Index',
            accessor: (row: any, i: number) => i,
        },

        {
            Header: 'First Name',
            accessor: 'firstName',
        },
        {
            Header: 'Last Name',
            accessor: 'lastName',
        },

        {
            Header: 'Age',
            accessor: 'age',
            width: 50,
        },
        {
            Header: 'Visits',
            accessor: 'visits',
            width: 60,
        },
        {
            Header: 'Status',
            accessor: 'status',
        },
        {
            Header: 'Profile Progress',
            accessor: 'progress',
        }

    ]

const Styles = styled.div`
  padding: 1rem;

  .table {
    display: inline-block;
    border-spacing: 0;
    border: 1px solid black;

    .tr {
      :last-child {
        .td {
          border-bottom: 0;
        }
      }
    }

    .th,
    .td {
      margin: 0;
      padding: 0.5rem;
      border-bottom: 1px solid black;
      border-right: 1px solid black;

      :last-child {
        border-right: 0;
      }
    }
  }
`

