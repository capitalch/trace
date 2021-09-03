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
    const { emit, moment, toDecimalFormat, XXGrid } = useSharedElements()
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
    const { fetchData, getLedgerColumns, LedgerDataTable } = getGeneralLedger(meta)

    useEffect(() => {
        meta.current.isMounted = true
        const subs = filterOn('SHOW-LEDGER').subscribe(async (d) => {
            meta.current.showDialog = true
            meta.current.accId = d.data
            // await fetchData()
            // emit('XX-GRID-FETCH-DATA','')
            setRefresh({})
        })
        return () => {
            subs.unsubscribe()
            meta.current.isMounted = false
        }
    }, [])

    // useEffect(()=>{
    //     emit('XX-GRID-FETCH-DATA','')
    // })

    function closeDialog() {
        meta.current.showDialog = false
        setRefresh({})
    }

    return (
        // <div >
        <Dialog className={classes.content}
            open={meta.current.showDialog}
            maxWidth="lg"
            fullWidth={true}
            // fullScreen={true}
            onClose={closeDialog}>
            <DialogTitle
                disableTypography
                id="generic-dialog-title"
                className='dialog-title'>
                <h5>{'Ledger: '.concat(meta.current.accName)}</h5>
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
                    summaryColNames={getArtifacts().summaryColNames}
                    title='Ledger view'
                    sqlQueryId='get_accountsLedger'
                    sqlQueryArgs={getArtifacts().args}
                    specialColumns={getArtifacts().specialColumns}
                    xGridProps={{ disableSelectionOnClick: true }}
                    jsonFieldPath='jsonResult.transactions'
                />
            </DialogContent>
            <DialogActions></DialogActions>
        </Dialog>
        // </div>
    )

    function getArtifacts() {
        const columns = [{
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

        {
            headerName: 'Debits',
            field: 'debit',
            sortable: false,
            type: 'number',
            width: 160,
            valueFormatter: (params: any) => toDecimalFormat(params.value),
        },
        {
            headerName: 'Credits',
            sortable: false,
            field: 'credit',
            type: 'number',
            width: 160,
            valueFormatter: (params: any) => toDecimalFormat(params.value),
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
                        }
                    }
                },
            },
        },
        dialogContent: {
            height: 'calc(100vh - 163px)'
            // height: '50rem'
        }
    })
)
