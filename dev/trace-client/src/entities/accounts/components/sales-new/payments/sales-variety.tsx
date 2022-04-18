import { useRef } from 'react'
import { _, Box, Button, CloseSharp, FormControlLabel, IconButton, IMegaData, LedgerSubledger, MegaDataContext, NumberFormat, Radio, RadioGroup, TextField, useTraceMaterialComponents, Typography, useContext, useEffect, useState, useTheme } from '../redirect'

function SalesVariety() {
    const [, setRefresh] = useState({})
    const theme = useTheme()
    const megaData: IMegaData = useContext(MegaDataContext)
    const sales = megaData.accounts.sales
    const { BasicMaterialDialog } = useTraceMaterialComponents()

    useEffect(() => {
        sales.filterMethodName = 'cashBank'
        megaData.registerKeyWithMethod('doClear:saleVariety', doClear)
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
                            onClick={(e: any) => {
                                handleSalesVariety('r')
                                // resetAddresses()
                                handleRetailCashBankSales()
                            }}
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
                            onClick={(e: any) => {
                                handleSalesVariety('a')
                                // resetAddresses()
                                // handleAutoSubledgerSales()
                            }}
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
                            onClick={(e: any) => {
                                handleSalesVariety('i')
                                // resetAddresses()
                                // handleInstitutionSales()
                            }}
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

    async function handleRetailCashBankSales() {
        pre.dialogConfig.title = 'Select a cash / bank account'
        meta.current.showDialog = true
        meta.current.dialogConfig.data =
            // arbitraryData.accounts.cashBankAccountsWithSubledgers
        // meta.current.dialogConfig.content = () => (
            // <AccountsList mapFunction={() => { }} />
        // )
        // setFirstFooterRow('cashBank')
        setRefresh({})
    }

    function handleSalesVariety(variety: string) {
        const logic: any = {
            r: 'cashBank',
            a: 'autoSubledgers',
            i: 'debtorsCreditors'
        }
        sales.saleVariety = variety
        sales.filterMethodName = logic[variety]
        sales.paymentMethods.length = 0
        sales.paymentMethods.push({})
        megaData.executeMethodForKey('render:paymentMethods', {})
        showDialog()
        // setRefresh({})
    }

    function showDialog() {
        pre.showDialog = true
        setRefresh({})
    }
}

export { SalesVariety }