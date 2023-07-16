import { PurchaseLineItemType, PurchaseStore, } from "../../purchase-store"
// import { signal } from "@preact/signals-react"
// import { useEffect } from "react"
import { Badge, Box, Button, TextareaAutosize, _, useIbuki, useRef, useState, utilMethods } from "../../../inventory/redirect"
import { AppStore } from "../../../common/app-store"
// import Big from "big.js"

function usePurchaseLineItem(item: PurchaseLineItemType) {
    const { emit } = useIbuki()
    const { execGenericView, } = utilMethods()
    const [, setRefresh] = useState({})
    const meta: any = useRef({
        // tranType: 'purchase',
        dialogConfig: {
            title: '',
            content: () => { },
            actions: () => { },
            serialNumbers: '',
        },
        // isMounted: false,
        searchFilter: '',
        showDialog: false,
        // zoomIn: true,
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

    function handleSerialNumber(item: PurchaseLineItemType) {
        AppStore.modalDialogA.title.value = 'Serial numbers (Comma separated)'
        AppStore.modalDialogA.body.value = Content
        AppStore.modalDialogA.isOpen.value = true
        // meta.current.showDialog = true
        // meta.current.dialogConfig.isSearchBox = false
        // meta.current.dialogConfig.title = 'Serial numbers (Comma separated)'
        // meta.current.dialogConfig.content = Content
        // setRefresh({})
        function Content() {
            return (
                <Box>
                    <Badge
                        color="secondary"
                        showZero={true}
                        badgeContent={item.serialNumberCount.value}>
                    </Badge>
                    <TextareaAutosize
                        autoFocus={true}
                        style={{ width: '100%', marginBottom: '10px' }}
                        minRows={5}
                        onChange={(e: any) => {
                            item.serialNumbers.value = e.target.value
                            processCount()
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

            function processCount() {
                item.serialNumberCount.value = item?.serialNumbers.value.split(',').filter(Boolean).length
            }

            function handleClear() {
                item.serialNumbers.value = ''
                processCount()
            }
            function handleClose() {
                AppStore.modalDialogA.isOpen.value = false
            }
        }
    }


    return ({ doSearchOnProductCodeOrUpc, handleSerialNumber })
}
export { usePurchaseLineItem }