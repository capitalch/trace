import { useState, useEffect, useRef } from 'react'
// import moment from 'moment'
import { IconButton, Dialog, DialogTitle, DialogActions, DialogContent, Theme } from '@material-ui/core';
import createStyles from '@material-ui/styles/createStyles';
import { makeStyles } from '@material-ui/styles'
import { manageEntitiesState } from '../../../../common-utils/esm'
import CloseIcon from '@material-ui/icons/Close'
import { DataTable } from 'primereact/datatable'
// import { Column } from 'primereact/column'
import { usingIbuki } from '../../../../common-utils/ibuki'
// import { utilMethods } from '../../../../common-utils/util-methods'
// import { useSharedElements } from '../common/shared-elements-hook'
import { utils } from '../../utils'

function AccountsLedgerDialog() {
    const [, setRefresh] = useState({})
    // const { emit } = usingIbuki()
    // const { toDecimalFormat, execGenericView } = utilMethods()
    const { getFromBag } = manageEntitiesState()
    // const { SearchIcon } = useSharedElements()
    const { getGeneralLedger } = utils()

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
            await fetchData()
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
        <Dialog className={classes.content}
            open={meta.current.showDialog}
            maxWidth="md"
            fullWidth={true}
            onClose={closeDialog}>
            <DialogTitle
                // disableTypography
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
                <LedgerDataTable isScrollable={false} className='data-table' />
            </DialogContent>
            <DialogActions></DialogActions>
        </Dialog>
        // </div>
    )
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
        }
    })
)
