import React, { useState, useEffect, useRef } from 'react'
import { makeStyles, Theme, createStyles } from '@material-ui/core'
import { useSharedElements } from '../common/shared-elements-hook'

function <%= compName %>(){
	const [, setRefresh] = useState({})
	const classes = useStyles()

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

        return(<div className={classes.content}>
        	<%= compName %>
        </div>)

        const meta: any = useRef({
            isMounted: false,
        })

        useEffect(() => {
            meta.current.isMounted = true

            return (() => {
                meta.current.isMounted = false
            })
        }, [])

        function test(){

        }
}

export {<%= compName %>}

const useStyles: any = makeStyles((theme: Theme) =>
    createStyles({

        content: {
            
        },

    })
)