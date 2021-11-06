import {
    _,
    hash,
    useCallback,
    useEffect,
    useState,
    useRef,
} from '../../../../imports/regular-imports'
import {
    Theme,
    createStyles,
    makeStyles,
} from '../../../../imports/gui-imports'
import { useSharedElements } from './shared-elements-hook'

function useXXGrid(gridOptions: any) {
    const [, setRefresh] = useState({})
    let { sqlQueryArgs, sqlQueryId, summaryColNames } = gridOptions
    const meta: any = useRef({
        allRows: [],
        allSummary: {},
        filteredRows: [],
        filteredSummary: {},
        hashCurrentData: null,
        hashInitialData: null,
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
        emit,
        debounceFilterOn,
        filterOn,
        getCurrentEntity,
        getFromBag,
        execGenericView,
        toDecimalFormat,
    } = useSharedElements()

    useEffect(() => {
        meta.current.isMounted = true
        gridOptions.autoFetchData && fetchRows(sqlQueryId, sqlQueryArgs)
        const fetchIbukiMessage =
            gridOptions?.gridActionMessages?.fetchIbukiMessage ||
            'XX-GRID-FETCH-DATA'
        const subs1 = filterOn(fetchIbukiMessage).subscribe(async (d: any) => {
            if (d.data) {
                sqlQueryArgs = d.data
            }
            await fetchRows(sqlQueryId, sqlQueryArgs)
            setRefresh({})
        })
        const subs2 = filterOn('XX-GRID-RESET').subscribe(() => {
            meta.current.filteredRows = []
            setRefresh({})
        })
        const subs3 = debounceFilterOn('XX-GRID-SEARCH-DEBOUNCE').subscribe(
            (d: any) => {
                requestSearch(d.data)
            }
        )
        const subs4 = filterOn(
            gridOptions?.gridActionMessages?.justRefreshIbukiMessage
        ).subscribe(() => {
            setRefresh({})
        })

        const subs5 = filterOn(
            gridOptions?.gridActionMessages?.calculateBalanceIbukiMessage
        ).subscribe((d: any) => {
            const sortFunction: any = d.data // got sort function from bank-recon
            sortFunction(pre)
            fillColumnBalance()
            setRefresh({})
        })

        return () => {
            meta.current.isMounted = false
            subs1.unsubscribe()
            subs2.unsubscribe()
            subs3.unsubscribe()
            subs4.unsubscribe()
            subs5.unsubscribe()
        }
    }, [])

    const entityName = getCurrentEntity()
    const pre: any = meta.current

    async function fetchRows(queryId: string, queryArgs: any) {
        if (!queryId || !queryArgs) {
            return
        }
        queryArgs['no'] =
            meta.current.viewLimit === '0' ? null : meta.current.viewLimit // null for all items in postgresql
        await fetch()
        setAllSummary()
        if (pre.isDailySummary) {
            injectDailySummary()
        }

        requestSearch(meta.current.searchText)

        if (gridOptions.isReverseOrderByDefault) {
            pre.isReverseOrder = true
            toggleOrder()
        }

        if (gridOptions.isShowColBalanceByDefault) {
            pre.isColumnBalance = true
            fillColumnBalance()
        }

        async function fetch() {
            // populates meta.current.filteredRows
            let i = 1 // for creating unique id's
            pre.isReverseOrder = false
            pre.isDailySummary = false
            pre.isColumnBalance = false

            emit('SHOW-LOADING-INDICATOR', true)
            let ret1: any = await execGenericView({
                isMultipleRows: gridOptions.jsonFieldPath ? false : true,
                sqlKey: queryId,
                args: queryArgs || null,
                entityName: entityName,
            })
            emit('SHOW-LOADING-INDICATOR', false)
            const path = gridOptions.jsonFieldPath
            let rows = ret1
            const opBalance = ret1?.jsonResult?.opBalance || {
                debit: 0,
                credit: 0,
                id: 0,
                id1: 0,
            }
            path && (rows = _.get(ret1, path, []))
            for (const row of rows) {
                row.id1 = row.id
                row.balance = 0
                row.id = incr()
                row.isDataChanged = false
            }
            gridOptions.toShowOpeningBalance && injectOpBalance(rows, opBalance)

            pre.filteredRows = rows || []
            
            pre.allRows = rows.map((x: any) => ({ ...x }))  // this is cloning at object level of array and better than just [...rows]

            if(gridOptions.sharedData && (!_.isEmpty(gridOptions.sharedData))){
                gridOptions.sharedData['filteredRows'] = pre.filteredRows
                gridOptions.sharedData['allRows'] = pre.allRows
            }
            function injectOpBalance(rows: any[], opBalance: any) {
                rows.unshift({
                    otherAccounts: 'Opening balance',
                    id: 0,
                    id1: 0,
                    debit: opBalance.debit,
                    credit: opBalance.credit,
                    tranDate: getFromBag('finYearObject').isoStartDate,
                    clearDate: getFromBag('finYearObject').isoStartDate,
                })
            }

            function incr() {
                return i++
            }
        }
    }

    const handleEditRowsModelChange = useCallback((newModel: any) => {
        const filteredRows: any[] = meta.current.filteredRows
        Object.keys(newModel).forEach((key: any) => {
            if (newModel[key]?.clearDate?.value) {
                const foundRow = filteredRows.find((x: any) => x.id === +key)
                foundRow.clearDate = newModel[key].clearDate.value
                foundRow.isDataChanged = true
            }
        })
    }, [])

    function fillColumnBalance() {
        let rows: any[] = pre.filteredRows
        const fn = (prev: any, current: any) => {
            if (current && current.isDailySummary) {
                current.balance = prev.balance || 0.0
            } else {
                current.balance =
                    prev.balance + (current.debit || 0.0) - (current.credit || 0.0)
            }
            return(current)
        }
        if (pre.isColumnBalance) {
            if (pre.isReverseOrder) {
                rows.reduceRight(fn, { balance: 0.0 })
            } else {
                rows.reduce(fn, { balance: 0.0 })
            }
        } else {
            for (let row of rows) {
                row.balance = undefined
            }
        }
    }

    function injectDailySummary() {
        if (pre.allRows.length === 0) {
            meta.current.isMounted && setRefresh({})
            return
        }
        let rows = pre.allRows.map((x: any) => ({ ...x })) // clone
        if (pre.isDailySummary) {
            const summaryRows = getSummaryRows(rows)
            rows = rows.concat(summaryRows)
            rows = _.sortBy(rows, ['tranDate']) // Used lodash because JavaScript sort did not work out
            rows.shift() // remove first row which is having blank date value
        } else {
            pre.isReverseOrder = false
        }
        pre.filteredRows = rows
        pre.isReverseOrder && toggleOrder()
        reIndexId(pre.filteredRows)
        if(pre.isColumnBalance){
            fillColumnBalance()
        }
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
                isDailySummary: true,
            }

            for (let item of arr) {
                if (item.tranDate === acc.tranDate) {
                    acc.debit = +acc.debit + (item.debit || 0)
                    acc.credit = +acc.credit + (item.credit || 0)
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

    function reIndexId(rows: any[]) {
        let i = 1
        for (const row of rows) {
            row.id = incr()
        }
        function incr() {
            return i++
        }
    }

    function requestSearch(searchValue: string) {
        if (searchValue) {
            meta.current.searchText = searchValue
            // const searchRegex = new RegExp(searchValue, 'i')
            meta.current.filteredRows = meta.current.allRows.filter((row: any) => {
                return Object.keys(row).some((field) => {
                    const temp: string = row[field] ? row[field].toString() : ''
                    return temp.toLowerCase().includes(searchValue.toLowerCase())
                    // return searchRegex.test(temp)
                })
            })
        } else {
            meta.current.filteredRows = meta.current.allRows.map((x: any) => ({ ...x }))
        }
        pre.isReverseOrder = false
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

    function toggleOrder() {
        const hash1 = hash(pre.filteredRows)
        console.log(hash1)
        const rows = [...pre.filteredRows]
        rows.reverse()
        pre.filteredRows = rows
        const hash2 = hash(pre.filteredRows)
        console.log(hash2)
    }

    return {
        fetchRows,
        fillColumnBalance,
        handleEditRowsModelChange,
        injectDailySummary,
        meta,
        onSelectModelChange,
        requestSearch,
        setFilteredSummary,
        setRefresh,
        toggleOrder,
    }
}

export { useXXGrid, useStyles }

const useStyles: any = makeStyles((theme: Theme) =>
    createStyles({
        content: {
            height: '100%',
            width: '100%',
            minHeight: '65vh',
            '& .ledger-summary': {
                color: theme.palette.blue.dark,
                backgroundColor: '#FFFAFA',
                fontFamily: 'Lato',
                fontWeight: 'bold',
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
                justifyContent: 'space-between',

                '& .toolbar-left-items': {
                    display: 'flex',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    columnGap: theme.spacing(0.5),
                    '& .toolbar-title': {
                        color: 'dodgerblue',
                        fontSize: '1.2rem',
                        fontWeight: 'bold',
                    },
                    '& .view-limit': {
                        display: 'flex',
                        columnGap: '0.5rem',
                        color: theme.palette.secondary.main,
                        marginRight: '1rem',
                        '& select': {
                            borderColor: 'grey',
                            color: theme.palette.primary.main,
                        },
                    },
                },

                '& .global-search': {
                    marginLeft: 'auto',
                    marginRight: '1rem',
                },

                '& .add-button': {
                    marginRight: theme.spacing(1),
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