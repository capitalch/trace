import { TrialBalance } from '../final-accounts/trial-balance'
import { BalanceSheetProfitLoss } from '../final-accounts/balance-sheet-profit-loss'
import { AccountsMaster } from '../masters/accounts-master'
import { AccountsOpBal } from '../masters/accounts-opbal'
import { GenericCRUD } from '../masters/generic-crud'
import { GenericDialoges } from '../masters/generic-dialoges'
import { BankRecon } from '../options/bank-recon'
import { GenericReports } from '../reports/generic-reports/generic-reports'
import { GenericExports } from '../options/generic-exports'
import { CommonUtilities } from '../options/common-utilities'
import { Sales } from '../sales/sales'
import { CategoriesMaster } from '../inventory/categories-master'
import { BrandsMaster } from '../inventory/brands-master'
import { ProductsMaster } from '../inventory/products-master'
import { FlightLand } from '../purchases/debit-notes'
import { FlightTakeoff } from '../sales/credit-notes'
import { Purchases } from '../purchases/purchases'
import { GeneralLedger } from '../final-accounts/general-ledger'
import { Taxation } from '../reports/taxation'
import { Voucher } from '../vouchers/voucher'

const customComponents = {
    accountsMaster: AccountsMaster,
    accountsOpBal: AccountsOpBal,
    balanceSheet: BalanceSheetProfitLoss,
    bankRecon: BankRecon,
    brandsMaster: BrandsMaster,
    categoriesMaster: CategoriesMaster,
    commonUtilities: CommonUtilities,
    flightTakeoff: FlightTakeoff,
    flightLand: FlightLand,
    genericCRUD: GenericCRUD,
    genericDialoges: GenericDialoges,
    genericExports: GenericExports,
    genericReports: GenericReports,
    generalLedger: GeneralLedger,    
    productsMaster: ProductsMaster,
    profitLoss: BalanceSheetProfitLoss,
    purchases: Purchases,
    sales: Sales,
    taxation: Taxation,
    trialBalance: TrialBalance,
    vouchers: Voucher,
}
export { customComponents }