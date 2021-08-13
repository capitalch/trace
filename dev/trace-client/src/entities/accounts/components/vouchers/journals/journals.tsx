import React, { useState, useEffect, useRef } from 'react'
import { useSharedElements } from '../../common/shared-elements-hook'
import { useJournals, useStyles } from './journals-hook'
import {JournalMain} from './journal-main'
import {JournalView} from './journal-view'

function Journals() {
    const classes = useStyles()
    const { arbitraryData,handleOnTabChange, meta, setRefresh } = useJournals()

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
        Tab,
        Tabs,
        TextField,
        toDecimalFormat,
        TraceDialog,
        TraceFullWidthSubmitButton,
        traceGlobalSearch,
        TraceSearchBox,
        Typography,
        useGeneric,
    } = useSharedElements()

    return (
        <div className={classes.content}>
            <Tabs
                className="tabs"
                indicatorColor="primary"
                onChange={handleOnTabChange}
                value={meta.current.tabValue}>
                <Tab className='tab' label={meta.current.tabLabel} />
                <Tab label="View" />
            </Tabs>
            <JournalMain arbitraryData={arbitraryData.current} hidden = {meta.current.tabValue !==0 } />
            <JournalView hidden = {meta.current.tabValue !==1} />
        </div>
    )

    
}

export { Journals }
