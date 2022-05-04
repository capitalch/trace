from flask import make_response
import pandas as pd
import io
from xlsxwriter.workbook import Workbook
import simplejson as json
import demjson
from entities.accounts.sql import allSqls
from postgres import execSql
# from psycopg2.extras import RealDictCursor, DictCursor
from entities.accounts.artifacts import getDbNameBuCodeClientIdFinYearIdBranchId


def getJsonDataMultiRows(dbName, buCode, sqlKey, valueDict):
    sqlString = allSqls[sqlKey]
    out = execSql(dbName, sqlString, args=valueDict,
                  buCode=buCode, isMultipleRows=True)
    # demjson used for proper handling of numeric and date fields. Normal json has problem
    outData = demjson.encode(out)
    return outData


def getJsonDataStringMultiRows(dbName, buCode, sqlKey, valueDict):
    jsonData = getJsonDataMultiRows(dbName, buCode, sqlKey, valueDict)
    parsed = json.loads(jsonData)  # used for pretty json
    outString = json.dumps(parsed, sort_keys=True, indent=4)
    return outString


def getJsonDataSingleRow(dbName, buCode, sqlKey, valueDict):
    sqlString = allSqls[sqlKey]
    out = execSql(dbName, sqlString, args=valueDict,
                  buCode=buCode, isMultipleRows=False)
    outData = demjson.encode(out)
    return outData


def getCsvDataString(dbName, buCode, sqlKey, valueDict):
    jsonData = getJsonDataMultiRows(dbName, buCode, sqlKey, valueDict)
    parsed = json.loads(jsonData)
    df = pd.DataFrame(data=parsed)
    csvData = df.to_csv(index=False)
    return csvData


def getXlsxDataString(dbName, buCode, sqlKey, valueDict):
    jsonData = getJsonDataMultiRows(dbName, buCode, sqlKey, valueDict)
    parsed = json.loads(jsonData)
    df = pd.DataFrame(data=parsed)
    output = io.BytesIO()
    writer = pd.ExcelWriter(output, engine='xlsxwriter')
    df.to_excel(writer, sheet_name=valueDict['name'], index=False)
    writer.close()
    output.seek(0)
    str = output.read()
    output.close()
    return str


def getFinalAccountsXlsxDataString(dbName, buCode, sqlKey, valueDict):
    jsonData = getJsonDataSingleRow(dbName, buCode, sqlKey, valueDict)
    parsed = json.loads(jsonData)
    pre = parsed['jsonResult']
    aggregates = pre['aggregates']
    profitOrLoss = pre['profitOrLoss']
    aggregates.append({'accType': 'profitOrLoss', 'amount': profitOrLoss})
    balanceSheetProfitLoss = pre['balanceSheetProfitLoss']
    for item in balanceSheetProfitLoss:        
        item['accLeaf'] = 'Yes' if ((item['accLeaf'] == 'Y') or (item['accLeaf'] == 'S')) else 'No'

    assets = filter(lambda x: x['accType'] == 'A', balanceSheetProfitLoss)
    liabilities = filter(lambda x: x['accType'] == 'L', balanceSheetProfitLoss)
    expenses = filter(lambda x: x['accType'] == 'E', balanceSheetProfitLoss)
    income = filter(lambda x: x['accType'] == 'I', balanceSheetProfitLoss)
    df1 = pd.DataFrame(data=aggregates)
    df2 = pd.DataFrame(data=liabilities)
    df3 = pd.DataFrame(data=assets)
    df4 = pd.DataFrame(data=expenses)
    df5 = pd.DataFrame(data=income)
    output = io.BytesIO()
    writer = pd.ExcelWriter(output, engine='xlsxwriter')
    df1.to_excel(writer, sheet_name='aggregates', index=False)
    df2.to_excel(writer, sheet_name='liabilities', index=False)
    df3.to_excel(writer, sheet_name='assets', index=False)
    df4.to_excel(writer, sheet_name='expenses', index=False)
    df5.to_excel(writer, sheet_name='income', index=False)
    writer.close()
    output.seek(0)
    str = output.read()
    output.close()
    return str

def getAllGstReportsXlsxDataString(dbName, buCode, sqlKey, valueDict):
    if 'startDate' not in valueDict:
        valueDict['startDate'] = '1901-01-01'
    
    if 'endDate' not in valueDict:
        valueDict['endDate'] = '2100-12-31'
        
    sqlString = allSqls[sqlKey]
    out = execSql(dbName, sqlString, args=valueDict,
                  buCode=buCode, isMultipleRows=False)
    
    pre = out['jsonResult']
    sheets = list(pre.keys()) 
    output = io.BytesIO()
    writer = pd.ExcelWriter(output, engine='xlsxwriter')
    for sheet in sheets:
        df = pd.DataFrame(pre.get(sheet))        
        df.to_excel(writer, sheet_name=sheet,
                 index=False, header=True, startrow=2)
        sheetObj = writer.sheets[sheet]
        sheetObj.write('A1', f"Gst report from {valueDict.get('startDate', '')} to {valueDict.get('endDate','')}")
    writer.close()
    output.seek(0)
    str = output.read()
    output.close()
    return str

def handleDownload(payload, args):
    dbName, buCode, clientId, finYearId, branchId = getDbNameBuCodeClientIdFinYearIdBranchId(
        payload)
    name = args['name']
    fileFormat = args['fileFormat']
    dateFormat = args['dateFormat']
    if dateFormat is None:
        dateFormat = 'YYYY-MM-DD'
    valueDict = {'clientId': clientId,
                 'finYearId': finYearId,
                 'branchId': branchId,
                 'dateFormat': dateFormat,
                 'name': name
                 }
    mimeType = mimeMap[fileFormat]
    if mimeType is None:
        mimeType = 'text/csv'
    pre = nameResolution[name][fileFormat]
    sqlKey = pre['sqlKey']
    method = pre['method']
    # args = pre.get('args', None)
    if args is not None:
        valueDict = {**valueDict, **args}  # python spread operator
    dataString = method(dbName, buCode, sqlKey, valueDict)
    dataString = '' if dataString is None else dataString
    response = make_response(dataString)
    cd = 'attachment;'
    response.headers['Content-Disposition'] = cd
    response.mimetype = mimeType
    return response


mimeMap = {
    'csv': 'text/csv',
    'json': 'application/json',
    'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'pdf': 'application/pdf'
}
nameResolution = {
    'accountsMaster': {
        'json': {
            'method': getJsonDataStringMultiRows, 'sqlKey': 'get_accountsMaster'
        },
        'csv': {
            'method': getCsvDataString, 'sqlKey': 'get_accountsMaster'
        },
        'xlsx': {
            'method': getXlsxDataString, 'sqlKey': 'get_accountsMaster'
        }
    },
    'payments': {
        'json': {
            'method': getJsonDataStringMultiRows, 'sqlKey': 'get_tranHeaders_details', 'args': {
                'tranTypeId': 2,
                "no": None
            }
        },
        'csv': {
            'method': getCsvDataString, 'sqlKey': 'get_tranHeaders_details', 'args': {
                'tranTypeId': 2,
                "no": None
            }
        },
        'xlsx': {
            'method': getXlsxDataString, 'sqlKey': 'get_tranHeaders_details', 'args': {
                'tranTypeId': 2,
                "no": None
            }
        }
    },
    'receipts': {
        'json': {
            'method': getJsonDataStringMultiRows, 'sqlKey': 'get_tranHeaders_details', 'args': {
                'tranTypeId': 3,
                "no": None
            }
        },
        'csv': {
            'method': getCsvDataString, 'sqlKey': 'get_tranHeaders_details', 'args': {
                'tranTypeId': 3,
                "no": None
            }
        },
        'xlsx': {
            'method': getXlsxDataString, 'sqlKey': 'get_tranHeaders_details', 'args': {
                'tranTypeId': 3,
                "no": None
            }
        }
    },
    'contra': {
        'json': {
            'method': getJsonDataStringMultiRows, 'sqlKey': 'get_tranHeaders_details', 'args': {
                'tranTypeId': 6,
                "no": None
            }
        },
        'csv': {
            'method': getCsvDataString, 'sqlKey': 'get_tranHeaders_details', 'args': {
                'tranTypeId': 6,
                "no": None
            }
        },
        'xlsx': {
            'method': getXlsxDataString, 'sqlKey': 'get_tranHeaders_details', 'args': {
                'tranTypeId': 6,
                "no": None
            }
        }
    },
    'journals': {
        'json': {
            'method': getJsonDataStringMultiRows, 'sqlKey': 'get_tranHeaders_details', 'args': {
                'tranTypeId': 1,
                "no": None
            }
        },
        'csv': {
            'method': getCsvDataString, 'sqlKey': 'get_tranHeaders_details', 'args': {
                'tranTypeId': 1,
                "no": None
            }
        },
        'xlsx': {
            'method': getXlsxDataString, 'sqlKey': 'get_tranHeaders_details', 'args': {
                'tranTypeId': 1,
                "no": None
            }
        }
    },
    'allVouchers': {
        'json': {
            'method': getJsonDataStringMultiRows, 'sqlKey': 'get_allTransactions_download'
        },
        'csv': {
            'method': getCsvDataString, 'sqlKey': 'get_allTransactions_download'
        },
        'xlsx': {
            'method': getXlsxDataString, 'sqlKey': 'get_allTransactions_download'
        }
    },
    'trialBalance': {
        'json': {
            'method': getJsonDataStringMultiRows, 'sqlKey': 'get_trialBalance'
        },
        'csv': {
            'method': getCsvDataString, 'sqlKey': 'get_trialBalance'
        },
        'xlsx': {
            'method': getXlsxDataString, 'sqlKey': 'get_trialBalance'
        }
    },
    'finalAccounts': {
        'json': {
            'method': getJsonDataStringMultiRows, 'sqlKey': 'get_balanceSheetProfitLoss'
        },
        'csv': {
            'method': getCsvDataString, 'sqlKey': 'get_balanceSheetProfitLoss'
        },
        'xlsx': {
            'method': getFinalAccountsXlsxDataString, 'sqlKey': 'get_balanceSheetProfitLoss'
        }
    },
    'gstReports': {
        'json': {
            'method': getJsonDataStringMultiRows, 'sqlKey': 'getJson_all_gst_reports'
        },
        'csv': {
            'method': getCsvDataString, 'sqlKey': 'getJson_all_gst_reports'
        },
        'xlsx': {
            'method': getAllGstReportsXlsxDataString, 'sqlKey': 'getJson_all_gst_reports'
        }
    }
}
