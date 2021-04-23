import psycopg2
import simplejson as json
from itertools import repeat
from util import getschemaSearchPath
# from entities.accounts.sql import allSqls


def getInsertSql(data, tableName, fkeyName, fkeyValue):
    fieldsList = list(data.keys())
    if fkeyName and fkeyValue:
        fieldsList.append(fkeyName)

    fieldsCount = len(fieldsList)
    fieldsString = '"{0}"'.format('", "'.join(
        fieldsList))  # surround fields with ""
    placeholdersForValues = ', '.join(list(repeat('%s', fieldsCount)))

    valuesList = list(data.values())
    if fkeyName and fkeyValue:
        valuesList.append(fkeyValue)
    valuesTuple = tuple(valuesList)
    sql = f'''insert into "{tableName}"
    ({fieldsString}) values({placeholdersForValues}) returning id
    '''
    return(sql, valuesTuple)

def getUpdateSql(data, tableName):    
    def getUpdateKeyValues(dataCopy):
        idValue = dataCopy['id']
        dataCopy.pop('id') # remove id property
        str = ''
        for it in dataCopy:
            str = str + f''' "{it}" = %s, '''
        str = (str.strip())[:-1] # strip last comma
        valuesList = list(dataCopy.values())
        valuesTuple = tuple(valuesList)
        return(str, valuesTuple)

    str, valuesTuple = getUpdateKeyValues(data.copy())
    sql = f'''update "{tableName}" set {str}
        where id = {data['id']} returning {"id"}
    '''
    return(sql, valuesTuple)

def getSql(sqlObject, data, fkeyValue):
    sql = None
    valuesTuple = None
    updateCodeBlock = sqlObject.get('updateCodeBlock', None)
    customCodeBlock = sqlObject.get('customCodeBlock', None)
    if customCodeBlock is not None:
        sql, valuesTuple = (customCodeBlock, data)
    elif 'id' in data and data['id'] is not None:
        if updateCodeBlock is not None:
            sql, valuesTuple = (updateCodeBlock, data)
        elif sqlObject.get('idInsert'):
            sql, valuesTuple = getInsertSql(data.copy(), sqlObject.get('tableName'),sqlObject.get('fkeyName'), fkeyValue )
        else: 
            sql, valuesTuple = getUpdateSql(data, sqlObject.get('tableName'))
    else:
        sql, valuesTuple = getInsertSql(data.copy(), sqlObject.get('tableName'), sqlObject.get('fkeyName'), fkeyValue)
    return(sql, valuesTuple)

def processData(sqlObject, cursor,data, fkeyValue, buCode='public'):
    details = None
    id = None
    searchPathSql = getschemaSearchPath(buCode)
    if('details' in data):
        details = data.pop('details')
    sql, tup = getSql(sqlObject, data, fkeyValue)
    if sql is not None:
        try:
            # cursor.execute(sql, tup)
            cursor.execute(f'{searchPathSql};{sql}', tup)
            try:
                if cursor.rowcount > 0:
                    record = cursor.fetchone()
                    id = record[0]
            except(Exception) as err:
                pass # suck the exception
        except (Exception) as error:
            print(error)
            raise Exception(error)
    
    if details:
        if type(details) is list:
            for det in details:
                execSqlObject(det, cursor, id, buCode)
        else:
            execSqlObject(details, cursor, id, buCode)


def execSqlObject(sqlObject, cursor, fkeyValue=None, buCode='public'):
    tableName = sqlObject.get("tableName")
    updateCodeBlock =  sqlObject.get('updateCodeBlock') #returns None if key not present in dict  #sqlObject["updateCodeBlock"]
    deletedIds = None
    customCodeBlock = sqlObject.get('customCodeBlock')
    idInsert = sqlObject.get('idInsert', False) #idInsert is True when id value is there and you want to do insert operation instead of update
    if 'deletedIds' in sqlObject:
        deletedIdList = sqlObject['deletedIds']
        searchPathSql = getschemaSearchPath(buCode)
        ret = '('
        for x in deletedIdList:
            ret = ret + str(x) + ','
        ret = ret.rstrip(',') + ')'
        sql =  f'''{searchPathSql}; delete from "{tableName}" where id in{ret}'''
        cursor.execute(sql)
    fkeyName = None
    if 'fkeyName' in sqlObject:
        fkeyName = sqlObject["fkeyName"]
    data = sqlObject.get('data', None)
    if data:
        if type(data) is list:
            for dt in data:                
                processData(sqlObject, cursor, dt, fkeyValue, buCode)
        else:           
            processData(sqlObject, cursor, data, fkeyValue, buCode)
    return True


# older code
# processData(dt, tableName, fkeyName, fkeyValue, updateCodeBlock, cursor, idInsert)
# processData(data, tableName, fkeyName, fkeyValue, updateCodeBlock, cursor, idInsert)
# def getSql2(data, tableName, fkeyName, fkeyValue, updateCodeBlock, idInsert):
#     sql=None
#     valuesTuple=None
#     if 'id' in data and data['id'] is not None:
#         if updateCodeBlock is not None:
#             sql, valuesTuple = getUpdateCodeBlockSql(updateCodeBlock, data)
#         elif idInsert:
#             sql, valuesTuple = getInsertSql(data.copy(), tableName, fkeyName, fkeyValue)
#         else:
#             sql, valuesTuple = getUpdateSql(data, tableName)
#     else:
#         sql, valuesTuple = getInsertSql(data.copy(), tableName, fkeyName, fkeyValue)
#     return(sql, valuesTuple)

# def processData2(data, tableName, fkeyName, fkeyValue, updateCodeBlock, cursor, idInsert = False):
#     details = None
#     id = None
#     if 'details' in data:
#         # removes details from data, to create sql out of that
#         details = data.pop('details')

#     sql, tup = getSql2(data, tableName, fkeyName, fkeyValue, updateCodeBlock, idInsert)
#     if sql is not None:
#         try:
#             cursor.execute(sql, tup)
#             if(cursor.rowcount > 0):                
#                 record = cursor.fetchone()
#                 id = record[0]
#                 # return id # You cannot return id. If you do so then details will not be processed based on fkey
#         except (Exception) as error:
#             raise Exception(error)

#     if details:
#         if type(details) is list:
#             for det in details:
#                 execSqlObject(det, cursor, id)
#         else:
#             execSqlObject(details, cursor, id)