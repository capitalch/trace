import { } from '../inventory/redirect'
import { accountsMessages, Box, MegaDataContext, useConfirm, useContext, useEffect, useIbuki, useRef, useState, utilMethods } from './redirect'
function useCustomer() {
    const [, setRefresh] = useState({})
    const megaData = useContext(MegaDataContext)
    const sales = megaData.accounts.sales
    const confirm = useConfirm()
    const meta: any = useRef({
        // searchFilter: '',
        setRefresh: setRefresh,
        showDialog: false,
        dialogConfig: {
            title: 'Select customer',
        }
    })
    const pre = meta.current

    function handleCloseDialog() {
        pre.showDialog = false
        setRefresh({})
    }

    function handleCustomerSearch() {
        if (sales.searchFilter) {
            pre.showDialog = true
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
        sales.searchFilter = ''
        setRefresh({})
    }

    return ({ handleCloseDialog, handleCustomerSearch, handleCustomerSearchClear, meta })
}
export { useCustomer }

function CustomerDialogContent({ meta }: any) {
    // const [, setRefresh] = useState({})
    const pre = meta.current
    const megaData = useContext(MegaDataContext)
    const sales = megaData.accounts.sales
    const searchFilter = sales.searchFilter.replaceAll('*', '\\*')
    const confirm = useConfirm()
    const { emit } = useIbuki()
    const { execGenericView } = utilMethods()
    useEffect(() => {
        fetchData()
    }, [])

    function closeDialog() {
        pre.shoDialog = false
        pre.setRefresh({})
    }

    async function fetchData() {
        let searchString
        //split on non alphanumeric character
        const arr = sales.searchFilter.toLowerCase().split(/\W/).filter((x: any) => x) // filter used to remove empty elements

        if (sales.searchFilterOr) {
            searchString = arr.join('|')
        } else { //and arr elements for regex
            const tempArr = arr.map((x: any) => `(?=.*${x})`)
            searchString = tempArr.join('')
        }
        emit('SHOW-LOADING-INDICATOR', true)

        // regex search at server. '|' is logical OR and '?=.*' is logical AND operator for regexp in postgresql
        // The args is formed at client to work as logical OR / AND at server. If '57' and '300' both required in any order then args is '(?=.*57)(?=.*300)'. If either of '57' or '300' is required then args='57|300'
        const ret = await execGenericView({
            isMultipleRows: true,
            sqlKey: 'get_contacts_on_regexp',
            args: { searchString: searchString } // searchFilter.replaceAll('*', '\\*') ,
        })
        emit('SHOW-LOADING-INDICATOR', false)

        if (ret && ret.length > 0) {
            if (ret.length === 1) {
                sales.billTo = ret[0]
                // setCountryStateCityValuesFromLabels()
                closeDialog()
            }
        } else {
            const options = {
                description: accountsMessages.newContact,
                title: accountsMessages.notFound,
                cancellationText: null,
            }
            confirm(options)
        }


    }

    return (<Box>cust</Box>)
}

export { CustomerDialogContent }