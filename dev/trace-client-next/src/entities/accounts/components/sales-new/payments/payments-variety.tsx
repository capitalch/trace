import { _, Avatar, Box, Button, CloseSharp, FormControlLabel, IconButton, IMegaData, LedgerSubledger, List, ListItem, ListItemAvatar, ListItemText, MegaDataContext, NumberFormat, Radio, RadioGroup, TextField, useIbuki, useTraceMaterialComponents, Typography, useContext, useEffect, useRef, useState, useTheme, utils, utilMethods } from '../redirect'

function PaymentsVariety() {
    const [, setRefresh] = useState({})
    const { emit } = useIbuki()
    const theme = useTheme()
    const megaData: IMegaData = useContext(MegaDataContext)
    const sales = megaData.accounts.sales
    const { BasicMaterialDialog } = useTraceMaterialComponents()
    const { getAutoSubledgers, getCashBankAccountsWithSubledgers, getdebtorCreditorAccountsWithSubledgers } = utils()
    const { execGenericView, keyGen } = utilMethods()

    useEffect(() => {
        sales.filterMethodName = 'cashBank'
        megaData.registerKeyWithMethod('doClear:paymentsVariety', doClear)
    }, [])

    const meta: any = useRef({
        showDialog: false,
        dialogConfig: {
            title: 'Select an account',
            content: () => <></>,
            maxWidth: 'sm'
        }
    })
    const pre = meta.current
    return (
        <Box >
            <RadioGroup row>
                <FormControlLabel
                    control={
                        <Radio
                            // disabled={arbitraryData.id} // in edit mode changeover is not allowed
                            onClick={handleRetailCashBankSales}
                            size="small"
                            color="secondary"
                            checked={sales.paymentVariety === 'r'}
                        />
                    }
                    label="Retail sales"
                />
                <FormControlLabel
                    control={
                        <Radio
                            // disabled={arbitraryData.id} // in edit mode changeover is not allowed
                            onClick={handleAutoSubledgerSales}
                            size="small"
                            color="secondary"
                            checked={sales.paymentVariety === 'a'}
                        />
                    }
                    label="Auto subledger sales"
                />
                <FormControlLabel
                    control={
                        <Radio
                            // disabled={arbitraryData.id} // in edit mode changeover is not allowed
                            onClick={handleInstitutionSales}
                            size="small"
                            color="secondary"
                            checked={sales.paymentVariety === 'i'}
                        />
                    }
                    label="Institution sales"
                />
            </RadioGroup>
            <BasicMaterialDialog parentMeta={meta} />
        </Box>
    )

    function doClear() {
        handleSalesVariety('r')
    }

    function getContent(data: any[]) {

        return (<List>
            {getItems()}
        </List>)

        function getItems() {
            const gen: any = keyGen()
            return data.map((item: any) => (
                <ListItem
                    key={gen.next().value}
                    dense={true}
                    button={true}
                    onClick={() => handleItemOnClick(item)}>
                    <ListItemAvatar>
                        <Avatar>
                            {item.accName[0]?.toUpperCase()}
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary={item.accName} secondary={''.concat('Type: ', item.accClass, item.gstin ? 'Gstin:' + item.gstin : '')} />
                </ListItem>
            ))

            function handleItemOnClick(item: any) {
                sales.paymentMethodsList[0].rowData.accId = item.id
                if (sales.paymentVariety === 'i') { // institution sales, address already there
                    populateInstitutionAddress(item.id)
                }
                pre.showDialog = false
                setRefresh({})
                emit('LEDGER-SUBLEDGER-JUST-REFRESH', null)
            }

            async function populateInstitutionAddress(id: number) {
                megaData.registerKeyWithMethod('getItems:populateInstitutionAddress', populateInstitutionAddress)
                emit('SHOW-LOADING-INDICATOR', true)
                const item = await execGenericView({
                    isMultipleRows: false,
                    sqlKey: 'get_extBusinessContactsAccM_on_accId',
                    args: { id: id },
                })
                emit('SHOW-LOADING-INDICATOR', false)
                // copies businessContact to billTo
                const businessContact = {
                    contactName: item?.contactName,
                    mobileNumber: item?.mobileNumber,
                    email: item?.email,
                    address1: item?.jAddress?.[0]?.address1,
                    address2: item?.jAddress?.[0]?.address2,
                    pin: item?.jAddress?.[0]?.pin,
                    country: item?.jAddress?.[0]?.country,
                    state: item?.jAddress?.[0]?.state,
                    city: item?.jAddress?.[0]?.city,
                    gstin: item?.gstin,
                }
                sales.billTo = {
                    ...sales.billTo,
                    ...businessContact,
                }
                megaData.executeMethodForKey('render:customer', {})
            }
        }
    }

    function handleAutoSubledgerSales() {
        megaData.executeMethodForKey('doClear:paymentsHeader')
        pre.dialogConfig.title = 'Select auto subledger account'
        handleSalesVariety('a')
        const data = getAutoSubledgers()
        pre.dialogConfig.content = () => getContent(data)
        showDialog()
    }

    function handleInstitutionSales() {
        megaData.executeMethodForKey('doClear:paymentsHeader')
        pre.dialogConfig.title = 'Select debtor /creditor account'
        handleSalesVariety('i')
        const data = getdebtorCreditorAccountsWithSubledgers()
        pre.dialogConfig.content = () => getContent(data)
        showDialog()
        // if( sales?.paymentMethodsList[0]?.rowData?.accId){ //A selecton is done from dialog box list  of accounts
        //     console.log('a')
        // }
    }

    function handleRetailCashBankSales() {
        megaData.executeMethodForKey('doClear:paymentsHeader')
        pre.dialogConfig.title = 'Select a cash / bank account'
        handleSalesVariety('r')
        const data = getCashBankAccountsWithSubledgers()
        pre.dialogConfig.content = () => getContent(data)
        showDialog()
    }

    function handleSalesVariety(variety: string) {
        const logic: any = {
            r: 'cashBank',
            a: 'autoSubledgers',
            i: 'debtorsCreditors'
        }
        Object.keys(sales.billTo).forEach((key: string) => delete sales.billTo[key]) // cleanup billTo
        megaData.executeMethodForKey('render:customer', {})
        sales.paymentVariety = variety
        sales.filterMethodName = logic[variety]
        sales.paymentMethodsList.length = 0
        sales.paymentMethodsList.push({})
        megaData.executeMethodForKey('render:paymentsMethods', {})
    }

    function showDialog() {
        pre.showDialog = true
        setRefresh({})
    }
}

export { PaymentsVariety }