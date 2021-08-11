import React, { useState, useEffect, useRef } from 'react'
import { makeStyles, Theme, createStyles } from '@material-ui/core'
import { useSharedElements } from '../../common/shared-elements-hook'

function useJournals() {
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

    useEffect(() => {
        meta.current.isMounted = true

        return () => {
            meta.current.isMounted = false
        }
    }, [])

    const meta: any = useRef({
        isMounted: false,        
        tabLabel: 'Journals',
        tabValue: 0,
    })

    const arbitraryData: any = useRef({
        autoRefNo: undefined,
        commonRemarks: undefined,
        gstin: undefined,
        id: undefined,
        isIgst: false,
        lineItems: [],
        tranDate: undefined,
        userRefNo: undefined,
    })

    function handleOnTabChange(e: any, newValue: number) {
        meta.current.tabValue = newValue
        // if (newValue === 1) { // to refresh view
        //     emit('PURCHASE-VIEW-HOOK-FETCH-DATA', null)
        // }
        meta.current.isMounted && setRefresh({})
    }

    return { arbitraryData, handleOnTabChange, meta, setRefresh }
}

export { useJournals }

const useStyles: any = makeStyles((theme: Theme) =>
    createStyles({
        content: {
            '& .tabs': {
                marginTop:theme.spacing(2),
                color: theme.palette.common.white,
                backgroundColor: 'dodgerBlue',
            },
        },
    })
)

export { useStyles }
