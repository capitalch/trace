import React, { useState, useEffect, useRef } from 'react'
import { useSharedElements } from '../../common/shared-elements-hook'
import { useJournalMain, useStyles } from './journal-main-hook'
import { JournalActions } from './journal-actions'

function JournalMain({ arbitraryData, hidden }: any) {
        const classes = useStyles()
        const {ActionBlock, Crown,Crown2, Header, meta } = useJournalMain(arbitraryData)

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
                useGeneric, } = useSharedElements()


        //hidden prop used for tab visibility
        return (<div hidden={hidden}>
                <Crown arbitraryData={arbitraryData} />
                <Header arbitraryData={arbitraryData} />
                <ActionBlock arbitraryData = {arbitraryData} actionType='debits' actionLabel='Debit' isAddRemove={true} />
                <ActionBlock arbitraryData = {arbitraryData} actionType='credits' actionLabel='Credit' isAddRemove={true}/>
                {/* <Crown2 arbitraryData={arbitraryData} /> */}
                {/* <SubmitButton ad = {arbitraryData} meta= {meta} /> */}
        </div>)
}

export { JournalMain }