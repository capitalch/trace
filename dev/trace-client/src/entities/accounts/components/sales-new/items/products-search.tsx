import {
    _, Card, Big, Box, Button, DataGridPro, IMegaData, MegaDataContext, NumberFormat, SearchBox, TextField, Typography,
    useContext, useEffect, useRef, useState, useTheme, useTraceMaterialComponents, utilMethods
} from '../redirect'

function ProductsSearch({ parentMeta }: any) {
    const [, setRefresh] = useState({})
    const megaData: IMegaData = useContext(MegaDataContext)
    // const sales = megaData.accounts.sales
    const theme = useTheme()
    const { toDecimalFormat } = utilMethods()
    // const items = sales.items

    const meta: any = useRef({
        allRows: [],
        filteredRows: [],
        setRefresh: setRefresh,
        selectionModel: []
    })
    const pre = meta.current

    useEffect(() => {
        pre.allRows = megaData.accounts.allProducts
        pre.filteredRows = pre.allRows.map((x: any) => ({ ...x }))
        setRefresh({})
    }, [])

    return (<Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <SearchBox parentMeta={meta} />
        <DataGridPro
            columns={getColumns()}
            getRowClassName={getRowClassName}
            rows={pre.filteredRows}
            showCellRightBorder={true}
            showColumnRightBorder={true}
            sx={getGridSx()}
            rowHeight={65}
            selectionModel={pre.selectionModel}
            onSelectionModelChange={(newModel: any) => {
                const products = megaData.accounts.allProducts
                if (_.isEmpty(products)) {
                    return
                }
                const index = newModel[0]
                const selectedProduct = products[index - 1]
                megaData.accounts.selectedProduct = selectedProduct
                parentMeta.current.showDialog = false
                megaData.executeMethodForKey('render:itemsFooter', {}) // calling setRefresh({}) of parent
                megaData.executeMethodForKey('setItemToSelectedProduct:lineItems') // populates the selected product to current item
            }}
        />
    </Box>)

    function getColumns() {
        return ([
            {
                headerName: '#',
                headerClassName: 'header-class',
                description: 'Ind',
                field: 'id',
                width: 60,
            },
            {
                headerName: 'Product',
                headerClassName: 'header-class',
                description: 'Product',
                field: '1',
                renderCell: (params: any) => <Product params={params} />,
                width: 200,
            },
            {
                headerName: 'Details',
                headerClassName: 'header-class',
                description: 'Product details',
                field: '',
                renderCell: (params: any) => <ProductDetails params={params} />,
                width: 300,
            },
            {
                headerName: 'Stock',
                headerClassName: 'header-class',
                description: 'Stock',
                field: 'clos',
                type: 'number',
                width: 60,
            },
            {
                headerName: 'Age',
                headerClassName: 'header-class',
                description: 'Age',
                field: 'age',
                type: 'number',
                width: 60,
            },
            {
                headerName: 'MRP',
                headerClassName: 'header-class',
                description: 'Max retail price',
                field: 'maxRetailPrice',
                type: 'number',
                width: 100,
            },
            {
                headerName: 'SP(Gst)',
                headerClassName: 'header-class',
                description: 'Sale price with Gst',
                field: 'salePriceGst',
                type: 'number',
                width: 100,
            },
            {
                headerName: 'Pur pr(Gst)',
                headerClassName: 'header-class',
                description: 'Purchase price with gst',
                field: 'lastPurchasePriceGst',
                type: 'number',
                width: 100,
                valueFormatter: (params: any) => toDecimalFormat(params.value),
            },
            {
                headerName: 'Sale',
                headerClassName: 'header-class',
                description: 'Sale',
                field: 'sale',
                type: 'number',
                width: 55,
            },
            {
                headerName: 'Gst(%)',
                headerClassName: 'header-class',
                description: 'gst rate',
                field: 'gstRate',
                type: 'number',
                width: 70,
            },
            {
                headerName: 'HSN',
                headerClassName: 'header-class',
                description: 'HSN',
                field: 'hsn',
                type: 'string',
                width: 80,
            },
            {
                headerName: 'Discount',
                headerClassName: 'header-class',
                description: 'Discount',
                field: 'saleDiscount',
                type: 'number',
                width: 75,
            },
            {
                headerName: 'Pr code',
                headerClassName: 'header-class',
                description: 'Product code',
                field: 'productCode',
                width: 80,
            },
        ])
    }

    function getGridSx() {
        return (
            {
                border: '4px solid orange',
                mt: 1.5,
                p: 1, width: '100%',
                fontSize: theme.spacing(1.7),
                // minHeight: theme.spacing(60),
                minHeight: '70vh',
                // height: 'calc(100vh - 230px)',
                fontFamily: 'Helvetica',
                '& .footer-row-class': {
                    backgroundColor: theme.palette.grey[300]
                },
                '& .header-class': {
                    fontWeight: 'bold',
                    color: 'green',
                    fontSize: theme.spacing(1.8),
                },
                '& .row-jakar': {
                    color: 'dodgerBlue'
                },
                '& .row-negative-clos': {
                    color: theme.palette.error.dark
                }
            }
        )
    }

    function getRowClassName(e: any) {
        const row = e?.row || {}
        let ret = ''
        if (row.age >= 360) {
            ret = 'row-jakar'
        } else if (row.clos < 0) {
            ret = 'row-negative-clos'
        }
        return (ret)
    }

    function Product({ params }: any) {
        return (
            <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                <Typography sx={{ fontSize: theme.spacing(1.6), fontWeight: 'bold' }}>{params.row.brandName}</Typography>
                {params.row.catName && <Typography sx={{ fontSize: theme.spacing(1.6) }}>&nbsp;{params.row.catName}</Typography>}
                {params.row.label && <Typography sx={{display:'inline-block', whiteSpace:'pre-line', fontSize: theme.spacing(1.6) }}>&nbsp;{params.row.label}</Typography>}
            </Box>
        )
    }

    function ProductDetails({ params }: any) {
        return (
            <Typography sx={{ display: 'inline-block', whiteSpace: 'pre-line', fontSize: theme.spacing(1.6), }}>{params.row.info}</Typography>
        )
    }
}
export { ProductsSearch }