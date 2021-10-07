import React, { useState, useEffect, useRef } from 'react'
import { useSharedElements } from '../common/shared-elements-hook'
import { useTaxation, useStyles } from './taxation-hook'

function Taxation() {
        const [, setRefresh] = useState({})
        const classes = useStyles()
        const {GstReport1, handleFetchData, meta } = useTaxation()

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

        return (<div className={classes.content}>

                <Box className='header'>
                        <Typography variant='h6' component='span'>Gst report</Typography>
                        <TextField
                                label="From date"
                                // error={isInvalidDate(arbitraryData.tranDate)}
                                // helperText={
                                //     isInvalidDate(arbitraryData.tranDate)
                                //         ? accountsMessages.dateRangeAuditLockMessage
                                //         : ''
                                // }
                                type="date"
                                InputLabelProps={{ shrink: true }}
                                onChange={(e: any) => {
                                        meta.current.startDate = e.target.value
                                        meta.current.isMounted && setRefresh({})
                                }}
                                onFocus={(e) => e.target.select()}
                                value={meta.current.startDate || ''}
                        />

                        <TextField
                                type='date'
                                InputLabelProps={{ shrink: true }}
                                label='To date'
                                onFocus={(e) => e.target.select()}
                                onChange={(e: any) => {
                                        meta.current.endDate = e.target.value
                                        meta.current.isMounted && setRefresh({})
                                }}
                                value={meta.current.endDate || ''}
                        />
                        <IconButton
                                className='sync-class'
                                size="medium"
                                color="secondary"
                                onClick={handleFetchData}>
                                <SyncIcon></SyncIcon>
                        </IconButton>
                </Box>
                <GstReport1 />
        </div>)

}

export { Taxation }