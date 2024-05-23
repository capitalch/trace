import _ from 'lodash'
import { AppStore } from "../../../stores/app-store"
import { BranchTransferLineItemType, clearBranchTransferLineItem, computeAmountBranchTransferLineItem,  populateBranchTransferLineItem } from "../../../stores/branch-transfer-store"
import { ProductsSearch } from "../../sales-new/redirect"
import { Badge, Box, Button, TextareaAutosize, execGenericView, getFromBag, useIbuki } from "../redirect"

export function useBranchTransferLineItem() {
    const { emit } = useIbuki()
    
    async function doSearchOnProductCodeOrUpc(index: number, item: BranchTransferLineItemType, value: string) {
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
                clearBranchTransferLineItem(index)
            } else {
                populateBranchTransferLineItem(item, result)
            }

        } catch (e: any) {
            console.log(e.message)
        } finally {
            emit('SHOW-LOADING-INDICATOR', false)
        }
    }

    function getbranchesOptions() {
        const branches: any[] = getFromBag('branches')
        const options: any[] = branches.map((branch: any) => {
            return <option key={branch.branchId} value={branch.branchId}>{branch.branchName}</option>
        })
        options.unshift(<option key={0} value={''}>--- Select branch ---</option>)
        return (options)
    }

    function handleItemSearch(item: BranchTransferLineItemType) {
        AppStore.modalDialogA.onModalDialogClose = computeAmountBranchTransferLineItem
        AppStore.modalDialogA.title.value = 'Search for all products'
        AppStore.modalDialogA.body.value = () => <ProductsSearch />
        AppStore.modalDialogA.isOpen.value = true
        AppStore.modalDialogA.maxWidth.value = 'md'
        AppStore.modalDialogA.itemData.value = item
        // computeAmountBranchTransferLineItem(item)
    }
    
    function handleSerialNumber(item: BranchTransferLineItemType) {
        AppStore.modalDialogA.title.value = 'Serial numbers (Comma separated)'
        AppStore.modalDialogA.body.value = Content
        AppStore.modalDialogA.isOpen.value = true
        AppStore.modalDialogA.maxWidth.value = 'sm'
        function Content() {
            return (
                <Box>
                    <Badge
                        color="secondary"
                        showZero={true}
                        badgeContent={(item.serialNumbers.value || '')
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

    return ({ doSearchOnProductCodeOrUpc, getbranchesOptions, handleItemSearch, handleSerialNumber})
}