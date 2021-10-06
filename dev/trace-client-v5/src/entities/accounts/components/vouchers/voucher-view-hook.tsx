import { useState, useEffect, useRef, useContext } from 'react'
import { 
    // makeStyles, 
    Theme, createStyles } from '@mui/material'
    import { makeStyles } from '@mui/styles'
import { useSharedElements } from '../common/shared-elements-hook'
import { VoucherContext } from './voucher-context'

function useVoucherView(hidden: boolean, tranTypeId: number) {
    const [, setRefresh] = useState({})
    const arbitraryData:any = useContext(VoucherContext)
    const {
        _,
        accountsMessages,
        confirm,
        emit,
        filterOn,
        genericUpdateMaster,
        isGoodToDelete,
        moment,
        toDecimalFormat,
    } = useSharedElements()

    const meta: any = useRef({
        isMounted: false,
        title: ''
    })

    useEffect(() => {
        meta.current.isMounted = true        
        const subs1 = filterOn('VOUCHER-VIEW-XX-GRID-EDIT-CLICKED').subscribe(
            (d: any) => {
                emit('VOUCHER-CHANGE-TAB-TO-EDIT', {
                    tranHeaderId: d.data?.row?.id1,
                })
            }
        )

        const subs2 = filterOn('VOUCHER-VIEW-XX-GRID-DELETE-CLICKED').subscribe(
            (d: any) => {
                doDelete(d.data)
            }
        )

        const subs3 = filterOn('VOUCHER-VIEW-REFRESH').subscribe(() => {
            emit('XX-GRID-FETCH-DATA', null) // fetch data in xx-grid
        })

        return () => {
            meta.current.isMounted = false
            subs1.unsubscribe()
            subs2.unsubscribe()
            subs3.unsubscribe()
        }
    }, [])

    useEffect(() => {
        if ((!hidden) && arbitraryData.shouldViewReload) {
            emit('XX-GRID-FETCH-DATA', null)
            arbitraryData.shouldViewReload = false
        }
    }, [hidden, arbitraryData.shouldViewReload])

    async function doDelete(params: any) {
        const row = params.row
        const tranHeaderId = row['id1']
        const options = {
            description: accountsMessages.transactionDelete,
            confirmationText: 'Yes',
            cancellationText: 'No',
        }
        if (isGoodToDelete(params)) {
            confirm(options)
                .then(async () => {
                    await genericUpdateMaster({
                        deletedIds: [tranHeaderId],
                        tableName: 'TranH',
                    })
                    emit('SHOW-MESSAGE', {})
                    emit('VOUCHER-VIEW-REFRESH', '')
                })
                .catch(() => { }) // important to have otherwise eror
        }
    }

    const columns = [
        {
            headerName: 'Ind',
            description: 'Index',
            field: 'id',
            width: 80,
            disableColumnMenu: true,
        },
        { headerName: 'Id', field: 'id1', width: 90 },
        {
            headerName: 'Date',
            field: 'tranDate',
            width: 120,
            type: 'date',
            valueFormatter: (params: any) =>
                moment(params.value).format('DD/MM/YYYY'),
        },
        { headerName: 'Ref', field: 'autoRefNo', width: 200 },
        { headerName: 'Account', field: 'accName', width: 200 },
        {
            headerName: 'Debits',
            field: 'debit',
            sortable: false,
            type: 'number',
            width: 160,
            valueFormatter: (params: any) => toDecimalFormat(params.value),
        },
        {
            headerName: 'Credits',
            sortable: false,
            field: 'credit',
            type: 'number',
            width: 160,
            valueFormatter: (params: any) => toDecimalFormat(params.value),
        },
        {
            headerName: 'User ref',
            field: 'userRefNo',
            width: 200,
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
            headerName: 'Instr no',
            field: 'instrNo',
            width: 200,
            sortable: false,
        },
        {
            headerName: 'Gstin',
            field: 'gstin',
            width: 170,
            sortable: false,
        },
        {
            headerName: 'Rate',
            field: 'rate',
            type: 'number',
            width: 70,
            sortable: false,
            disableColumnMenu: true,
        },
        {
            headerName: 'Hsn',
            field: 'hsn',
            type: 'number',
            width: 90,
            sortable: false,
        },
        {
            headerName: 'Cgst',
            field: 'cgst',
            type: 'number',
            width: 100,
            sortable: false,
        },
        {
            headerName: 'Sgst',
            field: 'sgst',
            type: 'number',
            width: 100,
            sortable: false,
        },
        {
            headerName: 'Igst',
            field: 'igst',
            type: 'number',
            width: 100,
            sortable: false,
        },
        {
            headerName: 'Gst input',
            field: 'isInput',
            width: 120,
            sortable: false,
            disableColumnMenu: true,
        },
    ]

    const sqlQueryId = 'get_vouchers'
    const args = {
        tranTypeId: tranTypeId,
        no: null,
    }
    const summaryColNames = ['debit', 'credit']
    const specialColumns = {
        // isRemove: true,
        isEdit: true,
        isDelete: true,
        editIbukiMessage: 'VOUCHER-VIEW-XX-GRID-EDIT-CLICKED',
        deleteIbukiMessage: 'VOUCHER-VIEW-XX-GRID-DELETE-CLICKED',
        // isDrillDown: true,
    }
    return {
        args,
        columns,
        meta,
        specialColumns,
        sqlQueryId,
        summaryColNames,
    }
}

export { useVoucherView }

const useStyles: any = makeStyles((theme: Theme) =>
    createStyles({
        content: {
            height: 'calc(100vh - 240px)',
            width: '100%',
            marginTop: '5px',
        },
    })
)

export { useStyles }
