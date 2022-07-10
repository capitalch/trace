
import {
    _, AccountsLedgerDialog, getDebitCreditNotesArbitraryData, getPurchasesArbitraryData,
    getSalesArbitraryData, getVouchersArbitraryData, manageEntitiesState, MegaDataContext, MultiDataContext, Typography,
    useContext, useIbuki, useLinkClient, useRef, useServerSocketMessageHandler, useState, useEffect,
    useTheme, utils
} from './components/common/redirect'
import {
    AccountsMaster, AccountsOpBal, BalanceSheetProfitLoss, BankRecon, Brands, Branches,
    CategoriesMaster, CommonUtilities, CreditNotes, DebitNotes, FinancialYears, GenericDialoges,
    GenericExports, GenericReports, GeneralLedger, Products, Purchases, Sales,SalesNew, Taxation,
    TrialBalance, Voucher, OpeningStock, InventoryReports
} from './components/common/redirect'
import { StockJournal } from './components/inventory/stock-journal/stock-journal'
// import { settingsMegaData, salesMegaData } from './mega-data-init-values'

function LaunchPad() {
    const { getUnitHeading } = utils()
    const theme = useTheme()
    const {
        getFromBag,
        getLoginData,
        setCurrentComponent,
        getCurrentEntity,
        getCurrentComponent,
    } = manageEntitiesState()
    const { filterOn } = useIbuki()
    const [, setRefresh] = useState({})
    const meta: any = useRef({
        isMounted: false,
        mainHeading: '',
    })
    const { connectToLinkServer, joinRoom, onReceiveData } = useLinkClient()
    // const megaData = useContext(MegaDataContext)
    meta.current.mainHeading = getUnitHeading()
    
    

    const { socketMessageHandler } = useServerSocketMessageHandler()

    useEffect(() => {
        const curr = meta.current
        curr.isMounted = true
        const subs: any = filterOn('LAUNCH-PAD:LOAD-COMPONENT').subscribe(
            (d: any) => {
                if (!getCurrentEntity()) {
                    return
                }
                if (d.data) {
                    setCurrentComponent(d.data)
                }
                curr.isMounted && setRefresh({})
            }
        )
        return () => {
            subs.unsubscribe()
            curr.isMounted = false
        }
    }, [])

    useEffect(() => {
        const configuration = getFromBag('configuration')
        if(_.isEmpty(configuration)){
            return
        }
        const { linkServerUrl, linkServerKey } = configuration
        let subs2: any = undefined
        const subs1 = connectToLinkServer(linkServerUrl, undefined, linkServerKey).subscribe(
            (d: any) => {
                if (d.connected) {
                    const room = getRoom()
                    joinRoom(room)
                    subs2 = onReceiveData().subscribe(socketMessageHandler)
                } else {
                    subs2 && (subs2.unsubscribe())
                }
            }
        )
        return (() => {
            subs1.unsubscribe()
            if (subs2) {
                subs2.unsubscribe()
            }
        })
    }, [])

    const salesData = getSalesArbitraryData()
    const purchasesData = getPurchasesArbitraryData()
    const debitCreditNotesData = getDebitCreditNotesArbitraryData()
    const vouchersArbitraryData = getVouchersArbitraryData()

    return (
        <>
            <Typography variant="h6" sx={{ color: theme.palette.common.black, fontWeight: 'bold' }}>
                {meta.current.mainHeading}
            </Typography>
            {/* <MegaContext.Provider value={meta.current.mega}> */}
            <MultiDataContext.Provider
                value={{
                    sales: salesData,
                    purchases: purchasesData,
                    debitCreditNotes: debitCreditNotesData,
                    vouchers: vouchersArbitraryData,
                    generic: {}
                }}>
                <Comp></Comp>
            </MultiDataContext.Provider>
            {/* </MegaContext.Provider> */}
            <AccountsLedgerDialog></AccountsLedgerDialog>
        </>
    )

    function Comp() {
        const componentsMap: any = {
            accountsMaster: AccountsMaster,
            accountsOpBal: AccountsOpBal,
            balanceSheet: BalanceSheetProfitLoss,
            bankRecon: BankRecon,
            brands: Brands,
            branches: Branches,
            categoriesMaster: CategoriesMaster,
            commonUtilities: CommonUtilities,
            creditNotes: CreditNotes,
            debitNotes: DebitNotes,
            financialYears: FinancialYears,
            genericDialoges: GenericDialoges,
            genericExports: GenericExports,
            genericReports: GenericReports,
            generalLedger: GeneralLedger,
            products: Products,
            profitLoss: BalanceSheetProfitLoss,
            purchases: Purchases,
            sales: Sales,
            salesNew:SalesNew,
            taxation: Taxation,
            trialBalance: TrialBalance,
            vouchers: Voucher,
            openingStock: OpeningStock,
            inventoryReports: InventoryReports,
            stockJournal: StockJournal
        }
        let ret: any = <></>

        const currentComponent = getCurrentComponent()
        if (!_.isEmpty(currentComponent)) {
            const currentComponentName = currentComponent.componentName
            // if (currentComponentName === mega.accounts.settings?.loadedComponent?.name) {
            //     ret = mega.accounts.settings.loadedComponent.component
            // } else {
            ret = componentsMap[currentComponentName](currentComponent.args)
            // mega.accounts.settings.loadedComponent = {}
            // const loaded = mega.accounts.settings.loadedComponent
            // loaded.name = currentComponentName
            // loaded.component = ret
            // }
        }
        return ret
    }

    function getRoom() {
        const clientId = getLoginData()?.clientId
        const buCode = getFromBag('buCode')
        const { finYearId } = getFromBag('finYearObject') || ''
        const { branchId } = getFromBag('branchObject') || ''
        const room = `${String(
            clientId
        )}:${buCode}:${finYearId}:${branchId}`
        return room
    }
}

export { LaunchPad }



