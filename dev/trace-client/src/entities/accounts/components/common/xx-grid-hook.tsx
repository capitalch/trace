import { useEffect, useState, useRef } from 'react'
import { Theme, createStyles, makeStyles } from '@material-ui/core'
import { useSharedElements } from './shared-elements-hook'

function useXXGrid(gridOptions: any) {
    const [, setRefresh] = useState({})
    let { sqlQueryArgs, sqlQueryId, summaryColNames } = gridOptions
    const meta: any = useRef({
        filteredRows: [],
        filteredSummary: {},
        allSummary: {},
        isDailySummary: false,
        isMounted: false,
        isReverseOrder: false,
        rows: [],
        selectedSummary: {},
        searchText: '',
        viewLimit: 0,
    })

    const {
        _,
        emit,
        filterOn,
        getCurrentEntity,
        getFromBag,
        execGenericView,
        toDecimalFormat,
    } = useSharedElements()

    useEffect(() => {
        meta.current.isMounted = true
        gridOptions.autoFetchData && fetchRows(sqlQueryId, sqlQueryArgs)
        const subs1 = filterOn('XX-GRID-FETCH-DATA').subscribe((d: any) => {
            if (d.data) {
                sqlQueryArgs = d.data
            }
            fetchRows(sqlQueryId, sqlQueryArgs)
        })
        const subs2 = filterOn('XX-GRID-RESET').subscribe(() => {
            meta.current.filteredRows = []
            setRefresh({})
        })
        return () => {
            meta.current.isMounted = false
            subs1.unsubscribe()
            subs2.unsubscribe()
        }
    }, [])

    useEffect(() => {
        // if(meta.current.isReverseOrder){
        let rows = [...meta.current.filteredRows]
        rows.reverse()
        meta.current.filteredRows = rows
        // } 
        setRefresh({})
    }, [meta.current.isReverseOrder])

    const entityName = getCurrentEntity()

    async function fetchRows(queryId: string, queryArgs: any) {
        if (!queryId || !queryArgs) {
            return
        }
        emit('SHOW-LOADING-INDICATOR', true)
        const ret1: any = await execGenericView({
            isMultipleRows: gridOptions.jsonFieldPath ? false : true,
            sqlKey: queryId,
            args: queryArgs || null,
            entityName: entityName,
        })
        emit('SHOW-LOADING-INDICATOR', false)
        let i = 1
        function incr() {
            return i++
        }
        let ret: any[]
        let openingBalance = meta.current.opBalance = (ret1?.jsonResult?.opBalance || { debit: 0, credit: 0 })

        if (gridOptions.jsonFieldPath) {
            ret = _.get(ret1, gridOptions.jsonFieldPath)
        } else {
            ret = ret1
        }

        ret.unshift({
            otherAccounts: 'Opening balance',
            debit: toDecimalFormat(meta.current.opBalance.debit),
            credit: toDecimalFormat(meta.current.opBalance.credit),
            tranDate: getFromBag('finYearObject').isoStartDate
        })

        meta.current.rows = ret

        injectDailySummary()
        ret = meta.current.rows

        meta.current.isReverseOrder && ret.reverse()

        const tot: any = {}
        const temp: any[] = !ret
            ? []
            : ret.map((x: any) => {
                if (!x.isDailySummary) {
                    x['id1'] = x.id
                    for (let col of summaryColNames) {
                        tot[col] = +(tot[col] || 0) + x[col]
                    }
                }
                x.id = incr()
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

    function injectDailySummary() {
        let rows = meta.current.rows
        if (meta.current.isDailySummary) {
            const summaryRows = getSummaryRows(rows)
            // merge transactions with summaryRows and sort
            rows = rows.concat(summaryRows)
            rows = _.sortBy(rows, [
                'tranDate',
            ]) // Used lodash because JavaScript sort did not work out
            rows.shift() // remove first row which is having blank date value
            // cleanup
            rows = rows.map(
                (item: any) => {
                    return {
                        ...item,
                        tranType:
                            item.tranType === 'Summary' ? '' : item.tranType,
                    }
                }
            )
        } 
        // else {
        //     meta.current.filteredRows = rows
        // }
        meta.current.rows = rows

        function getSummaryRows(arr: any[]) {
            const summary: any[] = []
            let opBalance = 0
            if (meta.current.opBalance?.debit) {
                opBalance = +meta.current.opBalance.debit
            } else {
                opBalance = -meta.current.opBalance.credit
            }
            opBalance = +opBalance || 0
            const acc: any = {
                tranDate: '',
                op: +opBalance,

                debit: 0,
                credit: 0,
                clos: +opBalance,
                otherAccounts: toOpeningDrCr(opBalance),
                instrNo: toClosingDrCr(opBalance),
                tranType: 'Summary',
                isDailySummary: true
            }

            for (let item of arr) {
                if (item.tranDate === acc.tranDate) {
                    acc.debit = +acc.debit + (item.debit || 0)
                    acc.credit = +acc.credit + (item.credit || 0)
                } else {
                    //push
                    acc.clos = +acc.op + acc.debit - acc.credit
                    acc.otherAccounts = toOpeningDrCr(acc.op)
                    acc.instrNo = toClosingDrCr(acc.clos)
                    summary.push({ ...acc })

                    acc.tranDate = item.tranDate
                    acc.op = +acc.clos
                    acc.otherAccounts = toOpeningDrCr(acc.op)
                    acc.autoRefNo = 'Summary'
                    acc.debit = +item.debit
                    acc.credit = +item.credit
                    acc.clos = +acc.op + acc.debit - acc.credit
                    acc.instrNo = toClosingDrCr(acc.clos)
                }
            }

            acc.clos = +acc.op + acc.debit - acc.credit

            acc.instrNo = toClosingDrCr(acc.clos)
            summary.push({ ...acc })

            return summary

            function toOpeningDrCr(value: number) {
                return 'Opening: '.concat(
                    String(toDecimalFormat(Math.abs(value))) +
                    (value >= 0 ? ' Dr' : ' Cr')
                )
            }

            function toClosingDrCr(value: number) {
                return 'Closing: '.concat(
                    String(toDecimalFormat(Math.abs(value))) +
                    (value >= 0 ? ' Dr' : ' Cr')
                )
            }
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
                for (let col of summaryColNames) {
                    prev[col] = (prev[col] || 0.0) + (current[col] || 0.0)
                }
                return prev
            },
            {}
        )
    }
    return {
        fetchRows,
        meta,
        onSelectModelChange,
        requestSearch,
        setFilteredSummary,
        setRefresh,
    }
}

export { useXXGrid, useStyles }

const useStyles: any = makeStyles((theme: Theme) =>
    createStyles({
        // xxx: {
        //     color: (meta:any)=>{
        //         console.log(meta)
        //         return('red')
        //     }
        // },
        content: {
            height: '100%',
            width: '100%',

            '& .ledger-summary': {
                color: theme.palette.blue.dark,
                backgroundColor: '#FFFAFA',
                fontFamily: 'Lato',
                fontWeight: 'bold'
            },

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
                        color: theme.palette.primary.main,
                        // height: '1.5rem'
                    },
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
