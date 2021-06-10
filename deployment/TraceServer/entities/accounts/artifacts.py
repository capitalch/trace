from ariadne import QueryType, graphql_sync, make_executable_schema, gql, ObjectType, load_schema_from_path
from postgres import getPool, execSql, execGenericUpdateMaster,  genericView
from .sql import allSqls
from entities.authentication.sql import allSqls as authSql
import pandas as pd
import simplejson as json
import demjson as demJson
import re  # Python regex
from time import sleep
from urllib.parse import unquote
from util import getErrorMessage
# ,  tranHeadersWithDetails_helper
from .artifactsHelper import trialBalanceHelper
# tranHeaderAndDetails_helper,
from .artifactsHelper import balanceSheetProfitLossHelper, accountsMasterGroupsLedgersHelper, accountsOpBalHelper
from .artifactsHelper import genericUpdateMasterDetailsHelper, accountsUpdateOpBalHelper, allCategoriesHelper, transferClosingBalancesHelper
from .artifactsHelper import searchProductHelper
import util
# from app import socketio

DB_NAME = 'trace'
entityName = 'accounts'
entryDb = 'traceEntry'
# this also loads mutation from mutation.graphql
type_defs = load_schema_from_path('entities/accounts')

accountsQuery = ObjectType("AccountsQuery")
accountsMutation = ObjectType("AccountsMutation")


def getDbNameBuCodeClientIdFinYearIdBranchId(ctx):
    # ctx = info.context
    clientId = ctx['clientId']
    finYearId = ctx['finYearId']
    branchId = ctx['branchId']
    buCode = ctx.get('buCode', None)
    if buCode is not None:
        buCode = buCode.lower()
    sqlForDbName = authSql['get_dbName']
    dbName = execSql(entryDb, sqlForDbName, {
                     'clientId': clientId, 'entityName': entityName}, isMultipleRows=False)['dbName']
    return dbName, buCode, clientId, finYearId, branchId


@accountsQuery.field("accountsMasterGroupsLedgers")
def resolve_accounts_masters_groups_ledgers(parent, info):
    dbName, buCode, clientId, finYearId, branchId = getDbNameBuCodeClientIdFinYearIdBranchId(
        info.context)
    return accountsMasterGroupsLedgersHelper(dbName, buCode)


@accountsQuery.field("accountsOpBal")
def resolve_accounts_opBal(parent, info):
    dbName, buCode, clientId, finYearId, branchId = getDbNameBuCodeClientIdFinYearIdBranchId(
        info.context)
    return accountsOpBalHelper(dbName, buCode, finYearId, branchId)


@accountsMutation.field("accountsUpdateOpBal")
def resolve_accountsUpdateOpBal(parent, info, value):
    dbName, buCode, clientId, finYearId, branchId = getDbNameBuCodeClientIdFinYearIdBranchId(
        info.context)
    value = unquote(value)
    valueObject = json.loads(value)
    rows = valueObject['data']
    accountsUpdateOpBalHelper(rows, dbName, buCode, finYearId, branchId)
    return 1


@accountsQuery.field("allCategories")
def resolve_categories(parent, info):
    dbName, buCode, clientId, finYearId, branchId = getDbNameBuCodeClientIdFinYearIdBranchId(
        info.context)
    return allCategoriesHelper(dbName, buCode)


@accountsQuery.field("balanceSheetProfitLoss")
def resolve_balance_sheet_profit_loss(parent, info):
    dbName, buCode, clientId, finYearId, branchId = getDbNameBuCodeClientIdFinYearIdBranchId(
        info.context)
    return balanceSheetProfitLossHelper(dbName, buCode, finYearId, branchId)


@accountsMutation.field("genericUpdateMaster")
def resolve_generic_update_master(parent, info, value):
    dbName, buCode, clientId, finYearId, branchId = getDbNameBuCodeClientIdFinYearIdBranchId(
        info.context)
    value = unquote(value)
    valueDict = json.loads(value)
    customCodeBlock = valueDict.get('customCodeBlock')
    updateCodeBlock = valueDict.get('updateCodeBlock')
    if customCodeBlock is not None:
        valueDict['customCodeBlock'] = allSqls[customCodeBlock]
    if updateCodeBlock is not None:
        valueDict['updateCodeBlock'] = allSqls[updateCodeBlock]

    id = execGenericUpdateMaster(dbName, valueDict, buCode)
    return id


@accountsMutation.field("genericUpdateMasterDetails")
def resolve_generic_update_master_details(parent, info, value):
    dbName, buCode, clientId, finYearId, branchId = getDbNameBuCodeClientIdFinYearIdBranchId(
        info.context)

    def processData(item):
        customCodeBlock = item.get('customCodeBlock')
        updateCodeBlock = item.get('updateCodeBlock')
        if customCodeBlock is not None:
            item['customCodeBlock'] = allSqls[customCodeBlock]
        if updateCodeBlock is not None:
            item['updateCodeBlock'] = allSqls[updateCodeBlock]
        # inject finYearId and branchId
        autoRefNo = genericUpdateMasterDetailsHelper(dbName, buCode, item)

    value = unquote(value)
    valueData = json.loads(value)
    if type(valueData) is list:
        for item in valueData:
            processData(item)
    else:
        processData(valueData)
    from app.socket import voucherUpdatedSocket
    voucherUpdatedSocket(info.context)
    return True


@accountsQuery.field("genericView")
def resolve_generic_view(parent, info, value):
    dbName, buCode, clientId, finYearId, branchId = getDbNameBuCodeClientIdFinYearIdBranchId(
        info.context)
    value = unquote(value)
    valueDict = demJson.decode(value)
    sqlKey = valueDict['sqlKey']
    sqlString = allSqls[sqlKey]
    valueDict['args']['clientId'] = clientId
    if 'finYearId' not in valueDict['args']:
        valueDict['args']['finYearId'] = finYearId
    valueDict['args']['branchId'] = branchId
    valueDict['isMultipleRows'] = valueDict.get('isMultipleRows', False)
    return genericView(dbName, sqlString, valueDict, buCode)


@accountsQuery.field("searchProduct")
def resolve_search_product(parent, info, value):
    dbName, buCode, clientId, finYearId, branchId = getDbNameBuCodeClientIdFinYearIdBranchId(
        info.context)
    value = unquote(value)
    valueDict = demJson.decode(value)
    return searchProductHelper(dbName, buCode, valueDict)


@accountsMutation.field('transferClosingBalances')
def resolve_transfer_closing_balances(parent, info):
    dbName, buCode, clientId, finYearId, branchId = getDbNameBuCodeClientIdFinYearIdBranchId(
        info.context)
    return transferClosingBalancesHelper(dbName, buCode, finYearId, branchId)


@accountsQuery.field('trialBalance')
def resolve_trial_balance(parent, info):
    dbName, buCode, clientId, finYearId, branchId = getDbNameBuCodeClientIdFinYearIdBranchId(
        info.context)
    return trialBalanceHelper(dbName, buCode, finYearId, branchId)


# @accountsMutation.field("delete_account")
# def resolve_delete_account(parent, info, id):
#     sqlString = allSqls['delete_account']
#     return execSql(DB_NAME, sqlString, (id,), False)


# @accountsQuery.field("tranHeadersWithDetails")
# def resolve_tranHeadersWithDetails(parent, info, tranTypeId, noOfRecords):
#     return tranHeadersWithDetails_helper(tranTypeId, noOfRecords)


# @accountsQuery.field("tranHeaderAndDetails")
# def resolve_tranHeaderAndDetails(parent, info, id):
#     return tranHeaderAndDetails_helper(id)

# @accountsMutation.field("delete_header")
# def resolve_delete_tranH(parent, info, id):
#     sqlString = allSqls['delete_tranH']
#     return execSql(DB_NAME, sqlString, (id,), False)


# @accountsQuery.field("accountsViewOpBal")
# def resolve_accountsViewOpBal(parent, info):
#     sqlString = allSqls['accountsViewOpBal']
#     return execSql(DB_NAME, sqlString)

# customCodeBlock = valueData.get('customCodeBlock')
    # updateCodeBlock = valueData.get('updateCodeBlock')
    # if customCodeBlock is not None:
    #     valueDict['customCodeBlock'] = allSqls[customCodeBlock]
    # if updateCodeBlock is not None:
    #     valueDict['updateCodeBlock'] = allSqls[updateCodeBlock]
    # autoRefNo = genericUpdateMasterDetailsHelper(dbName, buCode, valueData)
    # return autoRefNo
