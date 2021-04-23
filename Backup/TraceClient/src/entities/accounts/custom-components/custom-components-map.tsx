import { TrialBalance } from './trial-balance'
import { DataView } from './data-view'
import { BalanceSheetProfitLoss } from './balance-sheet-profit-loss'
import { AccountsMaster } from './accounts-master'
import {AccountsOpBal} from './accounts-opbal'
import {GenericCRUD} from './generic-crud'
import {GenericDialoges} from './generic-dialoges'
import {BankRecon} from './bank-recon'
import {GenericReports} from './generic-reports'
import {GenericExports} from './generic-exports'
import {CommonUtilities} from './common-utilities'
const customComponents = {
    trialBalance: TrialBalance
    , dataView: DataView
    , balanceSheet: BalanceSheetProfitLoss
    , profitLoss: BalanceSheetProfitLoss
    , accountsMaster: AccountsMaster
    , accountsOpBal: AccountsOpBal
    , genericCRUD: GenericCRUD
    , genericDialoges: GenericDialoges
    , bankRecon: BankRecon
    , genericReports: GenericReports
    , genericExports: GenericExports
    , commonUtilities: CommonUtilities
}
export { customComponents }