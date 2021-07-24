import { useEffect, useState, useRef } from 'react'
import MaterialTable from 'material-table'
import {
    Theme,
    createStyles,
    makeStyles,
    Card,
} from '@material-ui/core'
import { manageEntitiesState } from '../../../../common-utils/esm'
import { utilMethods } from '../../../../common-utils/util-methods'
import { useTraceGlobal } from '../../../../common-utils/trace-global'
import { tableIcons } from './material-table-icons'
import { useSharedElements } from '../common/shared-elements-hook'

function GenericReports({ loadReport }: any) {
    const [, setRefresh] = useState({})

    const meta: any = useRef({
        isMounted: false,
        // isLoading: false,
        no: 10,
        title: '',
        reportData: [],
    })

    const { getCurrentWindowSize } = useTraceGlobal()
    const { getCurrentEntity } = manageEntitiesState()
    
    const { execGenericView } = utilMethods()
    const { toDecimalFormat } = utilMethods()

    const entityName = getCurrentEntity()
    const { AddIcon, Box, emit, getFromBag, NativeSelect, setInBag, Typography, } = useSharedElements()
    const dateFormat = getFromBag('dateFormat')
    const classes = useStyles()

    useEffect(() => {
        meta.current.isMounted = true
        const { fetchData } = selectLogic[loadReport]()
        fetchData()
        return () => {
            meta.current.isMounted = false
        }
    }, [])

    const selectLogic: any = {
        allTransactions: allTransactionsReport,
    }

    return selectLogic[loadReport]().display()

    function allTransactionsReport() {
        function display() {
            const w = getCurrentWindowSize()
            return (
                <Card className={classes.content}>
                    <MaterialTable
                        style={{ width: getCurrentWindowSize() }}
                        isLoading={meta.current.isLoading}
                        icons={tableIcons}
                        columns={getColumns()}
                        data={meta.current.reportData}
                        title="All transactions"
                        actions={getActionsList()}
                        options={{
                            paging: false,
                            search: true, 
                            selection: true,
                            rowStyle: rowData => ({ backgroundColor: rowData.tableData.checked ? '#37b15933' : '' }),                            
                            headerStyle: { position: 'sticky', top: 0 },
                            maxBodyHeight: 'calc(100vh - 15rem)',
                        }}
                        // onSelectionChange={(rows)=>{
                        //     console.log(rows)
                        // }}
                        components={{
                            Action: (props: any) => {
                                let ret = <></>
                                if (props.action.name === 'select') {
                                    ret = (
                                        <Box className="select-last" component="span">
                                            <Typography
                                                variant="caption"
                                                component="span">
                                                Last
                                            </Typography>
                                            <NativeSelect
                                                className = 'select'
                                                value={
                                                    getFromBag('allTrans') ?? meta.current.no // if undefined or null then 10
                                                }
                                                style={{
                                                    width: '3.3rem',
                                                    marginLeft: '0.1rem',
                                                }}
                                                onChange={(e) => {
                                                    setInBag('allTrans', e.target.value)
                                                    fetchData()
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
                            }
                        }}
                    />
                </Card>
            )
        }
        async function fetchData() {
            meta.current.title = 'All transactions report'
            emit('SHOW-LOADING-INDICATOR', true)

            const ret = await execGenericView({
                isMultipleRows: true,
                sqlKey: 'get_allTransactions',
                args: {
                    dateFormat: dateFormat,
                    no: (getFromBag('allTrans') ?? meta.current.no) || null,
                },
                entityName: entityName,
            })
            emit('SHOW-LOADING-INDICATOR', false)

            ret && (meta.current.reportData = ret)
            meta.current.isMounted && setRefresh({})
        }

        function getColumns(): any[] {
            return [
                { title: 'Index', field: 'index', width: 20 },
                { title: 'Id', field: 'id', sorting: true, width: 20 },
                { title: 'Date', field: 'tranDate', sorting: true },
                { title: 'Ref no', field: 'autoRefNo' },
                { title: 'Account', field: 'accName' },
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

                { title: 'Instr no', field: 'instrNo' },
                { title: 'User ref no', field: 'userRefNo' },
                { title: 'Remarks', field: 'remarks' },
                { title: 'Line ref no', field: 'lineRefNo' },
                { title: 'Line remarks', field: 'lineRemarks' },
            ]

        }

        function getActionsList() {
            return [
                {
                    icon: () => <AddIcon />, // Here the <Addicon> is placeholder. It is later customized to select control
                    name: 'select',
                    isFreeAction: true,
                    onClick: () => { }, // This empty onClick is a hack. Without this warning appears
                },
            ]
        }

        return ({ display, fetchData })
    }
}
export { GenericReports }

const useStyles: any = makeStyles((theme: Theme) => createStyles({
    content: {
        '& .select': {
            fontSize: '0.8rem',
            minWidth: '4rem'
        }
    }
}))


