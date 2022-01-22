import { _, useState, } from '../../../../imports/regular-imports'
import { useSharedElements } from './shared-elements-hook'
import {
    Avatar, List, Typography,
    ListItem,
    ListItemText,
    ListItemAvatar,
} from '../../../../imports/gui-imports'
import { } from '../../../../imports/icons-import'
function useProductUtils(
    meta: any,
    afterSelectProduct: any = () => { },
    setError = () => { },
) {
    const [, setRefresh] = useState({})
    const {
        confirm,
        emit,
        execGenericView,
        messages,
        queries,
        queryGraphql,
    } = useSharedElements()

    async function searchProduct(rowData: any) {
        const searchFilter = meta.current.searchFilter
        try {
            const searchArray: string[] = searchFilter.split(/[ ,]+/) // split on comma or / and space. Repetition does not make difference
            emit('SHOW-LOADING-INDICATOR', true)

            const q = queries['genericQueryBuilder']({
                queryName: 'searchProduct',
                queryType: 'query',
                args: escape(JSON.stringify(searchArray)),
            })
            if (q) {
                const result: any = await queryGraphql(q)
                const products: any[] = result.data?.accounts.searchProduct
                meta.current.dialogConfig.data = products
                meta.current.dialogConfig.filteredData = products
                if (products?.length === 1) {
                    const product: any = products[0]
                    selectProduct(rowData, product)
                } else if (products?.length > 1) {
                    meta.current.dialogConfig.content = FilteredProductsList
                } else {
                    meta.current.searchResult = 'Product not found'
                }
                meta.current.isMounted && setRefresh({})
            }
        } catch (e:any) {
            console.log(e)
        }
        emit('SHOW-LOADING-INDICATOR', false)

        function FilteredProductsList() {
            const pre = meta.current.dialogConfig
            pre.filteredData = pre.data.filter(
                (product: any) =>
                    product?.label
                        ?.toLowerCase()
                        .includes(
                            meta.current?.dialogConfig?.searchBoxFilter?.toLowerCase()
                        ) ||
                    product?.catName
                        ?.toLowerCase()
                        .includes(
                            meta.current?.dialogConfig?.searchBoxFilter?.toLowerCase()
                        ) ||
                    product?.brandName
                        ?.toLowerCase()
                        .includes(
                            meta.current?.dialogConfig?.searchBoxFilter?.toLowerCase()
                        ) ||
                    product?.info
                        ?.toLowerCase()
                        .includes(
                            meta.current?.dialogConfig?.searchBoxFilter?.toLowerCase()
                        )
            )
            return (
                <div className="trace-dialog">
                    <label>{`${pre.filteredData.length} items`}</label>
                    <List>
                        {pre.filteredData.map(
                            (product: any, index: number) => {
                                return (
                                    <ListItem
                                        dense={true}
                                        divider={true}
                                        button={true}
                                        key={index}
                                        alignItems="flex-start"
                                        onClick={() => {
                                            meta.current.showDialog = false
                                            selectProduct(rowData, product)
                                        }}>
                                        <ListItemAvatar>
                                            <Avatar>
                                                {product.label[0].toUpperCase()}
                                            </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={product.label}
                                            secondary={
                                                <>
                                                    <Typography
                                                        component="li"
                                                        variant="body2">
                                                        {product.catName}
                                                    </Typography>
                                                    <Typography
                                                        component="li"
                                                        variant="body2">
                                                        {product.brandName}
                                                    </Typography>
                                                    <Typography
                                                        component="li"
                                                        variant="body2">
                                                        {product.info}
                                                    </Typography>
                                                </>
                                            }
                                        />
                                    </ListItem>
                                )
                            }
                        )}
                    </List>
                </div>
            )
        }
    }

    function searchProductOnProductCode(rowData: any) {
        const productCode: string = rowData.productCode
        if (productCode) {
            doSearchProductOnProductCode(productCode)
        } else {
            const opts: any = {
                description: messages.giveSearchCriteria,
                title: messages.emptySearchCriteria,
                cancellationText: null,
            }
            confirm(opts)
        }

        async function doSearchProductOnProductCode(productCode: string) {
            emit('SHOW-LOADING-INDICATOR', true)
            try {
                const result: any = await execGenericView({
                    sqlKey: 'get_product_on_product_code',
                    isMultipleRows: false,
                    args: {
                        productCode: productCode,
                    },
                })
                selectProduct(rowData, result)
            } catch (e: any) {
                console.log(e.message)
            }
            emit('SHOW-LOADING-INDICATOR', false)
        }
    }

    function searchProductOnUpcCode(rowData: any) {
        const upcCode: string = rowData.upcCode
        if (upcCode) {
            doSearchProductOnUpcCode(upcCode)
        } else {
            const opts: any = {
                description: messages.giveSearchCriteria,
                title: messages.emptySearchCriteria,
                cancellationText: null,
            }
            confirm(opts)
        }

        async function doSearchProductOnUpcCode(upcCode: string) {
            emit('SHOW-LOADING-INDICATOR', true)
            try {
                const result: any = await execGenericView({
                    sqlKey: 'get_product_on_upc_code',
                    isMultipleRows: false,
                    args: {
                        upcCode: upcCode,
                    },
                })
                selectProduct(rowData, result)
            } catch (e: any) {
                console.log(e.message)
            }
            emit('SHOW-LOADING-INDICATOR', false)
        }
    }

    function selectProduct(rowData: any, product: any) {
        _.isEmpty(product) && (product = {})
        rowData.productDetails = product.label
            ? `${product.catName || ''}, ${product.brandName || ''}, ${product.label || ''
            }, ${product.info || ''}`
            : ''
        rowData.upcCode = product.upcCode || ''
        rowData.productCode = product.productCode || ''
        rowData.hsn = product.hsn || ''
        rowData.qty = product.label ? 1 : 0
        rowData.gstRate = rowData.isGstInvoice ? product.gstRate || 0.0 : 0.0
        rowData.gstRateCopy = product.gstRate
        if (meta.current.tranType === 'purchase') {
            rowData.price = product.purPrice || 0.0
            rowData.discount = product.purDiscount || 0.0
        } else {
            // consider when salePriceGst, salePrice exists / not exists
            if (product.salePriceGst) {
                rowData.priceGst = product.salePriceGst
                rowData.price = product.salePriceGst / (1 + ((product.gstRate || 0.0) / 100))
            } else if (product.salePrice) {
                rowData.price = product.salePrice
                rowData.priceGst = product.salePrice * (1 + ((product.gstRate || 0.0) / 100))
            } else {
                rowData.price = 0.0
                rowData.priceGst = 0.0
            }
        }

        rowData.cgst = 0.0
        rowData.sgst = 0.0
        rowData.igst = 0.0
        rowData.productId = product.id
        rowData.serialNumbers = ''
        meta.current.showDialog = false

        afterSelectProduct(rowData)

        meta.current.isMounted && setRefresh({})
    }

    return {
        searchProduct,
        searchProductOnProductCode,
        searchProductOnUpcCode,
        selectProduct,
    }
}

export { useProductUtils }
