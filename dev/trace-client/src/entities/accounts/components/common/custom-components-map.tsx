import { TrialBalance } from '../main/trial-balance'
import { DataView } from './data-view'
import { BalanceSheetProfitLoss } from '../main/balance-sheet-profit-loss'
import { AccountsMaster } from '../main/accounts-master'
import {AccountsOpBal} from '../main/accounts-opbal'
import {GenericCRUD} from './generic-crud'
import {GenericDialoges} from './generic-dialoges'
import {BankRecon} from '../main/bank-recon'
import {GenericReports} from '../reports/generic-reports'
import {GenericExports} from './generic-exports'
import {GenericForms} from './generic-forms'
import {CommonUtilities} from './common-utilities'
import {Sales} from '../sales/sales'
import {CategoriesMaster} from '../inventory/categories-master'
import {BrandsMaster} from '../inventory/brands-master'
import {ProductsMaster} from '../inventory/products-master'
import {DebitNotes} from '../purchases/debit-notes'
import {CreditNotes} from '../sales/credit-notes'
import {Purchases} from '../purchases/purchases'
import {GeneralLedger} from '../main/general-ledger'
import {Taxation} from '../reports/taxation'

const customComponents = {
    accountsMaster: AccountsMaster,
    accountsOpBal: AccountsOpBal,
    balanceSheet: BalanceSheetProfitLoss,
    bankRecon: BankRecon,
    brandsMaster: BrandsMaster,
    categoriesMaster: CategoriesMaster,
    commonUtilities: CommonUtilities,
    creditNotes: CreditNotes,
    dataView: DataView,
    debitNotes: DebitNotes,
    genericCRUD: GenericCRUD,
    genericDialoges: GenericDialoges,
    genericExports: GenericExports,
    genericForms: GenericForms,
    genericReports: GenericReports,
    generalLedger: GeneralLedger,
    productsMaster: ProductsMaster,
    profitLoss: BalanceSheetProfitLoss,
    purchases: Purchases,
    sales: Sales,
    taxation: Taxation,
    trialBalance: TrialBalance,
}
export { customComponents }