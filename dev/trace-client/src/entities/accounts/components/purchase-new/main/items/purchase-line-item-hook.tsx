import { PurchaseLineItemType, PurchaseStore, } from "../../../../stores/purchase-store"
import { Badge, Box, Button, TextareaAutosize, _, useIbuki, useRef, utilMethods } from "../../../inventory/redirect"
import { AppStore } from "../../../../stores/app-store"
import { ProductsSearch } from "../../../common/products-search"

function usePurchaseLineItem(item: PurchaseLineItemType) {
    const { emit } = useIbuki()
    const { execGenericView, } = utilMethods()

    const meta: any = useRef({
        productCodeOrUpc: '',
        lastPurchasePrices: {}
    })

    async function doSearchOnProductCodeOrUpc(value: string) {
        if (!value) {
            return
        }
        emit('SHOW-LOADING-INDICATOR', true)
        try {
            const result: any = await execGenericView({
                sqlKey: 'get_product_on_product_code_upc',
                isMultipleRows: false,
                args: {
                    productCodeOrUpc: value,
                },
            })
            if (_.isEmpty(result)) {
                PurchaseStore.main.functions.clearLineItem(item)
            } else {
                const productId = result?.productId
                const lastPurchasePrice = result?.lastPurchasePrice
                if(productId && lastPurchasePrice){
                    meta.current.lastPurchasePrices[productId] = lastPurchasePrice
                }
                PurchaseStore.main.functions.populateLineItem(item, result)
                PurchaseStore.main.functions.computeRow(item)
                PurchaseStore.main.functions.computeSummary()
            }

        } catch (e: any) {
            console.log(e.message)
        } finally {
            emit('SHOW-LOADING-INDICATOR', false)
        }
    }

    function handleItemSearch(item: PurchaseLineItemType) {
        AppStore.modalDialogA.title.value = 'Search for all products'
        AppStore.modalDialogA.body.value = () => <ProductsSearch />
        AppStore.modalDialogA.isOpen.value = true
        AppStore.modalDialogA.maxWidth.value='md'
        AppStore.modalDialogA.itemData.value = item
        AppStore.modalDialogA.onModalDialogClose = ((itm:any) =>{
            if(!_.isEmpty(itm)){
                const productId = itm?.productId
                const lastPurchasePrice = itm?.price
                if(productId && lastPurchasePrice){
                    meta.current.lastPurchasePrices[productId] = lastPurchasePrice
                }
            }
        })
    }

    function handleSerialNumber(item: PurchaseLineItemType) {
        AppStore.modalDialogA.title.value = 'Serial numbers (Comma separated)'
        AppStore.modalDialogA.body.value = Content
        AppStore.modalDialogA.isOpen.value = true
        AppStore.modalDialogA.maxWidth.value='sm'
        function Content() {
            return (
                <Box>
                    <Badge
                        color="secondary"
                        showZero={true}
                        badgeContent = {(item.serialNumbers.value || '')
                        .split(',')
                        .filter(Boolean).length}
                        >
                    </Badge>
                    <TextareaAutosize
                        autoFocus={true}
                        style={{ width: '100%', marginBottom: '10px' }}
                        minRows={5}
                        onChange={(e: any) => {
                            item.serialNumbers.value = e.target.value
                        }}
                        value={item.serialNumbers.value}
                    />
                    <br></br>
                    <Box display='flex' columnGap={1} flexDirection='row-reverse'>
                        <Button
                            style={{ float: 'right' }}
                            size="small"
                            color="primary"
                            variant="contained"
                            onClick={handleClose}>
                            Ok
                        </Button>

                        <Button
                            style={{ float: 'right' }}
                            size="small"
                            color="info"
                            variant="contained"
                            onClick={handleClear}>
                            Clear
                        </Button>
                    </Box>
                </Box>
            )

            function handleClear() {
                item.serialNumbers.value = ''
            }
            
            function handleClose() {
                AppStore.modalDialogA.isOpen.value = false
            }
        }
    }


    return ({ doSearchOnProductCodeOrUpc, handleItemSearch, handleSerialNumber, meta })
}
export { usePurchaseLineItem }