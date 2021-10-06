import IconAccountBalance from '@mui/icons-material/AccountBalance'
import IconDone from '@mui/icons-material/Done'
import IconDoneAll from '@mui/icons-material/DoneAll'
import IconDoneOutline from '@mui/icons-material/DoneOutline'
import IconMoney from '@mui/icons-material/Money'
import IconMoneyOff from '@mui/icons-material/MoneyOff'
import IconPayment from '@mui/icons-material/Payment'
import IconReceipt from '@mui/icons-material/Receipt'
import IconViewList from '@mui/icons-material/ViewList'
import IconGavel from '@mui/icons-material/Gavel'
import IconLibraryBooks from '@mui/icons-material/LibraryBooks'
import IconListAlt from '@mui/icons-material/ListAlt'
import IconForum from '@mui/icons-material/Forum'
import IconAccountBalanceWallet from '@mui/icons-material/AccountBalanceWallet'
import IconSettingsCell from '@mui/icons-material/SettingsCell'
import IconTune from '@mui/icons-material/Tune'
import IconInfo from '@mui/icons-material/Info'
import IconCheckCircle from '@mui/icons-material/CheckCircle'
import IconContacts from '@mui/icons-material/Contacts'
import IconAcUnit from '@mui/icons-material/AcUnit'
import IconToc from '@mui/icons-material/Toc'
import IconAccoutTree from '@mui/icons-material/AccountTree'
import IconDomain from '@mui/icons-material/Domain'
import IconDeveloperBoard from '@mui/icons-material/DeveloperBoard'
import IconExtension from '@mui/icons-material/Extension'
import IconReorder from '@mui/icons-material/Reorder'
import IconGeneralSettings from '@mui/icons-material/Settings'
import IconReportSharp from '@mui/icons-material/ReportSharp'
import IconAllTransactions from '@mui/icons-material/ViewListSharp'
import IconExports from '@mui/icons-material/SystemUpdate'
import IconUtilities from '@mui/icons-material/Build'
import {
    DeleteForever, HighlightOff, DeleteRounded, MonetizationOn as MoneyIcon,
    DeleteTwoTone, People, DynamicFeed as SalesAndPurchases, AssignmentReturn as SalesReturn,
    AssignmentReturned as PurchaseReturn, FlightLand as DebitNotes,
    FlightTakeoff as CreditNotes, Dialpad as Inventory, Category as Categories, AccountTree, LibraryBooks
} from '@mui/icons-material'

const iconMap: any = {
    finalAccountsMenu: <IconAccountBalance></IconAccountBalance>
    , trialBalanceSubMenu: <IconDone></IconDone>
    , balanceSheetSubMenu: <IconDoneAll></IconDoneAll>
    , profitLossSubMenu: <IconDoneOutline></IconDoneOutline>
    , generalLedgerSubMenu: <LibraryBooks />
    , taxationSubMenu: <IconPayment />

    , vouchersMenu: <IconViewList></IconViewList>
    , paymentsSubMenu: <IconPayment></IconPayment>
    , receiptsSubMenu: <IconReceipt></IconReceipt>
    , contraSubMenu: <IconLibraryBooks></IconLibraryBooks>
    , journalsSubMenu: <IconGavel></IconGavel>

    , optionsMenu: <IconExtension></IconExtension>
    , bankReconSubMenu: <IconReorder></IconReorder>
    , incomeSubMenu: <MoneyIcon></MoneyIcon>
    , genericExportsSubMenu: <IconExports></IconExports>
    , commonUtilitiesSubMenu: <IconUtilities></IconUtilities>

    , mastersMenu: <IconListAlt></IconListAlt>
    , unitInfoSubMenu: <IconInfo></IconInfo>
    , generalSettingsSubMenu: <IconGeneralSettings></IconGeneralSettings>
    , accountsSubMenu: <IconForum></IconForum>
    , accountsOpBalSubMenu: <IconAccountBalanceWallet></IconAccountBalanceWallet>
    , branchesSubMenu: <IconSettingsCell></IconSettingsCell>
    , financialYearsSubMenu: <IconTune></IconTune>

    , reportsMenu: <IconReportSharp></IconReportSharp>
    , allTransactionsSubMenu: <IconAllTransactions></IconAllTransactions>

    //Sales and purchases menu
    , salesPurchasesMenu: <SalesAndPurchases></SalesAndPurchases>
    , salesSubMenu: <IconMoney></IconMoney>
    , purchasesSubMenu: <IconMoneyOff></IconMoneyOff>
    , salesReturnSubMenu: <SalesReturn></SalesReturn>
    , purchaseReturnSubMenu: <PurchaseReturn></PurchaseReturn>
    , debitNotesSubMenu: <DebitNotes></DebitNotes>
    , creditNotesSubMenu: <CreditNotes></CreditNotes>

    // Inventory menu
    , inventoryMenu: <Inventory></Inventory>
    , brandsSubMenu: <AccountTree />
    , categoriesSubMenu: <Categories></Categories>
    , productsSubMenu: <LibraryBooks />

    //Admin menu
    , artifacts: <IconCheckCircle></IconCheckCircle>
    , manageUsers: <IconContacts></IconContacts>
    , manageBu: <IconAcUnit></IconAcUnit>
    , manageRoles: <People></People>
    , associateBusinessUsersWithRolesAndBu: <IconToc></IconToc>

    // Super admin menu
    , manageClients: <IconAccoutTree></IconAccoutTree>
    , manageEntities: <IconDomain></IconDomain>
    , associateAdminUserWithClientAndEntity: <IconDeveloperBoard></IconDeveloperBoard>

    , permanentDelete: <DeleteForever></DeleteForever>
    , deleteAdminUser: <HighlightOff></HighlightOff>
    , deleteClient: <DeleteRounded></DeleteRounded>
    , deleteEntity: <DeleteTwoTone></DeleteTwoTone>
}

export { iconMap }