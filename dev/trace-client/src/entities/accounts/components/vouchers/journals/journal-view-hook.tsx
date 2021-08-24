import React, { useState, useEffect, useRef } from 'react'
import { makeStyles, Theme, createStyles } from '@material-ui/core'
import { useSharedElements } from '../../common/shared-elements-hook'

function useJournalView(hidden: boolean) {
    const [, setRefresh] = useState({})

    const {
        _,
        accountsMessages,
        AddCircle,
        AddIcon,
        Avatar,
        Big,
        Box,
        Button,
        Card,
        Checkbox,
        Chip,
        CloseIcon,
        confirm,
        DataTable,
        DeleteIcon,
        Dialog,
        DialogTitle,
        DialogContent,
        DialogActions,
        Divider,
        doValidateForm,
        EditIcon,
        emit,
        execGenericView,
        filterOn,
        genericUpdateMaster,
        getCurrentEntity,
        getFormData,
        getFormObject,
        getFromBag,
        globalMessages,
        FormControlLabel,
        Icon,
        IconButton,
        Input,
        InputAdornment,
        isDateAuditLocked,
        isInvalidGstin,
        isValidForm,
        List,
        ListItem,
        ListItemAvatar,
        ListItemText,
        MaterialTable,
        messages,
        moment,
        MTableBody,
        MTableToolbar,
        NativeSelect,
        NumberFormat,
        Paper,
        PrimeColumn,
        queries,
        queryGraphql,
        Radio,
        ReactForm,
        releaseForm,
        resetAllFormErrors,
        resetForm,
        saveForm,
        SearchIcon,
        setFormError,
        SyncIcon,
        tableIcons,
        TextField,
        toDecimalFormat,
        TraceDialog,
        TraceFullWidthSubmitButton,
        traceGlobalSearch,
        TraceSearchBox,
        Typography,
        useGeneric,
    } = useSharedElements()
    const meta: any = useRef({
        isMounted: false,
        isLoadedOnce: false,
    })
    useEffect(() => {
        meta.current.isMounted = true

        const subs1 = filterOn('JOURNAL-VIEW-XX-GRID-EDIT-CLICKED').subscribe(
            (d: any) => {
                // console.log(d.data?.row)
                emit('JOURNAL-CHANGE-TAB-TO-EDIT', {
                    tranHeaderId: d.data?.row?.id1,
                })
                setRefresh({})
            }
        )

        const subs2 = filterOn('JOURNAL-VIEW-XX-GRID-DELETE-CLICKED').subscribe(
            (d: any) => {
                doDelete(d.data)
            }
        )

        const subs3 = filterOn('JOURNAL-VIEW-REFRESH').subscribe(() => {
            emit('XX-GRID-FETCH-DATA', null) // fetch data in xx-grid
        })

        const subs4 = filterOn('JOURNAL-VIEW-RESET-IS-LOADED-ONCE').subscribe(
            () => {
                meta.current.isLoadedOnce = false
            }
        )
        return () => {
            meta.current.isMounted = false
            subs1.unsubscribe()
            subs2.unsubscribe()
            subs3.unsubscribe()
            subs4.unsubscribe()
        }
    }, [])

    useEffect(() => {
        if (!hidden && !meta.current.isLoadedOnce) {
            emit('XX-GRID-FETCH-DATA', null)
            meta.current.isLoadedOnce = true
        }
    }, [hidden, meta.current.isLoadedOnce])

    async function doDelete(params: any) {
        const row = params.row
        const tranHeaderId = row['id1']
        const options = {
            description: accountsMessages.transactionDelete,
            confirmationText: 'Yes',
            cancellationText: 'No',
        }
        if (isDateAuditLocked(row.tranDate)) {
            emit('SHOW-MESSAGE', {
                severity: 'error',
                message: accountsMessages.auditLockError,
                duration: null,
            })
        } else if (row?.clearDate) {
            // already reconciled so edit /delete not possible
            emit('SHOW-MESSAGE', {
                severity: 'error',
                message: accountsMessages.reconcillationDone,
                duration: null,
            })
        } else {
            confirm(options)
                .then(async () => {
                    await genericUpdateMaster({
                        deletedIds: [tranHeaderId],
                        tableName: 'TranH',
                    })
                    emit('SHOW-MESSAGE', {})
                    emit('JOURNAL-VIEW-REFRESH', '')
                })
                .catch(() => {}) // important to have otherwise eror
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
            // align: 'right',
            headerName: 'Credits',
            sortable: false,
            field: 'credit',
            type: 'number',
            width: 160,
            valueFormatter: (params: any) => toDecimalFormat(params.value),
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
    const title = 'All journals'
    const args = {
        tranTypeId: 1,
        no: null,
    }
    const summaryColNames = ['debit', 'credit']
    const specialColumns = {
        // isRemove: true,
        isEdit: true,
        isDelete: true,
        editIbukiMessage: 'JOURNAL-VIEW-XX-GRID-EDIT-CLICKED',
        deleteIbukiMessage: 'JOURNAL-VIEW-XX-GRID-DELETE-CLICKED',
        // isDrillDown: true,
    }
    return {
        meta,
        setRefresh,
        args,
        columns,
        specialColumns,
        sqlQueryId,
        title,
        summaryColNames,
    }
}

export { useJournalView }

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
