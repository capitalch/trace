import { useState, useEffect, useRef } from 'react'
import { makeStyles, Theme, createStyles } from '@material-ui/core'
import { useSharedElements } from '../common/shared-elements-hook'
// import { LedgerSubledger } from '../../common/ledger-subledger'
import { arbitraryData } from './arbitrary-data'
import {useCrown} from './crown-hook'

function Crown({ meta }: any) {
    const classes = useStyles()
    const {
        checkError,
        ResetButton,
        SubmitButton,
        setRefresh,
        SummaryDebitsCredits,
        SummaryGst,
    } = useCrown(meta)

    const {
        emit,
        filterOn,
        Paper,
        Typography,
    } = useSharedElements()

    useEffect(() => {
        const subs1 = filterOn('CROWN-REFRESH').subscribe(
            () => {
                meta.current.errorMessage = ''
                checkError(arbitraryData)
                setRefresh({})
                emit(
                    'CROWN2-REFRESH',
                    meta.current.errorMessage
                )
            }
        )
        return () => {
            subs1.unsubscribe()
        }
    }, [])

    checkError(arbitraryData)
    return (
        <Paper elevation={1} className={classes.contentCrown}>
            <SummaryDebitsCredits ad={arbitraryData} />
            <SummaryGst ad={arbitraryData} />
            <ResetButton />
            <Typography variant="subtitle2" className="error-message">
                {meta.current.errorMessage}
            </Typography>
            <SubmitButton ad={arbitraryData} meta={meta} />
        </Paper>
    )
}

function Crown1({ meta }: any) {
    const classes = useStyles()
    const [, setRefresh] = useState({})
    const {
        _,
        accountsMessages,
        AddCircle,
        Button,
        Checkbox,
        CheckIcon,
        emit,
        ErrorIcon,
        filterOn,
        genericUpdateMasterDetails,
        getFromBag,
        getMappedAccounts,
        FormControlLabel,
        IconButton,
        isInvalidDate,
        isInvalidGstin,
        NumberFormat,
        Paper,
        RemoveCircle,
        TextField,
        toDecimalFormat,
        Typography,
    } = useSharedElements()
    const {
        checkError,
        ResetButton,
        SubmitButton,
        SummaryDebitsCredits,
        SummaryGst,
    } = useCrown(meta)
    useEffect(() => {
        const subs1 = filterOn('CROWN2-REFRESH').subscribe(
            (d: any) => {
                setRefresh({})
            }
        )
        return () => {
            subs1.unsubscribe()
        }
    }, [])
    return (
        <Paper elevation={1} className={classes.contentCrown}>
            <SummaryDebitsCredits ad={arbitraryData} />
            <SummaryGst ad={arbitraryData} />
            <ResetButton />
            <Typography variant="subtitle2" className="error-message">
                {meta.current.errorMessage}
            </Typography>
            <SubmitButton ad={arbitraryData} meta={meta} />
        </Paper>
    )
}

export{Crown, Crown1}

const useStyles: any = makeStyles((theme: Theme) =>
    createStyles({
        contentCrown: {
            display: 'flex',
            columnGap: theme.spacing(4),
            rowGap: theme.spacing(2),
            flexWrap: 'wrap',
            marginTop: theme.spacing(2),
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: theme.spacing(1),
            backgroundColor: '#E8E8E8',

            '& .summary-debits-credits': {
                color: theme.palette.indigo.main,
                fontWeight: 'bold',
            },

            '& .summary-gst': {
                color: theme.palette.lime.dark,
            },

            '& .error-message': {
                color: 'red',
                fontWeight: 'bold',
            },

            // '& .submit-button': {},
            '& .reset-button': {
                backgroundColor: theme.palette.blue.main,
                color: theme.palette.getContrastText(theme.palette.blue.main),
            },
        },
    })
)