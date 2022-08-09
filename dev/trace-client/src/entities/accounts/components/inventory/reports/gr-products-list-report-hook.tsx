import {
    _,
    Box,
    CloseSharp,
    GridCellParams,
    IconButton,
    moment,
    Typography,
    MultiDataContext,
    useContext,
    useEffect,
    useIbuki,
    useRef,
    useState,
    useTheme,
    utils,
    utilMethods,
} from '../redirect'

function useProductsListReport() {
    const [, setRefresh] = useState({})
    const { execGenericView, toDecimalFormat } = utilMethods()
    const { getGridReportSubTitle } = utils()
    const { debounceFilterOn, emit } = useIbuki()
    const theme = useTheme()
    
    const meta: any = useRef({
        allRows: [],
        filteredRows: [],
        searchText: '',
        searchTextRef: null,
        setRefresh: setRefresh,
        sqlKey: 'get_products_list',
        subTitle: '',
        title: 'Products list',
    })
    const pre = meta.current
    reIndex(pre.filteredRows)
    useEffect(() => {
        if (pre.isSearchTextEdited && pre.searchTextRef.current) {
            pre.searchTextRef.current.focus()
        }
    })

    useEffect(() => {
        pre.subTitle = getGridReportSubTitle()
        fetchData()        
        const subs1 = debounceFilterOn(pre.debounceMessage).subscribe((d: any) => {
            const requestSearch = d.data[0]
            const searchText = d.data[1]
            requestSearch(searchText)
        })
        return (() => {
            subs1.unsubscribe()
        })
    }, [])

    async function fetchData() {
        emit('SHOW-LOADING-INDICATOR', true)
        pre.allRows =
            (await execGenericView({
                isMultipleRows: true,
                sqlKey: pre.sqlKey,
            })) || []
        pre.filteredRows = pre.allRows.map((x: any) => ({ ...x })) //its faster
        emit('SHOW-LOADING-INDICATOR', false)
        setRefresh({})
    }

    function getColumns(): any[] {
        return [
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
                            title="Hide this row"
                            size="small"
                            color="primary"
                            onClick={() => removeRow(params)}
                            aria-label="hide">
                            <CloseSharp fontSize="small" />
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
            {
                headerName: 'Category',
                headerClassName: 'header-class',
                description: 'Category',
                field: 'catName',
                width: 120,
            },
            {
                headerName: 'Brand',
                headerClassName: 'header-class',
                description: 'Brand',
                field: 'brandName',
                width: 120,
            },
            {
                headerName: 'Label',
                headerClassName: 'header-class',
                description: 'Label',
                field: 'label',
                width: 250,
            },
            {
                headerName: 'Details',
                headerClassName: 'header-class',
                description: 'Details',
                field: 'info',
                width: 300,
                renderCell: (params: any) => <ProductDetails params={params} />,
                flex:1,
            },
            {
                headerName: 'Stock',
                headerClassName: 'header-class',
                description: 'Stock',
                field: 'clos',
                type: 'number',
                width: 80,
            },
            {
                headerName: 'Sale price',
                headerClassName: 'header-class',
                description: 'Sale price',
                field: 'salePriceGst',
                type: 'number',
                width: 120,
                valueFormatter: (params: any) => toDecimalFormat(params.value),
            },
            {
                headerName: 'MRP',
                headerClassName: 'header-class',
                description: 'MRP',
                field: 'maxRetailPrice',
                type: 'number',
                width: 120,
                valueFormatter: (params: any) => toDecimalFormat(params.value),
            },
        ]
    }

    function getGridSx() {
        return {
            p: 1,
            width: '100%',
            fontSize: theme.spacing(1.7),
            minHeight: theme.spacing(80),
            height: 'calc(100vh - 230px)',
            fontFamily: 'Helvetica',
            '& .footer-row-class': {
                backgroundColor: theme.palette.grey[300],
            },
            '& .header-class': {
                fontWeight: 'bold',
                color: 'green',
                fontSize: theme.spacing(1.8),
            },
            '& .grid-toolbar': {
                width: '100%',
                borderBottom: '1px solid lightgrey',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'start',
            },
        }
    }

    function ProductDetails({ params }: any) {
        return (
            <Typography sx={{ display: 'inline-block', whiteSpace: 'pre-line', fontSize: theme.spacing(1.6), }}>{params.row.info}</Typography>
        )
    }

    function reIndex(rows: any[]) {
        let count = 1
        for (const row of rows) {
            row.index = incr()
        }
        function incr() {
            return count++
        }
    }

    function removeRow(params: any) {
        const id = params.id
        const temp = [...pre.filteredRows]
        _.remove(temp, (x: any) => x.id === id)
        pre.filteredRows = temp
        setRefresh({})
    }

    return {fetchData, getColumns, getGridSx, meta }
}
export { useProductsListReport }
