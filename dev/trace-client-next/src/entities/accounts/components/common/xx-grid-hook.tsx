import { useEffect, useState, useRef } from 'react'
import { Theme, createStyles, makeStyles } from '@material-ui/core'
import { useSharedElements } from './shared-elements-hook'

function useXXGrid(gridOptions: any) {
    const [, setRefresh] = useState({})
    let { sqlQueryArgs, sqlQueryId, summaryColNames } = gridOptions
    const meta: any = useRef({
        allRows: [],
        filteredRows: [],
        filteredSummary: {},
        allSummary: {},
        isColumnBalance: false,
        isDailySummary: false,
        isMounted: false,
        isReverseOrder: false,
        opBalance: { debit: 0, credit: 0 },
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

    const entityName = getCurrentEntity()
    const pre: any = meta.current

    function toggleReverseOrder() {
        let rows = [...pre.filteredRows]
        rows.reverse()
        pre.filteredRows = rows

        pre.isMounted && setRefresh({})
    }

    async function fetchRows(queryId: string, queryArgs: any) {
        if (!queryId || !queryArgs) {
            return
        }
        await fetch()
        setAllSummary()
        if (pre.isDailySummary) {
            injectDailySummary()
        }
        setUniqueIds()
        requestSearch(meta.current.searchText)

        pre.isMounted && setRefresh({})

        async function fetch() { // populates meta.current.filteredRows
            pre.isReverseOrder = false
            pre.isDailySummary = false
            pre.isColumnBalance = false
            emit('SHOW-LOADING-INDICATOR', true)
            const ret1: any = await execGenericView({
                isMultipleRows: gridOptions.jsonFieldPath ? false : true,
                sqlKey: queryId,
                args: queryArgs || null,
                entityName: entityName,
            })
            emit('SHOW-LOADING-INDICATOR', false)
            injectOpBalance(ret1)

            function injectOpBalance(ret1: any) {
                pre.opBalance = (ret1?.jsonResult?.opBalance || { debit: 0, credit: 0 })
                let ret: any[]
                if (gridOptions.jsonFieldPath) {
                    ret = _.get(ret1, gridOptions.jsonFieldPath)
                } else {
                    ret = ret1
                }
                ret = ret || []
                ret = ret.map((item: any) => {
                    return {
                        ...item,
                        balance: 0
                    }
                })

                gridOptions.toShowOpeningBalance && ret.unshift({
                    otherAccounts: 'Opening balance',
                    debit: pre.opBalance.debit,
                    credit: pre.opBalance.credit,
                    tranDate: getFromBag('finYearObject').isoStartDate,
                })
                pre.filteredRows = ret || []
                pre.allRows = [...ret]
            }
        }
    }

    function fillColumnBalance() {
        const rows: any[] = [...pre.allRows]
        if (pre.isColumnBalance) {            
            let op:number = 0.0
            for (let row of rows) {
                row.balance = op + (row.debit || 0.0) - (row.credit || 0.0)
                op = row.balance
            }
            
        } else {
           for(let row of rows){
               row.balance = undefined
           }           
        }
        pre.filteredRows = rows
        pre.isMounted && setRefresh({})
    }

    function injectDailySummary() {
        if (pre.allRows.length === 0) {
            meta.current.isMounted && setRefresh({})
            return
        }
        let rows = [...pre.allRows] // clone
        if (pre.isDailySummary) {
            const summaryRows = getSummaryRows(rows)
            rows = rows.concat(summaryRows)
            rows = _.sortBy(rows, [
                'tranDate',
            ]) // Used lodash because JavaScript sort did not work out
            rows.shift() // remove first row which is having blank date value

        } else {
            pre.isReverseOrder = false
        }
        pre.filteredRows = rows
        pre.isReverseOrder && toggleReverseOrder()
        setUniqueIds()
        pre.isMounted && setRefresh({})

        function getSummaryRows(arr: any[]) {
            const summary: any[] = []
            let opBalance = 0
            if (pre.opBalance?.debit) {
                opBalance = +pre.opBalance.debit
            } else {
                opBalance = -pre.opBalance.credit
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
                    // if(item.id1){
                    acc.debit = +acc.debit + (item.debit || 0)
                    acc.credit = +acc.credit + (item.credit || 0)
                    // }                    
                } else {
                    //push
                    acc.clos = (item.id1 ? +acc.op : 0) + acc.debit - acc.credit // This iif was necessary to skip initial opbalance which is already taken in debit or credit
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
        const rows = pre.allRows
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
        meta.current.filteredRows = meta.current.allRows.filter((row: any) => {
            return Object.keys(row).some((field) => {
                const temp = row[field] ? row[field].toString() : ''
                return searchRegex.test(temp)
            })
        })
        pre.isReverseOrder = false
        // pre.isDailySummary = false
        setFilteredSummary()
        meta.current.isMounted && setRefresh({})
    }

    function setAllSummary() {
        meta.current.allSummary = meta.current.allRows.reduce(
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

    function setFilteredSummary() {
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

    function setUniqueIds() {
        let i = 1
        function incr() {
            return i++
        }
        pre.filteredRows = pre.filteredRows.map((x: any) => {
            if (!x.isDailySummary) {
                if (!x['id1']) {
                    x['id1'] = x.id
                }
            }
            x.id = incr()
            return x
        })
    }

    return {
        fetchRows,
        fillColumnBalance,
        injectDailySummary,
        meta,
        onSelectModelChange,
        requestSearch,
        setFilteredSummary,
        setRefresh,
        toggleReverseOrder,
    }
}

export { useXXGrid, useStyles }

const useStyles: any = makeStyles((theme: Theme) =>
    createStyles({
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

// async function fetchRows1(queryId: string, queryArgs: any) {
//     if (!queryId || !queryArgs) {
//         return
//     }
//     emit('SHOW-LOADING-INDICATOR', true)
//     const ret1: any = await execGenericView({
//         isMultipleRows: gridOptions.jsonFieldPath ? false : true,
//         sqlKey: queryId,
//         args: queryArgs || null,
//         entityName: entityName,
//     })
//     emit('SHOW-LOADING-INDICATOR', false)
//     let i = 1
//     function incr() {
//         return i++
//     }
//     let ret: any[]
//     meta.current.opBalance = (ret1?.jsonResult?.opBalance || { debit: 0, credit: 0 })

//     if (gridOptions.jsonFieldPath) {
//         ret = _.get(ret1, gridOptions.jsonFieldPath)
//     } else {
//         ret = ret1
//     }

//     ret.unshift({
//         otherAccounts: 'Opening balance',
//         debit: meta.current.opBalance.debit,
//         credit: meta.current.opBalance.credit,
//         tranDate: getFromBag('finYearObject').isoStartDate
//     })

//     meta.current.rows = ret

//     injectDailySummary()
//     ret = meta.current.rows

//     meta.current.isReverseOrder && ret.reverse()

//     const tot: any = {}
//     const temp: any[] = !ret
//         ? []
//         : ret.map((x: any) => {
//             if (!x.isDailySummary) {
//                 x['id1'] = x.id
//                 for (let col of summaryColNames) {
//                     tot[col] = +(tot[col] || 0) + x[col]
//                 }
//             }
//             x.id = incr()
//             return x
//         })

//     tot.count = ret?.length

//     if (ret) {
//         meta.current.rows = temp
//         meta.current.filteredRows = [...meta.current.rows]
//         meta.current.allSummary = tot
//         setFilteredSummary()
//         requestSearch(meta.current.searchText)
//         meta.current.isMounted && setRefresh({})
//     }
// }