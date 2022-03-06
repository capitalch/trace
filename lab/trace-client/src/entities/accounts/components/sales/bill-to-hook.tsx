import {
    useState,
    useEffect,
    useRef,
} from '../../../../imports/regular-imports'
import {
    Avatar,
    makeStyles,
    Theme,
    createStyles,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Typography,
} from '../../../../imports/gui-imports'
import { useSharedElements } from '../common/shared-elements-hook'
import { NewEditContact } from './new-edit-contact'
import countries from '../../../../data/countries.json'
import states from '../../../../data/states.json'
import cities from '../../../../data/cities.json'

function useBillTo(arbitraryData: any) {
    const [, setRefresh] = useState({})
    const {
        accountsMessages,
        confirm,
        emit,
        execGenericView,
        filterOn,
        isInvalidGstin,
    } = useSharedElements()
    
    const meta: any = useRef({
        isMounted: false,
        searchFilter: '',
        showDialog: false,
        dialogConfig: {
            title: '',
            content: () => {},
            actions: () => {},
            isSearchBox: true,
            searchBoxFilter: '',
        },
    })
    const pre = meta.current.dialogConfig
    
    useEffect(() => {
        const curr = meta.current
        curr.isMounted = true
        const subs1 = filterOn('BILL-TO-CLOSE-DIALOG').subscribe(() => {
            curr.showDialog = false
            setRefresh({})
        })
        const subs2 = filterOn('BILL-TO-REFRESH').subscribe(() => {
            curr.searchFilter = ''
            setRefresh({})
        })
        return () => {
            curr.isMounted = false
            subs1.unsubscribe()
            subs2.unsubscribe()
        }
    }, [])

    function allErrors() {
        function gstinError() {
            return isInvalidGstin(arbitraryData?.billTo?.gstin)
        }

        function billToError() {
            return !(
                arbitraryData.billTo.id || arbitraryData.billTo.contactName
            )
        }

        return { billToError, gstinError }
    }

    function handleClear() {
        arbitraryData.billTo = {}
        meta.current.searchFilter = ''
        meta.current.isMounted && setRefresh({})
        arbitraryData.salesCrownRefresh()
    }

    function handleNewEdit() {
        const billTo = arbitraryData.billTo
        pre.title = billTo.id ? 'Edit contact' : 'New contact'
        pre.searchBoxFilter = ''
        pre.isSearchBox = false
        pre.content = () => NewEditContact({ arbitraryData })
        meta.current.showDialog = true
        meta.current.isMounted && setRefresh({})
    }

    async function handleSearch() {
        if (meta.current.searchFilter) {
            emit('SHOW-LOADING-INDICATOR', true)
            const ret = await execGenericView({
                isMultipleRows: true,
                sqlKey: 'get_contact_on_mobile_email_contactName',
                args: { searchString: meta.current.searchFilter },
            })
            emit('SHOW-LOADING-INDICATOR', false)
            if (ret && ret.length > 0) {
                if (ret.length === 1) {
                    arbitraryData.billTo = ret[0]
                    setCountryStateCityValuesFromLabels()
                    meta.current.isMounted && setRefresh({})
                } else {
                    // Open dialog and select one from multiple rows
                    meta.current.dialogConfig.data = ret
                    meta.current.dialogConfig.filteredData = ret
                    setSearchDialog()
                    meta.current.isMounted && setRefresh({})
                }
            } else {
                const options = {
                    description: accountsMessages.newContact,
                    title: accountsMessages.notFound,
                    cancellationText: null,
                }
                confirm(options)
            }
        } else {
            const options = {
                description: accountsMessages.giveSearchCriteria,
                title: accountsMessages.emptySearchCriteria,
                cancellationText: null,
            }
            confirm(options)
        }

        function setSearchDialog() {
            pre.title = 'Select contact from following'
            pre.content = ContactList
            pre.actions = () => {}
            pre.searchBoxFilter = ''
            meta.current.showDialog = true
        }
    }

    function ContactList() {
        const data: any[] = meta.current.dialogConfig.filteredData
        return (
            <>
                <label>
                    {data.length}
                    {' Items'}
                </label>
                <List>
                    {data.map((item: any, index: number) => {
                        return (
                            <ListItem
                                alignItems="flex-start"
                                onClick={(e: any) => {
                                    arbitraryData.billTo = item
                                    meta.current.searchFilter = ''
                                    meta.current.showDialog = false
                                    setCountryStateCityValuesFromLabels()
                                    meta.current.isMounted && setRefresh({})
                                    arbitraryData.salesCrownRefresh()
                                }}
                                key={index}
                                dense={true}
                                divider={true}
                                button={true}>
                                <ListItemAvatar>
                                    <Avatar>
                                        {item.contactName[0].toUpperCase()}
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                    primary={item.contactName}
                                    secondary={
                                        <>
                                            <Typography
                                                component="li"
                                                variant="body2">
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
                                        </>
                                    }
                                />
                            </ListItem>
                        )
                    })}
                </List>
            </>
        )
    }

    function onSearchBoxFilter() {
        //filters on keypress of dialog search box
        if (pre.searchBoxFilter) {
            pre.filteredData = pre.data.filter(
                (item: any) =>
                    item?.contactName
                        ?.toLowerCase()
                        .includes(pre.searchBoxFilter) ||
                    item?.mobileNumber
                        ?.toLowerCase()
                        .includes(pre.searchBoxFilter) ||
                    item?.otherMobileNumber
                        ?.toLowerCase()
                        .includes(pre.searchBoxFilter) ||
                    item?.landPhone
                        ?.toLowerCase()
                        .includes(pre.searchBoxFilter) ||
                    item?.email?.toLowerCase().includes(pre.searchBoxFilter) ||
                    item?.address1
                        ?.toLowerCase()
                        .includes(pre.searchBoxFilter) ||
                    item?.address2
                        ?.toLowerCase()
                        .includes(pre.searchBoxFilter) ||
                    item?.country
                        ?.toLowerCase()
                        .includes(pre.searchBoxFilter) ||
                    item?.state?.toLowerCase().includes(pre.searchBoxFilter) ||
                    item?.city?.toLowerCase().includes(pre.searchBoxFilter) ||
                    item?.gstin?.toLowerCase().includes(pre.searchBoxFilter) ||
                    item?.pin?.toLowerCase().includes(pre.searchBoxFilter)
            )
            pre.content = ContactList
        } else {
            pre.filteredData = pre.data
        }
    }

    function setCountryStateCityValuesFromLabels() {
        const billTo = arbitraryData.billTo
        if (billTo?.country && billTo?.state && billTo?.city) {
            setValues()
        }

        function setValues() {
            const countryValue: any = countries.find(
                (x) => x.name.toLowerCase() === billTo.country.toLowerCase()
            )
            const stateValue: any = states.find(
                (x) => x.name.toLowerCase() === billTo.state.toLowerCase()
            )
            // const cityValue: any = cities.find(
            //     (x) => x.name.toLowerCase() === billTo.city.toLowerCase()
            // )
            billTo.country = {
                name: billTo.country,
                value: parseInt(countryValue),
            }
            billTo.state = {
                name: billTo.state,
                value: parseInt(stateValue),
                stateCode: parseInt(billTo.stateCode),
            }
            billTo.city = {
                name: billTo.city,
                vallue: parseInt(billTo.city),
            }
        }
    }

    return {
        allErrors,
        handleClear,
        handleNewEdit,
        handleSearch,
        meta,
        onSearchBoxFilter,
    }
}

export { useBillTo }

const useStyles: any = makeStyles((theme: Theme) =>
    createStyles({
        content: {
            marginTop: theme.spacing(1),
            padding: theme.spacing(1),
            '& .bill-to-wrapper': {
                display: 'flex',
                columnGap: theme.spacing(3),
                '& .bill-to': {
                    display: 'flex',
                    columnGap: theme.spacing(3),
                    rowGap: theme.spacing(3),
                    flexWrap: 'wrap',
                    pointerEvents: (arbitraryData: any) => {
                        let ret = 'none'
                        if ('ra'.includes(arbitraryData.saleVariety)) {
                            ret = 'auto'
                        }
                        return ret
                    },
                    opacity: (arbitraryData: any) => {
                        let ret = '0.4'
                        if ('ra'.includes(arbitraryData.saleVariety)) {
                            ret = '1'
                        }
                        return ret
                    },
                    '& .search-box': {
                        width: '35ch',
                    },
                    '& .search-button': {
                        backgroundColor: 'dodgerblue',
                        color: theme.palette.common.white,
                    },
                    '& .clear-button': {
                        background: theme.palette.warning.main,
                        color: theme.palette.common.white,
                    },
                },
            },

            '& .bill-to-address': {
                color: theme.palette.grey[500],
                display: 'flex',
                alignItems: 'center',
                columnGap: theme.spacing(1),
                flexWrap: 'wrap',
                marginTop: theme.spacing(1),
                fontSize: '0.8rem',

                '& span': {
                    color: theme.palette.blue.main,
                },
            },
        },
    })
)

export { useStyles }
