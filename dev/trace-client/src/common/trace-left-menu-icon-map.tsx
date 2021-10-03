import IconAccountBalance from '@material-ui/icons/AccountBalance'
import IconDone from '@material-ui/icons/Done'
import IconDoneAll from '@material-ui/icons/DoneAll'
import IconDoneOutline from '@material-ui/icons/DoneOutline'
import IconMoney from '@material-ui/icons/Money'
import IconMoneyOff from '@material-ui/icons/MoneyOff'
import IconPayment from '@material-ui/icons/Payment'
import IconReceipt from '@material-ui/icons/Receipt'
import IconViewList from '@material-ui/icons/ViewList'
import IconGavel from '@material-ui/icons/Gavel'
import IconLibraryBooks from '@material-ui/icons/LibraryBooks'
import IconListAlt from '@material-ui/icons/ListAlt'
import IconForum from '@material-ui/icons/Forum'
import IconAccountBalanceWallet from '@material-ui/icons/AccountBalanceWallet'
import IconSettingsCell from '@material-ui/icons/SettingsCell'
import IconTune from '@material-ui/icons/Tune'
import IconInfo from '@material-ui/icons/Info'
import IconCheckCircle from '@material-ui/icons/CheckCircle'
import IconContacts from '@material-ui/icons/Contacts'
import IconAcUnit from '@material-ui/icons/AcUnit'
import IconToc from '@material-ui/icons/Toc'
import IconAccoutTree from '@material-ui/icons/AccountTree'
import IconDomain from '@material-ui/icons/Domain'
import IconDeveloperBoard from '@material-ui/icons/DeveloperBoard'
import IconExtension from '@material-ui/icons/Extension'
import IconReorder from '@material-ui/icons/Reorder'
import IconGeneralSettings from '@material-ui/icons/Settings'
import IconReportSharp from '@material-ui/icons/ReportSharp'
import IconAllTransactions from '@material-ui/icons/ViewListSharp'
import IconExports from '@material-ui/icons/SystemUpdate'
import IconUtilities from '@material-ui/icons/Build'
import {
    DeleteForever, HighlightOff, DeleteRounded, MonetizationOn as MoneyIcon,
    DeleteTwoTone, People, DynamicFeed as SalesAndPurchases, AssignmentReturn as SalesReturn,
    AssignmentReturned as PurchaseReturn, FlightLand as DebitNotes,
    FlightTakeoff as CreditNotes, Dialpad as Inventory, Category as Categories, AccountTree, LibraryBooks
} from '@material-ui/icons'

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