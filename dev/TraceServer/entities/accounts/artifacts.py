from os import name
import base64
from flask import Blueprint, request, render_template, jsonify, make_response, url_for
import pdfkit
# import sass
from ariadne import QueryType, graphql_sync, make_executable_schema, gql, ObjectType, load_schema_from_path
from postgres import getPool, execSql, execGenericUpdateMaster,  genericView
import pandas as pd
import simplejson as json
import demjson as demJson
import re  # Python regex
from time import sleep
from urllib.parse import unquote
from util import getErrorMessage, sendMail, convertToWord
from entities.authentication.sql import allSqls as authSql
from .sql import allSqls
from .artifactsHelper import trialBalanceHelper
# tranHeaderAndDetails_helper,
from .artifactsHelper import balanceSheetProfitLossHelper, accountsMasterGroupsLedgersHelper, accountsOpBalHelper
from .artifactsHelper import genericUpdateMasterDetailsHelper, accountsUpdateOpBalHelper, allCategoriesHelper, transferClosingBalancesHelper
from .artifactsHelper import searchProductHelper
from .accounts_utils import getRoomFromCtx
from app.link_client import sendToRoom, isLinkConnected
import loadConfig
# from app import socketio

DB_NAME = 'trace'
entityName = 'accounts'
entryDb = 'traceEntry'
# this also loads mutation from mutation.graphql
type_defs = load_schema_from_path('entities/accounts')

accountsQuery = ObjectType("AccountsQuery")
accountsMutation = ObjectType("AccountsMutation")
# sass.compile(dirname=('entities/accounts/templates/scss',
#              'entities/accounts/static'))
traceApp = Blueprint('traceApp', __name__,
                     template_folder='templates', static_folder='static') # , url_prefix='/traceApp' )


def getDbNameBuCodeClientIdFinYearIdBranchId(ctx):
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


@traceApp.route('/trace/testpdf', methods=['GET'])
def test_pdf():
    options = {
        "enable-local-file-access": None
    }
    html = render_template('bill-template1.html', 
    companyInfo={'addr1':'', 'addr2':'', 'pin':'', 'phone':'', 'gstin':'', 'email':''}, ref_no='xxx', date='21/12/2021', bill_memo='B', acc_name='', pin='', name='', mobile='', address='', gstin='', email='',stateCode='', products=[])
    pdf = pdfkit.from_string(html, False, options=options)

    response = make_response(pdf)
    response.headers["Content-Type"] = "application/pdf"
    response.headers["Content-Disposition"] = "inline; filename=output.pdf"
    return(response, 200)

@traceApp.route('/trace/pdf', methods=['POST','GET'])
def pdf():
    req = request
    x = sendMail(['capitalch@gmail.com'], 'test','<b>This is a test mail</b>',attachment=req.data)
    response = make_response('test')
    return(response, 200)

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


@accountsQuery.field("configuration")
def resolve_configuration(parent, info):
    cfg = loadConfig.cfg
    env = cfg['env']
    configuration = {'url': cfg[env]['url'],
                     'linkServerUrl': cfg[env]['linkServerUrl'],
                     'linkServerKey': cfg['linkServerKey']
                     }
    return(configuration)


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

    # To update the client through sockets
    room = getRoomFromCtx(info.context)
    if isLinkConnected():
        sendToRoom('TRACE-SERVER-MASTER-DETAILS-UPDATE-DONE', None, room)

    id = execGenericUpdateMaster(dbName, valueDict, buCode)
    return id

@accountsMutation.field("sendEmail")
def do_email(parent, info, value):
    value = unquote(value)
    valueDict = json.loads(value)
    sample = 'JVBERi0xLjMKJf////8KOCAwIG9iago8PAovVHlwZSAvRXh0R1N0YXRlCi9jYSAxCj4+CmVuZG9iago3IDAgb2JqCjw8Ci9UeXBlIC9QYWdlCi9QYXJlbnQgMSAwIFIKL01lZGlhQm94IFswIDAgNTk1LjI4MDAyOSA4NDEuODkwMDE1XQovQ29udGVudHMgNSAwIFIKL1Jlc291cmNlcyA2IDAgUgo+PgplbmRvYmoKNiAwIG9iago8PAovUHJvY1NldCBbL1BERiAvVGV4dCAvSW1hZ2VCIC9JbWFnZUMgL0ltYWdlSV0KL0V4dEdTdGF0ZSA8PAovR3MxIDggMCBSCj4+Ci9Gb250IDw8Ci9GMSA5IDAgUgo+Pgo+PgplbmRvYmoKMTEgMCBvYmoKKHJlYWN0LXBkZikKZW5kb2JqCjEyIDAgb2JqCihyZWFjdC1wZGYpCmVuZG9iagoxMyAwIG9iagooRDoyMDIyMDEwODE4MjU0MlopCmVuZG9iagoxMCAwIG9iago8PAovUHJvZHVjZXIgMTEgMCBSCi9DcmVhdG9yIDEyIDAgUgovQ3JlYXRpb25EYXRlIDEzIDAgUgo+PgplbmRvYmoKOSAwIG9iago8PAovVHlwZSAvRm9udAovQmFzZUZvbnQgL0hlbHZldGljYQovU3VidHlwZSAvVHlwZTEKL0VuY29kaW5nIC9XaW5BbnNpRW5jb2RpbmcKPj4KZW5kb2JqCjMgMCBvYmoKPDwKL1R5cGUgL0NhdGFsb2cKL1BhZ2VzIDEgMCBSCi9OYW1lcyAyIDAgUgovVmlld2VyUHJlZmVyZW5jZXMgNCAwIFIKPj4KZW5kb2JqCjEgMCBvYmoKPDwKL1R5cGUgL1BhZ2VzCi9Db3VudCAxCi9LaWRzIFs3IDAgUl0KPj4KZW5kb2JqCjIgMCBvYmoKPDwKL0Rlc3RzIDw8CiAgL05hbWVzIFsKXQo+Pgo+PgplbmRvYmoKNCAwIG9iago8PAovRGlzcGxheURvY1RpdGxlIHRydWUKPj4KZW5kb2JqCjUgMCBvYmoKPDwKL0xlbmd0aCAyODU1Ci9GaWx0ZXIgL0ZsYXRlRGVjb2RlCj4+CnN0cmVhbQp4nO1c2Y4ctxV976/oHxDNfQGEebCTGMhDAEUD5MHwg6amOzYwY0AQkPx+ziXZtZK19Giq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'
    # x = sendMail(['capitalch@gmail.com'], 'test','<b>This is a test mail</b>',attachment=value)
    attachment = base64.b64decode(valueDict.get('data'))
    x = sendMail(['capitalch@gmail.com'], 'PDF invoice','<b>This is a test mail</b>',attachment=attachment)
    response = make_response('test')
    return(response, 200)

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
        ret = genericUpdateMasterDetailsHelper(dbName, buCode, item)
        return(ret)
        # print(autoRefNo)

    value = unquote(value)
    valueData = json.loads(value)
    ret = None
    if type(valueData) is list:
        for item in valueData:
            ret = processData(item)
    else:
        ret = processData(valueData)
    room = getRoomFromCtx(info.context)
    if isLinkConnected():
        sendToRoom('TRACE-SERVER-MASTER-DETAILS-UPDATE-DONE', None, room)
    return ret # returns the id of first item, if there are multiple items


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

@accountsQuery.field("saleInvoiceView")
def resolve_sale_invoice_view(parent, info, value):
    ret = resolve_generic_view(parent, info, value)
    # set amount in words in ret
    tranDList = ret['jsonResult']["tranD"]
    saleAmount = [item["amount"] for item in tranDList if item['accClass'] == 'sale'][0]
    amountInWords = convertToWord(saleAmount)
    ret['jsonResult']["amountInWords"] = amountInWords
    return(ret)

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
