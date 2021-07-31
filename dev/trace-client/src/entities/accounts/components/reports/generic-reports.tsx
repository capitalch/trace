import { useEffect, useState, useRef } from 'react'
// import MaterialTable from 'material-table'
import {
    XGrid,
    GridApi,
    GridToolbar,
    GridToolbarFilterButton,
    GridToolbarDensitySelector,
    GridToolbarExport,
    GridToolbarContainer,
    GridToolbarColumnsButton,
    GridFooter,
    GridFooterContainer,
    useGridApiRef
} from '@material-ui/x-grid'
// import { DataGrid, useGridApiRef, GridToolbar } from '@material-ui/data-grid'
import {
    Theme,
    createStyles,
    makeStyles,
    Card,
    Typography,
    Box,
} from '@material-ui/core'
import { manageEntitiesState } from '../../../../common-utils/esm'
import { utilMethods } from '../../../../common-utils/util-methods'
import { useTraceGlobal } from '../../../../common-utils/trace-global'
// import { tableIcons } from '../common/material-table-icons'
import { useSharedElements } from '../common/shared-elements-hook'
import { useAllTransactions } from './helpers/all-transactions'
import { useGridSlotComponentProps } from '@material-ui/data-grid'

function GenericReports({ loadReport }: any) {
    const [,setRefresh] = useState({})
    const selectLogic: any = {
        allTransactions: useAllTransactions,
    }
    const { args, columns, sqlQueryId, title } = selectLogic[loadReport]()
    const [rows, setRows]: any[] = useState([])
    const [selectedRowsCount, setSelectedRowsCount] = useState(0)
    const [selectedTotal, setSelectedTotal] = useState(0)
    const [grandTotal, setGrandTotal] = useState({ debits: 0, credits: 0 })
    const [isMounted, setIsMounted] = useState(false)
    const apiRef = useGridApiRef()
    // const { getCurrentWindowSize } = useTraceGlobal()
    const { getCurrentEntity } = manageEntitiesState()

    const { execGenericView } = utilMethods()

    const entityName = getCurrentEntity()
    const {
        // AddIcon,
        // Box,
        emit,
        getFromBag,
        // setInBag,
        // Typography,
    } = useSharedElements()
    const dateFormat = getFromBag('dateFormat')
    const classes = useStyles()

    useEffect(() => {
        // setIsMounted(true)
        fetchRows(sqlQueryId, args)
        return () => {
            // setIsMounted(false)
        }
    }, [])

    // console.log('rendered')
    return (
        <Card
            // style={{ height: '82vh', width: '100%' }}
            className={classes.content}>
            <XGrid
                apiRef={apiRef}
                columns={columns}
                rows={rows}
                rowHeight={32}
                components={{
                    Toolbar: CustomGridToolbar,
                    Footer: CustomGridFooter,
                }}
                checkboxSelection={true}
                componentsProps={{
                    footer: {
                        count: rows.length,
                        selectedRowsCount: selectedRowsCount,
                        grandTotal: grandTotal,
                        selectedTotal: selectedTotal,
                    },
                }}
                onSelectionModelChange={onSelectModelChange}
                onFilterModelChange={onFilterModelChange}
                showColumnRightBorder={true}
                showCellRightBorder={true}
            />
        </Card>
    )

    function onSelectModelChange(nrows: any) {
        setSelectedRowsCount(nrows.length)
        // apiRef.current.showFilterPanel('tranDate')
        const s2 = apiRef.current.getVisibleRowModels()
        // setRefresh({})
        const s1 = apiRef.current.getSelectedRows()
        console.log(s1)
        
    }

    function onFilterModelChange(e:any){
        console.log('count:', apiRef.current.getRowsCount())
    }

    function CustomGridToolbar() {
        return (
            <GridToolbarContainer className="custom-toolbar">
                <Typography variant="h6" className="toolbar-title">
                    {title}
                </Typography>
                <GridToolbarColumnsButton color="secondary" />
                <GridToolbarFilterButton color="secondary" />
                <GridToolbarDensitySelector color="secondary" />
                <GridToolbarExport color="secondary" />
            </GridToolbarContainer>
        )
    }

    function CustomGridFooter(props: any) {
        return (
            <GridFooterContainer>
                <span>Selected rows count:{props.selectedRowsCount}</span>
                <span>Count of rows:{props.count}</span>
                <span>Total debits:{props?.grandTotal?.debits}</span>
                <span>Total credits:{props?.grandTotal?.credits}</span>
            </GridFooterContainer>
        )
    }

    async function fetchRows(queryId: string, arg: any) {
        emit('SHOW-LOADING-INDICATOR', true)
        const ret: any[] = await execGenericView({
            isMultipleRows: true,
            sqlKey: queryId,
            args: arg,
            entityName: entityName,
        })
        emit('SHOW-LOADING-INDICATOR', false)
        let i = 1
        function incr() {
            return i++
        }
        const tot = {
            debits: 0,
            credits: 0,
        }
        const temp: any[] = ret.map((x: any) => {
            x['id1'] = x.id
            x.id = incr()
            tot.debits = tot.debits + x.debit
            tot.credits = tot.credits + x.credit
            return x
        })
        if (ret) {
            setRows(temp)
            setGrandTotal(tot)
        }
    }
}
export { GenericReports }

const useStyles: any = makeStyles((theme: Theme) =>
    createStyles({
        content: {
            height: '83vh',
            width: '100%',
            marginTop: '5px',
            '& .custom-toolbar': {
                display: 'flex',
                marginLeft: '10px',
                flexWrap: 'wrap',
                alignItems: 'center',
                '& .toolbar-title': {
                    color: 'dodgerblue',
                    fontSize: '1.2rem',
                    fontWeight: 'bold',
                },
                '& .toolbar-selected-summary': {
                    display: 'flex',
                    marginTop: theme.spacing(0.4),
                },
            },
            '& .select': {
                fontSize: '0.8rem',
                minWidth: '4rem',
            },
        },
    })
)

// <div className="custom-toolbar">
//     <Typography className='toolbar-title'>{title}</Typography>
//     <GridToolbar />
//     <Box className='toolbar-selected-summary'>
//         <Typography color='secondary'>Selected debits:</Typography>
//         <Typography color='secondary'>Selected credits:</Typography>
//     </Box>
//     <CustomRowCounter />
// </div>
