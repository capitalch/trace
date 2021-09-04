import { useState, useEffect, useRef } from 'react'
// import moment from 'moment'
import {
    IconButton,
    Dialog,
    DialogTitle,
    DialogActions,
    DialogContent,
    Theme,
    createStyles,
    makeStyles,
} from '@material-ui/core'
import { useSharedElements } from '../common/shared-elements-hook'
import { manageEntitiesState } from '../../../../common-utils/esm'
import CloseIcon from '@material-ui/icons/Close'
import { usingIbuki } from '../../../../common-utils/ibuki'
import { utils } from '../../utils'
import { emit } from 'process'

function AccountsLedgerDialog() {
    const [, setRefresh] = useState({})
    const { getFromBag } = manageEntitiesState()
    const { getGeneralLedger } = utils()
    const {getAccountName, emit, moment, toDecimalFormat, XXGrid } = useSharedElements()
    const meta: any = useRef({
        accId: 0,
        accName: '',
        isMounted: false,
        sum: [{ debit: 0, credit: 0 }],
        opBalance: { debit: 0, credit: 0 },
        transactions: [{ debit: 0, credit: 0 }],
        showDialog: false,
        finalBalance: 0.0,
        finalBalanceType: ' Dr',
        dateFormat: '',
        dialogConfig: {
            dialogWidth: '900px',
        },
    })
    const { filterOn } = usingIbuki()
    const classes = useStyles({ meta: meta })
    meta.current.dateFormat = getFromBag('dateFormat')
    const { fetchData, LedgerDataTable } = getGeneralLedger(meta)

    useEffect(() => {
        meta.current.isMounted = true
        const subs = filterOn('SHOW-LEDGER').subscribe(async (d) => {
            meta.current.showDialog = true
            meta.current.accId = d.data
            meta.current.accName = getAccountName(d.data)
            setRefresh({})
        })
        return () => {
            subs.unsubscribe()
            meta.current.isMounted = false
        }
    }, [])

    function closeDialog() {
        meta.current.showDialog = false
        setRefresh({})
    }

    return (
        // <div >
        <Dialog
            className={classes.content}
            open={meta.current.showDialog}
            maxWidth="lg"
            fullWidth={true}
            // fullScreen={true}
            onClose={closeDialog}>
            <DialogTitle
                disableTypography
                id="generic-dialog-title"
                className="dialog-title">
                <h3>{'Account: '.concat(meta.current.accName)}</h3>
                <IconButton
                    size="small"
                    color="default"
                    onClick={closeDialog}
                    aria-label="close">
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent className={classes.dialogContent}>
                {/* <LedgerDataTable isScrollable={false} className='data-table' /> */}
                {/* <button onClick={()=>{
                     emit('XX-GRID-FETCH-DATA','')
                }}>test</button> */}
                <XXGrid
                    autoFetchData={true}
                    columns={getArtifacts().columns}
                    hideViewLimit={true}
                    summaryColNames={getArtifacts().summaryColNames}
                    title="Ledger view"
                    sqlQueryId="get_accountsLedger"
                    sqlQueryArgs={getArtifacts().args}
                    specialColumns={getArtifacts().specialColumns}
                    toShowOpeningBalance={true}
                    toShowClosingBalance={true}
                    xGridProps={{ disableSelectionOnClick: true }}
                    jsonFieldPath="jsonResult.transactions" // data is available in nested jason property
                />
            </DialogContent>
            <DialogActions></DialogActions>
        </Dialog>
        // </div>
    )

    function getArtifacts() {
        const columns = [
            {
                headerName: 'Ind',
                description: 'Index',
                field: 'id',
                width: 80,
                disableColumnMenu: true,
            },
            { headerName: 'Id', field: 'id1', width: 90 },
            {
                headerName: 'Date',
                field: 'tranDate',
                width: 120,
                type: 'date',
                valueFormatter: (params: any) =>
                    moment(params.value).format('DD/MM/YYYY'),
            },
            { headerName: 'Ref', field: 'autoRefNo', width: 200 },
            { headerName: 'Other accounts', field: 'otherAccounts', width: 200 },
            {
                headerName: 'Debits',
                field: 'debit',
                type: 'number',
                width: 160,
                valueFormatter: (params: any) => toDecimalFormat(params.value),
            },
            {
                headerName: 'Credits',
                field: 'credit',
                type: 'number',
                width: 160,
                valueFormatter: (params: any) => toDecimalFormat(params.value),
            },

            {
                headerName: 'Instr',
                field: 'instrNo',
                width: 160,
                sortable: false,
            },
            {
                headerName: 'User ref no',
                field: 'userRefNo',
                width: 160,
                sortable: false,
            },
            {
                headerName: 'Remarks',
                field: 'remarks',
                width: 200,
                sortable: false,
            },
            {
                headerName: 'Line ref no',
                field: 'lineRefNo',
                width: 200,
                sortable: false,
            },
            {
                headerName: 'Line remarks',
                field: 'lineRemarks',
                width: 200,
                sortable: false,
            },
            {
                headerName: 'Tags',
                field: 'tags',
                width: 200,
                sortable: false,
            },
        ]
        const summaryColNames = ['debit', 'credit']
        const args = {
            id: meta.current.accId,
        }
        const specialColumns = {
            // isRemove: true,
            isEdit: true,
            isDelete: true,
            editIbukiMessage: 'VOUCHER-VIEW-XX-GRID-EDIT-CLICKED',
            deleteIbukiMessage: 'VOUCHER-VIEW-XX-GRID-DELETE-CLICKED',
            // isDrillDown: true,
        }
        return { columns, summaryColNames, args, specialColumns }
    }
}

export { AccountsLedgerDialog }

const useStyles: any = makeStyles((theme: Theme) =>
    createStyles({
        content: {
            '& .dialog-title': {
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingBottom: '0px',
            },

            '& .data-table': {
                '& .p-datatable-tfoot': {
                    '& tr': {
                        '& td': {
                            fontSize: '0.8rem',
                            // fontWeight: 'normal',
                            color: 'dodgerBlue !important',
                        },
                    },
                },
            },
        },
        dialogContent: {
            height: 'calc(100vh - 163px)',
            // height: '50rem'
        },
    })
)
