import React, { useState, useEffect, useRef } from 'react'
import { makeStyles, Theme, createStyles } from '@material-ui/core'
import { useSharedElements } from '../../common/shared-elements-hook'
import { useLayoutEffect } from 'react'

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
        setAccounts()
        emit('JOURNAL-MAIN-REFRESH', '') // refresh accounts in child
        const subs1 = filterOn('JOURNAL-CHANGE-TAB').subscribe((d: any) => {
            const tranHeaderId = d.data?.tranHeaderId
            fetchDataOnId(tranHeaderId)
            handleOnTabChange(null, d.data?.tabValue)
        })
        return () => {
            meta.current.isMounted = false
            subs1.unsubscribe()
        }
    }, [])

    const meta: any = useRef({
        isMounted: false,
        title: 'Journals',
        tabValue: 0,
    })

    const arbitraryData: any = useRef({
        accounts: {
            all: [],
            journal: [],
        },
        autoRefNo: undefined,
        commonRemarks: undefined,
        gstin: undefined,
        errorObject: {},
        id: undefined,
        isIgst: false,
        tags: undefined,
        tranDate: undefined,
        tranTypeId: 1,
        userRefNo: undefined,

        debits: [{ key: 0 },],
        credits: [{ key: 0 },],
    })

    async function fetchDataOnId(tranHeaderId: number) {
        console.log('fetching data:', tranHeaderId)
        emit('SHOW-LOADING-INDICATOR', true)
        try {
            const ret: any = await execGenericView({
                isMultipleRows: false,
                args: {
                    id: tranHeaderId,
                },
                sqlKey: 'getJson_tranHeader_details',
            })
            populateData(ret?.jsonResult)

        } catch (e) {
            console.log(e.message)
        } finally {
            emit('SHOW-LOADING-INDICATOR', false)
        }

        function populateData(jsonResult: any) {
            const tranDetails: any[] = jsonResult.tranDetails
            const tranHeader: any = jsonResult.tranHeader
            console.log(tranHeader)
            const tranTypeId = tranHeader.tranTypeId
            const ad = arbitraryData.current
            ad.id = tranHeader.id
            ad.tranDate = tranHeader.tranDate
            ad.autoRefNo = tranHeader.autoRefNo
            ad.userRefNo = tranHeader.userRefNo
            ad.commonRemarks = tranHeader.remarks
            ad.tags = tranHeader.tags
            ad.tranTypeId = tranHeader.trantypeId
            // ad.isGst = true

            const debits: any[] = tranDetails.filter((x: any) => x.dc === 'D')
            const credits: any[] = tranDetails.filter((x: any) => x.dc === 'C')
            ad.debits = debits
            ad.credits = credits
            meta.current.isMounted && setRefresh({})
            emit('SUBMIT-REFRESH','')
            
        }
    }

    function handleOnTabChange(e: any, newValue: number) {
        meta.current.tabValue = newValue
        meta.current.isMounted && setRefresh({})
    }

    function setAccounts() {
        const allAccounts = getFromBag('allAccounts') || []
        arbitraryData.current.accounts.all = allAccounts
        const jouAccounts = allAccounts.filter(
            (el: any) =>
                ["branch",
                    "capital",
                    "other",
                    "loan",
                    "iexp",
                    "dexp",
                    "dincome",
                    "iincome",
                    "creditor",
                    "debtor"].includes(el.accClass) &&
                (el.accLeaf === 'Y' || el.accLeaf === 'L')
        )
        arbitraryData.current.accounts.journal = jouAccounts
    }

    // function setTab(val:number){
    //     meta.current.tabValue = val
    //     meta.current.isMounted && setRefresh({})
    // }

    return { arbitraryData, handleOnTabChange, meta, setRefresh }
}

export { useJournals }

const useStyles: any = makeStyles((theme: Theme) =>
    createStyles({
        content: {
            '& .tabs': {
                color: theme.palette.common.white,
                backgroundColor: theme.palette.grey[600],
            },
            '& .tab': {
            }
        },
    })
)

export { useStyles }
