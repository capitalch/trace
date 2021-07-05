import pandas as pd
import psycopg2
from psycopg2.extras import RealDictCursor
import numpy as np
import simplejson as json
from decimal import Decimal
from nested_lookup import nested_lookup
from dateutil.parser import parse
from .sql import allSqls
from postgres import execSql, execSqls, getPool
from postgresHelper import execSqlObject
from util import getErrorMessage, getschemaSearchPath
from app.link_client import connectToLinkServer, disconnectFromLinkServer, sendToPoint
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


def genericUpdateMasterDetailsHelper(dbName, buCode, valueDict):
    connection = None
    try:
        connection = None
        pool = getPool(dbName)
        connection = pool.getconn()
        cursor = connection.cursor()
        autoRefNo = ''
        # calculate autoRefNo only if id field is not there, insert operation
        if not 'id' in valueDict["data"][0]:
            branchId = valueDict["data"][0]["branchId"]
            tranTypeId = valueDict["data"][0]["tranTypeId"]
            finYearId = valueDict["data"][0]["finYearId"]
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
            autoRefNo = f'{branchCode}\{tranCode}\{lastNo}\{finYearId}'
            valueDict["data"][0]["autoRefNo"] = autoRefNo

        execSqlObject(valueDict, cursor, buCode=buCode)
        sqlString = allSqls['update_last_no']
        if not 'id' in valueDict["data"][0]:  # insert mode only
            execSql(dbName, sqlString, {'lastNo': lastNo + 1, 'branchId': branchId,
                                        'tranTypeId': tranTypeId, 'finYearId': finYearId}, isMultipleRows=False, buCode=buCode)
        connection.commit()
        return autoRefNo
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

        sendToPoint('COMPLETED', None, pointId)
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

# def searchProductHelper1(dbName, buCode, valueDict):
#     def createSql():
#         template = allSqls['get_searchProduct']
#         argDict = {}
#         temp = ''
#         for index, item in enumerate(valueDict):  # valueDict is a list
#             sqlX = template.replace('arg', f'arg{str(index)}')
#             temp = f'{temp} union {sqlX}'
#             argDict['arg'+str(index)] = item

#         # remove first occurence of ' union '
#         sqlString = temp.replace(' union ', '', 1)
#         return sqlString, argDict

#     sqlString, argDict = createSql()
#     result = execSql(dbName, sqlString, args=argDict,
#                      isMultipleRows=True, buCode=buCode)
#     return result

# 0 means getting a tuple with autoRefNo and corresponding lastNo in tranCounter table
# autoRefNoTup = getSetAutoRefNo(valueDict, cursor, 0, buCode)
# autoRefNo = autoRefNoTup[0]
# lastNo = autoRefNoTup[1]
# to set last no in TranCounter table
# autoRefNoTup = getSetAutoRefNo(valueDict, cursor, lastNo, buCode)
# autoRefNo = autoRefNoTup[0]

# Don't delete dataframe implementation
# def format_tranHeadersWithDetails_data(data):
#     if data == []:
#         return data
#     df = pd.DataFrame(data)
#     df = df.replace({None: ''})  # None values create problem while indexing
#     pivot = pd.pivot_table(df, index=["tranHeaderId", "tranDetailsId", "autoRefNo", "tranDate", "userRefNo", "tags", "headerRemarks",
#                                       "tranTypeId", "accName", "lineRefNo", "lineRemarks", "instrNo"], columns=["dc"],
#                            values="amount", aggfunc=np.sum, fill_value=0)
#     pivot.rename(
#         columns={
#             'D': 'debits',
#             'C': 'credits'
#         },
#         inplace=True
#     )
#     pivot.sort_values(by=['tranHeaderId', 'tranDetailsId'],
#                       axis=0, ascending=[False, True], inplace=True)

#     j = pivot.to_json(orient='table')
#     jsonObj = json.loads(j)
#     dt = jsonObj["data"]
#     return dt

# def tranHeadersWithDetails_helper(tranTypeId, noOfRecords):
#     sql = allSqls['tranHeadersWithDetails']
#     # args should be tuple
#     data = execSql(DB_NAME, sql, (tranTypeId, noOfRecords,))
#     for x in data:
#         x['tranDate'] = str(x['tranDate'])  # ISO formatted date
#     dt = format_tranHeadersWithDetails_data(data)
#     return dt

# def tranHeaderAndDetails_helper(id):
#     sql1 = allSqls['tranHeader']
#     sql2 = allSqls['tranDetails']
#     dataset = execSqls(
#         DB_NAME, [('sql1', sql1, (id,)), ('sql2', sql2, (id,))]
#     )
#     data1 = dataset['sql1']
#     data2 = dataset['sql2']
#     return {"tranHeader": data1, "tranDetails": data2}

# def format_trial_balance_data(data):
#     if data == []:
#         return []
#     df = pd.DataFrame(data)
#     pivot = pd.pivot_table(df, index=["id", "accCode", "accName", "accType", "accLeaf", "parentId"], columns=["dc"],
#                            values="amount", aggfunc=np.sum, fill_value=0)
#     if 'O' not in pivot:
#         # shape[0] is no of rows in dataframe
#         pivot['O'] = [Decimal(0.00)] * pivot.shape[0]

#     if 'D' not in pivot:
#         pivot['D'] = [Decimal(0.00)] * pivot.shape[0]

#     if 'C' not in pivot:
#         pivot['C'] = [Decimal(0.00)] * pivot.shape[0]

#     pivot.rename(
#         columns={
#             'O': 'opening',
#             'D': 'debits',
#             'C': 'credits'
#         },
#         inplace=True
#     )
#     pivot['closing'] = pivot['opening'] + pivot['debits'] - pivot['credits']

#     pivot.loc['total', 'closing'] = pivot['closing'].sum()
#     pivot.loc['total', 'debits'] = pivot['debits'].sum()
#     pivot.loc['total', 'credits'] = pivot['credits'].sum()
#     pivot.loc['total', 'opening'] = pivot['opening'].sum()

#     pivot['closing_dc'] = pivot['closing'].apply(
#         lambda x: 'Dr' if x >= 0 else 'Cr')
#     pivot['closing'] = pivot['closing'].apply(
#         lambda x: x if x >= 0 else -x)  # remove minus sign

#     pivot['opening_dc'] = pivot['opening'].apply(
#         lambda x: 'Dr' if x >= 0 else 'Cr')
#     pivot['opening'] = pivot['opening'].apply(
#         lambda x: x if x >= 0 else -x)  # remove minus sign

#     pivot = pivot.reindex(
#         columns=['opening', 'opening_dc', 'debits', 'credits', 'closing', 'closing_dc'])

#     # print(pivot)
#     j = pivot.to_json(orient='table')
#     jsonObj = json.loads(j)
#     dt = jsonObj["data"]
#     return dt


# def trial_balance_helper():
#     sql = allSqls['trial_balance']
#     data = execSql(DB_NAME, sql)
#     dt = format_trial_balance_data(data)  # trial_format
#     return dt


# def subledgers_helper():
#     sql = allSqls['subledgers']
#     data = execSql(DB_NAME, sql)
#     dt = format_trial_balance_data(data)
#     return dt


# def trial_balance_subledgers_helper():
#     sql1 = allSqls['trial_balance']
#     sql2 = allSqls['subledgers']
#     dataset = execSqls(
#         DB_NAME, [('sql1', sql1, None), ('sql2', sql2, None)])
#     data1 = dataset["sql1"]
#     data2 = dataset["sql2"]
#     dt1 = format_trial_balance_data(data1)
#     dt2 = format_trial_balance_data(data2)
#     return {'trial_balance': dt1, 'subledgers': dt2}
