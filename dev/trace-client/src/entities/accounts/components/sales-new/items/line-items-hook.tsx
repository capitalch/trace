import { _, Big, Box, Button, errorMessages, IMegaData, manageEntitiesState, MegaDataContext, TextareaAutosize, Typography, useContext, useEffect, useIbuki, useRef, useTheme, useState, useTraceMaterialComponents, utilMethods } from '../redirect'

function useLineItems() {
    const [, setRefresh] = useState({})
    const { emit, debounceFilterOn } = useIbuki()
    const megaData: IMegaData = useContext(MegaDataContext)
    const sales = megaData.accounts.sales
    const items = sales.items
    const allErrors = sales.allErrors
    // const { execGenericView, setIdForDataGridRows } = utilMethods()
    // const theme = useTheme()
    const { getFromBag } = manageEntitiesState()
    const isGstApplicable = !!(getFromBag('unitInfo')?.gstin)

    const meta: any = useRef({
        showDialog: false,
        dialogConfig: {
            title: 'Serial numbers (Comma separated)',
            content: () => <></>
        },

    })
    const pre = meta.current

    useEffect(() => {
        megaData.registerKeyWithMethod('render:lineItems', setRefresh)
        if (items.length === 0) {
            megaData.executeMethodForKey('handleAddItem:itemsHeader')
        }
        const subs1 = debounceFilterOn('DEBOUNCE-ON-CHANGE', 1500)
            .subscribe((d: any) => megaData.executeMethodForKey('doSearchProductOnProductCode:lineItem', d))
        megaData.registerKeyWithMethod('computeAllRows:lineItems', computeAllRows)
        // megaData.registerKeyWithMethod('setItemToSelectedProduct:lineItems', setItemToSelectedProduct)
        return () => {
            subs1.unsubscribe()
        }
    }, [])

    useEffect(() => {
        emit('ALL-ERRORS-JUST-REFRESH', null)
    })

    function checkAllErrors() {
        checkAllRows()
        setAllErrors()

        function checkAllRows() {
            for (const item of items) {
                item.isProductCodeError = !Boolean(item.productCode)
                item.isHsnError = !Boolean(item.hsn)
                const slNoLength = (item.serialNumbers || '')
                    .split(',')
                    .filter(Boolean).length
                if ((slNoLength > 0) && (slNoLength !== item.qty)) {
                    item.isSerialNumberError = true
                } else {
                    item.isSerialNumberError = false
                }
                if (isGstApplicable) {
                    item.isGstRateError = (item.gstRate === 0) ? true : false
                } else {
                    item.isGstRateError = (item.gstRate === 0) ? false : true
                }
            }
        }

        function setAllErrors() {
            allErrors.productCodeError = items.some((item: any) => (item.isProductCodeError)) ? errorMessages['productCodeError'] : ''
            allErrors.hsnError = items.some((item: any) => (item.isHsnError)) ? errorMessages['hsnError'] : ''
            allErrors.serialNumberError = items.some((item: any) => (item.isSerialNumberError)) ? errorMessages['serialNumberError'] : ''
            allErrors.gstRateError = items.some((item: any) => (item.isGstRateError)) ? errorMessages['gstRateError'] : ''
        }
    }

    function computeAllRows() {
        for (let lineItem of sales.items) {
            // computeRow(lineItem, false)
        }
        megaData.executeMethodForKey('computeSummary:itemsFooter')
        setRefresh({})
    }
    return ({
        // checkAllErrors, clearRow, computeRow, getSlNoError, handleDeleteRow, handleSerialNo, meta, setPrice, setPriceGst
        checkAllErrors, meta,
    })
}

export { useLineItems }