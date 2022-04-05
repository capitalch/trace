import { accountsMessages, Box, MegaDataContext, useConfirm, useContext, useEffect, useRef, useState } from './redirect'
function useCustomerInfo() {
    const [, setRefresh] = useState({})
    const megaData = useContext(MegaDataContext)
    const sales = megaData.accounts.sales
    const confirm = useConfirm()
    const meta: any = useRef({
        searchFilter: '',
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
        if (pre.searchFilter) {
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

    return ({ handleCloseDialog, handleCustomerSearch, meta })
}
export { useCustomerInfo }

function CustomerDialogContent({ meta }: any) {
    const [, setRefresh] = useState({})
    const pre = meta.current

    useEffect(() => {

    }, [])

    return (<Box>cust</Box>)
}

export { CustomerDialogContent }