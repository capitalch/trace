import pandas as pd
import psycopg2
from psycopg2.extras import RealDictCursor
import numpy as np
import simplejson as json
from decimal import Decimal
from nested_lookup import nested_lookup
from dateutil.parser import parse
from .sql import allSqls
from postgres import execSql, execSqlWithCursor, execSqls, getPool
from postgresHelper import execSqlObject
from util import getErrorMessage, getschemaSearchPath
from app.link_client import connectToLinkServer, disconnectFromLinkServer, sendToPoint
from .accounts_utils import getRoomFromCtx
from app.link_client import sendToRoom, isLinkConnected

# from app import socketio, store


def formatTree(rawData):
    # formats in form of tree consumable by react.js
    def getNodeDict(tData):
        nodeDict = {}
        for item in tData:
            data = {}
            for ite in item:
                data[ite] = item[ite]
            data.pop('children')  # remove children from data
            nodeDict[item['id']] = {
                'key': item['id'],
                'data': data,
                'children': item['children'] if 'children' in item else None
            }
        return nodeDict

    # recursively replaces children with corresponding child objects from nodeDict
    def processChildren(obj):
        if obj['children']:
            temp = []
            for child in obj['children']:
                processChildren(nodeDict[child])
                temp.append(nodeDict[child])
            obj['children'] = temp

    nodeDict = getNodeDict(rawData)
    tempRoots = filter(lambda x: x['parentId'] is None, rawData)
    ret = []
    for it in tempRoots:
        the = nodeDict[it['id']]
        processChildren(the)
        ret.append(the)
    return ret


def accountsMasterGroupsLedgersHelper(dbName, buCode):
    sqlString = allSqls['getJson_accountsMaster_groups_ledgers']
    allKeys = []
    jsonResult = execSql(dbName, isMultipleRows=False,
                         sqlString=sqlString, buCode=buCode)['jsonResult']
    for item in jsonResult['accountsMaster']:
        allKeys.append(item['id'])
    jsonResult['accountsMaster'] = [] if jsonResult['accountsMaster'] is None else formatTree(
        jsonResult['accountsMaster'])
    jsonResult['allKeys'] = allKeys
    return jsonResult


def accountsOpBalHelper(dbName, buCode, finYearId, branchId):
    sqlString = allSqls['get_opBal']
    result = execSql(dbName, isMultipleRows=True, args={
                     'finYearId': finYearId, 'branchId': branchId}, sqlString=sqlString, buCode=buCode)
    allKeys = []
    for item in result:
        allKeys.append(item['id'])
    res = [] if result is None else formatTree(result)
    return {'opBal': res, 'allKeys': allKeys}


def accountsUpdateOpBalHelper(rows, dbName, buCode, finYearId, branchId):
    sqlTupleListWithArgs = []
    for i, row in enumerate(rows):
        debit = Decimal(row['debit'])
        credit = Decimal(row['credit'])
        if debit > 0:
            dc = 'D'
            amount = debit
        else:
            dc = 'C'
            amount = credit

        if row['opId'] is None:
            sql = allSqls['insert_opBal']
            args = {
                'accId': row['accMId'], 'finYearId': finYearId, 'branchId': branchId, 'amount': amount, 'dc': dc
            }
            tup = (i, sql, args)
            sqlTupleListWithArgs.append(tup)
        else:
            sql = allSqls['update_opBal']
            args = {
                'id': row['opId'], 'amount': amount, 'dc': dc
            }
            tup = (i, sql, args)
            sqlTupleListWithArgs.append(tup)

    execSqls(dbName, sqlTupleListWithArgs, buCode)


def allCategoriesHelper(dbName, buCode):
    sqlString = allSqls['getJson_categories']
    allKeys = []
    jsonResult = execSql(dbName, isMultipleRows=False,
                         sqlString=sqlString, buCode=buCode)['jsonResult']

    if(jsonResult['categories']):
        for item in jsonResult['categories']:
            allKeys.append(item['id'])

    jsonResult['categories'] = [] if jsonResult['categories'] is None else formatTree(
        jsonResult['categories'])

    jsonResult['allKeys'] = allKeys
    return jsonResult


def balanceSheetProfitLossHelper(dbName, buCode, finYearId, branchId):
    sqlString = allSqls['get_balanceSheetProfitLoss']
    allKeys = []
    jsonResult = execSql(dbName, sqlString, args={
                         'finYearId': finYearId, 'branchId': branchId}, isMultipleRows=False, buCode=buCode)['jsonResult']

    if(jsonResult['balanceSheetProfitLoss'] is not None):
        for item in jsonResult['balanceSheetProfitLoss']:
            allKeys.append(item['id'])
        jsonResult['balanceSheetProfitLoss'] = formatTree(
            jsonResult['balanceSheetProfitLoss'])
        jsonResult['allKeys'] = allKeys
    return jsonResult


def doDebitsEqualCredits(sqlObject):
    ret = False
    # get all instances of data in the nested object
    dat = nested_lookup('data', sqlObject)

    def checkList(tranList):
        allDebits = 0.00
        allCredits = 0.00
        for row in tranList:
            if row['dc'] == 'C':
                allCredits = allCredits + float(row['amount'])
            else:
                allDebits = allDebits + float(row['amount'])
        return(allDebits == allCredits)

    # dat[1] contains list of all transactions, with dc = 'D' or dc = 'C'
    if type(dat) is list:
        if len(dat) > 0:
            tranList = dat[1]
            ret = checkList(tranList)
    return(ret)


def getSetAutoRefNo(sqlObject, cursor, no, buCode):
    try:
        searchPath = getschemaSearchPath(buCode)
        lastNoSql = allSqls["getSet_lastVoucherNo"]
        # converted to string because the sql function args are smallint type. String type property converts to smallint
        tup = (str(sqlObject["data"][0]["branchId"]), str(
            sqlObject["data"][0]["tranTypeId"]), str(sqlObject["data"][0]["finYearId"]), no)
        cursor.execute(f'{searchPath}; {lastNoSql}', tup)
        ret = cursor.fetchone()
        branchCode, tranTypeCode, finYear, lastNo = ret[0].split(',')
        lastNo = int(lastNo)
        if no == 0:
            lastNo = lastNo + 1
        autoRefNo = f'{branchCode}\{tranTypeCode}\{lastNo}\{finYear}'
        return (autoRefNo, lastNo)
    except (Exception) as error:
        raise Exception(getErrorMessage())

# For autoSubledger, create a new account code as Subledger of main account code
# Make use of last no for autoSubledgerCounter table while creating the account code


def processForAutoSubledger(dbName='', branchId=None, branchCode=None,  buCode='', finYearId=None, cursor=None, valueDict={}):
    # find accId
    accId = None
    detailsData = None
    tranDate=None
    contactsId = None
    autoRefNo = None
    tranH = valueDict.get('data', None)
    if(tranH):
        tranDate = tranH[0].get('tranDate', None)
        contactsId= tranH[0].get('contactsId', None)
        autoRefNo=tranH[0].get('autoRefNo', None)
        tranDetails = tranH[0].get('details', None)
        if(tranDetails):
            detailsData = tranDetails.get('data', None)
            accId = detailsData[1].get('accId', None)
    # get contactName
    sqlString = allSqls['get_contact_name']
    ret = execSql(dbName, sqlString, {'contactsId': contactsId}, isMultipleRows=False, buCode=buCode)
    result = dict(ret)
    nameWithMobile = f"{result['contactName']}:{result['mobileNumber']}"
    sqlString = allSqls['get_lastNo_auto_subledger']
    ret = execSql(dbName, sqlString, {'branchId': branchId, 'accId': accId,
                                      'finYearId': finYearId}, isMultipleRows=False, buCode=buCode)
    result = dict(ret)
    lastNo = result.get('lastNo', None)
    classId = result.get('classId', None)
    accClass = result.get('accClass', None)
    accType = result.get('accType', None)
    # get accType and classId of accId
    # Insert into AccM the new account code and get the new accId
    # replace in valueDict the new accId
    if(lastNo == 0):
        lastNo = 1
    accCode = f'{accId}/{branchCode}/{lastNo}/{finYearId}'
    accName = f'{tranDate} {autoRefNo}: {accId}/{branchCode}/{lastNo} {nameWithMobile}'
    # searchPathSql = getschemaSearchPath(buCode)
    sqlString = allSqls['insert_account']
    args = {
        "accCode": accCode,
        "accName": accName,
        "accType": accType,
        "parentId": accId,
        "accLeaf": 'S',
        "isPrimary": False,
        "classId": classId
    }
    out = execSqlWithCursor(cursor, sqlString, args=args,
                            isMultipleRows=False, buCode=buCode)
    # cursor.execute(f'{searchPathSql};{sqlString}', args)
    # out = cursor.fetchone()
    childAccId = out[0]  # extract accId
    detailsData[1]['accId'] = childAccId
    valueDict['data'][0]['remarks'] = f'Auto subledger {accCode}'
    childAccObj = args.copy()
    childAccObj['accId'] = childAccId
    childAccObj['accClass'] = accClass
    return(lastNo, childAccObj)

def getAccIdsAsTuple(valueDict):
        out = []
        def process1(item):
            accId = item.get('accId', None)
            details = item.get('details', None)
            if(accId):
                out.append(accId)
            elif(details):
                if(isinstance(details,list)):
                    for itt in details:
                        process(itt)
                else:
                    process(details)

        def process(item):
            data = item.get('data', None)
            if(data):
                if(isinstance(data, list)):
                    for it in data:
                        process1(it)
                else:
                    process1(data)

        # for item in valueDict:
        process(valueDict)
        return(tuple(out))

def genericUpdateMasterDetailsHelper(dbName, buCode, finYearId, valueDict, context = None):
    connection = None
    try:
        accIdsTuple = getAccIdsAsTuple(valueDict)
        pool = getPool(dbName)
        connection = pool.getconn()
        cursor = connection.cursor()
        autoRefNo = ''
        childAccObj = None
        branchId = valueDict["data"][0]["branchId"]
        tranTypeId = valueDict["data"][0]["tranTypeId"]
        finYearId = valueDict["data"][0]["finYearId"]
        # calculate autoRefNo only if id field is not there, insert operation
        if not 'id' in valueDict["data"][0]:            
            sqlString = allSqls['getJson_branchCode_tranCode']
            res = execSql(dbName, sqlString, {'branchId': branchId, 'tranTypeId': tranTypeId},
                          isMultipleRows=False, buCode=buCode)
            tranCode = res['jsonResult']['tranCode']
            branchCode = res['jsonResult']['branchCode']
            sqlString = allSqls['get_lastNo']
            lastNo = execSql(dbName, sqlString, {'branchId': branchId, 'tranTypeId': tranTypeId,
                                                 'finYearId': finYearId}, isMultipleRows=False, buCode=buCode)['lastNo']
            if lastNo == 0:
                lastNo = 1
            autoRefNo = f'{branchCode}/{tranCode}/{lastNo}/{finYearId}'
            valueDict["data"][0]["autoRefNo"] = autoRefNo

            # for sale with autosubledger insert transaction
            autoSubledgerLastNo = 0
            if((tranTypeId == 4) and valueDict.get('isAutoSubledger', None)):
                autoSubledgerLastNo, childAccObj = processForAutoSubledger(
                    dbName=dbName, branchId=branchId, branchCode=branchCode, buCode=buCode, finYearId=finYearId, cursor=cursor, valueDict=valueDict,)

        ret = execSqlObject(valueDict, cursor, buCode=buCode)
        sqlString = allSqls['update_last_no']
        if not 'id' in valueDict["data"][0]:  # for insert mode only
            execSqlWithCursor(cursor, sqlString, {'lastNo': lastNo + 1, 'branchId': branchId,
                                                  'tranTypeId': tranTypeId, 'finYearId': finYearId}, isMultipleRows=False, buCode=buCode)
            # also set the last no in autoSubledgerCounter table
            if((tranTypeId == 4) and valueDict.get('isAutoSubledger', None)):
                sqlString = allSqls['update_last_no_auto_subledger']
                args = {'lastNo': autoSubledgerLastNo + 1,
                        'branchId': branchId, 'accId': childAccObj['parentId'], 'finYearId': finYearId}
                execSqlWithCursor(cursor, sqlString, args=args,
                                  isMultipleRows=False, buCode=buCode)
        #####
        res=None
        if(len(accIdsTuple) > 0):
            res = execSqlWithCursor(cursor=cursor,sqlString=allSqls['get_accountsBalances'], args = {'branchId':branchId, 'finYearId':finYearId, 'accIds': accIdsTuple}, buCode = buCode)
            res = dict(res)
            for k,v in res.items():
                res[k] = str(v)
       
        connection.commit()
        #####
        # in case of autoSubledger a new account code is created. That is being sent to all connected clients through socket connection
        room = getRoomFromCtx(context)
        if(context and childAccObj):            
            if isLinkConnected():
                sendToRoom('TRACE-SERVER-NEW-SUBLEDGER-ACCOUNT-CREATED', childAccObj, room)                
        if(tranTypeId == 4): #sales
            sendToRoom('TRACE-SERVER-SALES-ADDED-OR-UPDATED', None, room)
        return ret, res
    except (Exception, psycopg2.Error) as error:
        print("Error with PostgreSQL", error)
        if connection:
            connection.rollback()
        raise Exception(getErrorMessage('generic', error))
    finally:
        if connection:
            cursor.close()
            connection.close()


def bulkGenericUpdateMasterDetailsHelper(dbName, buCode, valueDictList, pointId=None):
    try:
        connection = None
        pool = getPool(dbName)
        connection = pool.getconn()
        cursor = connection.cursor()
        autoRefNo = ''

        if(len(valueDictList) == 0):
            sendToPoint('COMPLETED', None, pointId)
            raise Exception('Empty list for export')

        branchId = valueDictList[0]["data"][0]["branchId"]
        tranTypeId = valueDictList[0]["data"][0]["tranTypeId"]
        finYearId = valueDictList[0]["data"][0]["finYearId"]
        searchPathSql = getschemaSearchPath(buCode)
        cursor.execute(searchPathSql)
        cursor.execute(allSqls['insert_last_no'], {
            'branchId': branchId,
            'tranTypeId': tranTypeId,
            'finYearId': finYearId})

        count = 0

        for valueDict in valueDictList:
            userRefNo = valueDict["data"][0]["userRefNo"]
            cursor.execute(allSqls['is_exist_user_ref_no'], {
                'branchId': branchId,
                'tranTypeId': tranTypeId,
                'finYearId': finYearId,
                'userRefNo': str(userRefNo)
            })
            result = cursor.fetchone()

            # userRefNo already is not there
            if((result is None) or (result[0] != 1)):
                cursor.execute(allSqls['get_auto_ref_no'], {
                    'branchId': branchId,
                    'tranTypeId': tranTypeId,
                    'finYearId': finYearId})
                result = cursor.fetchone()

                autoRefNo = result[0]
                lastNo = result[1]
                valueDict["data"][0]["autoRefNo"] = autoRefNo

                execSqlObject(valueDict, cursor, buCode=buCode)

                sqlString = allSqls['update_last_no']
                cursor.execute(sqlString, {'lastNo': lastNo + 1, 'branchId': branchId,
                                           'tranTypeId': tranTypeId, 'finYearId': finYearId})
            count = count+1
            sendToPoint('SC-NOTIFY-ROWS-PROCESSED', count, pointId)

        sendToPoint('COMPLETED', count, pointId)
        connection.commit()
    except (Exception, psycopg2.Error) as error:
        print("Error with PostgreSQL", error)
        if connection:
            connection.rollback()
        raise Exception(getErrorMessage('generic', error))
    finally:
        if connection:
            cursor.close()
            connection.close()
        # disconnectFromLinkServer()


def searchProductHelper(dbName, buCode, valueDict):
    def createSql():
        template = allSqls['get_search_product']
        argDict = {}
        some = ''
        for index, item in enumerate(valueDict):
            some = some + f" '%%' || '{item}' || '%%' ,"

        some = some.rstrip(",")
        sqlString = template.replace('someArgs', some)
        return sqlString

    sqlString = createSql()
    result = execSql(dbName, sqlString, isMultipleRows=True, buCode=buCode)
    return result


def transferClosingBalancesHelper(dbName, buCode, finYearId, branchId):
    nextFinYearId = int(finYearId) + 1
    args = {
        'finYearId': finYearId, 'branchId': branchId, 'nextFinYearId': nextFinYearId
    }
    sqlString = allSqls['transfer_closingBalances']
    execSql(dbName, sqlString, args=args, isMultipleRows=False, buCode=buCode)
    return True


def trialBalanceHelper(dbName, buCode, finYearId, branchId):
    if (finYearId is None) or (branchId is None):
        return {'trialBal': [], 'allKeys': []}
    sqlString = allSqls['get_trialBalance']
    allKeys = []
    data = execSql(dbName, sqlString, args={
                   'finYearId': finYearId, 'branchId': branchId}, isMultipleRows=True, buCode=buCode)
    for item in data:
        allKeys.append(item['id'])
    dt = formatTree(data)
    return {'trialBal': dt, 'allKeys': allKeys}
