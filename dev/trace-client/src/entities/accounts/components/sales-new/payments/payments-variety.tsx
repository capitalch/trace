import { _, Avatar, Box, Button, CloseSharp, FormControlLabel, IconButton, IMegaData, LedgerSubledger, List, ListItem, ListItemAvatar, ListItemText, MegaDataContext, NumberFormat, Radio, RadioGroup, TextField, useIbuki, useTraceMaterialComponents, Typography, useContext, useEffect, useRef, useState, useTheme, utils, utilMethods } from '../redirect'

function PaymentsVariety() {
    const [, setRefresh] = useState({})
    const { emit } = useIbuki()
    const theme = useTheme()
    const megaData: IMegaData = useContext(MegaDataContext)
    const sales = megaData.accounts.sales
    const { BasicMaterialDialog } = useTraceMaterialComponents()
    const { getAutoSubledgers, getCashBankAccountsWithSubledgers, getdebtorCreditorAccountsWithSubledgers } = utils()
    const { keyGen } = utilMethods()

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
                            checked={sales.saleVariety === 'r'}
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
                            checked={sales.saleVariety === 'a'}
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
                            checked={sales.saleVariety === 'i'}
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
                pre.showDialog = false
                setRefresh({})
                emit('LEDGER-SUBLEDGER-JUST-REFRESH', null)
            }
        }
    }

    function handleAutoSubledgerSales() {
        pre.dialogConfig.title = 'Select auto subledger account'
        handleSalesVariety('a')
        const data = getAutoSubledgers()
        pre.dialogConfig.content = () => getContent(data)
        showDialog()
    }

    function handleInstitutionSales(){
        pre.dialogConfig.title = 'Select debtor /creditor account'
        handleSalesVariety('i')
        const data = getdebtorCreditorAccountsWithSubledgers()
        pre.dialogConfig.content = () => getContent(data)
        showDialog()
    }

    function handleRetailCashBankSales() {
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
        sales.saleVariety = variety
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