import base64
from flask import Blueprint, request, render_template, jsonify, make_response, url_for
import pdfkit
from ariadne import ObjectType, load_schema_from_path
from postgres import execSql, execGenericUpdateMaster, genericView
import simplejson as json
import demjson as demJson
import re  # Python regex
from urllib.parse import unquote
from util import sendMail, convertToWord
from entities.authentication.sql import allSqls as authSql
from .sql import allSqls
from .artifactsHelper import trialBalanceHelper
from .artifactsHelper import (
    balanceSheetProfitLossHelper,
    accountsMasterGroupsLedgersHelper,
    accountsOpBalHelper,
)
from .artifactsHelper import (
    genericUpdateMasterDetailsHelper,
    accountsUpdateOpBalHelper,
    allCategoriesHelper,
    transferClosingBalancesHelper,
)
from .artifactsHelper import searchProductHelper
from .accounts_utils import getRoomFromCtx, traceSendSmsForBill
from app.link_client import sendToRoom, isLinkConnected
import loadConfig

DB_NAME = "trace"
entityName = "accounts"
entryDb = "traceEntry"
# this also loads mutation from mutation.graphql
type_defs = load_schema_from_path("entities/accounts")

accountsQuery = ObjectType("AccountsQuery")
accountsMutation = ObjectType("AccountsMutation")
traceApp = Blueprint(
    "traceApp", __name__, template_folder="templates", static_folder="static"
)


def getDbNameBuCodeClientIdFinYearIdBranchId(ctx):
    clientId = ctx["clientId"]
    finYearId = ctx["finYearId"]
    branchId = ctx["branchId"]
    buCode = ctx.get("buCode", None)
    if buCode is not None:
        buCode = buCode.lower()
    sqlForDbName = authSql["get_dbName"]
    dbName = execSql(
        entryDb,
        sqlForDbName,
        {"clientId": clientId, "entityName": entityName},
        isMultipleRows=False,
    )["dbName"]
    return dbName, buCode, clientId, finYearId, branchId


@traceApp.route("/trace/testpdf", methods=["GET"])
def test_pdf():
    options = {"enable-local-file-access": None}
    html = render_template(
        "bill-template1.html",
        companyInfo={
            "addr1": "",
            "addr2": "",
            "pin": "",
            "phone": "",
            "gstin": "",
            "email": "",
        },
        ref_no="xxx",
        date="21/12/2021",
        bill_memo="B",
        acc_name="",
        pin="",
        name="",
        mobile="",
        address="",
        gstin="",
        email="",
        stateCode="",
        products=[],
    )
    pdf = pdfkit.from_string(html, False, options=options)

    response = make_response(pdf)
    response.headers["Content-Type"] = "application/pdf"
    response.headers["Content-Disposition"] = "inline; filename=output.pdf"
    return (response, 200)


@traceApp.route("/trace/pdf", methods=["POST", "GET"])
def pdf():
    req = request
    x = sendMail(
        ["capitalch@gmail.com"],
        "test",
        "<b>This is a test mail</b>",
        attachment=req.data,
    )
    response = make_response("test")
    return (response, 200)


@traceApp.route("/view/<encodedPayload>", methods=["GET"])
def trace_view(encodedPayload):
    payload = base64.urlsafe_b64decode(encodedPayload).decode()
    if payload is not None:
        tokens = payload.split(",")
        if isinstance(tokens, list) and len(tokens) == 3:
            dbName = tokens[0].split(":")[1]
            buCode = tokens[1].split(":")[1]
            id = tokens[2].split(":")[1]
            sqlString = allSqls["get_pdf_sale_bill"]
            ret = execSql(
                dbName, sqlString, args={"id": id}, isMultipleRows=False, buCode=buCode
            )
            base64PdfSaleBill = ret.get("pdfSaleBill")
            pdfData = base64.b64decode(base64PdfSaleBill)
            return (
                pdfData,
                200,
                {
                    "Content-Type": "application/pdf",
                    "Content-Disposition": 'inline; filename="invoice.pdf"',
                },
            )

    response = make_response("test")
    return (response, 200)


@accountsQuery.field("accountsMasterGroupsLedgers")
def resolve_accounts_masters_groups_ledgers(parent, info):
    dbName, buCode, clientId, finYearId, branchId = (
        getDbNameBuCodeClientIdFinYearIdBranchId(info.context)
    )
    return accountsMasterGroupsLedgersHelper(dbName, buCode)


@accountsQuery.field("accountsOpBal")
def resolve_accounts_opBal(parent, info):
    dbName, buCode, clientId, finYearId, branchId = (
        getDbNameBuCodeClientIdFinYearIdBranchId(info.context)
    )
    return accountsOpBalHelper(dbName, buCode, finYearId, branchId)


@accountsMutation.field("accountsUpdateOpBal")
def resolve_accountsUpdateOpBal(parent, info, value):
    dbName, buCode, clientId, finYearId, branchId = (
        getDbNameBuCodeClientIdFinYearIdBranchId(info.context)
    )
    value = unquote(value)
    valueObject = json.loads(value)
    rows = valueObject["data"]
    accountsUpdateOpBalHelper(rows, dbName, buCode, finYearId, branchId)
    return 1


@accountsQuery.field("allCategories")
def resolve_categories(parent, info):
    dbName, buCode, clientId, finYearId, branchId = (
        getDbNameBuCodeClientIdFinYearIdBranchId(info.context)
    )
    return allCategoriesHelper(dbName, buCode)


@accountsQuery.field("balanceSheetProfitLoss")
def resolve_balance_sheet_profit_loss(parent, info, value):
    dbName, buCode, clientId, finYearId, branchId = (
        getDbNameBuCodeClientIdFinYearIdBranchId(info.context)
    )
    value = unquote(value)
    valueObject = json.loads(value)
    branchId = valueObject.get("branchId")
    return balanceSheetProfitLossHelper(dbName, buCode, finYearId, branchId)


@accountsQuery.field("configuration")
def resolve_configuration(parent, info):
    cfg = loadConfig.cfg
    env = cfg["env"]
    configuration = {
        "url": cfg[env]["url"],
        "linkServerUrl": cfg[env]["linkServerUrl"],
        "linkServerKey": cfg["linkServerKey"],
    }
    return configuration


@accountsMutation.field("sendEmail")
def do_email(parent, info, value):
    value = unquote(value)
    valueDict = json.loads(value)
    attachment = base64.b64decode(valueDict.get("data"))
    x = sendMail(
        [valueDict.get("emailAddress")],
        valueDict.get("subject", "Electronic communication"),
        valueDict.get("body", "<b>Electronic communication</b>"),
        attachment=attachment,
    )
    response = make_response("ok")
    return (response, 200)


@accountsMutation.field("sendSms")
def do_sms(parent, info, value):
    dbName, buCode, clientId, finYearId, branchId = (
        getDbNameBuCodeClientIdFinYearIdBranchId(info.context)
    )
    value = unquote(value)
    valueDict = json.loads(value)

    sqlKey = valueDict.get("sqlKey")
    id = valueDict.get("id")
    data = valueDict.get("data")
    # save pdf invoice data in table TranH against id
    execSql(
        dbName,
        sqlString=allSqls[sqlKey],
        args={"id": id, "data": f'"{data}"'},
        isMultipleRows=False,
        buCode=buCode,
    )
    ret = traceSendSmsForBill(
        {
            "mobileNumber": valueDict.get("mobileNumber"),
            "unitName": valueDict.get("unitName"),
            "id": id,
            "dbName": dbName,
            "buCode": buCode,
        }
    )
    response = make_response(str(ret))
    return (response, 200)


@accountsMutation.field("genericUpdateMaster")
def resolve_generic_update_master(parent, info, value):
    dbName, buCode, clientId, finYearId, branchId = (
        getDbNameBuCodeClientIdFinYearIdBranchId(info.context)
    )
    value = unquote(value)
    res = None
    valueDict = json.loads(value)
    tableName = valueDict.get("tableName", None)
    deletedIds = valueDict.get("deletedIds", None)
    customCodeBlock = valueDict.get("customCodeBlock")
    updateCodeBlock = valueDict.get("updateCodeBlock")
    insertCodeBlock = valueDict.get("insertCodeBlock")
    if customCodeBlock is not None:
        valueDict["customCodeBlock"] = allSqls[customCodeBlock]
    if updateCodeBlock is not None:
        valueDict["updateCodeBlock"] = allSqls[updateCodeBlock]
    if insertCodeBlock:
        valueDict["insertCodeBlock"] = allSqls[insertCodeBlock]

    ret, res = execGenericUpdateMaster(dbName, valueDict, buCode, branchId, finYearId)
    # To update the client through sockets
    room = getRoomFromCtx(info.context)
    if isLinkConnected():
        if valueDict.get("message", None):
            sendToRoom(valueDict.get("message"), res, room)
        elif (tableName == "TranH") and deletedIds:
            # Only master update, but message is MASTER-DETAILS-UPDATE-DONE, This is to take care of delete operation, which is done by calling this method, but at server when header is deleted, cascaded delete of details rows also happen
            sendToRoom("TRACE-SERVER-MASTER-DETAILS-UPDATE-DONE", res, room)
        elif tableName == "AccM":
            if deletedIds:
                # send deletedIds[0], isDeleted: True, so that client removes the id
                pass
            else:
                # Account edited or updated. Query the new account based on Id
                sendToRoom("TRACE-SERVER-ACCOUNT-ADDED-OR-UPDATED", res, room)
        elif tableName == "ProductM":
            if deletedIds:
                pass
            else:
                sendToRoom("TRACE-SERVER-PRODUCT-ADDED-OR-UPDATED", res, room)
    return ret


@accountsMutation.field("genericUpdateMasterDetails")
def resolve_generic_update_master_details(parent, info, value):
    dbName, buCode, clientId, finYearId, branchId = (
        getDbNameBuCodeClientIdFinYearIdBranchId(info.context)
    )
    room = getRoomFromCtx(info.context)

    def processData(item):
        customCodeBlock = item.get("customCodeBlock")
        updateCodeBlock = item.get("updateCodeBlock")
        if customCodeBlock is not None:
            item["customCodeBlock"] = allSqls[customCodeBlock]
        if updateCodeBlock is not None:
            item["updateCodeBlock"] = allSqls[updateCodeBlock]
        # inject finYearId and branchId
        ret, res = genericUpdateMasterDetailsHelper(
            dbName, buCode, finYearId, item, context=info.context
        )
        if isLinkConnected():
            if item.get("message", None):
                sendToRoom(item.get("message"), res, room)
            else:
                sendToRoom("TRACE-SERVER-MASTER-DETAILS-UPDATE-DONE", res, room)
        return (ret, res)

    value = unquote(value)
    valueData = json.loads(value)
    ret = None
    res = None
    if type(valueData) is list:
        for item in valueData:
            ret, res = processData(item)
    else:
        ret, res = processData(valueData)
    return ret  # returns the id of first item, if there are multiple items


@accountsQuery.field("genericView")
def resolve_generic_view(parent, info, value):
    dbName, buCode, clientId, finYearId, branchId = (
        getDbNameBuCodeClientIdFinYearIdBranchId(info.context)
    )
    value = unquote(value)
    valueDict = demJson.decode(value)
    sqlKey = valueDict["sqlKey"]
    sqlString = allSqls[sqlKey]
    if valueDict.get("args") is None:
        valueDict["args"] = {}
    valueDict["args"]["clientId"] = clientId
    if "finYearId" not in valueDict["args"]:
        valueDict["args"]["finYearId"] = finYearId
        
    if("branchId" not in valueDict["args"]):
        valueDict["args"]["branchId"] = branchId
    # valueDict["args"]["branchId"] = branchId
    valueDict["isMultipleRows"] = valueDict.get("isMultipleRows", False)
    return genericView(dbName, sqlString, valueDict, buCode)


@accountsQuery.field("saleInvoiceView")
def resolve_sale_invoice_view(parent, info, value):
    ret = resolve_generic_view(parent, info, value)
    # set amount in words in ret
    tranDList = ret["jsonResult"]["tranD"]
    saleAmount = [item["amount"] for item in tranDList if item["accClass"] == "sale"][0]
    amountInWords = convertToWord(saleAmount)
    ret["jsonResult"]["amountInWords"] = amountInWords
    return ret


@accountsQuery.field("searchProduct")
def resolve_search_product(parent, info, value):
    dbName, buCode, clientId, finYearId, branchId = (
        getDbNameBuCodeClientIdFinYearIdBranchId(info.context)
    )
    value = unquote(value)
    valueDict = demJson.decode(value)
    return searchProductHelper(dbName, buCode, valueDict)


@accountsMutation.field("transferClosingBalances")
def resolve_transfer_closing_balances(parent, info):
    dbName, buCode, clientId, finYearId, branchId = (
        getDbNameBuCodeClientIdFinYearIdBranchId(info.context)
    )
    return transferClosingBalancesHelper(dbName, buCode, finYearId, branchId)


@accountsQuery.field("trialBalance")
def resolve_trial_balance(parent, info, value):
    dbName, buCode, clientId, finYearId, branchId = (
        getDbNameBuCodeClientIdFinYearIdBranchId(info.context)
    )
    value = unquote(value)
    valueObject = json.loads(value)
    branchId = valueObject.get("branchId")
    return trialBalanceHelper(dbName, buCode, finYearId, branchId)
