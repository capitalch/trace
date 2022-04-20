import { useEffect } from 'react'
import { accountsMessages, IMegaData, MegaDataContext, NewEditCustomer, useConfirm, useContext, useRef, useState, } from '../redirect'
import { CustomerSearch } from './customer-search'
function useCustomer() {
    const [, setRefresh] = useState({})
    const megaData: IMegaData = useContext(MegaDataContext)
    const sales = megaData.accounts.sales
    const confirm = useConfirm()
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

    const pre = meta.current
    const dialogConfig = pre.dialogConfig
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

    return ({ handleCloseDialog, handleCustomerClear, handleCustomerSearch, handleCustomerSearchClear, handleNewEditCustomer, handleTextChanged, meta })
}
export { useCustomer }