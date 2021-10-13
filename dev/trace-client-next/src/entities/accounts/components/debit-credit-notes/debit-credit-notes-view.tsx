import {
    Box,
    Icon,
    IconButton,
    NativeSelect,
    Typography,
} from '../../../../imports/gui-imports'
import { Add, DeleteForever, Edit } from '../../../../imports/icons-import'
import {
    MaterialTable,
    moment,
    useConfirm,
} from '../../../../imports/regular-imports'
import { useSharedElements } from '../common/shared-elements-hook'
import {
    useDebitCreditNotesView,
    useStyles,
} from './debit-credit-notes-view-hook'

function DebitCreditNotesView({ arbitraryData, tranType }: any) {
    const { getXXGridParams, loadDataOnId, meta } = useDebitCreditNotesView(
        arbitraryData,
        tranType
    )
    const classes = useStyles()
    const confirm = useConfirm()
    const {
        accountsMessages,
        emit,
        genericUpdateMaster,
        getFromBag,
        isDateAuditLocked,
        setInBag,
        tableIcons,
        toDecimalFormat,
        XXGrid,
    } = useSharedElements()
    const dateFormat = getFromBag('dateFormat')
    const {
        columns,
        queryId,
        queryArgs,
        specialColumns,
        summaryColNames,
        title,
    } = getXXGridParams()
    return (
        <div className={classes.content}>
            <XXGrid
                columns={columns}
                sqlQueryId={queryId}
                sqlQueryArgs={queryArgs}
                specialColumns={specialColumns}
                summaryColNames={summaryColNames}
                title=""
                viewLimit="100"
            />
        </div>
    )
}

export { DebitCreditNotesView }

// function getActionsList() {
//     return [
//         {
//             icon: () => <Add />, // Here the <Add> is placeholder. It is later customized to select control
//             name: 'select',
//             isFreeAction: true,
//             onClick: () => {}, // This empty onClick is a hack. Without this warning appears
//         },
//         {
//             icon: () => <Edit color="primary" />,
//             toolTip: 'Edit transaction',
//             name: 'edit',
//             onClick: async (e: any, rowData: any) => {
//                 const tranDate = rowData.tranDate
//                 if (isDateAuditLocked(tranDate)) {
//                     emit('SHOW-MESSAGE', {
//                         severity: 'error',
//                         message: accountsMessages.auditLockError,
//                         duration: null,
//                     })
//                 } else {
//                     // loadData(rowData.id)
//                 }
//             },
//         },
//         {
//             icon: () => <DeleteForever color="error"></DeleteForever>,
//             toolTip: 'Delete transaction',
//             name: 'delete',
//             onClick: async (e: any, rowData: any) => {
//                 const options = {
//                     description: accountsMessages.debitNoteDelete,
//                     confirmationText: 'Yes',
//                     cancellationText: 'No',
//                 }
//                 if (isDateAuditLocked(rowData.tranDate)) {
//                     emit('SHOW-MESSAGE', {
//                         severity: 'error',
//                         message: accountsMessages.auditLockError,
//                         duration: null,
//                     })
//                 } else {
//                     confirm(options)
//                         .then(async () => {
//                             const headerId = rowData['id']
//                             emit('SHOW-LOADING-INDICATOR', true)
//                             await genericUpdateMaster({
//                                 deletedIds: [headerId],
//                                 tableName: 'TranH',
//                             })
//                             emit('SHOW-LOADING-INDICATOR', false)
//                             emit('SHOW-MESSAGE', {})
//                             // getData()
//                         })
//                         .catch(() => {
//                             console.log(
//                                 accountsMessages.transactionNotDeleted
//                             )
//                         })
//                 }
//             },
//         },
//     ]
// }

// function getColumnsArray(): any[] {
//     return [
//         { title: 'Index', field: 'index', maxWidth: '3rem' },
//         { title: 'Id', field: 'id', maxWidth: '5rem' },
//         { title: 'Ref no', field: 'autoRefNo', maxWidth: '9rem' },
//         {
//             title: 'Date',
//             field: 'tranDate',
//             type: 'date',
//             render: (rowData: any) =>
//                 moment(rowData.tranDate).format(dateFormat),
//             maxWidth: '4rem',
//         },
//         {
//             title: 'Amount',
//             field: 'amount',
//             align: 'right',
//             type: 'numeric',
//             render: (rowData: any) => toDecimalFormat(rowData.amount),
//             maxWidth: '4rem',
//         },
//         { title: 'User ref', field: 'userRefNo', maxWidth: '6rem' },
//         { title: 'Debit a/c', field: 'debitAccount', maxWidth: '6rem' },
//         { title: 'Credit a/c', field: 'creditAccount', maxWidth: '6rem' },
//         { title: 'Remarks', field: 'remarks' },
//         { title: 'Line ref', field: 'lineRefNo', maxWidth: '6rem' },
//         { title: 'Line remarks', field: 'lineRemarks', maxWidth: '6rem' },
//     ]
// }

{
    /* <MaterialTable
            icons={tableIcons}
            columns={getColumnsArray()}
            data={meta.current.data}
            title={meta.current.title}
            actions={getActionsList()}
            options={{
                maxBodyHeight: 'calc(100vh - 26rem)',
                headerStyle: {
                    backgroundColor: '#01579b',
                    color: '#FFF',
                },
                actionsColumnIndex: 1,
                paging: false,
            }}
            components={{
                Action: (props: any) => {
                    // If it is edit or delete retain the functionality defined in action
                    let ret: any = (
                        <IconButton
                            onClick={(event: any) =>
                                props.action.onClick(event, props.data)
                            }>
                            <Icon>{props.action.icon()}</Icon>
                        </IconButton>
                    )
                    if (props.action.name === 'select') {
                        const label =
                            tranType === 'dn'
                                ? 'flightLandTran'
                                : 'flightTakeoffTran'
                        ret = (
                            <Box component="span">
                                <Typography variant="caption" component="span">
                                    Last
                                </Typography>
                                <NativeSelect
                                    value={getFromBag(label) ?? meta.current.no} // if undefined or null then 10
                                    style={{
                                        width: '3.3rem',
                                        marginLeft: '0.1rem',
                                    }}
                                    onChange={(e) => {
                                        setInBag(label, e.target.value)
                                        getData()
                                    }}>
                                    <option value={10}>10</option>
                                    <option value={50}>50</option>
                                    <option value={100}>100</option>
                                    <option value={500}>500</option>
                                    <option value={1000}>1000</option>
                                    <option value={''}>All</option>
                                </NativeSelect>
                            </Box>
                        )
                    }
                    return ret
                },
            }}
        /> */
}
