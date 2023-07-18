import { ListItemSecondaryAction } from '@mui/material'
import { AppStore } from '../../stores/app-store'
import {
    _, Box, Button, DataGridPro, IMegaData, MegaDataContext, SearchBox, Typography,
    useContext, useEffect, useGridApiRef, useIbuki, useRef, useState, useTheme, utilMethods, manageEntitiesState
} from '../sales-new/redirect'
import { isTemplateMiddleOrTemplateTail } from 'typescript'
import { inventoryMegaData } from './init-mega-data-context-values'

function ProductsSearch({ parentMeta }: any) {
    const [, setRefresh] = useState({})
    const megaData: IMegaData = useContext(MegaDataContext)
    const { emit } = useIbuki()
    const { execGenericView, setIdForDataGridRows } = utilMethods()
    const { getFromBag, setInBag } = manageEntitiesState()
    const allProducts = getFromBag('allProducts')
    const theme = useTheme()
    const { toDecimalFormat } = utilMethods()
    const apiRef = useGridApiRef()

    const meta: any = useRef({
        allRows: [],
        filteredRows: [],
        setRefresh: setRefresh,
        selectionModel: [],
    })
    const pre = meta.current

    useEffect(() => {
        if (_.isEmpty(allProducts)) {
            fetchAllProducts()
        } else {
            pre.allRows = allProducts
            pre.filteredRows = pre.allRows.map((x: any) => ({ ...x }))
            setRefresh({})
        }
    }, [])

    return (<Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', columnGap: 2 }}>
            <SearchBox parentMeta={meta} sx={{ maxWidth: theme.spacing(120), width: theme.spacing(50) }} />
            <Button variant='contained' color='secondary' onClick={fetchAllProducts}>Refresh</Button>
        </Box>
        <DataGridPro
            apiRef={apiRef}
            columns={getColumns()}
            getRowClassName={getRowClassName}
            rows={pre.filteredRows}
            showCellRightBorder={true}
            showColumnRightBorder={true}
            sx={getGridSx()}
            getRowHeight={()=>'auto'}
            selectionModel={pre.selectionModel}
            onSelectionModelChange={(newModel: any) => {
                const products = allProducts
                if (_.isEmpty(products)) {
                    return
                }
                const index = newModel[0]
                const selectedProduct = products[index - 1]
                if (megaData?.accounts) {
                    megaData.accounts.selectedProduct = selectedProduct
                    const renderCallbackKey = parentMeta.current.renderCallbackKey || 'render:itemsFooter'
                    const setItemToSelectedProductCallbackKey = parentMeta.current.setItemToSelectedProductCallbackKey || 'setItemToSelectedProduct:lineItems'
                    parentMeta.current.showDialog = false
                    megaData.executeMethodForKey(renderCallbackKey, {}) // calling setRefresh({}) of parent
                    megaData.executeMethodForKey(setItemToSelectedProductCallbackKey) // populates the selected product to current item
                }
                if(!_.isEmpty(AppStore.modalDialogA.itemData?.value)){
                    const itemData: any = AppStore.modalDialogA.itemData?.value
                    itemData.hsn.value = selectedProduct.hsn
                    itemData.productCode.value = selectedProduct.productCode
                    itemData.productDetails.value = `${selectedProduct.catName} ${selectedProduct.brandName} ${selectedProduct.label}`
                    itemData.productId.value = selectedProduct.id1
                    itemData.clos.value = selectedProduct.clos
                    itemData.price.value = selectedProduct.lastPurchasePrice || selectedProduct.openingPrice
                    itemData.gstRate.value = selectedProduct.gstRate
                    AppStore.modalDialogA.isOpen.value = false
                }
            }}
        />
    </Box>)

    async function fetchAllProducts() {
        emit('SHOW-LOADING-INDICATOR', true)
        const products = await execGenericView({
            isMultipleRows: true,
            args: { onDate: null, isAll: true, days: 0 },
            sqlKey: 'get_products_info'
        })
        emit('SHOW-LOADING-INDICATOR', false)
        setIdForDataGridRows(products)
        pre.allRows = products
        pre.filteredRows = pre.allRows.map((x: any) => ({ ...x }))
        setInBag('allProducts', products)
        setRefresh({})
    }

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
                cellClassName:'cell-class-padding',
                headerName: 'Product',
                headerClassName: 'header-class',
                description: 'Product',
                field: '1',
                renderCell: (params: any) => <Product params={params} />,
                width: 200,
            },
            {
                cellClassName:'cell-class-padding',
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
                fontSize: '.9rem', //theme.spacing(1.7),
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
                },
                '& .cell-class-padding': {
                    paddingTop: theme.spacing(0.5),
                    paddingBottom: theme.spacing(.5)
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
                <Typography sx={{ fontSize: theme.spacing(1.8), fontWeight: 'bold' }}>{params.row.brandName}</Typography>
                {params.row.catName && <Typography sx={{ fontSize: theme.spacing(1.8) }}>&nbsp;{params.row.catName}</Typography>}
                {params.row.label && <Typography sx={{ display: 'inline-block', whiteSpace: 'pre-line', fontSize: theme.spacing(1.8) }}>&nbsp;{params.row.label}</Typography>}
            </Box>
        )
    }

    function ProductDetails({ params }: any) {
        return (
            <Typography sx={{ display: 'inline-block', whiteSpace: 'pre-line', fontSize: theme.spacing(1.8), }}>{params.row.info}</Typography>
        )
    }
}
export { ProductsSearch }