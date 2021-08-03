import { useEffect, useState, useRef } from 'react'
import { Theme, createStyles, makeStyles } from '@material-ui/core'
import { useSharedElements } from '../../common/shared-elements-hook'
import { useAllTransactions } from '../helpers/all-transactions'
import { useGridApiRef, GridRowId, GridRowData } from '@material-ui/x-grid'
import { utilMethods } from '../../../../../common-utils/util-methods'
import { manageEntitiesState } from '../../../../../common-utils/esm'

function useGenericReports(loadReport: any) {
    const [, setRefresh] = useState({})
    const selectLogic: any = {
        allTransactions: useAllTransactions,
    }
    const { args, columns, sqlQueryId, summaryColumns, title, } = selectLogic[loadReport]()

    const meta: any = useRef({
        filteredRows: [],
        filteredSummary: {},
        allSummary: {},
        isMounted: false,
        no: 0,
        rows: [],
        selectedSummary: {},
        searchText: '',
    })

    const { _, emit } = useSharedElements()

    useEffect(() => {
        meta.current.isMounted = true
        fetchRows(sqlQueryId, args)
        return () => {
            meta.current.isMounted = false
        }
    }, [])

    const { getCurrentEntity } = manageEntitiesState()
    const apiRef = useGridApiRef()
    const { execGenericView } = utilMethods()
    const entityName = getCurrentEntity()

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
        const tot: any = {}
        const temp: any[] = ret.map((x: any) => {
            x['id1'] = x.id
            x.id = incr()
            for (let col of summaryColumns) {
                tot[col] = (tot[col] || 0) + x[col]
            }
            return x
        })

        tot.count = ret?.length
        if (ret) {
            meta.current.rows = temp
            meta.current.filteredRows = [...meta.current.rows]
            meta.current.allSummary = tot
            setFilteredSummary()
            meta.current.isMounted && setRefresh({})
        }
    }

    function onSelectModelChange(rowIds: any) {
        const rows = meta.current.rows
        const obj = rowIds.reduce((prev: any, current: any) => {
            prev.count = prev.count ? prev.count + 1 : 1
            for (let col of summaryColumns) {
                prev[col] = (prev[col] || 0.0) + rows[current - 1][col]
            }
            return prev
        }, {})

        meta.current.selectedSummary = _.isEmpty(obj) ? {} : obj
        meta.current.isMounted && setRefresh({})
    }

    function requestSearch(searchValue: string) {
        meta.current.searchText = searchValue
        const searchRegex = new RegExp(searchValue, 'i')
        const filteredRows = meta.current.rows.filter((row: any) => {
            return Object.keys(row).some((field) => {
                const temp = row[field] ? row[field].toString() : ''
                return searchRegex.test(temp)
            })
        })
        meta.current.filteredRows = filteredRows
        setFilteredSummary()
        meta.current.isMounted && setRefresh({})
    }

    function setFilteredSummary() {
        // Evaluates the meta.current.filteredSummary from meta.current.filteredRows
        meta.current.filteredSummary = meta.current.filteredRows.reduce(
            (prev: any, current: any) => {
                prev.count = (prev.count || 0) + 1
                for(let col of summaryColumns){
                    prev[col] = (prev[col] || 0.0) + (current[col] || 0.0)
                }
                return prev
            },
            {}
        )
    }

    return {
        args,
        columns,
        fetchRows,
        meta,
        onSelectModelChange,
        requestSearch,
        setFilteredSummary,
        setRefresh,
        sqlQueryId,
        summaryColumns,
        title,
    }
}

export { useGenericReports, useStyles }

const useStyles: any = makeStyles((theme: Theme) =>
    createStyles({
        content: {
            height: 'calc(100vh - 163px)',
            width: '100%',
            marginTop: '5px',
            '& .delete': {
                color: 'red',
            },
            '& .custom-toolbar': {
                display: 'flex',
                marginLeft: '10px',
                flexWrap: 'wrap',
                alignItems: 'center',
                columnGap: '1.5rem',
                borderBottom: '1px solid lightgrey',
                '& .toolbar-title': {
                    color: 'dodgerblue',
                    fontSize: '1.2rem',
                    fontWeight: 'bold',
                },
                '& .global-search': {
                    marginLeft: 'auto',
                    marginRight: '1rem',
                },
                '& .last-no':{
                    display: 'flex',
                    columnGap: '0.5rem',
                    color: theme.palette.secondary.main,
                    '& select':{
                        borderColor:'grey'
                    }

                }
            },
            '& .custom-footer': {
                display: 'flex',
                marginLeft: '10px',
                flexWrap: 'wrap',
                justifyContent: 'flexStart',

                '& .common': {
                    display: 'flex',
                },

                '& .selected': {
                    color: theme.palette.primary.main,
                },

                '& .filtered': {
                    color: theme.palette.secondary.main,
                },

                '& .all': {
                    color: 'dodgerblue',
                    marginRight: '1rem',
                },
            },
        },
    })
)
