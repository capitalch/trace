import { useSharedElements } from '../../common/shared-elements-hook'
import { utilMethods } from '../../../../../common-utils/util-methods'
import moment from 'moment'
// import { useState } from 'react'

function useAllTransactions() {
    const { getFromBag } = useSharedElements()
    const { toDecimalFormat } = utilMethods()
    const columns = [
        {
            headerName: 'Ind',
            description: 'Index',
            field: 'index',
            width: 80,
            disableColumnMenu: true,
        },
        { headerName: 'Id', field: 'id1', width: 90 },
        {
            headerName: 'Date',
            field: 'tranDate',
            width: 120,
            valueGetter: (params: any) => moment(params.value).format('DD/MM/YYYY'),
        },
        { headerName: 'Ref', field: 'autoRefNo', width: 200 },
        { headerName: 'Account', field: 'accName', width: 200 },
        {
            headerName: 'Debits',
            field: 'debit',
            type: 'number',
            width: 160,
            valueFormatter: (params: any) => toDecimalFormat(params.value),
        },
        {
            headerName: 'Credits',
            field: 'credit',
            type: 'number',
            width: 160,
            valueFormatter: (params: any) => toDecimalFormat(params.value),
        },

        { headerName: 'Instr', field: 'instrNo', width: 160, sortable: false },
        {
            headerName: 'User ref no',
            field: 'userRefNo',
            width: 160,
            sortable: false,
        },
        {
            headerName: 'Remarks',
            field: 'remarks',
            width: 200,
            sortable: false,
        },
        {
            headerName: 'Line ref no',
            field: 'lineRefNo',
            width: 200,
            sortable: false,
        },
        {
            headerName: 'Line remarks',
            field: 'lineRemarks',
            width: 200,
            sortable: false,
        },
        {
            headerName: 'Tags',
            field: 'tags',
            width: 200,
            sortable: false,
        },
    ]

    const sqlQueryId = 'get_allTransactions'
    const title = 'All transactions'
    const args = {
        dateFormat: getFromBag('dateFormat'),
        no: null,
    }

    const summaryColNames = ['debit', 'credit']
    const specialColumns = {
        isRemove: true,
        isEdit: true,
        isDelete: true,
        isDrillDown: true,
    }
    return { args, columns, specialColumns, sqlQueryId, title, summaryColNames }
}

export { useAllTransactions }
