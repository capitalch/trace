import { _, Box, CloseSharp, GridCellParams, IconButton, moment, Typography, MultiDataContext, useContext, useEffect, useIbuki, useRef, useState, useTheme, utils, utilMethods } from '../redirect'

function useProductsListReport() {
    const [, setRefresh] = useState({})
    const { execGenericView, toDecimalFormat } = utilMethods()
    const { toCurrentDateFormat, getGridReportSubTitle } = utils()
    const { debounceFilterOn, emit, } = useIbuki()
    const theme = useTheme()

    const meta: any = useRef({
        allRows: [],
        filteredRows: [],
        searchText: '',
        searchTextRef: null,
        sqlKey: 'get_products_list',
        subTitle: '',
        title: 'Products list'
    })
    const pre = meta.current
    useEffect(() => {
        if (pre.isSearchTextEdited && pre.searchTextRef.current) {
            pre.searchTextRef.current.focus()
        }
    })

    useEffect(() => {
        // pre.subTitle = getGridReportSubTitle()
        fetchData()
        // const subs1 = debounceFilterOn(pre.debounceMessage).subscribe((d: any) => {
        //     const requestSearch = d.data[0]
        //     const searchText = d.data[1]
        //     requestSearch(searchText)
        // })
        // return (() => {
        //     subs1.unsubscribe()
        // })
    }, [])

    async function fetchData(){
        emit('SHOW-LOADING-INDICATOR', true)
        pre.allRows = await execGenericView({
            isMultipleRows: true,
            sqlKey: pre.sqlKey
        }) || []
        setIndex(pre.allRows)
        pre.filteredRows = pre.allRows.map((x: any) => ({ ...x })) //its faster
        emit('SHOW-LOADING-INDICATOR', false)
        setRefresh({})

        function setIndex(rows: any[]) {
            let count = 1
            for (const row of rows) {
                row.index = incr()
            }
            function incr() {
                return (count++)
            }
        }
    }

    function getColumns(): any[] {
        return ([
            {
                headerName: 'H',
                description: 'Hide',
                disableColumnMenu: true,
                disableExport: true,
                disableReorder: true,
                filterable: false,
                hideSortIcons: true,
                resizable: false,
                width: 10,
                field: '0',
                renderCell: (params: GridCellParams) => {
                    return (
                        <IconButton
                            title='Hide this row'
                            size="small"
                            color="primary"
                            // onClick={() => removeRow(params)}
                            aria-label="hide">
                            <CloseSharp fontSize='small' />
                        </IconButton>
                    )
                },

            },
            {
                headerName: '#',
                headerClassName: 'header-class',
                description: 'Index',
                field: 'index',
                width: 60,
            },
        ])
    }

    return { getColumns, meta }
}
export { useProductsListReport }