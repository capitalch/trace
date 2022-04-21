import { accountsMessages, errorMessages, IMegaData, MegaDataContext, NewEditCustomer, useConfirm, useContext, useEffect, useIbuki, useRef, useState, utils } from '../redirect'
import { CustomerSearch } from './customer-search'

function useCustomer() {
    const [, setRefresh] = useState({})
    const megaData: IMegaData = useContext(MegaDataContext)
    const sales = megaData.accounts.sales
    const allErrors = sales.allErrors
    const confirm = useConfirm()
    const { isInvalidDate, isInvalidGstin } = utils()
    const { emit } = useIbuki()
    const meta: any = useRef({
        allRows: [],
        filteredRows: [],
        searchText: '',
        setRefresh: setRefresh,
        showDialog: false,
        dialogConfig: {
            title: '',
            content: () => <></>
        }
    })

    useEffect(() => {
        megaData.registerKeyWithMethod('render:customer', setRefresh)
    }, [])

    useEffect(() => {
        emit('ALL-ERRORS-JUST-REFRESH', null)
    })


    const pre = meta.current
    const dialogConfig = pre.dialogConfig

    function checkAllErrors() {
        dateError(); customerError(); gstinError()

        function dateError() {
            const ret = (isInvalidDate(sales.tranDate) || (!sales.tranDate)) ?
                errorMessages['dateError'] : ''
            allErrors['dateError'] = ret
        }

        function customerError() {
            const ret = !((sales?.billTo?.id) && (sales.billTo.contactName)) ? errorMessages['customerError'] : ''
            allErrors['customerError'] = ret
        }

        function gstinError() {
            const ret = isInvalidGstin(sales.billTo.gstin) ? errorMessages['gstinError'] : ''
            allErrors['gstinError'] = ret
        }
    }

    function handleCloseDialog() {
        pre.showDialog = false
        setRefresh({})
    }

    function handleCustomerClear() {
        sales.billTo = {}
        sales.searchText = ''
        sales.isSearchTextOr = false
        setRefresh({})
    }

    function handleCustomerSearch() {
        if (sales.searchText) {
            pre.allRows = []
            pre.filteredRows = []
            pre.showDialog = true
            dialogConfig.title = 'Select customer'
            dialogConfig.content = () => <CustomerSearch meta={meta} />
            setRefresh({})
        } else {
            const options = {
                description: accountsMessages.giveSearchCriteria,
                title: accountsMessages.emptySearchCriteria,
                cancellationText: null,
            }
            confirm(options)
        }
    }

    function handleCustomerSearchClear() {
        sales.searchText = ''
        sales.isSearchTextOr = false
        setRefresh({})
    }

    function handleNewEditCustomer() {
        pre.showDialog = true
        dialogConfig.title = 'New / Edit customer'
        dialogConfig.content = () => <NewEditCustomer parentMeta={meta} />
        setRefresh({})
    }

    function handleTextChanged(propName: string, e: any) {
        sales[propName] = e.target.value
        setRefresh({})
    }

    return ({ checkAllErrors, handleCloseDialog, handleCustomerClear, handleCustomerSearch, handleCustomerSearchClear, handleNewEditCustomer, handleTextChanged, meta })
}
export { useCustomer }