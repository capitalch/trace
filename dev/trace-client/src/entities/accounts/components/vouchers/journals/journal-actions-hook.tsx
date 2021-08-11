import React, { useState, useEffect, useRef } from 'react'
import { makeStyles, Theme, createStyles } from '@material-ui/core'
import { useSharedElements } from '../../common/shared-elements-hook'
import { selectedGridRowsSelector } from '@material-ui/data-grid'

function useJournalActions(arbitraryData:any){
	const [, setRefresh] = useState({})

    const { _,
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
        useGeneric, } = useSharedElements()

    useEffect(() => {
        meta.current.isMounted = true
        setColumns()
        setRows()
        return (() => {
            meta.current.isMounted = false
        })
    }, [])

    const meta: any = useRef({
        isMounted: false,
        columns:[],
        rows:[{id:1}]
    })

    function setColumns(){
        meta.current.columns = [
            // {
            //     headerName: 'Ind',
            //     description: 'Index',
            //     field: 'index',
            //     width: 80,
            //     disableColumnMenu: true,
            //     sortable: false,
            // },
            {
                headerName: 'Accounts',
                field: 'accId',
                width: 350,
                disableColumnMenu: true,
                sortable: false,
            },
            {
                headerName: 'Debits',
                field: 'debit',
                width: 200,
                valueFormatter: (params: any) => toDecimalFormat(params.value),
                disableColumnMenu: true,
                sortable: false,
            }, {
                headerName: 'Credits',
                field: 'credit',
                width: 200,
                valueFormatter: (params: any) => toDecimalFormat(params.value),
                disableColumnMenu: true,
                sortable: false,
            },
            {
                headerName: 'Line ref',
                field: 'lineRefNo',
                // width: 120,
                disableColumnMenu: true,
                sortable: false,
            },
            {
                headerName: 'Line remarks',
                field: 'lineRemarks',
                width: 120,
                disableColumnMenu: true,
                sortable: false,
            },
        ]
    }

    function setRows(){
        meta.current.rows= [{
            id:1,
            accId:1,
            debit:0,
            credit:0,
            lineRefNo:'abcd',
            lineRemarks:'ffff'
        }]
        setRefresh({})
    }

    return({meta, setRefresh})

}

export {useJournalActions}

const useStyles: any = makeStyles((theme: Theme) =>
    createStyles({

        content: {
            marginTop: theme.spacing(4)
        },

    })
)

export { useStyles }
