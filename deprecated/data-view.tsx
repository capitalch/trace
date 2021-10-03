import { useState, useEffect, useRef } from 'react'
import MaterialTable from 'material-table'
import { tableIcons } from '../common/material-table-icons'
import moment from 'moment'
import {
    Button,
    Typography,
    IconButton,
    Box,
    Paper,
    Icon,
    NativeSelect,
} from '@material-ui/core'
import { Edit } from '@material-ui/icons'
import DeleteIcon from '@material-ui/icons/Delete'
import AddIcon from '@material-ui/icons/AddCircle'
import upperFirst from 'lodash/capitalize'
import { utilMethods } from '../../../../common-utils/util-methods'
import { utils } from '../../utils'
import { useTraceGlobal } from '../../../../common-utils/trace-global'
import { useSharedElements } from '../common/shared-elements-hook'

function DataView({ loadComponent }: any) {
    const [, setRefresh] = useState({})
    const { isDateAuditLocked } = utils()
    const { getFromGlobalBag, getCurrentMediaSize, getCurrentWindowSize } =
        useTraceGlobal()
    const {
        accountsMessages,
        confirm,
        emit,
        execGenericView,
        getFromBag,
        setInBag,
        toDecimalFormat,
    } = useSharedElements()
    const dateFormat = getFromBag('dateFormat')
    const tranTypes: any = {
        payments: 2,
        receipts: 3,
        contra: 6,
        journals: 1,
    }

    const meta: any = useRef({
        isMounted: false,
        title: '',
        reportData: [],
        globalFilter: null,
        no: 10,
        windowWidth: '',
        searchFieldWidth: '14rem',
    })

    processMediaLogic()

    useEffect(() => {
        meta.current.isMounted = true
        getData()
        return () => {
            meta.current.isMounted = false
        }
    }, [])

    return (
        <Paper>
            <MaterialTable
                style={{ width: getCurrentWindowSize() }}
                icons={tableIcons}
                columns={getColumnsArray()}
                data={meta.current.reportData}
                title={meta.current.title}
                options={{
                    actionsColumnIndex: 1,
                    maxBodyHeight: 'calc(100vh - 15rem)',
                    paging: false,
                    draggable: true,
                    showSelectAllCheckbox:false,
                    showTextRowsSelected: false,
                    searchFieldStyle: {
                        width: meta.current.searchFieldWidth,
                        marginLeft: '0px',
                        paddingLeft: '0px',
                    },
                    // to make fixed header
                    headerStyle: { position: 'sticky', top: 0 },
                }}
                actions={getActionsList()}
                components={{
                    Action: (props: any) => {
                        // If it is edit or delete retain the functionality defined in action
                        let ret: any = (
                            <Button
                                size="small"
                                onClick={(event: any) =>
                                    props.action.onClick(event, props.data)
                                }>
                                <Icon>{props.action.icon()}</Icon>
                            </Button>
                        )
                        //for new make it a button type instead of default icon type
                        if (props.action.name === 'new') {
                            ret = (
                                <IconButton
                                    size="medium"
                                    color="secondary"
                                    style={{
                                        marginLeft: '0.1rem',
                                    }}
                                    onClick={() => {
                                        emit('LOAD-MAIN-COMPONENT-NEW', '')
                                    }}>
                                    <AddIcon fontSize="large"></AddIcon>
                                </IconButton>
                            )
                        } else if (props.action.name === 'select') {
                            ret = (
                                <Box component="span">
                                    <Typography
                                        variant="caption"
                                        component="span">
                                        Last
                                    </Typography>
                                    <NativeSelect
                                        value={
                                            getFromBag(loadComponent) ||
                                            meta.current.no
                                        }
                                        style={{
                                            width: '3.3rem',
                                            marginLeft: '0.1rem',
                                        }}
                                        onChange={(e) => {
                                            setInBag(
                                                loadComponent,
                                                e.target.value
                                            )
                                            getData()
                                        }}>
                                        <option value={10}>10</option>
                                        <option value={50}>50</option>
                                        <option value={100}>100</option>
                                        <option value={0}>All</option>
                                    </NativeSelect>
                                </Box>
                            )
                        }
                        return ret
                    },
                }}></MaterialTable>
        </Paper>
    )

    function processMediaLogic() {
        const isDrawyerOpen = getFromGlobalBag('isDrawyerOpen')
        const isDrawyerClose = !isDrawyerOpen
        meta.current.windowWidth = 'calc(100vw - 32px)' // based on experimentation
        isDrawyerOpen &&
            (meta.current.windowWidth = 'calc(100vw - 260px - 32px)')
        const mediaLogic: any = {
            xs: () => {
                const title = meta.current.title
                meta.current.title = title ? title.substring(0, 1) : title
                isDrawyerClose &&
                    (meta.current.windowWidth = 'calc(100vw - 24px)')
                meta.current.searchFieldWidth = '8rem'
            },
            sm: () => {
                isDrawyerClose &&
                    (meta.current.windowWidth = 'calc(100vw - 32px)')
                meta.current.searchFieldWidth = '13rem'
            },
            md: () => {
                isDrawyerClose &&
                    (meta.current.windowWidth = 'calc(100vw - 32px)')
                meta.current.searchFieldWidth = '13rem'
            },
            lg: () => {
                isDrawyerClose &&
                    (meta.current.windowWidth = 'calc(100vw - 32px)')
                meta.current.searchFieldWidth = '13rem'
            },
            xl: () => mediaLogic['lg'](),
        }

        const currentMediaSize = getCurrentMediaSize()
        mediaLogic[currentMediaSize]()
    }

    async function getData() {
        meta.current.title = upperFirst(loadComponent)
        emit('SHOW-LOADING-INDICATOR', true)
        const no =
            getFromBag(loadComponent) === '0'
                ? null
                : getFromBag(loadComponent) || meta.current.no
        const ret = await execGenericView({
            isMultipleRows: true,
            sqlKey: 'get_tranHeaders_details',
            args: {
                tranTypeId: tranTypes[loadComponent],
                no: no,
            },
        })
        emit('SHOW-LOADING-INDICATOR', false)
        ret && (meta.current.reportData = dataFormatter(ret))
        meta.current.isMounted && setRefresh({})
    }

    function getActionsList(): any[] {
        return [
            {
                icon: () => <AddIcon />,
                toolTip: 'Add new transaction',
                name: 'new',
                isFreeAction: true, // isFreeAction puts the icon in toolbar
                onClick: () => {}, // This empty onClick is a hack. Without this warning appears
            },
            {
                icon: () => <AddIcon />, // Here the <Addicon> is placeholder. It is later customized to select control
                name: 'select',
                isFreeAction: true,
                onClick: () => {}, // This empty onClick is a hack. Without this warning appears
            },
            {
                icon: () => <Edit color="secondary" fontSize="small" />,
                toolTip: 'Edit transaction',
                name: 'edit',
                onClick: (e: any, rowData: any) => {
                    const tranDate = rowData.tranDate
                    if (isDateAuditLocked(tranDate)) {
                        emit('SHOW-MESSAGE', {
                            severity: 'error',
                            message: accountsMessages.auditLockError,
                            duration: null,
                        })
                    } else if (rowData?.clearDate) {
                        // already reconciled so edit /delete not possible
                        emit('SHOW-MESSAGE', {
                            severity: 'error',
                            message: accountsMessages.reconcillationDone,
                            duration: null,
                        })
                    } else {
                        const tranHeaderId = rowData['tranHeaderId']
                        emit('LOAD-MAIN-COMPONENT-EDIT', {
                            headerId: tranHeaderId,
                        })
                    }
                },
            },
            {
                icon: () => <DeleteIcon color="error" fontSize="small" />,
                toolTip: 'Delete transaction',
                name: 'delete',
                onClick: async (e: any, rowData: any) => {
                    const { genericUpdateMaster } = utilMethods()
                    const options = {
                        description: accountsMessages.transactionDelete,
                        confirmationText: 'Yes',
                        cancellationText: 'No',
                    }

                    const tranHeaderId = rowData['tranHeaderId']

                    if (isDateAuditLocked(rowData.tranDate)) {
                        emit('SHOW-MESSAGE', {
                            severity: 'error',
                            message: accountsMessages.auditLockError,
                            duration: null,
                        })
                    } else if (rowData?.clearDate) {
                        // already reconciled so edit /delete not possible
                        emit('SHOW-MESSAGE', {
                            severity: 'error',
                            message: accountsMessages.reconcillationDone,
                            duration: null,
                        })
                    } else {
                        confirm(options)
                            .then(async () => {
                                await genericUpdateMaster({
                                    deletedIds: [tranHeaderId],
                                    tableName: 'TranH',
                                })
                                emit('SHOW-MESSAGE', {})
                                emit('TRACE-MAIN-JUST-REFRESH', '')
                            })
                            .catch(() => {}) // important to have otherwise eror
                    }
                },
            },
        ]
    }

    function getColumnsArray(): any[] {
        return [
            { title: 'Index', field: 'index', type: 'numeric' },
            {
                title: 'Date',
                field: 'tranDate',
                render: (rowData: any) =>
                    moment(rowData.tranDate).format(dateFormat),
                type: 'date',
            },
            { title: 'Id', field: 'tranHeaderId', type: 'numeric' },
            { title: 'Ref no', field: 'autoRefNo' },
            {
                title: 'Debit',
                field: 'debit',
                type: 'numeric',
                render: (rowData: any) => toDecimalFormat(rowData.debit),
            },
            {
                title: 'Credit',
                field: 'credit',
                type: 'numeric',
                render: (rowData: any) => toDecimalFormat(rowData.credit),
            },
            { title: 'Account', field: 'accName' },

            { title: 'User ref', field: 'userRefNo' },
            { title: 'Instr', field: 'instrNo' },
            { title: 'Remarks', field: 'headerRemarks' },
            { title: 'Line ref', field: 'lineRefNo' },
            { title: 'Line remarks', field: 'lineRemarks' },
        ]
    }

    function dataFormatter(raw: any[]) {
        let numb = 1
        function incr() {
            return numb++
        }
        return raw.map((x: any) => {
            if (x.dc === 'D') {
                x.debit = x.amount
            } else {
                x.credit = x.amount
            }
            x.index = incr()
            return x
        })
    }
}

export { DataView }
