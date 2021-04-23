import React, { useState, useRef, useEffect } from 'react'
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
import IconReportSharp  from '@material-ui/icons/ReportSharp'
import IconAllTransactions  from '@material-ui/icons/ViewListSharp'
import IconExports  from '@material-ui/icons/SystemUpdate'
import IconUtilities from '@material-ui/icons/Build'

const iconMap: any = {
    finalAccounts: <IconAccountBalance></IconAccountBalance>
    , trialBalance: <IconDone></IconDone>
    , balanceSheet: <IconDoneAll></IconDoneAll>
    , profitLoss: <IconDoneOutline></IconDoneOutline>

    , vouchers: <IconViewList></IconViewList>
    , payments: <IconPayment></IconPayment>
    , receipts: <IconReceipt></IconReceipt>
    , contra: <IconLibraryBooks></IconLibraryBooks>
    , journals: <IconGavel></IconGavel>
    , sales: <IconMoney></IconMoney>
    , purchases: <IconMoneyOff></IconMoneyOff>

    , options: <IconExtension></IconExtension>
    , bankRecon: <IconReorder></IconReorder>
    , genericExports: <IconExports></IconExports>
    , commonUtilities: <IconUtilities></IconUtilities>

    , masters: <IconListAlt></IconListAlt>
    , unitInfo: <IconInfo></IconInfo>
    , generalSettings: <IconGeneralSettings></IconGeneralSettings>
    , accounts: <IconForum></IconForum>
    , accountsOpBal: <IconAccountBalanceWallet></IconAccountBalanceWallet>
    , branches: <IconSettingsCell></IconSettingsCell>
    , financialYears: <IconTune></IconTune>

    , reports: <IconReportSharp></IconReportSharp>
    , allTransactions: <IconAllTransactions></IconAllTransactions>

    //Admin menu
    , artifacts: <IconCheckCircle></IconCheckCircle>
    , manageUsers: <IconContacts></IconContacts>
    , manageBu:<IconAcUnit></IconAcUnit>
    , allocateUsersToEntities: <IconToc></IconToc>

    // Super admin menu
    , manageClients: <IconAccoutTree></IconAccoutTree>
    , manageEntities: <IconDomain></IconDomain>
    , allocateEntitiesToClients: <IconDeveloperBoard></IconDeveloperBoard>
    
}

export { iconMap }