import { useEffect, useState, useRef } from 'react'
import { Theme, createStyles, makeStyles, } from '@material-ui/core'
import { useSharedElements } from '../../common/shared-elements-hook'
import { useAllTransactions } from '../helpers/all-transactions'
import { useGridApiRef, GridRowId, GridRowData, } from '@material-ui/x-grid'
import { utilMethods } from '../../../../../common-utils/util-methods'
import { manageEntitiesState } from '../../../../../common-utils/esm'

function useGenericReports(loadReport: any) {
    const [, setRefresh] = useState({})
    const selectLogic: any = {
        allTransactions: useAllTransactions,
    }
    const { args, columns, sqlQueryId, title } = selectLogic[loadReport]()

    const meta: any = useRef({
        rowModels: 0,
        filteredRows: [],
        filteredSummary: {
            count: 0,
            debit: 0,
            credit: 0,
        },
        allSummary: {
            count: 0,
            debit: 0,
            credit: 0,
        },
        isMounted: false,
        rows: [],
        selectedSummary: {
            count: 0,
            debit: 0,
            credit: 0,
        },
        searchText: '',
        selectedRowsCount: 0,
        selectedTotal: 0,
    })

    const { _, emit, } = useSharedElements()

    useEffect(() => {
        meta.current.isMounted = true
        fetchRows(sqlQueryId, args)
        return () => {
            meta.current.isMounted = false
        }
    }, [])

    const { getCurrentEntity } = manageEntitiesState()
    const apiRef = useGridApiRef()
    const { execGenericView, } = utilMethods()
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
        const tot = {
            debit: 0,
            credit: 0,
            count: 0,
        }
        const temp: any[] = ret.map((x: any) => {
            x['id1'] = x.id
            x.id = incr()
            tot.debit = tot.debit + x.debit
            tot.credit = tot.credit + x.credit
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
            prev.debit = prev.debit
                ? prev.debit + rows[current - 1].debit
                : rows[current - 1].debit || 0.0
            prev.credit = prev.credit
                ? prev.credit + rows[current - 1].credit
                : rows[current - 1].credit || 0.0
            return prev
        }, {})

        meta.current.selectedSummary = _.isEmpty(obj)
            ? { count: 0, debit: 0.0, credit: 0.0 }
            : obj

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
        meta.current.filteredSummary = meta.current.filteredRows.reduce((prev: any, current: any) => {
            prev.count = (prev.count || 0) + 1
            prev.debit = (prev.debit || 0.0) + (current.debit || 0.0)
            prev.credit = (prev.credit || 0.0) + (current.credit || 0.0)
            return prev
        }, {})
    }

    return { args, columns, fetchRows, meta, onSelectModelChange, requestSearch, setFilteredSummary, setRefresh, sqlQueryId, title }
}

export { useGenericReports, useStyles }

const useStyles: any = makeStyles((theme: Theme) =>
    createStyles({
        content: {
            height: 'calc(100vh - 163px)',
            width: '100%',
            marginTop: '5px',
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
                    color: theme.palette.secondary.main
                },

                '& .all': {
                    color: 'dodgerblue',
                    marginRight: '1rem'
                }
            },
        },
    })
)