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
        isLoadedOnce: false
    })
    useEffect(() => {
        meta.current.isMounted = true

        const subs1 = filterOn('JOURNAL-VIEW-XX-GRID-EDIT-CLICKED').subscribe((d: any) => {
            console.log(d.data?.row)

            emit('JOURNAL-CHANGE-TAB', { tranHeaderId: d.data?.row?.id1, tabValue: 0 })
            setRefresh({})
        })
        return () => {
            meta.current.isMounted = false
            subs1.unsubscribe()
        }
    }, [])

    useEffect(() => {
        if ((!hidden) && (!meta.current.isLoadedOnce)) {
            emit('XX-GRID-FETCH-DATA', null)
            meta.current.isLoadedOnce = true
        }
    }, [hidden, meta.current.isLoadedOnce])



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
            valueGetter: (params: any) =>
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
