import React, { useState, useEffect, useRef } from 'react'
import moment from 'moment'
import {
    Toolbar, Typography, Backdrop
    , Button
    , Hidden
    , IconButton, Chip,
    Avatar, Box, Container, Paper
    , Dialog
    , DialogTitle
    , DialogActions, DialogContent, Theme, useTheme,
    createStyles, makeStyles
    , List, ListItem, ListItemAvatar, ListItemText, Grid
    , TextField, InputAdornment
} from '@material-ui/core'
import { manageEntitiesState } from '../../../common-utils/esm'
import SyncIcon from '@material-ui/icons/SyncSharp'
import CircularProgress from '@material-ui/core/CircularProgress'
import RefreshIcon from '@material-ui/icons/Refresh'
import SearchIcon from '@material-ui/icons/Search'
import CloseIcon from '@material-ui/icons/Close'
import AddIcon from '@material-ui/icons/Add'
// import { Dialog } from 'primereact/dialog'
import { DataTable } from 'primereact/datatable'
// import { Button } from 'primereact/button'
import { Column } from 'primereact/column'
import { useIbuki } from '../../../common-utils/ibuki'
import { graphqlService } from '../../../common-utils/graphql-service'
import { utilMethods } from '../../../common-utils/util-methods'
// import { graphqlQueries } from '../../../shared-artifacts/graphql-queries-mutations'
// import queries from '../artifacts/graphql-queries-mutations'


function AccountsLedgerDialog() {
    const [, setRefresh] = useState({})
    const isMounted = useRef(true)
    const { queryGraphql } = graphqlService()
    const { toDecimalFormat, execGenericView } = utilMethods()
    const { getFromBag } = manageEntitiesState()
    const meta: any = useRef({
        ledgerId: 0
        , accName: ''
        , sum: [{ debit: 0, credit: 0 }]
        , opBalance: { debit: 0, credit: 0 }
        , transactions: [{ debit: 0, credit: 0 }]
        , showDialog: false
        , finalBalance: 0.00
        , finalBalanceType: ' Dr'
        , isLoading: false
        , dateFormat: ''
        , dialogConfig: {
            dialogWidth: '800px'
        }
    })
    const { filterOn } = useIbuki()
    const classes = useStyles({ meta: meta })
    meta.current.dateFormat = getFromBag('dateFormat')

    async function getData(id: number) {
        meta.current.isLoading = true
        isMounted && setRefresh({})
        const ret: any = await execGenericView({
            sqlKey: 'get_accountsLedger'
            , isMultipleRows: false
            , args: {
                id: id
            }
        })
        const pre = ret?.jsonResult
        meta.current.ledgerId = id
        meta.current.accName = pre.accName
        pre.sum[0].debit || (pre.sum[0].debit = 0)
        pre.sum[0].credit || (pre.sum[0].credit = 0)
        meta.current.sum = pre.sum
        meta.current.opBalance = pre.opBalance || { debit: 0, credit: 0 }
        pre.transactions || (pre.transactions = [{ debit: 0, credit: 0 }])
        meta.current.transactions = pre.transactions.map((x: any) => {
            return {
                ...x
                , debit: toDecimalFormat(x.debit)
                , credit: toDecimalFormat(x.credit)
                , tranDate: moment(x.tranDate).format(meta.current.dateFormat)
            }
        }) || [{}]
        // Add opening balance at the begining
        meta.current.transactions.unshift({
            otherAccounts: 'Opening balance'
            , debit: toDecimalFormat(meta.current.opBalance.debit)
            , credit: toDecimalFormat(meta.current.opBalance.credit)
        })
        const preSum = meta.current.sum[0]
        const debit = preSum.debit || 0
        const credit = preSum.credit || 0
        const balance = debit - credit || 0
        const balanceType = balance >= 0 ? ' Dr' : ' Cr'
        meta.current.finalBalance = toDecimalFormat(Math.abs(balance))
        meta.current.finalBalanceType = balanceType
        meta.current.isLoading = false
        isMounted.current && setRefresh({})
    }

    useEffect(() => {
        isMounted.current = true
        const subs = filterOn('SHOW-LEDGER').subscribe(d => {
            meta.current.showDialog = true
            meta.current.ledgerId = d.data
            getData(d.data)
        })
        return (() => {
            subs.unsubscribe()
            isMounted.current = false
        })
    }, [])

    function closeDialog() {
        meta.current.showDialog = false
        setRefresh({})
    }

    return (
        <div>
            <Dialog
                classes={{ paper: classes.dialogPaper }} // overriding to adjust dialog width as per device viewport
                open={meta.current.showDialog}
                onClose={closeDialog}>
                <DialogTitle disableTypography id="generic-dialog-title"
                    className={classes.dialogTitle}>
                    <h3>
                        {'Ledger: '.concat(meta.current.accName)}
                    </h3>
                    <IconButton size='small' color="default"
                        onClick={closeDialog} aria-label="close">
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent className={classes.dialogContent}>
                    {getDialogContent()}
                </DialogContent>
                <DialogActions
                // className={classes.dialogActions}
                >
                </DialogActions>
            </Dialog>
            <Backdrop
                className={classes.backdrop}
                open={meta.current.isLoading}>
                <CircularProgress style={{ zIndex: 1000000 }} color="inherit" />
            </Backdrop>
        </div>
    )

    function getDialogContent() {
        const ret = <DataTable
            value={meta.current.transactions}
            loading={meta.current.isLoading}
        >
            <Column style={{ width: '6.5rem', textAlign: 'left' }}
                field='tranDate'
                header='Date'
                footer='Total'
            ></Column>
            <Column style={{ width: '20rem', textAlign: 'left' }}
                field='otherAccounts'
                header='Account name'
            ></Column>
            <Column style={{ width: '6.5rem', textAlign: 'left' }}
                field='tranType'
                header='Tran type'
            ></Column>
            <Column style={{ width: '8rem', textAlign: 'right' }}
                field='debit'
                header='Debits'
                footer={toDecimalFormat(meta.current.sum[0].debit)}
            ></Column>
            <Column style={{ width: '8rem', textAlign: 'right' }}
                field='credit'
                header='Credits'
                footer={toDecimalFormat(meta.current.sum[0].credit)}
            ></Column>
            <Column style={{ width: '11rem', textAlign: 'left' }}
                field='autoRefNo'
                header='Auto ref no'
            ></Column>
            <Column style={{ width: '8rem', textAlign: 'left' }}
                field='instrNo'
                header='Instrument'
            ></Column>

            <Column style={{ width: '9rem', textAlign: 'left' }}
                field='userRefNo'
                header='User ref no'
                footer='Closing balance: '
            ></Column>
            <Column style={{ width: '10rem', textAlign: 'left' }}
                field='remarks'
                header='Remarks'
                footer={<div style={{ textAlign: 'right' }}><span>{String(meta.current.finalBalance)}</span><span style={{ color: `${(meta.current.finalBalanceType === ' Dr') ? 'black' : 'red'}` }}>{meta.current.finalBalanceType}</span></div>}
            ></Column>
            <Column style={{ width: '10rem', textAlign: 'left' }}
                field='lineRefNo'
                header='Line ref no'
            ></Column>
            <Column style={{ width: '20rem', textAlign: 'left' }}
                field='lineRemarks'
                header='Line remarks'
            ></Column>
        </DataTable>
        return ret
    }
}

export { AccountsLedgerDialog }

const useStyles: any = makeStyles((theme: Theme) =>
    createStyles({
        backdrop: {
            zIndex: theme.zIndex.drawer + 1,
            color: theme.palette.primary.dark,
        },

        content: {
            marginBottom: theme.spacing(1),
            width: (props: any) => props.meta.current.windowWidth,
            overflowX: 'auto',
        },

        header: {
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: theme.spacing(1),
        },

        dialogPaper: {
            width: (props: any) => props.meta.current.dialogConfig.dialogWidth
        },

        dialogTitle: {
            display: 'flex'
            , justifyContent: 'space-between'
            , alignItems: 'center'
            , paddingBottom: '0px'
        },
    })
)