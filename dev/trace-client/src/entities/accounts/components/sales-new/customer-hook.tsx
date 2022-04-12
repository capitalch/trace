import { accountsMessages, Avatar, Box, List, ListItem, ListItemAvatar, ListItemText, MegaDataContext, Typography, useConfirm, useContext, useEffect, useIbuki, useRef, useState, useTheme, utilMethods } from './redirect'
function useCustomer() {
    const [, setRefresh] = useState({})
    const megaData = useContext(MegaDataContext)
    const sales = megaData.accounts.sales
    const confirm = useConfirm()
    const meta: any = useRef({
        allRows: [],
        filteredRows: [],
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

    return ({ handleCloseDialog, handleCustomerClear, handleCustomerSearch, handleCustomerSearchClear, meta })
}
export { useCustomer }

function CustomerDialogContent({ meta }: any) {
    // const [, setRefresh] = useState({})
    const pre = meta.current
    const megaData = useContext(MegaDataContext)
    const sales = megaData.accounts.sales
    const searchText = sales.searchText.replaceAll('*', '\\*')
    const confirm = useConfirm()
    const { emit } = useIbuki()
    const { execGenericView } = utilMethods()
    const theme = useTheme()
    useEffect(() => {       
        fetchData()
    }, [])

    function closeDialog() {
        pre.showDialog = false
        pre.setRefresh({})
    }

    async function fetchData() {
        let searchString
        //split on non alphanumeric character
        const arr = searchText.toLowerCase().split(/\W/).filter((x: any) => x) // filter used to remove empty elements

        if (sales.isSearchTextOr) { // The checkbox
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
            args: { searchString: searchString }
        })
        emit('SHOW-LOADING-INDICATOR', false)

        if (ret && ret.length > 0) {
            if (ret.length === 1) {
                sales.billTo = ret[0]
                // setCountryStateCityValuesFromLabels()
                closeDialog()
            } else { //show list
                pre.allRows = ret
                pre.filteredRows = pre.allRows.map((x: any) => ({ ...x }))
            }
        } else {
            const options = {
                description: accountsMessages.newContact,
                title: accountsMessages.notFound,
                cancellationText: null,
            }
            confirm(options)
            closeDialog()
        }
        pre.setRefresh({})
    }

    return (<Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <Typography>{''.concat(pre.filteredRows.length || 0, ' Items')}</Typography>
        <List>
            {
                pre.filteredRows.map((item: any, index: number) => (
                    <ListItem
                        alignItems='flex-start'
                        key={index}
                        dense={true}
                        divider={true}
                        onClick={() => {
                            sales.billTo = item
                            pre.searchText = ''
                            // setCountryStateCityValuesFromLabels()
                            closeDialog()
                        }}
                        button={true}>
                        <ListItemAvatar>
                            <Avatar sx={{ backgroundColor: theme.palette.lightBlue.main, color: theme.palette.common.white }}>
                                {item.contactName[0].toUpperCase()}
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText primary={item.contactName} sx={{}}
                            secondary={
                                <>
                                    <Typography component='li' variant='body1' color={theme.palette.common.black}>
                                        {'M: '}
                                        {item.mobileNumber}
                                    </Typography>
                                    <Typography
                                        component="li"
                                        variant="body2"
                                        color="textPrimary">
                                        {item.address1}
                                    </Typography>
                                    <Typography
                                        component="li"
                                        variant="body2"
                                        color="textPrimary">
                                        {item.address2}
                                    </Typography>
                                    <Typography
                                        component="li"
                                        variant="body2"
                                        color="textPrimary">
                                        {item.email}
                                    </Typography>
                                </>
                            }
                        ></ListItemText>
                    </ListItem>
                ))
            }
        </List>
    </Box>)

    // function handleContactSelected(e:any){
    //     sales.billTo = item
    // }
}

export { CustomerDialogContent }