import { useEffect, useState, useRef } from 'react'
// import MaterialTable from 'material-table'
import { XGrid, GridToolbar } from '@material-ui/x-grid'
// import { DataGrid, useGridApiRef, GridToolbar } from '@material-ui/data-grid'
import { Theme, createStyles, makeStyles, Card } from '@material-ui/core'
import { manageEntitiesState } from '../../../../common-utils/esm'
import { utilMethods } from '../../../../common-utils/util-methods'
import { useTraceGlobal } from '../../../../common-utils/trace-global'
// import { tableIcons } from '../common/material-table-icons'
import { useSharedElements } from '../common/shared-elements-hook'
import { useAllTransactions } from './helpers/all-transactions'

function GenericReports({ loadReport }: any) {
    const selectLogic: any = {
        allTransactions: useAllTransactions,
    }
    const { args, columns, sqlQueryId, title } = selectLogic[loadReport]()
    const [rows, setRows]: any[] = useState([])
    const [isMounted, setIsMounted] = useState(false)

    // const { getCurrentWindowSize } = useTraceGlobal()
    const { getCurrentEntity } = manageEntitiesState()

    const { execGenericView  } = utilMethods()

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
    // const classes = useStyles()

    useEffect(() => {
        setIsMounted(true)
        fetchRows(sqlQueryId, args)
        return () => {
            setIsMounted(false)
        }
    }, [])

    return (
        <Card style={{ height: '82vh', width: '100%' }}>
            <XGrid
                columns={columns}
                rows={rows}
                rowHeight={32}
                components={{
                    Toolbar: CustomToolbar,
                }}
                checkboxSelection={true}
            />
        </Card>
    )

    function CustomToolbar(){
        return(
            <div style = {{display:'flex'}}>
                <label>{title}</label>
                <GridToolbar />
            </div>
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
        const temp: any[] = ret.map((x: any) => {
            x['id1'] = x.id
            x.id = incr()
            return x
        })
        ret && setRows(temp)
    }
}
export { GenericReports }

const useStyles: any = makeStyles((theme: Theme) =>
    createStyles({
        content: {
            '& .select': {
                fontSize: '0.8rem',
                minWidth: '4rem',
            },
        },
    })
)