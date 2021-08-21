import React, { useState, useEffect, useRef } from 'react'
import { useSharedElements } from '../../common/shared-elements-hook'
import { useJournalView, useStyles } from './journal-view-hook'

function JournalView({ hidden }: any) {
    const classes = useStyles()
    const {
        meta,
        setRefresh,
        args,
        columns,
        specialColumns,
        sqlQueryId,
        title,
        summaryColNames,
    } = useJournalView(hidden)

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
        CheckIcon,
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
        ErrorIcon,
        execGenericView,
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
        isInvalidDate,
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
        XXGrid,
    } = useSharedElements()

    return (
        <Card className={classes.content} hidden={hidden}>
            {
               (!hidden) && <XXGrid
                    columns={columns}
                    summaryColNames={summaryColNames}
                    title={title}
                    sqlQueryId={sqlQueryId}
                    sqlQueryArgs={args}
                    specialColumns={specialColumns}
                    xGridProps={{ disableSelectionOnClick: true }}
                />
            }
        </Card>
    )
}

export { JournalView }
