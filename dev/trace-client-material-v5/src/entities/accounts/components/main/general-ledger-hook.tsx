import { useState, useEffect, useRef } from 'react'
import {
// makeStyles, 
Theme
} from '@material-ui/core';
import createStyles from '@material-ui/styles/createStyles';
import { makeStyles } from '@material-ui/styles'
import { useSharedElements } from '../common/shared-elements-hook'

function useGeneralLedger() {
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
        getGeneralLedger,
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
        PrimeDialog,
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
        meta.current.allAccounts = getFromBag('allAccounts').map(
            (item: any) => ({
                label: item.accName,
                value: item.id,
                ...item,
            })
        )
        meta.current.ledgerAccounts = meta.current.allAccounts
            .filter((el: any) => el.accLeaf === 'Y' || el.accLeaf === 'L')
            .map((el: any) => {
                return {
                    label: el.accName,
                    value: el.id,
                    accLeaf: el.accLeaf,
                    subledgers: el.accLeaf === 'L' ? [] : null,
                }
            })
        setRefresh({})
        return () => {
            meta.current.isMounted = false
        }
    }, [])

    const meta: any = useRef({
        accId: 0,
        allAccounts: [],
        data: [],
        dateFormat: getFromBag('dateFormat'),
        ledgerAccounts: [],
        isDailySummary: false,
        isMounted: false,
        isReverseOrder: false,
        showDialog: false,
        // rowCount: 0,
        transactions: [],
        ledgerSubledger: {},
        headerConfig: {
            title: 'General ledger',
        },
        dialogConfig: {
            title: '',
            content: () => { },
            actions: () => { },
        },
    })

    const { fetchData } = getGeneralLedger(meta)

    async function handleFetchData() {
        const accId = meta.current.ledgerSubledger.accId
        if (accId) {
            await fetchData()
        } else {
            meta.current.showDialog = true
        }
        meta.current.isMounted && setRefresh({})
    }

    return { handleFetchData, meta }
}

export { useGeneralLedger }


const useStyles: any = makeStyles((theme: Theme) =>
    createStyles({
        content: {
            '& .header': {
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: theme.spacing(1),
                '& .heading': {
                    fontWeight: 'bold'
                    // position: 'relative',
                    // top: '-2.5rem',
                },
                '& .expand': {
                    position: 'relative',
                    top: '.2rem',
                },
                '& .select-ledger': {
                    // position:'relative',
                    // top: '1rem',
                    display: 'flex',
                    flexDirection: 'column',
                    // rowGap: '0.2rem',
                    '& .ledger-subledger': {
                        position: 'relative',
                        // top:'0.5rem'
                    },
                },
            },
            '& .data-table': {
                '& .p-datatable-tfoot': {
                    '& tr': {
                        '& td': {
                            fontSize: '0.8rem',
                            color: 'dodgerBlue !important',
                        }
                    }
                },
                '& .ledger-summary': {
                    color: theme.palette.blue.dark,
                    backgroundColor: '#FFFAFA',
                    // fontSize:'0.7rem',
                    fontFamily: 'Lato',
                    fontWeight: 'bold'
                    // textAlign:'right',
                }
            },


        },
    })
)

export { useStyles }
