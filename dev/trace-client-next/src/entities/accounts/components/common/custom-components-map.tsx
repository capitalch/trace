import { TrialBalance } from '../final-accounts/trial-balance'
import { BalanceSheetProfitLoss } from '../final-accounts/balance-sheet-profit-loss'
import { AccountsMaster } from '../masters/accounts-master'
import { AccountsOpBal } from '../masters/accounts-opbal'
import { GenericDialoges } from '../masters/generic-dialoges'
import { BankRecon } from '../options/bank-recon'
import { GenericReports } from '../reports/reports-container'
import { GenericExports } from '../options/generic-exports'
import { CommonUtilities } from '../options/common-utilities'
import { Sales } from '../sales/sales'
import { CategoriesMaster } from '../inventory/categories-master'
import { DebitNotes } from '../debit-credit-notes/debit-notes'
import { CreditNotes } from '../debit-credit-notes/credit-notes'
import { Purchases } from '../purchases/purchases'
import { GeneralLedger } from '../final-accounts/general-ledger'
import { Taxation } from '../reports/taxation'
import { Voucher } from '../vouchers/voucher'
import { Branches } from '../masters/branches'
import { FinancialYears } from '../masters/financial-years'
import { Brands } from '../inventory/brands'
import { Products } from '../inventory/products'
import { OpeningStock } from '../inventory/opening-stock'
import { InventoryReports } from '../inventory/reports/inventory-reports'

const customComponents = {
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
    taxation: Taxation,
    trialBalance: TrialBalance,
    vouchers: Voucher,
    openingStock: OpeningStock,
    inventoryReports: InventoryReports
}
export { customComponents }
