import psycopg2
import simplejson as json
from itertools import repeat
from util import getschemaSearchPath

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
        dataCopy.pop('id')  # remove id property
        str = ''
        for it in dataCopy:
            str = str + f''' "{it}" = %s, '''
        str = (str.strip())[:-1]  # strip last comma
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
    insertCodeBlock = sqlObject.get('insertCodeBlock', None)
    if customCodeBlock is not None:
        sql, valuesTuple = (customCodeBlock, data)
    elif 'id' in data and data['id'] is not None and data['id'] != '':
        if updateCodeBlock is not None:
            sql, valuesTuple = (updateCodeBlock, data)
        elif sqlObject.get('idInsert'):
            sql, valuesTuple = getInsertSql(data.copy(), sqlObject.get(
                'tableName'), sqlObject.get('fkeyName'), fkeyValue)
        else:
            sql, valuesTuple = getUpdateSql(data, sqlObject.get('tableName'))
    else:
        if(insertCodeBlock):
            sql, valuesTuple = (insertCodeBlock, data)
        else:
            sql, valuesTuple = getInsertSql(data.copy(), sqlObject.get(
                'tableName'), sqlObject.get('fkeyName'), fkeyValue)
    return(sql, valuesTuple)

def processData(sqlObject, cursor, data, fkeyValue, buCode='public'):
    details = None
    id = None
    searchPathSql = getschemaSearchPath(buCode)
    if('details' in data):
        details = data.pop('details')
    sql, tup = getSql(sqlObject, data, fkeyValue)
    if sql is not None:
        try:
            cursor.execute(f'{searchPathSql};{sql}', tup)
            try:
                if cursor.rowcount > 0:
                    record = cursor.fetchone()
                    id = record[0]
                    # return(id)
            except(Exception) as err:
                pass  # suck the exception
        except (Exception) as error:
            print(error)
            raise Exception(error)

    if details:
        if type(details) is list:
            for det in details:
                execSqlObject(det, cursor, id, buCode)
        else:
            execSqlObject(details, cursor, id, buCode)
    # Following two lines are new and need testing
    # else:
    return id

def execSqlObject(sqlObject, cursor, fkeyValue=None, buCode='public'):
    ret = None
    try:
        tableName = sqlObject.get("tableName")
        # updateCodeBlock =  sqlObject.get('updateCodeBlock') #returns None if key not present in dict  #sqlObject["updateCodeBlock"]
        # deletedIds = None
        # customCodeBlock = sqlObject.get('customCodeBlock')
        # idInsert = sqlObject.get('idInsert', False) #idInsert is True when id value is there and you want to do insert operation instead of update
        if 'deletedIds' in sqlObject:
            deletedIdList = sqlObject['deletedIds']
            searchPathSql = getschemaSearchPath(buCode)
            ret = '('
            for x in deletedIdList:
                ret = ret + str(x) + ','
            ret = ret.rstrip(',') + ')'
            sql = f'''{searchPathSql}; delete from "{tableName}" where id in{ret}'''
            cursor.execute(sql)
        # fkeyName = None
        # if 'fkeyName' in sqlObject:
            # fkeyName = sqlObject["fkeyName"]
        data = sqlObject.get('data', None)
        if data:
            if type(data) is list:
                for dt in data:
                    ret = processData(sqlObject, cursor, dt, fkeyValue, buCode)
            else:
                ret1 = processData(sqlObject, cursor, data, fkeyValue, buCode)
                if(ret is None):
                    ret = ret1
        if ret is None:
            ret = True
    except (Exception) as error:
        print(error)
        raise Exception(error)
    return ret
