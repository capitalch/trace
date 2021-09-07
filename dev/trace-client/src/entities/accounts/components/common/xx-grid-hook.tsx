import { useEffect, useState, useRef } from 'react'
import { Theme, createStyles, makeStyles } from '@material-ui/core'
import { useSharedElements } from './shared-elements-hook'

function useXXGrid(gridOptions: any) {
    const [, setRefresh] = useState({})
    const {sqlQueryArgs, sqlQueryId, summaryColNames} = gridOptions
    const meta: any = useRef({
        filteredRows: [],
        filteredSummary: {},
        allSummary: {},
        isMounted: false,
        rows: [],
        selectedSummary: {},
        searchText: '',
        viewLimit: 0,
    })
    
    const { _, emit, filterOn, getCurrentEntity,getFromBag, execGenericView } = useSharedElements()

    useEffect(() => {
        meta.current.isMounted = true
        gridOptions.autoFetchData && fetchRows(sqlQueryId, sqlQueryArgs)
        const subs1 = filterOn('XX-GRID-FETCH-DATA').subscribe(()=>{
            fetchRows(sqlQueryId, sqlQueryArgs)
        })
        return () => {
            meta.current.isMounted = false
            subs1.unsubscribe()
        }
    }, [])
    const entityName = getCurrentEntity()

    async function fetchRows(queryId: string, queryArgs: any) {
        emit('SHOW-LOADING-INDICATOR', true)
        const ret1: any = await execGenericView({
            isMultipleRows: gridOptions.jsonFieldPath ? false: true,
            sqlKey: queryId,
            args: queryArgs || null,
            entityName: entityName,
        })
        emit('SHOW-LOADING-INDICATOR', false)
        let i = 1
        function incr() {
            return i++
        }
        let ret
        let openingBalance = ret1?.jsonResult?.opBalance
        
        if(gridOptions.jsonFieldPath){
            ret = _.get(ret1,gridOptions.jsonFieldPath)
        } else {
            ret = ret1
        }
        if(gridOptions.toShowOpeningBalance){
            if((!openingBalance) || (_.isEmpty(openingBalance))) {
                openingBalance = {debit:0,credit: 0, tranDate:undefined}
            }
            const finYearObject = getFromBag('finYearObject')
            ret.unshift({
                   autoRefNo: 'Opening balance',
                   debit: openingBalance.debit,
                   credit: openingBalance.credit,
                   tranDate: finYearObject?.isoStartDate
               })
        }
        const tot: any = {}
        const temp: any[] = ret.map((x: any) => {
            x['id1'] = x.id
            x.id = incr()
            for (let col of summaryColNames) {
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
            requestSearch(meta.current.searchText)
            meta.current.isMounted && setRefresh({})
        }
    }

    function onSelectModelChange(rowIds: any) {
        const rows = meta.current.rows
        const obj = rowIds.reduce((prev: any, current: any) => {
            prev.count = prev.count ? prev.count + 1 : 1
            for (let col of summaryColNames) {
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
                for(let col of summaryColNames){
                    prev[col] = (prev[col] || 0.0) + (current[col] || 0.0)
                }
                return prev
            },
            {}
        )
    }
    return {fetchRows, meta,onSelectModelChange, requestSearch,setFilteredSummary, setRefresh }
}

export { useXXGrid, useStyles }

const useStyles: any = makeStyles((theme: Theme) =>
    createStyles({
        content: {
            height: '100%',
            // minHeight: '30rem', 
            width: '100%',
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
                '& .view-limit': {
                    display: 'flex',
                    columnGap: '0.5rem',
                    color: theme.palette.secondary.main,
                    '& select': {
                        borderColor: 'grey',
                        color: theme.palette.primary.main
                        // height: '1.5rem'
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