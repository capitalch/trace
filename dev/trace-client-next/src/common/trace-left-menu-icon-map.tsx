import {
    Reorder,
    DeveloperBoard,
    Domain,
    Receipt,
    ViewList,
    Gavel,
    ListAlt,
    Forum,
    AccountBalanceWallet,
    SettingsCell,
    Tune,
    Info,
    CheckCircle,
    Contacts,
    AcUnit,
    Toc,
    AccountTree,
    Extension,
    Build,
    SystemUpdate,
    ViewListSharp,
    ReportSharp,
    Settings,
    Done,
    DoneAll,
    DoneOutline,
    Money,
    MoneyOff,
    Payment,
    AccountBalance,
    DeleteForever,
    HighlightOff,
    DeleteRounded,
    MonetizationOn,
    DeleteTwoTone,
    People,
    DynamicFeed,
    AssignmentReturn,
    AssignmentReturned,
    FlightLand,
    FlightTakeoff,
    Inventory,
    Category,
    LibraryBooks,
} from '../imports/icons-import'

const iconMap: any = {
    finalAccountsMenu: <AccountBalance></AccountBalance>,
    trialBalanceSubMenu: <Done></Done>,
    balanceSheetSubMenu: <DoneAll></DoneAll>,
    profitLossSubMenu: <DoneOutline></DoneOutline>,
    generalLedgerSubMenu: <LibraryBooks />,
    taxationSubMenu: <Payment />,

    vouchersMenu: <ViewList></ViewList>,
    paymentsSubMenu: <Payment></Payment>,
    receiptsSubMenu: <Receipt></Receipt>,
    contraSubMenu: <LibraryBooks></LibraryBooks>,
    journalsSubMenu: <Gavel></Gavel>,

    optionsMenu: <Extension></Extension>,
    bankReconSubMenu: <Reorder></Reorder>,
    incomeSubMenu: <MonetizationOn></MonetizationOn>,
    genericExportsSubMenu: <SystemUpdate></SystemUpdate>,
    commonUtilitiesSubMenu: <Build></Build>,

    mastersMenu: <ListAlt></ListAlt>,
    unitInfoSubMenu: <Info></Info>,
    generalSettingsSubMenu: <Settings></Settings>,
    accountsSubMenu: <Forum></Forum>,
    accountsOpBalSubMenu: <AccountBalanceWallet></AccountBalanceWallet>,
    branchesSubMenu: <SettingsCell></SettingsCell>,
    financialYearsSubMenu: <Tune></Tune>,

    reportsMenu: <ReportSharp></ReportSharp>,
    allTransactionsSubMenu: <ViewListSharp></ViewListSharp>,

    //Sales and purchases menu
    salesPurchasesMenu: <DynamicFeed></DynamicFeed>,
    salesSubMenu: <Money></Money>,
    purchasesSubMenu: <MoneyOff></MoneyOff>,
    assignmentReturnSubMenu: <AssignmentReturn></AssignmentReturn>,
    assignmentReturnedSubMenu: <AssignmentReturned></AssignmentReturned>,
    flightLandSubMenu: <FlightLand></FlightLand>,
    flightTakeoffSubMenu: <FlightTakeoff></FlightTakeoff>,

    // Inventory menu
    inventoryMenu: <Inventory></Inventory>,
    brandsSubMenu: <AccountTree />,
    categoriesSubMenu: <Category />,
    productsSubMenu: <LibraryBooks />,

    //Admin menu
    artifacts: <CheckCircle></CheckCircle>,
    manageUsers: <Contacts></Contacts>,
    manageBu: <AcUnit></AcUnit>,
    manageRoles: <People></People>,
    associateBusinessUsersWithRolesAndBu: <Toc></Toc>,

    // Super admin menu
    manageClients: <AccountTree />,
    manageEntities: <Domain></Domain>,
    associateAdminUserWithClientAndEntity: (
        <DeveloperBoard></DeveloperBoard>
    ),

    permanentDelete: <DeleteForever></DeleteForever>,
    deleteAdminUser: <HighlightOff></HighlightOff>,
    deleteClient: <DeleteRounded></DeleteRounded>,
    deleteEntity: <DeleteTwoTone></DeleteTwoTone>,
}

export { iconMap }
